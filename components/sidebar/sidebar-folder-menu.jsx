"use client";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function SidebarFolderMenu({
  folder,
  folderLabel,
  disabled = false,
  onStartRename,
  onDeleteFolder,
  className,
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            disabled={disabled}
            aria-label={`Open options for ${folderLabel}`}
            className={cn(
              "interactive-element rounded-md text-sidebar-foreground/58 hover:bg-sidebar-accent hover:text-sidebar-primary data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-primary",
              className,
            )}
          />
        }
      >
        <MoreHorizontal aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="start" sideOffset={6} className="w-auto min-w-40">
        <DropdownMenuGroup>
          <DropdownMenuItem
            disabled={disabled}
            onClick={(event) => {
              event.stopPropagation();
              onStartRename?.(folder);
            }}
          >
            <Pencil aria-hidden="true" />
            Rename Folder
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            disabled={disabled}
            onClick={(event) => {
              event.stopPropagation();
              onDeleteFolder?.(folder);
            }}
          >
            <Trash2 aria-hidden="true" />
            Delete Folder
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
