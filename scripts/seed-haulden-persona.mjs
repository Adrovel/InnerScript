import { HAULDEN_ENTRIES, HAULDEN_FOLDERS, HAULDEN_PEOPLE } from "../lib/mock/haulden-persona.js";
import { createManualEntry, listEntries } from "../lib/entries.js";
import { createFolder, listFolders } from "../lib/folders.js";
import { createPerson, listPeople } from "../lib/people.js";

async function ensurePeople() {
  const existingPeople = await listPeople();
  const existingNames = new Set(existingPeople.map((person) => person.display_name));
  const created = [];

  for (const person of HAULDEN_PEOPLE) {
    if (existingNames.has(person.display_name)) {
      continue;
    }

    created.push(await createPerson(person));
  }

  return created;
}

async function ensureFolders() {
  const existingFolders = await listFolders();
  const foldersByName = new Map(existingFolders.map((folder) => [folder.name, folder]));
  const foldersByKey = new Map();
  const created = [];

  for (const folder of HAULDEN_FOLDERS) {
    const existingFolder = foldersByName.get(folder.name);
    const nextFolder = existingFolder ?? await createFolder({
      name: folder.name,
      sort_order: folder.sort_order,
    });

    foldersByKey.set(folder.key, nextFolder);

    if (!existingFolder) {
      created.push(nextFolder);
    }
  }

  return { foldersByKey, created };
}

async function ensureEntries(foldersByKey) {
  const existingEntries = await listEntries({ limit: 100 });
  const existingTitles = new Set(existingEntries.map((entry) => entry.title));
  const created = [];

  for (const entry of HAULDEN_ENTRIES) {
    if (existingTitles.has(entry.title)) {
      continue;
    }

    const folder = foldersByKey.get(entry.folder_key);
    created.push(await createManualEntry({
      title: entry.title,
      body: entry.body,
      folder_id: folder?.id ?? null,
      journal_date: entry.journal_date,
      occurred_at: entry.occurred_at,
    }));
  }

  return created;
}

async function main() {
  const people = await ensurePeople();
  const { foldersByKey, created: folders } = await ensureFolders();
  const entries = await ensureEntries(foldersByKey);

  console.log(`Haulden seed complete: ${people.length} people, ${folders.length} folders, ${entries.length} entries created.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
