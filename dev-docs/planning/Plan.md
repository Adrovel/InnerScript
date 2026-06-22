# InnerScript Plan

Purpose: keep the active roadmap small enough for fast ideation while preserving the long-term direction as optional depth.

Update tracking: use `.wolf/update-log.md` for compact project updates. Summarize nearby similar updates instead of appending noisy repeated lines. Use this plan for current phase roadmap and deliverables.

## Progress

Overall active roadmap: [#######---] 70%

Notification rule: when overall roadmap progress reaches or crosses 40%, tell Joel explicitly in the same session before moving on.

Roadmap crossed 40% on 2026-06-22 because redundant deferred phases were removed from the active denominator.

| Phase | Progress | Notes |
|---|---:|---|
| Phase 0 - Direction Lock | [#########-] 90% | thesis, product guardrails, and schema direction are clear; Drizzle rationale remains open |
| Phase 1 - Local Journal Workspace | [#########-] 90% | CRUD, folders, nested sidebar, Markdown editor, autosave, save state, rename/delete, note schema, and focused tests exist |
| Phase 1.5 - Product Clarity And UI Review | [#########-] 90% | local review feedback is captured; sidebar/editor/top-bar polish is mostly complete |
| Phase 2 - One Reflection Question | [#---------] 15% | direction chosen: one current-entry-dependent reflection question; implementation not started |
| Phase 3 - Semantic Search Seed | [----------] 0% | next AI-systems layer after reflection and export; keep it small |
| Later - Optional Integrations And Systems | [----------] 0% | imports, people analytics, dashboards, hosted auth, and Go/Redis are not active fast-ideation work |

## Fast Ideation Rule

If a feature does not help a person write, organize, reflect, export, or search their own text quickly, it is not active roadmap work.

Keep long-range ideas in planning notes or `Future-Plan.md`; do not count them as unfinished MVP work.

Prefer:

- manual writing before imports
- folders and notes before dashboards
- one reflection question before modes or broad analysis
- export before hosted features
- small semantic search before graph systems

Defer out of the active roadmap:

- AI people conversation UI
- relationship analytics
- mood/pattern dashboards
- OCR and note-app imports
- Go/Redis rate limiter
- hosted auth, billing, quotas, and consumer infrastructure
- weekly digest and challenge mode

## Current Implementation

Already implemented:

- entries and sources schema
- folder schema and folder APIs
- Journal seeded as default folder
- daily journals represented by `journal_date`
- entry CRUD APIs
- folder CRUD APIs, including nested folder deletion
- sidebar with nested folders, root notes, create, rename, delete, and selected-file highlight
- shadcn sidebar primitives and cleaner top/sidebar structure
- CodeMirror live Markdown editor
- raw Markdown autosave
- visible save state
- stale-save protection tests
- Storybook coverage for sidebar and journal surfaces
- top-bar breadcrumb
- collapsed sidebar expand control inside the header row

Known mismatch:

- none for entry types; implementation now uses `note` and `conversation`.

## Active Roadmap

### Phase 0 - Direction Lock

Goal: keep the product thesis and schema direction clear enough for fast implementation.

Done:

- product thesis captured
- product decisions captured
- open questions file exists
- active roadmap favors local journal and reflection over broad systems
- schema direction says daily journal is `journal_date`, not a separate entry type

Open:

- get Prithvi's Drizzle rationale
- keep schema naming aligned as new entry types are added
- keep product decisions updated when direction changes

### Phase 1 - Local Journal Workspace

Goal: make InnerScript useful as a plain local journal before AI.

Done:

- write, save, list, open, edit, rename, and delete entries
- create, rename, nest, and delete folders
- create journal entries in the Journal folder
- show folder/file structure in the sidebar
- edit Markdown directly with polished inactive marker behavior
- protect autosave from stale-save text loss

Open:

- add Markdown export
- keep local setup reliable after schema migrations
- keep local setup reliable
- keep tests aligned with entry/folder behavior

Exit criteria:

- a user can write and save locally without AI
- a user can export their text
- tests cover CRUD, autosave, folders, and export
- no AI key is required for core journaling

### Phase 1.5 - Product Clarity And UI Review

Goal: remove writing friction before adding intelligence.

Done:

- local UI feedback captured in `.wolf/user-review.md`
- dead top-bar controls removed
- metadata moved away from title/body flow
- sidebar simplified and polished
- editor width, Markdown marker behavior, and breadcrumb placement improved

Open:

- decide whether the Alexandria style is permanent or temporary
- continue only UI polish that makes writing easier

### Phase 2 - One Reflection Question

Goal: add the first AI moment without turning the app into broad analysis.

Rules:

- use only the current entry
- ask one grounded reflection question
- do not summarize the user's life
- do not diagnose
- hide or disable the flow when AI is unavailable

Open:

- write the reflection-question tone
- define the current-entry-only prompt contract
- add the smallest API path
- add a subtle UI trigger after writing
- test current-entry-only prompt input and AI-unavailable behavior

### Phase 3 - Semantic Search Seed

Goal: add the smallest useful source-backed search path after reflection and export.

Open:

- define chunk shape
- add chunks table
- add chunking after entry save
- add embedding adapter or mocked local path
- return source snippets
- add a tiny evaluation set

Do not expand this into dashboards, graph systems, people analytics, or broad life analysis during fast ideation.

## Later Ideas

These are useful later, but not active roadmap blockers:

- imports from Markdown/text/OCR/external tools
- voice journaling
- people pages
- relationship timelines
- weekly digest
- assumption extraction
- challenge mode
- thinker/personality perspective modes
- Graph RAG
- Go/Redis rate limiter
- hosted auth, billing, quotas, backups, and multi-user infrastructure

Move a later idea into the active roadmap only when it directly supports fast writing, reflection, export, or search.
