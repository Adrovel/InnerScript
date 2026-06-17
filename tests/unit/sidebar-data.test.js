import { describe, expect, test } from "vitest";
import { getRootSidebarEntries, groupSidebarEntries } from "../../components/sidebar/sidebar-data.js";

const rootFolder = {
  id: "folder-root",
  name: "Projects",
  parent_folder_id: null,
  sort_order: 0,
  created_at: "2026-06-05T12:00:00.000Z",
};

const childFolder = {
  id: "folder-child",
  name: "InnerScript",
  parent_folder_id: "folder-root",
  sort_order: 0,
  created_at: "2026-06-05T12:01:00.000Z",
};

const rootEntry = {
  id: "entry-root",
  title: "Root note",
  folder_id: null,
  body: "",
};

const childEntry = {
  id: "entry-child",
  title: "Child note",
  folder_id: "folder-child",
  body: "",
};

describe("sidebar data", () => {
  test("builds nested folder groups with entries under their folder", () => {
    const [group] = groupSidebarEntries([rootEntry, childEntry], [childFolder, rootFolder]);

    expect(group).toMatchObject({
      id: "folder-root",
      label: "Projects",
      entries: [],
      folders: [
        {
          id: "folder-child",
          label: "InnerScript",
          entries: [childEntry],
          folders: [],
        },
      ],
    });
  });

  test("keeps root entries outside folder groups", () => {
    expect(getRootSidebarEntries([rootEntry, childEntry])).toEqual([rootEntry]);
  });
});
