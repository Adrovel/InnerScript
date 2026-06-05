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
2026-06-03 | loaded: progress docs | changed: 40% notification rule added | running: unknown | open: reconcile roadmap percent with checkbox count
2026-06-03 | loaded: journal UI feedback | changed: title Enter focus, compact file-tree sidebar, body prompt, word/character count | running: next 3000 | open: browser confirm
2026-06-03 | loaded: user review | changed: .wolf/user-review.md and session-context now preserve app review across sessions; autosave race patched | running: next 3000 | open: confirm no text disappears
2026-06-04 | loaded: autosave bug path | changed: extracted autosave reconciliation helper and stale-save unit tests | running: next 3000 | open: browser stress review
2026-06-04 | loaded: remote status, phase docs | changed: fetched origin, updated phase progress, reframed imports as external tools agent | running: next 3000 | open: commit/push decision, browser stress review
2026-06-03 | loaded: Open Questions | changed: autosave race reminder added | running: unknown | open: explain editor save races
2026-06-04 | loaded: idea, plan, atomic, standards | changed: product knowledge folder and planning sync rule | running: none | open: Prithvi structure conventions discussion
2026-06-04 | loaded: Product Design brief, idea, DESIGN | changed: innerscript.in landing handover | running: none | open: Joel review, designer visual pass
2026-06-05 | loaded: Storybook setup, Next docs | changed: MSW preview and colocated stories | running: none | open: none
2026-06-05 | loaded: Storybook runtime | changed: logged stale empty Storybook and set initial story path | running: storybook 6006 | open: none
2026-06-05 | loaded: ownership decisions, plan, atomic | changed: unchecked owner split corrected in Plan and Atomic Plan | running: none | open: create future issues from corrected split
2026-06-05 | loaded: reflection plan, entries API | changed: reflection contract and API with local fallback | running: none | open: UI trigger, provider wiring, chunking
2026-06-05 | loaded: semantic plan, architecture | changed: chunking strategy doc and reflection decision made provisional | running: none | open: implement chunking utility
