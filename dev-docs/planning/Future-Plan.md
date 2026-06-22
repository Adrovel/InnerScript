# InnerScript Future Plan

Purpose: hold deferred features that are valuable but should not shape the current MVP schema or implementation path.

## People Mentions And Interaction Linking

Status: deferred from the active MVP plan.

Decision:

- Do not use `person_interaction` as an `entry_type`.
- `entry_type` should describe how text entered the system, not what the text is about.
- People references should first be modeled as sentence-level mentions tied to entries.
- Richer interactions should be built later from confirmed mentions, not raw guesses.

Current implication:

- A journal entry about a person remains `entry_type=journal`.
- A general imported note about a person remains `entry_type=note` with the relevant `source_type`.
- An imported or transcribed conversation about a person remains `entry_type=conversation` with the relevant `source_type`.
- No Phase 1 code should predict whether an entry is a person interaction.

Future scope:

- Sentence-level person mentions that store the sentence where a person was referenced and the entry where it happened.
- Manual confirmation for ambiguous mentions.
- Optional `@person` mention picker after the basic journal/editor flow is stable.
- Person pages with confirmed mentions and source entries.
- `interactions` model or table after confirmed mentions exist.
- Interaction timeline, common topics, open loops, and guarded summaries after interactions exist.
- AI-suggested people mentions only after user confirmation.
- Person-scoped search only after confirmed mentions or confirmed entity extraction exists.

Future mention model sketch:

```text
id
entry_id
person_id nullable
source_id nullable
mentioned_text
sentence_text
start_offset nullable
end_offset nullable
candidate_person_ids jsonb nullable
status pending | confirmed | rejected | ambiguous
created_by manual | ai_suggested_confirmed
created_at
```

Ambiguity behavior:

- If one first name can refer to multiple people, keep `person_id` empty and mark the mention `ambiguous`.
- Store candidate people, but do not resolve automatically.
- The UI should ask the user to choose the correct person, create a new person, or ignore the mention.

Future interaction model sketch:

```text
id
person_id
entry_id
source_id nullable
excerpt nullable
occurred_at nullable
summary nullable
sentiment_label nullable
topics jsonb nullable
open_loops jsonb nullable
created_by manual | ai_suggested_confirmed
created_at
```

Interactions should represent meaningful events or conversations. Mentions only represent that a person was referenced in a sentence.

Guardrails:

- Never auto-create people from journal text without confirmation.
- Never auto-resolve ambiguous first names.
- Never claim facts about a person directly; use language like "Your notes describe...".
- Always show source entries for generated person summaries.
- Keep person linking separate from source provenance.

## Full Debate UI

Status: deferred from the active MVP plan.

Reason:

- A full debate interface changes InnerScript from a journaling and semantic memory product into a debate product.
- It weakens the product focus unless the journal/search/import foundation is already strong.
- The useful part for InnerScript is a small reflection/challenge layer, not a multi-turn debate app.

Future scope:

- Multi-turn debate interface.
- Argument maps.
- Fallacy detection panels.
- Weakness reports.
- Debate history separate from journal entries.
- Optional integration with assumptions or challenge prompts after source-backed insights work.

Guardrails:

- Do not build this before local journaling, imports, search, and source-backed insight foundations are working.
- Keep any future debate UX separate from core journal writing.
- Do not let debate features replace source-backed reflection.

## Thinker And AI People Perspective Modes

Status: visible in the MVP roadmap, but not a Phase 1 implementation item.

Decision:

- Keep this concept visible because it is part of Joel's core product imagination.
- Implement only after manual journaling, source provenance, semantic search, and reflection mode contracts exist.
- Start as user-selected perspective modes, not autonomous people or social agents.

Examples:

- Nietzsche questioning values.
- Alex Hormozi questioning sales mindset.
- Jesus Christ discussing Christianity.
- Machiavelli discussing power.

Guardrails:

- Never pretend to be the real person.
- Label each mode as a simulation, perspective, or lens.
- Separate external thinker perspective from personal-memory claims.
- Use source grounding where possible.
- Do not let this become a generic debate product.
- Do not make AI people converse with each other until single-user reflection modes are useful and safe.

## Streaks And Gamification

Status: deferred from the active MVP plan.

Reason:

- Streaks can push the product toward habit tracking instead of reflective writing.
- Gamification has weak Google technical signal compared with retrieval, imports, provenance, and systems work.
- It should not influence the core schema or Phase 1 journal implementation.

Future scope:

- Optional writing cadence indicators.
- Gentle consistency reminders.
- Non-punitive streaks or weekly writing rhythm views.
- Local-only habit metrics derived from entries.

Guardrails:

- Do not make the home screen streak-first.
- Do not create shame-based empty states or broken-streak pressure.
- Do not prioritize gamification over exportability, search quality, or privacy.

## UI Customization

Status: deferred from the active MVP plan.

Reason:

- Customization is useful, but it should not slow down the core write, organize, reflect, export, and search loop.
- The first version should prove the journal workspace is reliable before adding preference surfaces.

Future scope:

- Basic UI customization options for the journal workspace.

Guardrails:

- Keep customization simple and reversible.
- Do not let themes or layout preferences break writing focus.

## Floating AI Insight Panel (Editor)

Status: deferred from Phase 1 UI. Prototype existed in the journal editor and was removed to keep Phase 1 writing-only.

Reason:

- Phase 1 is local journal core without AI dependencies.
- The panel looked like real AI insight but was rule-based copy from word count.
- Re-adding it belongs with Phase 5 source-backed insights, not placeholder UI.

Target phase: Phase 5 - Insights and Reflection (after search and provenance foundations).

Layout spec (Alexandria / ZenNotes reference):

- Breakpoint: show only at `xl` and above; hide on smaller viewports so the editor stays full width.
- Container: editor uses a flex row — note column on the left, insight aside on the right.
- Note column: responsive max-width (`680px` → `760px` md → `840px` lg); grows to fill remaining space inside the row.
- Gap: `gap-16` (64px) at `xl`, `gap-24` (96px) at `2xl` between note column and insight panel.
- Insight aside: fixed `w-72` (288px), `shrink-0`, `sticky top-8` while scrolling.
- Card: `rounded-xl`, `border border-primary/20`, `bg-background`, `p-4`, `shadow-xl`.
- Header row: Lucide `Brain` icon (18px) + label `AI INSIGHT` in uppercase, `text-[10px]`, `tracking-widest`, primary color.
- Body: short italic suggestion, `text-xs`, `text-on-surface-variant`.

Phase 1 placeholder behavior (do not ship in Phase 1):

- Word-count tiers drove static copy (empty → early signal → pattern forming → deep context).
- Entry type (`journal` vs `note`) could change the empty-state message.

Phase 5+ behavior:

- Replace placeholder copy with source-backed insight from the insights API.
- Every suggestion must cite entry passages or chunks; no identity inference from journal text alone.
- Gate behind a feature flag until insight quality and provenance UI are ready.

Reimplementation checklist:

- [ ] Restore flex row wrapper in `components/journal/entry-editor.jsx` (or extract `InsightPanel.jsx`).
- [ ] Pass insight payload from API/hook, not inline word-count rules.
- [ ] Keep panel out of Phase 1 exit criteria and AI-off mode.
- [ ] Add component test only when insight data is real, not for placeholder tiers.

Reference: Alexandria design tokens in `DESIGN.md`; original ZenNotes HTML used an absolutely positioned card at `left: calc(100% + 12px)` — prefer the flex + gap layout for maintainable spacing on wide screens.
