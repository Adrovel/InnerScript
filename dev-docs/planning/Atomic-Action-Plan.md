# InnerScript Atomic Action Plan

Purpose: split InnerScript from zero to Google-signal completion into atomic tasks for Joel and Prithvi.

Rule: every task must either produce a working artifact, a test, a benchmark, or a decision record. Avoid vague tasks like "improve AI" or "make UI better."

Update tracking: task checkboxes live here; compact updates live in `.wolf/update-log.md`.

## Progress

Overall checkbox progress: [##--------] 17% - 56/331 visible tasks

Count note: progress is counted from the visible checkbox tasks in this file. Larger future-layer subtasks may expand the denominator later.

Notification rule: when overall checkbox progress reaches or crosses 40%, tell Joel explicitly in the same session before moving on.

| Phase | Checkbox progress |
|---|---|
| Phase 0 - Direction Lock | [####------] 35% - 6/17 visible tasks |
| Phase 0.5 - Product Knowledge And Project Conventions | [####------] 36% - 10/28 tasks |
| Phase 0.6 - Landing Page Handover | [#####-----] 45% - 10/22 tasks |
| Phase 1 - Local Journal Core | [#####-----] 48% - 20/42 tasks |
| Phase 1.5 - Product Clarity And Local UI Review | [#########-] 91% - 10/11 tasks |
| Phase 2 - One Reflection Question | [----------] 0% - 0/11 tasks |
| Phase 3 - Semantic Core | [----------] 0% - 0/39 tasks |
| Phase 3.5 - Graph RAG Design Layer | [----------] 0% - 0/23 tasks |
| Phase 4 - External Data Integrations | [----------] 0% - 0/39 tasks |
| Phase 5 - Freeform People Notes | [----------] 0% - 0/19 tasks |
| Phase 6 - Source-Backed Insights | [----------] 0% - 0/34 tasks |
| Phase 7A - Google Systems Layer | [----------] 0% - 0/25 tasks |
| Phase 7B - Hosted Consumer Profile | [----------] 0% - 0/21 tasks |

## Ownership Model

### Joel

Joel owns:

- product direction
- Google interview signal
- architecture decisions
- data model approval
- AI prompt contracts
- semantic search evaluation
- Go distributed rate limiter design
- final review of privacy and generated-insight behavior
- chunking strategy and semantic chunking decisions
- embeddings, retrieval, hybrid retrieval, and source-grounding decisions
- citation system design
- knowledge graph and Graph RAG architecture
- entity extraction boundaries
- AI safety boundaries
- caching, background jobs, local-first architecture, privacy-first design, and AI evaluation methods
- interview explanation for tradeoffs, failure modes, and scaling path

### Prithvi

Prithvi owns:

- scoped implementation tickets
- CRUD/API wiring
- import/export parsers
- tests
- local setup docs
- UI screens after behavior is specified
- integration support for the Go rate limiter
- Storybook
- component architecture
- design system and reusable UI primitives
- editor UX, autosave UI, save indicators, entry list, open/edit, delete, and export flows
- frontend testing with Playwright/Cypress or equivalent
- accessibility, error states, empty states, and offline behavior
- bug fixing, verification, checklist reconciliation, and acceptance criteria implementation

### Shared Rule

If a feature changes the app direction, data model, privacy model, or Google signal, it must update the relevant docs under `dev-docs/` before implementation.

No app behavior change should be implemented while `dev-docs/design/idea.md`, `dev-docs/planning/Plan.md`, or this file are stale for that change. If the change affects priority, update `dev-docs/product-knowledge/Priority-Change-Log.md`. If the change affects file structure, conventions, `.wolf`, buglog, memory, session context, or session logs, update `dev-docs/product-knowledge/Structure-and-Conventions-Plan.md`.

If product clarity changes during a terminal session or user feedback loop, update the relevant docs in the same session. Use `design/idea.md` for product intent, `team/Design-Choices.md` for decisions, `planning/Features.md` for feature scope, `architecture/Architecture.md` for system shape, `planning/Plan.md` for phases, this file for task checkboxes, `planning/Future-Plan.md` for deferred-but-visible ideas, and `.wolf/update-log.md` for compact tracking.

Development simplicity rule: during Phase 1 and early Phase 2, choose the smaller path when it still protects the journal data and product thesis. Do not introduce imports, dashboards, AI people, relationship analytics, hosted infrastructure, or distributed systems until the manual journal loop is boringly reliable.

Hiring-pipeline strategy: do not wait to finish every future feature before applying. Build the minimum usable journal first, then prioritize the highest interview-signal technical layers Joel can explain deeply: local-first architecture, chunking, embeddings, retrieval, hybrid search, Graph RAG design, knowledge graphs, entity extraction, prompt contracts, rate limiting, caching, background jobs, privacy-first AI systems, source grounding, and reliability.

Resume rule: do not claim a complete Graph RAG semantic memory platform until it exists. Every resume claim must survive a deep technical discussion.

Relevant docs:

- `planning/Features.md`
- `architecture/Architecture.md`
- `planning/Plan.md`
- `.wolf/update-log.md`
- `architecture/Stack-and-Tools.md`
- `research/Google-Signal-Benchmarks.md`
- `guardrails/Direction-Guardrails.md`
- `guardrails/External-Data-Integrations.md`
- `design/idea.md`
- `product-knowledge/README.md`
- `product-knowledge/Priority-Change-Log.md`
- `product-knowledge/Structure-and-Conventions-Plan.md`

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
| Phase 0.5 - Product Knowledge And Project Conventions | 6 | 1.0 | 4 | 1.3 | 1-2 days |
| Phase 0.6 - Landing Page Handover | 4 | 0.7 | 0 | 0 | 1 day |
| Phase 1 - Local Journal Core | 18 | 3.0 | 54 | 18.0 | 3-4 weeks |
| Phase 1.5 - Product Clarity And Local UI Review | 4 | 0.7 | 4 | 1.3 | 1-2 days |
| Phase 2 - One Reflection Question | 6 | 1.0 | 10 | 3.3 | 1 week |
| Phase 3 - Semantic Core | 30 | 5.0 | 72 | 24.0 | 4-5 weeks |
| Phase 3.5 - Graph RAG Design Layer | 24 | 4.0 | 18 | 6.0 | 1-2 weeks |
| Phase 4 - External Data Integrations | 24 | 4.0 | 84 | 28.0 | 5-6 weeks |
| Phase 5 - Freeform People Notes | 10 | 1.7 | 26 | 8.7 | 1-2 weeks |
| Phase 6 - Source-Backed Insights | 42 | 7.0 | 78 | 26.0 | 5-6 weeks |
| Phase 7A - Go Distributed Rate Limiter | 72 | 12.0 | 36 | 12.0 | 3-4 weeks |
| Phase 7B - Hosted Consumer Profile | 36 | 6.0 | 72 | 24.0 | 5-6 weeks |
| Total | 288 | 48.1 | 464 | 154.7 | ~28-37 weeks |

Important:

- The Google-ready project does not require Phase 7.
- A strong Google portfolio target is Phases 0-6 with benchmarks.
- A useful local open-source target is Phases 0-5 without hosted mode.

## Layer Estimate Summary

| Phase | Layer | Joel hours | Prithvi hours | Notes |
|---|---|---:|---:|---|
| 0 | Direction confirmation | 8 | 3 | Joel validates product/Google thesis; Prithvi lists implementation questions |
| 0 | Local setup verification | 4 | 3 | Prithvi checks run path; Joel resolves direction blockers |
| 0.5 | Product knowledge and conventions | 6 | 4 | decide product knowledge, priority-change log, `.wolf`, source folders, and test conventions |
| 0.6 | Landing page handover | 4 | 0 | designer handover for `innerscript.in`; no implementation yet |
| 1 | Schema and API | 6 | 18 | Highest dependency layer for Phase 1 |
| 1 | Editor | 4 | 14 | Keep UI minimal |
| 1 | Daily entry | 3 | 8 | Small but important UX loop |
| 1 | Export | 5 | 14 | Open-source trust feature |
| 1.5 | Local UI review | 4 | 4 | capture user review, remove friction, and update product context |
| 2 | Reflection question | 6 | 10 | Current-entry-only first AI moment; no broad analysis |
| 3 | Chunking | 8 | 18 | Joel defines rules; Prithvi implements/tests |
| 3 | Embeddings | 8 | 22 | Provider adapter and failure modes matter |
| 3 | Search | 14 | 32 | Includes evaluation queries and UI |
| 3.5 | Entity extraction | 8 | 6 | define safe entity boundaries before graph work |
| 3.5 | Knowledge graph design | 8 | 4 | schema, source links, and graph update rules |
| 3.5 | Graph RAG retrieval design | 8 | 8 | compare vector, hybrid, and graph retrieval before implementation claims |
| 4 | Import framework | 8 | 24 | Parser interface, preview, idempotency |
| 4 | Markdown/text imports | 4 | 16 | Early external data support |
| 4 | External tools export/import agent | 6 | 24 | High Google impact; many parser edge cases across user-owned exports |
| 4 | Voice journaling | 6 | 20 | Audio/transcription/review flow |
| 5 | People CRUD | 5 | 20 | Manual people records only |
| 5 | People page basics | 5 | 6 | Linking and summaries deferred |
| 6 | Metadata extraction | 8 | 18 | Structured AI output |
| 6 | Weekly digest | 10 | 18 | High product and Google signal |
| 6 | Assumptions/challenge mode | 14 | 24 | AI behavior needs Joel ownership |
| 6 | Contradiction/change detection | 10 | 18 | Defer if search quality is weak |
| 7 | Go rate limiter API contract | 8 | 4 | Joel owns design |
| 7 | Go rate limiter service | 38 | 12 | Core systems component |
| 7 | Metrics/load testing | 26 | 20 | Benchmark output is the point |
| 7 | Hosted architecture decisions | 12 | 6 | Can defer |
| 7 | User ownership/auth/billing/export/delete | 24 | 66 | Hosted-only trust requirements |

## Phase 0 - Direction Lock — Estimate: Joel 12h / 2.0 days, Prithvi 6h / 2.0 days

Goal: make the project coherent before code changes.

### Joel Tasks

- [X] Read `Cracking-Google.md`, `01-Production-RAG-Backend.md`, and `02-Distributed-Rate-Limiter.md`.
- [X] Confirm the one-line product thesis in `planning/Features.md`.
- [X] Confirm the top 6 high-Google-impact features.
- [ ] Decide whether the MVP prioritizes local-first open source or hosted demo first.
- [ ] Write a short ADR if that priority changes.
- [ ] Approve the core domain entities: `entries`, `sources`, `chunks`, `people`, `interactions`, `insights`.
- [ ] Approve what AI is allowed to infer and what it must not infer.

### Prithvi Tasks

- [ ] Read `planning/Features.md`, `architecture/Architecture.md`, and `planning/Plan.md`.
- [ ] List unclear implementation questions in a temporary issue/task note.
- [ ] Verify the app runs locally.
- [ ] Verify `.env.example` contains all required keys.
- [ ] Verify Docker/Postgres setup path.
- [ ] Create a local smoke-test checklist.

### Exit Criteria

- [X] All canonical docs exist.
- [X] High-impact feature ranking is visible in `planning/Features.md`.
- [X] Next phase tasks have clear owners.
- [ ] No implementation starts without a stable schema direction.

## Phase 0.5 - Product Knowledge And Project Conventions — Estimate: Joel 6h / 1.0 day, Prithvi 4h / 1.3 days

Goal: decide where product knowledge, priority changes, operational logs, session context, memory, `.wolf`, source folders, and tests belong before further implementation adds drift.

### Joel Tasks

- [X] Decide that product knowledge and priority changes need durable project-local docs.
- [X] Require `idea.md`, `Plan.md`, and `Atomic-Action-Plan.md` to be current before implementation.
- [ ] Discuss `.wolf`, buglog, session context, memory, session logs, and naming with Prithvi.
- [ ] Decide whether `.wolf/` stays, gets documented, gets mirrored, or later gets renamed.
- [ ] Approve the product knowledge folder responsibilities.
- [ ] Approve the priority-change log format.
- [ ] Approve app source-folder conventions after Prithvi review.
- [ ] Define a non-blocking collaborator catch-up prompt/session/output format so new collaborators can quickly understand what others changed, why, and what remains open.
- [ ] Clarify the line of work between Joel and Prithvi so both can make progress without blocking each other.

### Prithvi Tasks

- [ ] Review `dev-docs/product-knowledge/Structure-and-Conventions-Plan.md`.
- [ ] Give rationale for keeping, renaming, or documenting `.wolf`.
- [ ] Propose source folder conventions for journal, imports, search, AI, people, shared utilities, and tests.
- [ ] Identify which conventions affect current implementation and which can wait.
- [ ] Review the proposed Joel/Prithvi work-boundary split and identify any overlap or blockers.
- [ ] Review the collaborator catch-up format for whether it gives enough implementation context.

### Agent Tasks

- [X] Create `dev-docs/product-knowledge/README.md`.
- [X] Create `dev-docs/product-knowledge/Priority-Change-Log.md`.
- [X] Create `dev-docs/product-knowledge/Structure-and-Conventions-Plan.md`.
- [X] Update `dev-docs/design/idea.md` with product-knowledge context.
- [X] Update `dev-docs/planning/Plan.md` with Phase 0.5 and planning sync rule.
- [X] Update this atomic checklist with Phase 0.5 tasks and current completed work.
- [X] Update `Product-Decisions.md` and `Open-Questions.md`.
- [X] Update `Direction-Guardrails.md`, `dev-docs/README.md`, `.wolf/session-context.md`, `.wolf/update-log.md`, and workspace anatomy.

### Exit Criteria

- [ ] Prithvi has reviewed and answered structure/conventions questions.
- [ ] `.wolf` role is accepted or a migration path is written.
- [ ] Source-folder and test conventions are documented.
- [ ] Product knowledge update rules are accepted.
- [ ] Future implementation can proceed without guessing where context belongs.

## Phase 0.6 - Landing Page Handover — Estimate: Joel 4h / 0.7 days, Prithvi 0h

Goal: prepare a designer-facing markdown handover for the `innerscript.in` landing page before visual design or implementation starts.

### Joel Tasks

- [X] Define landing page audiences: collaborators/builders/investors, employers, and lay users.
- [X] Define that the landing page should be more verbal than visual.
- [X] Define that collaborators and technical people should feel the project is worth working on.
- [X] Define that the page should explain the problem and product intent clearly.
- [ ] Review and approve the handover doc.
- [ ] Decide final primary CTA.
- [ ] Decide whether the first landing page should ask for collaborators, signups, or project review.

### Designer Tasks

- [ ] Read `dev-docs/design/InnerScript.in-Landing-Page-Handover.md`.
- [ ] Propose first visual direction using the Alexandria palette.
- [ ] Draft landing page structure and copy hierarchy.
- [ ] Decide where technical/employer context appears without overwhelming lay users.
- [ ] Produce a first landing design for review.

### Agent Tasks

- [X] Create `dev-docs/design/InnerScript.in-Landing-Page-Handover.md`.
- [X] Include color palette, feel, audience, product, technical, and user context.
- [X] Update `dev-docs/design/idea.md`.
- [X] Update `dev-docs/planning/Plan.md`.
- [X] Update this atomic checklist.
- [X] Update `dev-docs/README.md`.

### Exit Criteria

- [ ] Joel approves the designer handover.
- [ ] Designer has enough context to build the landing page.
- [ ] Final copy direction is chosen.
- [ ] Landing design is ready to implement.

## Phase 1 - Local Journal Core — Estimate: Joel 18h / 3.0 days, Prithvi 54h / 18.0 days

Goal: make InnerScript useful as a plain local journal before AI.

Build constraint:

- Keep the development app simple: write, save, list, open, export.
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
- [ ] Open today's entry on journal load.
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

## Phase 3 - Semantic Core — Estimate: Joel 30h / 5.0 days, Prithvi 72h / 24.0 days

Goal: turn entries into searchable semantic memory.

Interview-signal goal: Joel must be able to explain chunking decisions, embedding tradeoffs, retrieval failure modes, source grounding, citation behavior, and why the chosen retrieval path fits personal writing.

### Layer 1: Chunking — Estimate: Joel 8h / 1.3 days, Prithvi 18h / 6.0 days

#### Joel

- [ ] Decide initial chunking rule: paragraph-first with max token fallback.
- [ ] Compare fixed-size, paragraph-first, heading-aware, and semantic chunking strategies.
- [ ] Write why the first chunking strategy was chosen.
- [ ] Define chunk metadata fields.
- [ ] Define minimum chunk size.
- [ ] Define how source references are displayed.
- [ ] Define chunking failure modes and expected mitigations.

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
- [ ] Compare embedding provider tradeoffs.
- [ ] Define what gets embedded and what should never be embedded.

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
- [ ] Define Precision@5 target for MVP.
- [ ] Compare vector search, lexical search, and hybrid search for journal text.
- [ ] Define citation/source-grounding requirements for retrieval answers.

#### Prithvi

- [ ] Add `POST /api/search`.
- [ ] Add scope filters: all, date range, source, person later.
- [ ] Return source snippets with similarity scores.
- [ ] Build search UI.
- [ ] Add API tests for search.

### Exit Criteria

- [ ] Entries are chunked.
- [ ] Chunks are embedded.
- [ ] Semantic search returns source-backed snippets.
- [ ] Manual evaluation exists.
- [ ] Search quality is measured, not guessed.
- [ ] Joel can explain retrieval tradeoffs and failure modes.

## Phase 3.5 - Graph RAG Design Layer — Estimate: Joel 24h / 4.0 days, Prithvi 18h / 6.0 days

Goal: design the Graph RAG and knowledge graph layer before claiming it is built.

Build constraint:

- Do not claim production Graph RAG until there is working graph storage, extraction, graph retrieval, and source-backed evaluation.
- Design and document the architecture first.

### Layer 1: Entity Extraction — Estimate: Joel 8h / 1.3 days, Prithvi 6h / 2.0 days

#### Joel

- [ ] Define first entity types: people, concepts, places, projects, beliefs, moods, recurring themes.
- [ ] Define safety boundaries for extracting sensitive entities from personal writing.
- [ ] Define source-link requirements for every extracted entity.
- [ ] Define false-positive handling and user correction behavior.

#### Prithvi

- [ ] Review entity model for UI/data practicality.
- [ ] Prototype a small entity review UI only after behavior is specified.

### Layer 2: Knowledge Graph Design — Estimate: Joel 8h / 1.3 days, Prithvi 4h / 1.3 days

#### Joel

- [ ] Define graph node and edge types.
- [ ] Define how graph records link back to entries/chunks.
- [ ] Define graph update rules when entries change.
- [ ] Define when graph data should be deleted or corrected.

#### Prithvi

- [ ] Review graph schema for implementation risk.
- [ ] Identify frontend states needed for graph-backed source review.

### Layer 3: Graph RAG Retrieval Design — Estimate: Joel 8h / 1.3 days, Prithvi 8h / 2.7 days

#### Joel

- [ ] Compare plain vector retrieval, hybrid retrieval, and Graph RAG for InnerScript.
- [ ] Write the first Graph RAG retrieval flow.
- [ ] Define failure modes: stale graph, wrong entity extraction, overconnected nodes, privacy-sensitive inferences.
- [ ] Define evaluation questions for graph retrieval.

#### Prithvi

- [ ] Review how graph retrieval results should be displayed with citations.
- [ ] Add frontend acceptance criteria for graph-backed answers.

### Exit Criteria

- [ ] Graph RAG is designed but not overclaimed.
- [ ] Entity extraction boundaries are documented.
- [ ] Graph schema and source-link rules are documented.
- [ ] Retrieval tradeoffs are documented.
- [ ] Resume/project wording distinguishes designed vs implemented Graph RAG.

## Phase 4 - External Data Integrations — Estimate: Joel 24h / 4.0 days, Prithvi 84h / 28.0 days

Goal: ingest journal-related text from other apps without brittle private APIs.

See `guardrails/External-Data-Integrations.md`.

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

## Phase 5 - Freeform People Notes — Estimate: Joel 10h / 1.7 days, Prithvi 26h / 8.7 days

Goal: add user-controlled freeform people notes without forcing person interactions into the entry model.

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

## Phase 6 - Source-Backed Insights — Estimate: Joel 42h / 7.0 days, Prithvi 78h / 26.0 days

Goal: create source-backed insight beyond basic search.

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

## Phase 7A - Google Systems Layer: Go Distributed Rate Limiter — Estimate: Joel 72h / 12.0 days, Prithvi 36h / 12.0 days

Goal: create a standalone systems component that protects hosted AI endpoints.

### Layer 1: API Contract — Estimate: Joel 8h / 1.3 days, Prithvi 4h / 1.3 days

#### Joel

- [ ] Define service API: HTTP or gRPC.
- [ ] Define request shape: `user_id`, `feature`, `cost_weight`, `plan`.
- [ ] Define response shape: `allowed`, `remaining`, `retry_after`.
- [ ] Define fail-open/fail-closed policy.

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

## Phase 7B - Hosted Consumer Profile — Estimate: Joel 36h / 6.0 days, Prithvi 72h / 24.0 days

Goal: make hosted InnerScript possible without weakening local-first trust.

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

- [ ] Can explain why chunking improves retrieval.
- [ ] Can show search Precision@5.
- [ ] Can show import parser tests.
- [ ] Can show source-backed AI insights.
- [ ] Can show people route with guarded language.
- [ ] Can show Go rate limiter benchmark.
- [ ] Can explain token bucket vs sliding window.
- [ ] Can explain Redis Lua atomicity.
- [ ] Can explain local vs hosted tradeoffs.
- [ ] Can show one-page architecture diagram.
- [ ] Can produce 2-minute STAR story about ambiguity and ownership.
