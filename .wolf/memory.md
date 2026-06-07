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
2026-06-05 | loaded: Storybook setup, Next docs | changed: MSW preview and colocated stories | running: none | open: none
2026-06-05 | loaded: Storybook runtime | changed: logged stale empty Storybook and set initial story path | running: storybook 6006 | open: none
2026-06-07 | loaded: sidebar design target | changed: identity header toggle, shared sidebar row sizing | running: next 3000 existing | open: none
2026-06-07 | loaded: sidebar component | changed: sidebar toggle uses double chevrons | running: unknown | open: none
2026-06-07 | loaded: sidebar row styles | changed: New Note matches Search row | running: unknown | open: none
2026-06-07 | loaded: sidebar spacing | changed: more gap under identity header | running: unknown | open: none
2026-06-07 | loaded: sidebar selection | changed: folder rows stay neutral, selected files highlight | running: unknown | open: none
2026-06-07 | loaded: stash docs | changed: restored dev-docs planning/product decisions, dropped non-doc stash | running: unknown | open: review doc diff
2026-06-07 | loaded: AGENTS | changed: source-file citation rule added | running: unknown | open: none
2026-06-07 | loaded: shadcn sidebar, app shell | changed: sidebar uses shadcn provider/inset/menu | running: none | open: none
2026-06-07 | loaded: shadcn collapsible | changed: sidebar groups use Collapsible | running: none | open: none
2026-06-07 | loaded: sidebar groups | changed: chevrons moved left | running: none | open: none
2026-06-07 | loaded: sidebar actions | changed: removed Reload entries | running: none | open: none
2026-06-07 | loaded: shadcn dropdown, sidebar CRUD | changed: entry action menu deletes notes/journals | running: none | open: none
2026-06-07 | loaded: sidebar dropdown bugs | changed: fixed trigger open behavior and interaction coverage | running: next 3000 existing | open: none
2026-06-07 | loaded: sidebar nested rows | changed: entry rows extend right, ellipsis pinned | running: next 3000 existing | open: none
2026-06-07 | loaded: sidebar row sizing | changed: child entries match group row size | running: next 3000 existing | open: none
