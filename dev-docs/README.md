# InnerScript Dev Docs

Purpose: canonical implementation, planning, research, and guardrail docs for InnerScript.

## Folders

| Folder | Purpose |
|---|---|
| `planning/` | Features, phase plan, atomic task list, estimates, and ownership |
| `architecture/` | System architecture and stack/tooling decisions |
| `research/` | Semantic meaning research and Google-signal benchmarks |
| `guardrails/` | Direction-change rules and external data integration rules |
| `team/` | Joel and Prithvi identity/ownership notes for this project |
| `context/` | Older LLM handoff and teaching context docs |
| `superpowers/` | Older implementation plan/design-spec artifacts retained for reference |

## Canonical Docs

- [Features](./planning/Features.md)
- [Plan](./planning/Plan.md)
- [Atomic Action Plan](./planning/Atomic-Action-Plan.md)
- [Architecture](./architecture/Architecture.md)
- [Stack and Tools](./architecture/Stack-and-Tools.md)
- [Semantic Meaning Research](./research/Semantic-Meaning-Research.md)
- [Google Signal Benchmarks](./research/Google-Signal-Benchmarks.md)
- [Direction Guardrails](./guardrails/Direction-Guardrails.md)
- [External Data Integrations](./guardrails/External-Data-Integrations.md)
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
