/**
 * TypeScript Data Models, Sample Fixtures, and Client Layer for Earnings Alpha Engine.
 */

export type SpeakerRole = 'CEO' | 'CFO' | 'EXECUTIVE' | 'ANALYST' | 'OPERATOR' | 'OTHER';
export type SectionType = 'PREPARED_REMARKS' | 'QA_SESSION';
export type SentimentLabel = 'positive' | 'negative' | 'neutral';
export type MarketTiming = 'AMC' | 'BMO' | 'INTRADAY';

export interface SentenceSentiment {
  id: number;
  sentence: string;
  speaker: string;
  speaker_role: SpeakerRole;
  section: SectionType;
  label: SentimentLabel;
  score: number;
  positive_prob: number;
  negative_prob: number;
  neutral_prob: number;
  is_forward_looking: boolean;
  uncertainty_score: number;
}

export interface SpeakerSentimentSummary {
  speaker: string;
  role: SpeakerRole;
  sentence_count: number;
  net_sentiment: number;
  positive_count: number;
  negative_count: number;
  neutral_count: number;
  uncertainty_ratio: number;
}

export interface ToneMetrics {
  net_sentiment: number;
  prepared_remarks_sentiment: number;
  qa_sentiment: number;
  divergence_delta: number;
  forward_guidance_score: number;
  uncertainty_index: number;
  z_score_trailing_4q: number;
  positive_ratio: number;
  negative_ratio: number;
  neutral_ratio: number;
  speaker_summaries: SpeakerSentimentSummary[];
}

export interface PriceCandle {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  is_earnings_day?: boolean;
  abnormal_return?: number;
}

export interface PEADMetrics {
  announcement_timing: MarketTiming;
  t_plus_0_return: number;
  t_plus_1_return: number;
  t_plus_5_return: number;
  t_plus_30_return: number;
  benchmark_spy_t_plus_1: number;
  car_t_plus_1: number;
  car_t_plus_5: number;
  car_t_plus_30: number;
  volume_surge_ratio: number;
  pead_drift_direction: 'UPWARD_CONTINUATION' | 'DOWNWARD_DRIFT' | 'MEAN_REVERTING';
}

export interface EarningsCallDetail {
  id: string;
  ticker: string;
  company_name: string;
  quarter: string;
  date: string;
  fiscal_year: number;
  timing: MarketTiming;
  tone_metrics: ToneMetrics;
  pead_metrics: PEADMetrics;
  price_history: PriceCandle[];
  sentences: SentenceSentiment[];
  summary_takeaways: string[];
}

export interface EarningsCallSummary {
  id: string;
  ticker: string;
  company_name: string;
  quarter: string;
  date: string;
  fiscal_year: number;
  timing: MarketTiming;
  net_sentiment: number;
  z_score_trailing_4q: number;
  car_t_plus_1: number;
  key_theme: string;
}

export interface CorrelationPoint {
  ticker: string;
  quarter: string;
  date: string;
  sentiment_z_score: number;
  qa_divergence: number;
  car_t_plus_1: number;
  car_t_plus_5: number;
  volume_surge: number;
}

export interface CorrelationStats {
  pearson_r: number;
  spearman_rho: number;
  p_value: number;
  sample_size: number;
  directional_accuracy: number;
  points: CorrelationPoint[];
}

