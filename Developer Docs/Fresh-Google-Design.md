# InnerScript Fresh Design — Google-Oriented AI Journaling System

Date: 2026-05-29
Status: draft source-of-truth for restart planning
Priority: build a project that is personally aligned with Joel and technically strong enough to discuss for Google SWE L3.

## Executive Decision

InnerScript should be rebuilt as a **local-first AI journaling and personal semantic memory system**.

The project should not be framed as "chat with notes". That is too generic. The stronger framing is:

> InnerScript helps a user convert private unstructured life text — journals, voice notes, chats, and people interactions — into searchable, explainable personal insight.

Secondary goals:

- Learn agentic AI.
- Build a useful AI app.
- Maybe make money later.

Primary goal:

- Build a serious, interview-defensible project for Google.

## Should Go Be Used?

Use Go, but not for the whole product.

### Recommended Split

| Layer | Language | Reason |
|---|---|---|
| Product UI and app shell | Next.js / React | Fast iteration, strong UI, best for the journaling product |
| Core API for MVP | Next.js API routes | Keeps velocity high while product shape is still moving |
| Distributed rate limiter | Go service | Strong systems story: concurrency, Redis/Lua, low-latency service, clear Google prep value |
| Optional ingestion workers later | Go or Python | Go for throughput; Python if local ML/NLP libraries dominate |

Do not rewrite the entire app in Go. That would slow the product and make the UI worse. Use Go where it creates a clean systems boundary.

### Google Story

The Go service should be a separate production-style subsystem:

```text
Next.js API route
  -> Rate Limit Service written in Go
  -> Redis atomic token bucket / sliding window
  -> allow, reject, or degrade request
```

This lets Joel explain:

- Why in-memory rate limiting fails across multiple instances.
- Why AI endpoints need cost protection.
- Why Redis plus Lua gives atomic check-and-increment.
- How service boundaries work.
- How to test concurrency and failure modes.

Use Go for this after the product has enough endpoints worth protecting.

## Research Basis

This is not medical advice and the app should never claim to diagnose. The research only justifies why journaling and semantic reflection are plausible product directions.

### Journaling and Expressive Writing

Expressive writing research associated with James Pennebaker has long studied how writing about emotional experiences can affect health and cognition. The general takeaway useful for product design is not "journaling cures X"; it is that structured writing can help people organize experiences into language, patterns, and narratives.

Design implication:

- The app should encourage regular writing and reflection.
- It should not force positive thinking or gamified streaks.
- It should help users see patterns over time without pretending to be therapy.

Sources:

- Pennebaker and Beall, "Confronting a traumatic event: Toward an understanding of inhibition and disease": https://psycnet.apa.org/record/1987-17819-001
- Cambridge expressive writing overview: https://www.cambridge.org/core/journals/advances-in-psychiatric-treatment/article/emotional-and-physical-health-benefits-of-expressive-writing/ED2976A61F5DE56B46F07A1CE9EA9F9F

### Semantic Meaning From Text

Modern semantic search uses embeddings: a model converts text into vectors, and nearby vectors represent related meaning. Sentence-BERT showed a practical approach for producing sentence embeddings suitable for semantic similarity search. The same idea applies to journal entries, paragraphs, imported chats, and people notes.

Design implication:

- Store raw text separately from derived semantic representations.
- Index at multiple levels: note, paragraph, message, person interaction.
- Use semantic search for "find notes where I felt behind in life" rather than only keyword search.

Sources:

- Sentence-BERT paper: https://arxiv.org/abs/1908.10084
- OpenAI embeddings guide: https://platform.openai.com/docs/guides/embeddings

### Voice To Text

Whisper demonstrated robust speech recognition across many conditions and languages. Voice journaling is important because many real reflections happen while walking, driving, or thinking aloud, not sitting at a keyboard.

Design implication:

- Voice capture should create editable transcripts, not immutable records.
- Transcripts should enter the same semantic pipeline as typed notes.
- Store audio only if the user explicitly opts in.

Sources:

- Whisper paper: https://arxiv.org/abs/2212.04356
- OpenAI speech-to-text docs: https://platform.openai.com/docs/guides/speech-to-text

