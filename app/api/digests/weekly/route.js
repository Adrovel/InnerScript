import { errorResponse } from "../../../../lib/api.js";
import { buildWeeklyDigest } from "../../../../lib/digests.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const digest = await buildWeeklyDigest();
    return Response.json({ digest });
  } catch (error) {
    return errorResponse(error);
  }
}
