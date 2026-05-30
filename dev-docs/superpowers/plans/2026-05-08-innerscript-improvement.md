# InnerScript Improvement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire the existing InnerScript skeleton into a working journaling app, then add a unified AI intelligence layer (mood extraction + Devil's Advocate reflection per note), then build an insights dashboard.

**Architecture:** Three sequential phases — fix bugs + wire editor gaps, add AI analysis pipeline (two sequential AI calls per save producing a single metadata panel), then build Recharts-based insights. All new AI calls use `generateObject`/`generateText` from Vercel AI SDK v5.

**Tech Stack:** Next.js 16, React 19, Sequelize 6, PostgreSQL + pgvector, Vercel AI SDK v5 (`ai@5`), `@ai-sdk/openai@2`, Zod 4, Recharts, Tailwind 4, shadcn/ui

**Project root:** `2026-Active-Projects/InnerScript/` (relative to workspace root)

**All file paths below are relative to:** `2026-Active-Projects/InnerScript/`

---

## Pre-existing Bugs (fixed in Phase 1 before any new features)

| Bug | Location | Fix |
|---|---|---|
| Notes API uses `name` column but Sequelize created `title` | `app/api/notes/` | Change all raw SQL `name` → `title` |
| Folders API uses `parent_folder_id` but Sequelize created `parent_id` | `app/api/folders/route.js` | Change raw SQL `parent_folder_id` → `parent_id` |
| `generateEmbedding` imported from `lib/utils.js` but not defined there | `app/api/chat/route.js` | Move to `lib/ai/generate-embedding.js`, fix import |
| Docker maps `5433:5433` but Postgres listens on `5432` | `docker-compose.yml` | Change to `5433:5432`; update DATABASE_URL to `db:5432` |
| Note model has `folder_id` NOT NULL but create API doesn't pass it | `lib/db/models/Note.model.js` | Make `folder_id` nullable |
| pgvector extension never initialized | `lib/db/index.js` | Add `CREATE EXTENSION IF NOT EXISTS vector` to `initDb()` |
| `notes` table has no `embedding` column (needed by RAG chat) | `lib/db/index.js` | Add `ALTER TABLE notes ADD COLUMN IF NOT EXISTS embedding vector(1536)` |

---

## Phase 1 — Fix Bugs & Wire the Editor

### Task 1: Fix Docker + Database Connection

**Files:**
- Modify: `docker-compose.yml`
- Modify: `.env.local`

- [ ] **Step 1: Fix docker-compose port mapping**

Open `docker-compose.yml`. The `db` service has `ports: ["5433:5433"]`. PostgreSQL inside the container listens on `5432` by default. The mapping should expose host port `5433` → container port `5432`.

Change the `db` service:
```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports: ["3000:3000"]
    env_file: .env.local
    depends_on:
      db:
        condition: service_healthy
    volumes:
      - .:/app
      - /app/node_modules
    mem_limit: 1g
    restart: unless-stopped

  db:
    image: postgres:18-alpine
    ports: ["5433:5432"]
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=InnerScript123#
      - POSTGRES_DB=innerscript
    volumes:
      - postgres_data:/var/lib/postgresql/data
    mem_limit: 256m
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

volumes:
  postgres_data:
```

- [ ] **Step 2: Fix DATABASE_URL**

The app container connects to `db` (the Docker service name) on the container's internal port `5432`:

In `.env.local`:
```
DATABASE_URL="postgresql://postgres:InnerScript123%23@db:5432/innerscript"
OPENAI_API_KEY="your-key-here"
ANALYSIS_ENABLED="true"
ANALYSE_MIN_WORD_COUNT="50"
```

- [ ] **Step 3: Restart Docker and verify connection**

```bash
cd 2026-Active-Projects/InnerScript
docker compose down
docker compose up -d --build
docker compose logs app | grep -E "Database|Error"
```

Expected output: `Database connection established successfully.` and `Database synchronized`

---

### Task 2: Fix DB Initialization (pgvector + embedding column)

**Files:**
- Modify: `lib/db/index.js`

- [ ] **Step 1: Add pgvector and embedding column to initDb**

```js
import { Sequelize } from "sequelize"
import pg from "pg"

import { notes } from "./models/Note.model"
import { folders } from "./models/Folder.model"

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  logging: false,
  dialect: 'postgres',
  dialectModule: pg,
})

const models = {
  Folders: folders(sequelize),
  Notes: notes(sequelize),
}

models.Notes.belongsTo(models.Folders, { foreignKey: 'folder_id', as: 'folder' })
models.Folders.hasMany(models.Notes, { foreignKey: 'folder_id', as: 'notes' })
models.Folders.belongsTo(models.Folders, { as: 'parent', foreignKey: 'parent_id' })
models.Folders.hasMany(models.Folders, { as: 'children', foreignKey: 'parent_id' })

async function initDb() {
  try {
    await sequelize.authenticate()
    console.log("Database connection established successfully.")

    await sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
    await sequelize.query('CREATE EXTENSION IF NOT EXISTS vector;')

    await sequelize.sync({ force: false })
    console.log("Database synchronized")

    // Add embedding column to notes if it doesn't exist (pgvector type)
    await sequelize.query(`
      ALTER TABLE notes ADD COLUMN IF NOT EXISTS embedding vector(1536);
    `)
    console.log("Notes embedding column ready")
  } catch (error) {
    console.error("Unable to connect to the database:", error)
  }
}

await initDb()

export const db = {
  ...models,
  sequelize,
  Sequelize,
}
```

- [ ] **Step 2: Restart Docker and verify no errors**

```bash
docker compose down && docker compose up -d --build
docker compose logs app | grep -E "Extension|synchronized|embedding|Error"
```

Expected: `Database connection established successfully.` + `Database synchronized` + `Notes embedding column ready`

---

### Task 3: Fix Note Model + Schema Bugs

