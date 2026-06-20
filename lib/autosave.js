export function getAutosaveTitle(title) {
  return title.trim() ? title.trim() : null;
}

export function buildAutosavePayload({
  title,
  body,
  entryType,
  folderId,
  journalDate,
  occurredAt,
  entryId,
}) {
  const trimmedBody = body.trim();
  const normalizedTitle = getAutosaveTitle(title);

  if (!entryId) {
    if (trimmedBody.length === 0) {
      return null;
    }

    return {
      title: normalizedTitle,
      body,
      entry_type: entryType,
      folder_id: folderId,
      journal_date: journalDate,
      occurred_at: occurredAt,
    };
  }

  return {
    title: normalizedTitle,
    body,
  };
}

export function resolveSavedEntryState({ pending, latestPending, savedEntry }) {
  const hasNewerPending = Boolean(latestPending && latestPending !== pending);
  const newerPendingBelongsToSavedEntry =
    hasNewerPending &&
    (latestPending.entryId === savedEntry.id ||
      latestPending.entryId === pending.entryId ||
      (!pending.entryId && !latestPending.entryId));

  if (!newerPendingBelongsToSavedEntry) {
    return {
      entryForList: savedEntry,
      nextPending: latestPending === pending ? null : latestPending,
      hasNewerPending: false,
    };
  }

  return {
    entryForList: {
      ...savedEntry,
      title: getAutosaveTitle(latestPending.title),
      body: latestPending.body,
    },
    nextPending: {
      ...latestPending,
      entryId: latestPending.entryId ?? savedEntry.id,
    },
    hasNewerPending: true,
  };
}
