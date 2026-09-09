"""
Financial Transcript Ingestion Client.
Provides methods to fetch full structured earnings call transcripts.
"""

import os
import requests
from typing import Optional, Dict, Any, List


class TranscriptClient:
    """Fetches transcripts via Financial Modeling Prep (FMP) or alternative free APIs."""

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.environ.get("FMP_API_KEY", "")
        self.base_url = "https://financialmodelingprep.com/api/v3"

    def fetch_transcript(self, ticker: str, year: int, quarter: int) -> Optional[str]:
        """
        Fetches official earnings call transcript for a specific quarter.
        Returns raw text transcript.
        """
        if not self.api_key:
            return None

        url = f"{self.base_url}/earning_call_transcript/{ticker.upper()}?year={year}&quarter={quarter}&apikey={self.api_key}"
        try:
            resp = requests.get(url, timeout=12)
            if resp.status_code == 200:
                data = resp.json()
                if isinstance(data, list) and len(data) > 0:
                    return data[0].get("content", "")
        except Exception:
            return None
        return None
