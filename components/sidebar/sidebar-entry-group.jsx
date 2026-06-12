"use client";

import { ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { SidebarEntryRow } from "./sidebar-entry-row";
import { sidebarEntryRowClass } from "./sidebar-styles";

export function SidebarEntryGroup({
  group,
  selectedEntryId,
  onSelectEntry,
  onDeleteEntry,
  onNewNote,
  onMobileClose,
  creatingNote = false,
  deletingEntryId = null,
}) {
  return (
    <Collapsible defaultOpen render={<SidebarMenuItem />}>
      <div className="flex items-center gap-1">
        <CollapsibleTrigger
          render={
            <SidebarMenuButton
              type="button"
              className={cn(
                sidebarEntryRowClass,
                "group w-0 flex-1 text-sidebar-foreground/76 hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground",
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
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          disabled={creatingNote}
          aria-label={`Add ${group.label}`}
          onClick={(event) => {
            event.stopPropagation();
            onNewNote?.(group.id);
            onMobileClose?.();
          }}
          className="interactive-element rounded-md text-sidebar-foreground/58 hover:bg-sidebar-accent hover:text-sidebar-primary disabled:cursor-wait"
        >
          <Plus aria-hidden="true" />
        </Button>
      </div>

      <CollapsibleContent className="h-[var(--collapsible-panel-height)] overflow-hidden transition-[height] duration-150 ease-out data-ending-style:h-0 data-starting-style:h-0">
        <SidebarMenuSub className="ml-4 mr-0 gap-1 border-sidebar-border/55 py-1 pl-2 pr-0">
          {group.entries.map((entry) => (
            <SidebarEntryRow
              key={entry.id}
              entry={entry}
              selected={selectedEntryId === entry.id}
              onSelectEntry={onSelectEntry}
              onDeleteEntry={onDeleteEntry}
              onMobileClose={onMobileClose}
              deletingEntryId={deletingEntryId}
            />
          ))}
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  );
}
