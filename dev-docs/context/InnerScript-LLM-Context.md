# InnerScript — Complete Technical Context

> Copy-paste this entire document into any LLM to get full context on the app — architecture, code, fundamentals, and future features.

---

## What Is InnerScript?

InnerScript is a **local-first, AI-powered journaling app**. Users write notes, the app automatically extracts mood, emotions, and topics using GPT-4o-mini, stores them in a PostgreSQL database with vector embeddings, and lets users ask questions about their notes via a RAG-powered chat.

**Stack:** Next.js 16 (App Router) · React 19 · PostgreSQL + pgvector · Sequelize ORM · Vercel AI SDK · GPT-4o-mini · Tailwind CSS 4 · shadcn/ui · Docker

---

## Fundamentals You Need To Know

### 1. Next.js App Router

Next.js has two routing systems. InnerScript uses the **App Router** (introduced in Next.js 13).

- Files in `app/` define routes. `app/Journal/page.jsx` → the `/Journal` URL.
- **Server Components** are the default. They run on the server, can be `async`, and fetch data directly. They cannot use `useState`, `useEffect`, or browser APIs.
- **Client Components** are opted-in with `'use client'` at the top of the file. They run in the browser and can use React hooks.
- **API Routes** live in `app/api/`. A file like `app/api/notes/route.js` handles `GET /api/notes` and `POST /api/notes`.
- **Dynamic segments** use brackets: `app/api/notes/[id]/route.js` handles `/api/notes/any-uuid-here`. The `id` is accessed via `params.id`.

**Why this matters for InnerScript:** The main Journal page (`app/Journal/page.jsx`) is a Server Component — it fetches the sidebar data and today's note on the server before sending HTML. The editor, sidebar, and chat are all Client Components because they need interactivity.

### 2. React Context

Context is a way to share state between components without prop-drilling (passing props through many layers).

```
createContext()       → creates the context object
<Context.Provider>    → wraps components that need access
useContext()          → reads the value inside any child
```

InnerScript uses `FileContext` (`app/_components/files-context.jsx`) to share:
- `selectedNoteId` — which note is currently open
- `sidebarMetadata` — the full folder/file tree
- `metadata` — the AI analysis result for the current note

Any component anywhere in the tree can call `useFileContext()` to read or update these values without receiving props.

### 3. PostgreSQL + pgvector

PostgreSQL is a relational database. InnerScript adds **pgvector**, a PostgreSQL extension that lets you store and query high-dimensional vectors (arrays of floating-point numbers).

**Why vectors?** AI embedding models convert text into a list of ~1536 numbers where similar texts produce numerically similar vectors. You can then find "semantically close" content using vector distance functions.

Key pgvector operator:
```sql
-- <=> is cosine distance. Lower = more similar.
-- (1 - cosine_distance) = similarity score (0 to 1)
SELECT content, (1 - (embedding <=> $1::vector)) AS similarity
FROM notes
ORDER BY embedding <=> $1::vector
LIMIT 3;
```

In InnerScript, every note has an `embedding vector(1536)` column. When a user asks a question in chat, the question is also embedded, then the database finds the 3 most semantically similar notes to use as context.

### 4. ORM vs Raw SQL — Why InnerScript Uses Both

**Sequelize** is an ORM (Object Relational Mapper) — it lets you write JavaScript to interact with the database instead of SQL.

```js
// ORM
const note = await db.Notes.create({ title: 'Today', content: '...' })

// Raw SQL equivalent
await pool.query('INSERT INTO notes (title, content) VALUES ($1, $2)', ['Today', '...'])
```

**InnerScript uses both — here's why:**

- Sequelize handles standard CRUD (create, read, update, delete) for notes and folders.
- pgvector introduces the `<=>` operator, which Sequelize doesn't know about. Raw `pg` Pool queries are used wherever vector similarity search is needed.

This is a real pattern in production apps: ORMs for 80% of queries, raw SQL for the 20% the ORM can't express cleanly.