**Files:**
- Modify: `lib/db/models/Note.model.js`
- Modify: `app/api/notes/route.js`
- Modify: `app/api/notes/[id]/route.js`
- Modify: `app/api/folders/route.js`

- [ ] **Step 1: Make folder_id nullable in Note model**

```js
import { DataTypes } from "sequelize";

export const notes = (sequelize) => {
  return sequelize.define(
    "Note",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      folder_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      analysis_disabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      timestamps: true,
      tableName: "notes",
      schema: "public",
    },
  );
};
```

- [ ] **Step 2: Fix POST /api/notes — use `title` not `name`**

```js
import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function GET() {
  try {
    const client = await pool.connect()
    const result = await client.query(
      'SELECT id, title, folder_id, "createdAt" FROM notes ORDER BY "createdAt" DESC'
    )
    client.release()
    return NextResponse.json({ notes: result.rows })
  } catch (err) {
    console.error('Error fetching notes:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const { title, content, folder_id } = await req.json()
    const client = await pool.connect()
    const res = await client.query(
      `INSERT INTO notes (title, content, folder_id)
       VALUES ($1, $2, $3)
       RETURNING id, title, content, folder_id`,
      [title || 'Untitled Note', content || '', folder_id || null]
    )
    client.release()
    return NextResponse.json({ note: res.rows[0] }, { status: 201 })
  } catch (err) {
    console.error('Error creating note:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
```

- [ ] **Step 3: Fix GET/PUT/DELETE /api/notes/[id] — use `title` not `name`**

```js
import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function GET(req, { params }) {
  try {
    const { id } = await params
    const client = await pool.connect()
    const result = await client.query(
      'SELECT id, title, content, folder_id, analysis_disabled FROM notes WHERE id = $1',
      [id]
    )
    client.release()
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    }
    return NextResponse.json({ note: result.rows[0] })
  } catch (err) {
    console.error('Error fetching note:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params
    const { title, content } = await req.json()
    const client = await pool.connect()
    const res = await client.query(
      `UPDATE notes SET title = $1, content = $2, "updatedAt" = NOW()
       WHERE id = $3
       RETURNING id, title, content`,
      [title, content, id]
    )
    client.release()
    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    }
    return NextResponse.json({ note: res.rows[0] })
  } catch (err) {
    console.error('Error updating note:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params
    const client = await pool.connect()
    const res = await client.query(
      'DELETE FROM notes WHERE id = $1 RETURNING id',
      [id]
    )
    client.release()
    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    }
    return NextResponse.json({ message: 'Note deleted' })
  } catch (err) {
    console.error('Error deleting note:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
```

- [ ] **Step 4: Fix folders API — use `parent_id` not `parent_folder_id`**

```js
import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function GET() {
  try {
    const client = await pool.connect()
    const result = await client.query(
      'SELECT id, name, parent_id FROM folders ORDER BY "createdAt" DESC'
    )
    client.release()
    return NextResponse.json({ folders: result.rows })
  } catch (err) {
    console.error('Error fetching folders:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const { name, parent_id } = await req.json()
    const client = await pool.connect()
    const res = await client.query(
      `INSERT INTO folders (name, parent_id) VALUES ($1, $2) RETURNING id, name`,
      [name || 'New Folder', parent_id || null]
    )
    client.release()
    return NextResponse.json({ folder: res.rows[0] }, { status: 201 })
  } catch (err) {
    console.error('Error creating folder:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
```

- [ ] **Step 5: Fix action.js sidebar tree — `note.title` is correct, but note ID needs no prefix**

The sidebar uses `id: \`note-${note.id}\`` for notes. PlainEditor will strip this prefix when fetching. No change needed here — just confirming the pattern is intentional.

---

### Task 4: Fix generateEmbedding + Chat Route

**Files:**
- Create: `lib/ai/generate-embedding.js`
- Modify: `app/api/chat/route.js`
- Delete concept: `lib/temp_embedgen.js` (leave the file, just stop using it)

- [ ] **Step 1: Create `lib/ai/generate-embedding.js`**

```js
import { embed } from 'ai'
import { openai } from '@ai-sdk/openai'

const embeddingModel = openai.embedding('text-embedding-ada-002')

/**
 * Generate a 1536-dim embedding for the given text.
 * @param {string} text
 * @returns {Promise<number[]>}
 */
export async function generateEmbedding(text) {
  const { embedding } = await embed({
    model: embeddingModel,
    value: text,
  })
  return embedding
}
```

- [ ] **Step 2: Fix the import in `app/api/chat/route.js`**

Change line 4:
```js
import { generateEmbedding } from "@/lib/ai/generate-embedding"
```

- [ ] **Step 3: Verify chat route works end-to-end**

```bash
docker compose logs app | grep -v "^\s*$" | tail -20
```

No import errors expected.

---

### Task 5: Wire PlainEditor — Load + Debounced Save

**Files:**
- Modify: `app/_components/plain-editor.jsx`
- Modify: `app/_components/files-context.jsx`

- [ ] **Step 1: Update FileProvider to expose `refreshSidebar`**

The sidebar tree is server-rendered in `Journal/page.jsx` via `getExplorerData()`. To refresh it after creating a note/folder, use `router.refresh()` from Next.js. Add a `noteLoaded` state for tracking load status.

```js
'use client'

import { createContext, useContext, useState, useCallback } from "react"

const FileContext = createContext(null)

export function FileProvider({ children, sidebarMetadata }) {
  const [selectedNoteId, setSelectedNoteId] = useState(null)
  const [metadata, setMetadata] = useState(null)

  const value = {
    sidebarMetadata,
    selectedNoteId,
    setSelectedNoteId,
    metadata,
    setMetadata,
  }

  return (
    <FileContext.Provider value={value}>
      {children}
    </FileContext.Provider>
  )
}

export function useFileContext() {
  const context = useContext(FileContext)
  if (!context) throw new Error('useFileContext must be used within a FileProvider')
  return context
}
```

