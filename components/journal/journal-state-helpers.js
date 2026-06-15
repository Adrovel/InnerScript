import { getLocalDayKey } from "@/lib/journal";

export function createDraft({
  folderId = null,
  journalDate = null,
  occurredAt = new Date().toISOString(),
} = {}) {
  return {
    id: null,
    title: "",
    body: "",
    entry_type: "document",
    folder_id: folderId,
    journal_date: journalDate,
    occurred_at: occurredAt,
  };
}

export function createJournalDraft(journalFolder, occurredAt = new Date().toISOString()) {
  return createDraft({
    folderId: journalFolder?.id ?? null,
    journalDate: getLocalDayKey(new Date(occurredAt)),
    occurredAt,
  });
}

export function getEditorState({ selectedEntry, draft }) {
  if (selectedEntry) {
    return {
      title: selectedEntry.title ?? "",
      body: selectedEntry.body,
      entryType: selectedEntry.entry_type,
      folderId: selectedEntry.folder_id,
      journalDate: selectedEntry.journal_date,
      occurredAt: selectedEntry.occurred_at ?? selectedEntry.created_at,
      updatedAt: selectedEntry.updated_at ?? selectedEntry.created_at,
    };
  }

  return {
    title: draft.title,
    body: draft.body,
    entryType: draft.entry_type,
    folderId: draft.folder_id,
    journalDate: draft.journal_date,
    occurredAt: draft.occurred_at,
    updatedAt: draft.occurred_at,
  };
}

export function getEditorKey({ selectedEntryId, draft }) {
  return (
    selectedEntryId ??
    `${draft.folder_id ?? "root"}-${draft.journal_date ?? "document"}-${draft.occurred_at}`
  );
}

export function getFocusTarget({ editorFocusRequest, selectedEntryId, isDraft }) {
  if (editorFocusRequest?.entryId === selectedEntryId) {
    return editorFocusRequest.target;
  }

  return isDraft ? "body" : null;
}

export function replaceById(items, nextItem) {
  return items.map((item) => (item.id === nextItem.id ? nextItem : item));
}

export function removeById(items, id) {
  return items.filter((item) => item.id !== id);
}

export function upsertById(items, nextItem) {
  return [nextItem, ...removeById(items, nextItem.id)];
}

export function sortEntriesByDate(entries) {
  return entries.sort((left, right) => {
    const leftDate = new Date(left.occurred_at ?? left.created_at).getTime();
    const rightDate = new Date(right.occurred_at ?? right.created_at).getTime();
    return rightDate - leftDate;
  });
}