### 5. Embeddings and RAG

**RAG = Retrieval-Augmented Generation.** It is the pattern of feeding relevant documents to an LLM as context before asking it a question.

The problem: GPT-4o-mini doesn't know what's in your notes. But if you paste the relevant notes into the prompt before asking, it can answer accurately.

The challenge: you might have 500 notes. You can't paste all of them. So you:
1. Convert all notes to embeddings (numbers) and store them.
2. When a user asks a question, embed the question too.
3. Find the 3 notes most similar to the question using vector distance.
4. Paste those 3 notes into the prompt as context.
5. Ask the LLM to answer using only that context.

This is exactly what `app/api/chat/route.js` does.

### 6. Vercel AI SDK

The Vercel AI SDK (`ai` package) is a library that simplifies working with LLMs in JavaScript.

Three functions InnerScript uses:

```js
// 1. Stream text — for chat (real-time token-by-token response)
import { streamText } from 'ai'
const result = await streamText({ model, messages, system })
return result.toDataStreamResponse() // streams to the browser

// 2. Generate structured objects — for AI analysis (enforces a schema)
import { generateObject } from 'ai'
const { object } = await generateObject({ model, schema, system, prompt })
// `object` is guaranteed to match the Zod schema

// 3. Generate embeddings — for vector search
import { embed } from 'ai'
const { embedding } = await embed({ model, value: text })
// `embedding` is a number[]
```

`useChat` (from `@ai-sdk/react`) is the client-side hook that connects to the streaming API and manages the messages array automatically.

### 7. Debouncing

Debouncing delays a function call until after a user stops performing an action.

In `plain-editor.jsx`:
```js
clearTimeout(saveTimer.current)
saveTimer.current = setTimeout(async () => {
  // actual save + AI analysis
}, 2000)
```

Every keystroke resets the 2-second timer. The save only fires 2 seconds after the user stops typing. Without this, every single keypress would trigger a database write and an OpenAI API call.

### 8. Non-Blocking / Fire-and-Forget

After saving, the editor triggers AI analysis without waiting for it:

```js
// Save first (user sees "Saved ✓")
const res = await fetch(`/api/notes/${id}`, { method: 'PUT', ... })

// Then kick off analysis — don't await, don't block UI
fetch(`/api/notes/${id}/analyse`, { method: 'POST' })
  .then(r => r.json())
  .then(data => { if (data.metadata) setMetadata(data.metadata) })
  .catch(() => {})
```

The analysis takes 2-4 seconds (it calls OpenAI). Making the user wait would feel broken. Instead, the save completes immediately, and the metadata panel updates quietly in the background when analysis finishes.

### 9. Docker Compose

InnerScript runs locally via Docker. `docker-compose.yml` defines two services: the Next.js app and a PostgreSQL database with the pgvector extension pre-installed.

```
User browser → Next.js app (port 3000) → PostgreSQL (port 5432)
```

The database connection string (`DATABASE_URL`) is passed as an environment variable from `.env.local`.

### 10. Zod Schema Validation

Zod is a TypeScript/JavaScript schema validation library. InnerScript uses it to enforce the shape of LLM responses.

```js
const metadataSchema = z.object({
  mood_score: z.number().min(1).max(10),
  arousal: z.enum(['calm', 'energised', 'tense', 'neutral']),
  emotion_label: z.string(),
  topics: z.array(z.string()).max(5),
  summary: z.string(),
})
```

When `generateObject` is called with this schema, the Vercel AI SDK retries the LLM until it returns valid JSON matching the schema. This prevents invalid/hallucinated fields from breaking the app.

---

## Application Architecture

