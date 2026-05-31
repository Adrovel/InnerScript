import { loadEnvConfig } from "@next/env";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { afterAll, beforeAll, beforeEach } from "vitest";
import { closeDb, getDb, getPool } from "../../db/client.js";

loadEnvConfig(process.cwd());

if (!process.env.TEST_DATABASE_URL) {
  throw new Error("TEST_DATABASE_URL is required for integration tests");
}

beforeAll(async () => {
  await migrate(getDb(), { migrationsFolder: "drizzle" });
});

beforeEach(async () => {
  await getPool().query("TRUNCATE TABLE entries, sources RESTART IDENTITY");
});

afterAll(async () => {
  await closeDb();
});
