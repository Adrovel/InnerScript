export const DEFAULT_MAX_CHUNK_WORDS = 160;

function countChunkWords(text) {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

function splitLongParagraph(paragraph, maxWords) {
  const words = paragraph.trim().split(/\s+/);
  const chunks = [];

  for (let index = 0; index < words.length; index += maxWords) {
    chunks.push(words.slice(index, index + maxWords).join(" "));
  }

  return chunks;
}

export function buildEntryChunks(entry, { maxWords = DEFAULT_MAX_CHUNK_WORDS } = {}) {
  const body = entry.body?.trim() ?? "";
  const entryType = entry.entry_type ?? entry.entryType ?? null;
  const journalDate = entry.journal_date ?? entry.journalDate ?? null;
  const sourceId = entry.source_id ?? entry.sourceId ?? null;
  const occurredAt = entry.occurred_at ?? entry.occurredAt?.toISOString?.() ?? null;

  if (!body) {
    return [];
  }

  const paragraphs = body
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .flatMap((paragraph) =>
      countChunkWords(paragraph) > maxWords ? splitLongParagraph(paragraph, maxWords) : [paragraph],
    );

  return paragraphs.map((text, index) => ({
    entryId: entry.id,
    chunkIndex: index,
    text,
    tokenCount: countChunkWords(text),
    metadata: {
      title: entry.title ?? null,
      entry_type: entryType,
      journal_date: journalDate,
      source_id: sourceId,
      occurred_at: occurredAt,
    },
  }));
}

export function getSearchTerms(query) {
  return query
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .map((term) => term.trim())
    .filter((term) => term.length >= 2);
}

export function scoreChunkForQuery(chunkText, query) {
  const terms = getSearchTerms(query);

  if (terms.length === 0) {
    return 0;
  }

  const haystack = chunkText.toLowerCase();
  const matches = terms.filter((term) => haystack.includes(term)).length;
  const exactBoost = haystack.includes(query.toLowerCase().trim()) ? 1 : 0;

  return matches / terms.length + exactBoost;
}
