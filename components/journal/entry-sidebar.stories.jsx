import { expect, fn, userEvent, within } from "storybook/test";
import { SidebarProvider } from "@/components/ui/sidebar";
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
    selectedEntryId: "entry-journal-1",
    onSelectEntry: fn(),
    onDeleteEntry: fn(),
    onNewNote: () => {},
    onToggleCollapse: () => {},
    onMobileClose: () => {},
  },
  play: async ({ args, canvas }) => {
    await expect(canvas.getByText("InnerScript")).toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: /^new note$/i })).toHaveClass(/h-9/);
    await expect(canvas.getByRole("button", { name: /^search$/i })).toHaveClass(/h-9/);
    await expect(canvas.getByRole("button", { name: /^journal$/i })).toHaveClass(/h-7/);
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
    await expect(canvas.getByRole("button", { name: /^note$/i })).toBeInTheDocument();
    await expect(
      canvas.getByRole("button", { name: /^therapy question$/i }).querySelector("svg"),
    ).toBeNull();
    await expect(
      canvas.getByRole("button", { name: /open actions for friday reflection/i }),
    ).toBeInTheDocument();
    await expect(
      canvas.getByRole("button", { name: /open actions for friday reflection/i }),
    ).toHaveClass(/right-0/);
    await userEvent.click(canvas.getByRole("button", { name: /open actions for friday reflection/i }));
    await expect(args.onSelectEntry).not.toHaveBeenCalled();
    await userEvent.click(
      await within(document.body).findByRole("menuitem", { name: /^delete journal$/i }),
    );
    await expect(args.onDeleteEntry).toHaveBeenCalledWith(entries[0]);
  },
};

export const Empty = {
  args: {
    entries: [],
    selectedEntryId: null,
    onSelectEntry: () => {},
    onDeleteEntry: () => {},
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
    onDeleteEntry: () => {},
    onNewNote: () => {},
    onToggleCollapse: () => {},
    onMobileClose: () => {},
  },
};
