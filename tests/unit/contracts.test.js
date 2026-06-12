import { describe, expect, test } from "vitest";
import {
  createFolderInputSchema,
  createManualEntryInputSchema,
  createSourceInputSchema,
  entryTypeSchema,
  sourceTypeSchema,
  updateEntryInputSchema,
} from "../../lib/contracts.js";

describe("entry contracts", () => {
  test("accepts the canonical entry types", () => {
    expect(entryTypeSchema.parse("document")).toBe("document");
    expect(entryTypeSchema.parse("conversation")).toBe("conversation");
    expect(() => entryTypeSchema.parse("journal")).toThrow();
    expect(() => entryTypeSchema.parse("note")).toThrow();
  });

  test("manual entries default to document and cannot carry source provenance", () => {
    const parsed = createManualEntryInputSchema.parse({
      body: "A manually written document.",
    });

    expect(parsed).toMatchObject({
      body: "A manually written document.",
      entry_type: "document",
    });
    expect(parsed).not.toHaveProperty("folder_id");
    expect(parsed).not.toHaveProperty("journal_date");

    expect(() =>
      createManualEntryInputSchema.parse({
        body: "Imported elsewhere.",
        source_id: "734ac035-a77d-4da9-b8ca-5d9aeb699253",
      }),
    ).toThrow();
  });

  test("manual documents can live in folders or be marked as daily journals", () => {
    expect(
      createManualEntryInputSchema.parse({
        body: "A user-authored document.",
        folder_id: "734ac035-a77d-4da9-b8ca-5d9aeb699253",
        journal_date: "2026-06-11",
      }),
    ).toMatchObject({
      entry_type: "document",
      folder_id: "734ac035-a77d-4da9-b8ca-5d9aeb699253",
      journal_date: "2026-06-11",
    });

    expect(
      createManualEntryInputSchema.parse({
        body: "A date object journal marker.",
        journal_date: new Date("2026-06-11T18:30:00.000Z"),
      }).journal_date,
    ).toBe("2026-06-11");
  });

  test("manual entries cannot create imported conversation-shaped content", () => {
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
    expect(
      updateEntryInputSchema.parse({
        folder_id: null,
        journal_date: null,
      }),
    ).toEqual({
      folder_id: null,
      journal_date: null,
    });
  });
});

describe("folder contracts", () => {
  test("accepts folder names and optional parent folders", () => {
    expect(
      createFolderInputSchema.parse({
        name: "Google Prep",
        parent_folder_id: "734ac035-a77d-4da9-b8ca-5d9aeb699253",
      }),
    ).toMatchObject({
      name: "Google Prep",
      parent_folder_id: "734ac035-a77d-4da9-b8ca-5d9aeb699253",
    });
  });

  test("trims folder names and rejects empty names", () => {
    expect(createFolderInputSchema.parse({ name: "  Roots  " }).name).toBe("Roots");
    expect(() => createFolderInputSchema.parse({ name: "   " })).toThrow();
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
