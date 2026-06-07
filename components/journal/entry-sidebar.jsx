"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { EntryActionsMenu } from "@/components/journal/entry-actions-menu";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { getEntryLabel } from "@/lib/journal";
import {
  BookOpen,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Plus,
  Search,
  StickyNote,
  User,
} from "lucide-react";

const GROUP_CONFIG = [
  {
    id: "journal",
    label: "Journal",
    Icon: BookOpen,
    filter: (entry) => entry.entry_type === "journal",
  },
  {
    id: "note",
    label: "Note",
    Icon: StickyNote,
    filter: (entry) => entry.entry_type !== "journal",
  },
];

const sidebarRowBaseClass =
  "interactive-element h-9 rounded-lg px-3 text-sm font-medium shadow-transparent";

const sidebarEntryRowClass =
  "interactive-element h-7 w-full rounded-md px-2 text-left text-[13px] shadow-transparent";

function SidebarNavRow({
  Icon,
  children,
  active = false,
  trailing = null,
  className,
  iconClassName,
  ...props
}) {
  return (
    <SidebarMenuButton
      type="button"
      isActive={active}
      className={cn(
        sidebarRowBaseClass,
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-[0_0_0_1px_var(--sidebar-border)]"
          : "text-sidebar-foreground/76 hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground",
        className,
      )}
      {...props}
    >
      <Icon
        className={cn(active ? "text-sidebar-primary" : "text-sidebar-foreground/62", iconClassName)}
        aria-hidden="true"
      />
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {trailing ? (
        <span className="ml-auto flex shrink-0 items-center text-sidebar-foreground/60">
          {trailing}
        </span>
      ) : null}
    </SidebarMenuButton>
  );
}

function filterEntries(entries, query) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return entries;
  }

  return entries.filter((entry) => {
    const label = getEntryLabel(entry).toLowerCase();
    const body = entry.body?.toLowerCase() ?? "";

    return label.includes(normalizedQuery) || body.includes(normalizedQuery);
  });
}

function groupEntries(entries) {
  return [
    ...GROUP_CONFIG.map((group) => ({
      ...group,
      entries: entries.filter(group.filter),
    })),
  ];
}

