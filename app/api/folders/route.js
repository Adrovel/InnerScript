import { createFolder, listFolders } from "../../../lib/folders.js";
import { errorResponse, readJson } from "../../../lib/api.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const folders = await listFolders({ ensureDefaults: true });

    return Response.json({ folders });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request) {
  try {
    const input = await readJson(request);
    const folder = await createFolder(input);

    return Response.json({ folder }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
