# InnerScript Architecture

Purpose: define the target system from scratch for a strong Google SWE L3 project.

## Architecture Summary

InnerScript has two deployment profiles:

| Profile | Purpose | Infra |
|---|---|---|
| Local open-source | privacy-first user runs it locally | Next.js, local Postgres/pgvector, optional AI key |
| Hosted consumer | polished paid product later | auth, hosted database, job workers, Redis, Go rate limiter |

The same core domain model should serve both profiles. Hosted mode adds account boundaries, quotas, billing, and background infrastructure.

## High-Level System

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│                                  Client                                      │
│                                                                              │
│  Next.js / React app                                                         │
│  ┌────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────┐ ┌──────────┐ │
│  │ Journal    │ │ Voice input  │ │ Import review│ │ Search   │ │ People   │ │
│  └────────────┘ └──────────────┘ └──────────────┘ └──────────┘ └──────────┘ │
│                                      ┌─────────────────────┐                 │
│                                      │ Reflection Modes    │                 │
│                                      └─────────────────────┘                 │
│                                      ┌─────────────────────┐                 │
│                                      │ Insights / Digest   │                 │
│                                      └─────────────────────┘                 │
└───────────────────────────────────────┬──────────────────────────────────────┘
                                        │ HTTP / streaming responses
                                        ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                              Application API                                 │
│                                                                              │
│  Next.js API routes for local-first MVP                                      │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐ │
│  │ Entries    │ │ Sources    │ │ Imports    │ │ Search     │ │ People     │ │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘ └────────────┘ │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌──────────────────────────┐ │
│  │ Voice/STT  │ │ Analysis   │ │ Insights   │ │ Export / Local setup     │ │
│  └────────────┘ └────────────┘ └────────────┘ └──────────────────────────┘ │
└───────────────┬──────────────────────────────┬───────────────────────────────┘
                │                              │
                │ cost-bearing hosted calls    │ local/open-source calls
                ▼                              ▼
┌─────────────────────────────────┐    ┌───────────────────────────────────────┐
│ Hosted Protection Layer          │    │ Semantic Processing Pipeline          │
│ hosted profile only              │    │                                       │
│                                  │    │  parse                                │
│  Next.js limiter client          │    │   -> normalize                        │
│       │                          │    │   -> chunk                            │
│       ▼                          │    │   -> embed                            │
│  Go rate limiter service         │    │   -> analyze                          │
│       │                          │    │   -> link people/entities             │
│       ▼                          │    │   -> generate source-backed insight   │
│  Redis + Lua atomic quotas       │    │                                       │
│                                  │    │  Provider adapters:                   │
│  protects: STT, embeddings,      │    │  - embeddings                         │
│  analysis, search, digest, chat  │    │  - speech-to-text                     │
└─────────────────────────────────┘    │  - structured LLM extraction          │
                                       └──────────────────┬────────────────────┘
                                                          │
                                                          ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                                  Storage                                     │
│                                                                              │
│  PostgreSQL + pgvector                                                       │
│  ┌─────────┐ ┌─────────┐ ┌────────┐ ┌────────────────┐ ┌──────────────┐    │
│  │ entries │ │ sources │ │ chunks │ │ entry_metadata │ │ assumptions  │    │
│  └─────────┘ └─────────┘ └────────┘ └────────────────┘ └──────────────┘    │
│  ┌────────┐ ┌─────────┐                                                     │
│  │ people │ │ digests │                                                     │
│  └────────┘ └─────────┘                                                     │
│                                                                              │
│  Optional local file storage                                                 │
│  - imported source files                                                     │
│  - audio only when explicitly retained                                       │
└──────────────────────────────────────────────────────────────────────────────┘
```

## Local vs Hosted Boundaries

```text
Local open-source mode
  Next.js app
    -> local API routes
    -> local PostgreSQL + pgvector
    -> optional AI provider key
    -> no Redis required
    -> no Go service required

Hosted consumer mode
  Next.js app
    -> auth and user isolation
    -> cost-bearing endpoints checked by Go rate limiter
    -> hosted PostgreSQL + pgvector
    -> Redis for quotas/cache/jobs
    -> billing, observability, account export/delete
