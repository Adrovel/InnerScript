# Git Workflow Standard

Purpose: define the small git and verification rules for InnerScript work after the blank-main reset.

## Branch Names

Use short, descriptive, hyphenated branch names with a type prefix.

Preferred prefixes:

- `feat/` for new product behavior
- `fix/` for bug fixes
- `docs/` for documentation-only work
- `test/` for test-only work
- `chore/` for maintenance

Examples:

```bash
git switch -c feat/canonical-notes-storage
git switch -c fix/notes-update-validation
git switch -c docs/issue-19-notes-storage
```

Use `feat/`, not `feature/`, for new feature branches.

## Delivery Verification

Before committing feature work, rerun the relevant tests from the branch worktree.

For database-backed work:

- verify the test database connection is using the intended local test database
- run migrations in the test setup
- confirm the migrated tables exist through the test suite, not by assumption
- do not commit if tests fail after reaching the database layer

For Issue 19, the required verification is:

```bash
TEST_DATABASE_URL=<local test database url> npm test
```
