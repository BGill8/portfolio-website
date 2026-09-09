"""
Main FastAPI Application Entrypoint.
Serves financial NLP sentiment signals, PEAD alpha metrics, and interactive transcript data.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes import earnings, alpha, analyze
from ..db.database import DatabaseManager
from ..db.seed_data import seed_database


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure DB and pre-computed seed calls are populated
    db = DatabaseManager()
    seed_database(db)
    yield
    # Shutdown logic if needed


app = FastAPI(
    title="Real-Time Earnings Sentiment & Market Alpha Engine",
    description=(
        "An automated analytical pipeline extracting structured quantitative financial intelligence "
        "from corporate earnings calls, running FinBERT tone analysis, and correlating sentiment "
        "anomalies with Post-Earnings Announcement Drift (PEAD)."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

# Enable CORS for local Next.js development and production hosting
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routers
app.include_router(earnings.router, prefix="/api/v1")
app.include_router(alpha.router, prefix="/api/v1")
app.include_router(analyze.router, prefix="/api/v1")


@app.get("/health", tags=["System"])
def health_check():
    return {
        "status": "healthy",
        "service": "earnings-alpha-engine",
        "version": "1.0.0",
    }


@app.get("/", tags=["System"])
def root():
    return {
        "message": "Real-Time Earnings Call Sentiment & Market Alpha Engine API",
        "docs": "/docs",
        "endpoints": [
            "/api/v1/earnings/calls",
            "/api/v1/earnings/{ticker}/{quarter}",
            "/api/v1/alpha/correlation",
            "/api/v1/alpha/pead-comparison",
            "/api/v1/analyze/transcript",
        ],
    }
