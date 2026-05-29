# Feature Roadmap and Work Split

## Product Direction

InnerScript should become a minimal journaling insights app:

- Write quickly.
- Keep data private.
- See patterns over time.
- Search by meaning.
- Get useful reflection prompts without turning the app into a chatbot-first product.

Two distributions should be planned from the start:

| Version | Goal |
|---|---|
| Open-source local | Developers and privacy-focused users can download, inspect, and run it locally. |
| Consumer hosted | Non-technical users get a polished hosted app with accounts, sync, billing, and backups. |

Build the local product first. Hosted consumer mode should reuse the same core modules rather than becoming a second app.

## Suggested Feature Roadmap

### Phase 1 - Local App Completeness

Owner fit: Prithvi can take more of this if he is onboarding into the codebase.

- Fix daily note behavior and make it obvious in the UI.
- Add Markdown export for all notes.
- Add CSV/JSON export for mood/topic metadata.
- Add `.env.example` and local setup docs.
- Add AI-disabled fallback mode.
- Add privacy doc.
- Add smoke test for create note -> save -> reload.

Why: this makes the app credible as open source.

### Phase 2 - Journaling Insights

Owner fit: Joel should own product judgment and AI behavior; Prithvi can own charts/API polish.

- Improve mood timeline.
- Improve topic frequency view.
- Add weekly digest generation.
- Add topic drill-down to list matching notes.
- Add semantic search scopes: current note, folder, date range, all notes.
- Add "not enough data yet" states.

Why: this is the core "journaling insights" promise.

### Phase 3 - Devil's Advocate Reflection Layer

Owner fit: Joel should own prompts and UX tone; Prithvi can own schema/API/UI wiring.

- Add assumption extraction.
- Store assumptions in a separate `note_assumptions` table.
- Show assumptions in the analysis rail.
- Add "Challenge this" action that opens chat in challenge mode.
- Add weekly recurring-assumptions digest.

Why: this differentiates InnerScript from a generic mood tracker.

### Phase 4 - Open-Source Readiness

Owner fit: Prithvi can own docs and setup checks; Joel reviews messaging and architecture.

- Clean README.
- Add Local Setup doc.
- Add Privacy doc.
- Add Architecture doc.
- Add Contributing doc.
- Add demo seed data.
- Add `npm run doctor` or equivalent setup check.
- Add screenshots after UI stabilizes.

Why: people should be able to clone it and run it without asking you.

### Phase 5 - Consumer Hosted Version

Owner fit: Joel should decide product/business boundaries; Prithvi can implement backend slices.

- Add auth.
- Add user ownership to notes/folders/metadata.
- Add hosted database isolation.
- Add rate limits for analysis/chat.
- Add billing for AI-heavy usage.
- Add account export/delete.
- Add background jobs for weekly digests.

Why: hosted mode needs trust, cost control, and account boundaries.

## Joel / Prithvi Work Split

### Joel

Primary responsibility: product direction, architecture, AI behavior, interview-defensible system design.

Good tasks:

- Define minimal UI behavior.
- Own insight taxonomy: mood, topics, assumptions, weekly digest.
- Write and tune AI prompts.
- Decide open-source vs hosted boundaries.
- Design hosted architecture: auth, rate limits, billing, data isolation.
- Review database schema decisions.
- Build the more complex RAG/challenge logic.
- Keep README/product copy honest and source-backed.

### Prithvi

Primary responsibility: implementation throughput on clear slices.

Good tasks:

- Build export endpoints and export UI.
- Improve setup docs and `.env.example`.
- Add smoke/integration tests.
- Implement charts and drill-down screens.
- Build assumption table/model/API once schema is agreed.
- Add loading, empty, and error states.
- Add setup/doctor script.
- Help with Docker/local bootstrap.

## Suggested First Sprint

### Joel

1. Finalize the minimum insight model:
   - mood
   - emotion
   - topics
   - summary
   - assumptions
   - weekly digest
2. Write the exact prompt contract for assumption extraction.
3. Decide local-first privacy rules:
   - what leaves the machine
   - what is disabled without API key
   - what can be exported

### Prithvi

1. Add `.env.example`.
2. Add `docs/Local-Setup.md`.
3. Add `docs/Privacy.md`.
4. Add Markdown export endpoint.
5. Add CSV metadata export endpoint.
6. Add tests for export endpoints.

## Near-Term Feature Suggestions

Highest leverage features:

1. Markdown export.
2. AI-disabled mode.
3. Weekly digest.
4. Assumption extraction.
5. Topic drill-down.
6. Search scopes.
7. Local setup doctor.
8. Privacy documentation.

Avoid for now:

- Mobile app.
- Full WYSIWYG editor.
- Streaks/habit gamification.
- Full social/sharing features.
- Heavy debate UI.
- Cloud sync before local app is polished.