### Imported Text and Personal Context

People already produce journal-adjacent text in WhatsApp chats, notes apps, emails, documents, and saved messages. WhatsApp supports exporting chat history, which makes local import feasible without needing platform API access.

Design implication:

- Start with file-based imports, not brittle API integrations.
- Treat imported text as source documents with provenance.
- Never mix imported chat text into insights without showing where it came from.

Source:

- WhatsApp Help Center, export chat: https://faq.whatsapp.com/1180414079177245

## Product Thesis

Journaling apps usually store text. Therapy apps usually ask scripted questions. Chatbots usually answer what you ask.

InnerScript should do something more specific:

> Build a private semantic map of a person's inner life from the text they already produce, then surface patterns they can inspect.

The app should answer questions like:

- What has been repeatedly bothering me?
- Which people energize me, drain me, or recur in important moments?
- What assumptions do I keep making?
- What goals did I mention but stop acting on?
- What topics correlate with better or worse mood?
- What did I say last month about this person/project/decision?
- Where am I contradicting myself?

## Core Objects

### Entry

The primary unit of user-authored reflection.

Types:

- Typed journal entry.
- Voice transcript.
- Imported note.
- Imported chat excerpt.
- Reflection generated from a person interaction.

### Source

Where text came from.

Examples:

- `manual`
- `voice`
- `whatsapp_export`
- `markdown_import`
- `clipboard`
- `email_export`

### Chunk

A smaller indexed unit.

Examples:

- Paragraph.
- Voice segment.
- WhatsApp message group.
- Section of imported document.

### Person

A person mentioned in entries or imported conversations.

Fields:

- name
- aliases
- relationship type
- description
- user-written notes
- interaction summaries
- emotional association over time

### Interaction

A structured record of a meaningful moment involving one or more people.

Examples:

- "Talked with Prithvi about project ownership."
- "Argument with friend about money."
- "Mentor call about career direction."

### Insight

Derived interpretation from entries/chunks/interactions.

Examples:

- mood trend
- recurring topic
- hidden assumption
- contradiction
- unresolved decision
- people pattern
- weekly digest

## Feature Set

### 1. Minimal Journal

The editor is still the home screen.

Requirements:

- Fast note creation.
- Daily entry.
- Markdown/plain text writing.
- Autosave.
- Keyboard-first.
- No visual clutter while writing.

### 2. Voice Journaling

Flow:

```text
Record voice
  -> transcribe
  -> user edits transcript
  -> save as Entry(source = voice)
  -> chunk
  -> embed
  -> analyse
```

MVP behavior:

- Browser microphone capture.
- Upload audio to local server route.
- Transcribe with OpenAI speech-to-text or local adapter later.
- Show transcript before saving.
- Delete audio by default after transcript unless `KEEP_AUDIO=true`.

Google angle:

- File upload pipeline.
- Async processing.
- Error states.
- Privacy trade-offs.

### 3. Text Imports

Start with file imports:

- Markdown files.
- `.txt` files.
- WhatsApp exported `.txt` chats.
- Clipboard paste.

Later:

- Email export.
- Google Docs export.
- Obsidian folder import.

Import pipeline:

```text
File upload
  -> source parser
  -> normalize into Entry + Chunk records
  -> detect dates, participants, and message boundaries
  -> queue embedding and analysis jobs
```

Do not attempt live WhatsApp integration. Use export/import first.

### 4. Semantic Memory Search

Search should support:

- all entries
- date range
- source type
- person
- topic
- emotion

Examples:

- "times I felt stuck but later recovered"
- "what did I say about Google prep?"
- "conversations with Prithvi about InnerScript"
- "entries where money and anxiety appear together"

Technical approach:

- Store embeddings for chunks.
- Search chunks first.
- Group results by entry/person/source.
- Show why a result matched.

### 5. Insights Dashboard

Minimal, not flashy.

Sections:

- Mood trend.
- Topic recurrence.
- People recurrence.
- Weekly digest.
- Open loops.
- Assumptions.
- Contradictions.

The dashboard should never be the first screen. It is a place the user visits after writing enough data.

