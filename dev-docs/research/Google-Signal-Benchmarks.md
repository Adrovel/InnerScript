# Google Signal Benchmarks

Purpose: define the concrete evidence InnerScript must produce to look like a serious Google SWE L3 project.

Grounding:

- Personal Google prep file: `Personal Repo/04-Career/Organised/Identity, Skills and Current Standing/Cracking-Google.md`
- RAG backend plan: `Personal Repo/04-Career/Organised/Projects/01-Production-RAG-Backend.md`
- Rate limiter plan: `Personal Repo/04-Career/Organised/Projects/02-Distributed-Rate-Limiter.md`
- Google Careers interview guidance: https://www.google.com/about/careers/applications/interview-tips/
- Google SRE Book: https://sre.google/sre-book/introduction/
- Google SRE SLO resources: https://sre.google/resources/book-update/slos/
- Google Engineering Practices: https://google.github.io/eng-practices/

## What Google Needs To See

Google L3 is not looking for a giant enterprise system. It is looking for evidence that the candidate can own a component, solve ambiguous problems, reason through tradeoffs, write correct code, and communicate clearly.

For InnerScript, the evidence must be measurable.

## Recruiter-Level Signal

Recruiters will not read every source file. They need crisp proof:

| Signal | Evidence |
|---|---|
| serious AI project | semantic search, voice transcription, source-backed insights |
| backend depth | ingestion pipeline, chunking, pgvector, import jobs, API tests |
| systems depth | Go/Redis distributed rate limiter with load tests |
| ownership | full product from local setup to hosted architecture |
| user focus | privacy-first local mode, export, AI-off mode |
| metrics | latency, Precision@5, QPS, p99, test coverage |

## Interviewer-Level Signal

Interviewers will test whether the project is real.

InnerScript must support deep answers to:

- Why did you chunk text this way?
- Why pgvector instead of Pinecone/Weaviate?
- What fails if OpenAI is down?
- How do you avoid hallucinated insights?
- How do you measure semantic search quality?
- How do you avoid leaking private journal data?
- How do you rate limit AI endpoints across multiple app servers?
- What happens if Redis is down?
- How do you test import parsers?
- What is the difference between token bucket and sliding window?

## Required Benchmarks

### 1. Semantic Search Quality

Minimum benchmark:

- create at least 50 sample entries or sanitized personal/demo entries
- create at least 25 search queries
- manually label relevant results
- report Precision@5 and MRR

Target:

| Metric | MVP target | Strong target |
|---|---:|---:|
| Precision@5 | >= 0.70 | >= 0.85 |
| MRR | >= 0.70 | >= 0.85 |
| p95 search latency on 10k chunks | < 300ms | < 120ms |

Why this matters:

- Shows evaluation discipline.
- Avoids "it felt good in demo" weakness.

### 2. Import Pipeline Correctness

Minimum benchmark:

- Markdown parser tests
- plain text parser tests
- WhatsApp export parser tests
- duplicate import/idempotency test
- malformed input test

Target:

| Metric | Target |
|---|---:|
| parser unit tests | 30+ |
| duplicate import protection | yes |
| import preview before DB write | yes |
| source provenance preserved | 100% |

Why this matters:

- Shows data ingestion maturity.
- This is stronger than a generic CRUD app.

### 3. Voice-To-Text Reliability

Minimum benchmark:

- mocked transcription tests
- upload size limit
- retry/error state
- audio retention policy tested

Target:

| Metric | MVP target |
|---|---:|
| transcript review before save | yes |
| audio deleted by default | yes |
| transcription error is non-destructive | yes |
| p95 transcript save path after provider returns | < 500ms |

Why this matters:

- Shows multimodal ingestion and privacy thinking.

### 4. Source-Backed AI Insight Quality

Minimum benchmark:

- every weekly digest item links to source entries/chunks
- every person summary links to interactions
- every assumption links to source text
- user can mark an insight as useful/wrong

Target:

| Metric | MVP target |
|---|---:|
| generated insights with source links | 100% |
| schema-valid AI outputs | 99%+ with retries |
| unsupported insight display | blocked |

Why this matters:

- Shows responsible AI application, not shallow prompt wrapping.