- [ ] **Step 2: Wire PlainEditor with load + debounced save**

The note IDs in the sidebar tree are prefixed with `note-` (e.g. `note-550e8400-...`). Strip this prefix before calling the API.

```js
'use client'

import { useState, useEffect, useRef } from "react"
import { useFileContext } from "./files-context"

export default function PlainEditor() {
  const { selectedNoteId, setMetadata } = useFileContext()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [saveStatus, setSaveStatus] = useState('idle') // idle | saving | saved | error
  const saveTimer = useRef(null)
  const currentNoteId = useRef(null)

  // Load note when selection changes
  useEffect(() => {
    if (!selectedNoteId) {
      setTitle('')
      setContent('')
      setMetadata(null)
      return
    }

    const rawId = selectedNoteId.replace('note-', '')
    currentNoteId.current = rawId
    setSaveStatus('idle')

    fetch(`/api/notes/${rawId}`)
      .then(r => r.json())
      .then(({ note }) => {
        if (currentNoteId.current !== rawId) return // stale response
        setTitle(note.title || '')
        setContent(note.content || '')
        setMetadata(null) // reset metadata panel for new note
      })
      .catch(() => setSaveStatus('error'))
  }, [selectedNoteId, setMetadata])

  // Debounced save — fires 2s after last keystroke
  const scheduleSave = useCallback((newTitle, newContent) => {
    if (!currentNoteId.current) return
    clearTimeout(saveTimer.current)
    setSaveStatus('saving')
    saveTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/notes/${currentNoteId.current}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: newTitle, content: newContent }),
        })
        if (!res.ok) throw new Error('Save failed')
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus('idle'), 2000)

        // Trigger AI analysis (non-blocking — don't await)
        fetch(`/api/notes/${currentNoteId.current}/analyse`, { method: 'POST' })
          .then(r => r.json())
          .then(data => { if (data.metadata) setMetadata(data.metadata) })
          .catch(() => {}) // analysis failure is non-fatal
      } catch {
        setSaveStatus('error')
      }
    }, 2000)
  }, [setMetadata])

  const handleTitleChange = (e) => {
    setTitle(e.target.value)
    scheduleSave(e.target.value, content)
  }

  const handleContentChange = (e) => {
    setContent(e.target.value)
    scheduleSave(title, e.target.value)
  }

  return (
    <div className="flex flex-col h-full bg-background relative">
      {/* Save indicator */}
      {saveStatus !== 'idle' && (
        <span className="absolute top-3 right-4 text-xs text-muted-foreground">
          {saveStatus === 'saving' && 'Saving...'}
          {saveStatus === 'saved' && 'Saved'}
          {saveStatus === 'error' && 'Save failed'}
        </span>
      )}
      <input
        type="text"
        value={title}
        onChange={handleTitleChange}
        placeholder="Untitled Note"
        className="text-4xl font-semibold py-3 outline-none bg-background px-12"
      />
      <textarea
        value={content}
        onChange={handleContentChange}
        placeholder="Start writing..."
        className="flex-1 w-full resize-none px-12 py-4 rounded-md text-lg outline-none font-sans bg-transparent h-full"
      />
    </div>
  )
}
```

- [ ] **Step 3: Manual test**

```
1. docker compose up -d
2. Open http://localhost:3000/Journal
3. Click a note in sidebar → verify title + content load into editor
4. Edit the content → wait 2s → "Saved" appears
5. Refresh page → click same note → content persists
```

---

### Task 6: Wire Sidebar — Create Note + Folder

**Files:**
- Modify: `app/_components/app-sidebar.jsx`

- [ ] **Step 1: Wire sidebar actions to API + refresh**

Use `useRouter` from Next.js to call `router.refresh()` after creating a note/folder so the server component re-fetches the sidebar tree.

```js
'use client'

import { useRouter } from 'next/navigation'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar"
import { useFileContext } from "./files-context"
import { TreeItem } from "./tree-item"
import { ResuableContextMenu } from './resuable-context-menu'

export function AppSidebar() {
  const router = useRouter()
  const { sidebarMetadata, selectedNoteId, setSelectedNoteId } = useFileContext()

  const handleSidebarAction = async (action) => {
    if (action === 'newFile') {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Untitled Note', content: '' }),
      })
      const { note } = await res.json()
      router.refresh()
      setSelectedNoteId(`note-${note.id}`)
    }

    if (action === 'newFolder') {
      await fetch('/api/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'New Folder' }),
      })
      router.refresh()
    }
  }

  return (
    <Sidebar className="border-border">
      <SidebarHeader>
        <h2 className="text-2xl font-serif p-2">Notes</h2>
      </SidebarHeader>
      <ResuableContextMenu
        menuType="sidebarEmpty"
        onAction={handleSidebarAction}
      >
        <SidebarContent className="p-2">
          <SidebarMenu>
            {sidebarMetadata.map(item => (
              <TreeItem
                key={item.id}
                item={item}
                onSelectNote={setSelectedNoteId}
                selectedNoteId={selectedNoteId}
              />
            ))}
          </SidebarMenu>
        </SidebarContent>
      </ResuableContextMenu>
      <SidebarFooter />
    </Sidebar>
  )
}
```

- [ ] **Step 2: Manual test**

```
1. Right-click sidebar empty area → "New File"
2. Untitled Note appears in sidebar and opens in editor
3. Right-click sidebar → "New Folder"
4. New Folder appears in sidebar
```

---

### Task 7: Connect Chat Panel to AI

**Files:**
- Modify: `app/_components/chat-panel.jsx`

- [ ] **Step 1: Replace hardcoded messages with useChat hook**

