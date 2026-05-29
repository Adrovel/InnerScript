# InnerScript Improvement — Design Spec

**Date:** 2026-05-08
**Status:** Approved
**Approach:** B — Wire Gaps → Unified AI Intelligence Layer → Insights Dashboard
**Project path:** `2026-Active-Projects/InnerScript/` (inside the nested `2026-Projects/` repo)

---

## 1. Architecture Overview

Three sequential phases. No phase begins until the previous is manually verified.

```
Phase 1 — Wire the Gaps
  The scaffold is solid. APIs for notes/folders exist. RAG chat works.
  What's missing: PlainEditor doesn't load or save, sidebar actions are stubs,
  no GET list for notes, pgvector extension not initialized in initDb().

Phase 2 — Unified AI Intelligence Layer
  One AI analysis event per note save: mood metadata (structured, Zod) +
  Devil's Advocate reflection (prose). Single metadata panel in the UI.

Phase 3 — Insights Dashboard
  Mood timeline, topic frequency map, DA markers on the timeline.
```

---

## 2. Actual Codebase State (as of 2026-05-08)

| What | File | Status |
|---|---|---|
| `POST /api/notes` — create | `app/api/notes/route.js` | ✅ Done |
| `GET /api/notes/[id]` — fetch one | `app/api/notes/[id]/route.js` | ✅ Done |
| `PUT /api/notes/[id]` — update | `app/api/notes/[id]/route.js` | ✅ Done |
| `DELETE /api/notes/[id]` — delete | `app/api/notes/[id]/route.js` | ✅ Done |
| Folder CRUD | `app/api/folders/` | ✅ Done (assumed — verify) |
| RAG chat (pgvector + streamText) | `app/api/chat/route.js` | ✅ Done |
| DB init + Sequelize + models | `lib/db/index.js` | ✅ Done (uuid-ossp only — pgvector missing) |
| AppSidebar renders tree | `app/_components/app-sidebar.jsx` | ✅ Done |
| FileProvider context (selectedNoteId) | `app/_components/files-context.jsx` | ✅ Done |
| PlainEditor — UI shell | `app/_components/plain-editor.jsx` | ✅ Shell only |
| PlainEditor — loads note on select | `app/_components/plain-editor.jsx` | ❌ Missing |
| PlainEditor — debounced save | `app/_components/plain-editor.jsx` | ❌ Missing |
| `GET /api/notes` — list all | `app/api/notes/route.js` | ❌ Missing |
| Sidebar new file/folder actions | `app/_components/app-sidebar.jsx` | ❌ Stubs (console.log only) |
| pgvector extension init | `lib/db/index.js` | ❌ Not enabled in initDb() |

**DevilsAdvocate** is a separate Next.js TypeScript app at `2026-Projects/DevilsAdvocate/` with streaming debate API, fallacy detection, weakness report panel, and argument map stub — already functional. InnerScript will extract a lightweight version of its DA logic (reflection only, not full debate).

---

## 3. Phase 1 — Wire the Gaps

**Goal:** PlainEditor loads and saves notes. Sidebar creates files and folders. pgvector initialized. No new features.

### 3.1 PlainEditor — Load on Select

`plain-editor.jsx` reads `selectedNoteId` from `useFileContext()`. When it changes, fetch `GET /api/notes/[id]` and populate the title + content state.

```
useEffect(() => {
  if (!selectedNoteId) return
  fetch(`/api/notes/${selectedNoteId}`)
    .then(r => r.json())
    .then(({ note }) => {
      setTitle(note.name)
      setContent(note.content)
    })
}, [selectedNoteId])
```

### 3.2 PlainEditor — Debounced Save

On title or content change, debounce 2s, then `PUT /api/notes/[id]` with `{ name: title, content }`.

- Use a `useRef` timer for debouncing — no external library needed
- Only fire if `selectedNoteId` is non-null
- Show a subtle "Saved" flash in the top-right corner on success

