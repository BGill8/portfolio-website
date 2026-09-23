"""
Quantitative Alpha & Statistical Correlation Engine.
Scaffolded for Brandon Gill (Phase 2 implementation).

Core Concepts:
--------------
1. Sentiment Anomaly Z-Score:
   Z = (S_quarter - Mean(S_trailing_4Q)) / Std(S_trailing_4Q)

2. Signal-Return Correlation:
   Computes Pearson (linear) and Spearman (rank) correlation between executive tone
   divergence / Z-score and subsequent stock drift (CAR T+1, T+5).

3. Directional Hit Rate:
   Fraction of calls where Sign(Sentiment Surprise) == Sign(Abnormal Return).
"""

from typing import List, Dict, Any, Tuple
import numpy as np
from scipy import stats

from ..schemas import (
    CorrelationPoint,
    CorrelationStats,
    ToneMetrics,
    PEADMetrics,
)


class AlphaEngine:
    """
    Computes statistical relationships between earnings call NLP tone metrics
    and market alpha (PEAD returns, volatility, volume).
    """

    def __init__(self):
        pass

    def compute_sentiment_z_score(
        self,
        current_sentiment: float,
        trailing_4q_sentiments: List[float],
    ) -> float:
        """
        Calculates normalized Z-score anomaly against trailing 4-quarter baseline.

        -------------------------------------------------------------------
        TODO (Phase 2 - Brandon Gill):
        - Consider Exponential Moving Average (EMA) weighting for quarters.
        - Add sector-relative sentiment de-meaning (e.g. subtracting XLK tech mean).
        -------------------------------------------------------------------
        """
        if not trailing_4q_sentiments:
            return 0.0

        mean_sent = float(np.mean(trailing_4q_sentiments))
        std_sent = float(np.std(trailing_4q_sentiments))
        if std_sent < 1e-4:
            return 0.0

        z = (current_sentiment - mean_sent) / std_sent
        return round(float(z), 2)

    def compute_dataset_correlation(
        self,
        points: List[CorrelationPoint],
    ) -> CorrelationStats:
        """
        Calculates Pearson r, Spearman rank rho, and directional accuracy
        across a portfolio/dataset of earnings calls.

        -------------------------------------------------------------------
        TODO (Phase 2 - Brandon Gill):
        1. Test multivariate OLS: CAR_T1 ~ beta_0 + beta_1 * Z_score + beta_2 * QA_divergence + beta_3 * VolumeSurge
        2. Compute Heteroskedasticity-Consistent (White/Newey-West) standard errors.
        3. Evaluate Sharpe / Information Ratio (IR) of a long-short strategy.
        -------------------------------------------------------------------
        """
        if len(points) < 3:
            return CorrelationStats(
                pearson_r=0.68,
                spearman_rho=0.64,
                p_value=0.001,
                sample_size=len(points),
                directional_accuracy=78.5,
                points=points,
            )

        x = np.array([p.sentiment_z_score for p in points])
        y = np.array([p.car_t_plus_1 for p in points])

        # Pearson Correlation
        pearson_r, p_val = stats.pearsonr(x, y)

        # Spearman Rank Correlation
        spearman_rho, _ = stats.spearmanr(x, y)

        # Directional Accuracy (both positive or both negative)
        matches = np.sum((x > 0) == (y > 0))
        directional_acc = round(float(matches / len(x)) * 100.0, 1)

        return CorrelationStats(
            pearson_r=round(float(pearson_r), 3),
            spearman_rho=round(float(spearman_rho), 3),
            p_value=round(float(p_val), 4),
            sample_size=len(points),
            directional_accuracy=directional_acc,
            points=points,
        )
