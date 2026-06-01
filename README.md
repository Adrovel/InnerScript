# InnerScript

InnerScript is a local-first AI journaling and semantic memory system. The engineering goal is to make the project Google-worthy through explicit API contracts, source-backed retrieval, measurable search quality, and production-style systems components.

## Stack

- Next.js 16 App Router
- React 19
- JavaScript
- Tailwind CSS 4
- Route Handlers under `app/api/*` for backend contracts

## Getting Started

Install dependencies, start local Postgres/pgvector, run migrations, and run the development server:

```bash
npm install
cp .env.example .env.local
npm run db:up
npm run db:migrate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Verify the API boundary:

```bash
curl http://localhost:3000/api/health
```

## Environment

Copy `.env.example` to `.env.local` for local development and fill in only the values you need. AI keys are optional; core journaling must stay usable without AI.

The default database setup expects Docker Compose:

- dev database: `postgresql://postgres:postgres@localhost:5433/innerscript`
- test database: `postgresql://postgres:postgres@localhost:5434/innerscript_test`

The Docker image includes pgvector so Phase 2 semantic search can use the same local database setup.

## Project Direction

Use normal APIs for core behavior:

- `entries` and `sources` CRUD
- imports preview/confirm
- export
- semantic search
- people CRUD, with person-entry linking deferred
- analysis and digest endpoints

Server Actions can be used later for UI convenience only. They should not become the main backend boundary because the project needs testable, interview-defensible API contracts.

## Phase 0 Setup Artifacts

- Docker-optional Postgres/pgvector setup: `docker-compose.yml`
- Local smoke-test checklist: `SMOKE_TEST.md`
- `entries` and `sources` schema: `db/schema.js`
- API contract tests begin under `tests/`

## Commands

```bash
npm run dev
npm run db:up
npm run db:migrate
npm run db:down
npm run lint
npm test
npm run test:integration
npm run build
```

## Dev Docs

Canonical planning, architecture, research, and guardrail docs live in `dev-docs/`.
