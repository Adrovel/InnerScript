"use client";

import nextDynamic from "next/dynamic";
import { JournalShellSkeleton } from "@/components/journal/journal-shell-skeleton";

const JournalApp = nextDynamic(
  () => import("@/components/journal/journal-app").then((mod) => mod.JournalApp),
  {
    ssr: false,
    loading: () => <JournalShellSkeleton />,
  },
);

export function JournalPageClient({ initialEntries, initialFolders, initialError }) {
  return (
    <JournalApp
      initialEntries={initialEntries}
      initialFolders={initialFolders}
      initialError={initialError}
    />
  );
}
