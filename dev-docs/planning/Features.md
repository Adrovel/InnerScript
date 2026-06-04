# InnerScript Features

Purpose: define InnerScript as a Google-signal project, not just an AI notes app.

Grounding sources:
- `Personal Repo/04-Career/Organised/Identity, Skills and Current Standing/Cracking-Google.md`
- `Personal Repo/04-Career/Organised/Projects/01-Production-RAG-Backend.md`
- `Personal Repo/04-Career/Organised/Projects/02-Distributed-Rate-Limiter.md`
- `dev-docs/research/Semantic-Meaning-Research.md`

## Product Thesis

InnerScript is a local-first AI journaling and semantic memory system.

It converts private unstructured life text into searchable, source-backed insight:

- typed journal entries
- manual therapy/reflection entries written directly in InnerScript
- voice transcripts
- Markdown and text imports
- OCR text from physical notes
- note-app imports from tools such as Obsidian and Google Keep
- external-tool exports, including exported chats
- people records
- weekly and long-range reflection

The project goal is not "AI chat over notes." The Google-facing goal is:

> Build a real personal-data system with semantic retrieval, ingestion pipelines, explainable AI outputs, privacy boundaries, and a production-style distributed rate limiter for hosted AI endpoints.

## Google Signal

InnerScript should visibly demonstrate:

| Signal | Feature evidence |
|---|---|
| Component ownership | End-to-end journal, import, search, people, insights, and rate-limit modules |
| CS fundamentals | data modeling, indexing, queues, concurrency, caching, rate limiting |
| System design | local-first app plus hosted deployment profile |
| Backend depth | chunking, embeddings, pgvector, retrieval, rate limits, job processing |
| AI application skill | speech-to-text, semantic search, RAG, structured extraction |
| Product judgment | minimal UI, privacy-first defaults, source-backed insights |
| Googleyness | ambiguity, ownership, user focus, responsible AI boundaries |

## Development MVP

The development MVP should be deliberately smaller than the long-term product.

Build first:

- write
- save
- list
- open
- edit
- export
- one current-entry reflection question

Maintain while building:

- product knowledge routing
- priority-change log
- current `idea.md`, `Plan.md`, and `Atomic-Action-Plan.md` before implementation
- file-structure and convention decisions before source folders drift

Do not require these for the development MVP:

- dashboards
- imports
- AI people
- relationship analytics
- Go/Redis
- hosted auth/billing
- broad analysis before enough context exists

## MVP Features

## Google Impact Ranking

Use this table to decide what deserves engineering time first. "High" means it creates a clear Google interview/resume signal, not merely that it is useful for users.

| Feature | Google impact | Why |
|---|---|---|
| Semantic search over chunks | High | Demonstrates embeddings, pgvector, ranking, chunking tradeoffs, and retrieval evaluation |
| Text import pipeline | High | Shows ingestion design, parsing, idempotency, provenance, and async processing |
| Go distributed rate limiter | High | Direct distributed-systems signal: Redis, Lua atomicity, concurrency, quotas, failure modes |
| People route | High | Shows entity modeling and privacy-sensitive UX; mentions/interactions are deferred until after core journal/search/import foundations |
| Voice-to-text pipeline | High | Shows file upload, transcription, async jobs, privacy decisions, and multimodal text ingestion |
| Weekly digest with provenance | High | Shows RAG over filtered corpora, summarization, date windows, and grounded generation |
| Assumption extraction | Medium-High | Strong AI product differentiator, but must be source-backed and carefully scoped |
| Contradiction/change detection | Medium-High | Good semantic reasoning feature, but harder to evaluate cleanly in MVP |
| Mood/topic dashboard | Medium | Useful product feature, but common unless tied to retrieval, provenance, and evaluation |
| Minimal journal/editor | Medium | Necessary foundation, but weaker Google signal by itself |
| Hosted auth/billing | Medium | Production signal, but should come after local core and systems story |
| Product knowledge and conventions | Medium | Not a user-facing feature, but protects product clarity, team workflow, and implementation consistency |

Full debate UI and streaks/gamification are deferred to `dev-docs/planning/Future-Plan.md`.

Highest-priority Google-signal path:

```text
entries/sources/chunks
  -> import + voice ingestion
  -> semantic search with evaluation
  -> people/interactions route
  -> weekly digest with provenance
  -> Go/Redis rate limiter for hosted AI endpoints
```

### 1. Minimal Journal

The editor is the home screen, and the first product loop is write-first therapy/reflection.

Requirements:

- daily entry creation
- fast manual entry creation
- autosave
- Markdown/plain text support
- keyboard-first interactions
- AI-off mode
- exportable raw text
- reflective visual tone before search/dashboard complexity
- no created/edited metadata between title and body
- no dead top-bar controls
- New Note creates a real note immediately
- left sidebar stays simple and review-driven

Google signal:

- strong UX/product judgment without overbuilding
- clean client/server boundaries

### 1.5. Product Knowledge And Conventions

This is not a user-facing feature, but it is part of the development MVP workflow.

Requirements:

- `dev-docs/product-knowledge/` stores durable product knowledge learned while building
- priority changes are logged with rationale in `Priority-Change-Log.md`
- file-structure and `.wolf` conventions are decided with Prithvi before more implementation
- product behavior changes update `idea.md`, `Plan.md`, and `Atomic-Action-Plan.md` before implementation

Google signal:

- strong ownership and ambiguity management
- clear engineering process
- lower risk of context drift in a multi-person project

### 2. Entry and Source Model

Every piece of text must have provenance.

Entry types:

- `journal`
- `note`
- `conversation`

