# Product Decisions

Purpose: simple question-answer record of product decisions. Keep this readable for anyone loading InnerScript for the first time.

## Decisions

### Q: What is InnerScript?

Answer:
InnerScript is a private diary and AI memory companion that turns years of journals, notes, concepts, reading notes, relationship notes, and writing into source-backed self-understanding.

### Q: Who is the first user?

Answer:
Joel first. Then serious personal journalers. Later, broader people interested in journaling, future authoring, self-reflection, and structured personal growth.

### Q: What should the first version feel like?

Answer:
Therapy/reflection software first, with journal writing as the entry point. It should feel private, reflective, emotionally serious, and useful for self-understanding.

### Q: What should InnerScript avoid becoming?

Answer:
It must not become another generic note app, shallow AI wrapper, productivity dashboard, social app, or unsupported mental-health diagnosis tool.

### Q: What is the first daily workflow?

Answer:
Open today's journal and write. Pattern dashboards, search, and deep analysis come later after enough context exists.

### Q: What is the first AI moment after writing?

Answer:
A reflection question grounded in the current entry. Not a broad analysis report.

### Q: Should the reflection question be generic or based on what was written?

Answer:
The reflection question should depend on what is written in the current entry. It should not be a fixed generic question unless there is not enough entry content to generate anything grounded.

### Q: How much context is needed before analysis?

Answer:
Use context sufficiency tiers. One entry allows only entry-specific reflection. A few entries allow careful immediate themes. Weeks of entries allow short-term patterns. Months or years allow deeper identity, relationship, belief, and life-loop analysis.

### Q: What language should the app use around therapy?

Answer:
Use safer language while preserving therapeutic feeling. Prefer reflection, mirror, self-understanding, guided reflection, personal memory, emotional patterns, and source-backed insight. Avoid diagnosis, treatment, cure, or therapist replacement claims.

### Q: What should the AI do?

Answer:
Answer from notes, ask reflective questions, summarize patterns, detect moods and habits, generate action plans, challenge weak reasoning, and surface bitter truths when grounded in the user's data.

### Q: How direct should the AI be?

Answer:
Mode-switching. Modes should include gentle coach, brutally honest analyst, therapist-like reflector, philosopher/debater, and writing/thinking coach.

### Q: What data should load first?

Answer:
Manual entries first. Later: existing journals, physical notes via OCR, Obsidian, Google Keep, other note apps, reading/concept notes, docs, and chats.

### Q: How should relationship tracking start?

Answer:
Freeform notes first. Structured people pages, interaction timelines, resentment/warmth analysis, and generated relationship summaries come later.

### Q: Should AI people / thinker modes be visible in the MVP plan?

Answer:
Yes, visible in the MVP roadmap, but not Phase 1. They should be clearly labeled as perspective simulations or lenses and implemented only after journaling, provenance, search, and reflection foundations are stable.

### Q: How should product clarity updates be handled?

Answer:
When Joel or a teammate clarifies product intent, first workflow, AI behavior, visual direction, data-loading order, or long-term scope, update the relevant docs in the same session.

### Q: How simple should the app be during development?

Answer:
During development, InnerScript should be simpler to build than the full long-term vision. Phase 1 and early Phase 2 should prioritize a small local journaling loop, clear schema, easy setup, visible save behavior, export, and one reflection-question path before adding imports, dashboards, AI people, relationship analytics, or distributed systems.

### Q: What is the current hiring-pipeline build strategy?

Answer:
InnerScript should build the highest Google-interview-signal parts first while development continues during the hiring pipeline. The goal is not to finish every feature before applying. The near-term proof should be architecture, tradeoffs, ownership, technical decisions, system thinking, and failure-mode reasoning.

### Q: What is the minimum usable product now?

Answer:
The minimum usable product is write, save, autosave, open/edit, delete, export Markdown, and one current-entry reflection question. Everything else is secondary until that loop is reliable.

### Q: How should Joel and Prithvi split ownership now?

Answer:
Joel should focus on learning and architecture depth: chunking, embeddings, retrieval, hybrid search, source grounding, Graph RAG design, entity extraction, prompt contracts, AI safety, rate limiting, caching, background jobs, local-first architecture, privacy-first design, and AI evaluation. Prithvi should focus on frontend and delivery depth: Storybook, component architecture, design system, editor UX, autosave UI, entry CRUD flows, export flow, tests, accessibility, empty/error/offline states, verification, and acceptance criteria.

### Q: What can the resume claim before Graph RAG is fully built?

Answer:
Do not claim a complete Graph RAG semantic memory platform until graph retrieval actually works. Safe claims are built MVP, built architecture, designed retrieval system, designed Graph RAG layer, implemented local-first journal, implemented reflection system, and implemented semantic memory foundations. Every resume line must survive deep technical discussion.

### Q: What belongs in the active roadmap during fast ideation?

Answer:
Only work that helps write, organize, reflect, export, or search should stay in the active roadmap. Imports, dashboards, people analytics, AI people, Graph RAG, hosted auth/billing, and Go/Redis systems are later ideas until they directly support the fast journal loop.
