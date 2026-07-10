import { errorResponse, readJson } from "../../../../lib/api.js";
import { deleteAllLocalData } from "../../../../lib/privacy-delete.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const input = await readJson(request);
    const result = await deleteAllLocalData({ confirmation: input.confirmation });

    return Response.json(result);
  } catch (error) {
    return errorResponse(error);
  }
}
