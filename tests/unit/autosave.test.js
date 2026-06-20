import { describe, expect, test } from "vitest";
import {
  buildAutosavePayload,
  getAutosaveTitle,
  resolveSavedEntryState,
} from "../../lib/autosave.js";

const savedEntry = {
  id: "entry-1",
  title: null,
  body: "hello",
  entry_type: "document",
  source_id: null,
  occurred_at: "2026-06-04T00:00:00.000Z",
  created_at: "2026-06-04T00:00:00.000Z",
  updated_at: "2026-06-04T00:00:01.000Z",
};

describe("autosave helpers", () => {
  test("normalizes blank titles without deriving from body text", () => {
    expect(getAutosaveTitle("")).toBeNull();
    expect(getAutosaveTitle("   ")).toBeNull();
    expect(getAutosaveTitle("  Real title  ")).toBe("Real title");
  });

  test("skips blank draft creates but allows existing entries to be cleared", () => {
    expect(
      buildAutosavePayload({
        title: "",
        body: "",
        entryType: "document",
        entryId: null,
      }),
    ).toBeNull();

    expect(
      buildAutosavePayload({
        title: "  Cleared  ",
        body: "",
        entryType: "document",
        entryId: savedEntry.id,
      }),
    ).toEqual({
      title: "Cleared",
      body: "",
    });
  });

  test("keeps newer local body when an older save response returns late", () => {
    const pending = {
      title: "",
      body: "hello",
      entryType: "document",
      occurredAt: savedEntry.occurred_at,
      entryId: savedEntry.id,
    };
    const latestPending = {
      title: "",
      body: "hello world",
      entryType: "document",
      occurredAt: savedEntry.occurred_at,
      entryId: savedEntry.id,
    };

    const result = resolveSavedEntryState({ pending, latestPending, savedEntry });

    expect(result.hasNewerPending).toBe(true);
    expect(result.entryForList).toMatchObject({
      id: savedEntry.id,
      title: null,
      body: "hello world",
    });
    expect(result.nextPending).toMatchObject({
      entryId: savedEntry.id,
      body: "hello world",
    });
  });

  test("attaches the created entry id to newer typing from a draft save", () => {
    const pending = {
      title: "",
      body: "hello",
      entryType: "document",
      occurredAt: savedEntry.occurred_at,
      entryId: null,
    };
    const latestPending = {
      title: "Later",
      body: "hello after create",
      entryType: "document",
      occurredAt: savedEntry.occurred_at,
      entryId: null,
    };

    const result = resolveSavedEntryState({ pending, latestPending, savedEntry });

    expect(result.hasNewerPending).toBe(true);
    expect(result.entryForList).toMatchObject({
      id: savedEntry.id,
      title: "Later",
      body: "hello after create",
    });
    expect(result.nextPending).toMatchObject({
      entryId: savedEntry.id,
      title: "Later",
      body: "hello after create",
    });
  });

  test("clears pending state when no newer typing exists", () => {
    const pending = {
      title: "",
      body: "hello",
      entryType: "document",
      occurredAt: savedEntry.occurred_at,
      entryId: savedEntry.id,
    };

    const result = resolveSavedEntryState({
      pending,
      latestPending: pending,
      savedEntry,
    });

    expect(result.hasNewerPending).toBe(false);
    expect(result.entryForList).toBe(savedEntry);
    expect(result.nextPending).toBeNull();
  });
});
