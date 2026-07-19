import { migrate } from "drizzle-orm/node-postgres/migrator";
import { afterAll, beforeAll, beforeEach } from "vitest";
import { closeDb, getDb, getPool } from "../../db/client.js";

const TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL ??
  "postgres://innerscript:innerscript@localhost:5434/innerscript_test";

beforeAll(async () => {
  process.env.DATABASE_URL = TEST_DATABASE_URL;
  await getPool().query("DROP SCHEMA IF EXISTS public CASCADE");
  await getPool().query("DROP SCHEMA IF EXISTS drizzle CASCADE");
  await getPool().query("CREATE SCHEMA public");
  await migrate(getDb(), { migrationsFolder: "drizzle" });
});

beforeEach(async () => {
  await getPool().query("TRUNCATE TABLE notes RESTART IDENTITY CASCADE");
});

afterAll(async () => {
  await closeDb();
});