### 6. Assumption Extraction

Use the Devil's Advocate idea here.

For an entry, extract:

- foundational assumptions
- empirical assumptions
- normative assumptions
- scope assumptions
- load-bearing score

Example:

```text
High: "If I am not moving fast, I am falling behind."
Medium: "Prithvi and I are evaluating the project by the same standard."
Low: "This week reflects the long-term trend."
```

Action:

- "Challenge this" opens a reflection chat seeded with that assumption.

### 7. People Route

Route:

```text
/people
/people/[id]
```

Purpose:

Show the people in the user's life as semantic entities, not just contact records.

Person page:

- Description written by user.
- Aliases/names detected from imports.
- Timeline of interactions.
- Most common topics with that person.
- Emotional trend around that person.
- User's open loops involving that person.
- Related entries.
- "What have I learned about this relationship?" generated summary.

Important: avoid claiming the app knows the other person. It only summarizes the user's own records.

Wording rule:

- Say "Your notes often describe..." not "Prithvi is..."

### 8. Weekly Digest

Generated from the past 7 days.

Sections:

- Main themes.
- Mood movement.
- People who appeared.
- Open loops.
- Repeated assumptions.
- One useful question for next week.

This should be one of the flagship features.

### 9. Contradiction and Change Detection

Find cases where the user's position changed.

Examples:

- "Earlier you wrote that you wanted to focus only on Google; this week you wrote more about monetizing InnerScript."
- "You described this person as helpful in March and unreliable in May."

Implementation:

- Start rule-light with LLM comparison over retrieved entries.
- Later add structured stance records.

### 10. Open-Source Local Mode

Required:

- Docker Compose local install.
- `.env.example`.
- AI-off mode.
- Local export.
- Clear privacy doc.
- Import/export formats documented.

Local should be a first-class product, not a crippled demo.

### 11. Hosted Consumer Mode

Later:

- Auth.
- Billing.
- Sync.
- Backups.
- Rate limits.
- Background jobs.
- Account deletion/export.

Hosted is where the Go rate limiter becomes mandatory.

## System Architecture From Scratch

```text
Client
  Next.js app
  Minimal editor
  Voice recorder
  Import UI
  Search UI
  People route
  Insights route

App API
  Entries API
  Imports API
  Transcription API
  Analysis API
  Search API
  People API
  Insights API

AI Pipeline
  Transcription
  Chunking
  Embedding
  Metadata extraction
  Assumption extraction
  Digest generation

Data
  PostgreSQL
  pgvector
  local file storage for optional audio/import originals

Hosted-only Systems
  Auth
  Redis
  Go distributed rate limiter
  job queue
  billing
```

## Proposed Schema

### `entries`

```text
id
user_id nullable in local mode
title
body
source_id
entry_type
occurred_at
created_at
updated_at
```

### `sources`

```text
id
source_type
display_name
original_filename
imported_at
metadata jsonb
```

### `chunks`

```text
id
entry_id
chunk_index
text
embedding vector(1536)
metadata jsonb
created_at
```

### `entry_metadata`

```text
id
entry_id
mood_score
arousal
emotion_label
topics jsonb
summary
analysed_at
```

### `assumptions`

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

```text
id
display_name
aliases jsonb
description
relationship_type
created_at
updated_at
```

### `interactions`

```text
id
person_id
entry_id
source_id
occurred_at
summary
sentiment_label
topics jsonb
open_loops jsonb
created_at
```

### `digests`

```text
id
period_start
period_end
digest_type
body
metadata jsonb
created_at
```

## AI Pipeline Detail

### Chunking

Chunk by source:

- Journal: paragraph or heading sections.
- Voice transcript: pause/time segments if available, otherwise paragraphs.
- WhatsApp: message windows by date/person/topic.
- Markdown import: heading sections.

Store source references so every generated insight can point back to raw text.

### Embedding

Embed chunks, not only full entries.

Why:

- Full entries blur topics.
- People interactions may be small pieces inside long notes.
- Search quality improves when retrieval units are smaller.

### Metadata Extraction

Extract at entry level:

- mood
- arousal
- emotion
- topics
- summary

