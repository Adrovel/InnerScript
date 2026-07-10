import { loadEnvConfig } from "@next/env";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { afterAll, beforeAll, beforeEach } from "vitest";
import { closeDb, getDb, getPool } from "../../db/client.js";

loadEnvConfig(process.cwd());

process.env.TEST_DATABASE_URL ??=
  "postgresql://postgres:postgres@localhost:5434/innerscript_test";

beforeAll(async () => {
  await migrate(getDb(), { migrationsFolder: "drizzle" });
});

beforeEach(async () => {
  await getPool().query(
    "TRUNCATE TABLE audit_logs, chunks, digests, person_mentions, people, entries, sources, folders RESTART IDENTITY CASCADE",
  );
});

afterAll(async () => {
  await closeDb();
});
