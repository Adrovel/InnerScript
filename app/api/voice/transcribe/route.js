import { errorResponse, readJson } from "../../../../lib/api.js";
import { transcribeVoiceInput } from "../../../../lib/voice.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const input = await readJson(request);
    const transcription = await transcribeVoiceInput(input);
    const status = transcription.unavailable_reason ? 503 : 200;

    return Response.json({ transcription }, { status });
  } catch (error) {
    return errorResponse(error);
  }
}
