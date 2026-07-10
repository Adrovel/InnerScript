import { describe, expect, test } from "vitest";
import {
  buildReflectionQuestion,
  REFLECTION_PROMPT_VERSION,
} from "../../lib/reflection-question.js";

describe("reflection question", () => {
  test("returns a current-entry-only question with source metadata", async () => {
    const reflection = await buildReflectionQuestion({
      id: "entry-1",
      title: "Google anxiety",
      body: "I feel anxious about Google interviews and I keep worrying that I am behind.",
    });

    expect(reflection).toMatchObject({
      prompt_version: REFLECTION_PROMPT_VERSION,
      mode: "local",
      source: {
        entry_id: "entry-1",
        title: "Google anxiety",
      },
    });
    expect(reflection.question).toContain("risk");
  });

  test("does not produce a question for thin entries", async () => {
    expect(
      await buildReflectionQuestion({
        id: "entry-1",
        title: "",
        body: "too short",
      }),
    ).toBeNull();
  });
});
