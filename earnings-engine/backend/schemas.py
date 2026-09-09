"""
Pydantic V2 data models for the Earnings Sentiment & Alpha Engine.
"""

from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class SpeakerRole(str, Enum):
    CEO = "CEO"
    CFO = "CFO"
    EXECUTIVE = "EXECUTIVE"
    ANALYST = "ANALYST"
    OPERATOR = "OPERATOR"
    OTHER = "OTHER"


class SectionType(str, Enum):
    PREPARED_REMARKS = "PREPARED_REMARKS"
    QA_SESSION = "QA_SESSION"


class SentimentLabel(str, Enum):
    POSITIVE = "positive"
    NEGATIVE = "negative"
    NEUTRAL = "neutral"


class MarketTiming(str, Enum):
    AMC = "AMC"       # After Market Close
    BMO = "BMO"       # Before Market Open
    INTRADAY = "INTRADAY"


class SentenceSentiment(BaseModel):
    id: int
    sentence: str
    speaker: str = "Unknown"
    speaker_role: SpeakerRole = SpeakerRole.OTHER
    section: SectionType = SectionType.PREPARED_REMARKS
    label: SentimentLabel
    score: float = Field(..., description="Model confidence between 0.0 and 1.0")
    positive_prob: float = 0.0
    negative_prob: float = 0.0
    neutral_prob: float = 0.0
    is_forward_looking: bool = False
    uncertainty_score: float = 0.0


class SpeakerSentimentSummary(BaseModel):
    speaker: str
    role: SpeakerRole
    sentence_count: int
    net_sentiment: float
    positive_count: int
    negative_count: int
    neutral_count: int
    uncertainty_ratio: float


class ToneMetrics(BaseModel):
    net_sentiment: float = Field(..., description="Overall (Pos - Neg) / Total")
    prepared_remarks_sentiment: float = Field(..., description="Sentiment of scripted executive presentations")
    qa_sentiment: float = Field(..., description="Sentiment during unscripted analyst Q&A")
    divergence_delta: float = Field(..., description="Q&A sentiment minus Prepared Remarks sentiment")
    forward_guidance_score: float = Field(..., description="Sentiment on forward-looking statements")
    uncertainty_index: float = Field(..., description="Ratio of hedged/uncertain words in Q&A")
    z_score_trailing_4q: float = Field(..., description="Sentiment delta Z-score vs prior 4 quarters")
    positive_ratio: float
    negative_ratio: float
    neutral_ratio: float
    speaker_summaries: List[SpeakerSentimentSummary] = []


class PriceCandle(BaseModel):
    date: str
    open: float
    high: float
    low: float
    close: float
    volume: float
    is_earnings_day: bool = False
    abnormal_return: Optional[float] = None


class PEADMetrics(BaseModel):
    announcement_timing: MarketTiming
    t_plus_0_return: float = Field(..., description="Intraday return on release day (%)")
    t_plus_1_return: float = Field(..., description="Day 1 post-earnings return (%)")
    t_plus_5_return: float = Field(..., description="Day 5 cumulative return (%)")
    t_plus_30_return: float = Field(..., description="Day 30 cumulative return (%)")
    benchmark_spy_t_plus_1: float = Field(..., description="S&P 500 return over same T+1 window (%)")
    car_t_plus_1: float = Field(..., description="Cumulative Abnormal Return T+1 (%)")
    car_t_plus_5: float = Field(..., description="Cumulative Abnormal Return T+5 (%)")
    car_t_plus_30: float = Field(..., description="Cumulative Abnormal Return T+30 (%)")
    volume_surge_ratio: float = Field(..., description="Earnings volume / 20-day average volume")
    pead_drift_direction: str = Field(..., description="UPWARD_CONTINUATION | DOWNWARD_DRIFT | MEAN_REVERTING")


class EarningsCallSummary(BaseModel):
    id: str
    ticker: str
    company_name: str
    quarter: str
    date: str
    fiscal_year: int
    timing: MarketTiming
    net_sentiment: float
    z_score_trailing_4q: float
    car_t_plus_1: float
    key_theme: str


class EarningsCallDetail(BaseModel):
    id: str
    ticker: str
    company_name: str
    quarter: str
    date: str
    fiscal_year: int
    timing: MarketTiming
    tone_metrics: ToneMetrics
    pead_metrics: PEADMetrics
    price_history: List[PriceCandle]
    sentences: List[SentenceSentiment]
    summary_takeaways: List[str]


class CorrelationPoint(BaseModel):
    ticker: str
    quarter: str
    date: str
    sentiment_z_score: float
    qa_divergence: float
    car_t_plus_1: float
    car_t_plus_5: float
    volume_surge: float


class CorrelationStats(BaseModel):
    pearson_r: float
    spearman_rho: float
    p_value: float
    sample_size: int
    directional_accuracy: float = Field(..., description="% times positive sentiment anomaly matched positive CAR")
    points: List[CorrelationPoint]


class AnalyzeCustomRequest(BaseModel):
    ticker: str = "NVDA"
    transcript_text: Optional[str] = None
    quarter: Optional[str] = "Q4-2024"


class AnalyzeCustomResponse(BaseModel):
    status: str
    ticker: str
    sentence_count: int
    tone_metrics: ToneMetrics
    sentences: List[SentenceSentiment]
