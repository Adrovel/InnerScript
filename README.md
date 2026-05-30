# InnerScript

InnerScript is a local-first AI journaling and semantic memory system. The engineering goal is to make the project Google-worthy through explicit API contracts, source-backed retrieval, measurable search quality, and production-style systems components.

## Stack

- Next.js 16 App Router
- React 19
- JavaScript
- Tailwind CSS 4
- Route Handlers under `app/api/*` for backend contracts

## Getting Started

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Verify the API boundary:

```bash
curl http://localhost:3000/api/health
```

## Environment

Copy `.env.example` to `.env.local` for local development and fill in only the values you need. AI keys are optional; core journaling must stay usable without AI.

## Project Direction

Use normal APIs for core behavior:

- `entries` and `sources` CRUD
- imports preview/confirm
- export
- semantic search
- people CRUD
- analysis and digest endpoints

Server Actions can be used later for UI convenience only. They should not become the main backend boundary because the project needs testable, interview-defensible API contracts.

## Next Phase 0 Work

- Add Docker-optional Postgres/pgvector setup.
- Lock `entries` and `sources` schema before CRUD implementation.
- Add setup and smoke-test checklist.
- Implement API tests as soon as the first CRUD routes exist.

## Commands

```bash
npm run dev
npm run lint
npm run build
```

## Dev Docs

Canonical planning, architecture, research, and guardrail docs live in `dev-docs/`.
