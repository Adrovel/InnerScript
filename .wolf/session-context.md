# Session Context

Purpose: define what files change when someone starts, works in, and ends an InnerScript session.

This file is a file-change contract, not a transcript.

## If A Session Starts Now

Expected file change:

- `/home/moneydrome/2026-Projects/.wolf/sessions/*` or OpenWolf session log storage

Reason:

- Workspace `AGENTS.md` requires Codex to run `node .wolf/hooks/session-log.js start codex "open work"` after loading OpenWolf instructions.
- This records a compact start line only.

No InnerScript project file should change just because a session started.

## If A Session Ends Now

Expected file changes:

- `/home/moneydrome/2026-Projects/.wolf/sessions/*` or OpenWolf session log storage
- `.wolf/memory.md` if the session made relevant InnerScript changes

Reason:

- Workspace `AGENTS.md` requires a compact exit line like `close docs server`.
- InnerScript `.wolf/memory.md` captures relevant project-local context: loaded, changed, running, open.

If the session only looked around and changed nothing meaningful, do not update `.wolf/memory.md`.

## If A Session Passes Half The Context Window

Expected file change:

- `.wolf/memory.md` if relevant InnerScript changes already happened

Reason:

- This preserves enough context for the next person or agent without waiting until the end.

Limit:

- No more than 4 `.wolf/memory.md` lines per session.

## If Product Decisions Change

Expected file changes:

- `dev-docs/team/Product-Decisions.md`
- `dev-docs/team/Open-Questions.md` if anything remains ambiguous
- Relevant docs, depending on the decision:
  - `dev-docs/design/idea.md`
  - `dev-docs/planning/Features.md`
  - `dev-docs/planning/Plan.md`
  - `dev-docs/planning/Atomic-Action-Plan.md`
  - `dev-docs/architecture/Architecture.md`
  - `dev-docs/planning/Future-Plan.md`
  - `dev-docs/guardrails/Direction-Guardrails.md`
- `.wolf/update-log.md` for a notable compact update
- `.wolf/memory.md` at session end or half-context checkpoint

## If Joel Gives UI/Product Review While Using The App

Expected file changes:

- `.wolf/user-review.md`
- `.wolf/update-log.md`
- `.wolf/buglog.jsonl` and `.wolf/buglog-index.md` if the review reports broken, lost, confusing, or unreliable behavior
- `.wolf/memory.md` at session end or half-context checkpoint if the review changes what future sessions should know

Reason:

- Hands-on user-review feedback is product evidence for future sessions.
- UI review should survive across sessions instead of staying only in chat.
- Broken writing trust, lost text, slow New Note behavior, or confusing save state should be treated as bugs.

## If A Bug Happens

Expected file changes:

- `.wolf/buglog.jsonl`
- `.wolf/buglog-index.md`
- `.wolf/memory.md` at session end or half-context checkpoint if the bug affected current work

Use workspace `.wolf/buglog.jsonl` only for OpenWolf or cross-workspace issues.

## If Only Local Server State Changes

Expected file changes:

- `.wolf/buglog.jsonl` and `.wolf/buglog-index.md` only if a setup/runtime problem happened
- `.wolf/memory.md` at session end if server/db state matters for the next session

Example:

```text
2026-06-03 | loaded: setup docs | changed: db url bug logged | running: db, next 3000 | open: ui review
```

## If Only Questions Are Asked

Expected file changes:

- `dev-docs/team/Open-Questions.md` if the question should survive the chat
- `dev-docs/team/Product-Decisions.md` if Joel answers it clearly
- `.wolf/memory.md` at session end if the question changes what future people should know

## Who Did What

For each durable change, make authorship clear in the relevant file:

- `.wolf/update-log.md`: use compact `date | who | area | changed | open` lines.
- `Product-Decisions.md`: product decisions are Joel decisions unless noted otherwise.
- `Team-Communication.md`: question entries include `Asked by` and `Asked to`.
- `.wolf/buglog.jsonl`: the `fix` field should say what was changed, not hide the actor.
- `.wolf/memory.md`: keep actor detail short only if useful, e.g. `changed: Joel decisions captured by Codex`.

