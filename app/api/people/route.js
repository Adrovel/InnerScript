import { createPerson, listPeople } from "../../../lib/people.js";
import { errorResponse, readJson } from "../../../lib/api.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const people = await listPeople();
    return Response.json({ people });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request) {
  try {
    const input = await readJson(request);
    const person = await createPerson(input);
    return Response.json({ person }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
