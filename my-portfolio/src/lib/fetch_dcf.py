#!/usr/bin/env python3
"""
5-Year EPS & Revenue Valuation Ingestion Helper via yfinance
Fetches real-time price, EPS, Revenue, Profit Margin, Shares, P/E, and Revenue Growth.
"""

import sys
import json

def fetch_ticker_data(symbol: str):
    symbol = symbol.strip().upper()
    try:
        import yfinance as yf
    except ImportError:
        print(json.dumps({"error": "yfinance not installed"}))
        sys.exit(1)

    try:
        ticker = yf.Ticker(symbol)
        info = ticker.info or {}
        
        # 1. Current Price
        current_price = (
            info.get("currentPrice")
            or info.get("regularMarketPrice")
            or info.get("previousClose")
            or (ticker.fast_info.last_price if hasattr(ticker, "fast_info") else 0.0)
            or 0.0
        )
        
        # 2. Shares Outstanding
        shares = (
            info.get("sharesOutstanding")
            or info.get("impliedSharesOutstanding")
            or (ticker.fast_info.shares if hasattr(ticker, "fast_info") else 0)
            or 0
        )
        
        # 3. TTM Revenue
        total_revenue = info.get("totalRevenue") or 0.0
        
        # 4. Profit Margin
        profit_margin = info.get("profitMargins")
        if profit_margin is None or profit_margin == 0:
            if "netIncomeToCommon" in info and total_revenue > 0:
                profit_margin = float(info["netIncomeToCommon"]) / float(total_revenue)
                
        # 5. EPS (Trailing / Forward)
        eps = info.get("trailingEps") or info.get("forwardEps")
        
        # Fallback inspection of Income Statement if revenue, margin, or EPS are missing
        if not total_revenue or profit_margin is None or not eps:
            try:
                inc = ticker.income_stmt
                if inc is not None and not inc.empty:
                    if not total_revenue:
                        if "Total Revenue" in inc.index:
                            total_revenue = float(inc.loc["Total Revenue"].iloc[0])
                        elif "Operating Revenue" in inc.index:
                            total_revenue = float(inc.loc["Operating Revenue"].iloc[0])
                            
                    if profit_margin is None and total_revenue > 0:
                        if "Net Income" in inc.index:
                            net_income = float(inc.loc["Net Income"].iloc[0])
                            profit_margin = net_income / total_revenue
                        elif "Net Income Common Stockholders" in inc.index:
                            net_income = float(inc.loc["Net Income Common Stockholders"].iloc[0])
                            profit_margin = net_income / total_revenue
                            
                    if not eps and "Diluted EPS" in inc.index:
                        eps = float(inc.loc["Diluted EPS"].iloc[0])
                    elif not eps and "Basic EPS" in inc.index:
                        eps = float(inc.loc["Basic EPS"].iloc[0])
            except Exception:
                pass
                
        # Default margin if still undefined
        if profit_margin is None:
            profit_margin = 0.15 # 15% default margin
            
        # If EPS is still missing but we have Revenue, Margin & Shares
        if not eps and total_revenue > 0 and shares > 0:
            net_income = total_revenue * profit_margin
            eps = net_income / shares
            
        # 6. Current Trailing P/E
        pe = info.get("trailingPE") or info.get("forwardPE")
        if (not pe or pe <= 0) and current_price > 0 and eps and eps > 0:
            pe = current_price / eps
        elif not pe or pe <= 0:
            pe = 20.0 # Standard equity market baseline P/E
            
        # 7. Revenue Growth (YoY)
        rev_growth = info.get("revenueGrowth")
        if rev_growth is None or rev_growth == 0:
            rev_growth = info.get("earningsGrowth") or 0.10
            
        name = info.get("shortName") or info.get("longName") or symbol
        currency = info.get("currency") or "USD"
        market_cap = info.get("marketCap") or (current_price * shares if current_price and shares else 0)

        # Free cash flow
        fcf = info.get("freeCashflow") or (total_revenue * profit_margin if total_revenue else 0)

        data = {
            "symbol": symbol,
            "name": name,
            "currency": currency,
            "currentPrice": float(current_price),
            "marketCap": float(market_cap),
            "trailingEps": float(eps or 0.0),
            "totalRevenue": float(total_revenue or 0.0),
            "profitMargins": float(profit_margin or 0.0),
            "sharesOutstanding": float(shares or 0),
            "trailingPE": float(pe or 20.0),
            "revenueGrowth": float(rev_growth or 0.10),
            "freeCashFlow": float(fcf or 0.0),
            "sector": info.get("sector") or "",
            "exchange": info.get("exchange") or "",
        }
        print(json.dumps(data))
    except Exception as e:
        print(json.dumps({"error": str(e), "symbol": symbol}))
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No ticker provided"}))
        sys.exit(1)
    fetch_ticker_data(sys.argv[1])