export function EntrySidebar({
  entries,
  selectedEntryId,
  onSelectEntry,
  onDeleteEntry,
  onNewNote,
  onMobileClose,
  creatingNote = false,
  deletingEntryId = null,
}) {
  const { setOpen, setOpenMobile, state } = useSidebar();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);
  const filteredEntries = useMemo(() => filterEntries(entries, searchQuery), [entries, searchQuery]);
  const entryGroups = useMemo(() => groupEntries(filteredEntries), [filteredEntries]);
  const hasSearchQuery = searchQuery.trim().length > 0;
  const hasEntries = entries.length > 0;
  const hasVisibleEntries = filteredEntries.length > 0;

  useEffect(() => {
    if (searchOpen) {
      searchInputRef.current?.focus();
    }
  }, [searchOpen]);

  const closeMobileSidebar = () => {
    setOpenMobile(false);
    onMobileClose?.();
  };

  return (
    <>
      {state === "collapsed" ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-lg"
          aria-label="Expand sidebar"
          onClick={() => setOpen(true)}
          className="interactive-element fixed left-4 top-4 z-50 hidden rounded-full border border-sidebar-border bg-sidebar text-sidebar-foreground shadow-sm hover:bg-sidebar-accent hover:text-sidebar-primary md:inline-flex"
        >
          <ChevronsRight aria-hidden="true" />
        </Button>
      ) : null}

      <Sidebar
        role="navigation"
        aria-label="InnerScript navigation"
        collapsible="offcanvas"
        className="border-sidebar-border/70 bg-sidebar"
      >
        <SidebarHeader className="gap-4 border-b border-sidebar-border/70 px-3 pb-4 pt-4">
          <h2 className="sr-only">InnerScript navigation</h2>

          <div className="flex items-center gap-3 rounded-2xl bg-sidebar-accent/45 p-2.5 shadow-[inset_0_0_0_1px_var(--sidebar-border)]">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
              <User aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-semibold text-sidebar-foreground">InnerScript</h3>
              <p className="truncate text-xs text-sidebar-foreground/58">Private journal</p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-lg"
              aria-label="Collapse sidebar"
              onClick={() => setOpen(false)}
              className="interactive-element hidden rounded-full text-sidebar-foreground/72 hover:bg-sidebar hover:text-sidebar-primary hover:shadow-[0_0_0_1px_var(--sidebar-border)] md:inline-flex"
            >
              <ChevronsLeft aria-hidden="true" />
            </Button>
          </div>

          <SidebarMenu className="gap-1">
            <SidebarMenuItem>
              <SidebarNavRow
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
              </SidebarNavRow>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarNavRow
                Icon={Search}
                aria-expanded={searchOpen}
                onClick={() => setSearchOpen((current) => !current)}
                active={searchOpen}
              >
                Search
              </SidebarNavRow>
            </SidebarMenuItem>
          </SidebarMenu>

          {searchOpen ? (
            <SidebarGroup className="p-0">
              <SidebarGroupContent className="relative">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sidebar-foreground/45"
                  aria-hidden="true"
                />
                <SidebarInput
                  ref={searchInputRef}
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search entries"
                  className="h-9 rounded-lg bg-sidebar-accent/35 pl-9 text-sidebar-foreground placeholder:text-sidebar-foreground/45 focus-visible:ring-sidebar-ring/40"
                />
              </SidebarGroupContent>
            </SidebarGroup>
          ) : null}
        </SidebarHeader>

        <SidebarContent className="px-2 py-3">
          <SidebarGroup className="p-0">
            <SidebarGroupContent>
              {!hasEntries ? (
                <p className="px-2 py-sm text-[13px] leading-5 text-sidebar-foreground/62">
                  No entries yet. Start with one honest page.
                </p>
              ) : null}

              {hasEntries && hasSearchQuery && !hasVisibleEntries ? (
                <p className="px-2 py-sm text-[13px] leading-5 text-sidebar-foreground/62">
                  No matching entries.
                </p>
              ) : null}

              <SidebarMenu className="gap-1">
                {entryGroups.map((group) => (
                  <Collapsible key={group.id} defaultOpen render={<SidebarMenuItem />}>
                    <CollapsibleTrigger
                      render={
                        <SidebarMenuButton
                          type="button"
                          className={cn(
                            sidebarEntryRowClass,
                            "group text-sidebar-foreground/76 hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground",
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

                    <CollapsibleContent className="h-[var(--collapsible-panel-height)] overflow-hidden transition-[height] duration-150 ease-out data-ending-style:h-0 data-starting-style:h-0">
                      <SidebarMenuSub className="ml-4 mr-0 gap-1 border-sidebar-border/55 py-1 pl-2 pr-0">
                        {group.entries.map((entry) => (
                          <SidebarMenuSubItem key={entry.id} className="group/sidebar-entry">
                            <SidebarMenuSubButton
                              render={<button type="button" />}
                              isActive={selectedEntryId === entry.id}
                              onClick={() => {
                                onSelectEntry(entry);
                                closeMobileSidebar();
                              }}
                              className={cn(
                                sidebarEntryRowClass,
                                "pr-8",
                                selectedEntryId === entry.id
                                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-[inset_2px_0_0_var(--sidebar-primary),0_0_0_1px_var(--sidebar-border)]"
                                  : "text-sidebar-foreground/72 hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground hover:shadow-[inset_2px_0_0_color-mix(in_srgb,var(--sidebar-primary)_55%,transparent)]",
                              )}
                            >
                              <span className="min-w-0 flex-1 truncate">{getEntryLabel(entry)}</span>
                            </SidebarMenuSubButton>
                            <EntryActionsMenu
                              entry={entry}
                              onDeleteEntry={onDeleteEntry}
                              disabled={Boolean(deletingEntryId)}
                              className="absolute right-0 top-1/2 -translate-y-1/2"
                            />
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    </>
  );
}
