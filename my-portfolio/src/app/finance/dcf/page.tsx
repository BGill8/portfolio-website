'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  BarChart3,
  Calculator,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Info,
  Layers,
  RefreshCw,
  Search,
  Sliders,
  TrendingDown,
  TrendingUp,
  Zap,
} from 'lucide-react';
import {
  CompanyFundamentals,
  ScenarioParams,
  calculateScenario,
  formatCurrency,
  formatLargeNumber,
  formatPercent,
  getDefaultScenarioParams,
  POPULAR_TICKERS,
} from '@/lib/dcf';

const QUICK_TICKERS = ['AAPL', 'QCOM', 'AMZN', 'MSFT', 'NVDA', 'GOOGL', 'TSLA', 'META'];

export default function DCFCalculatorPage() {
  const [tickerInput, setTickerInput] = useState('AAPL');
  const [activeTicker, setActiveTicker] = useState('AAPL');
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<string>('preset');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showEditFundamentals, setShowEditFundamentals] = useState(false);
  const [activeTab, setActiveTab] = useState<'comparison' | 'base' | 'bear' | 'bull'>('comparison');

  // Company Fundamentals State
  const [fundamentals, setFundamentals] = useState<CompanyFundamentals>(POPULAR_TICKERS['AAPL']);

  // Scenarios State
  const [bearParams, setBearParams] = useState<ScenarioParams>({
    growthRate: 0.05,
    discountRate: 0.11,
    exitMultiple: 12,
  });

  const [baseParams, setBaseParams] = useState<ScenarioParams>({
    growthRate: 0.10,
    discountRate: 0.09,
    exitMultiple: 18,
  });

  const [bullParams, setBullParams] = useState<ScenarioParams>({
    growthRate: 0.18,
    discountRate: 0.08,
    exitMultiple: 25,
  });

  // Fetch ticker data from API
  const fetchTicker = useCallback(async (symbolToFetch: string) => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/finance/dcf?ticker=${encodeURIComponent(symbolToFetch)}`);
      const json = await res.json();

      if (json.success && json.data) {
        const data: CompanyFundamentals = json.data;
        setFundamentals(data);
        setActiveTicker(data.symbol);
        setDataSource(json.source || 'api');

        // Apply default presets derived from historical growth
        const presets = getDefaultScenarioParams(data.revenueGrowth);
        setBearParams(presets.bear);
        setBaseParams(presets.base);
        setBullParams(presets.bull);
      } else {
        setErrorMsg(json.error || 'Failed to fetch financial data for ticker');
      }
    } catch {
      setErrorMsg('Network error fetching ticker data. Falling back to local data.');
      if (POPULAR_TICKERS[symbolToFetch.toUpperCase()]) {
        const fallback = POPULAR_TICKERS[symbolToFetch.toUpperCase()];
        setFundamentals(fallback);
        setActiveTicker(fallback.symbol);
        const presets = getDefaultScenarioParams(fallback.revenueGrowth);
        setBearParams(presets.bear);
        setBaseParams(presets.base);
        setBullParams(presets.bull);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchTicker('AAPL');
  }, [fetchTicker]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tickerInput.trim()) {
      fetchTicker(tickerInput.trim().toUpperCase());
    }
  };

  const handleQuickSelect = (sym: string) => {
    setTickerInput(sym);
    fetchTicker(sym);
  };

  const handleResetDefaults = () => {
    const presets = getDefaultScenarioParams(fundamentals.revenueGrowth);
    setBearParams(presets.bear);
    setBaseParams(presets.base);
    setBullParams(presets.bull);
  };

  // Run DCF Engine on state
  const bearResult = useMemo(
    () => calculateScenario(fundamentals, bearParams),
    [fundamentals, bearParams]
  );
  const baseResult = useMemo(
    () => calculateScenario(fundamentals, baseParams),
    [fundamentals, baseParams]
  );
  const bullResult = useMemo(
    () => calculateScenario(fundamentals, bullParams),
    [fundamentals, bullParams]
  );

  const netDebt = fundamentals.totalCash - fundamentals.totalDebt;
  const isNetCash = netDebt >= 0;

  return (
    <div className="py-6 sm:py-10 space-y-8 max-w-6xl mx-auto">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
        <div className="space-y-1.5">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Portfolio</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Calculator className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Bull / Base / Bear DCF Calculator
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl">
            Interactive 5-year Discounted Cash Flow valuation engine with real-time financial data ingestion, multi-scenario sensitivity modeling, and intrinsic share price estimation.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg border border-zinc-800 transition-colors"
            title="Reset to recommended growth & WACC defaults"
          >
            <RefreshCw className="w-3.5 h-3.5 text-zinc-400" />
            <span>Reset Scenarios</span>
          </button>
        </div>
      </div>

      {/* Ticker Search & Quick-Select Bar */}
      <div className="glass-panel rounded-2xl p-5 border border-zinc-800/80 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={tickerInput}
              onChange={(e) => setTickerInput(e.target.value.toUpperCase())}
              placeholder="Search ticker (e.g. AAPL, QCOM, AMZN, MSFT, NVDA)..."
              className="w-full bg-zinc-900/90 text-white placeholder-zinc-500 text-sm font-semibold pl-10 pr-4 py-2.5 rounded-xl border border-zinc-700/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-colors shadow-sm shadow-indigo-600/20 cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Ingesting Data...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Load Ticker</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Ticker Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-zinc-500 font-medium">Quick Select:</span>
          {QUICK_TICKERS.map((sym) => (
            <button
              key={sym}
              onClick={() => handleQuickSelect(sym)}
              className={`px-2.5 py-1 rounded-lg font-mono font-semibold transition-all ${
                activeTicker === sym
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-zinc-900/80 text-zinc-300 hover:bg-zinc-800 hover:text-white border border-zinc-800'
              }`}
            >
              {sym}
            </button>
          ))}

          {dataSource && (
            <span className="ml-auto text-[11px] text-zinc-500 inline-flex items-center gap-1 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Source: {dataSource}
            </span>
          )}
        </div>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/50 text-xs text-rose-300 flex items-center gap-2">
            <Info className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Company Metadata Bar */}
      <div className="glass-panel-glow rounded-2xl p-6 border border-zinc-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800/70">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-2xl font-black text-white tracking-tight font-mono">
                {fundamentals.symbol}
              </h2>
              <span className="text-sm font-semibold text-zinc-300">
                {fundamentals.name}
              </span>
              {fundamentals.exchange && (
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                  {fundamentals.exchange}
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              {fundamentals.sector || 'Equities'} • Base Currency: {fundamentals.currency}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[11px] uppercase font-semibold text-zinc-500 block">
                Current Market Price
              </span>
              <span className="text-2xl font-black text-white font-mono">
                {formatCurrency(fundamentals.currentPrice, fundamentals.currency)}
              </span>
            </div>

            <button
              onClick={() => setShowEditFundamentals(!showEditFundamentals)}
              className="p-2 text-xs font-medium text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg border border-zinc-800 transition-colors inline-flex items-center gap-1"
              title="Edit baseline financial values"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{showEditFundamentals ? 'Hide Inputs' : 'Edit Inputs'}</span>
              {showEditFundamentals ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-xs">
          <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80">
            <span className="text-zinc-500 block font-medium">Market Cap</span>
            <span className="text-sm font-bold text-zinc-100 font-mono mt-0.5 block">
              {formatLargeNumber(fundamentals.currentPrice * fundamentals.sharesOutstanding)}
            </span>
          </div>

          <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80">
            <span className="text-zinc-500 block font-medium">TTM Free Cash Flow</span>
            <span className="text-sm font-bold text-emerald-400 font-mono mt-0.5 block">
              {formatLargeNumber(fundamentals.freeCashFlow)}
            </span>
          </div>

          <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80">
            <span className="text-zinc-500 block font-medium">Total Cash</span>
            <span className="text-sm font-bold text-zinc-200 font-mono mt-0.5 block">
              {formatLargeNumber(fundamentals.totalCash)}
            </span>
          </div>

          <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80">
            <span className="text-zinc-500 block font-medium">Total Debt</span>
            <span className="text-sm font-bold text-zinc-200 font-mono mt-0.5 block">
              {formatLargeNumber(fundamentals.totalDebt)}
            </span>
          </div>

          <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80">
            <span className="text-zinc-500 block font-medium">Net Debt</span>
            <span
              className={`text-sm font-bold font-mono mt-0.5 block ${
                isNetCash ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {isNetCash ? '+' : ''}
              {formatLargeNumber(netDebt)}
              <span className="text-[10px] text-zinc-500 font-sans ml-1">
                ({isNetCash ? 'Net Cash' : 'Net Debt'})
              </span>
            </span>
          </div>

          <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80">
            <span className="text-zinc-500 block font-medium">Diluted Shares</span>
            <span className="text-sm font-bold text-zinc-200 font-mono mt-0.5 block">
              {(fundamentals.sharesOutstanding / 1e9).toFixed(3)}B
            </span>
          </div>
        </div>

        {/* Expandable Manual Inputs Override Form */}
        {showEditFundamentals && (
          <div className="pt-4 mt-4 border-t border-zinc-800 space-y-3 bg-zinc-950/60 p-4 rounded-xl border border-zinc-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" />
                Custom Baseline Overrides (Modify values to test hypothetical balance sheets)
              </span>
              <button
                onClick={() => {
                  const def = POPULAR_TICKERS[fundamentals.symbol] || POPULAR_TICKERS['AAPL'];
                  setFundamentals(def);
                }}
                className="text-[11px] text-zinc-400 hover:text-white underline cursor-pointer"
              >
                Reset Company Baseline
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Current Stock Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={fundamentals.currentPrice}
                  onChange={(e) =>
                    setFundamentals({ ...fundamentals, currentPrice: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full bg-zinc-900 text-white font-mono p-2 rounded-lg border border-zinc-700"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">TTM Free Cash Flow ($)</label>
                <input
                  type="number"
                  value={fundamentals.freeCashFlow}
                  onChange={(e) =>
                    setFundamentals({ ...fundamentals, freeCashFlow: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full bg-zinc-900 text-white font-mono p-2 rounded-lg border border-zinc-700"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Total Cash & Equivalents ($)</label>
                <input
                  type="number"
                  value={fundamentals.totalCash}
                  onChange={(e) =>
                    setFundamentals({ ...fundamentals, totalCash: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full bg-zinc-900 text-white font-mono p-2 rounded-lg border border-zinc-700"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Total Debt ($)</label>
                <input
                  type="number"
                  value={fundamentals.totalDebt}
                  onChange={(e) =>
                    setFundamentals({ ...fundamentals, totalDebt: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full bg-zinc-900 text-white font-mono p-2 rounded-lg border border-zinc-700"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Shares Outstanding</label>
                <input
                  type="number"
                  value={fundamentals.sharesOutstanding}
                  onChange={(e) =>
                    setFundamentals({ ...fundamentals, sharesOutstanding: parseFloat(e.target.value) || 1 })
                  }
                  className="w-full bg-zinc-900 text-white font-mono p-2 rounded-lg border border-zinc-700"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3-Column Scenario Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. BEAR SCENARIO CARD */}
        <div className="glass-panel-glow rounded-3xl p-6 border border-rose-500/30 bg-gradient-to-b from-rose-950/20 via-zinc-900/40 to-zinc-900/80 flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-5">
            {/* Header Badge */}
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/30">
                <TrendingDown className="w-3.5 h-3.5" />
                <span>Bear Case</span>
              </div>
              <span className="text-[11px] text-zinc-500 font-mono">Conservative</span>
            </div>

            {/* Hero Target Price Display */}
            <div className="bg-zinc-950/60 p-4 rounded-2xl border border-rose-900/30 text-center space-y-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-zinc-400 block">
                Implied Target Price
              </span>
              <div className="text-3xl sm:text-4xl font-black text-rose-400 font-mono">
                {formatCurrency(bearResult.impliedPrice, fundamentals.currency)}
              </div>

              <div className="flex items-center justify-center gap-2 pt-1">
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-md font-mono ${
                    bearResult.upsideDownsidePercent >= 0
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {bearResult.upsideDownsidePercent >= 0 ? '+' : ''}
                  {bearResult.upsideDownsidePercent.toFixed(1)}% Upside
                </span>

                <span className="text-xs font-medium text-zinc-400 bg-zinc-900 px-2 py-1 rounded-md border border-zinc-800">
                  CAGR: {formatPercent(bearResult.fiveYearCAGR, true)}
                </span>
              </div>
            </div>

            {/* Slider & Numeric Controls */}
            <div className="space-y-4 pt-2 text-xs">
              {/* Growth Rate Control */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-zinc-300">
                  <span className="font-medium flex items-center gap-1">
                    FCF Growth (Y1-Y5)
                    <span className="text-zinc-500" title="Expected annual compounding growth in Free Cash Flow">(g)</span>
                  </span>
                  <span className="font-mono font-bold text-rose-400">
                    {(bearParams.growthRate * 100).toFixed(1)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="-0.15"
                  max="0.40"
                  step="0.005"
                  value={bearParams.growthRate}
                  onChange={(e) =>
                    setBearParams({ ...bearParams, growthRate: parseFloat(e.target.value) })
                  }
                  className="w-full accent-rose-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
                />
              </div>

              {/* Discount Rate / WACC Control */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-zinc-300">
                  <span className="font-medium flex items-center gap-1">
                    Discount Rate (WACC)
                    <span className="text-zinc-500" title="Required rate of return / cost of capital">(r)</span>
                  </span>
                  <span className="font-mono font-bold text-zinc-200">
                    {(bearParams.discountRate * 100).toFixed(2)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.20"
                  step="0.0025"
                  value={bearParams.discountRate}
                  onChange={(e) =>
                    setBearParams({ ...bearParams, discountRate: parseFloat(e.target.value) })
                  }
                  className="w-full accent-zinc-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
                />
              </div>

              {/* Terminal Exit Multiple */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-zinc-300">
                  <span className="font-medium flex items-center gap-1">
                    Terminal Exit Multiple
                    <span className="text-zinc-500" title="Price-to-FCF multiple applied to Year 5 FCF">(P/FCF)</span>
                  </span>
                  <span className="font-mono font-bold text-zinc-200">
                    {bearParams.exitMultiple.toFixed(0)}x
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="45"
                  step="1"
                  value={bearParams.exitMultiple}
                  onChange={(e) =>
                    setBearParams({ ...bearParams, exitMultiple: parseInt(e.target.value) })
                  }
                  className="w-full accent-zinc-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Card Summary Breakdown */}
          <div className="mt-5 pt-4 border-t border-zinc-800/80 space-y-1.5 text-[11px] text-zinc-400">
            <div className="flex justify-between">
              <span>PV of 5-Yr Cash Flows:</span>
              <span className="font-mono text-zinc-200">{formatLargeNumber(bearResult.sumDiscountedFCF)}</span>
            </div>
            <div className="flex justify-between">
              <span>PV of Terminal Value:</span>
              <span className="font-mono text-zinc-200">{formatLargeNumber(bearResult.discountedTerminalValue)}</span>
            </div>
            <div className="flex justify-between font-semibold text-zinc-200 pt-1 border-t border-zinc-800/40">
              <span>Implied Enterprise Value:</span>
              <span className="font-mono text-rose-300">{formatLargeNumber(bearResult.enterpriseValue)}</span>
            </div>
          </div>
        </div>

        {/* 2. BASE SCENARIO CARD */}
        <div className="glass-panel-glow rounded-3xl p-6 border-2 border-blue-500/40 bg-gradient-to-b from-blue-950/30 via-zinc-900/50 to-zinc-900/90 flex flex-col justify-between relative overflow-hidden shadow-2xl ring-1 ring-blue-500/20">
          <div className="space-y-5">
            {/* Header Badge */}
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/30">
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Base Case (Consensus)</span>
              </div>
              <span className="text-[11px] text-indigo-400 font-mono font-semibold">Primary Target</span>
            </div>

            {/* Hero Target Price Display */}
            <div className="bg-zinc-950/70 p-4 rounded-2xl border border-blue-900/40 text-center space-y-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-zinc-400 block">
                Implied Target Price
              </span>
              <div className="text-3xl sm:text-4xl font-black text-blue-400 font-mono">
                {formatCurrency(baseResult.impliedPrice, fundamentals.currency)}
              </div>

              <div className="flex items-center justify-center gap-2 pt-1">
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-md font-mono ${
                    baseResult.upsideDownsidePercent >= 0
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {baseResult.upsideDownsidePercent >= 0 ? '+' : ''}
                  {baseResult.upsideDownsidePercent.toFixed(1)}% Upside
                </span>

                <span className="text-xs font-medium text-zinc-300 bg-zinc-900 px-2 py-1 rounded-md border border-zinc-800">
                  CAGR: {formatPercent(baseResult.fiveYearCAGR, true)}
                </span>
              </div>
            </div>

            {/* Slider & Numeric Controls */}
            <div className="space-y-4 pt-2 text-xs">
              {/* Growth Rate Control */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-zinc-300">
                  <span className="font-medium flex items-center gap-1">
                    FCF Growth (Y1-Y5)
                    <span className="text-zinc-500" title="Expected annual compounding growth in Free Cash Flow">(g)</span>
                  </span>
                  <span className="font-mono font-bold text-blue-400">
                    {(baseParams.growthRate * 100).toFixed(1)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="-0.15"
                  max="0.45"
                  step="0.005"
                  value={baseParams.growthRate}
                  onChange={(e) =>
                    setBaseParams({ ...baseParams, growthRate: parseFloat(e.target.value) })
                  }
                  className="w-full accent-blue-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
                />
              </div>

              {/* Discount Rate / WACC Control */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-zinc-300">
                  <span className="font-medium flex items-center gap-1">
                    Discount Rate (WACC)
                    <span className="text-zinc-500" title="Required rate of return / cost of capital">(r)</span>
                  </span>
                  <span className="font-mono font-bold text-zinc-200">
                    {(baseParams.discountRate * 100).toFixed(2)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.20"
                  step="0.0025"
                  value={baseParams.discountRate}
                  onChange={(e) =>
                    setBaseParams({ ...baseParams, discountRate: parseFloat(e.target.value) })
                  }
                  className="w-full accent-blue-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
                />
              </div>

              {/* Terminal Exit Multiple */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-zinc-300">
                  <span className="font-medium flex items-center gap-1">
                    Terminal Exit Multiple
                    <span className="text-zinc-500" title="Price-to-FCF multiple applied to Year 5 FCF">(P/FCF)</span>
                  </span>
                  <span className="font-mono font-bold text-zinc-200">
                    {baseParams.exitMultiple.toFixed(0)}x
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="1"
                  value={baseParams.exitMultiple}
                  onChange={(e) =>
                    setBaseParams({ ...baseParams, exitMultiple: parseInt(e.target.value) })
                  }
                  className="w-full accent-blue-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Card Summary Breakdown */}
          <div className="mt-5 pt-4 border-t border-zinc-800/80 space-y-1.5 text-[11px] text-zinc-400">
            <div className="flex justify-between">
              <span>PV of 5-Yr Cash Flows:</span>
              <span className="font-mono text-zinc-200">{formatLargeNumber(baseResult.sumDiscountedFCF)}</span>
            </div>
            <div className="flex justify-between">
              <span>PV of Terminal Value:</span>
              <span className="font-mono text-zinc-200">{formatLargeNumber(baseResult.discountedTerminalValue)}</span>
            </div>
            <div className="flex justify-between font-semibold text-zinc-200 pt-1 border-t border-zinc-800/40">
              <span>Implied Enterprise Value:</span>
              <span className="font-mono text-blue-300">{formatLargeNumber(baseResult.enterpriseValue)}</span>
            </div>
          </div>
        </div>

        {/* 3. BULL SCENARIO CARD */}
        <div className="glass-panel-glow rounded-3xl p-6 border border-emerald-500/30 bg-gradient-to-b from-emerald-950/20 via-zinc-900/40 to-zinc-900/80 flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-5">
            {/* Header Badge */}
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Bull Case</span>
              </div>
              <span className="text-[11px] text-zinc-500 font-mono">Optimistic</span>
            </div>

            {/* Hero Target Price Display */}
            <div className="bg-zinc-950/60 p-4 rounded-2xl border border-emerald-900/30 text-center space-y-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-zinc-400 block">
                Implied Target Price
              </span>
              <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono">
                {formatCurrency(bullResult.impliedPrice, fundamentals.currency)}
              </div>

              <div className="flex items-center justify-center gap-2 pt-1">
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-md font-mono ${
                    bullResult.upsideDownsidePercent >= 0
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {bullResult.upsideDownsidePercent >= 0 ? '+' : ''}
                  {bullResult.upsideDownsidePercent.toFixed(1)}% Upside
                </span>

                <span className="text-xs font-medium text-zinc-400 bg-zinc-900 px-2 py-1 rounded-md border border-zinc-800">
                  CAGR: {formatPercent(bullResult.fiveYearCAGR, true)}
                </span>
              </div>
            </div>

            {/* Slider & Numeric Controls */}
            <div className="space-y-4 pt-2 text-xs">
              {/* Growth Rate Control */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-zinc-300">
                  <span className="font-medium flex items-center gap-1">
                    FCF Growth (Y1-Y5)
                    <span className="text-zinc-500" title="Expected annual compounding growth in Free Cash Flow">(g)</span>
                  </span>
                  <span className="font-mono font-bold text-emerald-400">
                    {(bullParams.growthRate * 100).toFixed(1)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="-0.05"
                  max="0.55"
                  step="0.005"
                  value={bullParams.growthRate}
                  onChange={(e) =>
                    setBullParams({ ...bullParams, growthRate: parseFloat(e.target.value) })
                  }
                  className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
                />
              </div>

              {/* Discount Rate / WACC Control */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-zinc-300">
                  <span className="font-medium flex items-center gap-1">
                    Discount Rate (WACC)
                    <span className="text-zinc-500" title="Required rate of return / cost of capital">(r)</span>
                  </span>
                  <span className="font-mono font-bold text-zinc-200">
                    {(bullParams.discountRate * 100).toFixed(2)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.20"
                  step="0.0025"
                  value={bullParams.discountRate}
                  onChange={(e) =>
                    setBullParams({ ...bullParams, discountRate: parseFloat(e.target.value) })
                  }
                  className="w-full accent-zinc-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
                />
              </div>

              {/* Terminal Exit Multiple */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-zinc-300">
                  <span className="font-medium flex items-center gap-1">
                    Terminal Exit Multiple
                    <span className="text-zinc-500" title="Price-to-FCF multiple applied to Year 5 FCF">(P/FCF)</span>
                  </span>
                  <span className="font-mono font-bold text-zinc-200">
                    {bullParams.exitMultiple.toFixed(0)}x
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="1"
                  value={bullParams.exitMultiple}
                  onChange={(e) =>
                    setBullParams({ ...bullParams, exitMultiple: parseInt(e.target.value) })
                  }
                  className="w-full accent-zinc-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Card Summary Breakdown */}
          <div className="mt-5 pt-4 border-t border-zinc-800/80 space-y-1.5 text-[11px] text-zinc-400">
            <div className="flex justify-between">
              <span>PV of 5-Yr Cash Flows:</span>
              <span className="font-mono text-zinc-200">{formatLargeNumber(bullResult.sumDiscountedFCF)}</span>
            </div>
            <div className="flex justify-between">
              <span>PV of Terminal Value:</span>
              <span className="font-mono text-zinc-200">{formatLargeNumber(bullResult.discountedTerminalValue)}</span>
            </div>
            <div className="flex justify-between font-semibold text-zinc-200 pt-1 border-t border-zinc-800/40">
              <span>Implied Enterprise Value:</span>
              <span className="font-mono text-emerald-300">{formatLargeNumber(bullResult.enterpriseValue)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison & Yearly Breakdown Section */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-zinc-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              <span>Valuation Walkdown & Cash Flow Schedule</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Granular year-by-year cash flow projections (Years 1 to 5) and bridge to Equity Value per share.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800 self-start">
            {(['comparison', 'base', 'bear', 'bull'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {tab === 'comparison' ? '3-Case Bridge' : `${tab} Case`}
              </button>
            ))}
          </div>
        </div>

        {/* 1. THREE-SCENARIO VALUATION COMPARISON TABLE */}
        {activeTab === 'comparison' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400">
                  <th className="py-3 px-4 font-sans font-semibold">DCF Valuation Metric</th>
                  <th className="py-3 px-4 text-rose-400 font-sans font-semibold">Bear Case</th>
                  <th className="py-3 px-4 text-blue-400 font-sans font-semibold">Base Case</th>
                  <th className="py-3 px-4 text-emerald-400 font-sans font-semibold">Bull Case</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                <tr>
                  <td className="py-2.5 px-4 font-sans text-zinc-400">Annual Growth Rate (Y1-Y5)</td>
                  <td className="py-2.5 px-4 text-rose-300">{(bearParams.growthRate * 100).toFixed(1)}%</td>
                  <td className="py-2.5 px-4 text-blue-300">{(baseParams.growthRate * 100).toFixed(1)}%</td>
                  <td className="py-2.5 px-4 text-emerald-300">{(bullParams.growthRate * 100).toFixed(1)}%</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-sans text-zinc-400">Discount Rate / WACC (r)</td>
                  <td className="py-2.5 px-4">{(bearParams.discountRate * 100).toFixed(2)}%</td>
                  <td className="py-2.5 px-4">{(baseParams.discountRate * 100).toFixed(2)}%</td>
                  <td className="py-2.5 px-4">{(bullParams.discountRate * 100).toFixed(2)}%</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-sans text-zinc-400">Terminal P/FCF Exit Multiple</td>
                  <td className="py-2.5 px-4">{bearParams.exitMultiple}x</td>
                  <td className="py-2.5 px-4">{baseParams.exitMultiple}x</td>
                  <td className="py-2.5 px-4">{bullParams.exitMultiple}x</td>
                </tr>
                <tr className="bg-zinc-900/40">
                  <td className="py-2.5 px-4 font-sans text-zinc-300 font-medium">Sum of Discounted 5Y FCFs</td>
                  <td className="py-2.5 px-4 text-zinc-100">{formatLargeNumber(bearResult.sumDiscountedFCF)}</td>
                  <td className="py-2.5 px-4 text-zinc-100">{formatLargeNumber(baseResult.sumDiscountedFCF)}</td>
                  <td className="py-2.5 px-4 text-zinc-100">{formatLargeNumber(bullResult.sumDiscountedFCF)}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-sans text-zinc-400">Year 5 Terminal Value (Nominal)</td>
                  <td className="py-2.5 px-4">{formatLargeNumber(bearResult.terminalValue)}</td>
                  <td className="py-2.5 px-4">{formatLargeNumber(baseResult.terminalValue)}</td>
                  <td className="py-2.5 px-4">{formatLargeNumber(bullResult.terminalValue)}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-sans text-zinc-400">Present Value of Terminal Value</td>
                  <td className="py-2.5 px-4 text-zinc-200">{formatLargeNumber(bearResult.discountedTerminalValue)}</td>
                  <td className="py-2.5 px-4 text-zinc-200">{formatLargeNumber(baseResult.discountedTerminalValue)}</td>
                  <td className="py-2.5 px-4 text-zinc-200">{formatLargeNumber(bullResult.discountedTerminalValue)}</td>
                </tr>
                <tr className="bg-zinc-900/60 font-semibold">
                  <td className="py-3 px-4 font-sans text-zinc-200">Implied Enterprise Value (EV)</td>
                  <td className="py-3 px-4 text-rose-300">{formatLargeNumber(bearResult.enterpriseValue)}</td>
                  <td className="py-3 px-4 text-blue-300">{formatLargeNumber(baseResult.enterpriseValue)}</td>
                  <td className="py-3 px-4 text-emerald-300">{formatLargeNumber(bullResult.enterpriseValue)}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-sans text-zinc-400">+ Cash & Equivalents</td>
                  <td className="py-2.5 px-4 text-zinc-400">+{formatLargeNumber(fundamentals.totalCash)}</td>
                  <td className="py-2.5 px-4 text-zinc-400">+{formatLargeNumber(fundamentals.totalCash)}</td>
                  <td className="py-2.5 px-4 text-zinc-400">+{formatLargeNumber(fundamentals.totalCash)}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-sans text-zinc-400">- Total Short & Long-Term Debt</td>
                  <td className="py-2.5 px-4 text-zinc-400">-{formatLargeNumber(fundamentals.totalDebt)}</td>
                  <td className="py-2.5 px-4 text-zinc-400">-{formatLargeNumber(fundamentals.totalDebt)}</td>
                  <td className="py-2.5 px-4 text-zinc-400">-{formatLargeNumber(fundamentals.totalDebt)}</td>
                </tr>
                <tr className="bg-zinc-900/60 font-bold">
                  <td className="py-3 px-4 font-sans text-zinc-200">Implied Equity Value</td>
                  <td className="py-3 px-4 text-rose-300">{formatLargeNumber(bearResult.equityValue)}</td>
                  <td className="py-3 px-4 text-blue-300">{formatLargeNumber(baseResult.equityValue)}</td>
                  <td className="py-3 px-4 text-emerald-300">{formatLargeNumber(bullResult.equityValue)}</td>
                </tr>
                <tr className="bg-indigo-950/30 border-t-2 border-indigo-500/40 font-black text-sm">
                  <td className="py-3.5 px-4 font-sans text-white">Implied Share Price</td>
                  <td className="py-3.5 px-4 text-rose-400">{formatCurrency(bearResult.impliedPrice, fundamentals.currency)}</td>
                  <td className="py-3.5 px-4 text-blue-400">{formatCurrency(baseResult.impliedPrice, fundamentals.currency)}</td>
                  <td className="py-3.5 px-4 text-emerald-400">{formatCurrency(bullResult.impliedPrice, fundamentals.currency)}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-sans text-zinc-400">Margin of Safety / Upside %</td>
                  <td className={`py-2.5 px-4 font-bold ${bearResult.upsideDownsidePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {bearResult.upsideDownsidePercent >= 0 ? '+' : ''}{bearResult.upsideDownsidePercent.toFixed(1)}%
                  </td>
                  <td className={`py-2.5 px-4 font-bold ${baseResult.upsideDownsidePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {baseResult.upsideDownsidePercent >= 0 ? '+' : ''}{baseResult.upsideDownsidePercent.toFixed(1)}%
                  </td>
                  <td className={`py-2.5 px-4 font-bold ${bullResult.upsideDownsidePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {bullResult.upsideDownsidePercent >= 0 ? '+' : ''}{bullResult.upsideDownsidePercent.toFixed(1)}%
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-sans text-zinc-400">5-Year Projected CAGR</td>
                  <td className="py-2.5 px-4 text-zinc-200">{formatPercent(bearResult.fiveYearCAGR, true)}</td>
                  <td className="py-2.5 px-4 text-zinc-200">{formatPercent(baseResult.fiveYearCAGR, true)}</td>
                  <td className="py-2.5 px-4 text-zinc-200">{formatPercent(bullResult.fiveYearCAGR, true)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* 2. YEARLY CASH FLOW BREAKDOWN (SINGLE SCENARIO TABS) */}
        {activeTab !== 'comparison' && (
          <div className="space-y-4">
            {(() => {
              const res =
                activeTab === 'bear'
                  ? bearResult
                  : activeTab === 'bull'
                  ? bullResult
                  : baseResult;

              return (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse font-mono">
                    <thead>
                      <tr className="border-b border-zinc-800 text-zinc-400">
                        <th className="py-3 px-4 font-sans font-semibold">Projection Period</th>
                        <th className="py-3 px-4 font-sans font-semibold">Projected FCF</th>
                        <th className="py-3 px-4 font-sans font-semibold">Discount Factor (1+r)^-t</th>
                        <th className="py-3 px-4 font-sans font-semibold text-right">Present Value (PV)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                      <tr className="bg-zinc-900/30 text-zinc-400">
                        <td className="py-2.5 px-4 font-sans">Base TTM Period (Year 0)</td>
                        <td className="py-2.5 px-4 text-emerald-400">{formatLargeNumber(fundamentals.freeCashFlow)}</td>
                        <td className="py-2.5 px-4">1.0000</td>
                        <td className="py-2.5 px-4 text-right">{formatLargeNumber(fundamentals.freeCashFlow)}</td>
                      </tr>
                      {res.yearlyProjections.map((proj) => (
                        <tr key={proj.year} className="hover:bg-zinc-900/40">
                          <td className="py-2.5 px-4 font-sans font-medium text-zinc-200">
                            Year {proj.year} Projection
                          </td>
                          <td className="py-2.5 px-4 text-emerald-300">
                            {formatLargeNumber(proj.projectedFCF)}
                          </td>
                          <td className="py-2.5 px-4 text-zinc-400">
                            {proj.discountFactor.toFixed(4)}
                          </td>
                          <td className="py-2.5 px-4 text-right font-bold text-zinc-100">
                            {formatLargeNumber(proj.discountedFCF)}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-zinc-900/60 font-semibold border-t-2 border-zinc-700">
                        <td className="py-3 px-4 font-sans text-zinc-200" colSpan={3}>
                          Cumulative 5-Year Present Value of Cash Flows:
                        </td>
                        <td className="py-3 px-4 text-right text-indigo-300">
                          {formatLargeNumber(res.sumDiscountedFCF)}
                        </td>
                      </tr>
                      <tr className="bg-zinc-900/40">
                        <td className="py-3 px-4 font-sans text-zinc-300" colSpan={2}>
                          Terminal Value at Year 5 ({res.params.exitMultiple}x exit multiple):
                        </td>
                        <td className="py-3 px-4 text-zinc-400">
                          Discount Factor: {(1 / Math.pow(1 + res.params.discountRate, 5)).toFixed(4)}
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-zinc-100">
                          {formatLargeNumber(res.discountedTerminalValue)}
                        </td>
                      </tr>
                      <tr className="bg-indigo-950/40 font-black text-sm border-t border-indigo-500/40">
                        <td className="py-3.5 px-4 font-sans text-white" colSpan={3}>
                          Total Enterprise Value (PV Cash Flows + PV Terminal Value):
                        </td>
                        <td className="py-3.5 px-4 text-right text-indigo-300">
                          {formatLargeNumber(res.enterpriseValue)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* Educational Tooltips & Financial Reference Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="glass-panel p-5 rounded-2xl border border-zinc-800 space-y-2">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
            <HelpCircle className="w-4 h-4" />
            <h4>Discount Rate (WACC)</h4>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            The Weighted Average Cost of Capital representing the hurdle rate required by investors to account for the time value of money and operational business risk. Higher discount rates result in lower present values.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-zinc-800 space-y-2">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
            <HelpCircle className="w-4 h-4" />
            <h4>Terminal Exit Multiple</h4>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            The hypothetical valuation multiple applied to Year 5 Free Cash Flow (P/FCF) to capture the residual perpetuity value of the business beyond the 5-year discrete projection horizon.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-zinc-800 space-y-2">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
            <HelpCircle className="w-4 h-4" />
            <h4>Net Debt Adjustment</h4>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Equity Value equals Enterprise Value plus Total Cash minus Total Debt (Equity Value = EV + Cash - Debt). Companies holding net cash increase intrinsic value per share.
          </p>
        </div>
      </div>
    </div>
  );
}
