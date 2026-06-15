# InnerScript Update Log

Purpose: compact app-local update log. One line per notable change.

Format:

```text
YYYY-MM-DD | who | area | changed | open
```

## Log

2026-06-01 | Prithvi | planning | update log started | open: keep plan/atomic separate
2026-06-03 | Prithvi | UI | Phase 1 Alexandria journal shell, entries API wiring | open: export, today entry, tests
2026-06-03 | Joel+Codex | product | therapy/reflection-first idea captured | open: UI style, landing, meta-project, PeterPorker card
2026-06-03 | Joel+Codex | team | team communication, product decisions, open questions added | open: people use team docs
2026-06-03 | Joel+Codex | meta | session context and memory moved under local .wolf | open: keep entries compact
2026-06-03 | Joel+Codex | planning | development app must stay simple | open: choose next small build
2026-06-03 | Joel+Codex | setup | db, migrations, next dev running on localhost:3000 | open: Next root warning
2026-06-03 | Joel+Codex | UI | removed dead Share/More, Refresh reloads entries | open: sidebar style
2026-06-03 | Joel+Codex | bug | New Note creates/selects blank note | open: browser confirm
2026-06-03 | Joel+Codex | UI | created/edited metadata moved to footer | open: editor feel
2026-06-03 | Joel+Codex | planning | progress bars and simpler roadmap added | open: keep progress current
2026-06-03 | Joel+Codex | planning | added 40% progress notification rule to roadmap and checkbox plans | open: reconcile roadmap percent with checkbox count
2026-06-03 | Joel+Codex | planning | atomic plan aligned with new product decisions and reflection-question phase | open: recount checkbox totals
2026-06-03 | Joel+Codex | UI | fixed title Enter focus, sidebar title fallback/date display, and New Note creating feedback | open: browser confirm
2026-06-03 | Joel+Codex | UI | body prompt changed to How was your day, sidebar made compact/file-tree-like, word and character counts shown | open: browser confirm
2026-06-03 | Joel | UI review | confirmed title Enter, New Note, empty-title sidebar behavior, compact sidebar, and word/character count | open: continue editor polish
2026-06-03 | Joel+Codex | UI | loading skeleton made calmer and closer to editor/sidebar layout | open: browser confirm
2026-06-03 | Joel+Codex | design | secondary teal palette candidate noted in DESIGN.md for future sidebar highlight pass | open: not applied yet
2026-06-03 | Joel+Codex | UI | stronger hover and pressed interaction feedback added, especially for sidebar note rows | open: browser confirm
2026-06-03 | Joel+Codex | UI | interaction transitions smoothed with softer timing curve | open: browser confirm
2026-06-03 | Joel+Codex | UI | autosave status flicker minimized with delayed Saving and readable Saved timing | open: browser confirm
2026-06-03 | Joel+Codex | session context | user review file added to session startup contract and UI review workflow | open: keep reviews current
2026-06-03 | Joel+Codex | UI | title hashtag marker removed | open: browser confirm
2026-06-03 | Joel+Codex | UI | save status now reactivates on every edit using dirty state and activity counter | open: browser confirm
2026-06-04 | Joel+Codex | tests | autosave reconciliation extracted to lib/autosave.js with unit tests for stale-save text-loss regression | open: browser stress review
2026-06-04 | Joel+Codex | git | fetched origin and verified main is 0 ahead / 0 behind origin/main | open: local work remains uncommitted
2026-06-04 | Joel+Codex | planning | phase progress updated: overall 26%, Phase 1 65%, Phase 1.5 85%; atomic progress 29/132 visible tasks | open: export/today/delete polish and browser stress review
2026-06-04 | Joel+Codex | planning | WhatsApp-only import wording reframed as external tools export/import agent, with WhatsApp as one example parser | open: decide first external-tool parser target
2026-06-03 | Joel+Codex | question | autosave race learning reminder added to Open Questions | open: explain editor save races
2026-06-04 | Joel+Codex | engineering standards | git workflow standard added and branch renamed to fix/journal-autosave-feedback | open: push/PR after review
2026-06-05 | Joel+Codex | Storybook | AI setup completed with MSW preview and colocated journal/UI stories | open: none
2026-06-05 | Joel+Codex | Storybook | fixed empty Storybook state by restarting stale server and setting initial story path | open: none
2026-06-07 | Prithvi+Codex | UI | sidebar identity header holds collapse toggle; New Note/Search/Journal/Note rows share one row size with chevrons accommodated | open: none
2026-06-07 | Prithvi+Codex | UI | sidebar collapse and expand controls now use double-chevron icons | open: none
2026-06-07 | Prithvi+Codex | UI | New Note row now matches Search row styling | open: none
2026-06-07 | Prithvi+Codex | UI | sidebar identity header has more space before action rows | open: none
2026-06-07 | Prithvi+Codex | UI | sidebar folder rows stay neutral while selected files are highlighted | open: none
2026-06-07 | Prithvi+Codex | UI | journal sidebar rebuilt on shadcn Sidebar primitives with reload/search/new-note/group behavior preserved | open: none
2026-06-07 | Prithvi+Codex | UI | sidebar Journal/Note groups now use shadcn Collapsible instead of custom openGroups state | open: none
2026-06-07 | Prithvi+Codex | UI | sidebar group chevrons moved to the left of Journal and Note rows | open: none
2026-06-07 | Prithvi+Codex | UI | Reload entries removed from sidebar and stale Storybook interaction removed | open: none
2026-06-07 | Prithvi+Codex | UI | top-right Edited timestamp removed from save status | open: none
2026-06-07 | Prithvi+Codex | UI | sidebar child entry rows now fill submenu width for full-row highlight | open: none
2026-06-07 | Prithvi+Codex | UI/tests | sidebar entry dropdown actions can delete notes/journals; Storybook pre-optimizes Base UI menu | open: none
2026-06-07 | Prithvi+Codex | UI/tests | fixed entry action trigger open state and row-selection isolation coverage | open: none
2026-06-07 | Prithvi+Codex | UI | nested sidebar entries now extend to the right edge with ellipsis pinned at row end | open: none
2026-06-07 | Prithvi+Codex | UI | child sidebar entries now match Journal/Note group row sizing | open: none
2026-06-07 | Prithvi+Codex | UI | fixed Search split line overflow outside sidebar | open: none
2026-06-07 | Prithvi+Codex | UI | New Note follows selected group and Journal/Note plus buttons create typed entries | open: none
2026-06-11 | Prithvi+Codex | Storybook/UI | sidebar module moved to components/sidebar with explicit component files and isolated stories | open: none
2026-06-11 | Prithvi+Codex | UI | sidebar top simplified to Innerscript plus collapse; profile avatar row moved to footer with empty dots menu | open: none
2026-06-11 | Prithvi+Codex | UI | sidebar search changed from separate reveal row to inline input row | open: none
2026-06-11 | Prithvi+Codex | DB/API | folders table, document entry type, journal_date, and folder APIs added with tests | open: frontend tree wiring
2026-06-12 | Prithvi+Codex | DB | dev Postgres migrated to folder model and invalid app rows cleared | open: none
2026-06-12 | Prithvi+Codex | UI | default Note sidebar group removed; non-journal entries render at root | open: folder tree wiring
2026-06-12 | Prithvi+Codex | UI | sidebar empty no-entries message removed; search no-results kept | open: folder tree wiring
2026-06-12 | Prithvi+Codex | setup | worktree .env.local points runtime to local Postgres; entries API loads empty list | open: none
2026-06-12 | Prithvi+Codex | folders | Journal is a seeded default folder; sidebar grouping and journal creation use folder_id plus journal_date | open: nested folder tree wiring
2026-06-12 | Prithvi+Codex | architecture | journal page uses initial data helper, renders server-composed client app, and DB helpers are server-only | open: none
2026-06-13 | Prithvi+Codex | UI | sidebar can create root folders inline; folder plus menu creates files or nested folders | open: none
2026-06-15 | Prithvi+Codex | UI | folder rows now show options menu after plus button | open: folder rename/delete API
2026-06-15 | Prithvi+Codex | sidebar CRUD | file and folder rename use inline editing; empty folders can be deleted | open: non-empty folder delete messaging
2026-06-15 | Prithvi+Codex | cleanup | journal app duplicated rename/list/skeleton code reduced | open: none
2026-06-15 | Prithvi+Codex | cleanup | journal-app split into shell, workspace hook, autosave hook, state helpers; files under 500 lines | open: none
2026-06-15 | Prithvi+Codex | folders | folder delete now cascades child folders and entries instead of 500ing on FK restrict | open: none
2026-06-15 | Prithvi+Codex | editor UX | new file creation selects the full Untitled title once so typing replaces it without repeated reselection | open: none
