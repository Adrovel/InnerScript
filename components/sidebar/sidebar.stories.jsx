import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";

const folders = [
  {
    id: "folder-journal",
    name: "Journal",
    parent_folder_id: null,
    sort_order: 0,
    created_at: "2026-06-05T12:00:00.000Z",
    updated_at: "2026-06-05T12:00:00.000Z",
  },
];

const entries = [
  {
    id: "entry-journal-1",
    title: "Friday reflection",
    body: "A journal entry",
    entry_type: "note",
    folder_id: "folder-journal",
    journal_date: "2026-06-05",
    source_id: null,
    occurred_at: "2026-06-05T12:00:00.000Z",
    created_at: "2026-06-05T12:00:00.000Z",
    updated_at: "2026-06-05T12:00:00.000Z",
  },
  {
    id: "entry-note-1",
    title: "Therapy question",
    body: "A note",
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
  title: "Sidebar/App Sidebar",
  component: AppSidebar,
  tags: ["ai-generated"],
  decorators: [
    (Story) => (
      <SidebarProvider style={{ "--sidebar-width": "var(--spacing-sidebar-width, 280px)" }}>
        <Story />
      </SidebarProvider>
    ),
  ],
};

export default meta;

export const WithEntries = {
  args: {
    entries,
    folders,
    selectedEntryId: "entry-journal-1",
    onSelectEntry: fn(),
    onDeleteEntry: fn(),
    onRenameEntry: fn(),
    onNewNote: fn(),
    onCreateFolder: fn(),
    onDeleteFolder: fn(),
    onRenameFolder: fn(),
    onMobileClose: () => {},
  },
  play: async ({ args, canvas }) => {
    await expect(canvas.getByText("Innerscript")).toBeInTheDocument();
    await expect(canvas.getByText("Username")).toBeInTheDocument();
    await expect(canvas.queryByText("Private journal")).not.toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: /^new note$/i })).toHaveClass(/h-9/);
    await expect(canvas.getByRole("button", { name: /^new folder$/i })).toHaveClass(/h-9/);
    await expect(
      canvas.getByRole("searchbox", { name: /^search entries$/i }).closest("[data-sidebar='menu-button']"),
    ).toHaveClass(/h-9/);
    await expect(canvas.getByRole("button", { name: /^journal$/i })).toHaveClass(/h-7/);
    await expect(canvas.getByRole("button", { name: /^add journal$/i })).toBeInTheDocument();
    const journalRow = canvas.getByRole("button", { name: /^journal$/i }).parentElement;
    await expect(
      within(journalRow).getByRole("button", { name: /^open options for journal$/i }),
    ).toBeInTheDocument();
    await expect(canvas.queryByRole("button", { name: /^add note$/i })).not.toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: /^new note$/i })).not.toHaveClass(
      /border-outline-variant/,
    );
    await expect(canvas.getByRole("button", { name: /^new note$/i })).not.toHaveClass(/shadow-sm/);
    await expect(
      canvas.getByRole("button", { name: /^new note$/i }).querySelectorAll("svg"),
    ).toHaveLength(1);
    await expect(
      canvas.getByRole("button", { name: /^new folder$/i }).querySelectorAll("svg"),
    ).toHaveLength(1);
    await expect(canvas.getByRole("button", { name: /^journal$/i })).toHaveClass(
      /text-sidebar-foreground\/76/,
    );
    await expect(canvas.getByRole("button", { name: /^friday reflection$/i })).toHaveClass(
      /bg-sidebar-accent/,
    );
    await expect(canvas.getByRole("button", { name: /^friday reflection$/i })).toHaveClass(/h-7/);
    await expect(canvas.queryByRole("button", { name: /^note$/i })).not.toBeInTheDocument();
    await expect(
      canvas.getByRole("button", { name: /^therapy question$/i }).querySelector("svg"),
    ).toBeNull();
    await expect(
      canvas.getByRole("button", { name: /open options for friday reflection/i }),
    ).toBeInTheDocument();
    await expect(
      canvas.getByRole("button", { name: /open options for friday reflection/i }),
    ).toHaveClass(/right-0/);
    await userEvent.click(
      within(journalRow).getByRole("button", { name: /^open options for journal$/i }),
    );
    await userEvent.click(await within(document.body).findByRole("menuitem", { name: /^rename$/i }));
    await userEvent.clear(canvas.getByRole("textbox", { name: /^rename$/i }));
    await userEvent.type(canvas.getByRole("textbox", { name: /^rename$/i }), "Journal Archive");
    await userEvent.tab();
    await expect(args.onRenameFolder).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "folder-journal",
      }),
      "Journal Archive",
    );
    await userEvent.click(
      within(journalRow).getByRole("button", { name: /^open options for journal$/i }),
    );
    await userEvent.click(await within(document.body).findByRole("menuitem", { name: /^delete$/i }));
    await expect(args.onDeleteFolder).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "folder-journal",
      }),
    );
    await waitFor(() => {
      expect(document.body.querySelector("[data-slot='dropdown-menu-content']")).not.toBeInTheDocument();
      expect(canvas.queryByRole("textbox", { name: /^rename$/i })).not.toBeInTheDocument();
    });
    await userEvent.click(canvas.getByRole("button", { name: /open options for friday reflection/i }));
    await expect(args.onSelectEntry).not.toHaveBeenCalled();
    const entryDeleteItem = await within(document.body).findByRole("menuitem", {
      name: /^delete$/i,
    });
    await userEvent.click(entryDeleteItem);
    await expect(args.onDeleteEntry).toHaveBeenCalledWith(entries[0]);
    await userEvent.click(canvas.getByRole("button", { name: /^add journal$/i }));
    await userEvent.click(await within(document.body).findByRole("menuitem", { name: /^new file$/i }));
    await expect(args.onNewNote).toHaveBeenCalledWith("folder-journal");
    await userEvent.click(canvas.getByRole("button", { name: /^add journal$/i }));
    await userEvent.click(await within(document.body).findByRole("menuitem", { name: /^new folder$/i }));
    await userEvent.type(canvas.getByRole("textbox", { name: /^folder name$/i }), "Archive");
    await userEvent.tab();
    await expect(args.onCreateFolder).toHaveBeenCalledWith({
      name: "Archive",
      parentFolderId: "folder-journal",
    });
  },
};