### 3.3 `GET /api/notes` — List All

Add to `app/api/notes/route.js`:

```js
export async function GET() {
  // SELECT id, name, folder_id FROM notes ORDER BY created_at DESC
  // Returns flat list; sidebar tree already built by getExplorerData()
}
```

Used by sidebar refresh after create/delete.

### 3.4 Sidebar Actions — Wire Create

In `app-sidebar.jsx`, `handleSidebarAction` currently console.logs. Wire it:

- `newFile` → `POST /api/notes` with `{ name: 'Untitled Note', content: '' }` → refresh sidebar tree → select the new note in editor
- `newFolder` → `POST /api/folders` with `{ name: 'New Folder' }` → refresh sidebar tree

### 3.5 pgvector Extension

In `lib/db/index.js`, inside `initDb()`, add:

```js
await sequelize.query('CREATE EXTENSION IF NOT EXISTS vector;')
```

After the existing `uuid-ossp` line. This ensures pgvector is available for both the existing RAG chat and the upcoming note_metadata embeddings.

### Phase 1 Exit Criteria

1. Click a note in sidebar → editor loads its title and content
2. Edit the note, wait 2s → "Saved" appears; refresh page → content persists
3. Right-click sidebar → "New File" → untitled note appears in sidebar and opens in editor
4. `docker compose up -d --build` starts cleanly, no pgvector errors in logs

---

## 4. Phase 2 — Unified AI Intelligence Layer

### 4.1 Daily Note

On `/Journal` page load, call `GET /api/notes/today`:
- Queries for a note named with today's ISO date (e.g. `"2026-05-08"`)
- If found: sets it as selected in FileContext
- If not found: creates it via `POST /api/notes`, then selects it

### 4.2 Data Model

New table: `note_metadata`

```sql
CREATE TABLE note_metadata (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id         UUID NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  mood_score      FLOAT,
  arousal         VARCHAR(20),      -- calm | energised | tense | neutral
  emotion_label   VARCHAR(50),      -- joy | sadness | anxiety | anger | gratitude | frustration | neutral
  topics          JSONB,            -- string[] max 5
  summary         TEXT,
  da_reflection   TEXT,             -- 2–3 sentence devil's advocate challenge
  embedding       VECTOR(1536),     -- text-embedding-3-small
  analysed_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(note_id)
);

CREATE INDEX ON note_metadata (note_id);
CREATE INDEX ON note_metadata (analysed_at);
```

Sequelize model: `lib/db/models/NoteMetadata.model.js`
- `belongsTo` Note; Note `hasOne` NoteMetadata
- Add associations to `lib/db/index.js`

### 4.3 AI Pipeline

**Endpoint:** `POST /api/notes/[id]/analyse`
**Trigger:** PlainEditor fires this after debounced save — non-blocking (no await in editor)

**Skip conditions:**
- Note content < 50 words (`ANALYSE_MIN_WORD_COUNT=50` env var)
- Note has `analysis_disabled: true`
- `ANALYSIS_ENABLED=false` env var

**Two sequential calls:**

**Call 1 — Structured Metadata** (`lib/ai/extract-note-metadata.js`)
```
Model: gpt-4o-mini via generateObject (Vercel AI SDK)
Zod schema: { mood_score: number (1-10), arousal: enum, emotion_label: string,
              topics: string[] max 5, summary: string }
System prompt: "You are an empathetic journaling analyst. Analyse the emotional
  content of this journal entry. Return only JSON matching the schema.
  mood_score is valence 1–10 (1=very negative, 10=very positive). topics are
  lowercase semantic themes. summary is one sentence."
Error handling: catch → return null → metadata panel shows retry state
```

