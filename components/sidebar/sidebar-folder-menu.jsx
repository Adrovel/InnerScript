"use client";

import { SidebarItemMenu } from "./sidebar-item-menu";

export function SidebarFolderMenu({
  folder,
  folderLabel,
  disabled = false,
  onStartRename,
  onDeleteFolder,
  className,
}) {
  return (
    <SidebarItemMenu
      item={folder}
      itemLabel={folderLabel}
      disabled={disabled}
      className={className}
      onRename={onStartRename}
      onDelete={onDeleteFolder}
    />
  );
}
