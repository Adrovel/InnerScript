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
2026-06-11 | loaded: AGENTS, team docs, session memory | changed: AGENTS response style rule added | running: unknown | open: none
2026-06-11 | loaded: sidebar Storybook, README, design docs | changed: exported sidebar parts and isolated stories | running: none | open: none
2026-06-11 | loaded: sidebar module | changed: sidebar moved to components/sidebar explicit files, no index barrel | running: none | open: none
2026-06-11 | loaded: shadcn avatar/sidebar, Next client docs | changed: sidebar top brand simplified, profile footer added | running: next 3000 existing | open: none
2026-06-11 | loaded: sidebar profile, shadcn docs | changed: footer avatar color lightened | running: none | open: none
2026-06-11 | loaded: sidebar profile, brand | changed: footer profile row lightened, brand text bigger | running: none | open: none
2026-06-11 | loaded: sidebar search | changed: search row is inline input | running: none | open: none
2026-06-11 | loaded: schema, contracts, API tests | changed: document entry type, folders table, journal_date, folder APIs | running: postgres test 5434 | open: frontend folder tree wiring
2026-06-12 | loaded: git workflow, origin/main | changed: feature/document-folder-model from latest main with backend WIP reapplied | running: none | open: stash safety copy
2026-06-12 | loaded: README, DB docs, docker state | changed: dev DB migrated to 0002 and entries/sources/folders cleared | running: postgres 5433/5434 | open: none
2026-06-12 | loaded: sidebar data/stories | changed: removed default Note group, root notes still visible | running: none | open: folder tree wiring
2026-06-12 | loaded: sidebar app/message/stories | changed: removed sidebar no-entries message, kept search no-results | running: none | open: folder tree wiring
2026-06-12 | loaded: Next data/security docs, app/data layer | changed: initial data helper, no no-SSR journal wrapper, DB helpers server-only | running: next 3000 existing | open: none
2026-06-13 | loaded: sidebar/folder docs, Next client docs | changed: root and nested inline folder create, folder plus menu | running: next 3000, postgres 5433/5434 | open: none
2026-06-15 | loaded: sidebar folder controls | changed: folder options menu after plus | running: none | open: folder rename/delete API
2026-06-15 | loaded: folder/file CRUD | changed: inline rename for files/folders, empty folder delete | running: none | open: non-empty folder delete message
2026-06-15 | loaded: journal app | changed: reduced duplicate rename/list/skeleton code | running: none | open: none
2026-06-15 | loaded: journal app split | changed: app shell, workspace hook, autosave hook, state helpers | running: none | open: none
2026-06-17 | loaded: Markdown editor plan, Next docs | changed: CodeMirror live Markdown editor, inactive heading/list marker polish, react-markdown renderer helper, autosave clear fix, local entries/sources cleared | running: next 3000 existing | open: export route later
2026-06-17 | loaded: Markdown editor, Next dev docs | changed: autosave echo guard, Webpack build script, 127 dev origin, buglogs | running: next 3000 existing | open: none
2026-06-18 | loaded: markdown editor, user screenshot | changed: fixed inactive heading/list prefix spacing and logged bugs | running: stale 3000 listener only | open: browser smoke blocked by local browser setup
2026-06-18 | loaded: wolf docs | changed: removed browser tool name refs from wolf docs | running: stale 3000 listener only | open: none
2026-06-18 | loaded: markdown editor screenshot | changed: inactive inline markdown markers hidden, bug logged | running: stale 3000 listener only | open: none
2026-06-18 | loaded: markdown editor heading bug | changed: heading markers replaced, token sizes added, bug logged | running: stale 3000 listener only | open: none
2026-06-19 | loaded: markdown editor, Next CSS docs | changed: moved editor styling into editorTheme.css import | running: next 3000 existing | open: none
2026-06-19 | loaded: markdown renderer refs | changed: removed unused react-markdown renderer and packages | running: next 3000 existing | open: none
2026-06-19 | loaded: markdown editor helper | changed: heading prefix hide keeps extra spaces as text | running: none | open: none
2026-06-19 | loaded: editor layout | changed: editor column narrowed | running: next 3000 existing | open: none
2026-06-19 | loaded: top bar and shadcn breadcrumb | changed: navbar breadcrumb left, save state right | running: next 3000 existing | open: none
2026-06-20 | loaded: sidebar/top bar context | changed: inline sidebar expand in top bar, no breadcrumb overlap | running: next 3001, existing 3000 occupied | open: none
2026-06-22 | loaded: editor layout | changed: footer below full-height scrollable editor, Storybook frame fixed, bug logged | running: none | open: none
