# Devil's Advocate Integration

Source material:
- `2026-Experimental-Ideas/21-devils-advocate/architecture.md`
- `2026-Experimental-Ideas/21-devils-advocate/features.md`
- Current InnerScript analysis pipeline

## Why It Belongs In InnerScript

InnerScript is not just a journal with mood charts. The stronger product is a journaling insights app that helps users notice their own patterns, assumptions, repeated narratives, and blind spots.

Devil's Advocate should be integrated as a reflective insight layer, not as a separate debate app inside the journal.

## Integration Shape

Use the Devil's Advocate idea in three restrained ways:

1. Assumption extraction from a note.
2. Gentle challenge/reflection for selected thoughts.
3. Multi-note pattern challenge across a week or month.

Do not import the full debate product as-is. Streaming debate chat, ruthless style controls, Tavily research, scorecards, argument maps, and PDF exports are useful in the standalone Devil's Advocate concept but too heavy for the first InnerScript journaling experience.

## Feature Mapping

| Devil's Advocate feature | InnerScript equivalent | Priority |
|---|---|---|
| Core counterargument | `da_reflection` after note analysis | Already partially present |
| Assumption Excavator | "Hidden assumptions" panel for current note | High |
| Weakness Report | "Recurring thinking patterns" weekly insight | Medium |
| Debate Mode | Optional "challenge this thought" chat mode | Medium |
| Intensity settings | Gentle / Direct reflection tone | Low |
| Argument map | Assumption graph across notes | Later |
| Fact-backed research mode | Not default for private journaling | Later |
| Export debate transcript | Export reflections with journal bundle | Later |

## Current-Lightweight Pipeline

```text
POST /api/notes/[id]/analyse
  -> extractNoteMetadata(note.content)
  -> generateDaReflection(note.content, topics)
  -> generateEmbedding(note.content)
  -> upsert note_metadata
```

Keep this for now. It is cheap, non-blocking, and aligned with journaling.

## Proposed Assumption Extraction Pipeline

Add a separate AI function:

```text
extractAssumptions(note.content)
  -> foundational_assumptions[]
  -> empirical_assumptions[]
  -> normative_assumptions[]
  -> scope_assumptions[]
  -> load_bearing_score per assumption
```

Suggested storage:

```text
note_assumptions
  id
  note_id
  assumption_type
  text
  load_bearing_score
  challenge_prompt
  createdAt
  updatedAt
```

Use a separate table instead of overloading `note_metadata`. Assumptions are many-to-one; metadata is one-to-one.

## UX

The UI should stay minimal:

- Analysis tab shows mood, emotion, topics, and summary first.
- A small "Assumptions" section appears only after analysis succeeds.
- Each assumption is one sentence with a quiet `Low`, `Medium`, or `High` marker.
- A "Challenge" button opens Chat with that assumption as context.
- Default tone is direct but not harsh.

Example:

```text
Assumptions

High - "If this work does not move fast, it is failing."
Challenge

Medium - "Other people are evaluating the situation with the same urgency."
Challenge
```

## Challenge Chat Mode

Add a chat mode that is different from normal RAG chat:

```text
mode = "notes" | "challenge"
```

Normal mode:
- Answer questions using selected notes.

Challenge mode:
- Take the selected note or assumption.
- Identify the strongest opposing interpretation.
- Ask one or two clarifying questions.
- Avoid long debate essays.

This keeps the app emotionally usable. The user is journaling; they are not always asking to be attacked.

## Guardrails

- Do not generate medical or diagnostic claims.
- Do not tell the user what they "really" feel.
- Phrase challenges as alternate interpretations, not certainty.
- For intense negative notes, prefer grounding questions over adversarial challenge.
- Always allow analysis to be disabled per note.

## Later Consumer Version

For the hosted version, this can become a paid feature:

- Weekly "blind spots" digest.
- Monthly recurring assumptions.
- Private coach-style reflection prompts.
- Therapist/coach export with raw-note redaction.

For open source, keep it transparent and configurable:

- Prompts live in source-controlled files.
- AI provider is replaceable.
- User can disable Devil's Advocate features entirely.

