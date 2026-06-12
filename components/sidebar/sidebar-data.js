import { Folder } from "lucide-react";
import { getEntryLabel } from "@/lib/journal";

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

export function groupSidebarEntries(entries, folders = []) {
  return folders.map((folder) => ({
    id: folder.id,
    label: folder.name,
    Icon: Folder,
    entries: entries.filter((entry) => entry.folder_id === folder.id),
  }));
}

export function getRootSidebarEntries(entries) {
  return entries.filter((entry) => !entry.folder_id);
}