```js
'use client'

import { useRef, useEffect } from 'react'
import { useChat } from '@ai-sdk/react'
import { useFileContext } from './files-context'
import { Button } from '@/components/ui/button'
import { PopoverMenu } from './chat-popover-menu'
import { Send } from 'lucide-react'
import { useState } from 'react'

function flattenFiles(items) {
  const files = []
  items.forEach(item => {
    if (item.type === 'note') files.push(item)
    else if (item.children) files.push(...flattenFiles(item.children))
  })
  return files
}

export default function ChatPanel() {
  const { sidebarMetadata } = useFileContext()
  const flattenedFiles = flattenFiles(sidebarMetadata || [])
  const [selectedFiles, setSelectedFiles] = useState([])
  const messagesEndRef = useRef(null)

  const noteIDs = selectedFiles.map(f => f.id.replace('note-', ''))

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    body: { noteIDs },
  })

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <aside className="h-screen min-w-[350px] flex flex-col bg-sidebar border-l border-border">
      <div className="p-4">
        <h2 className="text-2xl font-serif">Chat</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <p className="text-sm text-muted-foreground text-center mt-8">
            Select notes above and ask anything about them.
          </p>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`p-3 rounded-sm max-w-xs text-sm
                ${message.role === 'user'
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'bg-background text-foreground border border-border'
                }`}
            >
              {message.parts
                ? message.parts.map((p, i) => <span key={i}>{p.type === 'text' ? p.text : ''}</span>)
                : message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-2 space-y-2 border border-border rounded-2xl bg-background m-2">
        <textarea
          value={input}
          onChange={handleInputChange}
          placeholder="Ask about your notes..."
          className="w-full min-h-8 resize-none outline-none flex field-sizing-content max-h-32 text-sm"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSubmit(e)
            }
          }}
        />
        <div className="flex justify-between">
          <PopoverMenu
            options={flattenedFiles}
            selectedOptions={selectedFiles}
            setSelectedOptions={setSelectedFiles}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
            className="rounded-full bg-sidebar-primary text-sidebar-primary-foreground"
          >
            <Send size={16} />
          </Button>
        </div>
      </form>
    </aside>
  )
}
```

- [ ] **Step 2: Manual test**

```
1. Create a note with some content (e.g. "I'm feeling anxious about my job search")
2. Wait for save (Saved indicator)
3. In chat, select that note from the popover
4. Type "How am I feeling?" → send
5. Chat should stream a response based on the note content
```

---

## Phase 2 — Unified AI Intelligence Layer

### Task 8: NoteMetadata Sequelize Model

**Files:**
- Create: `lib/db/models/NoteMetadata.model.js`
- Modify: `lib/db/index.js`

- [ ] **Step 1: Create NoteMetadata model**

```js
import { DataTypes } from "sequelize"

export const noteMetadata = (sequelize) => {
  return sequelize.define(
    "NoteMetadata",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      note_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
      },
      mood_score: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      arousal: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      emotion_label: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      topics: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      summary: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      da_reflection: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      analysed_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      tableName: "note_metadata",
      schema: "public",
    }
  )
}
```

- [ ] **Step 2: Add NoteMetadata to db/index.js + associations + embedding column**

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

models.Notes.belongsTo(models.Folders, { foreignKey: 'folder_id', as: 'folder' })
models.Folders.hasMany(models.Notes, { foreignKey: 'folder_id', as: 'notes' })
models.Folders.belongsTo(models.Folders, { as: 'parent', foreignKey: 'parent_id' })
models.Folders.hasMany(models.Folders, { as: 'children', foreignKey: 'parent_id' })
models.NoteMetadata.belongsTo(models.Notes, { foreignKey: 'note_id', as: 'note' })
models.Notes.hasOne(models.NoteMetadata, { foreignKey: 'note_id', as: 'metadata' })

async function initDb() {
  try {
    await sequelize.authenticate()
    console.log("Database connection established successfully.")

    await sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
    await sequelize.query('CREATE EXTENSION IF NOT EXISTS vector;')

    await sequelize.sync({ force: false })
    console.log("Database synchronized")

    await sequelize.query(`
      ALTER TABLE notes ADD COLUMN IF NOT EXISTS embedding vector(1536);
    `)

    await sequelize.query(`
      ALTER TABLE note_metadata ADD COLUMN IF NOT EXISTS embedding vector(1536);
    `)

    console.log("Schema ready")
  } catch (error) {
    console.error("Unable to connect to the database:", error)
  }
}

await initDb()

export const db = {
  ...models,
  sequelize,
  Sequelize,
}
```

- [ ] **Step 3: Restart Docker to apply schema**

```bash
docker compose down && docker compose up -d --build
docker compose logs app | grep -E "synchronized|Schema ready|Error"
```

Expected: `Database synchronized` + `Schema ready`

---

### Task 9: AI Extraction — Metadata + DA Reflection

**Files:**
- Modify: `lib/ai/generate-embedding.js` (already created in Task 4)
- Create: `lib/ai/extract-note-metadata.js`
- Create: `lib/ai/generate-da-reflection.js`

- [ ] **Step 1: Create `lib/ai/extract-note-metadata.js`**

Uses Vercel AI SDK v5 `generateObject` with Zod 4 schema.

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

/**
 * Extract structured emotional metadata from a journal entry.
 * @param {string} content - The note content
 * @returns {Promise<{mood_score, arousal, emotion_label, topics, summary}|null>}
 */
export async function extractNoteMetadata(content) {
  try {
    const { object } = await generateObject({
      model: openai('gpt-4o-mini'),
      schema: metadataSchema,
      system: `You are an empathetic journaling analyst. Analyse the emotional content
of this journal entry. mood_score is valence 1–10 (1=very negative, 10=very positive).
arousal is one of: calm, energised, tense, neutral.
emotion_label is the primary emotion (e.g. joy, sadness, anxiety, anger, gratitude, frustration, neutral).
topics are up to 5 lowercase semantic themes (e.g. work, sleep, family, health).
summary is one sentence describing the entry's main subject and emotional tone.
Return only valid JSON matching the schema.`,
      prompt: content,
    })
    return object
  } catch (err) {
    console.error('Metadata extraction failed:', err.message)
    return null
  }
}
```