```
Browser
├── /Journal (Next.js Server Component)
│   ├── Fetches sidebar tree (getExplorerData server action)
│   ├── Fetches today's note (GET /api/notes/today)
│   └── Renders <FileProvider> wrapping all client components
│
├── <AppSidebar> [Client]
│   ├── Reads sidebarMetadata from FileContext
│   ├── Renders recursive folder/file tree
│   └── Right-click context menu (new note, new folder, rename, delete)
│
├── <PlainEditor> [Client]
│   ├── Reads selectedNoteId from FileContext
│   ├── Fetches note content on selection change
│   ├── Debounced save (2s after typing stops) → PUT /api/notes/:id
│   └── Fire-and-forget AI analysis → POST /api/notes/:id/analyse
│
├── <NoteMetadataPanel> [Client]
│   ├── Reads metadata from FileContext
│   └── Displays mood_score, arousal, emotion_label, topics, summary, da_reflection
│
└── <ChatPanel> [Client]
    ├── useChat hook → POST /api/chat (streaming)
    ├── Note selector popover (user picks which notes to query)
    └── Sends noteIDs with every message for RAG context
```

### API Routes

| Route | Method | Purpose |
|---|---|---|
| `/api/notes` | GET | List all notes (flat) |
| `/api/notes` | POST | Create a new note |
| `/api/notes/today` | GET | Get or create today's note (date-titled) |
| `/api/notes/[id]` | GET | Get a single note by ID |
| `/api/notes/[id]` | PUT | Update title/content |
| `/api/notes/[id]` | DELETE | Delete a note |
| `/api/notes/[id]/analyse` | POST | Run AI analysis on a note |
| `/api/notes/search` | POST | Semantic search across notes |
| `/api/folders` | GET | List folders |
| `/api/folders` | POST | Create a folder |
| `/api/chat` | POST | RAG chat (streaming) |
| `/api/insights/mood-timeline` | GET | Mood scores over time |
| `/api/insights/topics` | GET | Topic frequency counts |

---

## Database Schema

### `notes` table

```sql
CREATE TABLE notes (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title         VARCHAR NOT NULL,
  content       TEXT,
  folder_id     UUID REFERENCES folders(id),
  analysis_disabled BOOLEAN DEFAULT false,
  embedding     vector(1536),       -- OpenAI text-embedding-ada-002
  created_at    TIMESTAMPTZ,
  updated_at    TIMESTAMPTZ
);
```

### `folders` table

```sql
CREATE TABLE folders (
  id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name      VARCHAR NOT NULL,
  parent_id UUID REFERENCES folders(id),  -- self-referential for nesting
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

### `note_metadata` table

```sql
CREATE TABLE note_metadata (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  note_id        UUID UNIQUE REFERENCES notes(id),
  mood_score     FLOAT,          -- 1 (very negative) to 10 (very positive)
  arousal        VARCHAR(20),    -- calm | energised | tense | neutral
  emotion_label  VARCHAR(50),    -- joy | sadness | anxiety | anger | gratitude | frustration | neutral
  topics         JSONB,          -- ["work", "family", "sleep"]
  summary        TEXT,           -- one-sentence description
  da_reflection  TEXT,           -- devil's advocate challenge
  embedding      vector(1536),   -- embedding of the note content
  analysed_at    TIMESTAMPTZ,
  created_at     TIMESTAMPTZ,
  updated_at     TIMESTAMPTZ
);
```

**Key design decisions:**
- `note_metadata` is a separate table (not columns on `notes`) so that analysis results can be updated independently without touching the user's content.
- `note_id` has a `UNIQUE` constraint — one metadata row per note. The analyse endpoint uses `INSERT ... ON CONFLICT DO UPDATE` (upsert) so re-analysis always overwrites the previous result.
- Both `notes.embedding` and `note_metadata.embedding` store 1536-dim vectors. `notes.embedding` is used for RAG chat (find notes similar to user question). `note_metadata.embedding` is reserved for future per-metadata semantic queries.

---

## Complete Code: Key Files

### `lib/db/index.js` — Database setup

```js
import { Sequelize } from "sequelize"
import pg from "pg"
import { notes } from "./models/Note.model"
import { folders } from "./models/Folder.model"
import { noteMetadata } from "./models/NoteMetadata.model"

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  logging: false,
  dialect: 'postgres',
  dialectModule: pg,
})

