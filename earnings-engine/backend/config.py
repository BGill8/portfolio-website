"""
Configuration settings for Real-Time Earnings Call Sentiment & Market Alpha Engine.
"""

from pathlib import Path
from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(exist_ok=True, parents=True)

DB_PATH = DATA_DIR / "earnings_alpha.db"

# FinBERT Model Configuration
FINBERT_MODEL_NAME = "ProsusAI/finbert"
BATCH_SIZE = 16
DEVICE = "cpu"  # default to cpu for universal compatibility & low memory footprint

# Default Supported Tickers for Demo & Pre-computations
FLAGSHIP_TICKERS = ["NVDA", "AAPL", "TSLA", "MSFT", "META", "AMZN", "GOOGL"]

# SEC EDGAR Requirements
SEC_USER_AGENT = "BrandonGillPortfolioFinancialAnalytics/1.0 (brandon@example.com)"

# Server Configuration
HOST = "0.0.0.0"
PORT = 8000
