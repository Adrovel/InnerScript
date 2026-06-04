# Product Knowledge

Purpose: keep durable product knowledge about InnerScript close to the project while the app is being built.

This folder is for knowledge that changes how the product should be designed, explained, scoped, or prioritized. It is not a transcript folder and not a replacement for `planning/Plan.md` or `planning/Atomic-Action-Plan.md`.

## What Belongs Here

- Product knowledge learned while using or building InnerScript.
- Priority changes and the reason each priority changed.
- File-structure and convention decisions that affect how the team works.
- Context about why operational files such as `.wolf/buglog.jsonl`, `.wolf/session-context.md`, `.wolf/memory.md`, and the workspace session log exist.

## What Does Not Belong Here

- Every routine session note.
- Raw chat transcripts.
- Bugs without action: use `.wolf/buglog.jsonl` and `.wolf/buglog-index.md`.
- Atomic implementation tasks: use `dev-docs/planning/Atomic-Action-Plan.md`.
- Phase roadmap: use `dev-docs/planning/Plan.md`.

## Current Files

- `Priority-Change-Log.md` - priority changes, dates, rationale, and effect on plan/checklist.
- `Structure-and-Conventions-Plan.md` - plan for deciding app file structure, naming, `.wolf` usage, product knowledge conventions, and session/context files after discussion with Prithvi.

## Update Rule

When product knowledge changes, update all relevant places in the same session:

- `dev-docs/design/idea.md` for product intent.
- `dev-docs/planning/Plan.md` for phase or priority order.
- `dev-docs/planning/Atomic-Action-Plan.md` for concrete tasks/checklists.
- `dev-docs/product-knowledge/Priority-Change-Log.md` for priority changes and why.
- `dev-docs/team/Product-Decisions.md` or `dev-docs/team/Open-Questions.md` for answered/open decisions.
- `.wolf/update-log.md` for a compact project update.