const models = {
  Folders: folders(sequelize),
  Notes: notes(sequelize),
  NoteMetadata: noteMetadata(sequelize),
}

// Associations define relationships (used by Sequelize for JOIN queries)
models.Notes.belongsTo(models.Folders, { foreignKey: 'folder_id', as: 'folder' })
models.Folders.hasMany(models.Notes, { foreignKey: 'folder_id', as: 'notes' })
models.Folders.belongsTo(models.Folders, { as: 'parent', foreignKey: 'parent_id' })
models.Folders.hasMany(models.Folders, { as: 'children', foreignKey: 'parent_id' })
models.NoteMetadata.belongsTo(models.Notes, { foreignKey: 'note_id', as: 'note' })
models.Notes.hasOne(models.NoteMetadata, { foreignKey: 'note_id', as: 'metadata' })

async function initDb() {
  await sequelize.authenticate()
  await sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
  await sequelize.query('CREATE EXTENSION IF NOT EXISTS vector;')
  await sequelize.sync({ force: false })  // creates tables if they don't exist
  // pgvector columns can't be added via Sequelize DataTypes — raw SQL needed
  await sequelize.query(`ALTER TABLE notes ADD COLUMN IF NOT EXISTS embedding vector(1536);`)
  await sequelize.query(`ALTER TABLE note_metadata ADD COLUMN IF NOT EXISTS embedding vector(1536);`)
}

await initDb()  // runs on module import (Next.js imports this on first request)

export const db = { ...models, sequelize, Sequelize }
```

### `app/api/chat/route.js` — RAG Chat

```js
import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"
import { generateEmbedding } from "@/lib/ai/generate-embedding"
import { Pool } from "pg"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function POST(req) {
  const { messages, noteIDs } = await req.json()

  const userQuestion = messages[messages.length - 1]?.content || ""

  // Step 1: Find relevant notes via vector similarity
  let context = ""
  if (noteIDs?.length > 0 && userQuestion) {
    context = await createContext(userQuestion, noteIDs)
  }

  // Step 2: Inject context into the last message
  const enhancedMessages = [...messages]
  if (context) {
    enhancedMessages[enhancedMessages.length - 1] = {
      ...messages[messages.length - 1],
      content: `Context from notes: ${context}\n\nQuestion: ${userQuestion}`
    }
  }

  // Step 3: Stream response from GPT-4o-mini
  const result = await streamText({
    model: openai("gpt-4o-mini"),
    messages: enhancedMessages,
    system: "You are a helpful assistant. Use the provided context from notes to answer accurately."
  })

  return result.toDataStreamResponse()
}

