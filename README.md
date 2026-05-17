# Turant Hire

TurantHire is being organized as a monorepo with separate app surfaces for the
main marketing website, employer workflow, candidate workflow, and ops tooling.

## Apps

- `apps/marketing-web`: current landing page and main website
- `apps/employer-web`: future employer product at `employer.turanthire.com`
- `apps/candidate-web`: future candidate product at `candidate.turanthire.com`
- `apps/ops-web`: future internal ops/admin workspace

## Run the current site

```bash
npm install
npm run dev
```

The root scripts currently point to `apps/marketing-web`, which contains the
existing implemented version of the site.
