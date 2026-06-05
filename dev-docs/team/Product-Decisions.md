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

### Q: What docs must stay updated before implementation?

Answer:
Before implementing app behavior, keep `dev-docs/design/idea.md`, `dev-docs/planning/Plan.md`, and `dev-docs/planning/Atomic-Action-Plan.md` current for that change. If priority changes, also update `dev-docs/product-knowledge/Priority-Change-Log.md`.

### Q: Where should product knowledge live?

Answer:
Durable product knowledge learned while building InnerScript should live under `dev-docs/product-knowledge/`. The folder starts with a priority-change log and a structure/conventions plan. It does not replace the roadmap, atomic tasks, team decisions, open questions, or `.wolf` operational logs.

### Q: What should the `innerscript.in` landing page do?

Answer:
The first `innerscript.in` landing page should be verbal-first and explain the product clearly. It should pitch the idea to potential collaborators, cofounders, technical builders, investors, and employers while remaining understandable to lay users and journalers. It should make serious builders feel there is meaningful product and technical work here, not present InnerScript as a generic AI notes app.

### Q: What is the current hiring-pipeline strategy for InnerScript?

Answer:
Do not wait to finish every future feature before applying. Build the minimum usable product first, then prioritize high interview-signal technical layers that Joel can explain deeply: local-first architecture, chunking, embeddings, retrieval, hybrid search, Graph RAG design, knowledge graphs, entity extraction, prompt contracts, rate limiting, caching, background jobs, privacy-first AI, source grounding, and reliability.

### Q: What should Joel own now?

Answer:
Joel should spend most InnerScript time on learning and architecture for AI/retrieval/backend concepts he has not deeply implemented before. He must be able to explain why Graph RAG, why the chosen chunking strategy, why the retrieval approach, failure modes, tradeoffs, scaling path, and source-grounding decisions.

### Q: What should Prithvi own now?

Answer:
Prithvi should focus on frontend engineering depth and delivery: Storybook, component architecture, design system, reusable UI primitives, journal editor UX, autosave UI, save indicators, entry list, open/edit/delete/export flows, frontend tests, accessibility, error states, empty states, offline behavior, bug fixing, verification, checklist reconciliation, and acceptance criteria.

### Q: What should the resume claim before Graph RAG exists?

Answer:
Do not claim a complete Graph RAG semantic memory platform until it exists. Safe claims are: built MVP, built architecture, designed retrieval system, designed Graph RAG layer, implemented local-first journal, implemented reflection system, and implemented semantic memory foundations. Every resume claim must survive deep technical discussion.