These values must match `ENTRY_TYPES` in `db/schema.js`. Keep `entry_type` broad: it describes the shape of the user text, while `source_type` records where imported or captured text came from. Person interaction linking is deferred to `dev-docs/planning/Future-Plan.md`.

Source types:

- `manual`
- `voice`
- `markdown`
- `text_file`
- `whatsapp_export`

These values must match `SOURCE_TYPES` in `db/schema.js`. Manually written entries should use `source_type=manual` when provenance is persisted through `sources`. `whatsapp_export` is currently the concrete exported-chat source type; the broader Phase 4 direction is an external-tools import agent, not a WhatsApp-only feature.

Google signal:

- data modeling and auditability
- source-backed AI outputs

### 3. Voice To Text

Flow:

```text
record audio
  -> transcribe
  -> show editable transcript
  -> save as entry
  -> chunk
  -> embed
  -> analyze
```

MVP behavior:

- browser microphone capture
- speech-to-text through provider adapter
- transcript review before save
- delete audio by default after transcript
- optional `KEEP_AUDIO=true` for local development

Google signal:

- file upload pipeline
- async processing
- privacy tradeoffs
- error and retry states

### 4. Text Imports

Supported first:

- Markdown files
- `.txt` files
- OCR-normalized text from physical notes
- note-app exports from Obsidian, Google Keep, and similar tools
- external-tool exports such as WhatsApp `.txt`, Telegram exports, Docs/Notion exports, email exports, and SMS exports
- clipboard paste

Flow:

```text
upload/import
  -> parse source
  -> preview normalized entries
  -> confirm import
  -> create entries/chunks
  -> enqueue embeddings and analysis
```

Do not attempt live app/API integration for external tools unless officially supported. Start with user-owned exported files.

Google signal:

- ingestion pipeline
- parser design
- idempotency
- data provenance

### 5. Semantic Search

Search over chunks, not only full notes.

Scopes:

- all entries
- date range
- source type
- topic
- emotion
- current folder/collection

Person-scoped search is deferred until person-entry linking exists.

Example queries:

- "times I felt behind in life"
- "conversations with Prithvi about InnerScript"
- "notes where money and anxiety appear together"
- "what did I say about Google prep last month?"

Google signal:

- dense retrieval
- pgvector indexing
- ranking and evaluation
- lexical vs semantic search tradeoffs

### 6. People Route

Routes:

```text
/people
/people/[id]
```

Purpose:

Represent people as entities in the user's personal semantic memory.

### 7. Reflection Modes

Purpose:

Let the user choose how the AI reflects back their own material.

Development path: start with one reflection question after writing. Add mode switching only after the simple question works.

Initial modes:

- gentle coach
- brutally honest analyst
- therapist-like reflector
- philosopher/debater
- writing/thinking coach

Rules:

- all claims about the user should be source-backed
- no diagnoses
- direct feedback must cite entries or be clearly marked as interpretation
- AI-off journaling must still work
- one-entry context allows a reflection question, not broad pattern analysis

Google signal:

- responsible AI behavior design
- prompt contracts
- source-backed generation
- user-controlled AI experience

### 8. Thinker / AI People Perspective Modes

Purpose:

Make AI people visible in the MVP roadmap as clearly labeled perspective simulations.

Examples:

- Nietzsche questioning values
- Alex Hormozi questioning sales mindset
- Jesus Christ discussing Christianity
- Machiavelli discussing power

Rules:

- do not pretend to be the real person
- label as a perspective lens or simulation
- separate external-perspective responses from personal-memory responses
- cite or summarize source grounding where possible
- do not let this replace the core journal/search/reflection loop

Person page:

- user-written description
- aliases
- relationship type
- lightweight profile details

Sentence-level people mentions, interaction timelines, and generated people insights are deferred to `dev-docs/planning/Future-Plan.md`.

Language rule:

- Say "Your notes describe..." not "Prithvi is..."

Google signal:

- entity modeling
- privacy-sensitive product design
- future graph-like relationships across text

### 7. Insights Dashboard

The dashboard should be quiet and inspection-oriented.

Sections:

- mood trend
- topic recurrence
- people recurrence
- semantic clusters
- open loops
- weekly digest
- hidden assumptions
- contradictions or changed beliefs

Google signal:

- aggregation queries
- explainable derived data
- user-focused AI output

### 8. Assumption Extraction

Use the Devil's Advocate idea as a reflection layer, not a full debate app.

Extract:

- foundational assumptions
- empirical assumptions
- normative assumptions
- scope assumptions
- load-bearing score
- challenge prompt

Action:

- "Challenge this" opens a focused reflection chat seeded with the assumption and source entries.

Google signal:

- structured LLM extraction
- responsible AI tone
- source-linked generated insight

### 9. Weekly Digest

Generated from the past week of entries and interactions.

Sections:

- main themes
- mood movement
- people who appeared
- open loops
- repeated assumptions
- one useful question for next week

Google signal:

- RAG over a date-filtered corpus
- summarization with provenance
- background job suitability

### 10. Distributed Rate Limiter

The rate limiter is not a journal feature. It is the hosted-mode systems layer.

Protect:

- transcription
- embeddings
- semantic search
- note analysis
- assumption extraction
- weekly digest
- challenge chat

Implementation target:

- Go service
- Redis
- Lua atomic scripts
- token bucket and sliding window
- metrics and load tests

Google signal:

- distributed systems depth
- Go proficiency
- atomicity and race-condition reasoning
- cost control for AI endpoints

## Explicit Non-Goals

- no medical or therapy claims
- no aggressive auto-created people graph
- no social feed
- no hosted auth/billing before local-first value works
- no all-Go rewrite of the product UI

Full debate UI and streaks/gamification are not active MVP features. They are tracked in `dev-docs/planning/Future-Plan.md`.
