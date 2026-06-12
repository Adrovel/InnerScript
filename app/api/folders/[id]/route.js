import { getFolder } from "../../../../lib/folders.js";
import { errorResponse, jsonError } from "../../../../lib/api.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  try {
    const { id } = await params;
    const folder = await getFolder(id);

    if (!folder) {
      return jsonError("Folder not found", 404);
    }

    return Response.json({ folder });
  } catch (error) {
    return errorResponse(error);
  }
}
