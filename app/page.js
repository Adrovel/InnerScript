import { listEntries } from "@/lib/entries.js";
import { listFolders } from "@/lib/folders.js";
import { JournalPageClient } from "@/components/journal/journal-page-client";

export const dynamic = "force-dynamic";

export default async function Home() {
  let initialEntries = [];
  let initialFolders = [];
  let initialError = null;

  try {
    [initialEntries, initialFolders] = await Promise.all([
      listEntries(),
      listFolders({ ensureDefaults: true }),
    ]);
  } catch {
    initialError = "Failed to load entries. Check that Postgres is running.";
  }

  return (
    <JournalPageClient
      initialEntries={initialEntries}
      initialFolders={initialFolders}
      initialError={initialError}
    />
  );
}
