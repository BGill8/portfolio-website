# Real-Time Earnings Call Sentiment & Market Alpha Engine

An end-to-end financial data science & NLP microservice that extracts structured quantitative intelligence from unstructured corporate earnings calls, scores executive tone shifts via FinBERT, and models Post-Earnings Announcement Drift (PEAD).

---

## Architecture Overview

```
[ SEC EDGAR / yfinance / Ingestion ]
                │
                ▼
[ Institutional Transcript Parser (transcript_parser.py) ]
  • Segments into Prepared Remarks vs. Unscripted Q&A
  • Speaker Attribution: CEO, CFO, Analysts, Operator
  • Financial sentence tokenizer (protects decimals, %, abbreviations)
                │
                ▼
[ FinBERT Sentiment & Tone Engine (finbert_classifier.py + tone_analyzer.py) ]
  • Sentence-level probabilities (positive, negative, neutral)
  • Forward-Looking Statement (FLS) guidance detector
  • Uncertainty / Hedging index (Loughran-McDonald based)
  • Executive Divergence Delta (Q&A tone minus Prepared Remarks tone)
                │
                ▼
[ Quantitative Alpha Engine (quant/pead.py + quant/alpha_engine.py) ]
  • Scaffolded for Brandon Gill (Phase 2)
  • Intraday & T+1, T+5, T+30 Cumulative Abnormal Returns (CAR) vs. SPY
  • Trailing 4-quarter Z-score anomaly calculation
  • Pearson & Spearman rank correlation metrics
                │
                ▼
[ SQLite / PostgreSQL Cache (db/database.py + db/seed_data.py) ]
  • Pre-seeded flagship calls (NVDA, TSLA, AAPL, MSFT)
  • 16-quarter historical correlation dataset for instant loading
                │
                ▼
[ FastAPI High-Performance Microservice (api/main.py) ]
  • Endpoints: /api/v1/earnings/*, /api/v1/alpha/*, /api/v1/analyze/*
```

---

## Quick Start

### 1. Requirements & Dependencies
Ensure Python 3.10+ is installed.
```bash
pip install -r requirements.txt
```

### 2. Launch FastAPI Server
```bash
python3 run_server.py --port 8000
```
Interactive OpenAPI documentation will be live at:
- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## API Endpoints

| Method | Route | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Health check & microservice status |
| `GET` | `/api/v1/earnings/calls` | List available processed earnings calls |
| `GET` | `/api/v1/earnings/{ticker}/{quarter}` | Retrieve full call with parsed sentences, tone metrics, and price history |
| `GET` | `/api/v1/alpha/correlation` | Statistical correlation between sentiment Z-scores and CAR |
| `GET` | `/api/v1/alpha/pead-comparison` | Comparative multi-horizon PEAD drift curves |
| `POST` | `/api/v1/analyze/transcript` | Run on-demand NLP inference and tone analysis on custom text |

---

## Phase 2 Implementation Guide (For Brandon Gill)

The core quant files have been scaffolded with typed interfaces, documentation, baseline formulas, and designated `# TODO (Phase 2): Brandon Gill` markers:

### 1. `backend/quant/pead.py`
- **Location**: [`backend/quant/pead.py`](./backend/quant/pead.py)
- **What to build**:
  - Implement rolling OLS beta estimation (e.g. 252-day window against SPY) instead of fixed static beta:
    $$\beta = \frac{\text{Cov}(R_i, R_{SPY})}{\text{Var}(R_{SPY})}$$
  - Calculate Cumulative Abnormal Returns ($CAR$):
    $$CAR_{\tau} = \sum_{t=0}^{\tau} (R_{stock, t} - \beta \cdot R_{SPY, t})$$
  - Model PEAD decay rate (fitting an exponential half-life curve to post-earnings drift).

### 2. `backend/quant/alpha_engine.py`
- **Location**: [`backend/quant/alpha_engine.py`](./backend/quant/alpha_engine.py)
- **What to build**:
  - Test multivariate OLS:
    $$CAR_{T+1} = \beta_0 + \beta_1 \cdot Z_{\text{sentiment}} + \beta_2 \cdot \Delta_{\text{Q\&A}} + \beta_3 \cdot \text{VolSurge} + \epsilon$$
  - Implement Heteroskedasticity-Consistent (White / Newey-West) standard errors.
  - Backtest a simulated market-neutral Long/Short quintile portfolio based on sentiment surprise and output Sharpe & Information Ratios.
