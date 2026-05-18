# Turant Hire

TurantHire is organized as a monorepo with separate app surfaces for the public
website, employer workflow, candidate workflow, ops tooling, and a shared API
service.

## Apps

- `apps/web`: current public website and product introduction
- `apps/employer`: future employer product at `employer.turanthire.com`
- `apps/candidate`: future candidate product at `candidate.turanthire.com`
- `apps/ops`: future internal ops/admin workspace

## Services

- `services/api`: FastAPI backend with candidate-first domain scaffolding

## Run the current site

```bash
npm install
npm run dev
```

## Auth apps

Candidate auth app:

```bash
npm run candidate
```

Employer auth app:

```bash
npm run employer
```

Each app needs:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

The root scripts currently point to `apps/web`, which contains the existing
implemented version of the site.

## Backend setup

Create the local virtual environment and install the API dependencies:

```bash
python3 -m venv .venv
.venv/bin/pip install -e services/api
```

Run the FastAPI service:

```bash
npm run api
```

Or directly:

```bash
./scripts/run-api.sh
```

Run DB migrations:

```bash
npm run api:migrate
```
