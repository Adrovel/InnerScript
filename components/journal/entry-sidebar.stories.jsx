import { expect } from "storybook/test";
import { EntrySidebar } from "./entry-sidebar";

const entries = [
  {
    id: "entry-journal-1",
    title: "Friday reflection",
    body: "A journal entry",
    entry_type: "journal",
    occurred_at: "2026-06-05T12:00:00.000Z",
    created_at: "2026-06-05T12:00:00.000Z",
    updated_at: "2026-06-05T12:00:00.000Z",
  },
  {
    id: "entry-note-1",
    title: "Therapy question",
    body: "A note",
    entry_type: "note",
    occurred_at: "2026-06-04T18:30:00.000Z",
    created_at: "2026-06-04T18:30:00.000Z",
    updated_at: "2026-06-04T18:30:00.000Z",
  },
];

const meta = {
  component: EntrySidebar,
  tags: ["ai-generated"],
};

export default meta;

export const WithEntries = {
  args: {
    entries,
    selectedEntryId: "entry-journal-1",
    onSelectEntry: () => {},
    onNewNote: () => {},
    onToggleCollapse: () => {},
    onMobileClose: () => {},
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: /friday reflection/i })).toHaveClass(
      /bg-surface-container-high/,
    );
  },
};

export const Empty = {
  args: {
    entries: [],
    selectedEntryId: null,
    onSelectEntry: () => {},
    onNewNote: () => {},
    onToggleCollapse: () => {},
    onMobileClose: () => {},
  },
};

export const CreatingNote = {
  args: {
    entries,
    selectedEntryId: "entry-note-1",
    creatingNote: true,
    onSelectEntry: () => {},
    onNewNote: () => {},
    onToggleCollapse: () => {},
    onMobileClose: () => {},
  },
};
