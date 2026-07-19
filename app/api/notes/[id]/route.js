import { errorResponse, NotFoundError, readJson } from "../../../../lib/api.js";
import { deleteNote, getNote, updateNote } from "../../../../lib/notes.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function readId(context) {
  const params = await context.params;

  return params.id;
}

export async function GET(_request, context) {
  try {
    const note = await getNote(await readId(context));

    if (!note) {
      throw new NotFoundError("Note not found");
    }

    return Response.json({ note });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(request, context) {
  try {
    const input = await readJson(request);
    const note = await updateNote(await readId(context), input);

    if (!note) {
      throw new NotFoundError("Note not found");
    }

    return Response.json({ note });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_request, context) {
  try {
    const deleted = await deleteNote(await readId(context));

    if (!deleted) {
      throw new NotFoundError("Note not found");
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    return errorResponse(error);
  }
}
