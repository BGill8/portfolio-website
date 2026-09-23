"""
Alpha endpoints: statistical correlation, cross-sectional drift, and PEAD analysis.
"""

from typing import List, Dict, Any
from fastapi import APIRouter, Depends
from ...schemas import CorrelationStats, CorrelationPoint
from ...db.database import DatabaseManager
from ...quant.alpha_engine import AlphaEngine

router = APIRouter(prefix="/alpha", tags=["Quantitative Alpha"])


def get_db():
    return DatabaseManager()


def get_alpha_engine():
    return AlphaEngine()


@router.get("/correlation", response_model=CorrelationStats)
def get_alpha_correlation(
    db: DatabaseManager = Depends(get_db),
    engine: AlphaEngine = Depends(get_alpha_engine),
):
    """
    Computes statistical correlation between earnings sentiment anomaly (Z-score)
    and subsequent Day 1 Cumulative Abnormal Returns (CAR T+1).
    """
    points = db.get_correlation_points()
    return engine.compute_dataset_correlation(points)


@router.get("/pead-comparison")
def get_pead_comparison(db: DatabaseManager = Depends(get_db)) -> List[Dict[str, Any]]:
    """
    Returns comparative PEAD curves for all cached tickers across T+0, T+1, T+5, and T+30 horizons.
    """
    calls = db.list_calls()
    results = []
    for c in calls:
        detail = db.get_call(c.id)
        if detail:
            results.append({
                "id": detail.id,
                "ticker": detail.ticker,
                "quarter": detail.quarter,
                "timing": detail.timing,
                "net_sentiment": detail.tone_metrics.net_sentiment,
                "z_score": detail.tone_metrics.z_score_trailing_4q,
                "qa_divergence": detail.tone_metrics.divergence_delta,
                "t0": detail.pead_metrics.t_plus_0_return,
                "t1": detail.pead_metrics.t_plus_1_return,
                "t5": detail.pead_metrics.t_plus_5_return,
                "t30": detail.pead_metrics.t_plus_30_return,
                "car_t1": detail.pead_metrics.car_t_plus_1,
                "car_t5": detail.pead_metrics.car_t_plus_5,
                "car_t30": detail.pead_metrics.car_t_plus_30,
                "drift_regime": detail.pead_metrics.pead_drift_direction,
                "volume_surge": detail.pead_metrics.volume_surge_ratio,
            })
    return results
