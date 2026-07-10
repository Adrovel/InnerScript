# Production Completion Checklist

Purpose: reduce remaining Joel work to configuration, credentials, and domain ownership.

## Already Implemented On `fast-forward-V1`

- Private writing workspace with autosave, Markdown, folders, export, and browser-tested UI.
- Source-backed local search with chunks and migration.
- Echo reflection with local fallback and optional OpenAI-compatible provider hook.
- Import preview/confirm for Markdown, text, and exported chats.
- Manual people memory, insights, weekly digest, privacy export/delete, voice transcript review, and rate-limit contracts.
- Optional Basic Auth through `proxy.js`.
- Readiness endpoint: `/api/system/readiness`, including required-table schema checks.
- Production smoke script: `SMOKE_BASE_URL=<url> npm run test:smoke`.
- Vercel project config.
- Go rate-limiter service source scaffold under `services/rate-limiter-go/`.

## Joel-Only Configuration

Set these before exposing the app:

```bash
DATABASE_URL=<hosted postgres url>
NEXT_PUBLIC_APP_URL=<deployed url>
INNERSCRIPT_AUTH_USERNAME=<private username>
INNERSCRIPT_AUTH_PASSWORD=<strong password>
```

Set these only when provider-backed AI should be enabled:

```bash
OPENAI_API_KEY=<provider key>
OPENAI_CHAT_MODEL=<chosen chat model>
OPENAI_TRANSCRIPTION_MODEL=<chosen transcription model, later>
```

## Final Hosted Checks

- `/api/system/readiness` reports `ready_for_private_hosted_use: true`.
- `/` loads behind Basic Auth.
- `/api/privacy/export` returns a valid JSON export.
- `/api/privacy/delete-account` rejects the wrong confirmation phrase.
- `npm run db:migrate` has been run against the hosted database.
- `npm run build` passes in the host environment.
- `SMOKE_BASE_URL=<deployed url> npm run test:smoke` passes from an environment that can reach the deployment.

## Known Remaining Environment Blocker

The current WSL environment does not have `go` installed, so the Go service source is present but not compiled here. Install Go and run:

```bash
cd services/rate-limiter-go
go test ./...
go run .
```
