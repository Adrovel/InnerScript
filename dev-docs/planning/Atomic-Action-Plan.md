# InnerScript Atomic Action Plan

Purpose: split InnerScript from zero to Google-signal completion into atomic tasks for Joel and Prithvi.

Rule: every task must either produce a working artifact, a test, a benchmark, or a decision record. Avoid vague tasks like "improve AI" or "make UI better."

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

### Prithvi

Prithvi owns:

- scoped implementation tickets
- CRUD/API wiring
- import/export parsers
- tests
- local setup docs
- UI screens after behavior is specified
- integration support for the Go rate limiter

### Shared Rule

If a feature changes the app direction, data model, privacy model, or Google signal, it must update the relevant docs under `dev-docs/` before implementation.

Relevant docs:

- `planning/Features.md`
- `architecture/Architecture.md`
- `planning/Plan.md`
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
| Phase 1 - Local Journal Core | 18 | 3.0 | 54 | 18.0 | 3-4 weeks |
| Phase 2 - Semantic Core | 30 | 5.0 | 72 | 24.0 | 4-5 weeks |
| Phase 3 - External Data Integrations | 24 | 4.0 | 84 | 28.0 | 5-6 weeks |
| Phase 4 - People and Interactions | 18 | 3.0 | 54 | 18.0 | 3-4 weeks |
| Phase 5 - Insights and Reflection | 42 | 7.0 | 78 | 26.0 | 5-6 weeks |
| Phase 6 - Go Distributed Rate Limiter | 72 | 12.0 | 36 | 12.0 | 3-4 weeks |
| Phase 7 - Hosted Consumer Profile | 36 | 6.0 | 72 | 24.0 | 5-6 weeks |
| Total | 252 | 42.0 | 456 | 152.0 | ~28-37 weeks |

Important:

- The Google-ready project does not require Phase 7.
- A strong Google portfolio target is Phases 0-6 with benchmarks.
- A useful local open-source target is Phases 0-5 without hosted mode.

## Layer Estimate Summary

| Phase | Layer | Joel hours | Prithvi hours | Notes |
|---|---|---:|---:|---|
| 0 | Direction confirmation | 8 | 3 | Joel validates product/Google thesis; Prithvi lists implementation questions |
| 0 | Local setup verification | 4 | 3 | Prithvi checks run path; Joel resolves direction blockers |
| 1 | Schema and API | 6 | 18 | Highest dependency layer for Phase 1 |
| 1 | Editor | 4 | 14 | Keep UI minimal |
| 1 | Daily entry | 3 | 8 | Small but important UX loop |
| 1 | Export | 5 | 14 | Open-source trust feature |
| 2 | Chunking | 8 | 18 | Joel defines rules; Prithvi implements/tests |
| 2 | Embeddings | 8 | 22 | Provider adapter and failure modes matter |
| 2 | Search | 14 | 32 | Includes evaluation queries and UI |
| 3 | Import framework | 8 | 24 | Parser interface, preview, idempotency |
| 3 | Markdown/text imports | 4 | 16 | Early external data support |
| 3 | WhatsApp export import | 6 | 24 | High Google impact; many parser edge cases |
| 3 | Voice journaling | 6 | 20 | Audio/transcription/review flow |
| 4 | People CRUD | 5 | 20 | Manual people first |
| 4 | Interactions | 7 | 20 | Link entries to people |
| 4 | People insights | 6 | 14 | Source-backed language is critical |
| 5 | Metadata extraction | 8 | 18 | Structured AI output |
| 5 | Weekly digest | 10 | 18 | High product and Google signal |
| 5 | Assumptions/challenge mode | 14 | 24 | AI behavior needs Joel ownership |
| 5 | Contradiction/change detection | 10 | 18 | Defer if search quality is weak |
| 6 | API contract | 8 | 4 | Joel owns design |
| 6 | Go service | 38 | 12 | Core systems component |
| 6 | Metrics/load testing | 26 | 20 | Benchmark output is the point |
| 7 | Hosted architecture decisions | 12 | 6 | Can defer |
| 7 | User ownership/auth/billing | 12 | 38 | Hosted-only |
| 7 | Account export/delete/quotas | 12 | 28 | Hosted trust requirements |

## Phase 0 - Direction Lock — Estimate: Joel 12h / 2.0 days, Prithvi 6h / 2.0 days

Goal: make the project coherent before code changes.

### Joel Tasks

- [ ] Read `Cracking-Google.md`, `01-Production-RAG-Backend.md`, and `02-Distributed-Rate-Limiter.md`.
- [ ] Confirm the one-line product thesis in `planning/Features.md`.
- [ ] Confirm the top 6 high-Google-impact features.
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

