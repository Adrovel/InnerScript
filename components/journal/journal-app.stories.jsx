import { expect, waitFor } from "storybook/test";
import { JournalApp } from "./journal-app";

const today = "2026-06-05T12:00:00.000Z";

const entries = [
  {
    id: "entry-journal-1",
    title: "Friday reflection",
    body: "I noticed the same loop again: wanting clarity, then avoiding the quiet work that would create it.",
    entry_type: "journal",
    occurred_at: today,
    created_at: today,
    updated_at: today,
  },
  {
    id: "entry-note-1",
    title: "Therapy question",
    body: "What evidence would make this fear smaller?",
    entry_type: "note",
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
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByDisplayValue("Friday reflection")).toBeVisible();
  },
};

export const EmptyJournal = {
  args: {
    initialEntries: [],
  },
};

export const RefreshesEntries = {
  args: {
    initialEntries: [],
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: /reload entries/i }));
    await waitFor(() => {
      expect(canvas.getByDisplayValue("Friday reflection")).toBeVisible();
    });
  },
};
