// Types and DCF Mathematical Engine

export interface CompanyFundamentals {
  symbol: string;
  name: string;
  currency: string;
  currentPrice: number;
  marketCap?: number;
  freeCashFlow: number; // Base TTM FCF in currency units
  sharesOutstanding: number; // Diluted shares outstanding
  totalCash: number; // Cash & Cash Equivalents
  totalDebt: number; // Total short + long term debt
  revenueGrowth: number; // Decimal (e.g., 0.15 for 15%)
  exchange?: string;
  sector?: string;
}

export interface ScenarioParams {
  growthRate: number; // Decimal (e.g. 0.10 for 10%)
  discountRate: number; // Decimal (e.g. 0.09 for 9%)
  exitMultiple: number; // Number (e.g. 18 for 18x)
}

export interface YearProjection {
  year: number;
  projectedFCF: number;
  discountFactor: number;
  discountedFCF: number;
}

export interface ScenarioResult {
  params: ScenarioParams;
  yearlyProjections: YearProjection[];
  sumDiscountedFCF: number;
  terminalValue: number;
  discountedTerminalValue: number;
  enterpriseValue: number;
  netDebt: number; // Total Cash - Total Debt (added to EV)
  equityValue: number;
  impliedPrice: number;
  upsideDownsidePercent: number;
  fiveYearCAGR: number;
  isUndervalued: boolean;
}

export interface DCFModelOutput {
  fundamentals: CompanyFundamentals;
  bear: ScenarioResult;
  base: ScenarioResult;
  bull: ScenarioResult;
}

/**
 * Calculates a 5-year DCF scenario projection.
 */
export function calculateScenario(
  fundamentals: CompanyFundamentals,
  params: ScenarioParams
): ScenarioResult {
  const { freeCashFlow, totalCash, totalDebt, sharesOutstanding, currentPrice } = fundamentals;
  const { growthRate, discountRate, exitMultiple } = params;

  const yearlyProjections: YearProjection[] = [];
  let sumDiscountedFCF = 0;

  // 1. Year 1-5 Projections
  for (let t = 1; t <= 5; t++) {
    const projectedFCF = freeCashFlow * Math.pow(1 + growthRate, t);
    const discountFactor = 1 / Math.pow(1 + discountRate, t);
    const discountedFCF = projectedFCF * discountFactor;

    sumDiscountedFCF += discountedFCF;
    yearlyProjections.push({
      year: t,
      projectedFCF,
      discountFactor,
      discountedFCF,
    });
  }

  // 2. Terminal Value
  const year5FCF = yearlyProjections[4].projectedFCF;
  const terminalValue = year5FCF * exitMultiple;
  const discountedTerminalValue = terminalValue / Math.pow(1 + discountRate, 5);

  // 3. Enterprise Value
  const enterpriseValue = sumDiscountedFCF + discountedTerminalValue;

  // 4. Net Debt & Equity Value
  // Equity Value = EV + Total Cash - Total Debt
  const netDebt = totalCash - totalDebt;
  const equityValue = enterpriseValue + totalCash - totalDebt;

  // 5. Implied Price
  const impliedPrice = sharesOutstanding > 0 ? equityValue / sharesOutstanding : 0;

  // 6. Upside / Margin of Safety %
  const upsideDownsidePercent =
    currentPrice > 0 ? ((impliedPrice - currentPrice) / currentPrice) * 100 : 0;

  // 7. 5-Year Projected CAGR
  let fiveYearCAGR = 0;
  if (currentPrice > 0 && impliedPrice > 0) {
    fiveYearCAGR = Math.pow(impliedPrice / currentPrice, 1 / 5) - 1;
  } else if (impliedPrice <= 0) {
    fiveYearCAGR = -1;
  }

  return {
    params,
    yearlyProjections,
    sumDiscountedFCF,
    terminalValue,
    discountedTerminalValue,
    enterpriseValue,
    netDebt,
    equityValue,
    impliedPrice,
    upsideDownsidePercent,
    fiveYearCAGR,
    isUndervalued: impliedPrice > currentPrice,
  };
}

/**
 * Calculates default scenario parameters for Bear, Base, Bull based on historical growth.
 */
export function getDefaultScenarioParams(historicalGrowth: number = 0.1): {
  bear: ScenarioParams;
  base: ScenarioParams;
  bull: ScenarioParams;
} {
  const normGrowth = isNaN(historicalGrowth) ? 0.1 : historicalGrowth;

  return {
    bear: {
      growthRate: Math.max(-0.05, Math.min(0.2, Number((normGrowth * 0.5).toFixed(3)))),
      discountRate: 0.11, // 11%
      exitMultiple: 12,
    },
    base: {
      growthRate: Math.max(0.02, Math.min(0.3, Number(normGrowth.toFixed(3)))),
      discountRate: 0.09, // 9%
      exitMultiple: 18,
    },
    bull: {
      growthRate: Math.max(0.08, Math.min(0.45, Number((normGrowth * 1.5).toFixed(3)))),
      discountRate: 0.08, // 8%
      exitMultiple: 25,
    },
  };
}

