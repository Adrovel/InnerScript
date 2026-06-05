
# InnerScript Dev Docs

Purpose: canonical implementation, planning, research, and guardrail docs for InnerScript.

## Folders

| Folder | Purpose |
|---|---|
| `planning/` | Features, phase plan, update log, atomic task list, estimates, and ownership |
| `architecture/` | System architecture and stack/tooling decisions |
| `design/` | Product idea, experience direction, and design choices before implementation |
| `research/` | Semantic meaning research and Google-signal benchmarks |
| `guardrails/` | Direction-change rules and external data integration rules |
| `engineering-standards/` | InnerScript-local engineering rules for git workflow, branches, commits, PRs, and merges |
| `product-knowledge/` | Product knowledge, priority changes, and structure/convention decisions learned while building |
| `team/` | Team communication, product decisions, open questions, and identity/ownership notes |
| `context/` | Older LLM handoff and teaching context docs |
| `superpowers/` | Older implementation plan/design-spec artifacts retained for reference |

## Canonical Docs

- [Project Session Memory](../.wolf/memory.md)
- [Local Buglog Index](../.wolf/buglog-index.md)
- [Features](./planning/Features.md)
- [Plan](./planning/Plan.md)
- [Atomic Action Plan](./planning/Atomic-Action-Plan.md)
- [Update Log](../.wolf/update-log.md)
- [Future Plan](./planning/Future-Plan.md)
- [InnerScript Idea](./design/idea.md)
- [InnerScript.in Landing Page Handover](./design/InnerScript.in-Landing-Page-Handover.md)
- [Architecture](./architecture/Architecture.md)
- [Stack and Tools](./architecture/Stack-and-Tools.md)
- [Team Communication](./team/Team-Communication.md)
- [Session Context](../.wolf/session-context.md)
- [Product Decisions](./team/Product-Decisions.md)
- [Open Questions](./team/Open-Questions.md)
- [Design Choices](./team/Design-Choices.md)
- [Competitor Analysis](./research/Competitor-Analysis.md)
- [Semantic Meaning Research](./research/Semantic-Meaning-Research.md)
- [Google Signal Benchmarks](./research/Google-Signal-Benchmarks.md)
- [Direction Guardrails](./guardrails/Direction-Guardrails.md)
- [External Data Integrations](./guardrails/External-Data-Integrations.md)
- [Git Workflow Standard](./engineering-standards/Git-Workflow-Standard.md)
- [Product Knowledge](./product-knowledge/README.md)
- [Priority Change Log](./product-knowledge/Priority-Change-Log.md)
- [Structure and Conventions Plan](./product-knowledge/Structure-and-Conventions-Plan.md)
- [Joel Identity](./team/Joel-Identity.md)
- [Prithvi Identity](./team/Prithvi-Identity.md)
- [LLM Context](./context/InnerScript-LLM-Context.md)
- [Teaching Context](./context/Teaching-Context.md)
- [Older Superpowers Plan](./superpowers/plans/2026-05-08-innerscript-improvement.md)
- [Older Superpowers Design Spec](./superpowers/specs/2026-05-08-innerscript-improvement-design.md)

## Organization Reminder

If implementation creates more than three loose docs in one folder, or if a doc mixes planning, architecture, research, and guardrails, stop and reorganize `dev-docs` before continuing.

Agents should notify Joel with:

```text
DEV-DOCS ORGANIZATION CHECK
Reason: <why organization is needed>
Suggested move: <files/folders>
Decision needed: yes/no
```