## What Is Loaded Every Session

People and agents should load these first:

1. Workspace rules: `/home/moneydrome/2026-Projects/AGENTS.md`
2. OpenWolf rules: `/home/moneydrome/2026-Projects/.wolf/OPENWOLF.md`
3. OpenWolf lookup index: `/home/moneydrome/2026-Projects/.wolf/anatomy.md`
4. OpenWolf hot memory: `/home/moneydrome/2026-Projects/.wolf/cerebrum.md`
5. InnerScript rules: `AGENTS.md`
6. Team communication: `dev-docs/team/Team-Communication.md`
7. Product decisions: `dev-docs/team/Product-Decisions.md`
8. Open questions: `dev-docs/team/Open-Questions.md`
9. Local bug index: `.wolf/buglog-index.md`
10. User review notes: `.wolf/user-review.md`
11. Project session memory: `.wolf/memory.md`
12. Git workflow standard: `dev-docs/engineering-standards/Git-Workflow-Standard.md`

Load task-specific docs only when needed:

- Runtime/setup: `README.md`, `dev-docs/architecture/Stack-and-Tools.md`, `dev-docs/architecture/Architecture.md`
- Git work: `dev-docs/engineering-standards/Git-Workflow-Standard.md`
- Product/UI direction: `dev-docs/design/idea.md`, `dev-docs/team/Product-Decisions.md`, `dev-docs/team/Open-Questions.md`
- User-review/UI polish: `.wolf/user-review.md`, `.wolf/update-log.md`, `.wolf/buglog-index.md`
- Feature/API/schema: `dev-docs/planning/Features.md`, `dev-docs/planning/Plan.md`, `dev-docs/planning/Atomic-Action-Plan.md`
- AI/search/insights: `dev-docs/research/Semantic-Meaning-Research.md`, `dev-docs/guardrails/Direction-Guardrails.md`
- Competitors/references: `dev-docs/research/Competitor-Analysis.md`
- Bugs: `.wolf/buglog-index.md`, then exact `.wolf/buglog.jsonl` rows only if needed

## Session Log Style

Use simple words. Avoid long summaries.

Good:

```text
close docs updated server running
close local review blocked by db
close product decisions captured
```

Avoid:

```text
close completed a comprehensive refactor of the product documentation system and established a new local runtime baseline
```

## Project Memory Update Rule

Update `.wolf/memory.md` only when:

- the session ends and InnerScript changed meaningfully
- more than half the context window is used and InnerScript changed meaningfully
- product direction changes
- local setup/runtime state changes
- docs, plans, architecture, team docs, buglog, or product decisions change

Do not update `.wolf/memory.md` more than 4 times in one session.

Each line should capture:

- loaded: important context loaded
- changed: relevant InnerScript changes made
- running: server/db/process state
- open: next unresolved thing

## Current Session Loaded Context Snapshot

2026-06-03 current loaded context:

- workspace `AGENTS.md`
- `.wolf/OPENWOLF.md`
- `.wolf/anatomy.md`
- `.wolf/cerebrum.md`
- InnerScript `AGENTS.md`
- InnerScript `README.md`
- `package.json`
- `docker-compose.yml`
- `.env.local`
- `dev-docs/README.md`
- `dev-docs/design/idea.md`
- `dev-docs/team/Design-Choices.md`
- `dev-docs/team/Product-Decisions.md`
- `dev-docs/team/Open-Questions.md`
- `dev-docs/team/Team-Communication.md`
- `dev-docs/planning/Features.md`
- `dev-docs/planning/Plan.md`
- `dev-docs/planning/Atomic-Action-Plan.md`
- `.wolf/update-log.md`
- `.wolf/user-review.md`
- `dev-docs/architecture/Architecture.md`
- `dev-docs/guardrails/Direction-Guardrails.md`
- `.wolf/buglog-index.md`
