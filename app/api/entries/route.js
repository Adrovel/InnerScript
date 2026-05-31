import { createManualEntry, listEntries } from "../../../lib/entries.js";
import { errorResponse, readJson } from "../../../lib/api.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const limit = request.nextUrl.searchParams.get("limit");
    const entries = await listEntries({ limit });

    return Response.json({ entries });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request) {
  try {
    const input = await readJson(request);
    const entry = await createManualEntry(input);

    return Response.json({ entry }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