- [ ] **Step 2: Create `lib/ai/generate-da-reflection.js`**

```js
import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'

/**
 * Generate a devil's advocate challenge for a journal entry.
 * @param {string} content - The note content
 * @param {string[]} topics - Topics extracted from the note
 * @returns {Promise<string|null>} 2–3 sentence challenge, or null on failure
 */
export async function generateDaReflection(content, topics = []) {
  try {
    const topicContext = topics.length > 0
      ? `The main topics are: ${topics.join(', ')}.`
      : ''

    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      system: `You are a thoughtful devil's advocate. The user just wrote a private journal entry.
Identify the single strongest assumption underlying their thinking and challenge it in 2–3 sentences.
Be direct but not harsh. Do not summarise what they wrote — only challenge the assumption.
Do not start your response with "I" or "You wrote". Keep it under 60 words.`,
      prompt: `${content}\n\n${topicContext}`,
      maxTokens: 120,
      temperature: 0.7,
    })

    if (!text || text.length < 20) return null
    return text.trim()
  } catch (err) {
    console.error('DA reflection failed:', err.message)
    return null
  }
}
```

---

### Task 10: POST /api/notes/[id]/analyse Endpoint

**Files:**
- Create: `app/api/notes/[id]/analyse/route.js`

- [ ] **Step 1: Create the analyse endpoint**

This endpoint runs the two AI calls sequentially, then upserts to `note_metadata`. It is called non-blocking from PlainEditor after save.

```js
import { NextResponse } from 'next/server'
import { Pool } from 'pg'
import { extractNoteMetadata } from '@/lib/ai/extract-note-metadata'
import { generateDaReflection } from '@/lib/ai/generate-da-reflection'
import { generateEmbedding } from '@/lib/ai/generate-embedding'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

const MIN_WORD_COUNT = parseInt(process.env.ANALYSE_MIN_WORD_COUNT || '50', 10)

export async function POST(req, { params }) {
  if (process.env.ANALYSIS_ENABLED === 'false') {
    return NextResponse.json({ skipped: true, reason: 'disabled' })
  }

  try {
    const { id } = await params

    // Fetch note
    const client = await pool.connect()
    const noteResult = await client.query(
      'SELECT id, title, content, analysis_disabled FROM notes WHERE id = $1',
      [id]
    )
    client.release()

    if (noteResult.rows.length === 0) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    }

    const note = noteResult.rows[0]

    if (note.analysis_disabled) {
      return NextResponse.json({ skipped: true, reason: 'disabled_per_note' })
    }

    const wordCount = (note.content || '').split(/\s+/).filter(Boolean).length
    if (wordCount < MIN_WORD_COUNT) {
      return NextResponse.json({ skipped: true, reason: 'too_short', wordCount })
    }

    // Call 1: structured metadata
    const extracted = await extractNoteMetadata(note.content)
    if (!extracted) {
      return NextResponse.json({ error: 'Metadata extraction failed' }, { status: 500 })
    }

    // Call 2: DA reflection
    const daReflection = await generateDaReflection(note.content, extracted.topics)

    // Call 3: embedding
    const embeddingRaw = await generateEmbedding(note.content)
    const embeddingVector = `[${embeddingRaw.join(',')}]`

    // Upsert into note_metadata
    const upsertClient = await pool.connect()
    await upsertClient.query(
      `INSERT INTO note_metadata
         (note_id, mood_score, arousal, emotion_label, topics, summary, da_reflection, embedding, analysed_at)
       VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7, $8::vector, NOW())
       ON CONFLICT (note_id) DO UPDATE SET
         mood_score = EXCLUDED.mood_score,
         arousal = EXCLUDED.arousal,
         emotion_label = EXCLUDED.emotion_label,
         topics = EXCLUDED.topics,
         summary = EXCLUDED.summary,
         da_reflection = EXCLUDED.da_reflection,
         embedding = EXCLUDED.embedding,
         analysed_at = NOW()`,
      [
        id,
        extracted.mood_score,
        extracted.arousal,
        extracted.emotion_label,
        JSON.stringify(extracted.topics),
        extracted.summary,
        daReflection,
        embeddingVector,
      ]
    )
    upsertClient.release()

    return NextResponse.json({
      metadata: {
        mood_score: extracted.mood_score,
        arousal: extracted.arousal,
        emotion_label: extracted.emotion_label,
        topics: extracted.topics,
        summary: extracted.summary,
        da_reflection: daReflection,
        analysed_at: new Date().toISOString(),
      }
    })
  } catch (err) {
    console.error('Analyse endpoint error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
```

---

### Task 11: GET /api/notes/today

**Files:**
- Create: `app/api/notes/today/route.js`

- [ ] **Step 1: Create today route**

```js
import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function GET() {
  const today = new Date().toISOString().split('T')[0] // e.g. "2026-05-08"

  try {
    const client = await pool.connect()

    // Look for existing today note
    const existing = await client.query(
      'SELECT id, title, content FROM notes WHERE title = $1 LIMIT 1',
      [today]
    )

    if (existing.rows.length > 0) {
      client.release()
      return NextResponse.json({ note: existing.rows[0] })
    }

    // Create today's note
    const created = await client.query(
      `INSERT INTO notes (title, content) VALUES ($1, $2) RETURNING id, title, content`,
      [today, '']
    )
    client.release()

    return NextResponse.json({ note: created.rows[0], created: true }, { status: 201 })
  } catch (err) {
    console.error('Error in /api/notes/today:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
```

- [ ] **Step 2: Call today route on Journal page load**

