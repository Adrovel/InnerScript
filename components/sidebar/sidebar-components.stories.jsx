import { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";
import { Folder, Plus } from "lucide-react";
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { CollapsedSidebarButton } from "./collapsed-sidebar-button";
import { SidebarActionRow } from "./sidebar-action-row";
import { SidebarBrand } from "./sidebar-brand";
import { SidebarEntryGroup } from "./sidebar-entry-group";
import { SidebarEntryRow } from "./sidebar-entry-row";
import { SidebarMessage } from "./sidebar-message";
import { SidebarProfile } from "./sidebar-profile";
import { SidebarSearch } from "./sidebar-search";

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
    body: "A journal entry about attention and avoidance.",
    entry_type: "document",
    folder_id: "folder-journal",
    journal_date: "2026-06-05",
    source_id: null,
    occurred_at: "2026-06-05T12:00:00.000Z",
    created_at: "2026-06-05T12:00:00.000Z",
    updated_at: "2026-06-05T12:00:00.000Z",
  },
  {
    id: "entry-journal-2",
    title: "Long honest page about repeating loops and unfinished conversations",
    body: "A longer journal entry.",
    entry_type: "document",
    folder_id: "folder-journal",
    journal_date: "2026-06-04",
    source_id: null,
    occurred_at: "2026-06-04T12:00:00.000Z",
    created_at: "2026-06-04T12:00:00.000Z",
    updated_at: "2026-06-04T12:00:00.000Z",
  },
  {
    id: "entry-note-1",
    title: "Therapy question",
    body: "A note.",
    entry_type: "document",
    folder_id: null,
    journal_date: null,
    source_id: null,
    occurred_at: "2026-06-04T18:30:00.000Z",
    created_at: "2026-06-04T18:30:00.000Z",
    updated_at: "2026-06-04T18:30:00.000Z",
  },
];

const journalGroup = {
  id: folders[0].id,
  label: folders[0].name,
  Icon: Folder,
  entries: entries.filter((entry) => entry.folder_id === folders[0].id),
};

const meta = {
  title: "Sidebar/Components",
  tags: ["ai-generated"],
};

export default meta;

function SidebarFrame({ children }) {
  return (
    <SidebarProvider style={{ "--sidebar-width": "280px" }}>
      <div className="w-[280px] overflow-hidden rounded-2xl border border-sidebar-border bg-sidebar text-sidebar-foreground shadow-sm">
        {children}
      </div>
    </SidebarProvider>
  );
}

function SearchMenuItem({ initialQuery = "" }) {
  const [query, setQuery] = useState(initialQuery);

  return (
    <SidebarMenuItem>
      <SidebarSearch query={query} onQueryChange={setQuery} />
    </SidebarMenuItem>
  );
}

function SearchDemo({ initialQuery = "" }) {
  return (
    <SidebarMenu className="gap-1">
      <SearchMenuItem initialQuery={initialQuery} />
    </SidebarMenu>
  );
}

export const CollapsedButton = {
  render: () => (
    <SidebarProvider defaultOpen={false} style={{ "--sidebar-width": "280px" }}>
      <div className="min-h-32 rounded-2xl border border-sidebar-border bg-sidebar/40 p-4 text-sm text-sidebar-foreground/62">
        Sidebar is collapsed. Use the floating button to expand it.
        <CollapsedSidebarButton />
      </div>
    </SidebarProvider>
  ),
};

export const Brand = {
  render: () => (
    <SidebarFrame>
      <SidebarHeader className="gap-4 border-b border-sidebar-border/70 px-3 pb-4 pt-4">
        <SidebarBrand />
      </SidebarHeader>
    </SidebarFrame>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Innerscript")).toBeInTheDocument();
    await expect(canvas.queryByText("Private journal")).not.toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: /^collapse sidebar$/i })).toBeInTheDocument();
  },
};

