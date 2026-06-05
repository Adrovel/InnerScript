# Open Questions

Purpose: hold ambiguous or unanswered questions for Joel, Prithvi, and agents. Move answered product decisions to `Product-Decisions.md`.

## Product Experience

### Q: Should the current Alexandria dark editorial style stay?

Asked by: Codex
Date: 2026-06-03
Status: open

Context:
- Joel needs to review the local UI before deciding.

### Q: What exact words should the app use for the first reflection question?

Asked by: Codex
Date: 2026-06-03
Status: open

Context:
- The first AI moment is decided: a reflection question after writing.
- The exact tone still needs testing in the UI.
- Joel marked the reflection-question product decision as questionable on 2026-06-05.
- The backend contract exists, but the product experience still needs review before treating this as settled.

### Q: Should mode switching be visible on the first screen or only after the user asks AI?

Asked by: Codex
Date: 2026-06-03
Status: open

Context:
- Modes are part of the product direction.
- Showing modes too early may distract from writing.

### Q: What should "dashboard of patterns" eventually include?

Asked by: Codex
Date: 2026-06-03
Status: open

Context:
- Dashboard is deferred behind write-first journaling.
- Need later clarity on moods, loops, relationships, concepts, beliefs, and action patterns.

## Context And Analysis

### Q: What exact thresholds unlock each analysis tier?

Asked by: Joel
Date: 2026-06-03
Status: open

Context:
- Joel raised that the app needs enough context before analysis.
- Current answer is provisional: one entry -> reflection only; weeks/months/years -> stronger analysis.

### Q: Should context sufficiency be visible as a trust indicator?

Asked by: Codex
Date: 2026-06-03
Status: open

Context:
- A visible indicator could prevent AI overclaiming.
- It could also make the app feel too analytical if overdone.

### Q: How should citations be shown without making the app feel academic?

Asked by: Codex
Date: 2026-06-03
Status: open

Context:
- Joel asked what citation UI means.
- In this product, citations mean showing the source journal entries or snippets behind an AI claim.

## Relationships

### Q: What should freeform people notes look like in Phase 1?

Asked by: Codex
Date: 2026-06-03
Status: open

Context:
- Relationship tracking starts as freeform notes.
- Need to decide whether people notes are tags, entry sections, separate notes, or a lightweight people page.

### Q: When is there enough relationship context to show warmth/tension/resentment patterns?

Asked by: Codex
Date: 2026-06-03
Status: open

Context:
- Relationship analysis is sensitive and should not infer too much from one note.

## AI People / Thinker Modes

### Q: Should thinker modes start with public-domain/source-pack figures first?

Asked by: Codex
Date: 2026-06-03
Status: open

Context:
- Joel did not understand the earlier question.
- Meaning: should modes like Nietzsche or Jesus be built only from selected source material first, so the app does not produce low-quality imitation?

### Q: How should simulated thinkers be labeled?

Asked by: Codex
Date: 2026-06-03
Status: open

Context:
- The product should not pretend the AI is the real person.
- Labels might be "Nietzsche lens", "Hormozi-style sales critique", or "Christian reflection lens."

## Technical / Architecture

### Q: What final file structure and conventions should InnerScript use?

Asked by: Joel
Asked to: Prithvi
Date: 2026-06-04
Status: open

Context:
- Joel wants to decide app file structure and conventions before the project grows further.
- This includes source folders, tests, product knowledge, priority-change logs, `.wolf`, buglog, session context, memory, and session logs.
- Current plan is documented in `dev-docs/product-knowledge/Structure-and-Conventions-Plan.md`.

Needed for:
- final source-folder conventions
- `.wolf` role or rename/mirror decision
- future implementation without context drift

### Q: What catch-up format should collaborators use?

Asked by: Joel
Asked to: anyone
Date: 2026-06-04
Status: open

Context:
- Joel wants a prompt, session format, or output format that helps collaborators quickly understand what others have done.
- The format should explain changed files, decisions, rationale, open work, and what to read first.
- This is non-blocking but should be designed before more people work in parallel.

Needed for:
- collaborator onboarding
- handoffs between Joel, Prithvi, Codex, Claude, and designers
- reducing repeated context loading

### Q: What is the clear line of work between Joel and Prithvi?

Asked by: Joel
Asked to: Prithvi
Date: 2026-06-04
Status: open

Context:
- Joel wants a clear non-blocking work split so he and Prithvi can work in parallel.
- Current provisional split is documented in `dev-docs/product-knowledge/Structure-and-Conventions-Plan.md`.

Needed for:
- ownership model
- implementation tickets
- avoiding blockers and duplicated effort

### Q: What is an autosave race in an editor, and how can InnerScript avoid it?

Asked by: Joel
Date: 2026-06-03
Status: open

Context:
- Joel asked to be reminded to understand autosave races in the InnerScript editor.

### Q: How is InnerScript storing data right now?

Asked by: Joel
Asked to: Codex / anyone
Date: 2026-06-05
Status: open

Context:
- Joel asked to be reminded to explain how InnerScript stores data.
- The explanation should cover the current local-first data path, `entries`, `sources`, API routes, Drizzle/Postgres, and what is not stored yet, such as chunks, embeddings, graph data, insights, and hosted-user data.
- The follow-up should explain what happens when overlapping saves finish out of order, and how editor state, save queues, aborts, timestamps, or version checks can prevent stale content from overwriting newer content.

### Q: Why Drizzle, and what utility does it serve in InnerScript?

Asked by: Joel
Asked to: Prithvi
Date: 2026-06-03
Status: open

Context:
- Drizzle was added in the entries/sources persistence work.
- Joel wants Prithvi's rationale before locking the long-term database tooling story.

### Q: Is Go only for the distributed rate limiter, or will more backend services move to Go?

Asked by: Prithvi
Date: 2026-05-29
Status: open

Context:
- This affects the pending React-vs-Next question in `Design-Choices.md`.

### Q: What is the first import path after manual entries?

Asked by: Codex
Date: 2026-06-03
Status: open

Context:
- Current direction: physical-note OCR, Obsidian, Google Keep, other notes, docs, chats.
- Need to choose the first import source when implementation starts.

### Q: What exact resume wording should InnerScript use before Graph RAG exists?

Asked by: Joel
Asked to: Joel
Date: 2026-06-05
Status: open

Context:
- Joel clarified that the resume must not claim a complete Graph RAG semantic memory platform until it actually exists.
- Safe current framing should distinguish built MVP, built architecture, designed retrieval system, designed Graph RAG layer, implemented local-first journal, implemented reflection system, and implemented semantic memory foundations.

Needed for:
- resume updates
- project page claims
- interview story consistency
