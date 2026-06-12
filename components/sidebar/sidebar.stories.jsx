import { expect, fn, userEvent, within } from "storybook/test";
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
    entry_type: "document",
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
    entry_type: "document",
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
    onNewNote: fn(),
    onMobileClose: () => {},
  },
  play: async ({ args, canvas }) => {
    await expect(canvas.getByText("Innerscript")).toBeInTheDocument();
    await expect(canvas.getByText("Username")).toBeInTheDocument();
    await expect(canvas.queryByText("Private journal")).not.toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: /^new note$/i })).toHaveClass(/h-9/);
    await expect(
      canvas.getByRole("searchbox", { name: /^search entries$/i }).closest("[data-sidebar='menu-button']"),
    ).toHaveClass(/h-9/);
    await expect(canvas.getByRole("button", { name: /^journal$/i })).toHaveClass(/h-7/);
    await expect(canvas.getByRole("button", { name: /^add journal$/i })).toBeInTheDocument();
    await expect(canvas.queryByRole("button", { name: /^add note$/i })).not.toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: /^new note$/i })).not.toHaveClass(
      /border-outline-variant/,
    );
    await expect(canvas.getByRole("button", { name: /^new note$/i })).not.toHaveClass(/shadow-sm/);
    await expect(
      canvas.getByRole("button", { name: /^new note$/i }).querySelectorAll("svg"),
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
    await userEvent.click(canvas.getByRole("button", { name: /open options for friday reflection/i }));
    await expect(args.onSelectEntry).not.toHaveBeenCalled();
    await userEvent.click(
      await within(document.body).findByRole("menuitem", { name: /^delete$/i }),
    );
    await expect(args.onDeleteEntry).toHaveBeenCalledWith(entries[0]);
    await userEvent.click(canvas.getByRole("button", { name: /^add journal$/i }));
    await expect(args.onNewNote).toHaveBeenCalledWith("folder-journal");
  },
};

export const Empty = {
  args: {
    entries: [],
    folders,
    selectedEntryId: null,
    onSelectEntry: () => {},
    onDeleteEntry: () => {},
    onNewNote: () => {},
    onMobileClose: () => {},
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: /^journal$/i })).toBeInTheDocument();
    await expect(canvas.queryByText(/no entries yet/i)).not.toBeInTheDocument();
    await expect(canvas.queryByText(/start with one honest page/i)).not.toBeInTheDocument();
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
    onNewNote: () => {},
    onMobileClose: () => {},
  },
};