**Call 2 — Devil's Advocate Reflection** (`lib/ai/generate-da-reflection.js`)
```
Model: gpt-4o-mini via generateText
Input: note content + topics from Call 1
System prompt: "You are a thoughtful devil's advocate. The user just wrote a
  journal entry. Identify the single strongest assumption underlying their
  thinking and challenge it in 2–3 sentences. Be direct but not harsh.
  Do not summarise what they wrote — only challenge. Do not start with
  'I' or 'You wrote'."
Max tokens: 150 | Temperature: 0.7
Skip: if note mood_score > 8 (very positive entries, no challenge needed) — optional heuristic
```

**Call 3 — Embedding** (`lib/ai/generate-embedding.js`)
```
Model: text-embedding-3-small (OpenAI Embeddings API)
Returns: Float32Array (1536 dims)
```

All three results upserted into `note_metadata` after all calls complete.

**Cost per note:** ~$0.003–$0.005 at current gpt-4o-mini pricing.

### 4.4 Metadata Panel UI

Component: `app/_components/note-metadata-panel.jsx`
Position: rendered inside `Journal/page.jsx` as a right panel beside the editor

**States:**

| State | UI |
|---|---|
| No note selected | Hidden |
| Note < 50 words | "Write more to unlock AI analysis (need 50+ words)" |
| Analysis pending | Spinner — "Analysing..." |
| Analysis complete | Full panel (below) |
| Analysis failed | Last cached result + "Retry" button |
| Analysis disabled | "Analysis off" toggle to re-enable |

**Panel layout:**

```
┌──────────────────────────────────┐
│ Mood  [●●●●●●○○○○]  6/10         │  ← colour bar: red→yellow→green
│ anxious · tense                  │  ← emotion_label + arousal
│                                  │
│ work  sleep  family              │  ← topic chips (clickable)
│                                  │
│ "About a difficult conversation  │  ← summary italic
│  at work."                       │
│                                  │
│ ─── Devil's Advocate ───         │
│ "You're framing this as your     │  ← da_reflection prose
│  manager's failure, but the same │
│  facts could read as a           │
│  miscommunication you both       │
│  contributed to."                │
│                                  │
│ Analysed 3m ago · ↺ Re-analyse   │
└──────────────────────────────────┘
```

Per-note toggle: disable analysis for this note (stored as `analysis_disabled` boolean on the Note model).

### 4.5 Semantic Search

`POST /api/notes/search`:
- Embeds query via text-embedding-3-small
- pgvector cosine similarity against `note_metadata.embedding`, threshold 0.75
- Falls back to `ILIKE %query%` on note name/content if below threshold
- Returns top-10, ranked by similarity with score badge in sidebar

---

## 5. Phase 3 — Insights Dashboard

Route: `/Journal/insights` | Nav link: "Insights" in sidebar footer

### 5.1 Mood Timeline

`GET /api/insights/mood-timeline?start=&end=`

Recharts `LineChart` — two series: raw `mood_score` + 7-day rolling average. Clickable points navigate to that day's note. DA markers: `◆` dot above points where `da_reflection IS NOT NULL` — clicking opens the note with metadata panel expanded.

### 5.2 Topic Frequency

`GET /api/insights/topics?start=&end=&limit=20`

SQL: `jsonb_array_elements_text(topics)` unnested, grouped by value, counted. Recharts `BarChart`. Clicking a bar filters the sidebar note list to that topic.

### 5.3 Inner Map

Tag cloud of all topics across all entries, font-size proportional to count. Same click-to-filter behaviour.

### 5.4 Empty / Loading States

| Condition | UI |
|---|---|
| 0 entries analysed | "Save and analyse 3 entries to see insights" |
| 1–2 entries | Progress: "2 of 3 entries needed for mood trends" |
| Loading | Tailwind skeleton pulse |
| API error | Error card with retry |

---

## 6. Error Handling