- [ ] All canonical docs exist.
- [ ] High-impact feature ranking is visible in `planning/Features.md`.
- [ ] Next phase tasks have clear owners.
- [ ] No implementation starts without a stable schema direction.

## Phase 1 - Local Journal Core — Estimate: Joel 18h / 3.0 days, Prithvi 54h / 18.0 days

Goal: make InnerScript useful as a plain local journal before AI.

### Layer 1: Schema and API — Estimate: Joel 6h / 1.0 day, Prithvi 18h / 6.0 days

#### Joel

- [ ] Approve `entries` schema.
- [ ] Approve `sources` schema.
- [ ] Decide date semantics: `occurred_at` vs `created_at`.
- [ ] Decide whether existing `notes` table is migrated or replaced.
- [ ] Write migration notes if replacing current note model.

#### Prithvi

- [ ] Implement `entries` table/model.
- [ ] Implement `sources` table/model.
- [ ] Add `GET /api/entries`.
- [ ] Add `POST /api/entries`.
- [ ] Add `GET /api/entries/[id]`.
- [ ] Add `PUT /api/entries/[id]`.
- [ ] Add `DELETE /api/entries/[id]`.
- [ ] Add tests for entry CRUD.
- [ ] Add tests for source creation.

### Layer 2: Editor — Estimate: Joel 4h / 0.7 days, Prithvi 14h / 4.7 days

#### Joel

- [ ] Define minimal editor UX.
- [ ] Decide whether Markdown preview is MVP or deferred.
- [ ] Define autosave behavior and failure state.

#### Prithvi

- [ ] Wire editor to `entries` API.
- [ ] Implement autosave.
- [ ] Add visible save state.
- [ ] Add empty state.
- [ ] Add retry behavior for failed save.
- [ ] Add component test for autosave.

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

## Phase 2 - Semantic Core — Estimate: Joel 30h / 5.0 days, Prithvi 72h / 24.0 days

Goal: turn entries into searchable semantic memory.

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
- [ ] Define Precision@5 target for MVP.

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

## Phase 3 - External Data Integrations — Estimate: Joel 24h / 4.0 days, Prithvi 84h / 28.0 days

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

### Layer 3: WhatsApp Export Import — Estimate: Joel 6h / 1.0 day, Prithvi 24h / 8.0 days

#### Joel

- [ ] Define supported WhatsApp export format.
- [ ] Define privacy warning copy.
- [ ] Define participant mapping to people.

#### Prithvi

- [ ] Implement WhatsApp `.txt` parser.
- [ ] Group messages by date and participant.
- [ ] Preserve timestamps.
- [ ] Map participant names to people only after user confirmation.
- [ ] Add tests for common WhatsApp export lines.
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
- [ ] WhatsApp export import works from file upload.
- [ ] Voice transcript creates editable entries.
- [ ] Imported content enters chunking/search pipeline.

## Phase 4 - People and Interactions — Estimate: Joel 18h / 3.0 days, Prithvi 54h / 18.0 days

Goal: make people a first-class semantic layer.

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

### Layer 2: Interactions — Estimate: Joel 7h / 1.2 days, Prithvi 20h / 6.7 days

#### Joel

- [ ] Define what counts as an interaction.
- [ ] Define open-loop extraction behavior.
- [ ] Define "do not overclaim about people" rules.

#### Prithvi

- [ ] Add `interactions` table/model.
- [ ] Link entries to people.
- [ ] Add interaction timeline.
- [ ] Add source-backed interaction summaries.
- [ ] Add tests for link/unlink behavior.

### Layer 3: People Insights — Estimate: Joel 6h / 1.0 day, Prithvi 14h / 4.7 days

#### Joel

- [ ] Write prompt for relationship summary from user notes only.
- [ ] Define unsafe wording examples.

#### Prithvi

- [ ] Show common topics for person.
- [ ] Show related entries.
- [ ] Show open loops.
- [ ] Add empty states.

### Exit Criteria

- [ ] People can be created and linked manually.
- [ ] Person page shows source-backed interaction timeline.
- [ ] AI summaries use guarded language.

## Phase 5 - Insights and Reflection — Estimate: Joel 42h / 7.0 days, Prithvi 78h / 26.0 days

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

## Phase 6 - Google Systems Layer: Go Distributed Rate Limiter — Estimate: Joel 72h / 12.0 days, Prithvi 36h / 12.0 days

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

## Phase 7 - Hosted Consumer Profile — Estimate: Joel 36h / 6.0 days, Prithvi 72h / 24.0 days

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
