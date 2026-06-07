# InnerScript Atomic Action Plan

Purpose: split InnerScript from zero to Google-signal completion into atomic tasks for Joel and Prithvi.

Rule: every task must either produce a working artifact, a test, a benchmark, or a decision record. Avoid vague tasks like "improve AI" or "make UI better."

Update tracking: task checkboxes live here; compact updates live in `.wolf/update-log.md`.

## Progress

Overall checkbox progress: [##--------] 15% - 43/295 visible tasks

Count note: progress is counted from the visible checkbox tasks in this file. Larger future-layer subtasks may expand the denominator later.

Notification rule: when overall checkbox progress reaches or crosses 40%, tell Joel explicitly in the same session before moving on.

| Phase | Checkbox progress |
|---|---|
| Phase 0 - Direction Lock | [#######---] 71% - 12/17 tasks |
| Phase 1 - Local Journal Core | [#####-----] 50% - 21/42 tasks |
| Phase 1.5 - Product Clarity And Local UI Review | [#########-] 91% - 10/11 tasks |
| Phase 2 - One Reflection Question | [----------] 0% - 0/11 tasks |
| Phase 3A - Semantic Retrieval Core | [----------] 0% - 0/34 tasks |
| Phase 3B - Entity And Graph RAG Foundations | [----------] 0% - 0/31 tasks |
| Phase 4 - Deferred External Data Integrations | [----------] 0% - 0/39 tasks |
| Phase 5 - Deferred Freeform People Notes | [----------] 0% - 0/19 tasks |
| Phase 6 - Deferred Source-Backed Insights | [----------] 0% - 0/34 tasks |
| Phase 7A - Deferred Google Systems Layer | [----------] 0% - 0/26 tasks |
| Phase 7B - Deferred Hosted Consumer Profile | [----------] 0% - 0/10 tasks |
| Final Google-Readiness Checklist | [----------] 0% - 0/21 tasks |

## 2026-06-06 Strategy Update

Core strategic shift:

```text
Old strategy: finish every feature before applying.
New strategy: build the highest interview-signal parts first while continuing development during the hiring pipeline.
```

Reason:

- Google project discussions reward architecture, tradeoffs, ownership, technical decisions, system thinking, and failure-mode reasoning more than raw feature completeness.
- The project should be useful and demonstrable early, but every resume claim must survive deep technical discussion.

Minimum usable product first:

```text
write -> save -> autosave -> open/edit -> delete -> export markdown -> one reflection question
```

Everything outside that loop is secondary until Stage 1 is reliable.

### Current Build Order

Stage 1:

- Journal CRUD
- Autosave
- Export
- One current-entry reflection question

Stage 2:

- Chunking
- Embeddings
- Retrieval
- Citations
- Retrieval evaluation

Stage 3:

- Entity extraction
- Graph structure
- Graph retrieval
- Graph RAG architecture explanation

Stage 4:

- Imports
- Broader search surfaces
- Advanced memory

### Highest Google-Signal Topics

Priority order:

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

### Defer Until Later

Do not start these until Stage 1 is reliable and the Stage 2 retrieval path has a clear contract:

- dashboards
- imports
- people analytics
- relationship analytics
- hosted auth
- billing
- multi-user systems
- Redis infrastructure
- production Graph RAG
- broad life analysis
- complex memory systems

Reason:

- These add complexity before the project has the interview-signal foundation.
- They are weaker immediate proof than local-first UX, chunking, retrieval, source grounding, Graph RAG design, and reliability.

### Resume Claim Rule

Do not claim "built complete Graph RAG semantic memory platform" until the graph retrieval layer actually works.

Safe current claim direction:

- built MVP
- built architecture
- designed retrieval system
- designed Graph RAG layer
- implemented local-first journal
- implemented reflection system
- implemented semantic memory foundations

Rule:

- Everything on the resume must survive a deep technical discussion.

## Ownership Model

### Joel - Learning And Architecture

Joel owns:

- product direction and Google interview signal
- architecture decisions and tradeoff explanations
- data model approval
- chunking strategy decisions
- semantic chunking decisions
- embedding and retrieval approach decisions
- hybrid retrieval design
- source grounding and citation contracts
- entity extraction boundaries
- knowledge graph and Graph RAG architecture
- reflection prompt contracts
- AI safety boundaries
- rate limiting, caching, background job, local-first, and privacy-first system design
- AI evaluation methods
- final review of generated-insight behavior

Joel must be able to explain:

- why Graph RAG is useful here
- why the chunking strategy was chosen
- why the retrieval approach was chosen
- failure modes
- tradeoffs
- scaling path
- privacy boundaries
- what is implemented vs only designed

### Prithvi - Frontend And Delivery

Prithvi owns:

- scoped implementation tickets after behavior is specified
- frontend engineering depth
- Storybook and component architecture
- design system and reusable UI primitives
- editor UX
- autosave UI and save indicators
- entry list, open/edit flow, delete flow, and export flow
- reflection-question UI after Joel defines the prompt contract
- frontend tests
- Playwright/Cypress verification
- accessibility
- error states and empty states
- offline behavior
- bug fixing and checklist reconciliation
- acceptance criteria implementation

Prithvi must be able to demonstrate:

- polished frontend
- Storybook coverage
- reliable journal CRUD
- visible autosave behavior
- export flow
- tests
- accessibility and reliability handling
- production-quality UX

### Shared Rules

If a feature changes the app direction, data model, privacy model, or Google signal, it must update the relevant docs under `dev-docs/` before implementation.

If product clarity changes during a terminal session or user feedback loop, update the relevant docs in the same session. Use `design/idea.md` for product intent, `team/Design-Choices.md` for decisions, `planning/Features.md` for feature scope, `architecture/Architecture.md` for system shape, `planning/Plan.md` for phases, this file for task checkboxes, `planning/Future-Plan.md` for deferred-but-visible ideas, and `.wolf/update-log.md` for compact tracking.

Development simplicity rule: during Phase 1 and early Phase 2, choose the smaller path when it still protects the journal data and product thesis. Do not introduce imports, dashboards, AI people, relationship analytics, hosted infrastructure, or distributed systems until the manual journal loop is boringly reliable.

Relevant docs:

- `planning/Features.md`
- `architecture/Architecture.md`
- `planning/Plan.md`
- `.wolf/update-log.md`
- `architecture/Stack-and-Tools.md`
- `research/Google-Signal-Benchmarks.md`
- `guardrails/Direction-Guardrails.md`
- `guardrails/External-Data-Integrations.md`

## Estimation Model

Assumptions:

- Joel: 6 focused hours/day.
- Prithvi: 3 focused hours/day.
- Estimates are implementation-planning estimates, not calendar guarantees.
- Review, debugging, dependency issues, and direction changes can add 20-40%.
- A phase is complete only when its exit criteria are satisfied.

## Phase Estimate Summary

| Phase | Joel hours | Joel days | Prithvi hours | Prithvi days | Calendar estimate with parallel work |
|---|---:|---:|---:|---:|---|
| Phase 0 - Direction Lock | 12 | 2.0 | 6 | 2.0 | 2 days |
| Stage 1 - Local Journal MVP and Reflection | 24 | 4.0 | 64 | 21.3 | 3-4 weeks |
| Stage 2 - Semantic Retrieval Core | 32 | 5.3 | 76 | 25.3 | 4-5 weeks |
| Stage 3 - Entity and Graph RAG Foundations | 36 | 6.0 | 44 | 14.7 | 3-4 weeks |
| Stage 4 - External Data Integrations | 24 | 4.0 | 84 | 28.0 | deferred |
| Later - Freeform People Notes | 10 | 1.7 | 26 | 8.7 | deferred |
| Later - Source-Backed Insights | 42 | 7.0 | 78 | 26.0 | deferred |
| Later - Systems Learning / Rate Limiter | 72 | 12.0 | 36 | 12.0 | design now, build later |
| Later - Hosted Consumer Profile | 36 | 6.0 | 72 | 24.0 | deferred |
| Total including deferred layers | 288 | 48.0 | 486 | 162.0 | not a hiring blocker |

Important:

- The Google-ready project does not require every later feature to be complete.
- The near-term Google portfolio target is Stage 1 through Stage 3 with clear tradeoffs, tests, and explanation.
- Systems topics like rate limiting, caching, and background jobs should be learned and designed early, but implementation waits until they protect a real hosted path.
- A useful local open-source target is Stage 1 plus Stage 2 retrieval foundations.

## Layer Estimate Summary

| Phase | Layer | Joel hours | Prithvi hours | Notes |
|---|---|---:|---:|---|
| 0 | Direction confirmation | 8 | 3 | Joel validates product/Google thesis; Prithvi lists implementation questions |
| 0 | Local setup verification | 4 | 3 | Prithvi checks run path; Joel resolves direction blockers |
| 1 | Schema and API | 6 | 18 | Highest dependency layer for Phase 1 |
| 1 | Editor | 4 | 14 | Keep UI minimal |
| 1 | Daily entry | 3 | 8 | Small but important UX loop |
| 1 | Export | 5 | 14 | Open-source trust feature |
| 2 | Reflection question | 6 | 10 | Current-entry-only first AI moment; no broad analysis |
| 3A | Chunking | 8 | 18 | Joel defines rules; Prithvi implements/tests |
| 3A | Embeddings | 8 | 22 | Provider adapter and failure modes matter |
| 3A | Retrieval, hybrid search, citations | 16 | 36 | Includes evaluation queries, source snippets, and retrieval tradeoffs |
| 3B | Entity extraction contract | 10 | 12 | Joel defines boundaries before extraction is trusted |
| 3B | Graph structure | 12 | 14 | Graph model is explain-first, implementation second |
| 3B | Graph retrieval prototype | 14 | 18 | Prototype only after Stage 2 retrieval is stable |
| 4 | Import framework | 8 | 24 | Deferred until journal/retrieval foundations work |
| 4 | Markdown/text imports | 4 | 16 | Deferred external data support |
| 4 | External tools export/import agent | 6 | 24 | Deferred; many parser edge cases across user-owned exports |
| 4 | Voice journaling | 6 | 20 | Deferred audio/transcription/review flow |
| 5 | People CRUD | 5 | 20 | Deferred manual people records only |
| 5 | People page basics | 5 | 6 | Linking and summaries deferred |
| 6 | Metadata extraction | 8 | 18 | Deferred structured AI output |
| 6 | Weekly digest | 10 | 18 | Deferred until retrieval and citations are trustworthy |
| 6 | Assumptions/challenge mode | 14 | 24 | Deferred; AI behavior needs Joel ownership |
| 6 | Contradiction/change detection | 10 | 18 | Defer if search quality is weak |
| 7A | Rate limiting design | 8 | 4 | Joel owns design; implementation later |
| 7A | Caching and background job design | 12 | 4 | Interview signal first; build only when needed |
| 7A | Go rate limiter service | 38 | 12 | Deferred core systems component |
| 7A | Metrics/load testing | 14 | 16 | Benchmark output is the point |
| 7B | Hosted architecture decisions | 12 | 6 | Can defer |
| 7B | User ownership/auth/billing/export/delete | 24 | 66 | Hosted-only trust requirements |

## Phase 0 - Direction Lock — Estimate: Joel 12h / 2.0 days, Prithvi 6h / 2.0 days

Goal: make the project coherent before code changes.

### Joel Tasks

- [X] Read `Cracking-Google.md`, `01-Production-RAG-Backend.md`, and `02-Distributed-Rate-Limiter.md`.
- [X] Confirm the one-line product thesis in `planning/Features.md`.
- [X] Confirm the top 6 high-Google-impact features.
- [X] Decide the MVP prioritizes local-first interview-signal work over hosted demo completeness.
- [ ] Write a short ADR if this priority needs architecture-level detail beyond this plan.
- [ ] Approve the core domain entities: `entries`, `sources`, `chunks`, `people`, `interactions`, `insights`.
- [ ] Approve what AI is allowed to infer and what it must not infer.

### Prithvi Tasks

- [X] Read `planning/Features.md`, `architecture/Architecture.md`, and `planning/Plan.md`.
- [ ] List unclear implementation questions in a temporary issue/task note.
- [X] Verify the app runs locally.
- [X] Verify `.env.example` contains all required keys.
- [X] Verify Docker/Postgres setup path.
- [X] Create a local smoke-test checklist.

### Exit Criteria

- [X] All canonical docs exist.
- [X] High-impact feature ranking is visible in `planning/Features.md`.
- [X] Next phase tasks have clear owners.
- [ ] No implementation starts without a stable schema direction.

## Phase 1 - Local Journal Core — Estimate: Joel 18h / 3.0 days, Prithvi 54h / 18.0 days

Goal: make InnerScript useful as a plain local journal before AI.

Build constraint:

- Keep the development app simple: write, save, autosave, list, open, edit, delete, export.
- Anything beyond that should be deferred unless it removes a blocker for local writing.

### Layer 1: Schema and API — Estimate: Joel 6h / 1.0 day, Prithvi 18h / 6.0 days

#### Joel

- [X] Approve `entries` schema.
- [X] Approve `sources` schema.
- [X] Decide date semantics: `occurred_at` vs `created_at`.
- [ ] Decide whether existing `notes` table is migrated or replaced.
- [ ] Write migration notes if replacing current note model.

#### Prithvi

- [X] Implement `entries` table/model.
- [X] Implement `sources` table/model.
- [X] Add `GET /api/entries`.
- [X] Add `POST /api/entries`.
- [X] Add `GET /api/entries/[id]`.
- [X] Add `PUT /api/entries/[id]`.
- [X] Add `DELETE /api/entries/[id]`.
- [X] Add tests for entry CRUD.
- [X] Add tests for source creation.

### Layer 2: Editor — Estimate: Joel 4h / 0.7 days, Prithvi 14h / 4.7 days

#### Joel

- [X] Define minimal editor UX.
- [X] Define therapy/reflection tone for the first writing experience.
- [ ] Decide whether Markdown preview is MVP or deferred.
- [ ] Define autosave behavior and failure state.

#### Prithvi

- [X] Wire editor to `entries` API.
- [X] Implement autosave.
- [X] Add visible save state.
- [X] Add empty state.
- [X] Add retry behavior for failed save.
- [X] Add focused autosave unit tests for stale-save text-loss protection.
- [ ] Do not ship floating AI insight panel in Phase 1; defer to `planning/Future-Plan.md` (Phase 5).

### Layer 3: Daily Entry — Estimate: Joel 3h / 0.5 days, Prithvi 8h / 2.7 days

#### Joel

- [ ] Define daily entry naming format.
- [ ] Decide if daily entry is auto-created or suggested.

#### Prithvi

- [ ] Add `GET /api/entries/today`.
- [X] Open today's entry on journal load.
- [ ] Add test for "existing today entry is reused."
- [ ] Add test for "missing today entry is created or suggested" according to Joel's decision.

### Layer 4: Export — Estimate: Joel 5h / 0.8 days, Prithvi 14h / 4.7 days

#### Joel

- [ ] Approve export formats: Markdown first, JSON later.
- [ ] Define file naming convention.

#### Prithvi

- [ ] Add `GET /api/export/markdown`.
- [ ] Export all entries as Markdown bundle or single archive.
- [ ] Preserve dates and source metadata.
- [ ] Add export test with two entries.

### Exit Criteria

- [ ] A user can write and save locally without AI.
- [ ] A user can export their text.
- [ ] Tests cover CRUD and export.
- [ ] No AI key is required for core journaling.
- [ ] No dashboard, import flow, AI people UI, or relationship analytics is required for Phase 1 completion.

## Phase 1.5 - Product Clarity And Local UI Review — Estimate: Joel 4h / 0.7 days, Prithvi 4h / 1.3 days

Goal: use local review feedback to keep product direction aligned before deeper implementation.

### Joel

- [X] Review current Alexandria UI locally.
- [ ] Decide whether Alexandria stays, changes, or becomes a temporary style.
- [X] Confirm first-screen language should feel therapy/reflection-first.
- [X] Identify the first three local UX problems after using the app.

### Prithvi / Agent

- [X] Run the local server.
- [X] Capture Joel's UI feedback.
- [X] Update `.wolf/user-review.md`, `team/Product-Decisions.md`, `planning/Plan.md`, and this file when feedback changes product direction.
- [X] Add a `.wolf/update-log.md` entry after the local review pass.

### Exit Criteria

- [X] Local UI feedback is captured.
- [X] Relevant docs reflect the current product clarity.
- [X] Next implementation task is selected from updated docs.

## Phase 2 - One Reflection Question — Estimate: Joel 6h / 1.0 day, Prithvi 10h / 3.3 days

Goal: add the first AI moment after writing without turning the app into broad analysis.

Build constraint:

- Use only the current entry.
- Ask one grounded reflection question.
- Do not summarize the user's life, diagnose, or infer long-term patterns from one entry.
- Hide or disable the flow when AI is unavailable.

### Joel

- [ ] Write the first reflection-question tone.
- [ ] Approve safe language around reflection and therapy.
- [ ] Define the current-entry-only prompt contract.
- [ ] Define AI unavailable behavior.

### Prithvi / Agent

- [ ] Add the smallest API path for a current-entry reflection question.
- [ ] Add a subtle UI trigger after writing.
- [ ] Add tests for current-entry-only prompt input.
- [ ] Add tests for AI unavailable state.

### Exit Criteria

- [ ] A user can write an entry and receive one grounded reflection question.
- [ ] The AI does not claim broader analysis from one entry.
- [ ] The core journal still works without an AI key.

## Phase 3A - Semantic Retrieval Core — Estimate: Joel 32h / 5.3 days, Prithvi 76h / 25.3 days

Goal: turn entries into source-backed semantic memory through chunking, embeddings, retrieval, citations, and measured search quality.

Build constraint:

- Joel must define and be able to explain the retrieval decisions before broad AI features build on them.
- Prithvi implements the smallest reliable retrieval path after the chunking, embedding, and citation contracts are clear.
- Do not claim production Graph RAG from this phase alone.

### Layer 1: Chunking — Estimate: Joel 8h / 1.3 days, Prithvi 18h / 6.0 days

#### Joel

- [ ] Decide initial chunking rule: paragraph-first with max token fallback.
- [ ] Define chunk metadata fields.
- [ ] Define minimum chunk size.
- [ ] Define how source references are displayed.

#### Prithvi

- [ ] Implement chunking utility.
- [ ] Add `chunks` table/model.
- [ ] Create chunks after entry save.
- [ ] Rebuild chunks when entry body changes.
- [ ] Add tests for paragraph chunking.
- [ ] Add tests for max token fallback.

### Layer 2: Embeddings — Estimate: Joel 8h / 1.3 days, Prithvi 22h / 7.3 days

#### Joel

- [ ] Approve embedding provider adapter interface.
- [ ] Decide local AI-off behavior for embeddings.
- [ ] Define error behavior if embeddings fail.

#### Prithvi

- [ ] Implement embedding adapter.
- [ ] Store embeddings on chunks.
- [ ] Add retry-safe embedding job function.
- [ ] Add mocked embedding tests.
- [ ] Add "embedding unavailable" state.

### Layer 3: Search — Estimate: Joel 14h / 2.3 days, Prithvi 32h / 10.7 days

#### Joel

- [ ] Write 20 semantic search evaluation queries.
- [ ] Label expected relevant sample entries.
- [ ] Decide first retrieval path: vector-only, lexical baseline, or hybrid lexical+dense.
- [ ] Define citation format for retrieved chunks.
- [ ] Define Precision@5 target for MVP.

#### Prithvi

- [ ] Add `POST /api/search`.
- [ ] Add scope filters: all, date range, source, person later.
- [ ] Add lexical baseline or hybrid retrieval after Joel chooses the first path.
- [ ] Return source snippets with similarity scores.
- [ ] Build search UI.
- [ ] Add API tests for search.

### Exit Criteria

- [ ] Entries are chunked.
- [ ] Chunks are embedded.
- [ ] Semantic search returns source-backed snippets.
- [ ] Manual evaluation exists.
- [ ] Search quality is measured, not guessed.

## Phase 3B - Entity And Graph RAG Foundations — Estimate: Joel 36h / 6.0 days, Prithvi 44h / 14.7 days

Goal: design and prototype the graph layer only after Stage 2 retrieval is explainable and measured.

Build constraint:

- Graph work is an interview-signal architecture layer, not a license to build broad life analysis early.
- Joel owns the Graph RAG reasoning and failure-mode explanation.
- Prithvi owns the scoped implementation only after entity and graph contracts are clear.
- Keep production Graph RAG claims off the resume until graph retrieval actually works.

### Layer 1: Entity Extraction Contract — Estimate: Joel 10h / 1.7 days, Prithvi 12h / 4.0 days

#### Joel

- [ ] Define initial entity types: people, projects, places, topics, beliefs, goals.
- [ ] Define what entity extraction may infer and what it must not infer.
- [ ] Write entity extraction prompt contract with safety boundaries.
- [ ] Define confidence and source-link requirements for extracted entities.
- [ ] Define evaluation examples for correct and incorrect entity extraction.

#### Prithvi

- [ ] Add feature-flagged entity extraction endpoint after Joel approves contract.
- [ ] Add schema validation for extracted entities.
- [ ] Store source references for extracted entities.
- [ ] Add mocked extraction tests.

### Layer 2: Graph Structure — Estimate: Joel 12h / 2.0 days, Prithvi 14h / 4.7 days

#### Joel

- [ ] Choose first graph model: SQL adjacency tables, property graph later, or hybrid.
- [ ] Define node and edge types for the first graph pass.
- [ ] Define edge provenance requirements.
- [ ] Define how graph data differs from user-authored people notes.
- [ ] Define deletion/rebuild behavior when source entries change.

#### Prithvi

- [ ] Add graph tables or graph-ready schema after model approval.
- [ ] Add source-backed node creation path.
- [ ] Add source-backed edge creation path.
- [ ] Add rebuild/delete tests for graph references.

### Layer 3: Graph Retrieval — Estimate: Joel 14h / 2.3 days, Prithvi 18h / 6.0 days

#### Joel

- [ ] Define first Graph RAG use case.
- [ ] Define when graph retrieval should improve over chunk-only retrieval.
- [ ] Define graph retrieval failure modes.
- [ ] Define scaling path from local SQL graph to richer graph tooling if needed.

#### Prithvi

- [ ] Add graph-neighborhood retrieval utility.
- [ ] Combine graph-neighborhood context with chunk retrieval in a prototype endpoint.
- [ ] Return citations for graph-derived context.
- [ ] Add tests for source-backed graph retrieval.

### Exit Criteria

- [ ] Entity extraction has a prompt contract, schema, and safety boundary.
- [ ] Graph nodes and edges are source-backed.
- [ ] Graph retrieval prototype cites source entries or chunks.
- [ ] Joel can explain Graph RAG design, tradeoffs, scaling path, and failure modes.
- [ ] Resume language still distinguishes designed, prototyped, and fully implemented graph work.

## Phase 4 - Deferred External Data Integrations — Estimate: Joel 24h / 4.0 days, Prithvi 84h / 28.0 days

Goal: ingest journal-related text from other apps without brittle private APIs.

See `guardrails/External-Data-Integrations.md`.

Status: deferred until Stage 1 is reliable and Stage 2 retrieval has a clear contract.

### Layer 1: Import Framework — Estimate: Joel 8h / 1.3 days, Prithvi 24h / 8.0 days

#### Joel

- [ ] Define source provenance requirements.
- [ ] Define import preview UX.
- [ ] Define duplicate handling.

#### Prithvi

- [ ] Add `POST /api/import/preview`.
- [ ] Add `POST /api/import/confirm`.
- [ ] Add idempotency key support.
- [ ] Store one `sources` record per import.
- [ ] Add parser interface.
- [ ] Add tests for duplicate import protection.

### Layer 2: Markdown and Text Imports — Estimate: Joel 4h / 0.7 days, Prithvi 16h / 5.3 days

#### Joel

- [ ] Define Markdown metadata behavior.
- [ ] Decide whether headings become entries or chunks.

#### Prithvi

- [ ] Implement Markdown parser.
- [ ] Implement plain text parser.
- [ ] Show preview before confirm.
- [ ] Add parser tests.

### Layer 3: External Tools Export/Import Agent — Estimate: Joel 6h / 1.0 day, Prithvi 24h / 8.0 days

#### Joel

- [ ] Define first supported external-tool export formats.
- [ ] Define privacy warning copy for external-tool imports.
- [ ] Define participant/contact mapping to people.
- [ ] Decide whether WhatsApp is first example or only one parser under the broader agent.

#### Prithvi

- [ ] Implement external-tool parser interface.
- [ ] Implement first exported-chat `.txt` parser.
- [ ] Group messages by date and participant/contact.
- [ ] Preserve timestamps.
- [ ] Map participant/contact names to people only after user confirmation.
- [ ] Add tests for common exported-chat lines.
- [ ] Add tests for malformed lines.

### Layer 4: Voice Journaling — Estimate: Joel 6h / 1.0 day, Prithvi 20h / 6.7 days

#### Joel

- [ ] Define audio retention policy.
- [ ] Define transcript review UX.
- [ ] Define transcription failure behavior.

#### Prithvi

- [ ] Build browser record button.
- [ ] Add upload endpoint.
- [ ] Add transcription adapter.
- [ ] Show editable transcript.
- [ ] Save transcript as entry.
- [ ] Add tests with mocked transcription.

### Exit Criteria

- [ ] Text imports preserve provenance.
- [ ] External-tool export import works from file upload.
- [ ] Voice transcript creates editable entries.
- [ ] Imported content enters chunking/search pipeline.

## Phase 5 - Deferred Freeform People Notes — Estimate: Joel 10h / 1.7 days, Prithvi 26h / 8.7 days

Goal: add user-controlled freeform people notes without forcing person interactions into the entry model.

Status: deferred until the journal loop and retrieval foundation are reliable. Entity extraction and graph work may happen first as a source-backed technical foundation, but user-facing people analytics remain later.

### Layer 1: People CRUD — Estimate: Joel 5h / 0.8 days, Prithvi 20h / 6.7 days

#### Joel

- [ ] Define person page language rules.
- [ ] Define relationship type list.
- [ ] Define alias merge behavior.

#### Prithvi

- [ ] Add `people` table/model.
- [ ] Add `GET /api/people`.
- [ ] Add `POST /api/people`.
- [ ] Add `GET /api/people/[id]`.
- [ ] Add `PUT /api/people/[id]`.
- [ ] Add `DELETE /api/people/[id]`.
- [ ] Build `/people`.
- [ ] Build `/people/[id]`.
- [ ] Add people API tests.

### Layer 2: People Page Basics — Estimate: Joel 5h / 0.8 days, Prithvi 6h / 2.0 days

#### Joel

- [ ] Define which profile fields are visible on the person page.
- [ ] Define empty-state language.

#### Prithvi

- [ ] Render person profile fields.
- [ ] Add people page empty states.

Sentence-level people mentions and interaction linking are deferred to `dev-docs/planning/Future-Plan.md`.

### Layer 3: Deferred People Insights

Generated people insights are deferred to `dev-docs/planning/Future-Plan.md`.

### Exit Criteria

- [ ] People can be created, edited, listed, viewed, and deleted.
- [ ] Person page shows only user-controlled profile data.
- [ ] Entry schema does not include `person_interaction`.

## Phase 6 - Deferred Source-Backed Insights — Estimate: Joel 42h / 7.0 days, Prithvi 78h / 26.0 days

Goal: create source-backed insight beyond basic search.

Status: deferred until retrieval, citations, and AI safety boundaries are proven. Do not build broad life analysis, dashboards, or complex memory systems before that.

### Layer 1: Metadata Extraction — Estimate: Joel 8h / 1.3 days, Prithvi 18h / 6.0 days

#### Joel

- [ ] Define metadata schema.
- [ ] Write extraction prompt.
- [ ] Define AI-off behavior.

#### Prithvi

- [ ] Add `entry_metadata` table/model.
- [ ] Add analysis endpoint.
- [ ] Store mood, arousal, emotion, topics, summary.
- [ ] Add schema validation tests.

### Layer 2: Weekly Digest — Estimate: Joel 10h / 1.7 days, Prithvi 18h / 6.0 days

#### Joel

- [ ] Write weekly digest prompt.
- [ ] Define digest sections.
- [ ] Define source citation format.

#### Prithvi

- [ ] Add `digests` table/model.
- [ ] Add digest generation endpoint.
- [ ] Add digest page/section.
- [ ] Add tests with mocked AI.

### Layer 3: Assumptions and Challenge Mode — Estimate: Joel 14h / 2.3 days, Prithvi 24h / 8.0 days

#### Joel

- [ ] Write assumption extraction prompt.
- [ ] Define assumption types.
- [ ] Define challenge tone.
- [ ] Define escalation/safety rules.

#### Prithvi

- [ ] Add `assumptions` table/model.
- [ ] Add assumption extraction endpoint.
- [ ] Show assumptions in insights/person/journal contexts.
- [ ] Add "Challenge this" action.
- [ ] Add tests for assumption storage.

### Layer 4: Contradiction and Change Detection — Estimate: Joel 10h / 1.7 days, Prithvi 18h / 6.0 days

#### Joel

- [ ] Define what counts as contradiction vs growth.
- [ ] Write detection prompt.
- [ ] Define source-link requirements.

#### Prithvi

- [ ] Implement retrieval for candidate old/new entries.
- [ ] Add detection endpoint.
- [ ] Add UI section behind a feature flag.
- [ ] Add tests for source-backed output.

### Exit Criteria

- [ ] Insights are source-backed.
- [ ] Weekly digest works over a date range.
- [ ] Assumptions can be challenged.
- [ ] No therapeutic claims are made.

## Phase 7A - Deferred Google Systems Layer: Rate Limiting, Caching, Jobs — Estimate: Joel 72h / 12.0 days, Prithvi 36h / 12.0 days

Goal: understand and design the systems layer now, but implement it only when hosted AI endpoints need protection.

Status: deferred for implementation. Joel should still learn and explain rate limiting, caching, background jobs, concurrency, failure modes, and scaling path because they are high-signal interview topics.

### Layer 1: API Contract And Systems Design — Estimate: Joel 8h / 1.3 days, Prithvi 4h / 1.3 days

#### Joel

- [ ] Define service API: HTTP or gRPC.
- [ ] Define request shape: `user_id`, `feature`, `cost_weight`, `plan`.
- [ ] Define response shape: `allowed`, `remaining`, `retry_after`.
- [ ] Define fail-open/fail-closed policy.
- [ ] Define caching and background-job responsibilities for future hosted AI features.

#### Prithvi

- [ ] Implement Next.js client wrapper for limiter calls after Joel finalizes contract.
- [ ] Add mocked limiter tests in app.

### Layer 2: Go Service — Estimate: Joel 38h / 6.3 days, Prithvi 12h / 4.0 days

#### Joel

- [ ] Create Go service.
- [ ] Implement token bucket.
- [ ] Implement sliding window counter.
- [ ] Implement Redis Lua script.
- [ ] Add concurrency tests.
- [ ] Add benchmark tests.

#### Prithvi

- [ ] Add config file loader or API wiring.
- [ ] Add Docker Compose support if needed.
- [ ] Add integration test harness.

### Layer 3: Metrics and Load Testing — Estimate: Joel 26h / 4.3 days, Prithvi 20h / 6.7 days

#### Joel

- [ ] Add Prometheus metrics.
- [ ] Define SLO-style targets.
- [ ] Run load test.
- [ ] Write benchmark interpretation.

#### Prithvi

- [ ] Help script load tests.
- [ ] Document how to reproduce results.

### Exit Criteria

- [ ] Rate limiter survives concurrent requests correctly.
- [ ] p99 latency is measured.
- [ ] failure modes are documented.
- [ ] protected endpoints call limiter in hosted profile.

## Phase 7B - Deferred Hosted Consumer Profile — Estimate: Joel 36h / 6.0 days, Prithvi 72h / 24.0 days

Goal: make hosted InnerScript possible without weakening local-first trust.

Status: deferred. Do not start hosted auth, billing, multi-user systems, or Redis infrastructure until the local-first product and retrieval story are defensible.

### Joel

- [ ] Decide auth provider.
- [ ] Decide billing model.
- [ ] Decide user data deletion/export policy.
- [ ] Decide whether imported data is stored raw, summarized, or both.

### Prithvi

- [ ] Add user ownership columns after schema decision.
- [ ] Add account-level export.
- [ ] Add hosted-only feature gates.
- [ ] Add basic billing hooks if required.

### Exit Criteria

- [ ] Local open-source and hosted profiles are clearly separated.
- [ ] hosted mode has auth, quotas, and deletion/export path.

## Final Google-Readiness Checklist

- [ ] Joel can explain the local-first architecture.
- [ ] Joel can explain the retrieval flow end to end.
- [ ] Can explain why chunking improves retrieval.
- [ ] Can explain the chosen chunking strategy and alternatives.
- [ ] Can explain embeddings and retrieval tradeoffs.
- [ ] Can explain vector-only vs hybrid search tradeoffs.
- [ ] Can show search Precision@5.
- [ ] Can show citations or source snippets for retrieved results.
- [ ] Joel can explain Graph RAG design, graph structure, and failure modes.
- [ ] Can explain entity extraction boundaries and source grounding.
- [ ] Can explain prompt contracts and AI safety boundaries.
- [ ] Can explain rate limiting, caching, and background-job designs even if implementation is deferred.
- [ ] Can explain scaling path from local-first MVP to hosted profile.
- [ ] Can explain local vs hosted tradeoffs.
- [ ] Prithvi can demonstrate polished journal CRUD.
- [ ] Prithvi can demonstrate autosave UI, save indicators, delete flow, and export flow.
- [ ] Prithvi can show Storybook/component coverage for core UI.
- [ ] Prithvi can show frontend tests or browser verification for core flows.
- [ ] Prithvi can explain reliability, accessibility, empty state, error state, and offline behavior.
- [ ] Can show one-page architecture diagram.
- [ ] Can produce 2-minute STAR story about ambiguity and ownership.