export const Empty = {
  args: {
    entries: [],
    folders,
    selectedEntryId: null,
    onSelectEntry: () => {},
    onDeleteEntry: () => {},
    onRenameEntry: () => {},
    onNewNote: () => {},
    onCreateFolder: fn(),
    onDeleteFolder: () => {},
    onRenameFolder: () => {},
    onMobileClose: () => {},
  },
  play: async ({ args, canvas }) => {
    await expect(canvas.getByRole("button", { name: /^journal$/i })).toBeInTheDocument();
    await expect(canvas.queryByText(/no entries yet/i)).not.toBeInTheDocument();
    await expect(canvas.queryByText(/start with one honest page/i)).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: /^new folder$/i }));
    await expect(canvas.getByRole("textbox", { name: /^folder name$/i })).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    await expect(args.onCreateFolder).not.toHaveBeenCalled();
    await userEvent.click(canvas.getByRole("button", { name: /^new folder$/i }));
    await userEvent.type(canvas.getByRole("textbox", { name: /^folder name$/i }), "Root ideas");
    await userEvent.tab();
    await expect(args.onCreateFolder).toHaveBeenCalledWith({
      name: "Root ideas",
      parentFolderId: null,
    });
  },
};

export const CreatingNote = {
  args: {
    entries,
    folders,
    selectedEntryId: "entry-note-1",
    creatingNote: true,
    onSelectEntry: () => {},
    onDeleteEntry: () => {},
    onRenameEntry: () => {},
    onNewNote: () => {},
    onCreateFolder: () => {},
    onDeleteFolder: () => {},
    onRenameFolder: () => {},
    onMobileClose: () => {},
  },
};
