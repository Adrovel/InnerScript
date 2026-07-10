import { deletePerson, getPerson, updatePerson } from "../../../../lib/people.js";
import { errorResponse, jsonError, readJson } from "../../../../lib/api.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  try {
    const { id } = await params;
    const person = await getPerson(id);

    if (!person) {
      return jsonError("Person not found", 404);
    }

    return Response.json({ person });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const input = await readJson(request);
    const person = await updatePerson(id, input);

    if (!person) {
      return jsonError("Person not found", 404);
    }

    return Response.json({ person });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_request, { params }) {
  try {
    const { id } = await params;
    const deleted = await deletePerson(id);

    if (!deleted) {
      return jsonError("Person not found", 404);
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    return errorResponse(error);
  }
}
