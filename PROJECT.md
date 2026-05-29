# InnerScript Project Identity

## What It Is

InnerScript is a local-first AI journaling and notes app with chat over the user's own notes.

## Product Intent

- Problem: journals and notes become hard to search when important thoughts are buried across folders, dates, and half-remembered phrases.
- Intended solution: keep writing local, organized, searchable, and available through chat over personal notes.
- Public status: `Launching soon`.
- Contact link: `https://fahim.bitsit.in`.

## Current Implementation

- Next.js 15 app with a main `/Journal` route.
- PostgreSQL via Docker, Sequelize models, and pgvector for semantic note search.
- RAG flow: user message -> OpenAI embedding -> pgvector similarity over selected notes -> streamed GPT-4o-mini response through Vercel AI SDK.
- Public landing copy is edited in `landing.json`.

## Commands

```bash
npm run dev
npm run build
docker compose up -d --build
docker compose down
```

## Notes For Agents

- Requires `.env.local` with `DATABASE_URL` and `OPENAI_API_KEY`.
- Build verification can be blocked by pre-existing generated `.next` ownership issues.
- Do not overstate Joel's pgvector/AI backend fluency beyond what source files prove.
