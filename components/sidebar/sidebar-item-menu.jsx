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

export function SidebarItemMenu({
  item,
  itemLabel,
  disabled = false,
  className,
  onRename,
  onDelete,
}) {
  const handleRename = (event) => {
    event.stopPropagation();
    onRename?.(item);
  };

  const handleDelete = (event) => {
    event.stopPropagation();
    onDelete?.(item);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            disabled={disabled}
            aria-label={`Open options for ${itemLabel}`}
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
          <DropdownMenuItem disabled={disabled} onClick={handleRename}>
            <Pencil aria-hidden="true" />
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" disabled={disabled} onClick={handleDelete}>
            <Trash2 aria-hidden="true" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
