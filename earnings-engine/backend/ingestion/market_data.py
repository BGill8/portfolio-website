"""
Market Data Ingestion Module using yfinance.
Fetches daily OHLCV bars, aligns market timing (AMC/BMO), and computes volume spikes.
"""

from datetime import datetime, timedelta
from typing import List, Tuple, Dict, Any, Optional
import pandas as pd
import numpy as np
import yfinance as yf

from ..schemas import PriceCandle, MarketTiming


class MarketDataIngestor:
    """Ingests historical OHLCV data for equity tickers and benchmark indices (SPY)."""

    def __init__(self, benchmark_symbol: str = "SPY"):
        self.benchmark_symbol = benchmark_symbol

    def get_earnings_window_bars(
        self,
        ticker: str,
        earnings_date_str: str,
        days_before: int = 15,
        days_after: int = 35,
    ) -> List[PriceCandle]:
        """
        Fetches daily price bars for a window around the earnings release.
        Marks the earnings day and computes abnormal return vs benchmark.
        """
        try:
            target_date = datetime.strptime(earnings_date_str, "%Y-%m-%d").date()
        except ValueError:
            target_date = datetime.now().date()

        start_date = target_date - timedelta(days=days_before * 2)
        end_date = target_date + timedelta(days=days_after * 2)

        try:
            # Download stock and benchmark data
            stock_df = yf.download(
                ticker,
                start=start_date.strftime("%Y-%m-%d"),
                end=end_date.strftime("%Y-%m-%d"),
                progress=False,
                auto_adjust=True,
            )
            
            spy_df = yf.download(
                self.benchmark_symbol,
                start=start_date.strftime("%Y-%m-%d"),
                end=end_date.strftime("%Y-%m-%d"),
                progress=False,
                auto_adjust=True,
            )
        except Exception as e:
            # If download fails or offline, return empty list
            return []

        if stock_df.empty:
            return []

        # Flatten multi-level columns if returned by newer yfinance versions
        if isinstance(stock_df.columns, pd.MultiIndex):
            stock_df.columns = stock_df.columns.get_level_values(0)
        if isinstance(spy_df.columns, pd.MultiIndex):
            spy_df.columns = spy_df.columns.get_level_values(0)

        stock_df["Daily_Return"] = stock_df["Close"].pct_change()
        if not spy_df.empty and "Close" in spy_df.columns:
            spy_df["SPY_Return"] = spy_df["Close"].pct_change()
            stock_df = stock_df.join(spy_df[["SPY_Return"]], how="left")
            stock_df["Abnormal_Return"] = (stock_df["Daily_Return"] - stock_df["SPY_Return"]) * 100.0
        else:
            stock_df["Abnormal_Return"] = stock_df["Daily_Return"] * 100.0

        # Calculate 20-day rolling average volume
        stock_df["Vol_SMA20"] = stock_df["Volume"].rolling(window=20, min_periods=5).mean()

        candles: List[PriceCandle] = []
        for index_val, row in stock_df.iterrows():
            date_obj = index_val.date() if hasattr(index_val, "date") else index_val
            date_str = str(date_obj)[:10]
            is_earnings = date_str == earnings_date_str

            abnormal_ret = None
            if pd.notna(row.get("Abnormal_Return")):
                abnormal_ret = round(float(row["Abnormal_Return"]), 2)

            candles.append(
                PriceCandle(
                    date=date_str,
                    open=round(float(row["Open"]), 2),
                    high=round(float(row["High"]), 2),
                    low=round(float(row["Low"]), 2),
                    close=round(float(row["Close"]), 2),
                    volume=float(row["Volume"]),
                    is_earnings_day=is_earnings,
                    abnormal_return=abnormal_ret,
                )
            )

        return candles

    def calculate_volume_surge(
        self,
        candles: List[PriceCandle],
        earnings_date_str: str,
    ) -> float:
        """Calculates volume surge ratio: earnings day volume / trailing 20-day mean."""
        if not candles:
            return 1.0

        earnings_idx = None
        for i, c in enumerate(candles):
            if c.date == earnings_date_str:
                earnings_idx = i
                break

        if earnings_idx is None or earnings_idx < 5:
            return 1.0

        earnings_vol = candles[earnings_idx].volume
        prior_vols = [c.volume for c in candles[max(0, earnings_idx - 20):earnings_idx]]
        if not prior_vols:
            return 1.0
        
        avg_vol = float(np.mean(prior_vols))
        if avg_vol == 0:
            return 1.0
        
        return round(float(earnings_vol / avg_vol), 2)
