# InnerScript Buglog Index

Purpose: local, app-scoped index for InnerScript bugs and setup/runtime issues.

Source log: `buglog.jsonl`

## Active Bugs

| ID | Date | Tags | File / area | Error | Fix / status |
|---|---|---|---|---|---|
| innerscript-bug-001 | 2026-06-03 | local-setup, docker, postgres, sandbox | local environment / docker compose | `npm run db:up` failed in sandbox because Docker could not create `/run/user/1000/snap.docker`. | Reran with platform escalation; Docker Postgres containers started. |
| innerscript-bug-002 | 2026-06-03 | local-setup, dependencies, drizzle, migrations | package.json / node_modules | `npm run db:migrate` failed with `drizzle-kit: not found`. | `npm install` started to refresh dependencies; rerun migration after install completes. |
| innerscript-bug-003 | 2026-06-03 | local-setup, database-url, drizzle, migrations | `.env.local` | `npm run db:migrate` spun at `applying migrations` and exited nonzero because `.env.local` pointed to an old Docker-internal `db:5432` URL. | Changed local `DATABASE_URL` to the current host-run Compose URL, `localhost:5433`. |
| innerscript-bug-004 | 2026-06-03 | nextjs, workspace-root, dev-server, warning | `next.config.js` | `npm run dev` started but Next inferred the active-projects parent as workspace root because multiple lockfiles exist. | Not fixed yet; server is running for UI review. Add explicit `outputFileTracingRoot` after review. |
| innerscript-bug-005 | 2026-06-03 | journal, new-note, sidebar, api, validation | `components/journal/journal-app.jsx`; `lib/contracts.js` | Joel could not create new notes from the sidebar. | Allowed empty manual entries and changed New Note to create/select a real blank note immediately. |
| innerscript-bug-006 | 2026-06-03 | nextjs, build, permissions, workspace-root | `.next/server/_instrument_lib_db_index_js.js`; `next.config.js` | `npm run build` failed with permission denied unlinking a generated `.next` file owned by `nobody:nogroup`. | Set `turbopack.root = process.cwd()`; build cleanup is still blocked by local generated file ownership. |
| innerscript-bug-007 | 2026-06-03 | nextjs, build, permissions, local-environment | `.next/` | `rm -rf .next` failed with permission denied on generated files owned by `nobody:nogroup`. | Local production build remains blocked until `.next` is removed or chowned outside this restricted session; tests pass and dev server returns 200 OK. |
| innerscript-bug-008 | 2026-06-03 | journal, ui, title, sidebar, new-note, metadata | `components/journal/entry-editor.jsx`; `components/journal/entry-sidebar.jsx`; `components/journal/journal-app.jsx`; `lib/journal.js` | Joel reported title Enter should jump to body, New Note looked slow/broken, sidebar titles fell back to body text, and sidebar cards showed dates. | Title Enter now focuses body, empty titles stay `Untitled`, sidebar cards show only names, and New Note shows `Creating...` while the blank entry is created. |
| innerscript-bug-009 | 2026-06-03 | journal, ui, autosave, save-status, lint | `components/journal/save-status.jsx` | Joel reported the saving status flashes too fast during autosave. | Save indicator now delays `Saving...`, keeps `Saved` readable briefly, and avoids synchronous effect state updates so lint passes. |
| innerscript-bug-010 | 2026-06-03 | journal, ui, autosave, save-status, user-review | `components/journal/journal-app.jsx`; `components/journal/save-status.jsx`; `components/journal/top-app-bar.jsx` | Joel reported the save status does not change for further edits after the first save cycle. | Added save activity counter and explicit `dirty` state so every edit shows `Unsaved changes`, then `Saving...`, then `Saved`. |
| innerscript-bug-012 | 2026-06-05 | storybook, local-setup, ui, stale-process | `.storybook/main.js`; `package.json`; local Storybook process on port 6006 | Storybook at `localhost:6006` showed `Oh no! Your Storybook is empty`. | Restarted stale Storybook server, verified `/index.json` lists colocated stories, and set the `storybook` script initial path to an existing journal story. |

## Logging Rule

When an InnerScript-specific bug, failed command, runtime error, broken UI state, failed test, or local setup issue appears, append one JSON object to `buglog.jsonl` and add/update the row in this index.
