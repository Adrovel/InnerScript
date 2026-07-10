# Open Questions

Purpose: hold ambiguous or unanswered questions for Joel, Prithvi, and agents. Move answered product decisions to `Product-Decisions.md`.

## Product Experience

### Q: What should the first-screen layout be if it is a private writing room with AI presence?

Asked by: Codex
Date: 2026-06-29
Status: open

Context:
- Joel chose the first-screen direction as both a blank/private writing room and an AI companion presence.
- Joel did not recognize "file tree" as a product concept, so the app should not assume a knowledge-base-first mental model.
- Need to decide how notes, folders, memory/search, and AI presence appear without taking focus away from writing.

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

### Q: What should the quiet AI action be called?

Asked by: Joel
Date: 2026-06-29
Status: open

Context:
- Joel wants a cool, non-obvious name rather than plain labels like Reflect, Mirror, Ask, Reveal, or Understand.
- The action opens AI help without interrupting writing.
- `Echo` is a strong candidate, with language like "listen to your echo."

### Q: Should InnerScript be renamed to Echo?

Asked by: Joel
Date: 2026-06-29
Status: open

Context:
- Joel raised `Echo` as a possible name for the side panel/action and possibly the whole app.
- Need to decide whether Echo is a feature name, AI surface name, or full product rename.

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

## Privacy, Trust, And Security

### Q: Why should customers trust InnerScript with their personal data?

Asked by: Joel
Date: 2026-07-07
Status: open

Context:
- InnerScript will hold highly sensitive personal writing, including emotions, relationships, identity questions, patterns, and long-term memory.
- The product needs a plain answer for what data is collected, where it is stored, who can access it, how AI providers are used, how users can export/delete it, and what the company will never do with it.
- This should be answered before positioning InnerScript for public customers, not after launch copy is written.

### Q: What cybersecurity measures prevent private data from being released?

Asked by: Joel
Date: 2026-07-07
Status: open

Context:
- Joel raised the concrete fear: what if somebody releases user data?
- Need a real security plan covering access control, encryption, secret management, audit logs, least-privilege admin access, backup handling, vulnerability response, and incident/breach communication.
- The answer should distinguish prevention, detection, response, and user-facing recovery steps. Do not claim measures are implemented until the code and infrastructure actually prove them.

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

### Q: What is an autosave race in an editor, and how can InnerScript avoid it?

Asked by: Joel
Date: 2026-06-03
Status: open

Context:
- Joel asked to be reminded to understand autosave races in the InnerScript editor.
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

### Q: Should imports be built early or only after manual journaling feels excellent?

Asked by: Codex
Date: 2026-06-29
Status: open

Context:
- Joel needs time to decide.
- Manual writing remains the first customer loop, but imported text may become important for long-term memory.

### Q: Should semantic search come before reflection AI or after?

Asked by: Codex
Date: 2026-06-29
Status: open

Context:
- Joel has not decided the order.
- The product direction now includes background extraction of assumptions, emotions, people, themes, and patterns, but the sequence between reflection, extraction, and search is not locked.

### Q: Should the database stay Postgres/pgvector or move simpler first?

Asked by: Codex
Date: 2026-06-29
Status: open

Context:
- Joel is unsure.
- Current implementation uses Postgres and planning mentions pgvector, but the product decision is not yet locked as a permanent technical direction.

### Q: Is Graph RAG a real product target or later architecture/resume exploration?

Asked by: Codex
Date: 2026-06-29
Status: open

Context:
- Joel is unsure.
- Current product direction supports source-backed personal memory and structured extraction; Graph RAG should not be treated as committed MVP scope until decided.

### Q: What is the first background extraction schema?

Asked by: Codex
Date: 2026-06-29
Status: answered

Context:
- Joel decided AI should extract structured data in the background while the user mainly writes.
- Answered on 2026-06-29: emotions first. Assumptions, people, themes, avoidance signals, and behavior patterns come later.

### Q: Should users be able to correct extracted emotions?

Asked by: Codex
Date: 2026-06-29
Status: open

Context:
- First version emotion chips are not directly editable.
- Joel said correction/teaching is worth considering later.
