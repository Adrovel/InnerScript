"use client";

import { ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { SidebarFolderCreateMenu } from "./sidebar-folder-create-menu";
import { SidebarFolderDraftRow } from "./sidebar-folder-draft-row";
import { SidebarFolderMenu } from "./sidebar-folder-menu";
import { SidebarRenameControl } from "./sidebar-rename-control";
import { SidebarEntryRow } from "./sidebar-entry-row";
import { sidebarEntryRowClass } from "./sidebar-styles";

export function SidebarEntryGroup({
  group,
  nested = false,
  folderDraft,
  selectedEntryId,
  onSelectEntry,
  onDeleteEntry,
  onRenameEntry,
  onStartEntryRename,
  onCancelRename,
  onNewNote,
  onStartNewFolder,
  onCreateFolder,
  onDeleteFolder,
  onRenameFolder,
  onStartFolderRename,
  onCancelNewFolder,
  onMobileClose,
  creatingNote = false,
  creatingFolderParentId = null,
  deletingEntryId = null,
  deletingFolderId = null,
  renamingEntryId = null,
  renamingFolderId = null,
  renameTarget = null,
}) {
  const itemRender = nested ? <SidebarMenuSubItem /> : <SidebarMenuItem />;
  const hasFolderDraft = folderDraft?.parentFolderId === group.id;
  const isCreatingFolderHere = creatingFolderParentId === group.id;
  const isRenamingFolder = renameTarget?.type === "folder" && renameTarget.id === group.id;
  const childFolders = group.folders ?? [];

  return (
    <Collapsible defaultOpen render={itemRender}>
      <div className="relative">
        {isRenamingFolder ? (
          <SidebarRenameControl
            initialName={group.label}
            Icon={group.Icon}
            nested={nested}
            saving={renamingFolderId === group.id}
            onRename={(name) => onRenameFolder?.(group, name)}
            onCancel={onCancelRename}
          />
        ) : (
          <>
            <CollapsibleTrigger
              render={
                <SidebarMenuButton
                  type="button"
                  className={cn(
                    sidebarEntryRowClass,
                    "group pr-14 text-sidebar-foreground/76 hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground",
                  )}
                />
              }
            >
              <span className="flex shrink-0 items-center text-sidebar-foreground/60">
                <ChevronRight
                  className="transition-transform duration-150 ease-out group-data-panel-open:rotate-90"
                  aria-hidden="true"
                />
              </span>
              <group.Icon className="text-sidebar-foreground/62" aria-hidden="true" />
              <span className="min-w-0 flex-1 truncate">{group.label}</span>
            </CollapsibleTrigger>
            <div className="absolute right-0 top-1/2 flex -translate-y-1/2 items-center gap-0.5">
              <SidebarFolderCreateMenu
                folderLabel={group.label}
                disabled={creatingNote}
                onNewFile={() => {
                  onNewNote?.(group.id);
                  onMobileClose?.();
                }}
                onNewFolder={() => onStartNewFolder?.(group.id)}
              />
              <SidebarFolderMenu
                folder={group}
                folderLabel={group.label}
                disabled={Boolean(creatingNote || deletingFolderId || renamingFolderId)}
                onStartRename={onStartFolderRename}
                onDeleteFolder={onDeleteFolder}
              />
            </div>
          </>
        )}
      </div>

      <CollapsibleContent className="h-[var(--collapsible-panel-height)] overflow-hidden transition-[height] duration-150 ease-out data-ending-style:h-0 data-starting-style:h-0">
        <SidebarMenuSub className="ml-4 mr-0 gap-1 border-sidebar-border/55 py-1 pl-2 pr-0">
          {hasFolderDraft ? (
            <SidebarFolderDraftRow
              key={folderDraft.id}
              parentFolderId={group.id}
              nested
              onCreateFolder={onCreateFolder}
              onCancel={onCancelNewFolder}
            />
          ) : null}

          {childFolders.map((folder) => (
            <SidebarEntryGroup
              key={folder.id}
              group={folder}
              nested
              folderDraft={folderDraft}
              selectedEntryId={selectedEntryId}
              onSelectEntry={onSelectEntry}
              onDeleteEntry={onDeleteEntry}
              onRenameEntry={onRenameEntry}
              onStartEntryRename={onStartEntryRename}
              onCancelRename={onCancelRename}
              onNewNote={onNewNote}
              onStartNewFolder={onStartNewFolder}
              onCreateFolder={onCreateFolder}
              onDeleteFolder={onDeleteFolder}
              onRenameFolder={onRenameFolder}
              onStartFolderRename={onStartFolderRename}
              onCancelNewFolder={onCancelNewFolder}
              onMobileClose={onMobileClose}
              creatingNote={creatingNote}
              creatingFolderParentId={creatingFolderParentId}
              deletingEntryId={deletingEntryId}
              deletingFolderId={deletingFolderId}
              renamingEntryId={renamingEntryId}
              renamingFolderId={renamingFolderId}
              renameTarget={renameTarget}
            />
          ))}

          {group.entries.map((entry) => (
            <SidebarEntryRow
              key={entry.id}
              entry={entry}
              selected={selectedEntryId === entry.id}
              onSelectEntry={onSelectEntry}
              onDeleteEntry={onDeleteEntry}
              onRenameEntry={onRenameEntry}
              onStartRename={onStartEntryRename}
              onCancelRename={onCancelRename}
              onMobileClose={onMobileClose}
              deletingEntryId={deletingEntryId}
              renaming={renameTarget?.type === "entry" && renameTarget.id === entry.id}
              renamingEntryId={renamingEntryId}
            />
          ))}

          {isCreatingFolderHere && !hasFolderDraft ? (
            <SidebarFolderDraftRow
              parentFolderId={group.id}
              nested
              onCreateFolder={onCreateFolder}
              onCancel={onCancelNewFolder}
            />
          ) : null}
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  );
}
