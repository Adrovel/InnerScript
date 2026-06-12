import { describe, expect, test } from "vitest";
import { getNextUntitledEntryTitle } from "../../lib/journal.js";

describe("journal helpers", () => {
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
