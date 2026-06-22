import { useState } from "react";
import { expect, userEvent, waitFor } from "storybook/test";
import { EntryEditor } from "./entry-editor";

const meta = {
  component: EntryEditor,
  tags: ["ai-generated"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="flex h-svh min-h-0 overflow-hidden bg-background text-on-background">
        <Story />
      </div>
    ),
  ],
};

export default meta;

function ControlledEntryEditor(args) {
  const [title, setTitle] = useState(args.title);
  const [body, setBody] = useState(args.body);

  return (
    <EntryEditor
      {...args}
      title={title}
      body={body}
      onTitleChange={setTitle}
      onBodyChange={setBody}
    />
  );
}

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

export const NewEntryTitleSelected = {
  args: {
    title: "Untitled 1",
    body: "",
    occurredAt: "2026-06-05T12:00:00.000Z",
    focusTarget: "title-all",
  },
  render: (args) => <ControlledEntryEditor {...args} />,
  play: async ({ canvas }) => {
    const titleInput = canvas.getByDisplayValue("Untitled 1");

    await waitFor(() => {
      expect(titleInput).toHaveFocus();
      expect(titleInput.selectionStart).toBe(0);
      expect(titleInput.selectionEnd).toBe("Untitled 1".length);
    });

    await userEvent.keyboard("Dream notes");

    await expect(canvas.getByDisplayValue("Dream notes")).toBeVisible();
    expect(titleInput.selectionStart).toBe("Dream notes".length);
    expect(titleInput.selectionEnd).toBe("Dream notes".length);
  },
};
