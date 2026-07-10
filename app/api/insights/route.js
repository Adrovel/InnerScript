import { errorResponse } from "../../../lib/api.js";
import { buildInsightsSnapshot } from "../../../lib/insights.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const insights = await buildInsightsSnapshot();
    return Response.json({ insights });
  } catch (error) {
    return errorResponse(error);
  }
}