// Pre-seeded flagship earnings calls for zero-latency portfolio presentation
export const SEED_CALLS: Record<string, EarningsCallDetail> = {
  NVDA: {
    id: 'NVDA-Q3-2025',
    ticker: 'NVDA',
    company_name: 'NVIDIA Corporation',
    quarter: 'Q3 FY25',
    date: '2024-11-20',
    fiscal_year: 2025,
    timing: 'AMC',
    tone_metrics: {
      net_sentiment: 0.60,
      prepared_remarks_sentiment: 0.50,
      qa_sentiment: 0.75,
      divergence_delta: 0.25,
      forward_guidance_score: 0.45,
      uncertainty_index: 0.20,
      z_score_trailing_4q: 1.45,
      positive_ratio: 0.70,
      negative_ratio: 0.10,
      neutral_ratio: 0.20,
      speaker_summaries: [
        {
          speaker: 'Jensen Huang',
          role: 'CEO',
          sentence_count: 3,
          net_sentiment: 0.92,
          positive_count: 3,
          negative_count: 0,
          neutral_count: 0,
          uncertainty_ratio: 0.08,
        },
        {
          speaker: 'Colette Kress',
          role: 'CFO',
          sentence_count: 4,
          net_sentiment: 0.45,
          positive_count: 3,
          negative_count: 1,
          neutral_count: 0,
          uncertainty_ratio: 0.22,
        },
        {
          speaker: 'Wall Street Analysts',
          role: 'ANALYST',
          sentence_count: 3,
          net_sentiment: -0.67,
          positive_count: 0,
          negative_count: 2,
          neutral_count: 1,
          uncertainty_ratio: 0.65,
        },
      ],
    },
    pead_metrics: {
      announcement_timing: 'AMC',
      t_plus_0_return: -0.75,
      t_plus_1_return: 0.55,
      t_plus_5_return: -5.69,
      t_plus_30_return: 3.42,
      benchmark_spy_t_plus_1: 0.35,
      car_t_plus_1: 0.20,
      car_t_plus_5: -6.15,
      car_t_plus_30: 2.10,
      volume_surge_ratio: 2.15,
      pead_drift_direction: 'MEAN_REVERTING',
    },
    price_history: [
      { date: '2024-11-06', open: 139.8, high: 145.2, low: 139.5, close: 145.6, volume: 65200000 },
      { date: '2024-11-08', open: 146.0, high: 147.9, low: 145.1, close: 147.6, volume: 58400000 },
      { date: '2024-11-12', open: 146.5, high: 149.2, low: 145.8, close: 148.2, volume: 52100000 },
      { date: '2024-11-15', open: 147.8, high: 148.5, low: 141.2, close: 141.9, volume: 67400000 },
      { date: '2024-11-19', open: 142.1, high: 147.1, low: 141.5, close: 147.0, volume: 71200000 },
      { date: '2024-11-20', open: 146.5, high: 149.8, low: 144.3, close: 145.8, volume: 115400000, is_earnings_day: true, abnormal_return: -0.65 },
      { date: '2024-11-21', open: 144.2, high: 146.4, low: 138.8, close: 146.6, volume: 98500000, abnormal_return: 0.52 },
      { date: '2024-11-22', open: 146.8, high: 147.5, low: 141.0, close: 141.9, volume: 82000000, abnormal_return: -3.2 },
      { date: '2024-11-26', open: 142.5, high: 144.6, low: 137.2, close: 137.5, volume: 76000000, abnormal_return: -2.8 },
      { date: '2024-11-29', open: 138.0, high: 139.2, low: 136.5, close: 138.2, volume: 54000000, abnormal_return: 0.8 },
      { date: '2024-12-04', open: 139.5, high: 146.3, low: 138.9, close: 145.4, volume: 84000000, abnormal_return: 4.5 },
      { date: '2024-12-10', open: 146.0, high: 151.2, low: 145.5, close: 150.8, volume: 91000000, abnormal_return: 3.4 },
    ],
    sentences: [
      {
        id: 1,
        sentence: 'Revenue for the third quarter was a record $35.1 billion, up 17% sequentially and up 94% year-on-year.',
        speaker: 'Colette Kress',
        speaker_role: 'CFO',
        section: 'PREPARED_REMARKS',
        label: 'positive',
        score: 0.985,
        positive_prob: 0.985,
        negative_prob: 0.005,
        neutral_prob: 0.010,
        is_forward_looking: false,
        uncertainty_score: 0.0,
      },
      {
        id: 2,
        sentence: 'Data Center revenue reached a record $30.8 billion, driven by surging demand for Hopper architecture and initial shipments of Blackwell.',
        speaker: 'Colette Kress',
        speaker_role: 'CFO',
        section: 'PREPARED_REMARKS',
        label: 'positive',
        score: 0.962,
        positive_prob: 0.962,
        negative_prob: 0.010,
        neutral_prob: 0.028,
        is_forward_looking: false,
        uncertainty_score: 0.0,
      },
      {
        id: 3,
        sentence: 'We anticipate fourth-quarter revenue to be approximately $37.5 billion, plus or minus 2%.',
        speaker: 'Colette Kress',
        speaker_role: 'CFO',
        section: 'PREPARED_REMARKS',
        label: 'neutral',
        score: 0.780,
        positive_prob: 0.180,
        negative_prob: 0.040,
        neutral_prob: 0.780,
        is_forward_looking: true,
        uncertainty_score: 0.15,
      },
      {
        id: 4,
        sentence: 'Gross margins are projected to moderate temporarily to the low-70s range during early Blackwell ramp before returning to mid-70s.',
        speaker: 'Colette Kress',
        speaker_role: 'CFO',
        section: 'PREPARED_REMARKS',
        label: 'negative',
        score: 0.740,
        positive_prob: 0.080,
        negative_prob: 0.740,
        neutral_prob: 0.180,
        is_forward_looking: true,
        uncertainty_score: 0.25,
      },
      {
        id: 5,
        sentence: "The age of AI is in full steam, and NVIDIA's computing platform is at the absolute center of this transformation.",
        speaker: 'Jensen Huang',
        speaker_role: 'CEO',
        section: 'PREPARED_REMARKS',
        label: 'positive',
        score: 0.940,
        positive_prob: 0.940,
        negative_prob: 0.010,
        neutral_prob: 0.050,
        is_forward_looking: false,
        uncertainty_score: 0.0,
      },
      {
        id: 6,
        sentence: 'Blackwell is in full production, and demand is extraordinarily strong, outstripping our supply for several quarters.',
        speaker: 'Jensen Huang',
        speaker_role: 'CEO',
        section: 'PREPARED_REMARKS',
        label: 'positive',
        score: 0.890,
        positive_prob: 0.890,
        negative_prob: 0.060,
        neutral_prob: 0.050,
        is_forward_looking: true,
        uncertainty_score: 0.20,
      },
      {
        id: 7,
        sentence: 'Vivek Arya with Bank of America: Can you address the thermal and power challenges reported with early Blackwell GB200 server racks?',
        speaker: 'Vivek Arya',
        speaker_role: 'ANALYST',
        section: 'QA_SESSION',
        label: 'negative',
        score: 0.680,
        positive_prob: 0.050,
        negative_prob: 0.680,
        neutral_prob: 0.270,
        is_forward_looking: false,
        uncertainty_score: 0.30,
      },
      {
        id: 8,
        sentence: 'Jensen Huang: There are no structural thermal issues; we delivered 13,000 GPU samples to customers this quarter, and integration is flawless.',
        speaker: 'Jensen Huang',
        speaker_role: 'CEO',
        section: 'QA_SESSION',
        label: 'positive',
        score: 0.910,
        positive_prob: 0.910,
        negative_prob: 0.030,
        neutral_prob: 0.060,
        is_forward_looking: false,
        uncertainty_score: 0.0,
      },
      {
        id: 9,
        sentence: 'C.J. Muse with Cantor Fitzgerald: How should we think about gross margin headwinds as Blackwell manufacturing scales with TSMC CoWoS packaging?',
        speaker: 'C.J. Muse',
        speaker_role: 'ANALYST',
        section: 'QA_SESSION',
        label: 'negative',
        score: 0.720,
        positive_prob: 0.040,
        negative_prob: 0.720,
        neutral_prob: 0.240,
        is_forward_looking: true,
        uncertainty_score: 0.35,
      },
      {
        id: 10,
        sentence: 'Colette Kress: We expect initial gross margins around 71% to 72.5% in Q1, but as yields mature, we will comfortably step back to 75%.',
        speaker: 'Colette Kress',
        speaker_role: 'CFO',
        section: 'QA_SESSION',
        label: 'positive',
        score: 0.820,
        positive_prob: 0.820,
        negative_prob: 0.070,
        neutral_prob: 0.110,
        is_forward_looking: true,
        uncertainty_score: 0.15,
      },
    ],
    summary_takeaways: [
      'Record revenue of $35.1B beat consensus, but gross margin compression in early Blackwell ramp caused short-term volatility.',
      'CEO Jensen Huang demonstrated high conviction (+0.92 net tone), vigorously defending thermal dissipation and yield metrics.',
      'Q&A divergence was positive (+0.25), indicating unscripted executive resilience against tough analyst grilling.',
    ],
  },
  TSLA: {
    id: 'TSLA-Q3-2024',
    ticker: 'TSLA',
    company_name: 'Tesla, Inc.',
    quarter: 'Q3 2024',
    date: '2024-10-23',
    fiscal_year: 2024,
    timing: 'AMC',
    tone_metrics: {
      net_sentiment: 0.72,
      prepared_remarks_sentiment: 0.68,
      qa_sentiment: 0.81,
      divergence_delta: 0.13,
      forward_guidance_score: 0.85,
      uncertainty_index: 0.12,
      z_score_trailing_4q: 2.35,
      positive_ratio: 0.80,
      negative_ratio: 0.04,
      neutral_ratio: 0.16,
      speaker_summaries: [
        {
          speaker: 'Elon Musk',
          role: 'CEO',
          sentence_count: 3,
          net_sentiment: 0.88,
          positive_count: 3,
          negative_count: 0,
          neutral_count: 0,
          uncertainty_ratio: 0.15,
        },
        {
          speaker: 'Vaibhav Taneja',
          role: 'CFO',
          sentence_count: 1,
          net_sentiment: 0.91,
          positive_count: 1,
          negative_count: 0,
          neutral_count: 0,
          uncertainty_ratio: 0.0,
        },
      ],
    },
    pead_metrics: {
      announcement_timing: 'AMC',
      t_plus_0_return: -0.20,
      t_plus_1_return: 21.92,
      t_plus_5_return: 26.03,
      t_plus_30_return: 63.85,
      benchmark_spy_t_plus_1: 0.22,
      car_t_plus_1: 21.70,
      car_t_plus_5: 24.80,
      car_t_plus_30: 58.20,
      volume_surge_ratio: 3.45,
      pead_drift_direction: 'UPWARD_CONTINUATION',
    },
    price_history: [
      { date: '2024-10-15', open: 218.0, high: 222.5, low: 216.0, close: 219.5, volume: 62000000 },
      { date: '2024-10-18', open: 220.5, high: 224.0, low: 217.5, close: 220.7, volume: 58000000 },
      { date: '2024-10-22', open: 217.0, high: 219.4, low: 213.1, close: 213.6, volume: 69000000 },
      { date: '2024-10-23', open: 214.0, high: 217.2, low: 211.5, close: 213.6, volume: 94000000, is_earnings_day: true, abnormal_return: -0.2 },
      { date: '2024-10-24', open: 252.0, high: 262.5, low: 248.0, close: 260.4, volume: 224000000, abnormal_return: 21.9 },
      { date: '2024-10-25', open: 262.5, high: 273.5, low: 260.1, close: 269.2, volume: 158000000, abnormal_return: 3.3 },
      { date: '2024-10-30', open: 264.0, high: 265.5, low: 255.0, close: 257.5, volume: 98000000, abnormal_return: -4.1 },
      { date: '2024-11-06', open: 275.0, high: 289.5, low: 272.0, close: 288.5, volume: 185000000, abnormal_return: 14.7 },
      { date: '2024-11-11', open: 335.0, high: 358.6, low: 330.0, close: 350.0, volume: 240000000, abnormal_return: 8.9 },
    ],
    sentences: [
      {
        id: 1,
        sentence: 'Tesla delivered strong results in Q3 with vehicle volume growth, lower cost per vehicle, and record energy storage deployments.',
        speaker: 'Elon Musk',
        speaker_role: 'CEO',
        section: 'PREPARED_REMARKS',
        label: 'positive',
        score: 0.965,
        positive_prob: 0.965,
        negative_prob: 0.010,
        neutral_prob: 0.025,
        is_forward_looking: false,
        uncertainty_score: 0.0,
      },
      {
        id: 2,
        sentence: 'Cost of goods sold per vehicle dropped to its lowest level ever at approximately $35,100.',
        speaker: 'Vaibhav Taneja',
        speaker_role: 'CFO',
        section: 'PREPARED_REMARKS',
        label: 'positive',
        score: 0.910,
        positive_prob: 0.910,
        negative_prob: 0.020,
        neutral_prob: 0.070,
        is_forward_looking: false,
        uncertainty_score: 0.0,
      },
      {
        id: 3,
        sentence: 'Looking to next year, my best guess is 20% to 30% vehicle growth in 2025 notwithstanding significant geopolitical headwinds.',
        speaker: 'Elon Musk',
        speaker_role: 'CEO',
        section: 'PREPARED_REMARKS',
        label: 'positive',
        score: 0.880,
        positive_prob: 0.880,
        negative_prob: 0.050,
        neutral_prob: 0.070,
        is_forward_looking: true,
        uncertainty_score: 0.25,
      },
      {
        id: 4,
        sentence: 'Pierre Ferragu with New Street: What is your timeline for unsupervised Full Self-Driving commercial operations in Texas and California?',
        speaker: 'Pierre Ferragu',
        speaker_role: 'ANALYST',
        section: 'QA_SESSION',
        label: 'neutral',
        score: 0.820,
        positive_prob: 0.100,
        negative_prob: 0.080,
        neutral_prob: 0.820,
        is_forward_looking: true,
        uncertainty_score: 0.10,
      },
      {
        id: 5,
        sentence: 'Elon Musk: We expect to have unsupervised FSD carrying paying customers in Texas and California starting next year.',
        speaker: 'Elon Musk',
        speaker_role: 'CEO',
        section: 'QA_SESSION',
        label: 'positive',
        score: 0.920,
        positive_prob: 0.920,
        negative_prob: 0.030,
        neutral_prob: 0.050,
        is_forward_looking: true,
        uncertainty_score: 0.10,
      },
    ],
    summary_takeaways: [
      'Massive positive sentiment anomaly (Z-score +2.35) triggered classic textbook Post-Earnings Announcement Drift.',
      'Record low auto COGS ($35,100) and surprise 20-30% delivery target for 2025 drove immediate institutional re-rating.',
      'Extreme volume surge (3.45x) confirmed fundamental regime shift with persistent upward drift across 30 sessions.',
    ],
  },
  AAPL: {
    id: 'AAPL-Q4-2024',
    ticker: 'AAPL',
    company_name: 'Apple Inc.',
    quarter: 'Q4 FY24',
    date: '2024-10-31',
    fiscal_year: 2024,
    timing: 'AMC',
    tone_metrics: {
      net_sentiment: 0.42,
      prepared_remarks_sentiment: 0.38,
      qa_sentiment: 0.48,
      divergence_delta: 0.10,
      forward_guidance_score: 0.35,
      uncertainty_index: 0.18,
      z_score_trailing_4q: -0.25,
      positive_ratio: 0.60,
      negative_ratio: 0.18,
      neutral_ratio: 0.22,
      speaker_summaries: [
        {
          speaker: 'Tim Cook',
          role: 'CEO',
          sentence_count: 2,
          net_sentiment: 0.94,
          positive_count: 2,
          negative_count: 0,
          neutral_count: 0,
          uncertainty_ratio: 0.0,
        },
        {
          speaker: 'Luca Maestri',
          role: 'CFO',
          sentence_count: 2,
          net_sentiment: 0.12,
          positive_count: 1,
          negative_count: 1,
          neutral_count: 0,
          uncertainty_ratio: 0.25,
        },
      ],
    },
    pead_metrics: {
      announcement_timing: 'AMC',
      t_plus_0_return: -1.82,
      t_plus_1_return: -1.33,
      t_plus_5_return: 0.44,
      t_plus_30_return: 2.65,
      benchmark_spy_t_plus_1: 0.40,
      car_t_plus_1: -1.73,
      car_t_plus_5: 0.10,
      car_t_plus_30: 1.20,
      volume_surge_ratio: 1.55,
      pead_drift_direction: 'MEAN_REVERTING',
    },
    price_history: [
      { date: '2024-10-24', open: 229.0, high: 232.0, low: 228.1, close: 230.5, volume: 44000000 },
      { date: '2024-10-28', open: 231.5, high: 233.5, low: 230.0, close: 233.4, volume: 41000000 },
      { date: '2024-10-31', open: 228.5, high: 230.1, low: 225.2, close: 225.9, volume: 58000000, is_earnings_day: true, abnormal_return: -1.8 },
      { date: '2024-11-01', open: 222.0, high: 224.2, low: 220.5, close: 222.9, volume: 71000000, abnormal_return: -1.3 },
      { date: '2024-11-05', open: 222.5, high: 224.8, low: 221.8, close: 223.4, volume: 39000000, abnormal_return: 0.4 },
      { date: '2024-11-08', open: 225.0, high: 228.2, low: 224.5, close: 226.9, volume: 42000000, abnormal_return: 1.6 },
      { date: '2024-11-15', open: 227.0, high: 229.4, low: 224.5, close: 225.0, volume: 45000000, abnormal_return: -0.8 },
      { date: '2024-11-25', open: 228.0, high: 232.5, low: 227.5, close: 231.9, volume: 48000000, abnormal_return: 3.1 },
    ],
    sentences: [
      {
        id: 1,
        sentence: 'Today Apple is reporting revenue of $94.9 billion for the September quarter, up 6% from a year ago and an all-time record.',
        speaker: 'Tim Cook',
        speaker_role: 'CEO',
        section: 'PREPARED_REMARKS',
        label: 'positive',
        score: 0.970,
        positive_prob: 0.970,
        negative_prob: 0.010,
        neutral_prob: 0.020,
        is_forward_looking: false,
        uncertainty_score: 0.0,
      },
      {
        id: 2,
        sentence: 'Services reached another all-time revenue record of $25.0 billion, up 12% year-over-year.',
        speaker: 'Luca Maestri',
        speaker_role: 'CFO',
        section: 'PREPARED_REMARKS',
        label: 'positive',
        score: 0.950,
        positive_prob: 0.950,
        negative_prob: 0.015,
        neutral_prob: 0.035,
        is_forward_looking: false,
        uncertainty_score: 0.0,
      },
      {
        id: 3,
        sentence: 'Greater China revenue was essentially flat at $15.0 billion, reflecting heightened competitive pressure and foreign exchange volatility.',
        speaker: 'Luca Maestri',
        speaker_role: 'CFO',
        section: 'PREPARED_REMARKS',
        label: 'negative',
        score: 0.810,
        positive_prob: 0.050,
        negative_prob: 0.810,
        neutral_prob: 0.140,
        is_forward_looking: false,
        uncertainty_score: 0.25,
      },
      {
        id: 4,
        sentence: 'Erik Woodring with Morgan Stanley: Tim, how are early adoption metrics for Apple Intelligence comparing to initial internal projections?',
        speaker: 'Erik Woodring',
        speaker_role: 'ANALYST',
        section: 'QA_SESSION',
        label: 'neutral',
        score: 0.760,
        positive_prob: 0.120,
        negative_prob: 0.080,
        neutral_prob: 0.760,
        is_forward_looking: true,
        uncertainty_score: 0.10,
      },
      {
        id: 5,
        sentence: 'Tim Cook: Customer feedback on iOS 18.1 has been very positive, with iOS 18.1 adoption pacing at more than double iOS 17.1 over the same period.',
        speaker: 'Tim Cook',
        speaker_role: 'CEO',
        section: 'QA_SESSION',
        label: 'positive',
        score: 0.915,
        positive_prob: 0.915,
        negative_prob: 0.025,
        neutral_prob: 0.060,
        is_forward_looking: false,
        uncertainty_score: 0.0,
      },
    ],
    summary_takeaways: [
      'Sentiment was balanced (+0.42) with muted Z-score (-0.25), correctly indicating an absence of momentum shock.',
      'Record Services growth (+12%) was counterbalanced by flat Greater China sales ($15B) and modest Q1 guidance.',
      'Price showed swift mean reversion within 5 sessions without extended PEAD trending.',
    ],
  },
  MSFT: {
    id: 'MSFT-Q1-2025',
    ticker: 'MSFT',
    company_name: 'Microsoft Corporation',
    quarter: 'Q1 FY25',
    date: '2024-10-30',
    fiscal_year: 2025,
    timing: 'AMC',
    tone_metrics: {
      net_sentiment: 0.18,
      prepared_remarks_sentiment: 0.25,
      qa_sentiment: 0.08,
      divergence_delta: -0.17,
      forward_guidance_score: -0.22,
      uncertainty_index: 0.28,
      z_score_trailing_4q: -1.65,
      positive_ratio: 0.45,
      negative_ratio: 0.35,
      neutral_ratio: 0.20,
      speaker_summaries: [
        {
          speaker: 'Satya Nadella',
          role: 'CEO',
          sentence_count: 2,
          net_sentiment: 0.55,
          positive_count: 2,
          negative_count: 0,
          neutral_count: 0,
          uncertainty_ratio: 0.10,
        },
        {
          speaker: 'Amy Hood',
          role: 'CFO',
          sentence_count: 3,
          net_sentiment: -0.33,
          positive_count: 1,
          negative_count: 2,
          neutral_count: 0,
          uncertainty_ratio: 0.35,
        },
      ],
    },
    pead_metrics: {
      announcement_timing: 'AMC',
      t_plus_0_return: 1.10,
      t_plus_1_return: -6.05,
      t_plus_5_return: -5.57,
      t_plus_30_return: -1.04,
      benchmark_spy_t_plus_1: -0.40,
      car_t_plus_1: -5.65,
      car_t_plus_5: -5.17,
      car_t_plus_30: -0.64,
      volume_surge_ratio: 2.20,
      pead_drift_direction: 'DOWNWARD_DRIFT',
    },
    price_history: [
      { date: '2024-10-24', open: 424.0, high: 428.5, low: 422.0, close: 424.7, volume: 18000000 },
      { date: '2024-10-28', open: 427.0, high: 432.0, low: 425.5, close: 428.1, volume: 19500000 },
      { date: '2024-10-30', open: 434.0, high: 438.5, low: 430.2, close: 432.5, volume: 34000000, is_earnings_day: true, abnormal_return: 1.1 },
      { date: '2024-10-31', open: 415.0, high: 418.0, low: 404.2, close: 406.3, volume: 58000000, abnormal_return: -6.05 },
      { date: '2024-11-04', open: 407.0, high: 410.5, low: 404.0, close: 408.4, volume: 24000000, abnormal_return: 0.5 },
      { date: '2024-11-08', open: 418.0, high: 423.5, low: 416.5, close: 422.5, volume: 22000000, abnormal_return: 3.4 },
      { date: '2024-11-18', open: 425.0, high: 428.9, low: 423.0, close: 428.0, volume: 20000000, abnormal_return: 1.3 },
    ],
    sentences: [
      {
        id: 1,
        sentence: 'Microsoft Cloud revenue was $38.9 billion, up 22% year-over-year, driven by continued demand for our AI platform.',
        speaker: 'Satya Nadella',
        speaker_role: 'CEO',
        section: 'PREPARED_REMARKS',
        label: 'positive',
        score: 0.960,
        positive_prob: 0.960,
        negative_prob: 0.010,
        neutral_prob: 0.030,
        is_forward_looking: false,
        uncertainty_score: 0.0,
      },
      {
        id: 2,
        sentence: 'Azure revenue grew 33%, with 12 points of growth coming directly from artificial intelligence services.',
        speaker: 'Amy Hood',
        speaker_role: 'CFO',
        section: 'PREPARED_REMARKS',
        label: 'positive',
        score: 0.940,
        positive_prob: 0.940,
        negative_prob: 0.010,
        neutral_prob: 0.050,
        is_forward_looking: false,
        uncertainty_score: 0.0,
      },
      {
        id: 3,
        sentence: 'However, we remain capacity-constrained on external GPUs and data center builds, which will temper Azure sequential acceleration in Q2.',
        speaker: 'Amy Hood',
        speaker_role: 'CFO',
        section: 'PREPARED_REMARKS',
        label: 'negative',
        score: 0.860,
        positive_prob: 0.040,
        negative_prob: 0.860,
        neutral_prob: 0.100,
        is_forward_looking: true,
        uncertainty_score: 0.40,
      },
      {
        id: 4,
        sentence: 'Capital expenditures including finance leases were $20.0 billion, and we anticipate spending will increase sequentially to support AI demand.',
        speaker: 'Amy Hood',
        speaker_role: 'CFO',
        section: 'PREPARED_REMARKS',
        label: 'negative',
        score: 0.710,
        positive_prob: 0.110,
        negative_prob: 0.710,
        neutral_prob: 0.180,
        is_forward_looking: true,
        uncertainty_score: 0.20,
      },
      {
        id: 5,
        sentence: 'Mark Moerdler with Bernstein: Satya, when does Azure supply capacity catch up with enterprise bookings to unlock revenue acceleration?',
        speaker: 'Mark Moerdler',
        speaker_role: 'ANALYST',
        section: 'QA_SESSION',
        label: 'negative',
        score: 0.690,
        positive_prob: 0.080,
        negative_prob: 0.690,
        neutral_prob: 0.230,
        is_forward_looking: true,
        uncertainty_score: 0.30,
      },
    ],
    summary_takeaways: [
      'Sharp negative sentiment anomaly (Z-score -1.65) driven by supply constraints and $20B/quarter capex intensity.',
      'Executive Q&A tone suffered severe negative divergence (-0.17), with CFO Amy Hood highlighting near-term deceleration.',
      'Stock underwent steep Day 1 drawdown (-6.05% CAR), demonstrating high sensitivity to forward guidance sentiment shifts.',
    ],
  },
};

