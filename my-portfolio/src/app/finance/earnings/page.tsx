'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  BarChart3,
  TrendingUp,
  Activity,
  Cpu,
  Sliders,
  Search,
  Layers,
  Zap,
  FileText,
  User,
  RefreshCw,
  Code,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import {
  SEED_CALLS,
  SEED_CORRELATION_STATS,
  EarningsCallDetail,
  SentenceSentiment,
} from '@/lib/earnings';

const TICKER_OPTIONS = [
  { symbol: 'NVDA', name: 'NVIDIA', quarter: 'Q3 FY25', tag: 'Blackwell GPU Ramp', badge: 'Tech / Semis' },
  { symbol: 'TSLA', name: 'Tesla', quarter: 'Q3 2024', tag: 'Autonomy & Margin Beat', badge: 'Auto / AI' },
  { symbol: 'AAPL', name: 'Apple', quarter: 'Q4 FY24', tag: 'Apple Intelligence & Services', badge: 'Consumer / Big Tech' },
  { symbol: 'MSFT', name: 'Microsoft', quarter: 'Q1 FY25', tag: 'Azure AI vs Capex Shock', badge: 'Cloud / AI' },
];

export default function EarningsAlphaEnginePage() {
  const [activeTicker, setActiveTicker] = useState<string>('NVDA');
  const [activeTab, setActiveTab] = useState<'chart' | 'pead' | 'correlation'>('chart');
  const [sectionFilter, setSectionFilter] = useState<'ALL' | 'PREPARED_REMARKS' | 'QA_SESSION'>('ALL');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'CEO' | 'CFO' | 'ANALYST'>('ALL');
  const [sentimentFilter, setSentimentFilter] = useState<'ALL' | 'positive' | 'negative' | 'guidance'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Custom analysis state
  const [showCustomModal, setShowCustomModal] = useState<boolean>(false);
  const [customText, setCustomText] = useState<string>(
    'Blackwell computing platforms are entering high-volume ramp with extraordinary customer demand. While initial packaging transitions will temporarily compress gross margins by 150 basis points, we anticipate operating margins to comfortably expand toward 75% in the second half.'
  );
  const [customLoading, setCustomLoading] = useState<boolean>(false);
  const [customResult, setCustomResult] = useState<SentenceSentiment[] | null>(null);

  // Active call detail
  const call: EarningsCallDetail = SEED_CALLS[activeTicker] || SEED_CALLS['NVDA'];
  const correlation = SEED_CORRELATION_STATS;

  // Filtered sentences
  const filteredSentences = useMemo(() => {
    return call.sentences.filter((s) => {
      if (sectionFilter !== 'ALL' && s.section !== sectionFilter) return false;
      if (roleFilter !== 'ALL' && s.speaker_role !== roleFilter) return false;
      if (sentimentFilter === 'positive' && s.label !== 'positive') return false;
      if (sentimentFilter === 'negative' && s.label !== 'negative') return false;
      if (sentimentFilter === 'guidance' && !s.is_forward_looking) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          s.sentence.toLowerCase().includes(q) ||
          s.speaker.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [call, sectionFilter, roleFilter, sentimentFilter, searchQuery]);

  // Handle custom transcript analysis
  const handleAnalyzeCustom = async () => {
    setCustomLoading(true);
    try {
      const res = await fetch('/api/finance/earnings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker: 'CUSTOM', transcript_text: customText }),
      });
      const data = await res.json();
      if (data.sentences) {
        setCustomResult(data.sentences);
      }
    } catch {
      // Fallback
    } finally {
      setCustomLoading(false);
    }
  };

  // Price chart calculations
  const priceMin = Math.min(...call.price_history.map((p) => p.low)) * 0.98;
  const priceMax = Math.max(...call.price_history.map((p) => p.high)) * 1.02;
  const priceRange = Math.max(priceMax - priceMin, 1);
  const volMax = Math.max(...call.price_history.map((p) => p.volume));

  return (
    <div className="min-h-screen bg-[#131111] text-[#cfcecd]">
      {/* Header & Breadcrumb */}
      <header className="border-b border-[#2e2c2c] bg-[#131111] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-1.5 rounded-[2px] border border-[#2e2c2c] text-[#8e8b8b] hover:text-white hover:border-[#3b3939] transition"
              title="Return to Portfolio"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="h-4 w-px bg-[#2e2c2c]" />
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded-[2px] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                QUANT LABS
              </span>
              <span className="text-[#656363] text-xs font-mono">/</span>
              <span className="text-xs font-mono text-[#8e8b8b]">EARNINGS ALPHA ENGINE</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 font-mono text-xs">
            <Link
              href="/finance/dcf"
              className="font-medium text-[#cfcecd] hover:text-white px-3 py-1.5 rounded-[2px] border border-[#2e2c2c] hover:border-[#3b3939] bg-[#171616] transition flex items-center gap-1.5"
            >
              <Sliders className="w-3.5 h-3.5 text-blue-400" />
              <span>DCF Valuation</span>
            </Link>
            <button
              onClick={() => setShowCustomModal(true)}
              className="font-medium text-[#131111] px-3.5 py-1.5 rounded-[2px] bg-white hover:bg-[#e1dfdd] transition flex items-center gap-1.5 cursor-pointer font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#131111]" />
              <span>Test Custom Transcript</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Section */}
        <section className="space-y-3">
          <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-[2px] text-xs font-mono text-[#8e8b8b] bg-[#171616] border border-[#2e2c2c]">
            <Cpu className="w-3.5 h-3.5 text-[#8e8b8b]" />
            <span>FINBERT NLP • PEAD ANOMALY DETECTION • INSTITUTIONAL ALPHA</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Real-Time Earnings Sentiment & Market Alpha Engine
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 max-w-3xl leading-relaxed">
            Extracting structured financial intelligence from unstructured corporate communications.
            Scoring executive tone shifts across unscripted Q&A versus scripted prepared remarks,
            and correlating sentiment anomalies against Post-Earnings Announcement Drift (PEAD).
          </p>
        </section>

        {/* Flagship Ticker Bar */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-neutral-400" />
              <span>Monitored Flagship Releases</span>
            </span>
            <span className="text-xs text-neutral-500 font-mono">FastAPI Cache: 4 Active / 16 Quarters</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {TICKER_OPTIONS.map((t) => {
              const isSelected = activeTicker === t.symbol;
              const seedDetail = SEED_CALLS[t.symbol];
              const netSent = seedDetail?.tone_metrics.net_sentiment ?? 0;
              const carT1 = seedDetail?.pead_metrics.car_t_plus_1 ?? 0;

              return (
                <button
                  key={t.symbol}
                  onClick={() => setActiveTicker(t.symbol)}
                  className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden ${
                    isSelected
                      ? 'bg-neutral-900/90 border-indigo-500/80 shadow-lg shadow-indigo-950/40'
                      : 'bg-neutral-950/60 border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-900/40'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/10 blur-xl pointer-events-none" />
                  )}
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-white tracking-wide">{t.symbol}</span>
                      <span className="text-xs font-mono text-neutral-400 px-1.5 py-0.5 rounded bg-neutral-800/70">
                        {t.quarter}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-neutral-400">{t.badge}</span>
                  </div>

                  <p className="text-xs text-neutral-400 mb-2.5 truncate">{t.tag}</p>

                  <div className="flex items-center justify-between text-xs font-mono border-t border-neutral-800/70 pt-2">
                    <span className="text-neutral-400">
                      Tone:{' '}
                      <strong className={netSent >= 0.5 ? 'text-emerald-400' : netSent >= 0.2 ? 'text-blue-400' : 'text-rose-400'}>
                        {netSent >= 0 ? `+${netSent.toFixed(2)}` : netSent.toFixed(2)}
                      </strong>
                    </span>
                    <span className="text-neutral-400">
                      CAR T+1:{' '}
                      <strong className={carT1 >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                        {carT1 >= 0 ? `+${carT1.toFixed(1)}%` : `${carT1.toFixed(1)}%`}
                      </strong>
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* 4 Core Alpha KPI Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Net Sentiment */}
          <div className="p-4 rounded-xl border border-neutral-800/90 bg-neutral-950/70 space-y-2">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
              <span className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-indigo-400" />
                <span>NET SENTIMENT SCORE</span>
              </span>
              <span className="text-[10px] text-neutral-500">(Pos - Neg) / Total</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-black font-mono ${
                call.tone_metrics.net_sentiment >= 0.5
                  ? 'text-emerald-400'
                  : call.tone_metrics.net_sentiment >= 0.2
                  ? 'text-blue-400'
                  : 'text-rose-400'
              }`}>
                {call.tone_metrics.net_sentiment >= 0 ? `+${call.tone_metrics.net_sentiment.toFixed(2)}` : call.tone_metrics.net_sentiment.toFixed(2)}
              </span>
              <span className="text-xs text-neutral-400">/ 1.00</span>
            </div>
            <div className="space-y-1">
              <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden flex">
                <div
                  className="bg-emerald-500 h-full transition-all duration-500"
                  style={{ width: `${call.tone_metrics.positive_ratio * 100}%` }}
                />
                <div
                  className="bg-neutral-600 h-full transition-all duration-500"
                  style={{ width: `${call.tone_metrics.neutral_ratio * 100}%` }}
                />
                <div
                  className="bg-rose-500 h-full transition-all duration-500"
                  style={{ width: `${call.tone_metrics.negative_ratio * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-neutral-400">
                <span className="text-emerald-400">{(call.tone_metrics.positive_ratio * 100).toFixed(0)}% Pos</span>
                <span className="text-neutral-400">{(call.tone_metrics.neutral_ratio * 100).toFixed(0)}% Neu</span>
                <span className="text-rose-400">{(call.tone_metrics.negative_ratio * 100).toFixed(0)}% Neg</span>
              </div>
            </div>
          </div>

          {/* Card 2: Z-Score Anomaly */}
          <div className="p-4 rounded-xl border border-neutral-800/90 bg-neutral-950/70 space-y-2">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>SENTIMENT ANOMALY</span>
              </span>
              <span className="text-[10px] text-neutral-500">Trailing 4Q Z-Score</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-black font-mono ${
                call.tone_metrics.z_score_trailing_4q >= 1.0
                  ? 'text-emerald-400'
                  : call.tone_metrics.z_score_trailing_4q <= -1.0
                  ? 'text-rose-400'
                  : 'text-amber-400'
              }`}>
                {call.tone_metrics.z_score_trailing_4q >= 0
                  ? `+${call.tone_metrics.z_score_trailing_4q.toFixed(2)}σ`
                  : `${call.tone_metrics.z_score_trailing_4q.toFixed(2)}σ`}
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              {call.tone_metrics.z_score_trailing_4q >= 1.5
                ? 'Extreme Bullish Deviation vs 4Q Baseline'
                : call.tone_metrics.z_score_trailing_4q <= -1.5
                ? 'Severe Bearish Warning vs 4Q Baseline'
                : 'In-line with historical quarterly variance'}
            </p>
          </div>

          {/* Card 3: Q&A Divergence Delta */}
          <div className="p-4 rounded-xl border border-neutral-800/90 bg-neutral-950/70 space-y-2">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-purple-400" />
                <span>Q&A TONE DIVERGENCE</span>
              </span>
              <span className="text-[10px] text-neutral-500">Unscripted vs Prepared</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-black font-mono ${
                call.tone_metrics.divergence_delta >= 0.15
                  ? 'text-emerald-400'
                  : call.tone_metrics.divergence_delta <= -0.15
                  ? 'text-rose-400'
                  : 'text-neutral-200'
              }`}>
                {call.tone_metrics.divergence_delta >= 0
                  ? `+${call.tone_metrics.divergence_delta.toFixed(2)}`
                  : call.tone_metrics.divergence_delta.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
              <span>Prepared: {call.tone_metrics.prepared_remarks_sentiment.toFixed(2)}</span>
              <span>Q&A: {call.tone_metrics.qa_sentiment.toFixed(2)}</span>
            </div>
          </div>

          {/* Card 4: PEAD Day 1 CAR & Volume */}
          <div className="p-4 rounded-xl border border-neutral-800/90 bg-neutral-950/70 space-y-2">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                <span>DAY 1 ABNORMAL RETURN</span>
              </span>
              <span className="text-[10px] text-neutral-500">CAR T+1 (SPY Adj)</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-black font-mono ${
                call.pead_metrics.car_t_plus_1 >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {call.pead_metrics.car_t_plus_1 >= 0
                  ? `+${call.pead_metrics.car_t_plus_1.toFixed(2)}%`
                  : `${call.pead_metrics.car_t_plus_1.toFixed(2)}%`}
              </span>
              <span className="text-xs font-mono text-neutral-400">
                Vol Surge: <strong className="text-white">{call.pead_metrics.volume_surge_ratio}x</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800/80 text-neutral-300 border border-neutral-700/60">
                {call.pead_metrics.pead_drift_direction}
              </span>
              <span className="text-[10px] font-mono text-neutral-500">Timing: {call.timing}</span>
            </div>
          </div>
        </section>

        {/* Interactive Analytics & Chart Tabs */}
        <section className="rounded-2xl border border-neutral-800/90 bg-neutral-950/70 p-5 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800/80 pb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-400" />
              <div>
                <h2 className="text-base font-bold text-white tracking-wide">
                  Quantitative Alpha Visualizer: {call.company_name} ({call.quarter})
                </h2>
                <p className="text-xs text-neutral-400">
                  Release Date: {call.date} • Session: {call.timing} • SPY Drift Benchmark
                </p>
              </div>
            </div>

            <div className="flex items-center bg-neutral-900/90 p-1 rounded-xl border border-neutral-800">
              <button
                onClick={() => setActiveTab('chart')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  activeTab === 'chart'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Price & Sentiment Overlay
              </button>
              <button
                onClick={() => setActiveTab('pead')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  activeTab === 'pead'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                PEAD Multi-Horizon Drift
              </button>
              <button
                onClick={() => setActiveTab('correlation')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  activeTab === 'correlation'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Cross-Quarter Alpha Correlation
              </button>
            </div>
          </div>

          {/* TAB 1: Price Candlestick & Sentiment Overlay Chart */}
          {activeTab === 'chart' && (
            <div className="space-y-4">
              <div className="h-72 w-full relative flex flex-col justify-end bg-neutral-900/40 rounded-xl p-4 border border-neutral-800/60 overflow-hidden">
                {/* Background grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none p-4 opacity-20">
                  <div className="border-b border-neutral-700 w-full" />
                  <div className="border-b border-neutral-700 w-full" />
                  <div className="border-b border-neutral-700 w-full" />
                  <div className="border-b border-neutral-700 w-full" />
                </div>

                {/* SVG Line & Candlestick Simulation */}
                <svg className="w-full h-48 overflow-visible" preserveAspectRatio="none" viewBox="0 0 800 200">
                  <defs>
                    <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Price Area */}
                  {call.price_history.length > 1 && (
                    <polygon
                      points={`0,200 ${call.price_history
                        .map((p, i) => {
                          const x = (i / (call.price_history.length - 1)) * 800;
                          const y = 200 - ((p.close - priceMin) / priceRange) * 180;
                          return `${x},${y}`;
                        })
                        .join(' ')} 800,200`}
                      fill="url(#priceGradient)"
                    />
                  )}

                  {/* Price Line */}
                  {call.price_history.length > 1 && (
                    <polyline
                      fill="none"
                      stroke="#818cf8"
                      strokeWidth="2.5"
                      points={call.price_history
                        .map((p, i) => {
                          const x = (i / (call.price_history.length - 1)) * 800;
                          const y = 200 - ((p.close - priceMin) / priceRange) * 180;
                          return `${x},${y}`;
                        })
                        .join(' ')}
                    />
                  )}

                  {/* Candlestick & Event Pins */}
                  {call.price_history.map((p, i) => {
                    const x = (i / (call.price_history.length - 1)) * 800;
                    const yClose = 200 - ((p.close - priceMin) / priceRange) * 180;

                    return (
                      <g key={p.date} className="cursor-pointer group">
                        {p.is_earnings_day && (
                          <>
                            {/* Vertical marker line */}
                            <line
                              x1={x}
                              y1={0}
                              x2={x}
                              y2={200}
                              stroke="#10b981"
                              strokeWidth="2"
                              strokeDasharray="4 4"
                            />
                            {/* Earnings Badge */}
                            <rect
                              x={x - 45}
                              y={10}
                              width={90}
                              height={24}
                              rx={6}
                              fill="#064e3b"
                              stroke="#059669"
                              strokeWidth="1"
                            />
                            <text
                              x={x}
                              y={26}
                              fill="#6ee7b7"
                              fontSize="10"
                              fontFamily="monospace"
                              textAnchor="middle"
                              fontWeight="bold"
                            >
                              T_CALL ({call.timing})
                            </text>
                          </>
                        )}

                        {/* Price Dot */}
                        <circle
                          cx={x}
                          cy={yClose}
                          r={p.is_earnings_day ? 5 : 3.5}
                          fill={p.is_earnings_day ? '#10b981' : '#6366f1'}
                          stroke="#ffffff"
                          strokeWidth="1.5"
                          className="transition hover:r-6"
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* Volume Bars at Bottom */}
                <div className="h-12 w-full flex items-end justify-between gap-1 pt-2 border-t border-neutral-800/80">
                  {call.price_history.map((p) => {
                    const h = Math.max((p.volume / volMax) * 40, 4);
                    return (
                      <div
                        key={`vol-${p.date}`}
                        className={`flex-1 rounded-t transition-all ${
                          p.is_earnings_day ? 'bg-emerald-500/80' : 'bg-neutral-700/50'
                        }`}
                        style={{ height: `${h}px` }}
                        title={`${p.date}: Volume ${(p.volume / 1000000).toFixed(1)}M`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Chart Legend & Metric Summary */}
              <div className="flex flex-wrap items-center justify-between text-xs font-mono text-neutral-400 px-1">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                    <span>Adjusted Close Price</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span>Earnings Release Timestamp</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-neutral-600" />
                    <span>Trading Volume (20D Vol Surge: {call.pead_metrics.volume_surge_ratio}x)</span>
                  </span>
                </div>
                <div className="text-neutral-500">Window: T-15 to T+35 Trading Days</div>
              </div>
            </div>
          )}

          {/* TAB 2: Post-Earnings Announcement Drift (PEAD) */}
          {activeTab === 'pead' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800">
                  <span className="text-[11px] font-mono text-neutral-400">Intraday (T+0)</span>
                  <p className={`text-xl font-bold font-mono ${call.pead_metrics.t_plus_0_return >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {call.pead_metrics.t_plus_0_return >= 0 ? `+${call.pead_metrics.t_plus_0_return.toFixed(2)}%` : `${call.pead_metrics.t_plus_0_return.toFixed(2)}%`}
                  </p>
                  <span className="text-[10px] text-neutral-500 font-mono">Immediate session</span>
                </div>
                <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800">
                  <span className="text-[11px] font-mono text-neutral-400">Day 1 Shock (T+1)</span>
                  <p className={`text-xl font-bold font-mono ${call.pead_metrics.t_plus_1_return >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {call.pead_metrics.t_plus_1_return >= 0 ? `+${call.pead_metrics.t_plus_1_return.toFixed(2)}%` : `${call.pead_metrics.t_plus_1_return.toFixed(2)}%`}
                  </p>
                  <span className="text-[10px] text-neutral-500 font-mono">CAR: {call.pead_metrics.car_t_plus_1.toFixed(2)}%</span>
                </div>
                <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800">
                  <span className="text-[11px] font-mono text-neutral-400">Week 1 Drift (T+5)</span>
                  <p className={`text-xl font-bold font-mono ${call.pead_metrics.t_plus_5_return >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {call.pead_metrics.t_plus_5_return >= 0 ? `+${call.pead_metrics.t_plus_5_return.toFixed(2)}%` : `${call.pead_metrics.t_plus_5_return.toFixed(2)}%`}
                  </p>
                  <span className="text-[10px] text-neutral-500 font-mono">CAR: {call.pead_metrics.car_t_plus_5.toFixed(2)}%</span>
                </div>
                <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800">
                  <span className="text-[11px] font-mono text-neutral-400">Month 1 Drift (T+30)</span>
                  <p className={`text-xl font-bold font-mono ${call.pead_metrics.t_plus_30_return >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {call.pead_metrics.t_plus_30_return >= 0 ? `+${call.pead_metrics.t_plus_30_return.toFixed(2)}%` : `${call.pead_metrics.t_plus_30_return.toFixed(2)}%`}
                  </p>
                  <span className="text-[10px] text-neutral-500 font-mono">CAR: {call.pead_metrics.car_t_plus_30.toFixed(2)}%</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800/80 space-y-2">
                <h4 className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider">
                  PEAD Quantitative Signal Diagnostics
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-neutral-500">Benchmark Drift (SPY):</span>
                    <p className="font-mono text-white font-semibold">+{call.pead_metrics.benchmark_spy_t_plus_1}% T+1</p>
                  </div>
                  <div>
                    <span className="text-neutral-500">Drift Persistence Regime:</span>
                    <p className="font-mono text-emerald-400 font-semibold">{call.pead_metrics.pead_drift_direction}</p>
                  </div>
                  <div>
                    <span className="text-neutral-500">Volume Surge Anomaly:</span>
                    <p className="font-mono text-cyan-400 font-semibold">{call.pead_metrics.volume_surge_ratio}x 20D SMA</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Cross-Quarter Alpha Correlation */}
          {activeTab === 'correlation' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800">
                  <span className="text-[10px] font-mono text-neutral-400">Pearson Correlation (r)</span>
                  <p className="text-xl font-bold font-mono text-emerald-400">+{correlation.pearson_r.toFixed(3)}</p>
                  <span className="text-[10px] text-neutral-500 font-mono">p &lt; {correlation.p_value}</span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800">
                  <span className="text-[10px] font-mono text-neutral-400">Spearman Rank (ρ)</span>
                  <p className="text-xl font-bold font-mono text-indigo-400">+{correlation.spearman_rho.toFixed(3)}</p>
                  <span className="text-[10px] text-neutral-500 font-mono">Monotonic Rank Alignment</span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800">
                  <span className="text-[10px] font-mono text-neutral-400">Directional Accuracy</span>
                  <p className="text-xl font-bold font-mono text-cyan-400">{correlation.directional_accuracy.toFixed(1)}%</p>
                  <span className="text-[10px] text-neutral-500 font-mono">Sign(Tone) == Sign(CAR)</span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800">
                  <span className="text-[10px] font-mono text-neutral-400">Historical Sample Size</span>
                  <p className="text-xl font-bold font-mono text-white">{correlation.sample_size} Quarters</p>
                  <span className="text-[10px] text-neutral-500 font-mono">Mega-Cap Tech Leaders</span>
                </div>
              </div>

              {/* Scatter Plot */}
              <div className="h-64 w-full bg-neutral-900/40 rounded-xl p-4 border border-neutral-800/60 relative overflow-hidden flex flex-col justify-between">
                <div className="flex justify-between text-[10px] font-mono text-neutral-500">
                  <span>Y-Axis: Day 1 CAR (%)</span>
                  <span>Regression Line: CAR = 0.85 + 7.42 * Z_sentiment</span>
                </div>

                <svg className="w-full h-44 overflow-visible" viewBox="0 0 600 200">
                  {/* Axes */}
                  <line x1="300" y1="0" x2="300" y2="200" stroke="#374151" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="0" y1="100" x2="600" y2="100" stroke="#374151" strokeWidth="1" strokeDasharray="3 3" />

                  {/* Trendline */}
                  <line x1="50" y1="175" x2="550" y2="25" stroke="#6366f1" strokeWidth="2" strokeDasharray="5 5" />

                  {/* Scatter Points */}
                  {correlation.points.map((pt, i) => {
                    // Map Z-score (-3 to +3) to X (0 to 600)
                    const cx = ((pt.sentiment_z_score + 3) / 6) * 600;
                    // Map CAR (-20 to +25) to Y (200 to 0)
                    const cy = 200 - ((pt.car_t_plus_1 + 20) / 45) * 200;

                    return (
                      <g key={`${pt.ticker}-${pt.quarter}-${i}`} className="group cursor-pointer">
                        <circle
                          cx={cx}
                          cy={cy}
                          r={pt.ticker === activeTicker ? 6 : 4}
                          fill={pt.car_t_plus_1 >= 0 ? '#10b981' : '#f43f5e'}
                          stroke={pt.ticker === activeTicker ? '#ffffff' : '#000000'}
                          strokeWidth="1.5"
                        />
                        <text
                          x={cx + 7}
                          y={cy - 4}
                          fill="#d1d5db"
                          fontSize="9"
                          fontFamily="monospace"
                          className="opacity-70 group-hover:opacity-100"
                        >
                          {pt.ticker} ({pt.car_t_plus_1 >= 0 ? `+${pt.car_t_plus_1}%` : `${pt.car_t_plus_1}%`})
                        </text>
                      </g>
                    );
                  })}
                </svg>

                <div className="flex justify-between text-[10px] font-mono text-neutral-500">
                  <span>-3.0σ (Bearish Sentiment Shock)</span>
                  <span>X-Axis: Sentiment Z-Score Anomaly</span>
                  <span>+3.0σ (Bullish Sentiment Shock)</span>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Executive Tone Divergence Breakdown */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-950/70 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
              <User className="w-4 h-4 text-indigo-400" />
              <span>SPEAKER TONE ATTRIBUTION</span>
            </div>
            <div className="space-y-2.5">
              {call.tone_metrics.speaker_summaries.map((spk) => (
                <div key={spk.speaker} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-white font-medium">
                      {spk.speaker} <span className="text-[10px] font-mono text-neutral-500">({spk.role})</span>
                    </span>
                    <span className={`font-mono font-bold ${spk.net_sentiment >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {spk.net_sentiment >= 0 ? `+${spk.net_sentiment.toFixed(2)}` : spk.net_sentiment.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-neutral-800 rounded-full h-1 overflow-hidden">
                    <div
                      className={`h-full ${spk.net_sentiment >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                      style={{ width: `${Math.min(Math.abs(spk.net_sentiment) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-950/70 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
              <Sliders className="w-4 h-4 text-purple-400" />
              <span>SECTION DIVERGENCE GAP</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Institutional quants prioritize unscripted Q&A over lawyer-reviewed Prepared Remarks.
              A positive divergence ({call.tone_metrics.divergence_delta >= 0 ? `+${call.tone_metrics.divergence_delta}` : call.tone_metrics.divergence_delta})
              reveals executive resilience under unscripted analyst cross-examination.
            </p>
            <div className="p-2.5 rounded-lg bg-neutral-900/80 border border-neutral-800 text-xs font-mono space-y-1">
              <div className="flex justify-between">
                <span className="text-neutral-500">Prepared Remarks:</span>
                <span className="text-neutral-200">+{call.tone_metrics.prepared_remarks_sentiment.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Unscripted Q&A:</span>
                <span className="text-emerald-400">+{call.tone_metrics.qa_sentiment.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-neutral-800 pt-1 font-bold">
                <span className="text-neutral-400">Alpha Divergence Delta:</span>
                <span className={call.tone_metrics.divergence_delta >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                  {call.tone_metrics.divergence_delta >= 0 ? `+${call.tone_metrics.divergence_delta.toFixed(2)}` : call.tone_metrics.divergence_delta.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-950/70 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>FORWARD GUIDANCE & UNCERTAINTY</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Linguistic hedging density measures corporate evasion and uncertainty (e.g. &quot;cautious&quot;, &quot;headwinds&quot;, &quot;unclear&quot;).
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 rounded bg-neutral-900/60 border border-neutral-800">
                <span className="text-[10px] text-neutral-500">Guidance Score</span>
                <p className="font-bold text-emerald-400">+{call.tone_metrics.forward_guidance_score.toFixed(2)}</p>
              </div>
              <div className="p-2 rounded bg-neutral-900/60 border border-neutral-800">
                <span className="text-[10px] text-neutral-500">Uncertainty Ratio</span>
                <p className="font-bold text-amber-400">{(call.tone_metrics.uncertainty_index * 100).toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </section>

        {/* Synchronized Interactive Transcript Reader */}
        <section className="rounded-2xl border border-neutral-800/90 bg-neutral-950/70 p-5 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800/80 pb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="text-base font-bold text-white tracking-wide">
                  Synchronized Sentence-Level Transcript Reader
                </h3>
                <p className="text-xs text-neutral-400">
                  ProsusAI/FinBERT tone classification with speaker attribution & guidance detection
                </p>
              </div>
            </div>

            {/* Live Search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search transcript..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Section filters */}
            <div className="flex items-center gap-1 bg-neutral-900/80 p-1 rounded-lg border border-neutral-800">
              <button
                onClick={() => setSectionFilter('ALL')}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition ${
                  sectionFilter === 'ALL' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                All Sections
              </button>
              <button
                onClick={() => setSectionFilter('PREPARED_REMARKS')}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition ${
                  sectionFilter === 'PREPARED_REMARKS' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Prepared Remarks
              </button>
              <button
                onClick={() => setSectionFilter('QA_SESSION')}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition ${
                  sectionFilter === 'QA_SESSION' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Q&A Session
              </button>
            </div>

            {/* Speaker Role filters */}
            <div className="flex items-center gap-1 bg-neutral-900/80 p-1 rounded-lg border border-neutral-800">
              <button
                onClick={() => setRoleFilter('ALL')}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition ${
                  roleFilter === 'ALL' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                All Roles
              </button>
              <button
                onClick={() => setRoleFilter('CEO')}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition ${
                  roleFilter === 'CEO' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                CEO Only
              </button>
              <button
                onClick={() => setRoleFilter('CFO')}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition ${
                  roleFilter === 'CFO' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                CFO Only
              </button>
              <button
                onClick={() => setRoleFilter('ANALYST')}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition ${
                  roleFilter === 'ANALYST' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Analysts
              </button>
            </div>

            {/* Sentiment tone filter */}
            <div className="flex items-center gap-1 bg-neutral-900/80 p-1 rounded-lg border border-neutral-800">
              <button
                onClick={() => setSentimentFilter('ALL')}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition ${
                  sentimentFilter === 'ALL' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                All Tone
              </button>
              <button
                onClick={() => setSentimentFilter('positive')}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition ${
                  sentimentFilter === 'positive' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Positive
              </button>
              <button
                onClick={() => setSentimentFilter('negative')}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition ${
                  sentimentFilter === 'negative' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Negative
              </button>
              <button
                onClick={() => setSentimentFilter('guidance')}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition ${
                  sentimentFilter === 'guidance' ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Guidance / FLS
              </button>
            </div>
          </div>

          {/* Sentences List */}
          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {filteredSentences.length === 0 ? (
              <div className="py-12 text-center text-neutral-500 font-mono text-xs">
                No sentences match current filter criteria.
              </div>
            ) : (
              filteredSentences.map((s) => (
                <div
                  key={s.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    s.label === 'positive'
                      ? 'bg-emerald-950/15 border-emerald-900/40 hover:border-emerald-700/60'
                      : s.label === 'negative'
                      ? 'bg-rose-950/15 border-rose-900/40 hover:border-rose-700/60'
                      : 'bg-neutral-900/30 border-neutral-800/70 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white tracking-wide">{s.speaker}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700/50">
                        {s.speaker_role}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-500">
                        {s.section === 'QA_SESSION' ? '• Q&A Session' : '• Prepared Remarks'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] font-mono">
                      {s.is_forward_looking && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-800/70">
                          Guidance (FLS)
                        </span>
                      )}
                      {s.uncertainty_score > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-800/70">
                          Hedged
                        </span>
                      )}
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold uppercase ${
                          s.label === 'positive'
                            ? 'bg-emerald-900/80 text-emerald-200 border border-emerald-700'
                            : s.label === 'negative'
                            ? 'bg-rose-900/80 text-rose-200 border border-rose-700'
                            : 'bg-neutral-800 text-neutral-300 border border-neutral-700'
                        }`}
                      >
                        {s.label} ({(s.score * 100).toFixed(0)}%)
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-sans">{s.sentence}</p>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Phase 2 Quant Alpha Scaffold Banner (Dedicated for Brandon) */}
        <section className="p-5 rounded-2xl border border-indigo-800/70 bg-gradient-to-r from-indigo-950/40 via-neutral-900/60 to-purple-950/30 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-indigo-400">
                <Code className="w-3.5 h-3.5" />
                <span>PHASE 2 WORKSPACE • SCAFFOLDED FOR BRANDON GILL</span>
              </div>
              <h3 className="text-lg font-bold text-white tracking-wide">
                Quantitative Alpha Engine & Multi-Factor PEAD Calibration
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 max-w-3xl leading-relaxed">
                Phase 1 (Ingestion & NLP Tokenizer), Phase 3 (FastAPI Microservice & Caching), and Phase 4 (Next.js Visualization)
                are 100% wired. The quantitative modeling files are scaffolded with clean interfaces and designated markers for Brandon:
              </p>
            </div>
            <span className="hidden sm:inline-flex px-3 py-1 rounded-full text-xs font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Ready for Quant Modeling
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-1">
              <span className="text-indigo-400 font-bold">1. backend/quant/pead.py</span>
              <p className="text-neutral-400 font-sans">
                Implement rolling OLS beta estimation (252-day SPY regression), benchmarked Cumulative Abnormal Returns ($CAR$), and half-life decay modeling.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-1">
              <span className="text-indigo-400 font-bold">2. backend/quant/alpha_engine.py</span>
              <p className="text-neutral-400 font-sans">
                Build multivariate OLS (CAR_T1 ~ beta_1 * Z_sentiment + beta_2 * Delta_QA + beta_3 * VolSurge), Heteroskedasticity-Consistent standard errors, and Long/Short quintile Sharpe metrics.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Custom Transcript Tester Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">FinBERT On-Demand Transcript Sandbox</h3>
              </div>
              <button
                onClick={() => setShowCustomModal(false)}
                className="text-neutral-400 hover:text-white text-xs font-mono"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-neutral-400">Paste corporate statement or transcript excerpt:</label>
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                rows={4}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 font-sans leading-relaxed"
              />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[11px] font-mono text-neutral-500">
                Connected to FastAPI backend or serverless edge tokenizer
              </span>
              <button
                onClick={handleAnalyzeCustom}
                disabled={customLoading}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition flex items-center gap-1.5 disabled:opacity-50"
              >
                {customLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>{customLoading ? 'Analyzing...' : 'Run FinBERT Tone Engine'}</span>
              </button>
            </div>

            {customResult && (
              <div className="space-y-2 border-t border-neutral-800 pt-3 max-h-48 overflow-y-auto">
                <span className="text-xs font-mono text-neutral-400 font-bold">Evaluated Sentences:</span>
                {customResult.map((res) => (
                  <div
                    key={res.id}
                    className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs flex items-center justify-between gap-3"
                  >
                    <span className="text-neutral-200 truncate">{res.sentence}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase shrink-0 ${
                        res.label === 'positive'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : res.label === 'negative'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'bg-neutral-800 text-neutral-300'
                      }`}
                    >
                      {res.label} ({(res.score * 100).toFixed(0)}%)
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
