"""
Database & Caching Layer for Earnings Alpha Engine.
Uses SQLite with Write-Ahead Logging (WAL) for lightweight, high-performance local caching,
with a clean repository pattern compatible with PostgreSQL.
"""

import json
import sqlite3
from typing import List, Optional, Dict, Any
from pathlib import Path
from ..config import DB_PATH
from ..schemas import (
    EarningsCallDetail,
    EarningsCallSummary,
    CorrelationPoint,
    SentenceSentiment,
    PriceCandle,
    ToneMetrics,
    PEADMetrics,
)


class DatabaseManager:
    """Manages SQLite cache for parsed calls, sentence-level FinBERT results, and price series."""

    def __init__(self, db_path: Path = DB_PATH):
        self.db_path = db_path
        self._init_db()

    def _get_connection(self) -> sqlite3.Connection:
        conn = sqlite3.connect(str(self.db_path))
        conn.row_factory = sqlite3.Row
        # Enable WAL mode for high concurrency
        conn.execute("PRAGMA journal_mode=WAL;")
        conn.execute("PRAGMA foreign_keys=ON;")
        return conn

    def _init_db(self):
        with self._get_connection() as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS earnings_calls (
                    id TEXT PRIMARY KEY,
                    ticker TEXT NOT NULL,
                    company_name TEXT NOT NULL,
                    quarter TEXT NOT NULL,
                    date TEXT NOT NULL,
                    fiscal_year INTEGER NOT NULL,
                    timing TEXT NOT NULL,
                    net_sentiment REAL NOT NULL,
                    z_score_trailing_4q REAL NOT NULL,
                    car_t_plus_1 REAL NOT NULL,
                    key_theme TEXT,
                    raw_data_json TEXT NOT NULL
                );
            """)

            conn.execute("""
                CREATE TABLE IF NOT EXISTS correlation_dataset (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    ticker TEXT NOT NULL,
                    quarter TEXT NOT NULL,
                    date TEXT NOT NULL,
                    sentiment_z_score REAL NOT NULL,
                    qa_divergence REAL NOT NULL,
                    car_t_plus_1 REAL NOT NULL,
                    car_t_plus_5 REAL NOT NULL,
                    volume_surge REAL NOT NULL
                );
            """)
            conn.commit()

    def save_call(self, call: EarningsCallDetail, key_theme: str = ""):
        with self._get_connection() as conn:
            conn.execute(
                """
                INSERT OR REPLACE INTO earnings_calls (
                    id, ticker, company_name, quarter, date, fiscal_year,
                    timing, net_sentiment, z_score_trailing_4q, car_t_plus_1,
                    key_theme, raw_data_json
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    call.id,
                    call.ticker,
                    call.company_name,
                    call.quarter,
                    call.date,
                    call.fiscal_year,
                    call.timing.value if hasattr(call.timing, "value") else str(call.timing),
                    call.tone_metrics.net_sentiment,
                    call.tone_metrics.z_score_trailing_4q,
                    call.pead_metrics.car_t_plus_1,
                    key_theme or (call.summary_takeaways[0] if call.summary_takeaways else ""),
                    call.model_dump_json(),
                ),
            )
            conn.commit()

    def get_call(self, call_id: str) -> Optional[EarningsCallDetail]:
        with self._get_connection() as conn:
            cursor = conn.execute("SELECT raw_data_json FROM earnings_calls WHERE id = ?", (call_id,))
            row = cursor.fetchone()
            if row:
                data = json.loads(row["raw_data_json"])
                return EarningsCallDetail.model_validate(data)
            return None

    def get_call_by_ticker_quarter(self, ticker: str, quarter: str) -> Optional[EarningsCallDetail]:
        with self._get_connection() as conn:
            cursor = conn.execute(
                "SELECT raw_data_json FROM earnings_calls WHERE UPPER(ticker) = ? AND UPPER(quarter) = ?",
                (ticker.upper(), quarter.upper()),
            )
            row = cursor.fetchone()
            if row:
                data = json.loads(row["raw_data_json"])
                return EarningsCallDetail.model_validate(data)
            return None

    def list_calls(self) -> List[EarningsCallSummary]:
        with self._get_connection() as conn:
            cursor = conn.execute(
                """
                SELECT id, ticker, company_name, quarter, date, fiscal_year,
                       timing, net_sentiment, z_score_trailing_4q, car_t_plus_1, key_theme
                FROM earnings_calls
                ORDER BY date DESC
                """
            )
            rows = cursor.fetchall()
            summaries = []
            for r in rows:
                summaries.append(
                    EarningsCallSummary(
                        id=r["id"],
                        ticker=r["ticker"],
                        company_name=r["company_name"],
                        quarter=r["quarter"],
                        date=r["date"],
                        fiscal_year=r["fiscal_year"],
                        timing=r["timing"],
                        net_sentiment=r["net_sentiment"],
                        z_score_trailing_4q=r["z_score_trailing_4q"],
                        car_t_plus_1=r["car_t_plus_1"],
                        key_theme=r["key_theme"] or "",
                    )
                )
            return summaries

    def save_correlation_points(self, points: List[CorrelationPoint]):
        with self._get_connection() as conn:
            for p in points:
                conn.execute(
                    """
                    INSERT INTO correlation_dataset (
                        ticker, quarter, date, sentiment_z_score, qa_divergence,
                        car_t_plus_1, car_t_plus_5, volume_surge
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        p.ticker,
                        p.quarter,
                        p.date,
                        p.sentiment_z_score,
                        p.qa_divergence,
                        p.car_t_plus_1,
                        p.car_t_plus_5,
                        p.volume_surge,
                    ),
                )
            conn.commit()

    def get_correlation_points(self) -> List[CorrelationPoint]:
        with self._get_connection() as conn:
            cursor = conn.execute(
                """
                SELECT ticker, quarter, date, sentiment_z_score, qa_divergence,
                       car_t_plus_1, car_t_plus_5, volume_surge
                FROM correlation_dataset
                """
            )
            rows = cursor.fetchall()
            return [
                CorrelationPoint(
                    ticker=r["ticker"],
                    quarter=r["quarter"],
                    date=r["date"],
                    sentiment_z_score=r["sentiment_z_score"],
                    qa_divergence=r["qa_divergence"],
                    car_t_plus_1=r["car_t_plus_1"],
                    car_t_plus_5=r["car_t_plus_5"],
                    volume_surge=r["volume_surge"],
                )
                for r in rows
            ]
