// 5-Year EPS & Revenue Valuation Engine & Constraint Helpers

export interface CompanyFundamentals {
  symbol: string;
  name: string;
  currency: string;
  currentPrice: number;
  marketCap: number;
  trailingEps: number;
  totalRevenue: number;
  profitMargins: number; // Decimal (e.g. 0.25 for 25%)
  sharesOutstanding: number;
  trailingPE: number;
  revenueGrowth: number; // Decimal (e.g. 0.15 for 15%)
  freeCashFlow?: number;
  exchange?: string;
  sector?: string;
}

export interface ScenarioInputs {
  growthRate: number; // Annual Revenue Growth (e.g. 0.10 for 10%)
  netMargin: number; // Target Net Profit Margin (e.g. 0.20 for 20%)
  exitPE: number; // Exit P/E Multiple (e.g. 25 for 25x)
}

export interface YearlyEPSProjection {
  year: number;
  revenue: number;
  netIncome: number;
  eps: number;
}

export interface EPSValuationResult {
  inputs: ScenarioInputs;
  yearlyProjections: YearlyEPSProjection[];
  year5Revenue: number;
  year5NetIncome: number;
  year5EPS: number;
  year5TargetPrice: number;
  totalReturnPercent: number;
  fiveYearCAGRPercent: number;
  isUndervalued: boolean;
}

export interface AllScenariosState {
  bear: ScenarioInputs;
  base: ScenarioInputs;
  bull: ScenarioInputs;
}

/**
 * Calculates 5-year Revenue, Net Income, EPS, and Target Price projection for a scenario.
 */
export function calculateEPSScenario(
  fundamentals: CompanyFundamentals,
  inputs: ScenarioInputs
): EPSValuationResult {
  const { currentPrice, totalRevenue, sharesOutstanding } = fundamentals;
  const { growthRate, netMargin, exitPE } = inputs;

  const yearlyProjections: YearlyEPSProjection[] = [];

  for (let year = 1; year <= 5; year++) {
    const projectedRevenue = totalRevenue * Math.pow(1 + growthRate, year);
    const projectedNetIncome = projectedRevenue * netMargin;
    const projectedEPS = sharesOutstanding > 0 ? projectedNetIncome / sharesOutstanding : 0;

    yearlyProjections.push({
      year,
      revenue: projectedRevenue,
      netIncome: projectedNetIncome,
      eps: projectedEPS,
    });
  }

  const year5 = yearlyProjections[4];
  const year5Revenue = year5 ? year5.revenue : 0;
  const year5NetIncome = year5 ? year5.netIncome : 0;
  const year5EPS = year5 ? year5.eps : 0;

  // Projected Year 5 Stock Price = Year 5 EPS * Exit P/E Multiple
  const year5TargetPrice = year5EPS * exitPE;

  // Total Return % = ((Year 5 Price - Current Price) / Current Price) * 100
  const totalReturnPercent =
    currentPrice > 0 ? ((year5TargetPrice - currentPrice) / currentPrice) * 100 : 0;

  // 5-Year CAGR % = ((Year 5 Price / Current Price) ^ (1/5) - 1) * 100
  let fiveYearCAGRPercent = 0;
  if (currentPrice > 0 && year5TargetPrice > 0) {
    fiveYearCAGRPercent = (Math.pow(year5TargetPrice / currentPrice, 1 / 5) - 1) * 100;
  } else if (year5TargetPrice <= 0) {
    fiveYearCAGRPercent = -100;
  }

  return {
    inputs,
    yearlyProjections,
    year5Revenue,
    year5NetIncome,
    year5EPS,
    year5TargetPrice,
    totalReturnPercent,
    fiveYearCAGRPercent,
    isUndervalued: year5TargetPrice > currentPrice,
  };
}

/**
 * Generates initial scenario presets upon loading a ticker.
 * Enforces Bear <= Base <= Bull on all 3 parameters.
 */
