# Priority Change Log

Purpose: record InnerScript priority changes as the product is built, including why the priority changed and what docs/tasks were updated.

Format:

```text
YYYY-MM-DD | changed by | priority change | reason | docs/tasks updated | open follow-up
```

## Log

2026-06-03 | Joel+Codex | journal reliability before AI/reflection | Joel's local review showed writing trust, New Note behavior, metadata placement, and save status were the immediate product blockers | `design/idea.md`, `planning/Plan.md`, `planning/Atomic-Action-Plan.md`, `.wolf/user-review.md`, `.wolf/update-log.md` | browser stress review remains postponed
2026-06-04 | Joel+Codex | git workflow standards before more branch/commit work | Branch and commit names needed to follow project conventions, not agent-specific naming | `dev-docs/engineering-standards/Git-Workflow-Standard.md`, `AGENTS.md`, `dev-docs/README.md`, `.wolf/session-context.md` | none
2026-06-04 | Joel+Codex | product knowledge and structure conventions before further app changes | Joel wants app context, structure, priority changes, `.wolf` files, session context, memory, and conventions decided with Prithvi instead of drifting as the app grows | `design/idea.md`, `planning/Plan.md`, `planning/Atomic-Action-Plan.md`, `product-knowledge/README.md`, `product-knowledge/Structure-and-Conventions-Plan.md` | discuss with Prithvi and lock conventions
2026-06-04 | Joel+Codex | landing page handover before visual design | Joel wants `innerscript.in` to pitch the idea to collaborators/builders/investors, act as an employer-facing project site, and explain the problem to lay users | `design/InnerScript.in-Landing-Page-Handover.md`, `design/idea.md`, `planning/Plan.md`, `planning/Atomic-Action-Plan.md`, `team/Product-Decisions.md` | Joel review, final CTA, visual design
2026-06-05 | Joel+Codex | highest interview-signal layers before feature completeness | Google discussions reward architecture, tradeoffs, ownership, technical decisions, and system thinking more than complete dashboards/imports/analytics | `planning/Plan.md`, `planning/Features.md`, `planning/Atomic-Action-Plan.md`, `design/idea.md`, `team/Product-Decisions.md` | keep resume claims truthful; build MVP then retrieval/Graph RAG foundations
2026-06-05 | Joel+Codex | task-level ownership corrected in atomic planning | Atomic tasks still assigned chunking, embeddings, retrieval, and insight implementation to Prithvi even though Joel should own unfamiliar AI/backend/system learning work | `planning/Atomic-Action-Plan.md`, `planning/Plan.md` | keep checked tasks unchanged; use corrected owner split for future issues/branches
2026-06-05 | Joel+Codex | Markdown export deprioritized from the immediate MVP path | Export matters for trust, but Google-signal work now needs reflection, chunking, embeddings, retrieval, citations, and evaluation sooner | `planning/Plan.md`, `planning/Atomic-Action-Plan.md`, `planning/Features.md`, `team/Product-Decisions.md` | implement export later as Phase 3.2 trust feature
