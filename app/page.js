import { getJournalPageInitialData } from "@/lib/journal-page-data.js";
import { JournalApp } from "@/components/journal/journal-app";

export const dynamic = "force-dynamic";

export default async function Home() {
  const initialData = await getJournalPageInitialData();

  return (
    <JournalApp
      initialEntries={initialData.initialEntries}
      initialFolders={initialData.initialFolders}
      initialError={initialData.initialError}
      initialDraftOccurredAt={initialData.initialDraftOccurredAt}
    />
  );
}