export function getDefaultScenarioPresets(fundamentals: CompanyFundamentals): AllScenariosState {
  const histGrowth = isNaN(fundamentals.revenueGrowth) || fundamentals.revenueGrowth === 0
    ? 0.10
    : fundamentals.revenueGrowth;

  const currMargin = isNaN(fundamentals.profitMargins) || fundamentals.profitMargins <= 0
    ? 0.15
    : Math.max(0.02, Math.min(0.65, fundamentals.profitMargins));

  const currPE = isNaN(fundamentals.trailingPE) || fundamentals.trailingPE <= 0
    ? 20
    : Math.max(8, Math.min(60, fundamentals.trailingPE));

  // 1. Bear Case
  const bearGrowth = Number(Math.max(0.02, histGrowth * 0.5).toFixed(3));
  const bearMargin = Number(Math.max(0.02, currMargin * 0.85).toFixed(3));
  const bearPE = Math.round(Math.max(10, currPE * 0.7));

  // 2. Base Case
  const baseGrowth = Number(Math.max(bearGrowth, histGrowth > 0 ? histGrowth : 0.10).toFixed(3));
  const baseMargin = Number(Math.max(bearMargin, currMargin).toFixed(3));
  const basePE = Math.round(Math.max(bearPE, currPE || 18));

  // 3. Bull Case
  const bullGrowth = Number(Math.max(baseGrowth, histGrowth * 1.4, 0.18).toFixed(3));
  const bullMargin = Number(Math.max(baseMargin, currMargin * 1.15).toFixed(3));
  const bullPE = Math.round(Math.max(basePE, currPE * 1.25, 25));

  return {
    bear: {
      growthRate: Math.min(bearGrowth, baseGrowth),
      netMargin: Math.min(bearMargin, baseMargin),
      exitPE: Math.min(bearPE, basePE),
    },
    base: {
      growthRate: baseGrowth,
      netMargin: baseMargin,
      exitPE: basePE,
    },
    bull: {
      growthRate: Math.max(bullGrowth, baseGrowth),
      netMargin: Math.max(bullMargin, baseMargin),
      exitPE: Math.max(bullPE, basePE),
    },
  };
}

/**
 * Interlocked Floor and Ceiling State Controller:
 * - Increasing Bear pushes Base and Bull up (Bear acts as floor).
 * - Increasing Base pushes Bull up, decreasing Base pulls Bear down.
 * - Decreasing Bull pulls Base and Bear down (Bull acts as ceiling).
 */
export function updateScenarioWithConstraints(
  current: AllScenariosState,
  targetCase: 'bear' | 'base' | 'bull',
  field: keyof ScenarioInputs,
  newValue: number
): AllScenariosState {
  const next: AllScenariosState = {
    bear: { ...current.bear },
    base: { ...current.base },
    bull: { ...current.bull },
  };

  if (targetCase === 'bear') {
    next.bear[field] = newValue;
    // Bear creates floor on Base:
    if (next.base[field] < newValue) {
      next.base[field] = newValue;
    }
    // Base creates floor on Bull:
    if (next.bull[field] < next.base[field]) {
      next.bull[field] = next.base[field];
    }
  } else if (targetCase === 'base') {
    next.base[field] = newValue;
    // Base creates floor on Bull (if base increased above bull):
    if (next.bull[field] < newValue) {
      next.bull[field] = newValue;
    }
    // Base creates ceiling on Bear (if base decreased below bear):
    if (next.bear[field] > newValue) {
      next.bear[field] = newValue;
    }
  } else if (targetCase === 'bull') {
    next.bull[field] = newValue;
    // Bull creates ceiling on Base:
    if (next.base[field] > newValue) {
      next.base[field] = newValue;
    }
    // Base creates ceiling on Bear:
    if (next.bear[field] > next.base[field]) {
      next.bear[field] = next.base[field];
    }
  }

  return next;
}

/**
 * Formatters
 */
export function formatCurrency(amount: number, currency: string = 'USD', decimals: number = 2): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}

