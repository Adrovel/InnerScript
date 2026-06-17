"use client";

import { getEntryLabel } from "@/lib/journal";
import { SidebarItemMenu } from "./sidebar-item-menu";

export function SidebarEntryMenu({
  entry,
  onDeleteEntry,
  onStartRename,
  disabled = false,
  className,
}) {
  const entryLabel = getEntryLabel(entry);

  return (
    <SidebarItemMenu
      item={entry}
      itemLabel={entryLabel}
      disabled={disabled}
      className={className}
      onRename={onStartRename}
      onDelete={onDeleteEntry}
    />
  );
}
