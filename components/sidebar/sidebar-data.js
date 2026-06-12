import { BookOpen, StickyNote } from "lucide-react";
import { getEntryLabel } from "@/lib/journal";

const SIDEBAR_GROUPS = [
  {
    id: "journal",
    label: "Journal",
    Icon: BookOpen,
    filter: (entry) => entry.entry_type === "journal",
  },
  {
    id: "note",
    label: "Note",
    Icon: StickyNote,
    filter: (entry) => entry.entry_type !== "journal",
  },
];

export function filterSidebarEntries(entries, query) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return entries;
  }

  return entries.filter((entry) => {
    const label = getEntryLabel(entry).toLowerCase();
    const body = entry.body?.toLowerCase() ?? "";

    return label.includes(normalizedQuery) || body.includes(normalizedQuery);
  });
}

export function groupSidebarEntries(entries) {
  return SIDEBAR_GROUPS.map((group) => ({
    ...group,
    entries: entries.filter(group.filter),
  }));
}
