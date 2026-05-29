# Design Choices

Purpose: track architecture and product decisions in question-answer format.

Use this file when Joel or Prithvi asks a design question that affects architecture, stack, data model, product direction, privacy, Google signal, or implementation ownership.

## Answered Questions

No answered questions yet.

When a decision is made, add it in this format:

```text
### Q: <question>

Asked by: Joel / Prithvi
Date: YYYY-MM-DD
Status: answered

Answer:
<decision>

Reasoning:
- <reason>
- <tradeoff>

Docs updated:
- <doc path>
```

## Pending Questions

### Q: Why not React instead of Next.js if the backend is in Go?

Asked by: Prithvi
Date: 2026-05-29
Status: pending

Answer:
Pending.

Notes:
- Do not answer until Joel decides whether Go is only for the rate limiter or whether more backend services move to Go.
- Related docs to update after decision:
  - `architecture/Architecture.md`
  - `architecture/Stack-and-Tools.md`
  - `planning/Plan.md`

