import { errorResponse, readJson } from "../../../../lib/api.js";
import { confirmImport } from "../../../../lib/imports.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const input = await readJson(request);
    const result = await confirmImport(input);
    return Response.json(result, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
