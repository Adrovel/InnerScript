# InnerScript Atomic Action Plan

Purpose: track only the active fast-ideation work. Long-range systems, imports, dashboards, people analytics, and hosted product work stay out of this checklist until they become current.

Rule: every task must produce a working artifact, a test, or a decision record.

Update tracking: task checkboxes live here; compact updates live in `.wolf/update-log.md`. Summarize nearby similar updates instead of appending noisy repeated lines.

## Progress

Overall active checkbox progress: [#######---] 70% - 38/54 visible tasks

Notification rule: when overall checkbox progress reaches or crosses 40%, tell Joel explicitly in the same session before moving on.

The active checklist crossed 40% on 2026-06-22 because deferred long-range work was removed from the active denominator.

| Phase | Checkbox progress |
|---|---|
| Phase 0 - Direction Lock | [########--] 8/10 tasks |
| Phase 1 - Local Journal Workspace | [########--] 26/31 tasks |
| Phase 1.5 - Product Clarity And UI Review | [########--] 4/5 tasks |
| Phase 2 - One Reflection Question | [----------] 0/5 tasks |
| Phase 3 - Semantic Search Seed | [----------] 0/3 tasks |

## Fast Ideation Scope

Active work must support one of these loops:

- write
- organize
- reflect
- export
- search

Not active in this checklist:

- imports from other tools
- voice journaling
- AI people or thinker modes
- relationship analytics
- insight dashboards
- weekly digest
- hosted auth or billing
- Go/Redis rate limiter
- Graph RAG production layer

## Current Build Order

1. Finish local journal workspace trust.
2. Add Markdown export.
3. Rename implementation entry type from `document` to `note`.
4. Add one current-entry reflection question.
5. Add the smallest source-backed semantic search seed.

## Phase 0 - Direction Lock

Goal: keep the product direction clear enough for fast implementation.

- [X] Confirm product thesis.
- [X] Confirm therapy/reflection-first writing loop.
- [X] Confirm development app stays smaller than long-term vision.
- [X] Confirm current minimum usable product.
- [X] Confirm entry type direction: `note` and `conversation`.
- [X] Confirm daily journal uses `journal_date`.
- [X] Capture open product questions in `dev-docs/team/Open-Questions.md`.
- [X] Keep product decisions in `dev-docs/team/Product-Decisions.md`.
- [ ] Get Prithvi's Drizzle rationale.
- [ ] Finish implementation schema rename from `document` to `note`.

## Phase 1 - Local Journal Workspace

Goal: make InnerScript useful as a local Markdown journal without AI.

### Data And API

- [X] Implement entries table/model.
- [X] Implement sources table/model.
- [X] Implement folders table/model.
- [X] Add entry CRUD APIs.
- [X] Add folder CRUD APIs.
- [X] Seed Journal as the default folder.
- [X] Store daily journals with `journal_date`.
- [X] Add entry CRUD tests.
- [X] Add folder API tests.
- [ ] Rename manual entry type from `document` to `note`.
- [ ] Update tests after the entry type rename.

### Writing Surface

- [X] Wire editor to entries API.
- [X] Implement autosave.
- [X] Add visible save state.
- [X] Add stale-save protection tests.
- [X] Add CodeMirror live Markdown editor.
- [X] Polish inactive Markdown heading/list markers.
- [X] Keep raw Markdown as saved content.
- [X] Add title rename flow.
- [X] Select the full Untitled title once on new file creation.
- [ ] Add Markdown export.
- [ ] Add export test with multiple entries.

### Organization UI

- [X] Build nested sidebar groups from folders.
- [X] Support root notes outside folders.
- [X] Support inline folder creation.
- [X] Support nested folder creation.
- [X] Support file and folder rename.
- [X] Support file and folder delete.
- [X] Add top-bar breadcrumb.
- [X] Move collapsed sidebar expand control into header row.
- [ ] Keep local setup/runtime docs current after schema rename.

## Phase 1.5 - Product Clarity And UI Review

Goal: keep the writing UI aligned with real local use.

- [X] Capture local UI review in `.wolf/user-review.md`.
- [X] Remove dead top-bar controls.
- [X] Move metadata away from title/body flow.
- [X] Simplify sidebar and editor layout.
- [ ] Decide whether Alexandria style stays or is temporary.

## Phase 2 - One Reflection Question

Goal: add one grounded AI question after writing.

- [ ] Write the first reflection-question tone.
- [ ] Define current-entry-only prompt contract.
- [ ] Add the smallest reflection API path.
- [ ] Add subtle UI trigger after writing.
- [ ] Add tests for current-entry-only input and AI unavailable state.

## Phase 3 - Semantic Search Seed

Goal: create the smallest useful retrieval foundation after reflection/export.

- [ ] Define chunk shape and source snippet format.
- [ ] Add chunks table and chunking after entry save.
- [ ] Add mocked or provider-backed search path with a tiny evaluation set.

## Later List

These are intentionally not active tasks:

- import preview/confirm framework
- Markdown/text/OCR/external-tool import parsers
- voice capture and transcription
- people pages
- relationship timelines
- source-backed dashboards
- assumption extraction and challenge mode
- weekly digest
- thinker/personality lenses
- Graph RAG prototype
- Go/Redis limiter
- hosted consumer mode

Move one item from this list only when it directly supports the active write/organize/reflect/export/search loop.
