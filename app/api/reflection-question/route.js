import { getEntry } from "../../../lib/entries.js";
import { errorResponse, jsonError, readJson } from "../../../lib/api.js";
import { buildReflectionQuestion } from "../../../lib/reflection-question.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const input = await readJson(request);
    const entry = await getEntry(input.entry_id);

    if (!entry) {
      return jsonError("Entry not found", 404);
    }

    const reflection = buildReflectionQuestion(entry);

    if (!reflection) {
      return jsonError("Write a little more before asking Echo.", 422);
    }

    return Response.json({ reflection });
  } catch (error) {
    return errorResponse(error);
  }
}
