import "server-only";

export function getReadinessReport() {
  const authConfigured = Boolean(
    process.env.INNERSCRIPT_AUTH_USERNAME && process.env.INNERSCRIPT_AUTH_PASSWORD,
  );
  const databaseConfigured = Boolean(process.env.DATABASE_URL);
  const chatConfigured = Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_CHAT_MODEL);
  const hostedMode = process.env.INNERSCRIPT_HOSTED_MODE === "true";

  return {
    ready_for_local_use: databaseConfigured,
    ready_for_private_hosted_use: databaseConfigured && authConfigured,
    ready_for_ai_features: chatConfigured,
    hosted_mode: hostedMode,
    checks: {
      database_url: databaseConfigured,
      basic_auth: authConfigured,
      chat_provider: chatConfigured,
      transcription_provider: Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_TRANSCRIPTION_MODEL),
      public_app_url: Boolean(process.env.NEXT_PUBLIC_APP_URL),
    },
    actions_for_joel: [
      ...(!authConfigured ? ["Set INNERSCRIPT_AUTH_USERNAME and INNERSCRIPT_AUTH_PASSWORD before exposing the app."] : []),
      ...(!chatConfigured ? ["Set OPENAI_API_KEY and OPENAI_CHAT_MODEL to enable provider-backed Echo."] : []),
      ...(!process.env.NEXT_PUBLIC_APP_URL ? ["Set NEXT_PUBLIC_APP_URL to the deployed URL."] : []),
    ],
  };
}
