"use client";

import { SidebarMenuSubButton, SidebarMenuSubItem } from "@/components/ui/sidebar";
import { getEntryLabel } from "@/lib/journal";
import { cn } from "@/lib/utils";
import { SidebarEntryMenu } from "./sidebar-entry-menu";
import { SidebarRenameControl } from "./sidebar-rename-control";
import { sidebarEntryRowClass } from "./sidebar-styles";

export function SidebarEntryRow({
  entry,
  selected = false,
  selectedForBulk = false,
  onSelectEntry,
  onDeleteEntry,
  onRenameEntry,
  onToggleEntrySelection,
  onStartRename,
  onCancelRename,
  onMobileClose,
  deletingEntryId = null,
  bulkDeletingEntries = false,
  renaming = false,
  renamingEntryId = null,
}) {
  const entryLabel = getEntryLabel(entry);
  const isBusy = Boolean(deletingEntryId || renamingEntryId || bulkDeletingEntries);

  return (
    <SidebarMenuSubItem className="group/sidebar-entry">
      {renaming ? (
        <SidebarRenameControl
          initialName={entryLabel}
          nested
          selected={selected}
          saving={renamingEntryId === entry.id}
          onRename={(name) => onRenameEntry?.(entry, name)}
          onCancel={onCancelRename}
        />
      ) : (
        <>
          <SidebarMenuSubButton
            render={<button type="button" />}
            isActive={selected}
            onClick={() => {
              onSelectEntry?.(entry);
              onMobileClose?.();
            }}
            className={cn(
              sidebarEntryRowClass,
              "pl-7 pr-8",
              selected
                ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-[inset_2px_0_0_var(--sidebar-primary),0_0_0_1px_var(--sidebar-border)]"
                : "text-sidebar-foreground/72 hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground hover:shadow-[inset_2px_0_0_color-mix(in_srgb,var(--sidebar-primary)_55%,transparent)]",
            )}
          >
            <span className="min-w-0 flex-1 truncate">{entryLabel}</span>
          </SidebarMenuSubButton>
          <input
            type="checkbox"
            checked={selectedForBulk}
            disabled={isBusy}
            aria-label={`Select ${entryLabel}`}
            onChange={() => onToggleEntrySelection?.(entry)}
            onClick={(event) => event.stopPropagation()}
            className="absolute left-1.5 top-1/2 size-3.5 -translate-y-1/2 rounded border-sidebar-border bg-sidebar accent-sidebar-primary"
          />
          <SidebarEntryMenu
            entry={entry}
            onDeleteEntry={onDeleteEntry}
            onStartRename={onStartRename}
            disabled={isBusy}
            className="absolute right-0 top-1/2 -translate-y-1/2"
          />
        </>
      )}
    </SidebarMenuSubItem>
  );
}
