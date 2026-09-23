"""
Earnings endpoints: listing calls and retrieving full parsed transcripts with FinBERT tone metrics.
"""

from typing import List, Optional
from fastapi import APIRouter, HTTPException, Depends
from ...schemas import EarningsCallDetail, EarningsCallSummary
from ...db.database import DatabaseManager

router = APIRouter(prefix="/earnings", tags=["Earnings"])


def get_db():
    return DatabaseManager()


@router.get("/calls", response_model=List[EarningsCallSummary])
def list_earnings_calls(db: DatabaseManager = Depends(get_db)):
    """Returns summaries of all processed corporate earnings calls in the database."""
    return db.list_calls()


@router.get("/{ticker}/{quarter}", response_model=EarningsCallDetail)
def get_earnings_call(ticker: str, quarter: str, db: DatabaseManager = Depends(get_db)):
    """
    Returns full earnings call detail including:
    - Sentence-level FinBERT classifications and confidence scores.
    - Speaker breakdowns (CEO vs CFO vs Analysts).
    - Synchronized price history candles with earnings timing.
    - PEAD drift metrics and key takeaways.
    """
    # Standardize input query: e.g., "Q3-2025" or "Q3 2025"
    norm_quarter = quarter.replace("-", " ").strip().upper()
    call = db.get_call_by_ticker_quarter(ticker, norm_quarter)

    if not call:
        # Try finding by call ID
        call = db.get_call(f"{ticker.upper()}-{quarter.upper()}")

    if not call:
        # Fallback: check if any call matches ticker
        summaries = db.list_calls()
        for s in summaries:
            if s.ticker.upper() == ticker.upper():
                call = db.get_call(s.id)
                break

    if not call:
        raise HTTPException(
            status_code=404,
            detail=f"Earnings call for {ticker} ({quarter}) not found in cache. Use POST /api/v1/analyze to ingest on-demand."
        )

    return call
