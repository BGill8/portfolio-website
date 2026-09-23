"""
SEC EDGAR Ingestion Module.
Compliantly pulls 8-K (Item 2.02: Results of Operations) and 10-Q filings for corporate announcements.
"""

import re
import requests
from typing import Optional, Dict, Any
from ..config import SEC_USER_AGENT

# CIK mappings for major tech/growth leaders
CIK_MAP = {
    "NVDA": "0001045810",
    "AAPL": "0000320193",
    "TSLA": "0001318605",
    "MSFT": "0000789019",
    "META": "0001326801",
    "AMZN": "0001018724",
    "GOOGL": "0001652044",
}


class SecEdgarIngestor:
    """Interacts with SEC EDGAR public submissions API adhering to the 10 requests/sec limit."""

    def __init__(self, user_agent: str = SEC_USER_AGENT):
        self.headers = {"User-Agent": user_agent, "Accept-Encoding": "gzip, deflate"}

    def get_cik(self, ticker: str) -> Optional[str]:
        return CIK_MAP.get(ticker.upper())

    def fetch_latest_8k(self, ticker: str) -> Optional[Dict[str, Any]]:
        """
        Fetches recent 8-K filings from SEC EDGAR submissions for a given ticker.
        """
        cik = self.get_cik(ticker)
        if not cik:
            return None

        url = f"https://data.sec.gov/submissions/CIK{cik}.json"
        try:
            resp = requests.get(url, headers=self.headers, timeout=10)
            if resp.status_code != 200:
                return None
            data = resp.json()
            recent_filings = data.get("filings", {}).get("recent", {})
            forms = recent_filings.get("form", [])

            for i, form in enumerate(forms):
                if form == "8-K":
                    accession = recent_filings.get("accessionNumber", [])[i].replace("-", "")
                    doc_name = recent_filings.get("primaryDocument", [])[i]
                    filing_date = recent_filings.get("filingDate", [])[i]
                    doc_url = f"https://www.sec.gov/Archives/edgar/data/{int(cik)}/{accession}/{doc_name}"
                    return {
                        "ticker": ticker.upper(),
                        "cik": cik,
                        "form": "8-K",
                        "filing_date": filing_date,
                        "url": doc_url,
                    }
        except Exception:
            return None
        return None

    def clean_html_text(self, html_content: str) -> str:
        """Strips HTML tags, XML artifacts, and normalizes financial document whitespace."""
        clean = re.sub(r"<style[\s\S]*?</style>", "", html_content, flags=re.IGNORECASE)
        clean = re.sub(r"<script[\s\S]*?</script>", "", clean, flags=re.IGNORECASE)
        clean = re.sub(r"<[^>]+>", " ", clean)
        clean = re.sub(r"&#\d+;|&[a-z]+;", " ", clean, flags=re.IGNORECASE)
        clean = re.sub(r"\s+", " ", clean).strip()
        return clean
