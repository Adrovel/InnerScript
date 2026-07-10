import { getReadinessReport } from "../../../../lib/readiness.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({ readiness: await getReadinessReport() });
}
