import "server-only";

import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema.js";

const { Pool } = pg;

const globalForDb = globalThis;

function getDatabaseUrl() {
  const url = process.env.DATABASE_URL;

  if (!url) {
    throw new Error("DATABASE_URL is required");
  }

  return url;
}

export function getPool() {
  if (!globalForDb.__innerScriptPool) {
    globalForDb.__innerScriptPool = new Pool({
      connectionString: getDatabaseUrl(),
    });
  }

  return globalForDb.__innerScriptPool;
}

export function getDb() {
  if (!globalForDb.__innerScriptDb) {
    globalForDb.__innerScriptDb = drizzle(getPool(), { schema });
  }

  return globalForDb.__innerScriptDb;
}

export async function closeDb() {
  if (globalForDb.__innerScriptPool) {
    await globalForDb.__innerScriptPool.end();
    globalForDb.__innerScriptPool = undefined;
    globalForDb.__innerScriptDb = undefined;
  }
}
