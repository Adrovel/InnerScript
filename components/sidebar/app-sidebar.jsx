"use client";

import { useMemo, useState } from "react";
import { FolderPlus, Plus } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { CollapsedSidebarButton } from "./collapsed-sidebar-button";
import {
  filterSidebarEntries,
  getRootSidebarEntries,
  groupSidebarEntries,
} from "./sidebar-data";
import { SidebarActionRow } from "./sidebar-action-row";
import { SidebarBrand } from "./sidebar-brand";
import { SidebarEntryGroup } from "./sidebar-entry-group";
import { SidebarEntryRow } from "./sidebar-entry-row";
import { SidebarFolderDraftRow } from "./sidebar-folder-draft-row";
import { SidebarMessage } from "./sidebar-message";
import { SidebarProfile } from "./sidebar-profile";
import { SidebarSearch } from "./sidebar-search";

export function AppSidebar({
  entries,
  folders = [],
  selectedEntryId,
  onSelectEntry,
  onDeleteEntry,
  onRenameEntry,
  onNewNote,
  onCreateFolder,
  onDeleteFolder,
  onRenameFolder,
  onMobileClose,
  creatingNote = false,
  creatingFolderParentId,
  deletingEntryId = null,
  deletingFolderId = null,
  renamingEntryId = null,
  renamingFolderId = null,
}) {
  const { setOpenMobile } = useSidebar();
  const [searchQuery, setSearchQuery] = useState("");
  const [folderDraft, setFolderDraft] = useState(null);
  const [renameTarget, setRenameTarget] = useState(null);
  const filteredEntries = useMemo(
    () => filterSidebarEntries(entries, searchQuery),
    [entries, searchQuery],
  );
  const entryGroups = useMemo(
    () => groupSidebarEntries(filteredEntries, folders),
    [filteredEntries, folders],
  );
  const rootEntries = useMemo(() => getRootSidebarEntries(filteredEntries), [filteredEntries]);
  const hasSearchQuery = searchQuery.trim().length > 0;
  const hasEntries = entries.length > 0;
  const hasVisibleEntries = filteredEntries.length > 0;

  const closeMobileSidebar = () => {
    setOpenMobile(false);
    onMobileClose?.();
  };

  const startFolderDraft = (parentFolderId = null) => {
    setFolderDraft({
      id: `${parentFolderId ?? "root"}-${Date.now()}`,
      parentFolderId,
    });
  };

  const cancelFolderDraft = () => {
    setFolderDraft(null);
  };

  const handleCreateFolder = async ({ name, parentFolderId }) => {
    await onCreateFolder?.({ name, parentFolderId });
    setFolderDraft(null);
  };

  const handleRenameEntry = async (entry, name) => {
    await onRenameEntry?.(entry, name);
    setRenameTarget(null);
  };

  const handleRenameFolder = async (folder, name) => {
    await onRenameFolder?.(folder, name);
    setRenameTarget(null);
  };

  return (
    <>
      <CollapsedSidebarButton />

      <Sidebar
        role="navigation"
        aria-label="InnerScript navigation"
        collapsible="offcanvas"
        className="border-sidebar-border/70 bg-sidebar"
      >
        <SidebarHeader className="gap-4 border-b border-sidebar-border/70 px-3 pb-4 pt-4">
          <h2 className="sr-only">InnerScript navigation</h2>

          <SidebarBrand />

          <SidebarMenu className="gap-1">
            <SidebarMenuItem>
              <SidebarActionRow
                Icon={Plus}
                disabled={creatingNote}
                aria-busy={creatingNote}
                onClick={() => {
                  onNewNote();
                  closeMobileSidebar();
                }}
                className="disabled:cursor-wait disabled:opacity-70 disabled:active:scale-100"
              >
                {creatingNote ? "Creating..." : "New Note"}
              </SidebarActionRow>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarActionRow
                Icon={FolderPlus}
                onClick={() => startFolderDraft(null)}
                className="disabled:cursor-wait disabled:opacity-70 disabled:active:scale-100"
              >
                New Folder
              </SidebarActionRow>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarSearch query={searchQuery} onQueryChange={setSearchQuery} />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent className="px-2 py-3">
          <SidebarGroup className="p-0">
            <SidebarGroupContent>
              {hasEntries && hasSearchQuery && !hasVisibleEntries ? (
                <SidebarMessage type="no-results" />
              ) : null}

              <SidebarMenu className="gap-1">
                {folderDraft?.parentFolderId === null ? (
                  <SidebarFolderDraftRow
                    key={folderDraft.id}
                    parentFolderId={null}
                    onCreateFolder={handleCreateFolder}
                    onCancel={cancelFolderDraft}
                  />
                ) : null}

                {entryGroups.map((group) => (
                  <SidebarEntryGroup
                    key={group.id}
                    group={group}
                    folderDraft={folderDraft}
                    selectedEntryId={selectedEntryId}
                    onSelectEntry={onSelectEntry}
                    onDeleteEntry={onDeleteEntry}
                    onRenameEntry={handleRenameEntry}
                    onStartEntryRename={(entry) => setRenameTarget({ type: "entry", id: entry.id })}
                    onCancelRename={() => setRenameTarget(null)}
                    onNewNote={onNewNote}
                    onStartNewFolder={startFolderDraft}
                    onCreateFolder={handleCreateFolder}
                    onDeleteFolder={onDeleteFolder}
                    onRenameFolder={handleRenameFolder}
                    onStartFolderRename={(folder) => setRenameTarget({ type: "folder", id: folder.id })}
                    onCancelNewFolder={cancelFolderDraft}
                    onMobileClose={closeMobileSidebar}
                    creatingNote={creatingNote}
                    creatingFolderParentId={creatingFolderParentId}
                    deletingEntryId={deletingEntryId}
                    deletingFolderId={deletingFolderId}
                    renamingEntryId={renamingEntryId}
                    renamingFolderId={renamingFolderId}
                    renameTarget={renameTarget}
                  />
                ))}

                {rootEntries.map((entry) => (
                  <SidebarEntryRow
                    key={entry.id}
                    entry={entry}
                    selected={selectedEntryId === entry.id}
                    onSelectEntry={onSelectEntry}
                    onDeleteEntry={onDeleteEntry}
                    onRenameEntry={handleRenameEntry}
                    onStartRename={(entry) => setRenameTarget({ type: "entry", id: entry.id })}
                    onCancelRename={() => setRenameTarget(null)}
                    onMobileClose={closeMobileSidebar}
                    deletingEntryId={deletingEntryId}
                    renaming={renameTarget?.type === "entry" && renameTarget.id === entry.id}
                    renamingEntryId={renamingEntryId}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-t border-sidebar-border/70 px-3 py-3">
          <SidebarProfile />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </>
  );
}