### 5. People Route Correctness

Minimum benchmark:

- manual people CRUD
- guarded wording

Target:

| Metric | Target |
|---|---:|
| people CRUD API tests | yes |
| auto-created people without confirmation | 0 |
| person page fields controlled by user | 100% |

Why this matters:

- Shows privacy-sensitive entity modeling.

Future people mention and interaction-linking benchmarks are deferred to `dev-docs/planning/Future-Plan.md`.

### 6. Go/Redis Distributed Rate Limiter

Minimum benchmark:

- token bucket implementation
- sliding window implementation
- Redis Lua atomic script
- concurrent correctness test
- p99 latency benchmark
- failure-mode tests

Target:

| Metric | MVP target | Strong target |
|---|---:|---:|
| p99 limiter latency local Redis | < 10ms | < 5ms |
| correctness under 100 concurrent clients | 100% | 100% |
| sustained throughput | 1k req/s | 10k req/s |
| Redis failure behavior documented | yes | yes |
| Prometheus metrics | yes | yes |

Why this matters:

- Directly maps to distributed systems, Go, atomicity, and operational thinking.

### 7. Test and Engineering Hygiene

Google Engineering Practices emphasize clarity, maintainability, and reviewability. InnerScript must show this.

Targets:

| Area | Target |
|---|---:|
| unit tests for parsers/chunking/rate limiter | yes |
| API tests for core endpoints | yes |
| integration test for import -> chunk -> search | yes |
| no hidden AI dependency for local journal | yes |
| README local setup works from clean clone | yes |
| docs explain tradeoffs | yes |

### 8. SRE-Style Operational Metrics

Google SRE material frames services around latency, availability, performance, efficiency, monitoring, and capacity planning. InnerScript should borrow that vocabulary.

Track:

- semantic search latency
- embedding job latency
- transcription latency
- import throughput
- AI error rate
- rate limiter latency
- rate limiter allowed/denied count
- Redis error count

Suggested SLO-style targets for hosted demo:

| User journey | Target |
|---|---:|
| journal save availability | 99.9% |
| journal save p95 latency | < 300ms |
| semantic search p95 latency | < 300ms |
| rate limiter p99 latency | < 10ms |
| import preview for 1MB text | < 2s |

## Resume Bullet Targets

Weak bullet:

> Built an AI journaling app with chat over notes.

Strong bullet:

> Built InnerScript, a local-first AI journaling and semantic memory system that ingests typed notes, voice transcripts, and WhatsApp exports, chunks and indexes text with pgvector, and returns source-backed semantic search results with measured Precision@5.

Systems bullet:

> Built a Go/Redis distributed rate limiter for hosted AI endpoints using Lua-backed atomic token buckets, protecting transcription, embedding, and RAG routes with measured p99 latency and concurrent correctness tests.

Backend bullet:

> Designed an ingestion pipeline for Markdown, text, and WhatsApp exports with source provenance, idempotent imports, chunk-level embeddings, and tests covering malformed input and duplicate uploads.

## Minimum Bar Before Calling It Google-Ready

- [ ] 50+ entries or demo dataset
- [ ] 25 labeled semantic search queries
- [ ] Precision@5 reported
- [ ] import parser tests
- [ ] source-backed weekly digest
- [ ] people CRUD route
- [ ] Go rate limiter benchmark
- [ ] local setup works from clean clone
- [ ] architecture diagram
- [ ] STAR story prepared around ambiguity, ownership, and tradeoffs

## Sources Used

- Google Careers interview guidance: https://www.google.com/about/careers/applications/interview-tips/
- Google SRE Book introduction: https://sre.google/sre-book/introduction/
- Google SRE SLO resources: https://sre.google/resources/book-update/slos/
- Google Engineering Practices: https://google.github.io/eng-practices/
- Personal Google prep: `Personal Repo/04-Career/Organised/Identity, Skills and Current Standing/Cracking-Google.md`
- Production RAG plan: `Personal Repo/04-Career/Organised/Projects/01-Production-RAG-Backend.md`
- Distributed Rate Limiter plan: `Personal Repo/04-Career/Organised/Projects/02-Distributed-Rate-Limiter.md`
