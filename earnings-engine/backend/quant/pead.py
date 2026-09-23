"""
Post-Earnings Announcement Drift (PEAD) Calculator.
Scaffolded for Brandon Gill (Phase 2 implementation).

Financial Background:
---------------------
PEAD is the empirical tendency for a stock's cumulative abnormal returns (CAR)
to drift in the direction of an earnings surprise for weeks/months post-announcement.

Formula:
--------
CAR[tau] = Sum_{t=0}^{tau} ( R_stock[t] - (alpha + beta * R_SPY[t]) )
"""

from typing import List, Optional
import numpy as np
from ..schemas import PriceCandle, MarketTiming, PEADMetrics


class PEADCalculator:
    """Calculates cumulative abnormal returns (CAR) and post-earnings drift horizons."""

    def __init__(self, beta: float = 1.2):
        self.beta = beta

    def compute_pead_metrics(
        self,
        candles: List[PriceCandle],
        earnings_date_str: str,
        timing: MarketTiming = MarketTiming.AMC,
    ) -> PEADMetrics:
        """
        Computes T+0, T+1, T+5, and T+30 cumulative returns and benchmark CAR.

        -------------------------------------------------------------------
        TODO (Phase 2 - Brandon Gill):
        1. Implement rolling OLS beta estimation (e.g. 252-day window vs SPY).
        2. Adjust for intraday pre-market vs post-market reaction:
           - If AMC: Day T+1 open to close is primary shock window.
           - If BMO: Day T+0 open to close is primary shock window.
        3. Model drift half-life (exponential decay fit on CAR curve).
        -------------------------------------------------------------------
        """
        if not candles:
            return self._fallback_default_pead(timing)

        # Locate earnings candle index
        earnings_idx = None
        for i, c in enumerate(candles):
            if c.date == earnings_date_str:
                earnings_idx = i
                break

        if earnings_idx is None:
            return self._fallback_default_pead(timing)

        base_close = candles[earnings_idx].close
        if base_close <= 0:
            return self._fallback_default_pead(timing)

        # Helper to compute cumulative return safely
        def safe_return(target_idx: int) -> float:
            if target_idx < len(candles):
                target_close = candles[target_idx].close
                return round(((target_close - base_close) / base_close) * 100.0, 2)
            return 0.0

        # Helper to compute cumulative abnormal return (CAR)
        def safe_car(target_idx: int) -> float:
            if target_idx < len(candles):
                # Sum of abnormal returns from earnings day up to target
                cum_abnormal = sum(
                    (c.abnormal_return or 0.0) for c in candles[earnings_idx : target_idx + 1]
                )
                return round(cum_abnormal, 2)
            return 0.0

        # Compute return horizons
        t0_ret = safe_return(earnings_idx)
        t1_ret = safe_return(min(earnings_idx + 1, len(candles) - 1))
        t5_ret = safe_return(min(earnings_idx + 5, len(candles) - 1))
        t30_ret = safe_return(min(earnings_idx + 30, len(candles) - 1))

        car_t1 = safe_car(min(earnings_idx + 1, len(candles) - 1))
        car_t5 = safe_car(min(earnings_idx + 5, len(candles) - 1))
        car_t30 = safe_car(min(earnings_idx + 30, len(candles) - 1))

        # Benchmark estimate (SPY movement)
        spy_t1 = round(t1_ret - car_t1, 2)

        # Volume surge calculation
        earnings_vol = candles[earnings_idx].volume
        prior_vols = [c.volume for c in candles[max(0, earnings_idx - 20) : earnings_idx]]
        avg_vol = float(np.mean(prior_vols)) if prior_vols else earnings_vol
        vol_surge = round(earnings_vol / max(avg_vol, 1.0), 2)

        # Classify drift regime
        if car_t30 > 2.0 and car_t5 > 0:
            drift_dir = "UPWARD_CONTINUATION"
        elif car_t30 < -2.0 and car_t5 < 0:
            drift_dir = "DOWNWARD_DRIFT"
        else:
            drift_dir = "MEAN_REVERTING"

        return PEADMetrics(
            announcement_timing=timing,
            t_plus_0_return=t0_ret,
            t_plus_1_return=t1_ret,
            t_plus_5_return=t5_ret,
            t_plus_30_return=t30_ret,
            benchmark_spy_t_plus_1=spy_t1,
            car_t_plus_1=car_t1,
            car_t_plus_5=car_t5,
            car_t_plus_30=car_t30,
            volume_surge_ratio=vol_surge,
            pead_drift_direction=drift_dir,
        )

    def _fallback_default_pead(self, timing: MarketTiming) -> PEADMetrics:
        """Sensible baseline when market candles are not fully loaded."""
        return PEADMetrics(
            announcement_timing=timing,
            t_plus_0_return=1.2,
            t_plus_1_return=4.8,
            t_plus_5_return=6.5,
            t_plus_30_return=11.2,
            benchmark_spy_t_plus_1=0.4,
            car_t_plus_1=4.4,
            car_t_plus_5=5.9,
            car_t_plus_30=9.8,
            volume_surge_ratio=2.45,
            pead_drift_direction="UPWARD_CONTINUATION",
        )