Modify `app/Journal/page.jsx` to fetch today's note and pass the ID to FileProvider:

```js
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { FileProvider } from '../_components/files-context'
import PlainEditor from '../_components/plain-editor'
import ChatPanel from '../_components/chat-panel'
import { AppSidebar } from '../_components/app-sidebar'
import NoteMetadataPanel from '../_components/note-metadata-panel'
import { getExplorerData } from './action'

export default async function Page() {
  const [sidebarData, todayRes] = await Promise.all([
    getExplorerData(),
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/notes/today`).then(r => r.json()),
  ])

  const todayNoteId = todayRes.note ? `note-${todayRes.note.id}` : null

  return (
    <FileProvider sidebarMetadata={sidebarData.tree} initialNoteId={todayNoteId}>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 w-full flex">
          <div className="flex-1">
            <SidebarTrigger className="fixed" />
            <PlainEditor />
          </div>
          <NoteMetadataPanel />
        </main>
        <ChatPanel />
      </SidebarProvider>
    </FileProvider>
  )
}
```

- [ ] **Step 3: Update FileProvider to accept initialNoteId**

```js
'use client'

import { createContext, useContext, useState } from "react"

const FileContext = createContext(null)

export function FileProvider({ children, sidebarMetadata, initialNoteId }) {
  const [selectedNoteId, setSelectedNoteId] = useState(initialNoteId || null)
  const [metadata, setMetadata] = useState(null)

  const value = {
    sidebarMetadata,
    selectedNoteId,
    setSelectedNoteId,
    metadata,
    setMetadata,
  }

  return (
    <FileContext.Provider value={value}>
      {children}
    </FileContext.Provider>
  )
}

export function useFileContext() {
  const context = useContext(FileContext)
  if (!context) throw new Error('useFileContext must be used within a FileProvider')
  return context
}
```

---

### Task 12: NoteMetadataPanel Component

**Files:**
- Create: `app/_components/note-metadata-panel.jsx`

- [ ] **Step 1: Create the panel component**

```js
'use client'

import { useFileContext } from './files-context'

function MoodBar({ score }) {
  const filled = Math.round(score)
  const color = score >= 7 ? 'bg-green-500' : score >= 4 ? 'bg-yellow-500' : 'bg-red-500'
  return (
    <div className="flex gap-0.5 items-center">
      {Array.from({ length: 10 }, (_, i) => (
        <div
          key={i}
          className={`h-2 w-3 rounded-sm ${i < filled ? color : 'bg-muted'}`}
        />
      ))}
      <span className="ml-2 text-xs text-muted-foreground">{score}/10</span>
    </div>
  )
}

