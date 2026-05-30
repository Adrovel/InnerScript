export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({
    status: "ok",
    service: "innerscript",
    app: "Next.js App Router",
    language: "javascript",
    apiBoundary: "route-handlers",
  });
}
