# InnerScript Update Log

Purpose: track notable project updates, who made them, and what was verified.

## 2026-06-01 — Phase 0 update tracking started

Updated by: Prithvi J

### Summary

- Added this update log as the place to record notable project changes.
- Phase-level task tracking remains in `dev-docs/planning/Atomic-Action-Plan.md`.
- Higher-level roadmap tracking remains in `dev-docs/planning/Plan.md`.

### Notes

Use this file for short narrative updates: what changed, who updated it, what was verified, and what remains open.

## 2026-06-03 — Phase 1 journal UI (Alexandria shell)

Updated by: Prithvi J (with Cursor)

### Summary

- Replaced the Next.js starter home page with a Phase 1 journal shell: sidebar, top bar, and plain-text editor.
- Wired list/create/update flows to existing `/api/entries` endpoints with debounced autosave.
- Applied Alexandria design tokens (dark mode, Noto Serif titles, Lucide icons, responsive editor column).
- Removed placeholder AI insight panel from the editor; reimplementation spec added to `Future-Plan.md`.

### Verified

- `npm run lint` and `npm run build` pass.
- Manual browser check: list entries, edit title/body, autosave, new note, sidebar collapse/expand.

### Open

- Markdown export UI/API, delete entry, `GET /api/entries/today`, autosave component tests.
- Share and more-options top-bar actions remain UI-only placeholders.
- Floating AI insight panel deferred to Phase 5 (source-backed insights).