export function formatLargeNumber(amount: number, currency: string = '$'): string {
  if (isNaN(amount) || amount === null || amount === undefined) return `${currency}0`;
  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  if (abs >= 1e12) return `${sign}${currency}${(abs / 1e12).toFixed(2)}T`;
  if (abs >= 1e9) return `${sign}${currency}${(abs / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${sign}${currency}${(abs / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `${sign}${currency}${(abs / 1e3).toFixed(2)}K`;
  return `${sign}${currency}${abs.toFixed(2)}`;
}

export function formatPercent(val: number, showSign: boolean = false): string {
  if (isNaN(val)) return '0.0%';
  const sign = showSign && val > 0 ? '+' : '';
  return `${sign}${val.toFixed(1)}%`;
}

/**
 * Extensive built-in ticker defaults
 */
export const POPULAR_TICKERS: Record<string, CompanyFundamentals> = {
  AAPL: {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    currency: 'USD',
    currentPrice: 325.13,
    marketCap: 4745000000000,
    trailingEps: 8.73,
    totalRevenue: 466820000000,
    profitMargins: 0.276,
    sharesOutstanding: 14594180000,
    trailingPE: 37.24,
    revenueGrowth: 0.164,
    sector: 'Consumer Electronics & Software',
    exchange: 'NASDAQ',
  },
  QCOM: {
    symbol: 'QCOM',
    name: 'QUALCOMM Incorporated',
    currency: 'USD',
    currentPrice: 166.61,
    marketCap: 177900000000,
    trailingEps: 9.58,
    totalRevenue: 38960000000,
    profitMargins: 0.263,
    sharesOutstanding: 1068060000,
    trailingPE: 17.39,
    revenueGrowth: 0.12,
    sector: 'Semiconductors & Wireless',
    exchange: 'NASDAQ',
  },
  AMZN: {
    symbol: 'AMZN',
    name: 'Amazon.com, Inc.',
    currency: 'USD',
    currentPrice: 254.92,
    marketCap: 2680000000000,
    trailingEps: 5.52,
    totalRevenue: 637950000000,
    profitMargins: 0.091,
    sharesOutstanding: 10520000000,
    trailingPE: 46.18,
    revenueGrowth: 0.11,
    sector: 'E-Commerce & Cloud Infrastructure',
    exchange: 'NASDAQ',
  },
  MSFT: {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    currency: 'USD',
    currentPrice: 501.02,
    marketCap: 3720000000000,
    trailingEps: 13.45,
    totalRevenue: 261800000000,
    profitMargins: 0.382,
    sharesOutstanding: 7430000000,
    trailingPE: 37.25,
    revenueGrowth: 0.15,
    sector: 'Software & Enterprise Cloud',
    exchange: 'NASDAQ',
  },
  NVDA: {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    currency: 'USD',
    currentPrice: 217.44,
    marketCap: 5350000000000,
    trailingEps: 7.92,
    totalRevenue: 302970000000,
    profitMargins: 0.637,
    sharesOutstanding: 24147000000,
    trailingPE: 27.45,
    revenueGrowth: 1.059,
    sector: 'AI Compute & Semiconductors',
    exchange: 'NASDAQ',
  },
  VST: {
    symbol: 'VST',
    name: 'Vistra Corp.',
    currency: 'USD',
    currentPrice: 138.08,
    marketCap: 46340000000,
    trailingEps: 5.94,
    totalRevenue: 19210000000,
    profitMargins: 0.1155,
    sharesOutstanding: 335635000,
    trailingPE: 23.25,
    revenueGrowth: 0.10,
    sector: 'Utilities & Power Generation',
    exchange: 'NYSE',
  },
  OKTA: {
    symbol: 'OKTA',
    name: 'Okta, Inc.',
    currency: 'USD',
    currentPrice: 166.43,
    marketCap: 29100000000,
    trailingEps: 1.66,
    totalRevenue: 3073000000,
    profitMargins: 0.0963,
    sharesOutstanding: 167140000,
    trailingPE: 100.26,
    revenueGrowth: 0.106,
    sector: 'Cybersecurity & Identity',
    exchange: 'NASDAQ',
  },
  PLTR: {
    symbol: 'PLTR',
    name: 'Palantir Technologies Inc.',
    currency: 'USD',
    currentPrice: 179.92,
    marketCap: 414000000000,
    trailingEps: 1.17,
    totalRevenue: 6156000000,
    profitMargins: 0.49,
    sharesOutstanding: 2300710000,
    trailingPE: 153.78,
    revenueGrowth: 0.30,
    sector: 'AI Software & Analytics',
    exchange: 'NYSE',
  },
  TSLA: {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    currency: 'USD',
    currentPrice: 356.09,
    marketCap: 1406000000000,
    trailingEps: 1.08,
    totalRevenue: 103620000000,
    profitMargins: 0.0367,
    sharesOutstanding: 3949500000,
    trailingPE: 329.71,
    revenueGrowth: 0.08,
    sector: 'Automotive & Energy Storage',
    exchange: 'NASDAQ',
  },
  GOOGL: {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    currency: 'USD',
    currentPrice: 204.50,
    marketCap: 2510000000000,
    trailingEps: 8.04,
    totalRevenue: 350000000000,
    profitMargins: 0.282,
    sharesOutstanding: 12280000000,
    trailingPE: 25.44,
    revenueGrowth: 0.14,
    sector: 'Internet & Cloud Services',
    exchange: 'NASDAQ',
  },
};
