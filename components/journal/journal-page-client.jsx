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

export function JournalPageClient({ initialEntries, initialError }) {
  return <JournalApp initialEntries={initialEntries} initialError={initialError} />;
}
