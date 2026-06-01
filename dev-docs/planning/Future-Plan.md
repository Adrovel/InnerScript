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
