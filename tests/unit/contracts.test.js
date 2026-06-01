import { describe, expect, test } from "vitest";
import {
  createManualEntryInputSchema,
  createSourceInputSchema,
  entryTypeSchema,
  sourceTypeSchema,
  updateEntryInputSchema,
} from "../../lib/contracts.js";

describe("entry contracts", () => {
  test("accepts the canonical entry types", () => {
    expect(entryTypeSchema.parse("journal")).toBe("journal");
    expect(entryTypeSchema.parse("note")).toBe("note");
    expect(entryTypeSchema.parse("conversation")).toBe("conversation");
  });

  test("manual entries default to journal and cannot carry source provenance", () => {
    expect(
      createManualEntryInputSchema.parse({
        body: "A manually written journal entry.",
      }),
    ).toMatchObject({
      body: "A manually written journal entry.",
      entry_type: "journal",
    });

    expect(() =>
      createManualEntryInputSchema.parse({
        body: "Imported elsewhere.",
        source_id: "734ac035-a77d-4da9-b8ca-5d9aeb699253",
      }),
    ).toThrow();
  });

  test("manual entries are limited to user-authored memory shapes", () => {
    expect(
      createManualEntryInputSchema.parse({
        body: "A user-authored note.",
        entry_type: "note",
      }).entry_type,
    ).toBe("note");

    expect(() =>
      createManualEntryInputSchema.parse({
        body: "A conversation should come from an ingestion flow.",
        entry_type: "conversation",
      }),
    ).toThrow();
  });

  test("update payloads cannot rewrite provenance or entry shape", () => {
    expect(() => updateEntryInputSchema.parse({})).toThrow();
    expect(() => updateEntryInputSchema.parse({ source_id: null })).toThrow();
    expect(() => updateEntryInputSchema.parse({ entry_type: "conversation" })).toThrow();
  });
});

describe("source contracts", () => {
  test("accepts canonical source types", () => {
    expect(sourceTypeSchema.parse("manual")).toBe("manual");
    expect(sourceTypeSchema.parse("voice")).toBe("voice");
    expect(sourceTypeSchema.parse("markdown")).toBe("markdown");
    expect(sourceTypeSchema.parse("text_file")).toBe("text_file");
    expect(sourceTypeSchema.parse("whatsapp_export")).toBe("whatsapp_export");
  });

  test("rejects unsupported editor input methods as source types", () => {
    expect(() => sourceTypeSchema.parse("clipboard")).toThrow();
  });

  test("source metadata defaults to an empty object", () => {
    expect(
      createSourceInputSchema.parse({
        source_type: "markdown",
        original_filename: "old-journal.md",
      }),
    ).toMatchObject({
      source_type: "markdown",
      original_filename: "old-journal.md",
      metadata: {},
    });
  });
});