export const SEED_CORRELATION_STATS: CorrelationStats = {
  pearson_r: 0.842,
  spearman_rho: 0.882,
  p_value: 0.0001,
  sample_size: 16,
  directional_accuracy: 87.5,
  points: [
    { ticker: 'NVDA', quarter: 'Q3 FY25', date: '2024-11-20', sentiment_z_score: 1.45, qa_divergence: 0.25, car_t_plus_1: 0.20, car_t_plus_5: -6.15, volume_surge: 2.15 },
    { ticker: 'TSLA', quarter: 'Q3 2024', date: '2024-10-23', sentiment_z_score: 2.35, qa_divergence: 0.13, car_t_plus_1: 21.70, car_t_plus_5: 24.80, volume_surge: 3.45 },
    { ticker: 'AAPL', quarter: 'Q4 FY24', date: '2024-10-31', sentiment_z_score: -0.25, qa_divergence: 0.10, car_t_plus_1: -1.73, car_t_plus_5: 0.10, volume_surge: 1.55 },
    { ticker: 'MSFT', quarter: 'Q1 FY25', date: '2024-10-30', sentiment_z_score: -1.65, qa_divergence: -0.17, car_t_plus_1: -5.65, car_t_plus_5: -5.17, volume_surge: 2.20 },
    { ticker: 'META', quarter: 'Q3 2024', date: '2024-10-30', sentiment_z_score: 0.85, qa_divergence: -0.08, car_t_plus_1: -4.10, car_t_plus_5: -2.30, volume_surge: 1.85 },
    { ticker: 'AMZN', quarter: 'Q3 2024', date: '2024-10-31', sentiment_z_score: 1.60, qa_divergence: 0.22, car_t_plus_1: 6.20, car_t_plus_5: 8.40, volume_surge: 2.10 },
    { ticker: 'GOOGL', quarter: 'Q3 2024', date: '2024-10-29', sentiment_z_score: 1.20, qa_divergence: 0.15, car_t_plus_1: 2.85, car_t_plus_5: 3.90, volume_surge: 1.75 },
    { ticker: 'PLTR', quarter: 'Q3 2024', date: '2024-11-04', sentiment_z_score: 2.60, qa_divergence: 0.35, car_t_plus_1: 23.40, car_t_plus_5: 31.20, volume_surge: 4.10 },
    { ticker: 'AMD', quarter: 'Q3 2024', date: '2024-10-29', sentiment_z_score: -1.10, qa_divergence: -0.20, car_t_plus_1: -10.60, car_t_plus_5: -12.30, volume_surge: 2.80 },
    { ticker: 'NFLX', quarter: 'Q3 2024', date: '2024-10-17', sentiment_z_score: 1.40, qa_divergence: 0.18, car_t_plus_1: 11.10, car_t_plus_5: 12.50, volume_surge: 2.30 },
    { ticker: 'NVDA', quarter: 'Q2 FY25', date: '2024-08-28', sentiment_z_score: 0.60, qa_divergence: -0.12, car_t_plus_1: -6.40, car_t_plus_5: -7.80, volume_surge: 1.95 },
    { ticker: 'AAPL', quarter: 'Q3 FY24', date: '2024-08-01', sentiment_z_score: 0.45, qa_divergence: 0.05, car_t_plus_1: 0.65, car_t_plus_5: 1.20, volume_surge: 1.25 },
    { ticker: 'TSLA', quarter: 'Q2 2024', date: '2024-07-23', sentiment_z_score: -1.85, qa_divergence: -0.30, car_t_plus_1: -12.30, car_t_plus_5: -9.80, volume_surge: 2.70 },
    { ticker: 'MSFT', quarter: 'Q4 FY24', date: '2024-07-30', sentiment_z_score: -0.75, qa_divergence: -0.14, car_t_plus_1: -1.10, car_t_plus_5: -3.20, volume_surge: 1.65 },
    { ticker: 'META', quarter: 'Q2 2024', date: '2024-07-31', sentiment_z_score: 1.90, qa_divergence: 0.28, car_t_plus_1: 4.80, car_t_plus_5: 7.90, volume_surge: 2.40 },
    { ticker: 'AMZN', quarter: 'Q2 2024', date: '2024-08-01', sentiment_z_score: -1.40, qa_divergence: -0.22, car_t_plus_1: -8.80, car_t_plus_5: -9.50, volume_surge: 2.50 },
  ],
};
