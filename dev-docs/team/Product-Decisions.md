# Product Decisions

Purpose: simple question-answer record of product decisions. Keep this readable for anyone loading InnerScript for the first time.

## Decisions

### Q: What is InnerScript?

Answer:
InnerScript is a private writing and AI memory companion for making the unconscious conscious through writing. It combines daily emotional journaling with long-term personal memory/search, turning years of journals, notes, concepts, reading notes, relationship notes, and writing into source-backed self-understanding.

### Q: Who is the first user?

Answer:
Joel and the developers building InnerScript first. The product should become good enough for the builders to use before shifting toward other users. Public SaaS is a long-run possibility, not the first design constraint. Then serious personal journalers. Later, broader people interested in journaling, future authoring, self-reflection, and structured personal growth.

### Q: What should the first version feel like?

Answer:
Writing-first reflection software. Its core feeling is not generic therapy software or a notes app; it should help the user make the unconscious conscious through writing. It should feel private, reflective, emotionally serious, and useful for self-understanding.

### Q: What should InnerScript avoid becoming?

Answer:
It must not become another generic note app, shallow AI wrapper, productivity dashboard, social app, or unsupported mental-health diagnosis tool.

### Q: What is the first daily workflow?

Answer:
Open a private writing space and write. Long-term memory/search is part of the product, but the first interaction should not be a file-tree or knowledge-base management screen. Pattern dashboards, search, and deep analysis come later after enough context exists.

### Q: What is the first-customer strategy?

Answer:
The developers are the first customers. InnerScript should be useful and trustworthy for the team before it shifts toward public users. Public SaaS can be a later direction, but near-term product decisions should optimize for a high-quality private tool first.

### Q: What is the first AI moment after writing?

Answer:
AI can be available while the user is writing and when the user explicitly asks, but it must not interrupt the writing flow. The writing surface comes first. Any AI presence during writing should stay quiet until the user pauses, asks, or chooses to engage.

### Q: How visible should AI be during writing?

Answer:
For now, AI should be available through a small quiet button. It should not be a large side panel or active interruption during writing.

### Q: How should AI work behind the writing surface?

Answer:
AI should feel layered in the background. The user should mainly type. Behind the scenes, the system should extract and store relevant structured data such as assumptions, emotions, people, themes, and patterns without requiring the user to explicitly tag everything.

### Q: What should the first background extraction be?

Answer:
Emotions first. Assumptions, people, themes, avoidance signals, and behavior patterns come later. Emotion extraction should run after the user has stopped writing for a short while, then appear with a slight lag rather than interrupting the typing flow.

### Q: How should emotion extraction appear?

Answer:
Emotion chips can appear almost immediately after a short writing pause, likely in a side panel or quiet supporting surface. They should be visible to the user and also stored for later pattern analysis. The first version should not make emotion chips editable.

### Q: Should emotion extraction show probabilities?

Answer:
No fake precision. The app should not show probability labels such as `anger 72%`. Emotions are interpretive signals, not exact measurements. If uncertainty matters, use softer language or grouping rather than numeric confidence.

### Q: What naming direction fits the AI/supporting surface?

Answer:
`Echo` is a strong naming direction. Possible language: "listen to your echo." Also consider whether the whole app should be named Echo instead of InnerScript.

### Q: What does "making the unconscious conscious" mean in the product?

Answer:
It means helping the user notice hidden emotions, repeating behavior patterns, unspoken beliefs, relationship reactions, life-direction confusion, and identity questions through writing. The app should preserve messy emotional entries because they capture real emotion, while giving only a gentle reminder to write more clearly when needed.

### Q: What should InnerScript do with a messy or raw entry?

Answer:
Messy entries are acceptable. The app can gently remind the user to write clearly, then help understand patterns, name emotions, challenge thoughts, connect to older entries, and summarize what the user may be avoiding.

### Q: How should entries be organized?

Answer:
The product can support multiple organization axes: date, folders, tags, people, emotions/themes, and later AI-assisted organization. No single axis should own the whole product model.

### Q: Should people be a first-class early feature?

Answer:
Not yet. People can be extracted or referenced in the background, but early product emphasis should start with simpler categorization such as emotions. A useful early example is: paste or write a journal entry, then a side panel shows emotion chips inferred from the entry.

### Q: Should patterns have a dedicated area?

Answer:
Yes. InnerScript should eventually have a dedicated patterns area, not only pattern responses inside chat.

### Q: Should extracted insights be stored as structured data?

Answer:
Yes. Sensitive relationship, emotional, assumption, person, and pattern insights should become structured data when the system has enough confidence, rather than existing only as temporary generated text.

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
Answer from notes, ask reflective questions, summarize patterns, detect moods and habits, name emotions, challenge weak reasoning, connect current writing to older entries, generate action plans, and surface bitter truths when grounded in the user's data.

### Q: How direct should the AI be?

Answer:
Mode-switching. The AI should balance truth and comfort. It should be gentle by default, but blunt when necessary and grounded. It may say hard things, including that the user may be lying to themselves, only when the claim is supported by the user's writing and the user has invited that kind of analysis. Modes should include gentle coach, brutally honest analyst, therapist-like reflector, philosopher/debater, and writing/thinking coach.

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

### Q: Is local-first privacy a hard launch requirement?

Answer:
No. Local-first privacy remains valuable, but it is not a hard blocker before production hosting. InnerScript may be hosted in production before all local-first privacy questions are fully settled.

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
