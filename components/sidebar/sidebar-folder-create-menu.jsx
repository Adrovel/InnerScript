"use client";

import { FileText, FolderPlus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function SidebarFolderCreateMenu({
  folderLabel,
  disabled = false,
  onNewFile,
  onNewFolder,
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
            aria-label={`Add ${folderLabel}`}
            className={cn(
              "interactive-element rounded-md text-sidebar-foreground/58 hover:bg-sidebar-accent hover:text-sidebar-primary disabled:cursor-wait data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-primary",
            )}
          />
        }
      >
        <Plus aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="start" sideOffset={6} className="w-auto min-w-40">
        <DropdownMenuGroup>
          <DropdownMenuItem
            disabled={disabled}
            onClick={(event) => {
              event.stopPropagation();
              onNewFile?.();
            }}
          >
            <FileText aria-hidden="true" />
            New File
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(event) => {
              event.stopPropagation();
              onNewFolder?.();
            }}
          >
            <FolderPlus aria-hidden="true" />
            New Folder
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
