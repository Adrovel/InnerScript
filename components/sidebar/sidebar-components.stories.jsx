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

function EntryGroupDemo({ group, selectedEntryId, ...args }) {
  const [folderDraft, setFolderDraft] = useState(null);
  const [renameTarget, setRenameTarget] = useState(null);

  const startFolderDraft = (parentFolderId) => {
    setFolderDraft({
      id: `${parentFolderId}-${Date.now()}`,
      parentFolderId,
    });
  };

  const createFolder = async (payload) => {
    await args.onCreateFolder?.(payload);
    setFolderDraft(null);
  };

  const renameEntry = async (entry, name) => {
    await args.onRenameEntry?.(entry, name);
    setRenameTarget(null);
  };

  const renameFolder = async (folder, name) => {
    await args.onRenameFolder?.(folder, name);
    setRenameTarget(null);
  };

  return (
    <SidebarEntryGroup
      {...args}
      group={group}
      selectedEntryId={selectedEntryId}
      folderDraft={folderDraft}
      renameTarget={renameTarget}
      onStartNewFolder={startFolderDraft}
      onCreateFolder={createFolder}
      onRenameEntry={renameEntry}
      onStartEntryRename={(entry) => setRenameTarget({ type: "entry", id: entry.id })}
      onRenameFolder={renameFolder}
      onStartFolderRename={(folder) => setRenameTarget({ type: "folder", id: folder.id })}
      onCancelRename={() => setRenameTarget(null)}
      onCancelNewFolder={() => setFolderDraft(null)}
    />
  );
}

function EntryRowDemo({ entry, selected, ...args }) {
  const [renameTarget, setRenameTarget] = useState(null);

  const renameEntry = async (nextEntry, name) => {
    await args.onRenameEntry?.(nextEntry, name);
    setRenameTarget(null);
  };

  return (
    <SidebarEntryRow
      {...args}
      entry={entry}
      selected={selected}
      renaming={renameTarget === entry.id}
      onRenameEntry={renameEntry}
      onStartRename={(nextEntry) => setRenameTarget(nextEntry.id)}
      onCancelRename={() => setRenameTarget(null)}
    />
  );
}

export const CollapsedButton = {
  render: () => (
    <SidebarProvider defaultOpen={false} style={{ "--sidebar-width": "280px" }}>
      <header className="flex h-16 items-center border-b border-sidebar-border/70 bg-surface px-4">
        <div className="flex min-w-0 items-center gap-2">
          <CollapsedSidebarButton />
          <span className="truncate text-sm text-on-surface">Journal / Morning notes</span>
        </div>
      </header>
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
    onRenameEntry: fn(),
    onNewNote: fn(),
    onCreateFolder: fn(),
    onDeleteFolder: fn(),
    onRenameFolder: fn(),
    onMobileClose: fn(),
  },
  render: (args) => (
    <SidebarFrame>
      <SidebarContent className="px-2 py-3">
        <SidebarMenu className="gap-1">
          <EntryGroupDemo group={journalGroup} selectedEntryId="entry-journal-1" {...args} />
        </SidebarMenu>
      </SidebarContent>
    </SidebarFrame>
  ),
  play: async ({ args, canvas }) => {
    const folderButton = canvas.getByRole("button", { name: /^journal$/i });
    const addButton = canvas.getByRole("button", { name: /^add journal$/i });
    const optionsButton = canvas.getByRole("button", { name: /^open options for journal$/i });
    const folderRect = folderButton.getBoundingClientRect();
    const addRect = addButton.getBoundingClientRect();
    const optionsRect = optionsButton.getBoundingClientRect();

    await expect(folderButton).toBeInTheDocument();
    expect(addRect.left).toBeGreaterThanOrEqual(folderRect.left);
    expect(addRect.right).toBeLessThanOrEqual(folderRect.right + 1);
    expect(optionsRect.left).toBeGreaterThanOrEqual(folderRect.left);
    expect(optionsRect.right).toBeLessThanOrEqual(folderRect.right + 1);
    await userEvent.click(canvas.getByRole("button", { name: /^add journal$/i }));
    await userEvent.click(await within(document.body).findByRole("menuitem", { name: /^new file$/i }));
    await expect(args.onNewNote).toHaveBeenCalledWith("folder-journal");
    await userEvent.click(canvas.getByRole("button", { name: /^add journal$/i }));
    await userEvent.click(await within(document.body).findByRole("menuitem", { name: /^new folder$/i }));
    await userEvent.type(canvas.getByRole("textbox", { name: /^folder name$/i }), "Dreams");
    await userEvent.tab();
    await expect(args.onCreateFolder).toHaveBeenCalledWith({
      name: "Dreams",
      parentFolderId: "folder-journal",
    });
    await userEvent.click(canvas.getByRole("button", { name: /^open options for journal$/i }));
    await userEvent.click(await within(document.body).findByRole("menuitem", { name: /^rename$/i }));
    await userEvent.clear(canvas.getByRole("textbox", { name: /^rename$/i }));
    await userEvent.type(canvas.getByRole("textbox", { name: /^rename$/i }), "Private");
    await userEvent.tab();
    await expect(args.onRenameFolder).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "folder-journal",
      }),
      "Private",
    );
    await userEvent.click(canvas.getByRole("button", { name: /^friday reflection$/i }));
    await expect(args.onSelectEntry).toHaveBeenCalledWith(entries[0]);
  },
};

