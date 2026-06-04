export function getAutosaveTitle(title) {
  return title.trim() ? title.trim() : null;
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
