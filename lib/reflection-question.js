import "server-only";
import { generateReflectionQuestionWithProvider } from "./ai-provider.js";

export const REFLECTION_PROMPT_VERSION = "echo-current-entry-v1";

const QUESTION_BANK = [
  {
    terms: ["avoid", "delay", "procrastinat", "postpone"],
    question: "What are you protecting yourself from by delaying this?",
  },
  {
    terms: ["angry", "anger", "resent", "frustrat"],
    question: "What boundary or expectation feels violated here?",
  },
  {
    terms: ["anxious", "anxiety", "fear", "scared", "worry"],
    question: "What would become clearer if you separated the real risk from the imagined one?",
  },
  {
    terms: ["behind", "late", "failure", "fail"],
    question: "Whose timeline are you measuring yourself against in this entry?",
  },
  {
    terms: ["relationship", "friend", "family", "prithvi", "joel"],
    question: "What did this interaction make you believe about yourself?",
  },
  {
    terms: ["google", "interview", "career", "job"],
    question: "What part of this ambition still feels meaningful when fear is removed?",
  },
];

export function getReflectionInput(entry) {
  return `${entry.title ?? ""}\n\n${entry.body ?? ""}`.trim();
}

export async function buildReflectionQuestion(entry) {
  const input = getReflectionInput(entry);

  if (input.split(/\s+/).filter(Boolean).length < 8) {
    return null;
  }

  const normalized = input.toLowerCase();
  const match = QUESTION_BANK.find((candidate) =>
    candidate.terms.some((term) => normalized.includes(term)),
  );
  const question =
    match?.question ?? "What truth are you circling around but not naming directly yet?";

  const providerQuestion = await generateReflectionQuestionWithProvider({
    entry,
    fallbackQuestion: question,
  });

  return {
    question: providerQuestion ?? question,
    prompt_version: REFLECTION_PROMPT_VERSION,
    source: {
      entry_id: entry.id,
      title: entry.title ?? "Untitled",
      snippet: entry.body.trim().slice(0, 240),
    },
    mode: providerQuestion ? "provider" : "local",
  };
}
