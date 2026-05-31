import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema.js";

const { Pool } = pg;

function getDatabaseUrl() {
  if (process.env.NODE_ENV === "test" && process.env.TEST_DATABASE_URL) {
    return process.env.TEST_DATABASE_URL;
  }

  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  throw new Error("DATABASE_URL is required for database access");
}

function getGlobals() {
  return globalThis;
}

export function getPool() {
  const globals = getGlobals();

  if (!globals.__innerScriptPool) {
    globals.__innerScriptPool = new Pool({
      connectionString: getDatabaseUrl(),
    });
  }

  return globals.__innerScriptPool;
}

export function getDb() {
  const globals = getGlobals();

  if (!globals.__innerScriptDb) {
    globals.__innerScriptDb = drizzle(getPool(), { schema });
  }

  return globals.__innerScriptDb;
}

export async function closeDb() {
  const globals = getGlobals();

  if (globals.__innerScriptPool) {
    await globals.__innerScriptPool.end();
    globals.__innerScriptPool = undefined;
    globals.__innerScriptDb = undefined;
  }
}
