<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project Context Rules

- Do not edit files under `dev-docs/` unless the user specifically asks for documentation changes.
- On session start, check `dev-docs/team/Team-Communication.md`, `dev-docs/team/Product-Decisions.md`, and `dev-docs/team/Open-Questions.md`. People working on InnerScript can communicate through these docs; do not rely only on chat history.
- On session start, check `.wolf/session-context.md` and `.wolf/memory.md` so everyone knows what gets loaded and what changed recently.
- On every InnerScript context load, check `dev-docs/engineering-standards/Git-Workflow-Standard.md` before any branch, commit, push, pull, fetch, issue, PR, or merge work.
- At session end, or when more than half the context window is used, add a compact line to `.wolf/memory.md` if relevant InnerScript changes happened. No more than 4 memory lines per session. Use simple words.
- Put simple answered product decisions in `dev-docs/team/Product-Decisions.md`. Put ambiguous or unanswered questions in `dev-docs/team/Open-Questions.md`.
- For InnerScript-specific bugs, failed commands, runtime errors, broken UI states, failed tests, or local setup issues, log them in local `.wolf/buglog.jsonl` and update `.wolf/buglog-index.md`. Use workspace `.wolf/buglog.jsonl` only for cross-workspace/OpenWolf issues.
- Before making code, config, dependency, or setup updates, map the request to `README.md` and the relevant `dev-docs/` notes, then load only the necessary context.
- When an agent answers using information found in project files, include the source files it used. Prefer concise references like `dev-docs/planning/Plan.md` or `AGENTS.md`; include line numbers when useful. This is required because agents may search many files, and the reader needs to know where the answer came from.
- Treat `dev-docs/` as guidance for implementation direction, ownership, guardrails, and Google-worthiness, not as files to automatically update.
- Use `.wolf/update-log.md` for compact tracking of notable project updates: who changed what and what remains open.
- If implementation needs conflict with `dev-docs/`, state the mismatch and ask before changing canonical docs.
- For setup/runtime work, check `README.md`, `dev-docs/architecture/Stack-and-Tools.md`, and `dev-docs/architecture/Architecture.md`.
- For feature/API/schema work, check `dev-docs/planning/Features.md`, `dev-docs/planning/Plan.md`, `dev-docs/planning/Atomic-Action-Plan.md`, and `.wolf/update-log.md` when update history matters.
- For imports/external data, check `dev-docs/guardrails/External-Data-Integrations.md`.
- For AI/search/insights, check `dev-docs/research/Semantic-Meaning-Research.md` and `dev-docs/guardrails/Direction-Guardrails.md`.

## Response Style

- Answer english text in concise words, sacrifice grammar for making the sentences concise.
