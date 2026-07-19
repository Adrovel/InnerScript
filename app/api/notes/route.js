import { errorResponse, readJson } from "../../../lib/api.js";
import { createNote, listNotes } from "../../../lib/notes.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const notes = await listNotes();

    return Response.json({ notes });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request) {
  try {
    const input = await readJson(request);
    const note = await createNote(input);

    return Response.json({ note }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
