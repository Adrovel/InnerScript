import { listEntries } from "../../../../lib/entries.js";
import { errorResponse } from "../../../../lib/api.js";
import { buildEntriesMarkdownExport } from "../../../../lib/export.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const entries = await listEntries({ limit: 100 });
    const markdown = buildEntriesMarkdownExport(entries);

    return new Response(markdown, {
      headers: {
        "content-type": "text/markdown; charset=utf-8",
        "content-disposition": 'attachment; filename="innerscript-export.md"',
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