```

## Core Data Model

### `entries`

Primary user text unit.

```text
id
user_id nullable in local mode
title
body
entry_type
source_id
occurred_at
created_at
updated_at
```

Current `entry_type` values are defined in `db/schema.js`: `journal`, `note`, and `conversation`.

### `sources`

Provenance for imported or generated text.

```text
id
source_type
display_name
original_filename
metadata jsonb
imported_at
created_at
```

Current `source_type` values are defined in `db/schema.js`: `manual`, `voice`, `markdown`, `text_file`, and `whatsapp_export`.

Planned source expansion should include OCR-normalized physical notes and external-tool exports such as Obsidian, Google Keep, Docs, Notion, Telegram, email, SMS, and WhatsApp. These should be modeled as source metadata first, not as new entry types unless the shape of the text genuinely changes. The current `whatsapp_export` value is a concrete first exported-chat source, not a sign that Phase 4 is WhatsApp-only.

### `chunks`

Searchable semantic units.

First strategy: paragraph-first chunking with max-token fallback. See `dev-docs/architecture/Chunking-Strategy.md` for the initial decision, alternatives considered, metadata, source-reference rules, and failure modes.

```text
id
entry_id
chunk_index
text
token_count
embedding vector(1536)
metadata jsonb
created_at
```

### `entry_metadata`

One-to-one AI-derived metadata for each entry.

```text
id
entry_id
mood_score
arousal
emotion_label
topics jsonb
summary
analysed_at
created_at
updated_at
```

### `assumptions`

Many-to-one extracted assumptions.

```text
id
entry_id
chunk_id nullable
assumption_type
text
load_bearing_score
challenge_prompt
created_at
```

### `people`

User-controlled person entities.

```text
id
display_name
aliases jsonb
description
relationship_type
created_at
updated_at
```

Sentence-level people mentions and richer interaction linking are deferred to `dev-docs/planning/Future-Plan.md`. They should not affect the initial entry schema.

### `digests`

Generated summaries over a period.

```text
id
period_start
period_end
digest_type
body
metadata jsonb
created_at
```

## Key Flows

### Journal Entry Flow

```text
User writes
  -> autosave entry
  -> chunk entry
  -> embed chunks
  -> extract metadata
  -> update insights
```

The save path must remain independent from AI. A note is saved even if AI fails.

Phase 1 starts with manual entries because the therapy/reflection loop needs reliable private writing before imports, search, or AI modes become central.

### Reflection Mode Flow

```text
User selects mode
  -> ask question or request reflection
  -> retrieve source entries/chunks when needed
  -> generate response with mode contract
  -> show citations or uncertainty
  -> allow user to mark insight wrong
```

Initial modes:

- gentle coach
- brutally honest analyst
- therapist-like reflector
- philosopher/debater
- writing/thinking coach

Thinker/personality modes should be treated as perspective lenses or simulations. They must not claim to be the real person, and they should separate external perspective from claims grounded in the user's own notes.

### Voice Flow

```text
Record audio
  -> upload to transcription endpoint
  -> transcribe
  -> user edits transcript
  -> save entry with source=voice
  -> delete audio unless explicitly configured otherwise
```

### Import Flow

```text
Upload file
  -> parse source format
  -> normalize entries
  -> preview import
  -> confirm
  -> create source, entries, chunks
  -> enqueue semantic processing
```

External-tool exports should be parsed locally from user-owned exported files. WhatsApp `.txt` is one likely first parser; do not use unofficial scraping.

### Semantic Search Flow

```text
Query
  -> embed query
  -> filter candidate chunks by scope
  -> pgvector similarity search
  -> optional lexical/hybrid rerank
  -> group by entry/source
  -> return source-backed results
```

Search must show why a result matched and where the original text came from.

### People Flow

```text
Create person manually
  -> add aliases
  -> render person page
```

Entry/person linking, interaction summaries, and automatic person extraction are deferred. Future automatic person extraction must be confirmation-based.

### Hosted Rate-Limit Flow

```text
Request to cost-bearing endpoint
  -> Next.js checks feature quota
  -> Go rate limiter checks Redis atomically
  -> allowed: continue
  -> denied: return 429 with retry_after
```

Local mode can use no-op or in-memory limiting. Hosted mode uses the Go service.

## Google-Facing Design Decisions

### Chunk-Level Embeddings

Decision: embed chunks rather than only full entries.

Reason:

- full journal entries contain multiple topics
- paragraph-level chunks improve retrieval precision
- people mentions often live inside longer entries

Tradeoff:

- more rows and embedding calls
- better search quality and source specificity

### PostgreSQL + pgvector First

Decision: keep relational data and vectors in Postgres for MVP.

Reason:

- simpler open-source local setup
- SQL filters combine cleanly with vector search
- one backup/export story

Tradeoff:

- a dedicated vector DB may scale further later
- pgvector index tuning becomes important at larger sizes

### Manual People First

Decision: people are manually created first; AI suggests links later.

Reason:

- personal data needs trust
- automatic entity extraction creates noisy or sensitive mistakes

Tradeoff:

- slower onboarding
- much higher user control

### Go Only For Systems Boundary

Decision: use Go for distributed rate limiting, not the whole app.

Reason:

- product iteration stays fast in Next.js
- Go demonstrates concurrency/system design where it matters
- clean service boundary makes the interview story stronger

Tradeoff:

- extra service complexity in hosted mode
- not needed for local MVP

## Reliability Requirements

- journal saves work without AI
- imports are idempotent
- AI jobs can retry safely
- generated insights link to sources
- rate limiter failure mode is explicit: fail-open for local/dev, configurable fail-open/fail-closed for hosted
- export works even if AI metadata is missing

## Observability Targets

Track:

- search latency p50/p95/p99
- import parse failures
- embedding job latency
- transcription latency
- AI cost by feature
- rate limiter allowed/denied counts
- Redis latency for hosted mode
- semantic search precision evaluation set
