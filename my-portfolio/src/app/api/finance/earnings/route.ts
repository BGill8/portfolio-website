import { NextRequest, NextResponse } from 'next/server';
import {
  SEED_CALLS,
  SEED_CORRELATION_STATS,
  SentenceSentiment,
  ToneMetrics,
} from '@/lib/earnings';

const FASTAPI_BASE_URL = process.env.FASTAPI_URL || 'http://127.0.0.1:8000';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || 'call';
  const ticker = (searchParams.get('ticker') || 'NVDA').toUpperCase();
  const quarter = searchParams.get('quarter') || '';

  // 1. Correlation stats
  if (action === 'correlation') {
    try {
      const res = await fetch(`${FASTAPI_BASE_URL}/api/v1/alpha/correlation`, {
        signal: AbortSignal.timeout(1500),
      });
      if (res.ok) {
        const data = await res.json();
        return NextResponse.json({ ...data, source: 'fastapi' });
      }
    } catch {
      // Fallback to pre-computed seed stats
    }
    return NextResponse.json({ ...SEED_CORRELATION_STATS, source: 'cached' });
  }

  // 2. List calls
  if (action === 'calls') {
    try {
      const res = await fetch(`${FASTAPI_BASE_URL}/api/v1/earnings/calls`, {
        signal: AbortSignal.timeout(1500),
      });
      if (res.ok) {
        const data = await res.json();
        return NextResponse.json({ calls: data, source: 'fastapi' });
      }
    } catch {
      // Fallback
    }
    const seedSummaries = Object.values(SEED_CALLS).map((c) => ({
      id: c.id,
      ticker: c.ticker,
      company_name: c.company_name,
      quarter: c.quarter,
      date: c.date,
      fiscal_year: c.fiscal_year,
      timing: c.timing,
      net_sentiment: c.tone_metrics.net_sentiment,
      z_score_trailing_4q: c.tone_metrics.z_score_trailing_4q,
      car_t_plus_1: c.pead_metrics.car_t_plus_1,
      key_theme: c.summary_takeaways[0] || '',
    }));
    return NextResponse.json({ calls: seedSummaries, source: 'cached' });
  }

  // 3. Specific Call Detail
  try {
    const qParam = quarter ? `/${encodeURIComponent(quarter)}` : '/Q3-2025';
    const res = await fetch(`${FASTAPI_BASE_URL}/api/v1/earnings/${ticker}${qParam}`, {
      signal: AbortSignal.timeout(1500),
    });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({ ...data, source: 'fastapi' });
    }
  } catch {
    // Fallback
  }

  // Return seed data if ticker matches
  const fallback = SEED_CALLS[ticker] || SEED_CALLS['NVDA'];
  return NextResponse.json({ ...fallback, source: 'cached' });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { transcript_text, ticker = 'CUSTOM' } = body;

    // Try FastAPI endpoint first
    try {
      const res = await fetch(`${FASTAPI_BASE_URL}/api/v1/analyze/transcript`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker, transcript_text }),
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        const data = await res.json();
        return NextResponse.json({ ...data, source: 'fastapi' });
      }
    } catch {
      // Fallback to local serverless tokenizer & tone scorer
    }

    // Serverless fallback scoring
    const text: string = transcript_text || '';
    const rawSentences = text
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 10);

    const posWords = ['record', 'strong', 'growth', 'beat', 'accelerate', 'profit', 'expansion', 'exceeded', 'demand', 'robust'];
    const negWords = ['headwind', 'decline', 'drop', 'sluggish', 'weak', 'risk', 'uncertainty', 'pressure', 'delay', 'loss'];

    let posCount = 0;
    let negCount = 0;

    const sentences: SentenceSentiment[] = rawSentences.map((s, idx) => {
      const lower = s.toLowerCase();
      const hasPos = posWords.some((w) => lower.includes(w));
      const hasNeg = negWords.some((w) => lower.includes(w));
      const isFls = /\b(will|expect|guidance|target|project|anticipate|aim)\b/i.test(lower);
      const isUncertain = /\b(cautious|uncertain|volatility|maybe|headwind)\b/i.test(lower);

      let label: 'positive' | 'negative' | 'neutral' = 'neutral';
      let score = 0.75;
      let posProb = 0.15;
      let negProb = 0.10;

      if (hasPos && !hasNeg) {
        label = 'positive';
        score = 0.88;
        posProb = 0.88;
        negProb = 0.04;
        posCount++;
      } else if (hasNeg && !hasPos) {
        label = 'negative';
        score = 0.82;
        negProb = 0.82;
        posProb = 0.05;
        negCount++;
      }

      return {
        id: idx + 1,
        sentence: s,
        speaker: 'Executive',
        speaker_role: 'EXECUTIVE',
        section: lower.includes('question') ? 'QA_SESSION' : 'PREPARED_REMARKS',
        label,
        score,
        positive_prob: posProb,
        negative_prob: negProb,
        neutral_prob: Math.max(0, 1 - (posProb + negProb)),
        is_forward_looking: isFls,
        uncertainty_score: isUncertain ? 0.25 : 0.0,
      };
    });

    const total = Math.max(sentences.length, 1);
    const netSentiment = Number(((posCount - negCount) / total).toFixed(3));

    const toneMetrics: ToneMetrics = {
      net_sentiment: netSentiment,
      prepared_remarks_sentiment: netSentiment,
      qa_sentiment: netSentiment,
      divergence_delta: 0.0,
      forward_guidance_score: netSentiment,
      uncertainty_index: 0.15,
      z_score_trailing_4q: Number((netSentiment / 0.2).toFixed(2)),
      positive_ratio: Number((posCount / total).toFixed(3)),
      negative_ratio: Number((negCount / total).toFixed(3)),
      neutral_ratio: Number(((total - posCount - negCount) / total).toFixed(3)),
      speaker_summaries: [
        {
          speaker: 'Executive',
          role: 'EXECUTIVE',
          sentence_count: total,
          net_sentiment: netSentiment,
          positive_count: posCount,
          negative_count: negCount,
          neutral_count: total - posCount - negCount,
          uncertainty_ratio: 0.15,
        },
      ],
    };

    return NextResponse.json({
      status: 'success',
      ticker,
      sentence_count: sentences.length,
      tone_metrics: toneMetrics,
      sentences,
      source: 'serverless-fallback',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
