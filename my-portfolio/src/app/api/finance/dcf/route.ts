import { NextRequest, NextResponse } from 'next/server';
import { execFile } from 'child_process';
import path from 'path';
import { promisify } from 'util';
import { CompanyFundamentals, POPULAR_TICKERS } from '@/lib/dcf';

const execFileAsync = promisify(execFile);

// Helper to fetch live chart price from Yahoo Finance v8 without rate limits
async function fetchLiveChartData(symbol: string): Promise<Partial<CompanyFundamentals> | null> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`;
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;
    const json = await res.json();
    const meta = json?.chart?.result?.[0]?.meta;
    if (!meta) return null;

    const price = meta.regularMarketPrice ?? meta.chartPreviousClose ?? 0;
    const currency = meta.currency || 'USD';
    const exchange = meta.exchangeName || meta.fullExchangeName || '';
    const symbolClean = meta.symbol || symbol;

    return {
      symbol: symbolClean,
      currentPrice: Number(price),
      currency,
      exchange,
    };
  } catch {
    return null;
  }
}

// Helper to execute Python yfinance script if available
async function fetchViaPython(symbol: string): Promise<CompanyFundamentals | null> {
  try {
    const scriptPath = path.join(process.cwd(), 'src', 'lib', 'fetch_dcf.py');
    const { stdout } = await execFileAsync('python3', [scriptPath, symbol], {
      timeout: 6000,
    });

    const parsed = JSON.parse(stdout.trim());
    if (parsed.error || !parsed.currentPrice) {
      return null;
    }

    return {
      symbol: parsed.symbol || symbol,
      name: parsed.name || symbol,
      currency: parsed.currency || 'USD',
      currentPrice: Number(parsed.currentPrice),
      marketCap: Number(parsed.marketCap) || 0,
      freeCashFlow: Number(parsed.freeCashFlow) || 0,
      sharesOutstanding: Number(parsed.sharesOutstanding) || 0,
      totalCash: Number(parsed.totalCash) || 0,
      totalDebt: Number(parsed.totalDebt) || 0,
      revenueGrowth: Number(parsed.revenueGrowth) || 0.1,
      sector: parsed.sector || '',
      exchange: parsed.exchange || '',
    };
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawTicker = searchParams.get('ticker') || 'AAPL';
  const ticker = rawTicker.trim().toUpperCase();

  if (!ticker || !/^[A-Z0-9.\-]{1,10}$/.test(ticker)) {
    return NextResponse.json(
      { success: false, error: 'Invalid ticker symbol' },
      { status: 400 }
    );
  }

  // 1. Try Python yfinance helper first
  const pythonData = await fetchViaPython(ticker);
  if (pythonData && pythonData.currentPrice > 0 && pythonData.sharesOutstanding > 0) {
    return NextResponse.json({
      success: true,
      source: 'yfinance',
      data: pythonData,
    });
  }

  // 2. Fetch live price from Yahoo Chart API
  const liveChart = await fetchLiveChartData(ticker);

  // 3. Check if we have built-in fundamental data for this ticker
  const knownData = POPULAR_TICKERS[ticker];

  if (knownData) {
    const currentPrice = liveChart?.currentPrice || knownData.currentPrice;
    const marketCap = currentPrice * knownData.sharesOutstanding;

    const mergedData: CompanyFundamentals = {
      ...knownData,
      currentPrice,
      marketCap: marketCap || knownData.marketCap,
      currency: liveChart?.currency || knownData.currency,
      exchange: liveChart?.exchange || knownData.exchange,
    };

    return NextResponse.json({
      success: true,
      source: 'live-chart-with-preset',
      data: mergedData,
    });
  }

  // 4. For unknown tickers with live chart data, provide sensible estimated initial fundamentals
  if (liveChart && liveChart.currentPrice && liveChart.currentPrice > 0) {
    const price = liveChart.currentPrice;
    // Estimate shares: default ~1B shares or standard nominal volume
    const estimatedShares = 1000000000;
    const estimatedMarketCap = price * estimatedShares;
    const estimatedFCF = estimatedMarketCap * 0.04; // 4% typical FCF yield
    const estimatedCash = estimatedMarketCap * 0.05;
    const estimatedDebt = estimatedMarketCap * 0.05;

    const fallbackData: CompanyFundamentals = {
      symbol: ticker,
      name: `${ticker} Corporation`,
      currency: liveChart.currency || 'USD',
      currentPrice: price,
      marketCap: estimatedMarketCap,
      freeCashFlow: estimatedFCF,
      sharesOutstanding: estimatedShares,
      totalCash: estimatedCash,
      totalDebt: estimatedDebt,
      revenueGrowth: 0.1,
      exchange: liveChart.exchange || 'NYSE/NASDAQ',
      sector: 'General Equities',
    };

    return NextResponse.json({
      success: true,
      source: 'live-chart-estimated',
      data: fallbackData,
    });
  }

  // 5. Complete fallback if all external calls fail
  const fallbackGeneric = POPULAR_TICKERS['AAPL'];
  return NextResponse.json({
    success: true,
    source: 'fallback',
    data: {
      ...fallbackGeneric,
      symbol: ticker,
      name: `${ticker} (Sample Data)`,
    },
  });
}
