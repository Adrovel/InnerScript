import { errorResponse, readJson } from "../../../lib/api.js";
import { searchChunks } from "../../../lib/chunks.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const input = await readJson(request);
    const results = await searchChunks({
      query: input.query,
      limit: input.limit,
      folderId: input.folder_id ?? null,
    });

    return Response.json({
      mode: "local-hybrid",
      results,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
