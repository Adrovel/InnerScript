# Engineering, AI, And Google-Oriented Concepts

Purpose: keep a concise list of the concepts InnerScript covers or is designed to cover, grouped for Joel's engineering review and Google-oriented interview prep.

Source docs:

- `dev-docs/planning/Plan.md`
- `dev-docs/planning/Atomic-Action-Plan.md`
- `dev-docs/architecture/Architecture.md`
- `dev-docs/research/Google-Signal-Benchmarks.md`
- `dev-docs/team/Product-Decisions.md`

Status labels:

- Built: implemented in the app or branch-local code.
- Scaffolded: route, contract, helper, or plan exists, but production quality still needs validation.
- Planned: documented direction, not yet real implementation.

## Core Engineering Concepts

| Concept | Status | Why it matters |
|---|---|---|
| Next.js App Router route handlers | Built | Shows full-stack API ownership inside the product. |
| React 19 client state and component composition | Built | Supports a real writing UI with sidebar, editor, save state, and actions. |
| PostgreSQL schema modeling | Built | Covers entries, folders, sources, chunks, people, and product data shape. |
| Drizzle ORM and migrations | Built | Shows typed schema ownership and migration discipline, though Prithvi's rationale is still open. |
| CRUD API design | Built | Covers entries, folders, people, imports, export, and local data operations. |
| Zod request validation | Built | Keeps API inputs explicit and rejects invalid payloads early. |
| Transactional writes | Built | Used for destructive or multi-table operations like entry deletion and chunk cleanup. |
| Autosave race prevention | Built | Important editor correctness concept: stale saves must not overwrite newer writing. |
| Local-first setup | Built | Core journaling works locally without requiring hosted auth or AI providers. |
| Source provenance | Built | Imports and generated insights need traceable origin data. |
| Markdown editing and export | Built on branch | Covers raw Markdown storage, editing, and export-oriented portability. |
| Browser-facing UI tests with Storybook/Vitest | Built | Proves interaction behavior, not only pure functions. |
| Integration tests | Built | Validates API and DB boundaries. |
| Production readiness checks | Built on branch | Readiness should check real dependencies, not only env variables. |
| Basic Auth proxy for protected preview | Built on branch | Useful temporary protection before full hosted accounts. |
| Account isolation | Planned | Required before public hosted users. |
| Observability and SLO-style thinking | Planned | Needed for latency, availability, error-rate, and capacity discussions. |

## AI And Data Concepts

| Concept | Status | Why it matters |
|---|---|---|
| Current-entry reflection | Built on branch | First AI moment stays grounded and does not interrupt writing. |
| Quiet AI affordance | Built on branch | Keeps writing first; AI is available without taking over the screen. |
| Heuristic AI fallback | Built on branch | Lets local demos work without provider keys. |
| Provider-backed LLM adapter | Scaffolded | Needed to replace local heuristics when API keys and provider policy are ready. |
| Semantic chunking | Built on branch | Converts long entries into searchable units. |
| Source-backed search | Built on branch | Search answers should point back to user text instead of acting like unsupported chat. |
| Embedding pipeline | Scaffolded | Needed for real semantic memory beyond local heuristics. |
| pgvector retrieval | Scaffolded | Gives interview depth around vector search, indexing, and tradeoffs. |
| Retrieval evaluation | Planned | Precision@5 and MRR are needed to prove search quality. |
| Import preview and confirmation | Built on branch | Prevents writing untrusted imported data directly to the database. |
| Voice transcript review | Built on branch | Keeps user control before saving generated transcripts. |
| Audio retention default false | Built on branch | Privacy-first handling for sensitive voice input. |
| Emotion-first extraction | Planned | Product direction says emotions come before assumptions, people, and patterns. |
| Structured insight storage | Planned | Sensitive insights should become schema-backed data, not temporary generated text. |
| Citation/source snippet UI | Planned | Needed so AI claims can be checked without making the app feel academic. |
| Graph RAG | Planned | Interview/research direction only; do not claim production Graph RAG until built. |
| AI safety wording | Built in docs | Avoid diagnosis, treatment, therapist replacement, and fake precision. |

## Systems And Backend Concepts

| Concept | Status | Why it matters |
|---|---|---|
| Rate-limit algorithm contract | Built on branch | Shows hosted AI endpoints need cost and abuse protection. |
| Go service boundary | Scaffolded | Strong systems signal, but local compile is blocked until Go is installed. |
| Redis-backed distributed quotas | Planned/scaffolded | Needed for multi-instance correctness and atomic quota updates. |
| Token bucket | Planned/scaffolded | Core rate limiting algorithm for steady refill. |
| Sliding window | Planned/scaffolded | Useful contrast with token bucket for fairness and burst control. |
| Redis Lua atomicity | Planned | Google-oriented discussion point for shared-state correctness. |
| Failure-mode design | Planned | Must define behavior when Redis, DB, AI provider, or transcription provider fails. |
| Hosted vs local deployment profiles | Built in architecture docs | Separates local privacy mode from future hosted consumer mode. |
| Cost-bearing endpoint protection | Scaffolded | AI, STT, embeddings, and digest routes need quotas before hosted use. |
| Data export and deletion | Built on branch | Required for trust, privacy, and user control. |
| Secret management | Planned | Needed before real hosted deployment. |
| Backup and breach response | Planned | Required before public customers trust the product. |

## Google-Oriented Interview Concepts

| Concept | Status | Interview angle |
|---|---|---|
| Ambiguous product-to-system translation | Built in docs | Explain how a private writing product becomes schemas, APIs, retrieval, and safety rules. |
| Tradeoff reasoning | Built in docs | Local-first vs hosted, heuristic fallback vs provider AI, Postgres/pgvector vs external vector DB. |
| Correctness under concurrent edits | Built | Autosave race handling is a concrete correctness story. |
| Data modeling | Built | Entries, folders, chunks, sources, people, and digests show entity design. |
| API contract design | Built | Route handlers plus Zod schemas make boundaries explainable. |
| Evaluation mindset | Planned | Search quality should be measured with Precision@5, MRR, and latency. |
| Operational thinking | Planned | SLO-style latency/error/capacity metrics need implementation evidence. |
| Distributed systems | Scaffolded | Go/Redis limiter can become the main systems-depth proof. |
| Privacy engineering | Scaffolded/planned | Export, deletion, audio retention, access control, and breach response form the trust story. |
| Source-grounded AI | Built on branch | Stronger than generic chatbot claims because outputs can tie back to entries/chunks. |
| Safe claim discipline | Built in docs | Resume/interview claims should distinguish built, scaffolded, and planned work. |

## Strong Next Learning Targets

1. Validate the `fast-forward-V1` dirty patch in browser: bulk delete, selected-entry state, and Haulden persona seed flow.
2. Write the exact explanation of autosave races and how this editor avoids stale-save overwrite.
3. Implement or validate provider-backed embeddings/search so semantic memory is not only heuristic.
4. Add a small retrieval evaluation set with Precision@5 and MRR.
5. Compile and test the Go/Redis limiter once Go is installed.
6. Write the privacy/security plan before positioning InnerScript for public customers.
7. Add production account isolation before hosted multi-user use.

## Claim-Safe Summary

InnerScript can currently be described as a local-first AI journaling and semantic memory project with implemented journaling, Markdown editing, autosave protection, folders, CRUD APIs, branch-local export/search/Echo/import/people/privacy surfaces, and documented hosted systems direction. Do not claim production-grade Graph RAG, full provider-backed AI, public-customer security, or compiled Go/Redis infrastructure until those are verified in code and tests.
