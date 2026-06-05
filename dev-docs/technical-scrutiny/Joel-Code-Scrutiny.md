# Joel Code Scrutiny

Purpose: track code Joel has scrutinized deeply enough to explain imports, functions, data flow, failure modes, and tradeoffs.

This file is for heavy technical work such as chunking, embeddings, retrieval, Graph RAG, rate limiting, caching, background jobs, and AI prompt contracts.

## Scrutiny Rule

For heavy implementation work, do not only say what changed. Walk Joel through the code slowly:

- imports first
- constants and schemas next
- one small function at a time
- at most about 5 lines of code per explanation block unless the function is tiny
- explain why each function exists
- explain inputs, outputs, side effects, and failure modes
- explain what Joel should be able to say in an interview
- mark the code as scrutinized only after the walkthrough happens

## Status Legend

- `planned`: code exists or is planned, but Joel has not reviewed it yet
- `in-review`: walkthrough started
- `scrutinized`: Joel has walked through the code and can explain it
- `needs-revisit`: code changed after scrutiny or Joel wants a deeper pass

## Scrutiny Map

| Area | File | Status | What Joel must be able to explain | Last reviewed |
|---|---|---|---|---|
| Reflection contract | `lib/reflection-question.js` | planned | current-entry-only contract, local fallback, empty-entry rejection, provider hook | not reviewed |
| Reflection API route | `app/api/reflection-question/route.js` | planned | request shape, entry loading, 404/422 behavior, no-AI fallback | not reviewed |
| Reflection tests | `tests/unit/reflection-question.test.js`; `tests/integration/reflection-question-api.test.js` | planned | contract tests, fallback tests, API tests, local Postgres integration | not reviewed |
| Chunking strategy | `dev-docs/architecture/Chunking-Strategy.md` | in-review | paragraph-first rule, alternatives, metadata, source references, failure modes | 2026-06-05 |
| Chunking utility | `lib/chunking.js` | planned | paragraph splitting, tiny paragraph merge, long paragraph fallback, deterministic chunk output | not implemented |
| Chunking tests | `tests/unit/chunking.test.js` | planned | paragraph chunks, max-size fallback, empty entries, tiny paragraphs, long paragraphs | not implemented |
| Chunks schema/model | `db/schema.js`; migration file TBD | planned | chunk table fields, source ranges, cascade/delete behavior, pgvector path | not implemented |

## Current Chunking Walkthrough Queue

1. `dev-docs/architecture/Chunking-Strategy.md`
2. `lib/chunking.js` once implemented
3. `tests/unit/chunking.test.js` once implemented
4. chunks table/model once implemented
5. chunk rebuild-on-save integration once implemented

## Notes

- Strategy docs can be reviewed before code, but they do not replace code scrutiny.
- A checked Atomic Plan implementation task should have either tests, working behavior, or a scrutiny note explaining why it is only a decision/documentation task.
