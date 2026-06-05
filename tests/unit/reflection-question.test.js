import { describe, expect, test } from "vitest";
import {
  buildReflectionPromptContract,
  createReflectionQuestion,
  ReflectionQuestionUnavailableError,
} from "../../lib/reflection-question.js";

const entry = {
  id: "734ac035-a77d-4da9-b8ca-5d9aeb699253",
  title: "Today",
  body: "I felt scattered this morning, but writing helped me notice that I was avoiding one uncomfortable decision.",
  occurred_at: "2026-06-05T10:00:00.000Z",
};

describe("reflection question contract", () => {
  test("builds a current-entry-only prompt contract", () => {
    const contract = buildReflectionPromptContract(entry);

    expect(contract.system).toContain("Use only the current entry");
    expect(contract.current_entry).toEqual({
      id: entry.id,
      title: "Today",
      body: entry.body,
      occurred_at: entry.occurred_at,
    });
    expect(contract.output_contract).toMatchObject({
      shape: "one_question",
      max_questions: 1,
      must_reference_only_current_entry: true,
    });
    expect(contract.output_contract.forbidden_claims).toContain(
      "life pattern from one entry",
    );
  });

  test("returns a local fallback question when no provider is wired", async () => {
    await expect(createReflectionQuestion(entry)).resolves.toMatchObject({
      entry_id: entry.id,
      source: "local_fallback",
      ai_available: false,
      question: "What part of this entry feels most worth sitting with for a few more minutes?",
    });
  });

  test("normalizes provider output to one question", async () => {
    const reflection = await createReflectionQuestion(entry, {
      generateQuestion: async (contract) =>
        `What decision are you avoiding in this entry ${contract.current_entry.id}`,
    });

    expect(reflection).toMatchObject({
      entry_id: entry.id,
      source: "provider",
      ai_available: true,
      question: `What decision are you avoiding in this entry ${entry.id}?`,
    });
  });

  test("rejects empty current entries", async () => {
    await expect(
      createReflectionQuestion({ ...entry, body: "   " }),
    ).rejects.toBeInstanceOf(ReflectionQuestionUnavailableError);
  });
});
