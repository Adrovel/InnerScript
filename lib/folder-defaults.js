export const DEFAULT_JOURNAL_FOLDER_NAME = "Journal";

export function isDefaultJournalFolder(folder) {
  return Boolean(folder) && folder.name === DEFAULT_JOURNAL_FOLDER_NAME && !folder.parent_folder_id;
}

export function findDefaultJournalFolder(folders = []) {
  return folders.find(isDefaultJournalFolder) ?? null;
}
