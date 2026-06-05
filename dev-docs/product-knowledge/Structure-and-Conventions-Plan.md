# Structure And Conventions Plan

Purpose: decide InnerScript's file structure, naming conventions, context folders, operational files, and product-knowledge workflow before the project grows harder to reorganize.

Status: open. This needs discussion with Prithvi before final decisions are locked.

## Decision Goal

Define a stable project structure that tells contributors where to put:

- app source files
- API routes
- database schema and migrations
- tests
- product knowledge
- product decisions and open questions
- operational context such as buglogs, session context, memory, and session logs
- engineering standards
- future import/parser/search/AI modules

## Current Known Structure

| Area | Current location | Current role |
|---|---|---|
| App source | `app/`, `components/`, `lib/` | Next.js app, journal UI, shared utilities |
| Planning docs | `dev-docs/planning/` | roadmap, phase plan, atomic checklist, future plan |
| Product idea | `dev-docs/design/idea.md` | product thesis and experience direction |
| Team decisions | `dev-docs/team/` | product decisions, open questions, communication, identity |
| Engineering standards | `dev-docs/engineering-standards/` | InnerScript-local engineering rules |
| Product knowledge | `dev-docs/product-knowledge/` | product knowledge, priority changes, structure/conventions plan |
| Operational files | `.wolf/` | buglog, memory, session context, update log, user review |
| Workspace session log | `/home/moneydrome/2026-Projects/.wolf/sessions` | compact Codex/Claude session start/exit lines |

## Decisions Needed With Prithvi

### 1. `.wolf` Naming And Role

Question:
Should InnerScript keep `.wolf/` as the app-local operational folder, rename it, or mirror a subset under `dev-docs/product-knowledge/`?

Current recommendation:
Keep `.wolf/` for operational logs because OpenWolf already uses that convention. Add human-facing explanations and decision summaries in `dev-docs/product-knowledge/` when the meaning matters to product or team workflow.

Decision options:

- Keep `.wolf/` unchanged for operational files.
- Keep `.wolf/`, but add README-style documentation explaining each file.
- Rename app-local operational files later if OpenWolf no longer depends on the path.
- Mirror important conclusions into product knowledge while keeping raw operational files in `.wolf/`.

### 2. Operational File Responsibilities

Current proposed responsibilities:

| File | Responsibility |
|---|---|
| `.wolf/buglog.jsonl` | append-only structured bug records |
| `.wolf/buglog-index.md` | human-readable bug index |
| `.wolf/session-context.md` | what gets loaded and what changes during sessions |
| `.wolf/memory.md` | compact project-local handoff memory |
| `.wolf/update-log.md` | compact notable update log |
| `.wolf/user-review.md` | durable hands-on app review notes |
| workspace `.wolf/sessions` | compact start/exit session log |
| `dev-docs/product-knowledge/Priority-Change-Log.md` | priority changes and reasons |
| `dev-docs/product-knowledge/README.md` | product-knowledge routing rules |

Open question:
Should `.wolf/update-log.md` stay separate from `Priority-Change-Log.md`, or should priority changes be referenced from update-log entries only?

Current recommendation:
Keep both. `.wolf/update-log.md` is compact operational history. `Priority-Change-Log.md` explains priority changes and why they matter.

### 3. Source Folder Conventions

Questions for Prithvi:

- Should journal-specific components stay under `components/journal/`?
- Should feature logic move toward `features/journal/`, `features/imports/`, `features/search/`, etc. later?
- Should `lib/` hold shared utilities only, while feature-specific utilities live near their feature?
- Where should Drizzle schema, migrations, and database adapters be considered canonical?
- Should tests mirror source folders or stay grouped by test type?

Current recommendation:
Do not restructure source code yet. Decide conventions first, then move only when a feature boundary is clear.

### 4. Documentation Conventions

Rules to decide:

- Each new durable product insight goes into product knowledge, idea, plan, or team docs based on routing.
- Each priority change must update `Priority-Change-Log.md`, `Plan.md`, and `Atomic-Action-Plan.md`.
- Each implementation change must update `idea.md`, `Plan.md`, and `Atomic-Action-Plan.md` if it affects product behavior, phase scope, or priority.
- New docs need `dev-docs/README.md` index updates.
- New folders need workspace anatomy updates.

### 5. Branch / Commit / PR Conventions

Already decided:

- InnerScript branch names use `<type>/<short-description>`.
- No `codex/` branch prefixes for InnerScript.
- Conventional Commits are required.

Canonical file:

- `dev-docs/engineering-standards/Git-Workflow-Standard.md`

### 6. Collaborator Catch-Up Format

Question:
What prompt, session format, or output format should help a new collaborator quickly understand what others have done?

Non-blocking need:
Create a short reusable handoff format that answers:

- what changed
- why it changed
- which files matter
- what decisions were made
- what remains open
- what the next person should read first
- what they should not touch yet

Current recommendation:
Add a collaborator catch-up prompt or template after the structure discussion with Prithvi. It should be short enough to use every session, but structured enough that a contributor can get productive without reading every doc.

### 7. Joel / Prithvi Work Boundary

Question:
Where is the line between Joel's work and Prithvi's work?

Non-blocking need:
Clarify ownership so the project can move in parallel without either person waiting unnecessarily.

Current provisional split:

- Joel: product thesis, priorities, Google signal, AI behavior, privacy boundaries, architecture approval, evaluation criteria, landing voice.
- Prithvi: scoped implementation, API wiring, database/migration work, parser implementation, tests, local setup, UI implementation after behavior is specified.
- Shared: file-structure conventions, product decisions that affect implementation, and final review of risky product behavior.

Open point:
Prithvi should review and refine this split before it becomes a locked team convention.

## Proposed Decision Session With Prithvi

Agenda:

1. Review current folders and pain points.
2. Decide `.wolf` role and whether a README is needed.
3. Decide product knowledge folder responsibilities.
4. Decide app source folder conventions for journal, imports, search, AI, people, and shared utilities.
5. Decide test folder conventions.
6. Decide the collaborator catch-up prompt/session/output format.
7. Clarify Joel/Prithvi work boundaries.
8. Update `Product-Decisions.md`, `Open-Questions.md`, `Plan.md`, and `Atomic-Action-Plan.md` after decisions.

Exit criteria:

- File/folder responsibilities are clear.
- `.wolf` files are either accepted as operational files or a migration path is written.
- Product knowledge folder update rules are accepted.
- Future implementation can proceed without guessing where context belongs.
