# Design Choices

Purpose: track architecture and product decisions in question-answer format.

Use this file when Joel or Prithvi asks a design question that affects architecture, stack, data model, product direction, privacy, Google signal, or implementation ownership.

## Answered Questions

### Q: What is InnerScript trying to become?

Asked by: Joel
Date: 2026-06-03
Status: answered

Answer:
InnerScript should become a private diary and AI memory companion that loads Joel's journals, notes, concepts, and long-form writing so he can interact with himself, understand patterns, heal, write better, and improve as a person.

Reasoning:
- Joel has years of daily journal entries and concept notes, so the strongest product direction is long-range personal memory rather than generic note-taking.
- The emotional core is self-understanding: trauma, moods, intentions, thinking loops, subconscious patterns, relationships, and unresolved ideas.
- The technical core should remain source-backed semantic retrieval and personal-data modeling so the project also carries strong Google-signal value.

Docs updated:
- `dev-docs/design/idea.md`

### Q: Who is the primary user?

Asked by: Joel
Date: 2026-06-03
Status: answered

Answer:
The first user is Joel. The next audience is serious personal journalers. The broader future audience is people interested in journaling, future authoring, self-reflection, and structured personal growth.

Reasoning:
- Designing for Joel first keeps the product concrete and avoids generic notes-app drift.
- Serious journalers share the same data shape: years of private text, recurring themes, and a desire for reflection.
- Broader self-authoring users can come later once the core memory and reflection loops are proven.

Docs updated:
- `dev-docs/design/idea.md`

### Q: What should the app feel like?

Asked by: Joel
Date: 2026-06-03
Status: answered

Answer:
The app should feel like a private diary, AI memory companion, second brain, personal therapist-like reflection space, relationship memory system, and writing/thinking coach.

Reasoning:
- The product should help the user understand both the self and relationships with other people.
- It should support therapeutic-feeling reflection without pretending to be a clinician.
- It should include future space for AI conversations with thinker/personality lenses such as Nietzsche, Alex Hormozi, Jesus Christ, and Machiavelli, but this is a later layer that needs careful source grounding.

Docs updated:
- `dev-docs/design/idea.md`

### Q: What should the AI do?

Asked by: Joel
Date: 2026-06-03
Status: answered

Answer:
The AI should answer from notes, summarize patterns, ask reflective questions, detect moods and habits, generate action plans, challenge weak reasoning, and surface bitter truths when grounded in the user's data.

Reasoning:
- Joel wants the AI to make him more intelligent, honest, therapeutic, and self-aware.
- The product must remain evidence-based and avoid unsupported psychological claims.
- AI should improve the user's self-understanding rather than merely decorate the editor.

Docs updated:
- `dev-docs/design/idea.md`

### Q: What should InnerScript avoid becoming?

Asked by: Joel
Date: 2026-06-03
Status: answered

Answer:
InnerScript must avoid becoming another generic note app.

Reasoning:
- Generic note-taking would waste the strongest asset: years of personal writing and life data.
- The project must keep emotional depth, privacy, source-backed insight, and Google-signal engineering as core constraints.

Docs updated:
- `dev-docs/design/idea.md`

### Q: What is the first daily workflow?

Asked by: Joel
Date: 2026-06-03
Status: answered

Answer:
The first daily workflow is writing the journal. Pattern dashboards can come later, but they should not replace the write-first loop.

Reasoning:
- Joel was unsure about a "dashboard of patterns"; the clearer first product behavior is opening today's journal and writing.
- Reliable manual entries create the source material for later reflection, search, mood tracking, imports, and AI analysis.
- A pattern dashboard is useful only after enough data and source-backed extraction exist.

Docs updated:
- `dev-docs/design/idea.md`
- `dev-docs/planning/Features.md`
- `dev-docs/planning/Plan.md`
- `dev-docs/planning/Atomic-Action-Plan.md`

### Q: What should the first version feel like?

Asked by: Joel
Date: 2026-06-03
Status: answered

