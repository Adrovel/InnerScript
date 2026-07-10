import "server-only";

import { createSourceWithEntries } from "./sources.js";

function normalizeText(value) {
  return String(value ?? "").replace(/\r\n/g, "\n").trim();
}

export function previewTextImport({ content, filename = "import.txt", sourceType = "text_file" }) {
  const text = normalizeText(content);

  if (!text) {
    throw new SyntaxError("Import content is required");
  }

  const title = filename.replace(/\.[^.]+$/, "") || "Imported text";

  return {
    source: {
      source_type: sourceType,
      display_name: title,
      original_filename: filename,
      metadata: {
        parser: "plain-text-v1",
      },
    },
    entries: [
      {
        title,
        body: text,
        entry_type: "note",
      },
    ],
  };
}

export function previewMarkdownImport({ content, filename = "import.md" }) {
  const text = normalizeText(content);

  if (!text) {
    throw new SyntaxError("Import content is required");
  }

  const sections = text
    .split(/\n(?=# )/)
    .map((section) => section.trim())
    .filter(Boolean);
  const entries = sections.map((section, index) => {
    const heading = section.match(/^#\s+(.+)$/m)?.[1]?.trim();

    return {
      title: heading || `Imported note ${index + 1}`,
      body: section.replace(/^#\s+.+\n?/, "").trim() || section,
      entry_type: "note",
    };
  });

  return {
    source: {
      source_type: "markdown",
      display_name: filename.replace(/\.[^.]+$/, "") || "Markdown import",
      original_filename: filename,
      metadata: {
        parser: "markdown-heading-v1",
      },
    },
    entries,
  };
}

export function previewImport(input) {
  const kind = input.kind ?? input.source_type ?? "text_file";

  if (kind === "markdown") {
    return previewMarkdownImport(input);
  }

  if (kind === "whatsapp_export") {
    return {
      ...previewTextImport({
        ...input,
        sourceType: "whatsapp_export",
        filename: input.filename ?? "chat.txt",
      }),
      entries: [
        {
          title: input.title ?? "Imported conversation",
          body: normalizeText(input.content),
          entry_type: "conversation",
        },
      ],
    };
  }

  return previewTextImport(input);
}

export async function confirmImport(input) {
  const preview = input.preview ?? previewImport(input);
  return createSourceWithEntries(preview);
}
