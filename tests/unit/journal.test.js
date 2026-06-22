import { afterEach, describe, expect, test } from "vitest";
import MockDate from "mockdate";
import { findTodayJournalEntry, getNextUntitledEntryTitle } from "../../lib/journal.js";

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
});
