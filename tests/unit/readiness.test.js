import { afterEach, describe, expect, test, vi } from "vitest";
import { getReadinessReport } from "../../lib/readiness.js";

describe("readiness report", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  test("lists the minimum actions Joel needs before private hosting", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5433/innerscript");
    vi.stubEnv("INNERSCRIPT_AUTH_USERNAME", "");
    vi.stubEnv("INNERSCRIPT_AUTH_PASSWORD", "");
    vi.stubEnv("OPENAI_API_KEY", "");
    vi.stubEnv("OPENAI_CHAT_MODEL", "");
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "");

    const report = await getReadinessReport({ checkDatabaseSchema: false });

    expect(report.ready_for_local_use).toBe(true);
    expect(report.ready_for_private_hosted_use).toBe(false);
    expect(report.actions_for_joel).toEqual(
      expect.arrayContaining([
        "Set INNERSCRIPT_AUTH_USERNAME and INNERSCRIPT_AUTH_PASSWORD before exposing the app.",
        "Set OPENAI_API_KEY and OPENAI_CHAT_MODEL to enable provider-backed Echo.",
      ]),
    );
  });
});
