<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project Context Rules

- Do not edit files under `dev-docs/` unless the user specifically asks for documentation changes.
- Before making code, config, dependency, or setup updates, map the request to `README.md` and the relevant `dev-docs/` notes, then load only the necessary context.
- Treat `dev-docs/` as guidance for implementation direction, ownership, guardrails, and Google-worthiness, not as files to automatically update.
- Use `dev-docs/planning/Update-Log.md` for narrative tracking of notable project updates: who updated it, what changed, what was verified, and what remains open.
- If implementation needs conflict with `dev-docs/`, state the mismatch and ask before changing canonical docs.
- For setup/runtime work, check `README.md`, `dev-docs/architecture/Stack-and-Tools.md`, and `dev-docs/architecture/Architecture.md`.
- For feature/API/schema work, check `dev-docs/planning/Features.md`, `dev-docs/planning/Plan.md`, `dev-docs/planning/Atomic-Action-Plan.md`, and `dev-docs/planning/Update-Log.md` when update history matters.
- For imports/external data, check `dev-docs/guardrails/External-Data-Integrations.md`.
- For AI/search/insights, check `dev-docs/research/Semantic-Meaning-Research.md` and `dev-docs/guardrails/Direction-Guardrails.md`.
