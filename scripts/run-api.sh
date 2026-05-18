#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if [ ! -x ".venv/bin/uvicorn" ]; then
  echo "Missing .venv or uvicorn. Run: python3 -m venv .venv && npm run api:install"
  exit 1
fi

exec .venv/bin/uvicorn app.main:app --app-dir services/api --reload --port 8000
