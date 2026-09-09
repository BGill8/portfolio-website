#!/usr/bin/env python3
"""
Convenience launcher for the Earnings Sentiment & Market Alpha Engine.
Usage: python3 run_server.py [--port 8000]
"""

import argparse
import sys
from pathlib import Path
import uvicorn

# Ensure the earnings-engine directory is in sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent))

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run Earnings Sentiment & Market Alpha FastAPI server")
    parser.add_argument("--host", default="0.0.0.0", help="Host address (default: 0.0.0.0)")
    parser.add_argument("--port", type=int, default=8000, help="Port (default: 8000)")
    parser.add_argument("--reload", action="store_true", default=True, help="Enable auto-reload")
    args = parser.parse_args()

    print(f"Starting Earnings Alpha Engine on http://{args.host}:{args.port} ...")
    uvicorn.run("backend.api.main:app", host=args.host, port=args.port, reload=args.reload)
