import { deleteFolder, getFolder, updateFolder } from "../../../../lib/folders.js";
import { errorResponse, jsonError } from "../../../../lib/api.js";
import { readJson } from "../../../../lib/api.js";

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

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const input = await readJson(request);
    const folder = await updateFolder(id, input);

    if (!folder) {
      return jsonError("Folder not found", 404);
    }

    return Response.json({ folder });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_request, { params }) {
  try {
    const { id } = await params;
    const deleted = await deleteFolder(id);

    if (!deleted) {
      return jsonError("Folder not found", 404);
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    return errorResponse(error);
  }
}
