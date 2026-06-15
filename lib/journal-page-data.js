import { listEntries } from "./entries.js";
import { listFolders } from "./folders.js";

const LOAD_ERROR_MESSAGE = "Failed to load entries. Check that Postgres is running.";

export async function getJournalPageInitialData({ now = new Date() } = {}) {
  const initialDraftOccurredAt = now.toISOString();

  try {
    const [initialEntries, initialFolders] = await Promise.all([
      listEntries(),
      listFolders({ ensureDefaults: true }),
    ]);

    return {
      initialEntries,
      initialFolders,
      initialError: null,
      initialDraftOccurredAt,
    };
  } catch {
    return {
      initialEntries: [],
      initialFolders: [],
      initialError: LOAD_ERROR_MESSAGE,
      initialDraftOccurredAt,
    };
  }
}
