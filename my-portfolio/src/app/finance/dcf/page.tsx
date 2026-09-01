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
  Lock,
  RefreshCw,
  Search,
  Sliders,
  TrendingDown,
  TrendingUp,
  Zap,
} from 'lucide-react';
import {
  CompanyFundamentals,
  AllScenariosState,
  ScenarioInputs,
  calculateEPSScenario,
  getDefaultScenarioPresets,
  updateScenarioWithConstraints,
  formatCurrency,
  formatLargeNumber,
  formatPercent,
  POPULAR_TICKERS,
} from '@/lib/dcf';

const QUICK_TICKERS = ['AAPL', 'QCOM', 'AMZN', 'VST', 'OKTA', 'PLTR', 'NVDA', 'MSFT'];

export default function EPSValuationCalculatorPage() {
  const [tickerInput, setTickerInput] = useState('AAPL');
  const [activeTicker, setActiveTicker] = useState('AAPL');
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<string>('preset');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showEditFundamentals, setShowEditFundamentals] = useState(false);
  const [activeTab, setActiveTab] = useState<'comparison' | 'base' | 'bear' | 'bull'>('comparison');

  // Company Baseline Fundamentals State
  const [fundamentals, setFundamentals] = useState<CompanyFundamentals>(POPULAR_TICKERS['AAPL']);

  // All 3 Scenarios State (Interlocked via floor & ceiling constraint manager)
  const [scenarios, setScenarios] = useState<AllScenariosState>(() =>
    getDefaultScenarioPresets(POPULAR_TICKERS['AAPL'])
  );

  // Fetch ticker data from API (works for ANY valid ticker)
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
        setDataSource(json.source || 'yfinance');

        // Populate initial scenario presets derived from ticker financials
        const presets = getDefaultScenarioPresets(data);
        setScenarios(presets);
      } else {
        setErrorMsg(json.error || 'Unable to retrieve financial metrics for ticker');
      }
    } catch {
      setErrorMsg('Network error fetching ticker data. Falling back to local data.');
      if (POPULAR_TICKERS[symbolToFetch.toUpperCase()]) {
        const fallback = POPULAR_TICKERS[symbolToFetch.toUpperCase()];
        setFundamentals(fallback);
        setActiveTicker(fallback.symbol);
        setScenarios(getDefaultScenarioPresets(fallback));
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
    const presets = getDefaultScenarioPresets(fundamentals);
    setScenarios(presets);
  };

  // Interlocked Floor & Ceiling Input Handler
  const handleScenarioChange = (
    targetCase: 'bear' | 'base' | 'bull',
    field: keyof ScenarioInputs,
    value: number
  ) => {
    setScenarios((prev) => updateScenarioWithConstraints(prev, targetCase, field, value));
  };

  // Run 5-Year EPS Math Engine on current state
  const bearResult = useMemo(
    () => calculateEPSScenario(fundamentals, scenarios.bear),
    [fundamentals, scenarios.bear]
  );
  const baseResult = useMemo(
    () => calculateEPSScenario(fundamentals, scenarios.base),
    [fundamentals, scenarios.base]
  );
  const bullResult = useMemo(
    () => calculateEPSScenario(fundamentals, scenarios.bull),
    [fundamentals, scenarios.bull]
  );

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
              5-Year EPS & Revenue Valuation Calculator
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl">
            Intuitive 5-year valuation model projecting Revenue, Net Margins, and EPS into Year 5 target prices with interlocked floor &amp; ceiling scenario controls.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg border border-zinc-800 transition-colors cursor-pointer"
            title="Reset to recommended ticker scenario presets"
          >
            <RefreshCw className="w-3.5 h-3.5 text-zinc-400" />
            <span>Reset Presets</span>
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
              placeholder="Search ANY stock ticker (e.g. AAPL, QCOM, AMZN, VST, OKTA, PLTR)..."
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
                <span>Fetching Live Data...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Fetch Ticker</span>
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
              className={`px-2.5 py-1 rounded-lg font-mono font-semibold transition-all cursor-pointer ${
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

      {/* Company Stat Bar */}
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
              className="p-2 text-xs font-medium text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg border border-zinc-800 transition-colors inline-flex items-center gap-1 cursor-pointer"
              title="Edit baseline company inputs"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{showEditFundamentals ? 'Hide Baseline' : 'Edit Baseline'}</span>
              {showEditFundamentals ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-xs">
          <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80">
            <span className="text-zinc-500 block font-medium">Current P/E</span>
            <span className="text-sm font-bold text-zinc-100 font-mono mt-0.5 block">
              {fundamentals.trailingPE > 0 ? `${fundamentals.trailingPE.toFixed(1)}x` : 'N/A'}
            </span>
          </div>

          <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80">
            <span className="text-zinc-500 block font-medium">TTM Revenue</span>
            <span className="text-sm font-bold text-blue-400 font-mono mt-0.5 block">
              {formatLargeNumber(fundamentals.totalRevenue)}
            </span>
          </div>

          <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80">
            <span className="text-zinc-500 block font-medium">Net Profit Margin</span>
            <span className="text-sm font-bold text-emerald-400 font-mono mt-0.5 block">
              {(fundamentals.profitMargins * 100).toFixed(1)}%
            </span>
          </div>

          <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80">
            <span className="text-zinc-500 block font-medium">Current EPS (TTM)</span>
            <span className="text-sm font-bold text-zinc-100 font-mono mt-0.5 block">
              ${fundamentals.trailingEps.toFixed(2)}
            </span>
          </div>

          <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80">
            <span className="text-zinc-500 block font-medium">Diluted Shares</span>
            <span className="text-sm font-bold text-zinc-200 font-mono mt-0.5 block">
              {fundamentals.sharesOutstanding >= 1e9
                ? `${(fundamentals.sharesOutstanding / 1e9).toFixed(2)}B`
                : `${(fundamentals.sharesOutstanding / 1e6).toFixed(1)}M`}
            </span>
          </div>

          <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80">
            <span className="text-zinc-500 block font-medium">Market Cap</span>
            <span className="text-sm font-bold text-zinc-200 font-mono mt-0.5 block">
              {formatLargeNumber(fundamentals.currentPrice * fundamentals.sharesOutstanding)}
            </span>
          </div>
        </div>

        {/* Expandable Baseline Overrides */}
        {showEditFundamentals && (
          <div className="pt-4 mt-4 border-t border-zinc-800 space-y-3 bg-zinc-950/60 p-4 rounded-xl border border-zinc-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" />
                Custom Baseline Financials (Modify underlying figures for hypothetical pro-forma modeling)
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
                <label className="text-zinc-400 block mb-1">TTM Revenue ($)</label>
                <input
                  type="number"
                  value={fundamentals.totalRevenue}
                  onChange={(e) =>
                    setFundamentals({ ...fundamentals, totalRevenue: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full bg-zinc-900 text-white font-mono p-2 rounded-lg border border-zinc-700"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Net Margin (Decimal, e.g. 0.20)</label>
                <input
                  type="number"
                  step="0.01"
                  value={fundamentals.profitMargins}
                  onChange={(e) =>
                    setFundamentals({ ...fundamentals, profitMargins: parseFloat(e.target.value) || 0 })
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

              <div>
                <label className="text-zinc-400 block mb-1">Current P/E</label>
                <input
                  type="number"
                  step="0.1"
                  value={fundamentals.trailingPE}
                  onChange={(e) =>
                    setFundamentals({ ...fundamentals, trailingPE: parseFloat(e.target.value) || 20 })
                  }
                  className="w-full bg-zinc-900 text-white font-mono p-2 rounded-lg border border-zinc-700"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Constraint Mechanism Callout Banner */}
      <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-indigo-300">
        <Lock className="w-4 h-4 text-indigo-400 flex-shrink-0" />
        <span>
          <strong>Harmonized Floor &amp; Ceiling Constraints Active:</strong> Bear inputs serve as a floor for Base/Bull, while Bull inputs serve as a ceiling. Adjusting any boundary dynamically guides adjacent scenarios.
        </span>
      </div>

      {/* 3-Column Scenario Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. BEAR SCENARIO CARD */}
        <div className="glass-panel-glow rounded-3xl p-6 border border-rose-500/40 bg-gradient-to-b from-rose-950/20 via-zinc-900/40 to-zinc-900/90 flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-5">
            {/* Header Badge */}
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/30">
                <TrendingDown className="w-3.5 h-3.5" />
                <span>Bear Case</span>
              </div>
              <span className="text-[11px] text-zinc-500 font-mono">Conservative Floor</span>
            </div>

            {/* Hero Target Price Display */}
            <div className="bg-zinc-950/70 p-4 rounded-2xl border border-rose-900/40 text-center space-y-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-zinc-400 block">
                Year 5 Target Price
              </span>
              <div className="text-3xl sm:text-4xl font-black text-rose-400 font-mono">
                {formatCurrency(bearResult.year5TargetPrice, fundamentals.currency)}
              </div>

              <div className="flex items-center justify-center gap-2 pt-1">
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-md font-mono ${
                    bearResult.totalReturnPercent >= 0
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {bearResult.totalReturnPercent >= 0 ? '+' : ''}
                  {bearResult.totalReturnPercent.toFixed(1)}% Return
                </span>

                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-md font-mono ${
                    bearResult.fiveYearCAGRPercent >= 0
                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                      : 'bg-rose-950/60 text-rose-400 border border-rose-800/40'
                  }`}
                >
                  CAGR: {formatPercent(bearResult.fiveYearCAGRPercent, true)}/yr
                </span>
              </div>
            </div>

            {/* Interactive Sliders & Numeric Inputs */}
            <div className="space-y-4 pt-2 text-xs">
              {/* Revenue Growth Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-zinc-300">
                  <span className="font-medium">Annual Revenue Growth</span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      step="0.5"
                      value={(scenarios.bear.growthRate * 100).toFixed(1)}
                      onChange={(e) =>
                        handleScenarioChange('bear', 'growthRate', (parseFloat(e.target.value) || 0) / 100)
                      }
                      className="w-16 text-right bg-zinc-900 border border-zinc-700 text-rose-400 font-mono font-bold px-1.5 py-0.5 rounded"
                    />
                    <span className="text-zinc-500 font-mono">%</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="-0.10"
                  max="0.40"
                  step="0.005"
                  value={scenarios.bear.growthRate}
                  onChange={(e) =>
                    handleScenarioChange('bear', 'growthRate', parseFloat(e.target.value))
                  }
                  className="w-full accent-rose-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
                />
              </div>

              {/* Net Margin Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-zinc-300">
                  <span className="font-medium">Target Net Margin</span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      step="0.5"
                      value={(scenarios.bear.netMargin * 100).toFixed(1)}
                      onChange={(e) =>
                        handleScenarioChange('bear', 'netMargin', (parseFloat(e.target.value) || 0) / 100)
                      }
                      className="w-16 text-right bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono font-bold px-1.5 py-0.5 rounded"
                    />
                    <span className="text-zinc-500 font-mono">%</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="0.01"
                  max="0.60"
                  step="0.005"
                  value={scenarios.bear.netMargin}
                  onChange={(e) =>
                    handleScenarioChange('bear', 'netMargin', parseFloat(e.target.value))
                  }
                  className="w-full accent-zinc-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
                />
              </div>

              {/* Exit P/E Multiple Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-zinc-300">
                  <span className="font-medium">Exit P/E Multiple</span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      step="1"
                      value={scenarios.bear.exitPE}
                      onChange={(e) =>
                        handleScenarioChange('bear', 'exitPE', parseInt(e.target.value) || 5)
                      }
                      className="w-14 text-right bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono font-bold px-1.5 py-0.5 rounded"
                    />
                    <span className="text-zinc-500 font-mono">x</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="1"
                  value={scenarios.bear.exitPE}
                  onChange={(e) =>
                    handleScenarioChange('bear', 'exitPE', parseInt(e.target.value))
                  }
                  className="w-full accent-zinc-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Card Summary Breakdown */}
          <div className="mt-5 pt-4 border-t border-zinc-800/80 space-y-1.5 text-[11px] text-zinc-400">
            <div className="flex justify-between">
              <span>Year 5 Revenue:</span>
              <span className="font-mono text-zinc-200">{formatLargeNumber(bearResult.year5Revenue)}</span>
            </div>
            <div className="flex justify-between">
              <span>Year 5 Net Income:</span>
              <span className="font-mono text-zinc-200">{formatLargeNumber(bearResult.year5NetIncome)}</span>
            </div>
            <div className="flex justify-between font-semibold text-zinc-200 pt-1 border-t border-zinc-800/40">
              <span>Year 5 EPS:</span>
              <span className="font-mono text-rose-300">${bearResult.year5EPS.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* 2. BASE SCENARIO CARD */}
        <div className="glass-panel-glow rounded-3xl p-6 border-2 border-amber-500/50 bg-gradient-to-b from-amber-950/20 via-zinc-900/50 to-zinc-900/90 flex flex-col justify-between relative overflow-hidden shadow-2xl ring-1 ring-amber-500/20">
          <div className="space-y-5">
            {/* Header Badge */}
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30">
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Base Case (Consensus)</span>
              </div>
              <span className="text-[11px] text-amber-400 font-mono font-semibold">Primary Target</span>
            </div>

            {/* Hero Target Price Display */}
            <div className="bg-zinc-950/70 p-4 rounded-2xl border border-amber-900/40 text-center space-y-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-zinc-400 block">
                Year 5 Target Price
              </span>
              <div className="text-3xl sm:text-4xl font-black text-amber-400 font-mono">
                {formatCurrency(baseResult.year5TargetPrice, fundamentals.currency)}
              </div>

              <div className="flex items-center justify-center gap-2 pt-1">
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-md font-mono ${
                    baseResult.totalReturnPercent >= 0
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {baseResult.totalReturnPercent >= 0 ? '+' : ''}
                  {baseResult.totalReturnPercent.toFixed(1)}% Return
                </span>

                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-md font-mono ${
                    baseResult.fiveYearCAGRPercent >= 0
                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                      : 'bg-rose-950/60 text-rose-400 border border-rose-800/40'
                  }`}
                >
                  CAGR: {formatPercent(baseResult.fiveYearCAGRPercent, true)}/yr
                </span>
              </div>
            </div>

            {/* Interactive Sliders & Numeric Inputs */}
            <div className="space-y-4 pt-2 text-xs">
              {/* Revenue Growth Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-zinc-300">
                  <span className="font-medium">Annual Revenue Growth</span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      step="0.5"
                      value={(scenarios.base.growthRate * 100).toFixed(1)}
                      onChange={(e) =>
                        handleScenarioChange('base', 'growthRate', (parseFloat(e.target.value) || 0) / 100)
                      }
                      className="w-16 text-right bg-zinc-900 border border-zinc-700 text-amber-400 font-mono font-bold px-1.5 py-0.5 rounded"
                    />
                    <span className="text-zinc-500 font-mono">%</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="-0.10"
                  max="0.40"
                  step="0.005"
                  value={scenarios.base.growthRate}
                  onChange={(e) =>
                    handleScenarioChange('base', 'growthRate', parseFloat(e.target.value))
                  }
                  className="w-full accent-amber-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
                />
              </div>

              {/* Net Margin Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-zinc-300">
                  <span className="font-medium">Target Net Margin</span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      step="0.5"
                      value={(scenarios.base.netMargin * 100).toFixed(1)}
                      onChange={(e) =>
                        handleScenarioChange('base', 'netMargin', (parseFloat(e.target.value) || 0) / 100)
                      }
                      className="w-16 text-right bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono font-bold px-1.5 py-0.5 rounded"
                    />
                    <span className="text-zinc-500 font-mono">%</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="0.01"
                  max="0.60"
                  step="0.005"
                  value={scenarios.base.netMargin}
                  onChange={(e) =>
                    handleScenarioChange('base', 'netMargin', parseFloat(e.target.value))
                  }
                  className="w-full accent-amber-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
                />
              </div>

              {/* Exit P/E Multiple Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-zinc-300">
                  <span className="font-medium">Exit P/E Multiple</span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      step="1"
                      value={scenarios.base.exitPE}
                      onChange={(e) =>
                        handleScenarioChange('base', 'exitPE', parseInt(e.target.value) || 5)
                      }
                      className="w-14 text-right bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono font-bold px-1.5 py-0.5 rounded"
                    />
                    <span className="text-zinc-500 font-mono">x</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="1"
                  value={scenarios.base.exitPE}
                  onChange={(e) =>
                    handleScenarioChange('base', 'exitPE', parseInt(e.target.value))
                  }
                  className="w-full accent-amber-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Card Summary Breakdown */}
          <div className="mt-5 pt-4 border-t border-zinc-800/80 space-y-1.5 text-[11px] text-zinc-400">
            <div className="flex justify-between">
              <span>Year 5 Revenue:</span>
              <span className="font-mono text-zinc-200">{formatLargeNumber(baseResult.year5Revenue)}</span>
            </div>
            <div className="flex justify-between">
              <span>Year 5 Net Income:</span>
              <span className="font-mono text-zinc-200">{formatLargeNumber(baseResult.year5NetIncome)}</span>
            </div>
            <div className="flex justify-between font-semibold text-zinc-200 pt-1 border-t border-zinc-800/40">
              <span>Year 5 EPS:</span>
              <span className="font-mono text-amber-300">${baseResult.year5EPS.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* 3. BULL SCENARIO CARD */}
        <div className="glass-panel-glow rounded-3xl p-6 border border-emerald-500/40 bg-gradient-to-b from-emerald-950/20 via-zinc-900/40 to-zinc-900/90 flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-5">
            {/* Header Badge */}
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Bull Case</span>
              </div>
              <span className="text-[11px] text-zinc-500 font-mono">Optimistic Ceiling</span>
            </div>

            {/* Hero Target Price Display */}
            <div className="bg-zinc-950/70 p-4 rounded-2xl border border-emerald-900/40 text-center space-y-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-zinc-400 block">
                Year 5 Target Price
              </span>
              <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono">
                {formatCurrency(bullResult.year5TargetPrice, fundamentals.currency)}
              </div>

              <div className="flex items-center justify-center gap-2 pt-1">
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-md font-mono ${
                    bullResult.totalReturnPercent >= 0
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {bullResult.totalReturnPercent >= 0 ? '+' : ''}
                  {bullResult.totalReturnPercent.toFixed(1)}% Return
                </span>

                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-md font-mono ${
                    bullResult.fiveYearCAGRPercent >= 0
                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                      : 'bg-rose-950/60 text-rose-400 border border-rose-800/40'
                  }`}
                >
                  CAGR: {formatPercent(bullResult.fiveYearCAGRPercent, true)}/yr
                </span>
              </div>
            </div>

            {/* Interactive Sliders & Numeric Inputs */}
            <div className="space-y-4 pt-2 text-xs">
              {/* Revenue Growth Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-zinc-300">
                  <span className="font-medium">Annual Revenue Growth</span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      step="0.5"
                      value={(scenarios.bull.growthRate * 100).toFixed(1)}
                      onChange={(e) =>
                        handleScenarioChange('bull', 'growthRate', (parseFloat(e.target.value) || 0) / 100)
                      }
                      className="w-16 text-right bg-zinc-900 border border-zinc-700 text-emerald-400 font-mono font-bold px-1.5 py-0.5 rounded"
                    />
                    <span className="text-zinc-500 font-mono">%</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="-0.10"
                  max="0.50"
                  step="0.005"
                  value={scenarios.bull.growthRate}
                  onChange={(e) =>
                    handleScenarioChange('bull', 'growthRate', parseFloat(e.target.value))
                  }
                  className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
                />
              </div>

              {/* Net Margin Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-zinc-300">
                  <span className="font-medium">Target Net Margin</span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      step="0.5"
                      value={(scenarios.bull.netMargin * 100).toFixed(1)}
                      onChange={(e) =>
                        handleScenarioChange('bull', 'netMargin', (parseFloat(e.target.value) || 0) / 100)
                      }
                      className="w-16 text-right bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono font-bold px-1.5 py-0.5 rounded"
                    />
                    <span className="text-zinc-500 font-mono">%</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="0.01"
                  max="0.60"
                  step="0.005"
                  value={scenarios.bull.netMargin}
                  onChange={(e) =>
                    handleScenarioChange('bull', 'netMargin', parseFloat(e.target.value))
                  }
                  className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
                />
              </div>

              {/* Exit P/E Multiple Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-zinc-300">
                  <span className="font-medium">Exit P/E Multiple</span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      step="1"
                      value={scenarios.bull.exitPE}
                      onChange={(e) =>
                        handleScenarioChange('bull', 'exitPE', parseInt(e.target.value) || 5)
                      }
                      className="w-14 text-right bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono font-bold px-1.5 py-0.5 rounded"
                    />
                    <span className="text-zinc-500 font-mono">x</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="1"
                  value={scenarios.bull.exitPE}
                  onChange={(e) =>
                    handleScenarioChange('bull', 'exitPE', parseInt(e.target.value))
                  }
                  className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Card Summary Breakdown */}
          <div className="mt-5 pt-4 border-t border-zinc-800/80 space-y-1.5 text-[11px] text-zinc-400">
            <div className="flex justify-between">
              <span>Year 5 Revenue:</span>
              <span className="font-mono text-zinc-200">{formatLargeNumber(bullResult.year5Revenue)}</span>
            </div>
            <div className="flex justify-between">
              <span>Year 5 Net Income:</span>
              <span className="font-mono text-zinc-200">{formatLargeNumber(bullResult.year5NetIncome)}</span>
            </div>
            <div className="flex justify-between font-semibold text-zinc-200 pt-1 border-t border-zinc-800/40">
              <span>Year 5 EPS:</span>
              <span className="font-mono text-emerald-300">${bullResult.year5EPS.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Year-by-Year Growth Table Section */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-zinc-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              <span>Year-by-Year Financial Progression (Years 1 to 5)</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Annual compounding schedule of Projected Revenue, Net Income, and EPS.
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
                {tab === 'comparison' ? '3-Case Summary' : `${tab} Case`}
              </button>
            ))}
          </div>
        </div>

        {/* 1. THREE-CASE SUMMARY TABLE */}
        {activeTab === 'comparison' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400">
                  <th className="py-3 px-4 font-sans font-semibold">Valuation Metric</th>
                  <th className="py-3 px-4 text-rose-400 font-sans font-semibold">Bear Case</th>
                  <th className="py-3 px-4 text-amber-400 font-sans font-semibold">Base Case</th>
                  <th className="py-3 px-4 text-emerald-400 font-sans font-semibold">Bull Case</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                <tr>
                  <td className="py-2.5 px-4 font-sans text-zinc-400">Revenue Growth Rate YoY</td>
                  <td className="py-2.5 px-4 text-rose-300">{(scenarios.bear.growthRate * 100).toFixed(1)}%</td>
                  <td className="py-2.5 px-4 text-amber-300">{(scenarios.base.growthRate * 100).toFixed(1)}%</td>
                  <td className="py-2.5 px-4 text-emerald-300">{(scenarios.bull.growthRate * 100).toFixed(1)}%</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-sans text-zinc-400">Target Net Profit Margin</td>
                  <td className="py-2.5 px-4">{(scenarios.bear.netMargin * 100).toFixed(1)}%</td>
                  <td className="py-2.5 px-4">{(scenarios.base.netMargin * 100).toFixed(1)}%</td>
                  <td className="py-2.5 px-4">{(scenarios.bull.netMargin * 100).toFixed(1)}%</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-sans text-zinc-400">Exit P/E Multiple</td>
                  <td className="py-2.5 px-4">{scenarios.bear.exitPE}x</td>
                  <td className="py-2.5 px-4">{scenarios.base.exitPE}x</td>
                  <td className="py-2.5 px-4">{scenarios.bull.exitPE}x</td>
                </tr>
                <tr className="bg-zinc-900/40">
                  <td className="py-2.5 px-4 font-sans text-zinc-300 font-medium">Projected Year 5 Revenue</td>
                  <td className="py-2.5 px-4 text-zinc-100">{formatLargeNumber(bearResult.year5Revenue)}</td>
                  <td className="py-2.5 px-4 text-zinc-100">{formatLargeNumber(baseResult.year5Revenue)}</td>
                  <td className="py-2.5 px-4 text-zinc-100">{formatLargeNumber(bullResult.year5Revenue)}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-sans text-zinc-400">Projected Year 5 Net Income</td>
                  <td className="py-2.5 px-4 text-zinc-200">{formatLargeNumber(bearResult.year5NetIncome)}</td>
                  <td className="py-2.5 px-4 text-zinc-200">{formatLargeNumber(baseResult.year5NetIncome)}</td>
                  <td className="py-2.5 px-4 text-zinc-200">{formatLargeNumber(bullResult.year5NetIncome)}</td>
                </tr>
                <tr className="bg-zinc-900/60 font-semibold">
                  <td className="py-3 px-4 font-sans text-zinc-200">Projected Year 5 EPS</td>
                  <td className="py-3 px-4 text-rose-300">${bearResult.year5EPS.toFixed(2)}</td>
                  <td className="py-3 px-4 text-amber-300">${baseResult.year5EPS.toFixed(2)}</td>
                  <td className="py-3 px-4 text-emerald-300">${bullResult.year5EPS.toFixed(2)}</td>
                </tr>
                <tr className="bg-indigo-950/30 border-t-2 border-indigo-500/40 font-black text-sm">
                  <td className="py-3.5 px-4 font-sans text-white">Projected Year 5 Stock Price</td>
                  <td className="py-3.5 px-4 text-rose-400">{formatCurrency(bearResult.year5TargetPrice, fundamentals.currency)}</td>
                  <td className="py-3.5 px-4 text-amber-400">{formatCurrency(baseResult.year5TargetPrice, fundamentals.currency)}</td>
                  <td className="py-3.5 px-4 text-emerald-400">{formatCurrency(bullResult.year5TargetPrice, fundamentals.currency)}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-sans text-zinc-400">Total 5-Year Return %</td>
                  <td className={`py-2.5 px-4 font-bold ${bearResult.totalReturnPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {bearResult.totalReturnPercent >= 0 ? '+' : ''}{bearResult.totalReturnPercent.toFixed(1)}%
                  </td>
                  <td className={`py-2.5 px-4 font-bold ${baseResult.totalReturnPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {baseResult.totalReturnPercent >= 0 ? '+' : ''}{baseResult.totalReturnPercent.toFixed(1)}%
                  </td>
                  <td className={`py-2.5 px-4 font-bold ${bullResult.totalReturnPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {bullResult.totalReturnPercent >= 0 ? '+' : ''}{bullResult.totalReturnPercent.toFixed(1)}%
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-sans text-zinc-400">5-Year Projected CAGR</td>
                  <td className="py-2.5 px-4 text-zinc-200">{formatPercent(bearResult.fiveYearCAGRPercent, true)}/yr</td>
                  <td className="py-2.5 px-4 text-zinc-200">{formatPercent(baseResult.fiveYearCAGRPercent, true)}/yr</td>
                  <td className="py-2.5 px-4 text-zinc-200">{formatPercent(bullResult.fiveYearCAGRPercent, true)}/yr</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* 2. YEAR-BY-YEAR DETAILED BREAKDOWN TAB */}
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
                        <th className="py-3 px-4 font-sans font-semibold">Projected Revenue</th>
                        <th className="py-3 px-4 font-sans font-semibold">Projected Net Income</th>
                        <th className="py-3 px-4 font-sans font-semibold text-right">Projected EPS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                      <tr className="bg-zinc-900/30 text-zinc-400">
                        <td className="py-2.5 px-4 font-sans font-medium">Base TTM (Year 0)</td>
                        <td className="py-2.5 px-4 text-blue-400">{formatLargeNumber(fundamentals.totalRevenue)}</td>
                        <td className="py-2.5 px-4 text-emerald-400">
                          {formatLargeNumber(fundamentals.totalRevenue * fundamentals.profitMargins)}
                        </td>
                        <td className="py-2.5 px-4 text-right text-zinc-300">
                          ${fundamentals.trailingEps.toFixed(2)}
                        </td>
                      </tr>
                      {res.yearlyProjections.map((proj) => (
                        <tr key={proj.year} className="hover:bg-zinc-900/40">
                          <td className="py-2.5 px-4 font-sans font-medium text-zinc-200">
                            Year {proj.year}
                          </td>
                          <td className="py-2.5 px-4 text-blue-300">
                            {formatLargeNumber(proj.revenue)}
                          </td>
                          <td className="py-2.5 px-4 text-emerald-300">
                            {formatLargeNumber(proj.netIncome)}
                          </td>
                          <td className="py-2.5 px-4 text-right font-bold text-zinc-100">
                            ${proj.eps.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-indigo-950/40 font-black text-sm border-t-2 border-indigo-500/40">
                        <td className="py-3.5 px-4 font-sans text-white">
                          Year 5 Exit Valuation ({res.inputs.exitPE}x P/E):
                        </td>
                        <td className="py-3.5 px-4 text-blue-300">
                          {formatLargeNumber(res.year5Revenue)}
                        </td>
                        <td className="py-3.5 px-4 text-emerald-300">
                          {formatLargeNumber(res.year5NetIncome)}
                        </td>
                        <td className="py-3.5 px-4 text-right text-amber-300 font-mono">
                          Target: {formatCurrency(res.year5TargetPrice, fundamentals.currency)}
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

      {/* Financial Math Reference & Model Explanation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="glass-panel p-5 rounded-2xl border border-zinc-800 space-y-2">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
            <HelpCircle className="w-4 h-4" />
            <h4>1. Revenue &amp; EPS Projections</h4>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Revenue compounds annually at the growth rate over 5 years. Target net profit margin is applied to determine Year 5 Net Income, which is divided by shares outstanding to yield projected Year 5 EPS.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-zinc-800 space-y-2">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
            <HelpCircle className="w-4 h-4" />
            <h4>2. Exit P/E Multiple &amp; Price</h4>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Projected Year 5 Stock Price equals Year 5 EPS multiplied by the Terminal Exit P/E multiple. This represents the market valuation multiple expected at the end of the 5-year holding period.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-zinc-800 space-y-2">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
            <HelpCircle className="w-4 h-4" />
            <h4>3. Total Return &amp; CAGR</h4>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            CAGR represents the annualized compound return required from the current market price to reach the Year 5 target price. The model automatically ensures Bear &le; Base &le; Bull consistency.
          </p>
        </div>
      </div>
    </div>
  );
}
