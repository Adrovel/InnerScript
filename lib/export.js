import "server-only";

import { buildMarkdownExport } from "./journal.js";

export function buildEntriesMarkdownExport(entries) {
  const sections = entries.map((entry) =>
    buildMarkdownExport({
      title: entry.title,
      body: entry.body,
      occurredAt: entry.occurred_at ?? entry.created_at,
    }).trimEnd(),
  );

  return `${sections.join("\n\n---\n\n")}\n`;
}
