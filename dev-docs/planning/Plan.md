# InnerScript Plan

Purpose: phase the work so Joel and Prithvi can build in parallel while keeping the project aligned with Google SWE L3 signal.

Update tracking: use `planning/Update-Log.md` for narrative project updates, who made them, what was verified, and open follow-ups. Use this plan for phase roadmap and deliverables.

## Priority Order

1. Build a Google-signal project.
2. Build a useful AI journaling app.
3. Learn agentic AI and AI systems.
4. Prepare for eventual consumer monetization.

## Phase 0 - Reset and Contracts

Goal: make the project direction unambiguous.

Deliverables:

- `planning/Features.md`
- `architecture/Architecture.md`
- `architecture/Stack-and-Tools.md`
- `research/Semantic-Meaning-Research.md`
- schema draft
- API contract draft

Owner:

- Joel owns direction and final architecture.
- Prithvi reviews for implementation clarity.

## Phase 1 - Local Journal Core

Goal: a clean local journaling app without depending on AI.

Deliverables:

- entries schema
- sources schema
- minimal editor
- autosave
- daily entry
- Markdown export
- `.env.example`
- local setup doc
- AI-off mode

Joel:

- define UX rules and data model
- review schema and privacy behavior

Prithvi:

- implement entry CRUD
- implement export endpoint
- write setup docs
- add tests for create/save/export

Google signal:

- component ownership
- clean data model
- product judgment

## Phase 2 - Semantic Core

Goal: convert text into searchable semantic memory.

Deliverables:

- chunking engine
- embedding adapter
- `chunks` table
- pgvector search endpoint
- search UI with source snippets
- evaluation seed set for search quality

Joel:

- define chunking rules
- define search evaluation queries
- review retrieval behavior

Prithvi:

- implement chunking
- implement embedding jobs
- implement search API/UI
- add tests for chunking and retrieval

Google signal:

- dense retrieval
- vector indexing
- evaluation discipline
- lexical vs semantic search tradeoffs

## Phase 3 - Voice and Imports

Goal: support real personal data beyond typed journal entries.

Deliverables:

- browser voice capture
- transcription endpoint
- transcript review screen
- Markdown importer
- `.txt` importer
- WhatsApp export parser
- import preview and confirm flow
- source provenance in UI

Joel:

- define privacy rules for audio and imported chats
- define import UX
- review WhatsApp parser assumptions

Prithvi:

- implement import parsers
- implement import preview
- implement voice capture UI
- wire transcription endpoint
- test parser edge cases

Google signal:

- ingestion pipeline
- parser design
- privacy-sensitive engineering
- async processing

## Phase 4 - People Route

Goal: add user-controlled people records without forcing person interactions into the entry model.

Deliverables:

- people schema
- `/people`
- `/people/[id]`
- aliases
- relationship type and description fields

Sentence-level people mentions, interaction timelines, and generated people insights are deferred to `dev-docs/planning/Future-Plan.md`.

Joel:

- define person-page language and safety rules
- define profile field rules

Prithvi:

- implement people CRUD
- implement person pages
- add tests for people APIs

Google signal:

- entity modeling
- privacy and product judgment

## Phase 5 - Insight Layer

Goal: turn stored text into source-backed patterns.

Deliverables:

- mood/topic metadata extraction
- weekly digest
- assumption extraction
- challenge-this flow
- contradiction/change detector
- insight dashboard

Joel:

- own prompts and insight taxonomy
- own assumption extraction contract
- own challenge-mode behavior

Prithvi:

- implement metadata storage
- implement dashboard components
- implement digest persistence
- write tests for API contracts and empty states

Google signal:

- structured LLM extraction
- RAG with provenance
- responsible AI design

## Phase 6 - Go Distributed Rate Limiter

Goal: build the explicit systems component that strengthens the Google signal.

Deliverables:

- Go service
- gRPC or HTTP API
- Redis Lua token bucket
- sliding window counter
- feature quota config
- Prometheus metrics
- load test
- failure-mode tests
- integration with Next.js hosted profile

Protected features:

- transcription
- embeddings
- note analysis
- semantic search
- weekly digest
- challenge chat

Joel:

- own Go architecture
- implement core limiter algorithm
- write system design explanation
- write load-test interpretation

Prithvi:

- help with integration client in Next.js
- implement config UI or config file support
- write integration tests
- help produce benchmark data

Google signal:

- Go proficiency
- Redis atomicity
- concurrency
- distributed consistency tradeoffs
- observability

## Phase 7 - Hosted Consumer Mode

Goal: turn the local project into a possible product without corrupting local-first trust.

Deliverables:

- auth
- user ownership columns
- hosted database isolation
- billing gates
- account export/delete
- backups
- background jobs
- quota enforcement with Go limiter

Joel:

- product/business boundaries
- privacy and billing decisions

Prithvi:

- implementation slices after architecture is frozen

Google signal:

- production readiness
- multi-tenant data isolation
- cost controls

## Immediate Work Split

### Joel - Next 5 Tasks

1. Finalize schema for `entries`, `sources`, `chunks`, `people`, `interactions`.
2. Write prompt contracts for metadata, assumptions, weekly digest.
3. Define semantic search evaluation queries.
4. Specify Go rate limiter API contract.
5. Review every feature for Google interview explanation.

### Prithvi - Next 5 Tasks

1. Add `.env.example` and local setup doc.
2. Implement entry/source CRUD around the new model.
3. Implement Markdown and text import parser.
4. Implement Markdown export.
5. Add tests for entry CRUD, import parsing, and export.

## Resume Target

The finished project should support a resume bullet like:

> Built InnerScript, a local-first AI journaling and semantic memory system that ingests typed notes, voice transcripts, and WhatsApp exports, chunks and indexes text with pgvector for semantic search, generates source-backed personal insights with LLMs, and protects hosted AI endpoints with a Go/Redis distributed rate limiter.
