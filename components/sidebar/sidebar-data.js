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
  const entriesByFolderId = new Map(folders.map((folder) => [folder.id, []]));
  const foldersByParentId = new Map();

  for (const folder of folders) {
    const parentFolderId = folder.parent_folder_id ?? null;
    const siblingFolders = foldersByParentId.get(parentFolderId) ?? [];
    siblingFolders.push(folder);
    foldersByParentId.set(parentFolderId, siblingFolders);
  }

  for (const folderEntries of entriesByFolderId.values()) {
    folderEntries.length = 0;
  }

  for (const entry of entries) {
    if (entry.folder_id && entriesByFolderId.has(entry.folder_id)) {
      entriesByFolderId.get(entry.folder_id).push(entry);
    }
  }

  const buildGroup = (folder) => ({
    id: folder.id,
    label: folder.name,
    Icon: Folder,
    entries: entriesByFolderId.get(folder.id) ?? [],
    folders: sortFolders(foldersByParentId.get(folder.id) ?? []).map(buildGroup),
  });

  return sortFolders(foldersByParentId.get(null) ?? []).map(buildGroup);
}

export function getRootSidebarEntries(entries) {
  return entries.filter((entry) => !entry.folder_id);
}

function sortFolders(folders) {
  return [...folders].sort((left, right) => {
    const sortOrderDelta = (left.sort_order ?? 0) - (right.sort_order ?? 0);

    if (sortOrderDelta !== 0) {
      return sortOrderDelta;
    }

    const nameDelta = left.name.localeCompare(right.name);

    if (nameDelta !== 0) {
      return nameDelta;
    }

    return new Date(left.created_at).getTime() - new Date(right.created_at).getTime();
  });
}
