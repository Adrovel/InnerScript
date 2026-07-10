import { errorResponse, readJson } from "../../../../lib/api.js";
import { previewImport } from "../../../../lib/imports.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const input = await readJson(request);
    const preview = previewImport(input);
    return Response.json({ preview });
  } catch (error) {
    return errorResponse(error);
  }
}
