import { and, asc, eq, isNull } from "drizzle-orm";
import { getDb } from "../db/client.js";
import { folders } from "../db/schema.js";
import { createFolderInputSchema, idSchema } from "./contracts.js";
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
