import { expect } from "storybook/test";
import { JournalApp } from "./journal-app";

const today = "2026-06-05T12:00:00.000Z";

const folders = [
  {
    id: "folder-journal",
    name: "Journal",
    parent_folder_id: null,
    sort_order: 0,
    created_at: today,
    updated_at: today,
  },
];

const entries = [
  {
    id: "entry-journal-1",
    title: "Friday reflection",
    body: "I noticed the same loop again: wanting clarity, then avoiding the quiet work that would create it.",
    entry_type: "note",
    folder_id: "folder-journal",
    journal_date: "2026-06-05",
    source_id: null,
    occurred_at: today,
    created_at: today,
    updated_at: today,
  },
  {
    id: "entry-note-1",
    title: "Therapy question",
    body: "What evidence would make this fear smaller?",
    entry_type: "note",
    folder_id: null,
    journal_date: null,
    source_id: null,
    occurred_at: "2026-06-04T18:30:00.000Z",
    created_at: "2026-06-04T18:30:00.000Z",
    updated_at: "2026-06-04T18:30:00.000Z",
  },
];

const meta = {
  component: JournalApp,
  tags: ["ai-generated"],
};

export default meta;

export const LoadedJournal = {
  args: {
    initialEntries: entries,
    initialFolders: folders,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByDisplayValue("Friday reflection")).toBeVisible();
  },
};

export const EmptyJournal = {
  args: {
    initialEntries: [],
    initialFolders: folders,
  },
};
