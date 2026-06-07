"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getEntryLabel } from "@/lib/journal";
import { cn } from "@/lib/utils";
import { MoreHorizontal, Trash2 } from "lucide-react";

function getEntryTypeLabel(entry) {
  return entry.entry_type === "journal" ? "journal" : "note";
}

export function EntryOptionsMenu({ entry, onDeleteEntry, disabled = false, className }) {
  const entryLabel = getEntryLabel(entry);
  const entryTypeLabel = getEntryTypeLabel(entry);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            disabled={disabled}
            aria-label={`Open options for ${entryLabel}`}
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
            variant="destructive"
            disabled={disabled}
            onClick={(event) => {
              event.stopPropagation();
              onDeleteEntry?.(entry);
            }}
          >
            <Trash2 aria-hidden="true" />
            Delete {entryTypeLabel}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
