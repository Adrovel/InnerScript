import "server-only";

import { getDb } from "../db/client.js";
import { entries, sources } from "../db/schema.js";
import { serializeEntry } from "./entries.js";
import { createSourceInputSchema, createSourceWithEntriesInputSchema } from "./contracts.js";

export function serializeSource(source) {
  return {
    id: source.id,
    source_type: source.sourceType,
    display_name: source.displayName,
    original_filename: source.originalFilename,
    metadata: source.metadata,
    imported_at: source.importedAt.toISOString(),
    created_at: source.createdAt.toISOString(),
  };
}

function sourceValues(source) {
  const values = {
    sourceType: source.source_type,
    displayName: source.display_name ?? null,
    originalFilename: source.original_filename ?? null,
    metadata: source.metadata,
  };

  if (source.imported_at !== undefined) {
    values.importedAt = source.imported_at;
  }

  return values;
}

function entryValues(entry, sourceId) {
  return {
    title: entry.title ?? null,
    body: entry.body,
    entryType: entry.entry_type,
    folderId: entry.folder_id ?? null,
    journalDate: entry.journal_date ?? null,
    sourceId,
    occurredAt: entry.occurred_at ?? null,
    updatedAt: new Date(),
  };
}

export async function createSource(input) {
  const parsed = createSourceInputSchema.parse(input);
  const [row] = await getDb().insert(sources).values(sourceValues(parsed)).returning();

  return serializeSource(row);
}

export async function createSourceWithEntries(input) {
  const parsed = createSourceWithEntriesInputSchema.parse(input);

  return getDb().transaction(async (tx) => {
    const [source] = await tx.insert(sources).values(sourceValues(parsed.source)).returning();
    const rows = await tx
      .insert(entries)
      .values(parsed.entries.map((entry) => entryValues(entry, source.id)))
      .returning();

    return {
      source: serializeSource(source),
      entries: rows.map(serializeEntry),
    };
  });
}
