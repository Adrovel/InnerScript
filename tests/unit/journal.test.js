import { afterEach, describe, expect, test } from "vitest";
import MockDate from "mockdate";
import {
  buildMarkdownExport,
  findTodayJournalEntry,
  getMarkdownExportFilename,
  getNextUntitledEntryTitle,
} from "../../lib/journal.js";
import { buildEntriesMarkdownExport } from "../../lib/export.js";
import { buildEntryChunks, scoreChunkForQuery } from "../../lib/chunking.js";

describe("journal helpers", () => {
  afterEach(() => {
    MockDate.reset();
  });

  test("finds today's journal by journal_date instead of entry_type", () => {
    MockDate.set("2026-06-12T08:00:00.000Z");

    const todayDocument = {
      id: "entry-today",
      title: "Today",
      entry_type: "note",
      journal_date: "2026-06-12",
      occurred_at: "2026-06-12T08:00:00.000Z",
      created_at: "2026-06-12T08:00:00.000Z",
    };

    expect(
      findTodayJournalEntry([
        {
          id: "legacy-shape",
          entry_type: "journal",
          journal_date: null,
          occurred_at: "2026-06-12T07:00:00.000Z",
          created_at: "2026-06-12T07:00:00.000Z",
        },
        todayDocument,
      ]),
    ).toBe(todayDocument);
  });

  test("generates the next Untitled entry title from existing numbered titles", () => {
    expect(getNextUntitledEntryTitle([])).toBe("Untitled 1");

    expect(
      getNextUntitledEntryTitle([
        { title: "Untitled 1" },
        { title: "Untitled 2" },
        { title: "Untitled" },
        { title: "Project note" },
        { title: null },
      ]),
    ).toBe("Untitled 3");
  });

  test("uses the highest existing Untitled number to avoid duplicates", () => {
    expect(
      getNextUntitledEntryTitle([
        { title: "Untitled 1" },
        { title: "Untitled 4" },
      ]),
    ).toBe("Untitled 5");
  });

  test("builds Markdown export content for the current entry", () => {
    expect(
      buildMarkdownExport({
        title: "  Evening check-in ",
        body: "Line one\n\nLine two\n\n",
        occurredAt: "2026-06-23T10:30:00.000Z",
      }),
    ).toBe("# Evening check-in\n\nDate: 2026-06-23\n\nLine one\n\nLine two\n");
  });

  test("uses safe Markdown export filenames", () => {
    expect(
      getMarkdownExportFilename({
        title: "Evening: check-in / plans?",
        occurredAt: "2026-06-23T10:30:00.000Z",
      }),
    ).toBe("2026-06-23-evening-check-in-plans.md");

    expect(getMarkdownExportFilename({ title: "", occurredAt: null })).toBe("untitled.md");
  });

  test("builds an archive Markdown export from multiple entries", () => {
    expect(
      buildEntriesMarkdownExport([
        {
          title: "One",
          body: "First body",
          occurred_at: "2026-06-23T10:30:00.000Z",
          created_at: "2026-06-23T10:30:00.000Z",
        },
        {
          title: "Two",
          body: "Second body",
          occurred_at: "2026-06-24T10:30:00.000Z",
          created_at: "2026-06-24T10:30:00.000Z",
        },
      ]),
    ).toContain("# One\n\nDate: 2026-06-23\n\nFirst body\n\n---\n\n# Two");
  });

  test("chunks entries by paragraphs and scores local search matches", () => {
    const chunks = buildEntryChunks({
      id: "entry-1",
      title: "Patterns",
      body: "I felt anxious about Google prep.\n\nMoney anxiety came back again.",
      entry_type: "note",
      journal_date: "2026-06-24",
    });

    expect(chunks).toHaveLength(2);
    expect(chunks[0]).toMatchObject({
      entryId: "entry-1",
      chunkIndex: 0,
      text: "I felt anxious about Google prep.",
      tokenCount: 6,
    });
    expect(scoreChunkForQuery(chunks[0].text, "Google anxiety")).toBeGreaterThan(0);
    expect(scoreChunkForQuery(chunks[0].text, "relationship warmth")).toBe(0);
  });
});
