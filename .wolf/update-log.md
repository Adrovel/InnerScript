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
2026-06-04 | Joel+Codex | product knowledge | product knowledge folder, priority-change log, and structure/conventions plan added | open: discuss `.wolf`, source folders, tests, and conventions with Prithvi
2026-06-04 | Joel+Codex | landing | innerscript.in landing page designer handover added | open: Joel review, visual design, final CTA
2026-06-05 | Joel+Codex | strategy | shifted plan toward highest interview-signal layers before feature completeness | open: build MVP then retrieval/Graph RAG foundations
2026-06-05 | Joel+Codex | Storybook | AI setup completed with MSW preview and colocated journal/UI stories | open: none
2026-06-05 | Joel+Codex | Storybook | fixed empty Storybook state by restarting stale server and setting initial story path | open: none
2026-06-05 | Joel+Codex | planning | corrected unchecked atomic ownership so Joel owns AI/retrieval/backend/system work and Prithvi owns frontend delivery/verification | open: create future issues from corrected owner split