export const Profile = {
  render: () => (
    <SidebarFrame>
      <SidebarFooter className="border-t border-sidebar-border/70 px-3 py-3">
        <SidebarProfile />
      </SidebarFooter>
    </SidebarFrame>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Username")).toBeInTheDocument();
    await expect(canvas.getByText("U")).toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: /^open profile menu$/i })).toBeInTheDocument();
  },
};

export const ActionRows = {
  args: {
    onNewNote: fn(),
  },
  render: ({ onNewNote }) => (
    <SidebarFrame>
      <SidebarHeader className="px-3 py-4">
        <SidebarMenu className="gap-1">
          <SidebarMenuItem>
            <SidebarActionRow Icon={Plus} onClick={onNewNote}>
              New Note
            </SidebarActionRow>
          </SidebarMenuItem>
          <SearchMenuItem />
        </SidebarMenu>
      </SidebarHeader>
    </SidebarFrame>
  ),
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: /^new note$/i }));
    await userEvent.type(canvas.getByRole("searchbox", { name: /^search entries$/i }), "loop");
    await expect(args.onNewNote).toHaveBeenCalled();
    await expect(canvas.getByRole("searchbox", { name: /^search entries$/i })).toHaveValue("loop");
  },
};

export const SearchBox = {
  render: () => (
    <SidebarFrame>
      <SidebarHeader className="px-3 py-4">
        <SearchDemo initialQuery="reflection" />
      </SidebarHeader>
    </SidebarFrame>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("searchbox")).toHaveValue("reflection");
  },
};

export const NoResultsMessage = {
  render: () => (
    <SidebarFrame>
      <SidebarContent className="px-2 py-3">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMessage type="no-results" />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </SidebarFrame>
  ),
};

export const JournalGroup = {
  args: {
    onSelectEntry: fn(),
    onDeleteEntry: fn(),
    onNewNote: fn(),
    onMobileClose: fn(),
  },
  render: (args) => (
    <SidebarFrame>
      <SidebarContent className="px-2 py-3">
        <SidebarMenu className="gap-1">
          <SidebarEntryGroup group={journalGroup} selectedEntryId="entry-journal-1" {...args} />
        </SidebarMenu>
      </SidebarContent>
    </SidebarFrame>
  ),
  play: async ({ args, canvas }) => {
    await expect(canvas.getByRole("button", { name: /^journal$/i })).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: /^add journal$/i }));
    await expect(args.onNewNote).toHaveBeenCalledWith("folder-journal");
    await userEvent.click(canvas.getByRole("button", { name: /^friday reflection$/i }));
    await expect(args.onSelectEntry).toHaveBeenCalledWith(entries[0]);
  },
};

export const EmptyGroup = {
  args: {
    onSelectEntry: fn(),
    onDeleteEntry: fn(),
    onNewNote: fn(),
  },
  render: (args) => (
    <SidebarFrame>
      <SidebarContent className="px-2 py-3">
        <SidebarMenu className="gap-1">
          <SidebarEntryGroup group={{ ...journalGroup, entries: [] }} selectedEntryId={null} {...args} />
        </SidebarMenu>
      </SidebarContent>
    </SidebarFrame>
  ),
};

export const EntryRow = {
  args: {
    onSelectEntry: fn(),
    onDeleteEntry: fn(),
  },
  render: (args) => (
    <SidebarFrame>
      <SidebarContent className="px-2 py-3">
        <SidebarMenuSub className="ml-4 mr-0 gap-1 border-sidebar-border/55 py-1 pl-2 pr-0">
          <SidebarEntryRow entry={entries[2]} selected {...args} />
        </SidebarMenuSub>
      </SidebarContent>
    </SidebarFrame>
  ),
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: /^therapy question$/i }));
    await expect(args.onSelectEntry).toHaveBeenCalledWith(entries[2]);
    await userEvent.click(canvas.getByRole("button", { name: /open options for therapy question/i }));
    await userEvent.click(await within(document.body).findByRole("menuitem", { name: /^delete$/i }));
    await expect(args.onDeleteEntry).toHaveBeenCalledWith(entries[2]);
  },
};
