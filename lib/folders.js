import "server-only";

import { and, asc, eq, inArray, isNull } from "drizzle-orm";
import { getDb } from "../db/client.js";
import { entries, folders } from "../db/schema.js";
import { createFolderInputSchema, idSchema, updateFolderInputSchema } from "./contracts.js";
import { DEFAULT_JOURNAL_FOLDER_NAME } from "./folder-defaults.js";

export function serializeFolder(folder) {
  return {
    id: folder.id,
    name: folder.name,
    parent_folder_id: folder.parentFolderId,
    sort_order: folder.sortOrder,
    created_at: folder.createdAt.toISOString(),
    updated_at: folder.updatedAt.toISOString(),
  };
}

async function getRootFolderByName(name) {
  const [row] = await getDb()
    .select()
    .from(folders)
    .where(and(eq(folders.name, name), isNull(folders.parentFolderId)))
    .limit(1);

  return row ? serializeFolder(row) : null;
}

function getFolderSubtreeIds(folderRows, rootFolderId) {
  const childrenByParentId = new Map();

  for (const folder of folderRows) {
    const parentFolderId = folder.parentFolderId ?? null;
    const children = childrenByParentId.get(parentFolderId) ?? [];
    children.push(folder.id);
    childrenByParentId.set(parentFolderId, children);
  }

  const folderIds = [];
  const pendingFolderIds = [rootFolderId];

  while (pendingFolderIds.length > 0) {
    const folderId = pendingFolderIds.pop();
    folderIds.push(folderId);
    pendingFolderIds.push(...(childrenByParentId.get(folderId) ?? []));
  }

  return folderIds;
}

export async function ensureDefaultJournalFolder() {
  const existingFolder = await getRootFolderByName(DEFAULT_JOURNAL_FOLDER_NAME);

  if (existingFolder) {
    return existingFolder;
  }

  return createFolder({
    name: DEFAULT_JOURNAL_FOLDER_NAME,
    parent_folder_id: null,
    sort_order: 0,
  });
}

export async function listFolders({ ensureDefaults = false } = {}) {
  if (ensureDefaults) {
    await ensureDefaultJournalFolder();
  }

  const rows = await getDb()
    .select()
    .from(folders)
    .orderBy(
      asc(folders.parentFolderId),
      asc(folders.sortOrder),
      asc(folders.name),
      asc(folders.createdAt),
    );

  return rows.map(serializeFolder);
}

export async function getFolder(id) {
  const folderId = idSchema.parse(id);
  const [row] = await getDb().select().from(folders).where(eq(folders.id, folderId)).limit(1);

  return row ? serializeFolder(row) : null;
}

export async function createFolder(input) {
  const parsed = createFolderInputSchema.parse(input);
  const [row] = await getDb()
    .insert(folders)
    .values({
      name: parsed.name,
      parentFolderId: parsed.parent_folder_id ?? null,
      sortOrder: parsed.sort_order ?? 0,
      updatedAt: new Date(),
    })
    .returning();

  return serializeFolder(row);
}

export async function updateFolder(id, input) {
  const folderId = idSchema.parse(id);
  const parsed = updateFolderInputSchema.parse(input);
  const updates = {
    updatedAt: new Date(),
  };

  if (parsed.name !== undefined) {
    updates.name = parsed.name;
  }

  const [row] = await getDb()
    .update(folders)
    .set(updates)
    .where(eq(folders.id, folderId))
    .returning();

  return row ? serializeFolder(row) : null;
}

export async function deleteFolder(id) {
  const folderId = idSchema.parse(id);

  return getDb().transaction(async (tx) => {
    const [existingFolder] = await tx
      .select({ id: folders.id })
      .from(folders)
      .where(eq(folders.id, folderId))
      .limit(1);

    if (!existingFolder) {
      return false;
    }

    const folderRows = await tx
      .select({
        id: folders.id,
        parentFolderId: folders.parentFolderId,
      })
      .from(folders);
    const folderIds = getFolderSubtreeIds(folderRows, folderId);

    await tx.delete(entries).where(inArray(entries.folderId, folderIds));

    for (const childFirstFolderId of [...folderIds].reverse()) {
      await tx.delete(folders).where(eq(folders.id, childFirstFolderId));
    }

    return true;
  });
}