async function createContext(question, noteIDs) {
  const client = await pool.connect()
  try {
    const questionEmbedding = await generateEmbedding(question)
    const embeddingVector = `[${questionEmbedding.join(',')}]`

    // pgvector cosine distance query — only within the selected noteIDs
    const result = await client.query(`
      SELECT id, content, (1 - (embedding <=> $1::vector)) AS similarity
      FROM notes
      WHERE id = ANY($2)
      ORDER BY embedding <=> $1::vector
      LIMIT 3
    `, [embeddingVector, noteIDs])

    // Filter by similarity threshold — below 0.75 is probably irrelevant
    return result.rows
      .filter(note => note.similarity > 0.75)
      .map(note => note.content)
      .join('\n\n')
  } finally {
    client.release()  // always return connection to pool
  }
}
```

### `app/api/notes/[id]/analyse/route.js` — AI Analysis Pipeline

```js
export async function POST(req, { params }) {
  const { id } = await params
  const client = await pool.connect()
  try {
    const { rows } = await client.query(
      'SELECT id, title, content, analysis_disabled FROM notes WHERE id = $1', [id]
    )
    if (!rows.length) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const note = rows[0]
    if (note.analysis_disabled) return NextResponse.json({ skipped: true })

    // Minimum length check — don't waste API calls on short notes
    const wordCount = (note.content || '').split(/\s+/).filter(Boolean).length
    if (wordCount < 50) return NextResponse.json({ skipped: true, reason: 'too_short' })

    // Step 1: Extract structured metadata (mood, emotion, topics, summary)
    const extracted = await extractNoteMetadata(note.content)

    // Step 2: Run DA reflection + embedding in parallel (saves latency)
    const [daReflection, embeddingRaw] = await Promise.all([
      generateDaReflection(note.content, extracted.topics),
      generateEmbedding(note.content).catch(() => null),  // embedding failure is non-fatal
    ])

    const embeddingVector = embeddingRaw ? `[${embeddingRaw.join(',')}]` : null

    // Step 3: Upsert — insert new or update existing metadata
    await client.query(`
      INSERT INTO note_metadata
        (note_id, mood_score, arousal, emotion_label, topics, summary, da_reflection, embedding, analysed_at)
      VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7, $8::vector, NOW())
      ON CONFLICT (note_id) DO UPDATE SET
        mood_score = EXCLUDED.mood_score,
        ...
        analysed_at = NOW()
    `, [id, extracted.mood_score, extracted.arousal, extracted.emotion_label,
        JSON.stringify(extracted.topics), extracted.summary, daReflection, embeddingVector])

    return NextResponse.json({ metadata: { ...extracted, da_reflection: daReflection } })
  } finally {
    client?.release()
  }
}
```

### `lib/ai/extract-note-metadata.js` — Structured AI Extraction

```js
import { generateObject } from 'ai'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'

const metadataSchema = z.object({
  mood_score: z.number().min(1).max(10),
  arousal: z.enum(['calm', 'energised', 'tense', 'neutral']),
  emotion_label: z.string(),
  topics: z.array(z.string()).max(5),
  summary: z.string(),
})

export async function extractNoteMetadata(content) {
  const { object } = await generateObject({
    model: openai('gpt-4o-mini'),
    schema: metadataSchema,      // AI SDK retries until output matches this schema
    system: `You are an empathetic journaling analyst. Analyse the emotional content.
mood_score is valence 1–10 (1=very negative, 10=very positive).
arousal: calm | energised | tense | neutral
emotion_label: primary emotion (joy, sadness, anxiety, anger, gratitude, frustration, neutral)
topics: up to 5 lowercase semantic themes (work, sleep, family, health)
summary: one sentence describing the entry's main subject and emotional tone.`,
    prompt: content,
  })
  return object
}
```

### `lib/ai/generate-embedding.js` — Vector Generation

```js
import { embed } from 'ai'
import { openai } from '@ai-sdk/openai'

const embeddingModel = openai.embedding('text-embedding-ada-002')  // 1536 dimensions

export async function generateEmbedding(text) {
  const { embedding } = await embed({ model: embeddingModel, value: text })
  return embedding  // number[] with 1536 elements
}
```

### `lib/ai/generate-da-reflection.js` — Devil's Advocate

```js
import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'

export async function generateDaReflection(content, topics = []) {
  const { text } = await generateText({
    model: openai('gpt-4o-mini'),
    system: `You are a thoughtful devil's advocate. The user just wrote a private journal entry.
Identify the single strongest assumption underlying their thinking and challenge it in 2–3 sentences.
Be direct but not harsh. Do not summarise — only challenge the assumption. Under 60 words.`,
    prompt: `${content}\n\nMain topics: ${topics.join(', ')}`,
    maxTokens: 120,
    temperature: 0.7,
  })
  return text.trim()
}
```

### `app/_components/plain-editor.jsx` — Debounced Editor with Fire-and-Forget Analysis

```js
'use client'
import { useState, useEffect, useRef, useCallback } from "react"
import { useFileContext } from "./files-context"

