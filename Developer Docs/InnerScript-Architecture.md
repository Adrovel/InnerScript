# InnerScript Architecture

Source material:
- `2026-Experimental-Ideas/35-innerscript-journaling-mood-tracker/Architecture.md`
- `2026-Experimental-Ideas/35-innerscript-journaling-mood-tracker/Features.md`
- `2026-Experimental-Ideas/35-innerscript-journaling-mood-tracker/Stack-and-Tools.md`
- Current active app code in `2026-Active-Projects/InnerScript/`

## Product Shape

InnerScript is a journaling insights app. The core loop is:

1. User writes private notes locally.
2. Notes are saved to PostgreSQL.
3. AI analysis extracts emotional and semantic metadata.
4. Embeddings make notes searchable by meaning.
5. Insights views turn journal history into patterns: mood, topics, recurring assumptions, emotional arcs, and weekly reflections.

The product should support two deployment modes:

| Mode | User | Storage | AI key | Distribution |
|---|---|---|---|---|
| Local open-source | Developer / privacy-focused user | Local PostgreSQL or SQLite-compatible future path | User-owned `OPENAI_API_KEY` or local-model adapter | GitHub clone, Docker Compose, local browser |
| Consumer hosted | Non-technical user | Hosted database per account | Platform-managed AI provider | Public web app with auth, billing, onboarding |

The open-source version should remain useful without cloud sync. The hosted version can add account sync, payments, backups, and device continuity later.

## Current App Architecture

```text
Browser
  /Journal page
    FileProvider
      AppSidebar
      PlainEditor
      RightRail
        NoteMetadataPanel
        ChatPanel
      CommandPalette

Next.js API routes
  /api/notes
  /api/notes/[id]
  /api/notes/[id]/analyse
  /api/notes/search
  /api/notes/today
  /api/folders
  /api/insights/mood-timeline
  /api/insights/topics
  /api/chat

Data and AI
  PostgreSQL + pgvector
  Sequelize models for notes, folders, note_metadata
  Raw pg queries for vector similarity
  Vercel AI SDK + OpenAI
```

## Core Data Flow

### Note Save and Analysis

```text
User edits note
  -> PlainEditor debounces for 2 seconds
  -> PUT /api/notes/[id]
  -> note content saved
  -> POST /api/notes/[id]/analyse fires in the background
  -> extractNoteMetadata() returns mood, arousal, emotion, topics, summary
  -> generateDaReflection() returns a short challenge/reflection
  -> generateEmbedding() returns vector embedding
  -> note_metadata upsert
  -> RightRail updates when metadata returns
```

Design rule: saving must never wait for AI. AI enriches the note after persistence succeeds.

### RAG Chat

```text
User selects one or more notes
  -> ChatPanel sends noteIDs with the message
  -> /api/chat embeds the latest question
  -> pgvector ranks selected notes by semantic similarity
  -> top matching note content becomes prompt context
  -> GPT-4o-mini streams the answer
```

Current limitation: chat only retrieves from selected notes. Later versions should support scoped retrieval: current note, folder, date range, all notes, or saved collection.

## Database Model

### `notes`

Stores user-written journal content.

Expected fields:
- `id`
- `title`
- `content`
- `folder_id`
- `analysis_disabled`
- `embedding`
- `createdAt`
- `updatedAt`

### `folders`

Stores nested organization.

Expected fields:
- `id`
- `name`
- `parent_id`
- `createdAt`
- `updatedAt`

### `note_metadata`

Stores AI-derived insights independently of the raw note.

Expected fields:
- `id`
- `note_id`
- `mood_score`
- `arousal`
- `emotion_label`
- `topics`
- `summary`
- `da_reflection`
- `embedding`
- `analysed_at`
- `createdAt`
- `updatedAt`

## Insight Architecture

The app should treat insights as derived data, not as replacement for the note. The note remains the source of truth; metadata can be regenerated.

Important insight types:

| Insight | Data source | Output |
|---|---|---|
| Mood timeline | `note_metadata.mood_score` by note date | Trend line and rolling average |
| Topic frequency | `note_metadata.topics` | Bar chart or compact tag list |
| Semantic search | `note_metadata.embedding` or `notes.embedding` | Ranked notes by meaning |
| Weekly digest | notes + metadata for date range | Summary, recurring topics, notable changes |
| Emotional arc | paragraph-level analysis | In-note sparkline or section highlights |
| Assumption map | Devil's Advocate extraction | Load-bearing beliefs and challenge prompts |

## Open-Source Requirements

The local version must be easy to run and easy to trust.

Required before announcing open source:

- One-command local bootstrap via Docker Compose.
- `.env.example` with every required variable.
- Seed/demo mode that does not require private journal content.
- Clear privacy docs explaining what leaves the machine.
- AI-disabled mode where the app still works as a plain journal.
- Export notes as Markdown.
- Export insights as CSV/JSON.
- No hidden hosted-only dependency in the core journaling path.

Recommended repo docs:

- `README.md`: product overview and quickstart.
- `docs/Local-Setup.md`: Docker, env vars, troubleshooting.
- `docs/Privacy.md`: data storage and AI calls.
- `docs/Architecture.md`: app structure, DB, AI flow.
- `docs/Contributing.md`: local dev and PR expectations.

## Hosted Consumer Requirements

Consumer mode should not leak into local-first complexity too early. Treat it as a deployment profile.

Required additions:

- Auth.
- Per-user database isolation.
- Billing/subscription gate for AI-heavy usage.
- Rate limiting on chat, embeddings, and analysis.
- Background job queue for weekly digests and large imports.
- Hosted backup/export.
- Account deletion and data export.

Recommended path:

1. Stabilize local single-user app.
2. Add clean service boundaries around analysis and retrieval.
3. Add auth and user ownership columns.
4. Add hosted billing/rate limits.
5. Launch hosted version while keeping local version maintained.

## Minimal UI Direction

InnerScript should feel like a quiet writing tool first and an insights dashboard second.

Principles:

- Default screen is the editor, not a marketing or analytics page.
- Sidebar and right rail should be collapsible.
- Use small labels, restrained icons, and dense but calm spacing.
- Insights should be scannable: charts, short summaries, and drill-downs.
- Avoid gamified streaks, bright emotional badges, and decorative cards.
- Do not overwhelm the writing surface with AI output.

