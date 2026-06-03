import { listEntries } from "@/lib/entries.js";
import { JournalPageClient } from "@/components/journal/journal-page-client";

export const dynamic = "force-dynamic";

export default async function Home() {
  let initialEntries = [];
  let initialError = null;

  try {
    initialEntries = await listEntries();
  } catch {
    initialError = "Failed to load entries. Check that Postgres is running.";
  }

  return <JournalPageClient initialEntries={initialEntries} initialError={initialError} />;
}
