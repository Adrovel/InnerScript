import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

const config = {
  schema: "./db/schema.js",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url:
      process.env.DATABASE_URL ??
      "postgresql://postgres:postgres@localhost:5433/innerscript",
  },
  strict: true,
};

export default config;