Answer:
The first version should feel like therapy/reflection software first, with journal writing as the entry point.

Reasoning:
- The emotional product promise is self-understanding, healing, pattern recognition, and honest reflection.
- The UI should support private writing and introspection before becoming a search dashboard or productivity system.
- The app must still avoid diagnosis or pretending to be a clinician.

Docs updated:
- `dev-docs/design/idea.md`
- `dev-docs/planning/Features.md`

### Q: How direct should the AI be?

Asked by: Joel
Date: 2026-06-03
Status: answered

Answer:
The AI should be mode-switching: gentle coach, brutally honest analyst, therapist-like reflector, philosopher/debater, and writing/thinking coach.

Reasoning:
- One fixed AI voice cannot cover healing, self-critique, writing improvement, philosophical questioning, and action planning.
- Modes should be explicit so the user can choose the type of reflection they want.
- Even direct or bitter feedback must stay grounded in the user's notes and avoid unsupported psychological claims.

Docs updated:
- `dev-docs/design/idea.md`
- `dev-docs/planning/Features.md`
- `dev-docs/architecture/Architecture.md`

### Q: What data should load first?

Asked by: Joel
Date: 2026-06-03
Status: answered

Answer:
Manual entries come first. Later imports should support journal entries from physical notes via OCR, Obsidian, Google Keep, other note apps, reading/concept notes, docs, and chats.

Reasoning:
- Manual entries prove the diary/reflection loop before import complexity.
- OCR, note-app imports, and chats are valuable but require stronger provenance, parsing, and privacy boundaries.
- This sequence keeps Phase 1 small while preserving the long-term personal memory ambition.

Docs updated:
- `dev-docs/design/idea.md`
- `dev-docs/planning/Features.md`
- `dev-docs/planning/Plan.md`
- `dev-docs/architecture/Architecture.md`

### Q: Should AI people be visible in the MVP plan?

Asked by: Joel
Date: 2026-06-03
Status: answered

Answer:
Yes. AI people and thinker/personality perspective modes should be visible in the MVP plan, but implemented after the journal, source, search, and reflection foundations are stable.

Reasoning:
- This idea is core to the long-term product imagination, so hiding it would make the plan feel incomplete.
- It should be clearly scoped as perspective simulations or lenses, not impersonation or claims to be the real person.
- It needs source grounding and strong boundaries before it becomes a central UI.

Docs updated:
- `dev-docs/design/idea.md`
- `dev-docs/planning/Features.md`
- `dev-docs/planning/Plan.md`
- `dev-docs/planning/Future-Plan.md`

### Q: How should product clarity updates be handled during future sessions?

Asked by: Joel
Date: 2026-06-03
Status: answered

Answer:
Whenever product clarity changes during a terminal session or user input, update the relevant InnerScript docs in the same session: idea, design choices, features, architecture, plan, atomic plan, future plan, guardrails, and update log as applicable.

Reasoning:
- InnerScript is still becoming clearer through conversation and local review.
- Keeping docs current prevents the code from drifting into a generic notes app.
- The durable docs should reflect product decisions before or alongside implementation changes.

Docs updated:
- `dev-docs/guardrails/Direction-Guardrails.md`
- `.wolf/update-log.md` as a compact summary, merging nearby similar updates when useful

When a decision is made, add it in this format:

```text
### Q: <question>

Asked by: Joel / Prithvi
Date: YYYY-MM-DD
Status: answered

Answer:
<decision>

Reasoning:
- <reason>
- <tradeoff>

Docs updated:
- <doc path>
```

## Pending Questions

### Q: Why not React instead of Next.js if the backend is in Go?

Asked by: Prithvi
Date: 2026-05-29
Status: pending

Answer:
Pending.

Notes:
- Do not answer until Joel decides whether Go is only for the rate limiter or whether more backend services move to Go.
- Related docs to update after decision:
  - `architecture/Architecture.md`
  - `architecture/Stack-and-Tools.md`
  - `planning/Plan.md`
