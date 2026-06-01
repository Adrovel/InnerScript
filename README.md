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
