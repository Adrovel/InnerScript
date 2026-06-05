import { expect } from "storybook/test";
import { EntryEditor } from "./entry-editor";

const meta = {
  component: EntryEditor,
  tags: ["ai-generated"],
};

export default meta;

export const WrittenEntry = {
  args: {
    title: "Friday reflection",
    body: "I noticed a pattern. Writing it down made the loop easier to see.",
    occurredAt: "2026-06-05T12:00:00.000Z",
    onTitleChange: () => {},
    onBodyChange: () => {},
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/13 words/i)).toBeVisible();
  },
};

export const EmptyDraft = {
  args: {
    title: "",
    body: "",
    occurredAt: "2026-06-05T12:00:00.000Z",
    onTitleChange: () => {},
    onBodyChange: () => {},
  },
};
