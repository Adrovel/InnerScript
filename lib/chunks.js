import "server-only";

import { and, eq, inArray, not, sql } from "drizzle-orm";
import { getDb } from "../db/client.js";
import { chunks, entries } from "../db/schema.js";
import { buildEntryChunks, scoreChunkForQuery } from "./chunking.js";

function serializeChunk(row) {
  return {
    id: row.id,
    entry_id: row.entryId,
    chunk_index: row.chunkIndex,
    text: row.text,
    token_count: row.tokenCount,
    metadata: row.metadata,
    created_at: row.createdAt.toISOString(),
    updated_at: row.updatedAt.toISOString(),
  };
}

export async function reindexEntryChunks(entry) {
  await getDb().delete(chunks).where(eq(chunks.entryId, entry.id));

  const nextChunks = buildEntryChunks(entry);

  if (nextChunks.length === 0) {
    return [];
  }

  const rows = await getDb().insert(chunks).values(nextChunks).returning();
  return rows.map(serializeChunk);
}

export async function reindexEntriesChunks(nextEntries) {
  const indexed = [];

  for (const entry of nextEntries) {
    indexed.push(...await reindexEntryChunks(entry));
  }

  return indexed;
}

export async function deleteEntryChunks(entryId) {
  await getDb().delete(chunks).where(eq(chunks.entryId, entryId));
}

export async function searchChunks({ query, limit = 10, folderId = null } = {}) {
  const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 25);
  const normalizedQuery = query?.trim() ?? "";

  if (!normalizedQuery) {
    return [];
  }

  const whereClause = folderId
    ? and(eq(entries.folderId, folderId), sql`${chunks.text} ILIKE ${`%${normalizedQuery}%`}`)
    : sql`${chunks.text} ILIKE ${`%${normalizedQuery}%`}`;

  const exactRows = await getDb()
    .select({
      chunk: chunks,
      entry: entries,
    })
    .from(chunks)
    .innerJoin(entries, eq(chunks.entryId, entries.id))
    .where(whereClause)
    .limit(safeLimit);

  let rows = exactRows;

  if (rows.length < safeLimit) {
    const existingIds = rows.map((row) => row.chunk.id);
    let fallbackQuery = getDb()
      .select({
        chunk: chunks,
        entry: entries,
      })
      .from(chunks)
      .innerJoin(entries, eq(chunks.entryId, entries.id));

    if (existingIds.length > 0) {
      fallbackQuery = fallbackQuery.where(not(inArray(chunks.id, existingIds)));
    }

    const fallbackRows = await fallbackQuery.limit(100);

    rows = [...rows, ...fallbackRows];
  }

  return rows
    .map((row) => ({
      chunk: serializeChunk(row.chunk),
      entry: {
        id: row.entry.id,
        title: row.entry.title,
        entry_type: row.entry.entryType,
        journal_date: row.entry.journalDate,
        source_id: row.entry.sourceId,
        occurred_at: row.entry.occurredAt?.toISOString() ?? null,
        created_at: row.entry.createdAt.toISOString(),
        updated_at: row.entry.updatedAt.toISOString(),
      },
      score: scoreChunkForQuery(row.chunk.text, normalizedQuery),
    }))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, safeLimit);
}