export const EmptyGroup = {
  args: {
    onSelectEntry: fn(),
    onDeleteEntry: fn(),
    onRenameEntry: fn(),
    onNewNote: fn(),
    onCreateFolder: fn(),
    onDeleteFolder: fn(),
    onRenameFolder: fn(),
  },
  render: (args) => (
    <SidebarFrame>
      <SidebarContent className="px-2 py-3">
        <SidebarMenu className="gap-1">
          <EntryGroupDemo group={{ ...journalGroup, entries: [] }} selectedEntryId={null} {...args} />
        </SidebarMenu>
      </SidebarContent>
    </SidebarFrame>
  ),
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole("button", { name: /^journal$/i })).toBeInTheDocument();
    expect(canvasElement.querySelector("[data-sidebar='menu-sub']")).not.toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: /^journal$/i }));

    expect(canvasElement.querySelector("[data-sidebar='menu-sub']")).not.toBeInTheDocument();
  },
};

export const EntryRow = {
  args: {
    onSelectEntry: fn(),
    onDeleteEntry: fn(),
    onRenameEntry: fn(),
  },
  render: (args) => (
    <SidebarFrame>
      <SidebarContent className="px-2 py-3">
        <SidebarMenuSub className="ml-4 mr-0 gap-1 border-sidebar-border/55 py-1 pl-2 pr-0">
          <EntryRowDemo entry={entries[2]} selected {...args} />
        </SidebarMenuSub>
      </SidebarContent>
    </SidebarFrame>
  ),
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: /^therapy question$/i }));
    await expect(args.onSelectEntry).toHaveBeenCalledWith(entries[2]);
    await userEvent.click(canvas.getByRole("button", { name: /open options for therapy question/i }));
    await userEvent.click(await within(document.body).findByRole("menuitem", { name: /^rename$/i }));
    await userEvent.clear(canvas.getByRole("textbox", { name: /^rename$/i }));
    await userEvent.type(canvas.getByRole("textbox", { name: /^rename$/i }), "Renamed therapy");
    await userEvent.tab();
    await expect(args.onRenameEntry).toHaveBeenCalledWith(entries[2], "Renamed therapy");
    await userEvent.click(canvas.getByRole("button", { name: /open options for therapy question/i }));
    await userEvent.click(await within(document.body).findByRole("menuitem", { name: /^delete$/i }));
    await expect(args.onDeleteEntry).toHaveBeenCalledWith(entries[2]);
  },
};
