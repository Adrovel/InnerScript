import { desc, eq } from "drizzle-orm";
import { getDb } from "../db/client.js";
import { entries } from "../db/schema.js";
import {
  createManualEntryInputSchema,
  idSchema,
  updateEntryInputSchema,
} from "./contracts.js";

function serializeJournalDate(value) {
  if (!value) {
    return null;
  }

  return value instanceof Date ? value.toISOString().slice(0, 10) : value;
}

function getDateOnly(value) {
  return value instanceof Date
    ? value.toISOString().slice(0, 10)
    : new Date(value).toISOString().slice(0, 10);
}

export function serializeEntry(entry) {
  return {
    id: entry.id,
    title: entry.title,
    body: entry.body,
    entry_type: entry.entryType,
    folder_id: entry.folderId,
    journal_date: serializeJournalDate(entry.journalDate),
    source_id: entry.sourceId,
    occurred_at: entry.occurredAt?.toISOString() ?? null,
    created_at: entry.createdAt.toISOString(),
    updated_at: entry.updatedAt.toISOString(),
  };
}

export async function listEntries({ limit = 50 } = {}) {
  const safeLimit = Math.min(Math.max(Number(limit) || 50, 1), 100);
  const rows = await getDb()
    .select()
    .from(entries)
    .orderBy(desc(entries.occurredAt), desc(entries.createdAt))
    .limit(safeLimit);

  return rows.map(serializeEntry);
}

export async function getEntry(id) {
  const entryId = idSchema.parse(id);
  const [row] = await getDb().select().from(entries).where(eq(entries.id, entryId)).limit(1);

  return row ? serializeEntry(row) : null;
}

export async function createManualEntry(input) {
  const parsed = createManualEntryInputSchema.parse(input);
  const now = new Date();
  const occurredAt = parsed.occurred_at ?? now;
  const journalDate =
    parsed.journal_date ?? (parsed.entry_type === "journal" ? getDateOnly(occurredAt) : null);
  const [row] = await getDb()
    .insert(entries)
    .values({
      title: parsed.title ?? null,
      body: parsed.body,
      entryType: "document",
      folderId: parsed.folder_id ?? null,
      journalDate,
      sourceId: null,
      occurredAt,
      updatedAt: now,
    })
    .returning();

  return serializeEntry(row);
}

export async function updateEntry(id, input) {
  const entryId = idSchema.parse(id);
  const parsed = updateEntryInputSchema.parse(input);
  const updates = {
    updatedAt: new Date(),
  };

  if (parsed.title !== undefined) {
    updates.title = parsed.title;
  }

  if (parsed.body !== undefined) {
    updates.body = parsed.body;
  }

  if (parsed.folder_id !== undefined) {
    updates.folderId = parsed.folder_id;
  }

  if (parsed.journal_date !== undefined) {
    updates.journalDate = parsed.journal_date;
  }

  if (parsed.occurred_at !== undefined) {
    updates.occurredAt = parsed.occurred_at;
  }

  const [row] = await getDb()
    .update(entries)
    .set(updates)
    .where(eq(entries.id, entryId))
    .returning();

  return row ? serializeEntry(row) : null;
}

export async function deleteEntry(id) {
  const entryId = idSchema.parse(id);
  const [row] = await getDb().delete(entries).where(eq(entries.id, entryId)).returning({ id: entries.id });

  return Boolean(row);
}
