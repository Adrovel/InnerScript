import "server-only";

import { getPool } from "../db/client.js";

const REQUIRED_TABLES = [
  "folders",
  "sources",
  "entries",
  "chunks",
  "people",
  "person_mentions",
  "digests",
  "audit_logs",
];

async function checkDatabaseSchema(databaseConfigured) {
  if (!databaseConfigured) {
    return { ok: false, missing_tables: REQUIRED_TABLES };
  }

  try {
    const result = await getPool().query(
      `
        select table_name
        from information_schema.tables
        where table_schema = 'public'
          and table_name = any($1::text[])
      `,
      [REQUIRED_TABLES],
    );
    const existingTables = new Set(result.rows.map((row) => row.table_name));
    const missingTables = REQUIRED_TABLES.filter((tableName) => !existingTables.has(tableName));

    return { ok: missingTables.length === 0, missing_tables: missingTables };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Database schema check failed",
      missing_tables: REQUIRED_TABLES,
    };
  }
}

export async function getReadinessReport(options = {}) {
  const checkSchema = options.checkDatabaseSchema ?? true;
  const authConfigured = Boolean(
    process.env.INNERSCRIPT_AUTH_USERNAME && process.env.INNERSCRIPT_AUTH_PASSWORD,
  );
  const databaseConfigured = Boolean(process.env.DATABASE_URL);
  const chatConfigured = Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_CHAT_MODEL);
  const hostedMode = process.env.INNERSCRIPT_HOSTED_MODE === "true";
  const databaseSchema = checkSchema
    ? await checkDatabaseSchema(databaseConfigured)
    : { ok: databaseConfigured, missing_tables: [] };

  return {
    ready_for_local_use: databaseConfigured && databaseSchema.ok,
    ready_for_private_hosted_use: databaseConfigured && databaseSchema.ok && authConfigured,
    ready_for_ai_features: chatConfigured,
    hosted_mode: hostedMode,
    checks: {
      database_url: databaseConfigured,
      database_schema: databaseSchema,
      basic_auth: authConfigured,
      chat_provider: chatConfigured,
      transcription_provider: Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_TRANSCRIPTION_MODEL),
      public_app_url: Boolean(process.env.NEXT_PUBLIC_APP_URL),
    },
    actions_for_joel: [
      ...(databaseConfigured && !databaseSchema.ok ? ["Run npm run db:migrate against the target database."] : []),
      ...(!authConfigured ? ["Set INNERSCRIPT_AUTH_USERNAME and INNERSCRIPT_AUTH_PASSWORD before exposing the app."] : []),
      ...(!chatConfigured ? ["Set OPENAI_API_KEY and OPENAI_CHAT_MODEL to enable provider-backed Echo."] : []),
      ...(!process.env.NEXT_PUBLIC_APP_URL ? ["Set NEXT_PUBLIC_APP_URL to the deployed URL."] : []),
    ],
  };
}
