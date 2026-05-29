# InnerScript Stack and Tools

Purpose: define the stack that best supports the product and the Google SWE L3 signal.

## Stack Summary

| Layer | Tool | Why |
|---|---|---|
| App framework | Next.js 15 | full-stack React, fast iteration, API routes for MVP |
| UI | React 19 | component model and strong ecosystem |
| Styling | Tailwind CSS 4 + shadcn/ui | minimal, accessible UI without heavy design overhead |
| Primary DB | PostgreSQL | relational source of truth |
| Vector search | pgvector | local-first semantic search without extra vector DB |
| ORM/query | SQL + lightweight query helpers; ORM optional | explicit schema and interview-friendly SQL reasoning |
| AI SDK | Vercel AI SDK / provider adapters | structured extraction, streaming, provider swappability |
| Speech-to-text | OpenAI transcription first; local adapter later | fast MVP with future privacy option |
| Rate limiter | Go + Redis + Lua | strong systems signal and hosted cost control |
| Queue | start simple; BullMQ/Redis or worker process later | async imports, transcription, embeddings, digests |
| Testing | Vitest + Testing Library + API tests | fast local verification |
| Load testing | k6 or autocannon | measurable latency/QPS for Google story |
| Observability | Prometheus metrics for Go service; structured logs elsewhere | operational maturity |

## Frontend

Use:

- Next.js App Router
- React client components for editor, voice recorder, import review, search, people pages
- server components where data fetching is stable
- Tailwind CSS
- shadcn/ui primitives
- lucide icons

UI direction:

- minimal, writing-first
- collapsible sidebar and right rail
- no marketing-style dashboard as home
- charts only where they explain patterns
- source links on AI insights

## Database

Use PostgreSQL as the single source of truth.

Core tables:

- `entries`
- `sources`
- `chunks`
- `entry_metadata`
- `assumptions`
- `people`
- `interactions`
- `digests`

Use pgvector for chunk embeddings.

Indexing:

- B-tree indexes for foreign keys and dates
- GIN where JSONB/query use justifies it
- pgvector exact search for small local datasets
- HNSW or IVFFlat when data grows

Google talking point:

- explain when exact vector search is acceptable and when ANN becomes necessary.

## AI and NLP

Initial providers:

- OpenAI embeddings for semantic search
- OpenAI speech-to-text for voice journaling
- GPT-4o-mini or current low-cost model for metadata/assumption extraction

Design rule:

- every AI provider sits behind an adapter
- AI-off mode must keep journaling usable
- generated insights must point back to source entries/chunks

Important docs:

- `research/Semantic-Meaning-Research.md`

## Import Parsers

Initial parsers:

- Markdown
- plain text
- WhatsApp exported `.txt`
- clipboard paste

Parser rules:

- preserve source provenance
- preview before import
- idempotency key to avoid duplicate imports
- keep raw file optional, not required

## Go Rate Limiter

Use Go for the hosted rate-limiter service only.

Components:

- Go HTTP or gRPC service
- Redis client
- Lua scripts for atomic read/modify/write
- token bucket algorithm
- sliding window counter
- Prometheus `/metrics`
- k6/autocannon load test

Protected hosted features:

- transcription
- embeddings
- analysis
- semantic search
- digest generation
- challenge chat

Why Go:

- explicit concurrency model
- strong Google infrastructure signal
- low request overhead
- mature gRPC/HTTP ecosystem
- clear boundary from the product UI

## Local vs Hosted Config

### Local Open-Source

Required:

- Docker Compose
- PostgreSQL + pgvector
- `.env.example`
- AI-off mode
- optional `OPENAI_API_KEY`
- no Redis required
- no Go service required for basic local journaling

### Hosted Consumer

Required:

- auth
- hosted Postgres
- Redis
- Go rate limiter
- background jobs
- billing
- account export/delete
- observability

## Testing Strategy

### Unit Tests

- chunking
- import parsers
- prompt output schema validation
- rate-limiter algorithm math

### API Tests

- entry CRUD
- import confirm flow
- search endpoint
- people CRUD
- export endpoint

### Integration Tests

- import file -> entries -> chunks -> search
- voice transcript -> entry -> analysis
- person link -> person page summary
- hosted request -> rate limiter -> protected endpoint

### Load Tests

- semantic search p95/p99 latency
- import throughput
- rate limiter QPS and Redis latency

## Metrics To Produce For Resume

Target measurable outputs:

- semantic search p95 latency on N chunks
- import throughput for WhatsApp export of N messages
- transcription processing time per minute of audio
- rate limiter QPS and p99 latency
- Redis Lua correctness under concurrent requests
- search quality Precision@5 on hand-labeled queries