/**
 * Currency and Large Number Formatters
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

  if (abs >= 1e12) {
    return `${sign}${currency}${(abs / 1e12).toFixed(2)}T`;
  }
  if (abs >= 1e9) {
    return `${sign}${currency}${(abs / 1e9).toFixed(2)}B`;
  }
  if (abs >= 1e6) {
    return `${sign}${currency}${(abs / 1e6).toFixed(2)}M`;
  }
  if (abs >= 1e3) {
    return `${sign}${currency}${(abs / 1e3).toFixed(2)}K`;
  }
  return `${sign}${currency}${abs.toFixed(2)}`;
}

export function formatPercent(decimal: number, showSign: boolean = false): string {
  if (isNaN(decimal)) return '0.0%';
  const val = (decimal * 100).toFixed(1);
  if (showSign && decimal > 0) return `+${val}%`;
  return `${val}%`;
}

/**
 * High-quality fallback fundamentals database for quick-select and offline resilient fallback.
 */
export const POPULAR_TICKERS: Record<string, CompanyFundamentals> = {
  AAPL: {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    currency: 'USD',
    currentPrice: 325.13,
    marketCap: 4745000000000,
    freeCashFlow: 107720000000,
    sharesOutstanding: 14594180000,
    totalCash: 62400000000,
    totalDebt: 84340000000,
    revenueGrowth: 0.164,
    exchange: 'NASDAQ',
    sector: 'Technology / Consumer Electronics',
  },
  QCOM: {
    symbol: 'QCOM',
    name: 'QUALCOMM Incorporated',
    currency: 'USD',
    currentPrice: 166.61,
    marketCap: 177900000000,
    freeCashFlow: 10240000000,
    sharesOutstanding: 1068060000,
    totalCash: 8304000000,
    totalDebt: 15270000000,
    revenueGrowth: 0.12,
    exchange: 'NASDAQ',
    sector: 'Semiconductors & Mobile Tech',
  },
  AMZN: {
    symbol: 'AMZN',
    name: 'Amazon.com, Inc.',
    currency: 'USD',
    currentPrice: 254.92,
    marketCap: 2680000000000,
    freeCashFlow: 47750000000,
    sharesOutstanding: 10520000000,
    totalCash: 88900000000,
    totalDebt: 135000000000,
    revenueGrowth: 0.11,
    exchange: 'NASDAQ',
    sector: 'E-Commerce & Cloud Infrastructure',
  },
  MSFT: {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    currency: 'USD',
    currentPrice: 501.02,
    marketCap: 3720000000000,
    freeCashFlow: 74100000000,
    sharesOutstanding: 7430000000,
    totalCash: 78400000000,
    totalDebt: 79000000000,
    revenueGrowth: 0.15,
    exchange: 'NASDAQ',
    sector: 'Software & Enterprise Cloud',
  },
  NVDA: {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    currency: 'USD',
    currentPrice: 217.44,
    marketCap: 5350000000000,
    freeCashFlow: 60800000000,
    sharesOutstanding: 24550000000,
    totalCash: 43200000000,
    totalDebt: 8500000000,
    revenueGrowth: 0.86,
    exchange: 'NASDAQ',
    sector: 'AI Accelerators & Semiconductor',
  },
  GOOGL: {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    currency: 'USD',
    currentPrice: 204.50,
    marketCap: 2510000000000,
    freeCashFlow: 69500000000,
    sharesOutstanding: 12280000000,
    totalCash: 93200000000,
    totalDebt: 28400000000,
    revenueGrowth: 0.14,
    exchange: 'NASDAQ',
    sector: 'Internet & Search & Cloud',
  },
  TSLA: {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    currency: 'USD',
    currentPrice: 285.30,
    marketCap: 910000000000,
    freeCashFlow: 3600000000,
    sharesOutstanding: 3190000000,
    totalCash: 33600000000,
    totalDebt: 13800000000,
    revenueGrowth: 0.08,
    exchange: 'NASDAQ',
    sector: 'Automotive & Energy Storage',
  },
  META: {
    symbol: 'META',
    name: 'Meta Platforms, Inc.',
    currency: 'USD',
    currentPrice: 685.20,
    marketCap: 1730000000000,
    freeCashFlow: 51200000000,
    sharesOutstanding: 2525000000,
    totalCash: 70900000000,
    totalDebt: 37600000000,
    revenueGrowth: 0.19,
    exchange: 'NASDAQ',
    sector: 'Social Media & AI Hardware',
  },
};
