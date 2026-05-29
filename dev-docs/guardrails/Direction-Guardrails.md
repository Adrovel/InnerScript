# Direction Guardrails

Purpose: prevent InnerScript from drifting into a weak portfolio project or a scattered product.

These guardrails apply whenever Joel, Prithvi, Codex, Claude, or another agent changes direction, adds features, or starts implementation.

## Non-Negotiable Product Frame

InnerScript is:

> a local-first AI journaling and semantic memory system for source-backed personal insight.

It is not:

- a generic chatbot
- a therapy app
- a social network
- a habit streak app
- a full debate app
- a random AI wrapper
- a product analytics dashboard

## Direction Change Rule

If the app direction changes, update docs before implementation.

Required updates:

| Change type | Must update |
|---|---|
| new major feature | `planning/Features.md`, `planning/Plan.md` |
| new system component | `architecture/Architecture.md`, `architecture/Stack-and-Tools.md` |
| new data source/integration | `guardrails/External-Data-Integrations.md`, `architecture/Architecture.md` |
| new AI behavior | `planning/Features.md`, `architecture/Architecture.md`, prompt contract in `planning/Plan.md` |
| new hosted-only behavior | `architecture/Architecture.md`, `architecture/Stack-and-Tools.md`, `research/Google-Signal-Benchmarks.md` |
| removed/deprioritized high-impact feature | `planning/Features.md`, `planning/Plan.md`, `research/Google-Signal-Benchmarks.md` |

## Terminal Notification Rule

Before implementing any feature not already listed in `planning/Features.md`, the agent must print a short terminal-facing decision note in chat or task logs:

```text
FEATURE DIRECTION CHECK
Feature: <name>
Google impact: High / Medium / Low
Product fit: Strong / Weak
Risk: <privacy/performance/scope/AI overclaim/etc>
Decision: Proceed / Proceed only after docs update / Reject for now
Docs to update: <files>
```

If the decision is "Low Google impact" and the feature is not required for the user experience, do not implement it without Joel explicitly confirming.

## Periodic Organization Check

Agents must notify Joel when `dev-docs` needs organization.

Run this check:

- after adding 3+ docs in one session
- after renaming or moving docs
- after adding a new project direction
- before pushing a docs-heavy commit
- whenever a doc mixes planning, architecture, research, and guardrails

Notification format:

```text
DEV-DOCS ORGANIZATION CHECK
Reason: <why organization is needed>
Suggested move: <files/folders>
Decision needed: yes/no
```

## Feature Acceptance Checklist

A feature is accepted only if at least one is true:

- it improves semantic memory
- it improves source-backed insight
- it improves local-first privacy/trust
- it strengthens the Google signal
- it supports imports/voice/people/search/digests/rate limiting
- it is necessary infrastructure for the above

Reject or defer if:

- it is mostly decorative
- it creates social/product sprawl
- it makes AI output less source-backed
- it requires hosted auth/billing too early
- it weakens local open-source usability
- it cannot be tested or benchmarked

## Google Impact Labels

Use these labels in planning:

### High

Clear interview/resume signal.

Examples:

- semantic search over chunks
- import pipeline with provenance
- Go/Redis distributed rate limiter
- people/interactions model
- voice-to-text pipeline
- source-backed weekly digest

### Medium

Useful product value, but needs stronger engineering framing.

Examples:

- mood dashboard
- topic chart
- auth
- billing
- settings UI

### Low

Do not prioritize unless there is a direct user need.

Examples:

- streaks
- themes
- social sharing
- full debate UI
- decorative dashboards

## Privacy Guardrails

- Do not claim to know the user psychologically.
- Do not diagnose.
- Do not infer facts about other people as objective truth.
- Say "your notes describe" instead of "this person is."
- Imported chats must show provenance.
- Audio must be deleted by default after transcription unless user opts in.
- AI-off mode must preserve basic journaling.
- Export must remain available.

## AI Guardrails

- All generated insights must link back to entries/chunks.
- Unsupported insights should be blocked or marked uncertain.
- Prompts must be versioned or documented.
- Schema validation is required for structured extraction.
- User should be able to mark insight as wrong.

## Architecture Guardrails

- Do not rewrite the entire app in Go.
- Use Go for the distributed rate limiter and possibly later workers.
- Do not add Redis as a requirement for local journaling.
- Keep hosted-only infrastructure optional.
- Avoid adding a vector DB before pgvector is proven insufficient.
- Keep data model explicit and SQL-explainable.

## Implementation Guardrails For Agents

Before code:

- [ ] Read `planning/Features.md`.
- [ ] Read `architecture/Architecture.md`.
- [ ] Read `planning/Plan.md`.
- [ ] Check `research/Google-Signal-Benchmarks.md`.
- [ ] Print the feature direction check if feature is new.

Before final response:

- [ ] Mention if docs were updated.
- [ ] Mention if the feature is high/medium/low Google impact.
- [ ] Mention tests or benchmark gaps.

## Examples

### Good Direction Change

Feature: WhatsApp export import.

Decision: Proceed.

Reason:

- Strong fit with external journal-related data ingestion.
- High Google impact due to parser design, provenance, and semantic indexing.
- Must update `guardrails/External-Data-Integrations.md` and tests.

### Bad Direction Change

Feature: public social feed for sharing journal snippets.

Decision: Reject for now.

Reason:

- Weakens privacy-first product.
- Low Google systems signal.
- Creates moderation and social complexity unrelated to core thesis.

### Caution Direction Change

Feature: hosted auth and billing.

Decision: Defer.

Reason:

- Important for consumer version, but premature before local semantic core and benchmarks exist.
