# InnerScript Session Memory

Purpose: compact project-local session context. Use this for relevant InnerScript changes only.

Rules:

- Add a line when an InnerScript session ends.
- Add a line if the session reaches more than half of the context window and meaningful InnerScript changes already happened.
- Add no more than 4 lines for one session.
- Keep lines short and simple.
- Include what was loaded, what changed, what is running, and what remains open.
- Do not log routine reads that did not affect the project.

Format:

```text
YYYY-MM-DD | loaded: <short files/docs> | changed: <short changes> | running: <server/db if any> | open: <next thing>
```

## 2026-06-03

2026-06-03 | loaded: OpenWolf, InnerScript AGENTS, dev-docs, latest origin/main | changed: idea, product decisions, team docs, local buglog, docs index | running: db, next dev localhost:3000 | open: UI feedback, landing, meta-project, PeterPorker card
2026-06-03 | loaded: team docs, drizzle history | changed: asked Prithvi why Drizzle | running: db, next 3000 | open: Prithvi answer
2026-06-03 | loaded: product decisions, plan, atomic, guardrails | changed: dev app simpler rule | running: db, next 3000 | open: ui feedback
2026-06-03 | loaded: top bar, sidebar | changed: removed dead share more, cleaned entries list | running: db, next 3000 | open: ui review
2026-06-03 | loaded: journal app, contracts, sidebar | changed: fixed new note, simpler sidebar | running: db, next 3000 | open: browser confirm
2026-06-03 | loaded: editor | changed: metadata moved to footer | running: db, next 3000 | open: editor feel