| Failure | Behaviour |
|---|---|
| OpenAI API error | Note saves. Panel shows last cached result + "Retry" |
| No OPENAI_API_KEY | App-level banner: "Add OPENAI_API_KEY to .env.local to enable AI." Editor works without AI. |
| pgvector missing | DB init logs error; semantic search disabled, falls back to full-text |
| DA reflection < 20 chars | Suppress DA section — don't show a broken challenge |
| Analyse called on < 50 words | Return 200 with `{ skipped: true }` — panel shows minimum word count notice |

---

## 7. Out of Scope

| Feature | Reason |
|---|---|
| Full DA debate loop (multi-turn) | Full debate UX lives in the separate DevilsAdvocate app. InnerScript gets reflection only. |
| Emotional arc per paragraph | Post-MVP. Requires paragraph-level analysis. |
| Weekly digest | Post-MVP. Needs scheduling. |
| Therapist shareable link | Post-MVP. Needs auth design. |
| User mood score override | Post-MVP. Needs usage data first. |
| Rich text / WYSIWYG | Markdown textarea is sufficient. |

---

## 8. File Map

```
lib/
├── ai/
│   ├── extract-note-metadata.js       ← new: generateObject + Zod (Call 1)
│   ├── generate-da-reflection.js      ← new: generateText DA prose (Call 2)
│   └── generate-embedding.js          ← new: text-embedding-3-small (Call 3)
├── db/
│   ├── index.js                       ← add: vector extension + NoteMetadata associations
│   └── models/
│       └── NoteMetadata.model.js      ← new

app/
├── api/
│   ├── notes/
│   │   ├── route.js                   ← add: GET list
│   │   ├── today/route.js             ← new: GET /api/notes/today
│   │   └── search/route.js            ← new: POST semantic search
│   ├── notes/[id]/
│   │   ├── route.js                   ← existing GET/PUT/DELETE ✅
│   │   └── analyse/route.js           ← new: POST trigger analysis
│   └── insights/
│       ├── mood-timeline/route.js     ← new
│       └── topics/route.js            ← new
├── Journal/
│   ├── page.jsx                       ← add: GET /api/notes/today on mount, metadata panel
│   └── insights/
│       └── page.jsx                   ← new: Insights Dashboard route
├── _components/
│   ├── plain-editor.jsx               ← wire: load on select, debounced save, trigger analyse
│   ├── app-sidebar.jsx                ← wire: newFile/newFolder actions
│   ├── note-metadata-panel.jsx        ← new: unified mood + DA panel
│   └── insights/
│       ├── mood-timeline-chart.jsx    ← new
│       └── topic-frequency-chart.jsx  ← new
```

---

## 9. Environment Variables

```bash
OPENAI_API_KEY=               # required for AI features
DATABASE_URL=                 # PostgreSQL connection string (already in .env.local)
ANALYSIS_ENABLED=true         # global toggle
ANALYSE_MIN_WORD_COUNT=50     # skip analysis below this word count
```

---

## 10. Build Sequence

```
Phase 1 — Wire Gaps (~3–5 days)
  1. pgvector extension in initDb()
  2. PlainEditor: useEffect load on selectedNoteId change
  3. PlainEditor: debounced PUT save + "Saved" indicator
  4. GET /api/notes list endpoint
  5. Sidebar newFile/newFolder wired to API + sidebar refresh
  ✓ Manual QA: select note loads, edit saves, create note works

Phase 2 — AI Layer (~1–2 weeks)
  1. NoteMetadata model + DB sync
  2. lib/ai/ three files
  3. POST /api/notes/[id]/analyse
  4. GET /api/notes/today
  5. PlainEditor fires analyse post-save (non-blocking)
  6. note-metadata-panel.jsx
  7. POST /api/notes/search
  ✓ Manual QA: write 100-word note, save, panel populates within ~5s

Phase 3 — Insights (~1 week)
  1. GET /api/insights/mood-timeline + topics
  2. Chart components + /Journal/insights page
  3. Sidebar "Insights" nav link
  ✓ Manual QA: 7 dated notes across different moods, chart renders correctly
```
