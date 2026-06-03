# Team Communication

Purpose: give Joel, Prithvi, agents, and anyone working on InnerScript a shared place to ask questions, leave answers, and coordinate without losing context in chat.

## Session Startup Reminder

When loading InnerScript, people working on the project should check:

1. `dev-docs/team/Product-Decisions.md` for answered product decisions.
2. `dev-docs/team/Open-Questions.md` for unanswered or ambiguous questions.
3. This file for direct team-to-team questions and handoff notes.

If a question changes product direction, add the answer to `Product-Decisions.md` after Joel decides.

## How To Ask A Question

Use this format:

```text
### Q: <short question>

Asked by: Joel / Prithvi / Codex / Claude
Asked to: Joel / Prithvi / anyone
Date: YYYY-MM-DD
Status: open

Context:
- <why this question matters>

Needed for:
- <feature/doc/decision this blocks>
```

## How To Answer

When answered, either:

- move the final decision into `Product-Decisions.md`, or
- update the question status here if it is just a coordination detail.

Use this answer format:

```text
Answer:
<answer>

Follow-up:
- <next action, if any>
```

## Active Team Questions

### Q: Why Drizzle, and what utility does it serve in InnerScript?

Asked by: Joel
Asked to: Prithvi
Date: 2026-06-03
Status: open

Context:
- The latest InnerScript implementation uses Drizzle for schema and migrations.
- Joel wants the implementation rationale from the person who added it, not just an inferred explanation.
- This affects how the team explains the database layer, schema ownership, migration workflow, and Google-signal engineering story.

Needed for:
- `dev-docs/architecture/Stack-and-Tools.md`
- `dev-docs/architecture/Architecture.md`
- future database/schema decisions

### Q: What should each teammate do before changing InnerScript product direction?

Asked by: Joel
Asked to: anyone
Date: 2026-06-03
Status: answered

Context:
- Joel wants product clarity to be captured as the app evolves.
- People working on InnerScript should not rely on ephemeral chat context.

Answer:
Before changing product direction, anyone working on InnerScript should check `Product-Decisions.md`, add ambiguous items to `Open-Questions.md`, and update the relevant planning, architecture, feature, or idea docs in the same session.

Follow-up:
- Keep `AGENTS.md` and `dev-docs/README.md` pointing to these team docs.
