# Issue 19: Canonical Notes Storage

GitHub issue: https://github.com/Adrovel/InnerScript/issues/19

## Issue

InnerScript needed the first clean storage foundation for notes after the main branch reset.

The requested MVP was intentionally small:

- create a canonical `notes` table
- store only `id`, `title`, `body`, `created_at`, and `updated_at`
- support create, list, open by id, update, and delete
- keep `body` as simple text
- cover the basic behavior with tests

## Solution

The solution adds a minimal Drizzle-backed notes model and API surface.

- The database schema defines a `notes` table with the approved MVP fields.
- The service layer owns validation, serialization, ordering, and CRUD operations.
- API routes expose `GET /api/notes`, `POST /api/notes`, `GET /api/notes/[id]`, `PUT /api/notes/[id]`, and `DELETE /api/notes/[id]`.
- Integration tests cover create, list, open, update, delete, and invalid input.
- Vitest aliases `server-only` to a test stub so server code can be imported directly in route tests without weakening production boundaries.

## Changed Files

- [db/schema.js](../db/schema.js) defines the canonical `notes` table.
- [drizzle/0000_canonical_notes.sql](../drizzle/0000_canonical_notes.sql) creates the database table.
- [lib/contracts.js](../lib/contracts.js) validates note ids, create input, and update input.
- [lib/notes.js](../lib/notes.js) implements note list, get, create, update, and delete behavior.
- [app/api/notes/route.js](../app/api/notes/route.js) exposes note list and create endpoints.
- [app/api/notes/[id]/route.js](../app/api/notes/%5Bid%5D/route.js) exposes note read, update, and delete endpoints.
- [tests/integration/notes-api.test.js](../tests/integration/notes-api.test.js) covers the Issue 19 acceptance behavior.
- [tests/integration/setup.js](../tests/integration/setup.js) prepares and cleans the test database.
- [tests/integration/server-only-stub.js](../tests/integration/server-only-stub.js) stubs `server-only` for Vitest route imports.
- [vitest.integration.config.js](../vitest.integration.config.js) configures integration tests and the `server-only` alias.
- [vitest.config.js](../vitest.config.js) makes `npm test` use the same integration test config.

## Verification

Command:

```bash
TEST_DATABASE_URL=<local test database url> npm test
```

Result:

```text
Test Files  1 passed (1)
Tests       6 passed (6)
```