export default function PlainEditor() {
  const { selectedNoteId, setMetadata } = useFileContext()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [saveStatus, setSaveStatus] = useState('idle')
  const saveTimer = useRef(null)         // stores the debounce timer ID
  const currentNoteId = useRef(null)    // tracks which note is open (avoids stale closures)

  // Load note content when selection changes
  useEffect(() => {
    if (!selectedNoteId) return
    const rawId = selectedNoteId.replace('note-', '')
    currentNoteId.current = rawId
    fetch(`/api/notes/${rawId}`)
      .then(r => r.json())
      .then(({ note }) => {
        if (currentNoteId.current !== rawId) return  // user switched notes mid-fetch
        setTitle(note.title || '')
        setContent(note.content || '')
        setMetadata(null)
      })
  }, [selectedNoteId])

  const scheduleSave = useCallback((newTitle, newContent) => {
    clearTimeout(saveTimer.current)   // reset timer on every keystroke
    setSaveStatus('saving')
    saveTimer.current = setTimeout(async () => {
      // Save the note
      await fetch(`/api/notes/${currentNoteId.current}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle, content: newContent }),
      })
      setSaveStatus('saved')

      // Fire-and-forget: AI analysis runs without blocking UI
      fetch(`/api/notes/${currentNoteId.current}/analyse`, { method: 'POST' })
        .then(r => r.json())
        .then(data => { if (data.metadata) setMetadata(data.metadata) })
        .catch(() => {})
    }, 2000)  // wait 2 seconds after last keystroke
  }, [setMetadata])

  // ...render
}
```

### `app/_components/files-context.jsx` — Shared State via Context

```js
'use client'
import { createContext, useContext, useState } from "react"

const FileContext = createContext(null)

export function FileProvider({ children, sidebarMetadata, initialNoteId }) {
  const [selectedNoteId, setSelectedNoteId] = useState(initialNoteId || null)
  const [metadata, setMetadata] = useState(null)

  return (
    <FileContext.Provider value={{ sidebarMetadata, selectedNoteId, setSelectedNoteId, metadata, setMetadata }}>
      {children}
    </FileContext.Provider>
  )
}

export function useFileContext() {
  return useContext(FileContext)  // any child can call this to read/set state
}
```

### `app/_components/chat-panel.jsx` — Streaming Chat UI

```js
'use client'
import { useChat } from '@ai-sdk/react'
import { useFileContext } from './files-context'

export default function ChatPanel() {
  const { sidebarMetadata } = useFileContext()
  const [selectedFiles, setSelectedFiles] = useState([])

  const noteIDs = selectedFiles.map(f => f.id.replace('note-', ''))

  // useChat manages messages[], input, loading state, and streaming
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    body: { noteIDs },  // sent with every request — this is how the server knows which notes to search
  })

  // ...render chat messages + input form
}
```

---

## Data Flow: Full Journey of a User Action

### When a user types in the editor:

```
User types
  → handleContentChange fires on every keypress
  → scheduleSave is called, debounce timer resets
  → 2 seconds of silence...
  → PUT /api/notes/:id (save title + content to PostgreSQL via Sequelize)
  → setSaveStatus('saved') — user sees "Saved ✓"
  → fetch POST /api/notes/:id/analyse (fire-and-forget, not awaited)
      → extractNoteMetadata(content) via generateObject → GPT-4o-mini
      → generateDaReflection(content, topics) + generateEmbedding(content) → Promise.all
      → INSERT/UPDATE note_metadata row in PostgreSQL
      → returns { metadata: {...} }
  → setMetadata(data.metadata) — NoteMetadataPanel updates with new mood/emotion/topics
```

### When a user sends a chat message:

```
User selects notes from popover, types a question, hits Enter
  → useChat hook sends POST /api/chat with { messages, noteIDs }
  → Server receives request
  → generateEmbedding(userQuestion) → 1536-dim vector
  → pgvector query: SELECT notes WHERE id IN (noteIDs) ORDER BY cosine_distance LIMIT 3
  → filter: only keep notes with similarity > 0.75
  → inject matching note content into the last message as context
  → streamText({ model, messages }) → GPT-4o-mini
  → result.toDataStreamResponse() → token-by-token stream back to browser
  → useChat hook appends each token to the last assistant message in real time
```

---

## Environment Variables

```
DATABASE_URL=postgresql://user:password@localhost:5432/innerscript
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_BASE_URL=http://localhost:3000
ANALYSIS_ENABLED=true          # set to 'false' to disable all AI analysis
ANALYSE_MIN_WORD_COUNT=50      # minimum words before analysis runs
```

---

## Future Features (Planned)

### 1. Emotional Arc View
For long journal entries, score each paragraph independently and display a sparkline showing how the mood shifts across the entry. Useful for entries that start negative and end with resolution.

**Implementation:** Split `content` by `\n\n` (paragraphs). Call `extractNoteMetadata` for each paragraph chunk. Store per-paragraph scores as a JSONB array. Render as a Recharts sparkline component.

### 2. Weekly / Monthly AI Digest
Auto-generate a weekly summary: "This week you wrote 5 entries. Average mood: 6.2. Most common topics: work, sleep. Most frequent emotion: anxiety."

**Implementation:** A scheduled function (Vercel Cron Job) queries the last 7 days of `note_metadata`, aggregates the stats, passes them to `generateText`, stores the digest, and displays as a card on the Insights page.

### 3. Topic Relationship Graph
A force-directed graph showing which topics co-occur across entries. "Work" and "stress" cluster together; "family" and "gratitude" cluster together.

**Implementation:** Query `note_metadata.topics` for all entries. Build a co-occurrence matrix in JavaScript (for each pair of topics that appear in the same note, increment their edge weight). Render with D3.js force simulation or Recharts.

### 4. Note Semantic Search
A search bar that finds notes by meaning, not exact keywords. "Find notes where I was anxious about work" returns relevant entries even if they don't contain those exact words.

**Implementation:** Already scaffolded at `POST /api/notes/search`. Embed the search query, run pgvector cosine similarity across all `notes.embedding` values, return matches above 0.75 threshold.

### 5. Export
Export all notes as a zip of markdown files (one per note, dated). Export mood CSV for external analysis.

**Implementation:** `GET /api/export/notes` → reads all notes from PostgreSQL → uses `jszip` to build a zip file in memory → streams as a file download. For CSV: `GET /api/export/mood` → queries `note_metadata` joined with `notes.created_at` → builds a CSV string → returns as text/csv.

### 6. Therapist/Coach Mode
A time-limited, read-only dashboard link. Shows only mood timeline and topics — no raw note content. User generates the link explicitly.

**Implementation:** Create a `shared_sessions` table with a `token` (random UUID), `expires_at`, and `user_id`. `GET /api/shared/:token` validates expiry and returns only aggregated metadata. Separate read-only Insights page that works without FileProvider.

### 7. User Mood Override
Let users manually correct the AI-assigned mood score. Store both `ai_mood_score` and `user_mood_score`. Show user score on charts when available, fall back to AI score.

**Implementation:** Add `user_mood_score FLOAT` and `user_emotion_label VARCHAR` to `note_metadata`. Small override UI in the metadata panel (click the mood badge → input to enter correction → PATCH request).

---

## Patterns and Conventions

- **JSDoc instead of TypeScript.** The project uses `@param` and `@returns` JSDoc comments for type documentation.
- **snake_case for database columns** (`mood_score`, `folder_id`). camelCase for JavaScript variables (`moodScore`, `folderId`). The ORM maps between them.
- **`useRef` for mutable values that shouldn't trigger re-renders.** The debounce timer ID and current note ID are stored in refs, not state.
- **Connection pooling.** The `pg` Pool is created at module level (not per-request) and connections are always released in `finally` blocks.
- **No migration files.** `sequelize.sync({ force: false })` auto-creates tables on startup. pgvector columns are added via `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`. This is fine for local dev but would need proper migrations for production.
- **Server Components for data loading, Client Components for interactivity.** `app/Journal/page.jsx` is the boundary — it fetches everything and hands data down as props to Client Components via the FileProvider.