Extract at chunk level only when needed:

- people mentions
- assumptions
- open loops
- decisions

### People Extraction

Start explicit before automatic.

MVP:

- User creates people manually.
- User links entries/interactions to people.

Post-MVP:

- Detect names from text.
- Suggest merges.
- Let user confirm.

Do not auto-create people aggressively. It will create clutter and privacy mistakes.

## Where The Go Rate Limiter Fits

Only hosted mode needs true distributed limiting. Local mode can use no-op or in-memory limiting.

Protected features:

- transcription
- embedding
- note analysis
- assumption extraction
- semantic search
- weekly digest
- challenge chat

Architecture:

```text
Next.js API
  -> rateLimit(feature, user_id)
  -> Go Rate Limit Service
  -> Redis Lua script
  -> allow / reject with retry_after
```

Rate limit dimensions:

```text
user_id
feature
plan
time_window
cost_weight
```

Example limits:

| Feature | Free | Paid |
|---|---:|---:|
| Transcription minutes | 30 / month | 600 / month |
| Analysis jobs | 50 / day | 1000 / day |
| Chat messages | 20 / hour | 200 / hour |
| Imports | 5 files / day | 100 files / day |
| Weekly digests | 1 / week | 10 / week |

Google discussion points:

- Token bucket vs sliding window.
- Redis atomicity.
- Lua script to avoid race conditions.
- Multi-instance correctness.
- Graceful degradation when limiter is down.
- Cost-aware quotas for AI features.
- Observability: allowed, rejected, latency, Redis errors.

## Build Plan

### Phase 0 — Product Reset

- Decide this document is the new direction.
- Keep useful code, but do not let current implementation constrain product design.
- Rename old docs as historical if needed.

### Phase 1 — Local Journal Core

- Minimal editor.
- Entries schema.
- Autosave.
- Markdown export.
- AI-off mode.
- Local setup docs.

### Phase 2 — Semantic Core

- Chunking.
- Embeddings.
- Semantic search.
- Source references.
- Basic insights extraction.

### Phase 3 — Voice and Imports

- Voice transcription.
- Markdown/txt import.
- WhatsApp export parser.
- Import review screen.

### Phase 4 — People Route

- People CRUD.
- Manual linking.
- Interaction timeline.
- People-based search and summaries.

### Phase 5 — Deep Insights

- Weekly digest.
- Assumption extraction.
- Challenge mode.
- Contradiction/change detection.

### Phase 6 — Google Systems Layer

- Go rate limiter.
- Redis.
- Load tests.
- Failure-mode tests.
- Architecture writeup.

### Phase 7 — Hosted Consumer Version

- Auth.
- User isolation.
- Billing.
- Background jobs.
- Backups.
- Account export/delete.

## Joel / Prithvi Split

### Joel

Own:

- Product direction.
- Architecture decisions.
- AI prompt contracts.
- People route semantics.
- Go rate limiter design.
- Google interview story.
- Final code review for data model and privacy.

Best first tasks:

- Write prompts for metadata, assumptions, weekly digest.
- Design schema migration plan.
- Define rate limiter API contract.
- Decide UI principles.

### Prithvi

Own:

- Implement well-scoped app features.
- Import parsers.
- Export endpoints.
- Tests.
- Local setup docs.
- People CRUD after schema is agreed.
- Chart/dashboard UI once endpoints exist.

Best first tasks:

- `.env.example`.
- Local setup doc.
- Markdown/txt import parser.
- Markdown export.
- Entry CRUD tests.
- People route shell.

## What To Avoid

- Do not build a generic chatbot.
- Do not overbuild agents before the data model is right.
- Do not make AI output visually dominate the journal.
- Do not claim therapeutic/medical value.
- Do not force Go into the product UI/API before there is a real systems boundary.
- Do not start hosted auth/billing before local product feels useful.

## One-Line Resume Framing

> Built InnerScript, a local-first AI journaling and semantic memory system that ingests typed notes, voice transcripts, and imported text, extracts structured personal insights with LLMs, indexes chunks with pgvector for semantic search, and uses a Go/Redis distributed rate limiter to protect hosted AI endpoints.

