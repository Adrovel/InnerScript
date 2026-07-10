import { errorResponse } from "../../../../lib/api.js";
import { buildPrivacyExport } from "../../../../lib/privacy-export.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const payload = await buildPrivacyExport();
    return Response.json(payload);
  } catch (error) {
    return errorResponse(error);
  }
}
