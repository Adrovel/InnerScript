"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
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
import { filterSidebarEntries, groupSidebarEntries } from "./sidebar-data";
import { SidebarActionRow } from "./sidebar-action-row";
import { SidebarBrand } from "./sidebar-brand";
import { SidebarEntryGroup } from "./sidebar-entry-group";
import { SidebarMessage } from "./sidebar-message";
import { SidebarProfile } from "./sidebar-profile";
import { SidebarSearch } from "./sidebar-search";

export function AppSidebar({
  entries,
  selectedEntryId,
  onSelectEntry,
  onDeleteEntry,
  onNewNote,
  onMobileClose,
  creatingNote = false,
  deletingEntryId = null,
}) {
  const { setOpenMobile } = useSidebar();
  const [searchQuery, setSearchQuery] = useState("");
  const filteredEntries = useMemo(
    () => filterSidebarEntries(entries, searchQuery),
    [entries, searchQuery],
  );
  const entryGroups = useMemo(() => groupSidebarEntries(filteredEntries), [filteredEntries]);
  const hasSearchQuery = searchQuery.trim().length > 0;
  const hasEntries = entries.length > 0;
  const hasVisibleEntries = filteredEntries.length > 0;

  const closeMobileSidebar = () => {
    setOpenMobile(false);
    onMobileClose?.();
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
              <SidebarSearch query={searchQuery} onQueryChange={setSearchQuery} />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent className="px-2 py-3">
          <SidebarGroup className="p-0">
            <SidebarGroupContent>
              {!hasEntries ? (
                <SidebarMessage type="empty" />
              ) : null}

              {hasEntries && hasSearchQuery && !hasVisibleEntries ? (
                <SidebarMessage type="no-results" />
              ) : null}

              <SidebarMenu className="gap-1">
                {entryGroups.map((group) => (
                  <SidebarEntryGroup
                    key={group.id}
                    group={group}
                    selectedEntryId={selectedEntryId}
                    onSelectEntry={onSelectEntry}
                    onDeleteEntry={onDeleteEntry}
                    onNewNote={onNewNote}
                    onMobileClose={closeMobileSidebar}
                    creatingNote={creatingNote}
                    deletingEntryId={deletingEntryId}
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
