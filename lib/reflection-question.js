import { z } from "zod";

export const reflectionQuestionInputSchema = z
  .object({
    entry_id: z.string().uuid(),
  })
  .strict();

const MIN_ENTRY_BODY_CHARS = 40;

export class ReflectionQuestionUnavailableError extends Error {
  constructor(message) {
    super(message);
    this.name = "ReflectionQuestionUnavailableError";
  }
}

export function buildReflectionPromptContract(entry) {
  const current_entry = normalizeEntry(entry);

  return {
    system:
      "You are InnerScript's reflection-question writer. Ask exactly one grounded reflection question. Use only the current entry. Do not diagnose, summarize the user's life, infer long-term patterns, or claim to be a therapist.",
    current_entry,
    output_contract: {
      shape: "one_question",
      max_questions: 1,
      must_reference_only_current_entry: true,
      forbidden_claims: [
        "diagnosis",
        "treatment",
        "life pattern from one entry",
        "relationship conclusion from one entry",
        "therapist replacement",
      ],
    },
  };
}

export async function createReflectionQuestion(entry, options = {}) {
  const prompt_contract = buildReflectionPromptContract(entry);

  if (options.generateQuestion) {
    const question = await options.generateQuestion(prompt_contract);

    return {
      entry_id: prompt_contract.current_entry.id,
      question: normalizeQuestion(question),
      source: "provider",
      ai_available: true,
    };
  }

  return {
    entry_id: prompt_contract.current_entry.id,
    question: createLocalFallbackQuestion(prompt_contract.current_entry),
    source: "local_fallback",
    ai_available: false,
  };
}

function normalizeEntry(entry) {
  if (!entry?.id) {
    throw new ReflectionQuestionUnavailableError("A current entry is required.");
  }

  const body = String(entry.body ?? "").trim();

  if (!body) {
    throw new ReflectionQuestionUnavailableError("The current entry is empty.");
  }

  return {
    id: entry.id,
    title: entry.title?.trim() || null,
    body,
    occurred_at: entry.occurred_at ?? null,
  };
}

function normalizeQuestion(question) {
  const value = String(question ?? "").trim();

  if (!value) {
    throw new ReflectionQuestionUnavailableError("Reflection provider returned an empty question.");
  }

  return value.endsWith("?") ? value : `${value}?`;
}

function createLocalFallbackQuestion(current_entry) {
  if (current_entry.body.length < MIN_ENTRY_BODY_CHARS) {
    return "What feels most important to name from this entry before you move on?";
  }

  return "What part of this entry feels most worth sitting with for a few more minutes?";
}
