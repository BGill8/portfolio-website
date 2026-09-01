#!/usr/bin/env python3
"""
DCF Financial Data Ingestion Helper via yfinance
Fetches real-time price, cash flows, balance sheet, and share structure for DCF valuation.
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
        
        # Current Price
        current_price = info.get("currentPrice") or info.get("regularMarketPrice") or info.get("previousClose") or 0.0
        
        # Free Cash Flow (TTM)
        fcf = info.get("freeCashflow")
        if not fcf or fcf == 0:
            try:
                cf = ticker.cashflow
                if cf is not None and not cf.empty:
                    op_cash = 0
                    capex = 0
                    if "Operating Cash Flow" in cf.index:
                        op_cash = float(cf.loc["Operating Cash Flow"].iloc[0])
                    elif "Total Cash From Operating Activities" in cf.index:
                        op_cash = float(cf.loc["Total Cash From Operating Activities"].iloc[0])
                        
                    if "Capital Expenditure" in cf.index:
                        capex = float(cf.loc["Capital Expenditure"].iloc[0])
                    elif "Capital Expenditures" in cf.index:
                        capex = float(cf.loc["Capital Expenditures"].iloc[0])
                    
                    # capex in yfinance is typically negative
                    fcf = op_cash + capex if capex < 0 else op_cash - capex
            except Exception:
                fcf = None
        
        # Shares Outstanding
        shares = info.get("sharesOutstanding") or info.get("impliedSharesOutstanding") or 0
        
        # Balance Sheet Data
        total_cash = info.get("totalCash") or 0
        total_debt = info.get("totalDebt") or 0
        
        # Fallback balance sheet if needed
        if (not total_cash or not total_debt) and hasattr(ticker, "balance_sheet"):
            try:
                bs = ticker.balance_sheet
                if bs is not None and not bs.empty:
                    if not total_cash and "Cash And Cash Equivalents" in bs.index:
                        total_cash = float(bs.loc["Cash And Cash Equivalents"].iloc[0])
                    if not total_debt and "Total Debt" in bs.index:
                        total_debt = float(bs.loc["Total Debt"].iloc[0])
            except Exception:
                pass
                
        name = info.get("shortName") or info.get("longName") or symbol
        currency = info.get("currency") or "USD"
        market_cap = info.get("marketCap") or (current_price * shares if current_price and shares else 0)
        rev_growth = info.get("revenueGrowth") or info.get("earningsGrowth") or 0.10

        data = {
            "symbol": symbol,
            "name": name,
            "currency": currency,
            "currentPrice": float(current_price),
            "marketCap": float(market_cap),
            "freeCashFlow": float(fcf) if fcf else 0.0,
            "sharesOutstanding": float(shares),
            "totalCash": float(total_cash),
            "totalDebt": float(total_debt),
            "revenueGrowth": float(rev_growth),
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
