# API Service

FastAPI backend for TurantHire.

Current direction:

- candidate-first v1 foundation
- clean separation between API, business modules, repositories, and DB layer
- generic DB store primitives under `app/db/store`
- no duplicated business logic across candidate, employer, and ops consumers

## Planned first flow

1. candidate profile create/update
2. candidate availability update
3. candidate readiness retrieval for matching workflows

## Install

From the repo root:

```bash
python3 -m venv .venv
.venv/bin/pip install -e services/api
```

## Configure

Copy the example env file and fill in your Supabase project values:

```bash
cp .env.example .env
```

For v1, the backend only needs `DATABASE_URL`. Use the Supabase Postgres
connection string and keep all keys in `.env`, not in source files.

## Run

From the repo root:

```bash
.venv/bin/uvicorn app.main:app --app-dir services/api --reload
```

## Current API

- `GET /api/candidate/health`
- `POST /api/candidate/profiles`
- `GET /api/candidate/profiles/{candidate_id}`
- `PUT /api/candidate/profiles/{candidate_id}`
- `PUT /api/candidate/profiles/{candidate_id}/availability`

## Notes

- The rest of the backend does not need to know whether the database is local
  Postgres or Supabase Postgres. Only `DATABASE_URL` changes.
- Supabase-specific API keys are kept optional until we add Auth or Storage.
