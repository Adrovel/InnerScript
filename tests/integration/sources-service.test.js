import { eq } from "drizzle-orm";
import { describe, expect, test } from "vitest";
import { getDb } from "../../db/client.js";
import { sources } from "../../db/schema.js";
import { createSourceWithEntries } from "../../lib/sources.js";

describe("source ingestion service", () => {
  test("creates manual sources for user-authored entries", async () => {
    const result = await createSourceWithEntries({
      source: {
        source_type: "manual",
        display_name: "Manual document",
      },
      entries: [
        {
          body: "A manually written document.",
          entry_type: "document",
          journal_date: "2026-06-11",
        },
      ],
    });

    expect(result.source).toMatchObject({
      source_type: "manual",
      display_name: "Manual document",
    });
    expect(result.entries[0]).toMatchObject({
      entry_type: "document",
      journal_date: "2026-06-11",
      source_id: result.source.id,
    });
  });

  test("creates one source with multiple imported entries", async () => {
    const result = await createSourceWithEntries({
      source: {
        source_type: "markdown",
        display_name: "Old journal",
        original_filename: "old-journal.md",
        metadata: {
          split_rule: "heading",
        },
      },
      entries: [
        {
          title: "2026-05-01",
          body: "Felt anxious before the interview.",
          entry_type: "document",
          journal_date: "2026-05-01",
          occurred_at: "2026-05-01T12:00:00.000Z",
        },
        {
          title: "Project notes",
          body: "InnerScript should preserve source provenance.",
          entry_type: "document",
        },
      ],
    });

    expect(result.source).toMatchObject({
      source_type: "markdown",
      original_filename: "old-journal.md",
      metadata: {
        split_rule: "heading",
      },
    });
    expect(result.entries).toHaveLength(2);
    expect(result.entries.every((entry) => entry.source_id === result.source.id)).toBe(true);
  });

  test("allows whatsapp exports to create conversation entries", async () => {
    const result = await createSourceWithEntries({
      source: {
        source_type: "whatsapp_export",
        original_filename: "WhatsApp Chat with Joel.txt",
      },
      entries: [
        {
          title: "Chat with Joel",
          body: "Joel: Ship the smallest correct thing.\nPrithvi: Agreed.",
          entry_type: "conversation",
          occurred_at: "2026-05-02T10:00:00.000Z",
        },
      ],
    });

    expect(result.entries[0]).toMatchObject({
      entry_type: "conversation",
      source_id: result.source.id,
    });
  });

  test("blocks accidental source deletion while entries still reference it", async () => {
    const result = await createSourceWithEntries({
      source: {
        source_type: "text_file",
        original_filename: "journal.txt",
      },
      entries: [
        {
          body: "A parsed text file entry.",
          entry_type: "document",
        },
      ],
    });

    await expect(getDb().delete(sources).where(eq(sources.id, result.source.id))).rejects.toThrow();
  });
});