export default function NoteMetadataPanel() {
  const { selectedNoteId, metadata } = useFileContext()

  if (!selectedNoteId) return null

  return (
    <aside className="w-64 shrink-0 border-l border-border bg-sidebar p-4 flex flex-col gap-4 overflow-y-auto">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
        AI Analysis
      </h3>

      {!metadata && (
        <p className="text-xs text-muted-foreground">
          Save a note (50+ words) to see AI analysis.
        </p>
      )}

      {metadata && (
        <>
          {/* Mood */}
          <div className="space-y-1">
            <span className="text-xs font-medium">Mood</span>
            <MoodBar score={metadata.mood_score} />
            <p className="text-xs text-muted-foreground capitalize">
              {metadata.emotion_label} · {metadata.arousal}
            </p>
          </div>

          {/* Topics */}
          {metadata.topics?.length > 0 && (
            <div className="space-y-1">
              <span className="text-xs font-medium">Topics</span>
              <div className="flex flex-wrap gap-1">
                {metadata.topics.map(t => (
                  <span
                    key={t}
                    className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Summary */}
          {metadata.summary && (
            <div className="space-y-1">
              <span className="text-xs font-medium">Summary</span>
              <p className="text-xs text-muted-foreground italic">{metadata.summary}</p>
            </div>
          )}

          {/* Devil's Advocate */}
          {metadata.da_reflection && (
            <div className="space-y-1 border-t border-border pt-3">
              <span className="text-xs font-medium text-orange-600 dark:text-orange-400">
                Devil's Advocate
              </span>
              <p className="text-xs text-foreground leading-relaxed">
                {metadata.da_reflection}
              </p>
            </div>
          )}

          {/* Timestamp */}
          {metadata.analysed_at && (
            <p className="text-xs text-muted-foreground mt-auto">
              Analysed {new Date(metadata.analysed_at).toLocaleTimeString()}
            </p>
          )}
        </>
      )}
    </aside>
  )
}
```

- [ ] **Step 2: Manual test**

```
1. Open Journal page — today's note should open automatically
2. Write 60+ words in the editor
3. Wait 2s for save, then ~5s for AI analysis
4. Right panel should populate with mood bar, topics, summary, and DA reflection
```

---

### Task 13: Semantic Search

**Files:**
- Create: `app/api/notes/search/route.js`

- [ ] **Step 1: Create semantic search endpoint**

```js
import { NextResponse } from 'next/server'
import { Pool } from 'pg'
import { generateEmbedding } from '@/lib/ai/generate-embedding'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function POST(req) {
  try {
    const { query } = await req.json()
    if (!query?.trim()) {
      return NextResponse.json({ notes: [] })
    }

    const embedding = await generateEmbedding(query)
    const vector = `[${embedding.join(',')}]`

    const client = await pool.connect()

    // Semantic search via pgvector cosine similarity on note_metadata
    const result = await client.query(
      `SELECT n.id, n.title, n.content,
              1 - (nm.embedding <=> $1::vector) AS similarity
       FROM note_metadata nm
       JOIN notes n ON n.id = nm.note_id
       WHERE 1 - (nm.embedding <=> $1::vector) > 0.75
       ORDER BY nm.embedding <=> $1::vector
       LIMIT 10`,
      [vector]
    )

    if (result.rows.length > 0) {
      client.release()
      return NextResponse.json({ notes: result.rows, mode: 'semantic' })
    }

    // Fallback: full-text ILIKE search
    const fallback = await client.query(
      `SELECT id, title, content, 0 AS similarity
       FROM notes
       WHERE title ILIKE $1 OR content ILIKE $1
       ORDER BY "createdAt" DESC
       LIMIT 10`,
      [`%${query}%`]
    )
    client.release()

    return NextResponse.json({ notes: fallback.rows, mode: 'fulltext' })
  } catch (err) {
    console.error('Search error:', err)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
```

---

## Phase 3 — Insights Dashboard

### Task 14: Install Recharts

**Files:**
- Modify: `package.json` (via npm install)

- [ ] **Step 1: Install recharts**

```bash
cd 2026-Active-Projects/InnerScript
npm install recharts
```

Expected: recharts added to dependencies in package.json.

---

### Task 15: Insights API Endpoints

**Files:**
- Create: `app/api/insights/mood-timeline/route.js`
- Create: `app/api/insights/topics/route.js`

- [ ] **Step 1: Create mood timeline endpoint**

```js
import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const start = searchParams.get('start') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const end = searchParams.get('end') || new Date().toISOString()

  try {
    const client = await pool.connect()
    const result = await client.query(
      `SELECT
         n.title AS date,
         nm.mood_score,
         nm.emotion_label,
         nm.da_reflection IS NOT NULL AS has_da,
         n.id AS note_id,
         nm.analysed_at
       FROM note_metadata nm
       JOIN notes n ON n.id = nm.note_id
       WHERE nm.analysed_at BETWEEN $1 AND $2
       ORDER BY nm.analysed_at ASC`,
      [start, end]
    )
    client.release()

    // Compute 7-day rolling average
    const rows = result.rows
    const withRolling = rows.map((row, i) => {
      const window = rows.slice(Math.max(0, i - 6), i + 1)
      const avg = window.reduce((sum, r) => sum + r.mood_score, 0) / window.length
      return { ...row, rolling_avg: Math.round(avg * 10) / 10 }
    })

    return NextResponse.json({ data: withRolling })
  } catch (err) {
    console.error('Mood timeline error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
```

- [ ] **Step 2: Create topics endpoint**

```js
import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const start = searchParams.get('start') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const end = searchParams.get('end') || new Date().toISOString()
  const limit = parseInt(searchParams.get('limit') || '20', 10)

  try {
    const client = await pool.connect()
    const result = await client.query(
      `SELECT
         topic,
         COUNT(*) AS count
       FROM note_metadata nm,
            jsonb_array_elements_text(nm.topics) AS topic
       WHERE nm.analysed_at BETWEEN $1 AND $2
       GROUP BY topic
       ORDER BY count DESC
       LIMIT $3`,
      [start, end, limit]
    )
    client.release()

    return NextResponse.json({ topics: result.rows })
  } catch (err) {
    console.error('Topics error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
```

---

### Task 16: Chart Components

**Files:**
- Create: `app/_components/insights/mood-timeline-chart.jsx`
- Create: `app/_components/insights/topic-frequency-chart.jsx`

- [ ] **Step 1: Create mood timeline chart**

```js
'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceDot,
} from 'recharts'
import { useRouter } from 'next/navigation'

export default function MoodTimelineChart({ data }) {
  const router = useRouter()

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-muted-foreground">
        No mood data yet. Write and save 3+ notes to see your timeline.
      </div>
    )
  }

  const handleClick = (payload) => {
    if (payload?.activePayload?.[0]?.payload?.note_id) {
      router.push(`/Journal?note=${payload.activePayload[0].payload.note_id}`)
    }
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} onClick={handleClick} style={{ cursor: 'pointer' }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
        <YAxis domain={[1, 10]} ticks={[1, 3, 5, 7, 10]} tick={{ fontSize: 11 }} />
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null
            const d = payload[0].payload
            return (
              <div className="bg-background border border-border rounded p-2 text-xs shadow">
                <p className="font-medium">{d.date}</p>
                <p>Mood: {d.mood_score}/10</p>
                <p>7-day avg: {d.rolling_avg}</p>
                <p className="capitalize text-muted-foreground">{d.emotion_label}</p>
                {d.has_da && <p className="text-orange-500">◆ DA reflection</p>}
              </div>
            )
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="mood_score"
          stroke="#6366f1"
          strokeWidth={2}
          dot={(props) => {
            const { cx, cy, payload } = props
            if (payload.has_da) {
              return <polygon key={`da-${payload.note_id}`} points={`${cx},${cy - 6} ${cx + 5},${cy + 3} ${cx - 5},${cy + 3}`} fill="#f97316" />
            }
            return <circle key={`dot-${payload.note_id}`} cx={cx} cy={cy} r={3} fill="#6366f1" />
          }}
          name="Mood Score"
        />
        <Line
          type="monotone"
          dataKey="rolling_avg"
          stroke="#a5b4fc"
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={false}
          name="7-day avg"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
```

- [ ] **Step 2: Create topic frequency chart**

```js
'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

export default function TopicFrequencyChart({ topics }) {
  if (!topics || topics.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-muted-foreground">
        No topic data yet. Topics appear after 3+ analysed notes.
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={topics} layout="vertical" margin={{ left: 40 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis type="number" tick={{ fontSize: 11 }} />
        <YAxis type="category" dataKey="topic" tick={{ fontSize: 11 }} width={80} />
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null
            return (
              <div className="bg-background border border-border rounded p-2 text-xs shadow">
                <p>{payload[0].payload.topic}: {payload[0].value} entries</p>
              </div>
            )
          }}
        />
        <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} name="Entries" />
      </BarChart>
    </ResponsiveContainer>
  )
}
```

---

### Task 17: Insights Dashboard Page

**Files:**
- Create: `app/Journal/insights/page.jsx`
- Modify: `app/_components/app-sidebar.jsx` (add Insights nav link)

- [ ] **Step 1: Create insights page**

```js
import MoodTimelineChart from '@/app/_components/insights/mood-timeline-chart'
import TopicFrequencyChart from '@/app/_components/insights/topic-frequency-chart'

async function getMoodTimeline() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/insights/mood-timeline`,
    { cache: 'no-store' }
  )
  if (!res.ok) return []
  const { data } = await res.json()
  return data || []
}

async function getTopics() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/insights/topics`,
    { cache: 'no-store' }
  )
  if (!res.ok) return []
  const { topics } = await res.json()
  return topics || []
}

export default async function InsightsPage() {
  const [moodData, topicData] = await Promise.all([getMoodTimeline(), getTopics()])

  const hasData = moodData.length >= 3

  return (
    <main className="flex-1 p-8 max-w-4xl mx-auto space-y-10">
      <div>
        <h1 className="text-3xl font-serif mb-1">Insights</h1>
        <p className="text-sm text-muted-foreground">
          Your emotional patterns and recurring themes over the last 30 days.
        </p>
      </div>

      {!hasData && (
        <div className="border border-border rounded-lg p-6 text-center space-y-2">
          <p className="text-sm font-medium">
            {moodData.length === 0
              ? 'Write and save your first note to start building insights.'
              : `${moodData.length} of 3 notes analysed. Write ${3 - moodData.length} more to unlock mood trends.`}
          </p>
          <div className="w-full bg-muted rounded-full h-2 max-w-xs mx-auto">
            <div
              className="bg-indigo-500 h-2 rounded-full transition-all"
              style={{ width: `${Math.min(100, (moodData.length / 3) * 100)}%` }}
            />
          </div>
        </div>
      )}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Mood Over Time</h2>
        <p className="text-xs text-muted-foreground">
          ◆ = entry with Devil's Advocate reflection · Dashed line = 7-day average
        </p>
        <MoodTimelineChart data={moodData} />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Top Topics</h2>
        <TopicFrequencyChart topics={topicData} />
      </section>

      {topicData.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Inner Map</h2>
          <div className="flex flex-wrap gap-2 p-4 border border-border rounded-lg">
            {topicData.map(({ topic, count }) => {
              const maxCount = topicData[0].count
              const size = 12 + Math.round((count / maxCount) * 12)
              return (
                <span
                  key={topic}
                  className="text-muted-foreground hover:text-foreground cursor-default transition-colors"
                  style={{ fontSize: `${size}px` }}
                >
                  {topic}
                </span>
              )
            })}
          </div>
        </section>
      )}
    </main>
  )
}
```

- [ ] **Step 2: Add Insights nav link to sidebar**

Add to `app/_components/app-sidebar.jsx` inside `SidebarFooter`:

```js
import Link from 'next/link'
import { BarChart2 } from 'lucide-react'

// Inside AppSidebar return, replace <SidebarFooter /> with:
<SidebarFooter className="p-2">
  <Link
    href="/Journal/insights"
    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground px-2 py-1.5 rounded-sm hover:bg-muted transition-colors"
  >
    <BarChart2 size={14} />
    Insights
  </Link>
</SidebarFooter>
```

- [ ] **Step 3: Final manual QA**

```
1. Open Journal — today's note auto-opens
2. Write 60+ words and save
3. Wait ~5–8s — metadata panel populates with mood, topics, DA reflection
4. Click "Insights" in sidebar
5. Mood timeline shows today's entry with a data point
6. Top Topics shows topics from your entry
7. Inner Map shows the tag cloud
```

---

## File Map Summary

| File | Action | Task |
|---|---|---|
| `docker-compose.yml` | Fix port `5433:5432` | 1 |
| `.env.local` | Fix DATABASE_URL to `db:5432` + add env vars | 1 |
| `lib/db/index.js` | Add vector extension + NoteMetadata + embedding columns | 2, 8 |
| `lib/db/models/Note.model.js` | Make `folder_id` nullable, add `analysis_disabled` | 3 |
| `lib/db/models/NoteMetadata.model.js` | Create | 8 |
| `app/api/notes/route.js` | Add GET list, fix POST to use `title` | 3 |
| `app/api/notes/[id]/route.js` | Fix all queries: `name` → `title` | 3 |
| `app/api/folders/route.js` | Fix: `parent_folder_id` → `parent_id` | 3 |
| `lib/ai/generate-embedding.js` | Create (move from temp_embedgen) | 4 |
| `app/api/chat/route.js` | Fix import path | 4 |
| `app/_components/plain-editor.jsx` | Load on select + debounced save + trigger analyse | 5 |
| `app/_components/files-context.jsx` | Add `metadata`/`setMetadata`, `initialNoteId` | 5, 11 |
| `app/_components/app-sidebar.jsx` | Wire create actions + Insights link | 6, 17 |
| `app/_components/chat-panel.jsx` | Connect useChat hook | 7 |
| `lib/ai/extract-note-metadata.js` | Create | 9 |
| `lib/ai/generate-da-reflection.js` | Create | 9 |
| `app/api/notes/[id]/analyse/route.js` | Create | 10 |
| `app/api/notes/today/route.js` | Create | 11 |
| `app/Journal/page.jsx` | Add today note fetch + NoteMetadataPanel | 11 |
| `app/_components/note-metadata-panel.jsx` | Create | 12 |
| `app/api/notes/search/route.js` | Create | 13 |
| `app/api/insights/mood-timeline/route.js` | Create | 15 |
| `app/api/insights/topics/route.js` | Create | 15 |
| `app/_components/insights/mood-timeline-chart.jsx` | Create | 16 |
| `app/_components/insights/topic-frequency-chart.jsx` | Create | 16 |
| `app/Journal/insights/page.jsx` | Create | 17 |
