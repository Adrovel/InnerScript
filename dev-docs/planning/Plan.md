# InnerScript Plan

Purpose: phase the work so Joel and Prithvi can build in parallel while keeping the project aligned with Google SWE L3 signal.

Update tracking: use `.wolf/update-log.md` for compact project updates. Use this plan for phase roadmap and deliverables.

## Progress

Overall: [###-------] 26%

Notification rule: when overall roadmap progress reaches or crosses 40%, tell Joel explicitly in the same session before moving on.

| Phase | Progress | Notes |
|---|---:|---|
| Phase 0 - Direction Lock | [#######---] 70% | thesis, docs, feature ranking, and schema direction are mostly clear; Drizzle rationale and a few architecture choices remain |
| Phase 0.5 - Product Knowledge And Project Conventions | [####------] 42% | product knowledge folder, priority-change log, and structure plan exist; `.wolf`, file structure, and source conventions still need discussion with Prithvi |
| Phase 0.6 - Landing Page Handover | [#####-----] 45% | `innerscript.in` designer handover exists; final landing copy/design and implementation remain |
| Phase 1 - Local Journal Core | [######----] 65% | entries/sources schema, CRUD APIs, editor, autosave, visible save state, and focused autosave tests exist; export/today/delete polish remain |
| Phase 1.5 - Product Clarity And Local UI Review | [########--] 85% | local server review captured, UI feedback stored in `.wolf/user-review.md`, sidebar/editor polish mostly confirmed; autosave browser stress remains |
| Phase 2 - Reflection Question | [#---------] 15% | direction chosen: one current-entry-dependent reflection question; implementation not started |
| Phase 3 - Semantic Core | [----------] 0% | deferred until journal loop is reliable |
| Phase 4 - Imports | [----------] 0% | deferred |
| Phase 5 - Freeform People Notes | [----------] 0% | deferred |
| Phase 6 - Source-Backed Insights | [----------] 0% | deferred |
| Phase 7 - Systems/Hosted | [----------] 0% | deferred |

## Priority Order

1. Build the minimum usable journal product first: write, save, autosave, open/edit, delete, export Markdown, and one reflection question.
2. Prioritize the highest interview-signal technical layers before broad feature completeness.
3. Keep product knowledge, priority changes, and implementation plans synchronized before more app changes.
4. Preserve the Google-signal project path through architecture, tradeoffs, ownership, and system thinking.
5. Learn and be able to explain AI/retrieval/backend concepts Joel has not deeply implemented before.
6. Prepare for eventual consumer monetization only after the core product and interview-signal foundations are credible.

## Core Strategic Shift

InnerScript is no longer optimized around finishing every future feature before applying.

It is now optimized around:

```text
Build the highest interview-signal parts first, while continuing development during the hiring pipeline.
```

Reason:

Google project discussions are likely to focus more on architecture, tradeoffs, ownership, technical decisions, and system thinking than on complete feature coverage.

Resume rule:

- Do not claim a complete Graph RAG semantic memory platform until it exists.
- Claims should survive deep technical discussion.
- Safe framing before full implementation: built MVP, built architecture, designed retrieval system, designed Graph RAG layer, implemented local-first journal, implemented reflection system, implemented semantic memory foundations.

## Planning Sync Rule

No app behavior change should be implemented unless these docs are updated or explicitly confirmed current in the same session:

- `dev-docs/design/idea.md`
- `dev-docs/planning/Plan.md`
- `dev-docs/planning/Atomic-Action-Plan.md`

If the change affects priority, also update:

- `dev-docs/product-knowledge/Priority-Change-Log.md`

If the change affects folder structure, file ownership, conventions, `.wolf`, session context, memory, buglog, or session logging, update:

- `dev-docs/product-knowledge/Structure-and-Conventions-Plan.md`
- `.wolf/session-context.md`
- `dev-docs/README.md`

## Development Simplicity Rule

The long-term vision can stay ambitious, but the development app should stay small.

Prefer:

- manual entries before imports
- one journal-first home screen before dashboards
- one reflection question after writing before multi-mode AI
- local Postgres before hosted infrastructure
- export before advanced analytics
- simple freeform people notes before people graphs
- chunking, embeddings, retrieval, citations, and Graph RAG design before dashboards/import breadth

Defer:

- AI people conversation UI
- relationship analytics
- mood/pattern dashboards
- OCR and note-app imports
- all imports until after journal MVP and retrieval foundations
- Go/Redis rate limiter
- hosted auth, billing, quotas, and consumer infrastructure
- production Graph RAG
- broad life analysis
- complex memory systems

## Interview-Signal Priority Order

1. Local-first architecture
2. Chunking
3. Embeddings
4. Retrieval
5. Hybrid search
6. Graph RAG
7. Knowledge graphs
8. Entity extraction
9. Prompt contracts
10. Rate limiting
11. Caching
12. Background jobs
13. Privacy-first AI systems
14. Source grounding
15. Reliability engineering

These create more immediate interview value than dashboards, analytics, hosted auth, billing, or broad life-analysis features.

## Updated Build Order

### Stage 1 - Minimum Usable Product

- journal CRUD
- autosave
- open/edit
- delete
- Markdown export
- one reflection question

### Stage 2 - Semantic Memory Foundations

- chunking
- embeddings
- retrieval
- hybrid search
- source grounding
- citations

### Stage 3 - Graph RAG Design Layer

- entity extraction
- graph structure
- knowledge graph decisions
- graph retrieval design
- Graph RAG tradeoffs and failure modes

### Stage 4 - Broader Memory

- imports
- search polish
- advanced memory
- dashboards only after enough source context exists

## Ownership Update

Joel should spend most of his InnerScript time on learning and architecture for areas he has not deeply implemented before:

- chunking strategies and semantic chunking
- embeddings and retrieval pipelines
- hybrid retrieval and source grounding
- citation systems
- knowledge graphs and Graph RAG architecture
- entity extraction
- reflection prompt contracts
- AI safety boundaries
- rate limiting, caching, background jobs, local-first architecture, privacy-first design, and AI evaluation

Prithvi should focus on frontend engineering depth and delivery:

- Storybook
- component architecture
- design system and reusable UI primitives
- editor UX, autosave UI, save indicators, entry list, open/edit, delete, export
- frontend testing, Playwright/Cypress, accessibility, error states, empty states, offline behavior
- bug fixing, verification, checklist reconciliation, and acceptance criteria

## Development Phase Roadmap

### Phase 1 - Simple Local Journal

Goal: write, save, list, open, and edit entries without friction.

### Phase 0.5 - Product Knowledge And Project Conventions

Goal: decide how InnerScript stores product knowledge, priority changes, operational context, and file/folder conventions before more implementation adds drift.

Deliverables:

- `dev-docs/product-knowledge/README.md`
- `dev-docs/product-knowledge/Priority-Change-Log.md`
- `dev-docs/product-knowledge/Structure-and-Conventions-Plan.md`
- final decision with Prithvi on `.wolf` naming/role
- final decision with Prithvi on app source folder conventions
- final decision with Prithvi on tests, product knowledge, and operational logs
- updated `Product-Decisions.md` and `Open-Questions.md`
- updated `Plan.md` and `Atomic-Action-Plan.md` after the decision

Owner:

- Joel owns the final product/context workflow decision.
- Prithvi reviews implementation and source-folder practicality.
- Agents keep docs synchronized before implementation.

Exit criteria:

- contributors know where product knowledge belongs
- priority changes have a log and rationale
- `.wolf` files and session logs have an accepted role or migration path
- source-folder and test conventions are decided enough for the next implementation phase

### Phase 0.6 - InnerScript.in Landing Page Handover

Goal: give a designer enough context to create a verbal-first landing page for `innerscript.in`.

Deliverables:

- `dev-docs/design/InnerScript.in-Landing-Page-Handover.md`
- clear audience definition: collaborators/builders/investors, employers, lay users
- color palette and visual feel from Alexandria
- product thesis, problem, solution, roadmap, technical credibility, and copy seeds
- final landing copy and implementation later

Owner:

- Joel owns the product intent and final landing voice.
- Designer owns visual exploration and landing composition.
- Agents keep the handover aligned with `idea.md`, `Plan.md`, and `Atomic-Action-Plan.md`.

Exit criteria:

- a designer can understand what InnerScript is and why it matters
- the page direction is clearly verbal-first
- visual palette, tone, audiences, and content hierarchy are defined
- landing implementation is not started until the handover is accepted

### Phase 1.5 - Local UI Review And Friction Removal

Goal: use Joel's local feedback to remove friction before adding intelligence.

Current UI rules from review:

- no dead Share or More buttons
- Refresh means reload entries from the database
- left notes sidebar should be simple and calm
- New Note should create/select a real note immediately
- created/edited metadata must not sit between title and body

### Phase 2 - One Reflection Question

Goal: after writing, ask one grounded reflection question from the current entry.

Do not add broad analysis yet. One entry means entry-specific reflection only.

### Phase 3 - Semantic Core

Goal: chunk, embed, search, and cite entries after the journal loop is stable.

### Phase 4 - Imports

Goal: bring in Markdown/text/OCR/external-tool exports/chats with provenance after manual entries are reliable.

### Phase 5 - Freeform People Notes

Goal: support freeform relationship notes before structured people analytics.

### Phase 6 - Source-Backed Insights

Goal: weekly digest, patterns, assumptions, and challenge mode with citations.

### Phase 7 - Systems And Hosted Profile

Goal: Go/Redis limiter and hosted consumer mode after the local product has value.

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

Goal: a clean local journaling app that feels like therapy/reflection software first and does not depend on AI.

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
- reflection-first UI language and empty states
- no dashboard, import, or AI people work in Phase 1

Joel:

- define UX rules and data model
- define therapy/reflection tone for the write-first loop
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

Simplicity rule:

- If a Phase 1 task makes local setup, writing, saving, or export harder, defer it unless it is required for data safety.

## Phase 2 - Reflection Question

Goal: add the first AI moment without making the app feel heavy.

Deliverables:

- reflection-question button or subtle prompt after writing
- current-entry-only prompt contract
- no broad user analysis from one entry
- hidden or disabled if AI is unavailable

Joel:

- define the first reflection-question tone
- approve safe language

Prithvi:

- implement the smallest UI/API path after contract is clear

Google signal:

- responsible AI behavior
- product restraint

## Phase 3 - Semantic Core

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

## Phase 4 - Voice and Imports

Goal: support real personal data beyond typed journal entries.

Deliverables:

- browser voice capture
- transcription endpoint
- transcript review screen
- Markdown importer
- `.txt` importer
- OCR-normalized physical note import path
- Obsidian / Google Keep / note-app export import path
- external tools export/import agent for user-owned exports from tools such as WhatsApp, Telegram, Docs, Notion, email, and SMS
- import preview and confirm flow
- source provenance in UI

Joel:

- define privacy rules for audio and imported chats
- define import UX
- define first external-tool export targets and parser assumptions

Prithvi:

- implement import parsers through the external-tools import agent shape
- implement import preview
- implement voice capture UI
- wire transcription endpoint
- test parser edge cases

Google signal:

- ingestion pipeline
- parser design
- privacy-sensitive engineering
- async processing

## Phase 5 - Freeform People Notes

Goal: start relationship memory as freeform notes before structured people analytics.

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

## Phase 6 - Insight Layer

Goal: turn stored text into source-backed patterns.

Deliverables:

- mood/topic metadata extraction
- weekly digest
- assumption extraction
- challenge-this flow
- reflection mode switcher
- thinker/personality perspective mode prototype
- contradiction/change detector
- insight dashboard

Joel:

- own prompts and insight taxonomy
- own assumption extraction contract
- own challenge-mode behavior
- own mode contracts for gentle coach, brutally honest analyst, therapist-like reflector, philosopher/debater, and writing/thinking coach
- define safe labeling for thinker/personality perspective modes

Prithvi:

- implement metadata storage
- implement dashboard components
- implement digest persistence
- write tests for API contracts and empty states

Google signal:

- structured LLM extraction
- RAG with provenance
- responsible AI design

Thinker/personality perspective modes are visible in the MVP roadmap but should not replace journal, source, search, and provenance foundations. They must be labeled as simulations or lenses, not the real person.

## Phase 7 - Go Distributed Rate Limiter

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

## Phase 8 - Hosted Consumer Mode

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

> Built InnerScript, a local-first AI journaling and semantic memory system that ingests typed notes, voice transcripts, and external-tool exports, chunks and indexes text with pgvector for semantic search, generates source-backed personal insights with LLMs, and protects hosted AI endpoints with a Go/Redis distributed rate limiter.

## Google Signal

Source: `Personal Repo/04-Career/Organised/Projects/Google-Project-Googliness-Algorithm.md`

| Dimension | Score |
|---|---:|
| Role Skill Alignment | 22/25 |
| Engineering Depth | 18/20 |
| Current Standing / Proof | 14/20 |
| Technical + Business Prospect | 13/15 |
| Googleyness Story | 7/10 |
| Level Fit | 8/10 |
| **Total** | **82/100** |

Read: InnerScript is the strongest Google technical signal: AI/RAG, semantic search, local-first data ownership, pgvector, retrieval quality, and database-backed product design.

Upgrade path:

- Add a standalone RAG backend/service with measurable p95/p99 latency.
- Add evaluation cases for retrieval quality.
- Add import/export and source-backed answer citations.
- Write one architecture doc covering chunking, embeddings, indexing, privacy, and failure modes.
