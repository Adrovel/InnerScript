# Git Workflow Standard

Purpose: define how InnerScript contributors use git commands, branches, issues, commits, pull requests, and merges.

Source: adapted from the shared Bitsit engineering standards for InnerScript. This file is the InnerScript-local source of truth for git workflow.

## Load Rule

Before branch, commit, push, pull, fetch, issue, PR, or merge work, load this file.

## Branches

Use descriptive, hyphenated branch names with a type prefix.

Format:

```text
<type>/<short-description>
```

Allowed types:

- `feature/` for new product behavior
- `fix/` for bug fixes
- `hotfix/` for critical production fixes
- `chore/` for maintenance
- `refactor/` for internal restructuring without behavior changes
- `docs/` for documentation-only work
- `test/` for test-only work

Examples:

```bash
git switch -c feature/reflection-question
git switch -c fix/journal-autosave-feedback
git switch -c docs/git-workflow-standard
git switch -c test/autosave-race-coverage
```

Rules:

- Use lowercase.
- Use hyphens, not spaces or underscores.
- Keep the description specific and short.
- Do not use agent names as branch prefixes.
- Do not work directly on `main` except for reading, fetching, or fast-forwarding after a merge.

## Fetch

Fetch before starting meaningful InnerScript work.

```bash
git fetch --all --prune
git status --short --branch
```

Use fetch to update remote refs without changing local files. Prefer this before deciding whether to pull, branch, rebase, or open a PR.

## Pull

Pull only when the current branch is expected to track the remote branch and local changes are clean or safely committed.

Preferred for `main`:

```bash
git switch main
git pull --ff-only
```

Rules:

- Do not pull into a dirty tree unless the user explicitly asks and the risk is clear.
- Use `--ff-only` on `main` so local history does not create accidental merge commits.
- If pull fails because local changes exist, stop and inspect status.

## Commits

Use Conventional Commits.

Format:

```text
<type>[optional scope]: <description>
```

Types:

- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation
- `style:` formatting or visual style only, no logic change
- `refactor:` code restructuring, no behavior change
- `test:` tests only
- `chore:` tooling, dependency, or maintenance
- `perf:` performance improvement

Examples:

```bash
git commit -m "feat: add reflection question flow"
git commit -m "fix: harden journal autosave feedback"
git commit -m "docs: add git workflow standard"
git commit -m "test: cover autosave race cases"
```

Rules:

- Keep commits atomic: one logical change per commit.
- Split code and docs when they are independently reviewable.
- Use imperative mood: `add`, `fix`, `record`, `update`.
- Prefer a first line under 50 characters.
- Each commit should pass the relevant tests when practical.

## Push

Push only after the branch has a clean status and relevant checks have run or the skipped checks are explicitly noted.

```bash
git status --short --branch
git push -u origin <branch-name>
```

Rules:

- Pushing is a user permission checkpoint in this workspace.
- Never push directly to `main`.
- If push fails with credential helper errors, do not retry blindly. Use `gh auth setup-git` or ask the user to push manually.

## Pull Requests

Open a PR for branch work before merging into `main`.

PR title should follow Conventional Commits:

```text
fix: harden journal autosave feedback
docs: add git workflow standard
```

PR body should include:

- Summary
- Changes
- Testing
- Deferred checks or known risks
- Related issues, if any

Keep PRs focused. If a branch grows too large, split it into reviewable PRs such as code fix first, docs second.

## Issues

Use issues for bugs, product decisions, and follow-up work that should survive chat.

Rules:

- Link commits and PRs to issues when the work directly resolves one.
- Use `Fixes #123` only when the PR fully closes the issue.
- Use `Related to #123` when the PR only helps or partially addresses the issue.
- InnerScript app bugs must also be logged in `.wolf/buglog.jsonl` and indexed in `.wolf/buglog-index.md`.

## Merge

Merge only after review and verification are complete enough for the risk level.

Rules:

- Merge through GitHub PRs unless the user explicitly asks for a local-only merge.
- Do not merge unreviewed UI/autosave work without browser stress review.
- After merge, fast-forward local `main`:

```bash
git switch main
git pull --ff-only
```

## Current Branch Correction

This branch was renamed to follow the standard:

```text
fix/journal-autosave-feedback
```

The earlier `codex/...` prefix should not be reused for InnerScript branch names.
