import { deleteEntry, getEntry, updateEntry } from "../../../../lib/entries.js";
import { errorResponse, jsonError, readJson } from "../../../../lib/api.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  try {
    const { id } = await params;
    const entry = await getEntry(id);

    if (!entry) {
      return jsonError("Entry not found", 404);
    }

    return Response.json({ entry });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const input = await readJson(request);
    const entry = await updateEntry(id, input);

    if (!entry) {
      return jsonError("Entry not found", 404);
    }

    return Response.json({ entry });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_request, { params }) {
  try {
    const { id } = await params;
    const deleted = await deleteEntry(id);

    if (!deleted) {
      return jsonError("Entry not found", 404);
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    return errorResponse(error);
  }
}
