import { getEntry } from "../../../lib/entries.js";
import {
  createReflectionQuestion,
  ReflectionQuestionUnavailableError,
  reflectionQuestionInputSchema,
} from "../../../lib/reflection-question.js";
import { errorResponse, jsonError, readJson } from "../../../lib/api.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const input = reflectionQuestionInputSchema.parse(await readJson(request));
    const entry = await getEntry(input.entry_id);

    if (!entry) {
      return jsonError("Entry not found", 404);
    }

    const reflection = await createReflectionQuestion(entry);

    return Response.json({ reflection });
  } catch (error) {
    if (error instanceof ReflectionQuestionUnavailableError) {
      return jsonError(error.message, 422);
    }

    return errorResponse(error);
  }
}
