"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { getEntryLabel } from "@/lib/journal";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  PanelLeft,
  PanelLeftClose,
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
  "interactive-element flex h-9 w-full items-center gap-2.5 rounded-lg px-3 text-left text-sm font-medium shadow-transparent";

function SidebarNavRow({
  Icon,
  children,
  active = false,
  iconVariant = "default",
  trailing = null,
  className,
  iconClassName,
  ...props
}) {
  return (
    <button
      type="button"
      className={cn(
        sidebarRowBaseClass,
        active
          ? "bg-surface-container-high text-on-surface shadow-[0_0_0_1px_color-mix(in_srgb,var(--outline-variant)_28%,transparent)]"
          : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface",
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "flex size-5 shrink-0 items-center justify-center",
          iconVariant === "primary"
            ? "rounded-full bg-primary-container text-on-primary-container"
            : null,
        )}
      >
        <Icon
          className={cn(
            iconVariant === "primary" ? "size-3.5" : "size-4",
            active && iconVariant !== "primary" ? "text-primary" : null,
            !active && iconVariant !== "primary" ? "text-on-surface-variant/70" : null,
            iconClassName,
          )}
          aria-hidden="true"
        />
      </span>
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {trailing ? (
        <span className="flex size-4 shrink-0 items-center justify-center text-on-surface-variant/65">
          {trailing}
        </span>
      ) : null}
    </button>
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
  onNewNote,
  collapsed = false,
  onToggleCollapse,
  mobileOpen = false,
  onMobileClose,
  creatingNote = false,
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openGroups, setOpenGroups] = useState({
    journal: true,
    note: true,
  });
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

  const toggleGroup = (groupId) => {
    setOpenGroups((current) => ({
      ...current,
      [groupId]: !current[groupId],
    }));
  };

  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onMobileClose}
        />
      ) : null}

      {collapsed ? (
        <button
          type="button"
          aria-label="Expand sidebar"
          onClick={onToggleCollapse}
          className="interactive-element fixed left-4 top-4 z-50 hidden rounded-full border border-surface-variant/20 bg-surface-container-low p-2 text-on-surface-variant shadow-sm hover:bg-surface-container-high hover:text-primary md:inline-flex"
        >
          <PanelLeft className="size-5" aria-hidden="true" />
        </button>
      ) : null}

      <nav
        aria-label="InnerScript navigation"
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full w-sidebar-width flex-col border-r border-surface-variant/20 bg-surface-container-low py-md transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          collapsed ? "md:-translate-x-full" : "md:translate-x-0",
        )}
      >
        <h2 className="sr-only">InnerScript navigation</h2>

        <div className="mb-md px-sm">
          <div className="mb-sm flex items-center gap-sm px-1">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface-container-high">
              <User className="size-5 text-on-surface-variant" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-semibold text-on-surface">InnerScript</h3>
              <p className="truncate text-xs text-on-surface-variant/65">Journal</p>
            </div>
            <button
              type="button"
              aria-label="Collapse sidebar"
              onClick={onToggleCollapse}
              className="interactive-element hidden size-9 shrink-0 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-high hover:text-primary hover:shadow-[0_0_0_1px_color-mix(in_srgb,var(--outline-variant)_45%,transparent)] md:inline-flex"
            >
              <PanelLeftClose className="size-5" aria-hidden="true" />
            </button>
          </div>

          <div className="mb-xs">
            <SidebarNavRow
              Icon={Plus}
              iconVariant="primary"
              disabled={creatingNote}
              aria-busy={creatingNote}
              onClick={() => {
                onNewNote();
                onMobileClose?.();
              }}
              className="border border-outline-variant/20 bg-surface-container text-on-surface shadow-sm hover:border-primary/35 hover:bg-surface-container-high hover:text-primary disabled:cursor-wait disabled:opacity-70 disabled:active:scale-100"
            >
              {creatingNote ? "Creating..." : "New Note"}
            </SidebarNavRow>
          </div>

          <SidebarNavRow
            Icon={Search}
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((current) => !current)}
            active={searchOpen}
          >
            Search
          </SidebarNavRow>

          {searchOpen ? (
            <div className="px-1 pt-xs">
              <input
                ref={searchInputRef}
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search entries"
                className="h-9 w-full rounded-lg border border-outline-variant/25 bg-surface-container-lowest px-3 text-sm text-on-surface placeholder:text-on-surface-variant/45 focus:border-primary/45 focus:outline-none"
              />
            </div>
          ) : null}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-sm">
          <div className="border-t border-outline-variant/10 pt-sm">
            {!hasEntries ? (
              <p className="px-2 py-sm text-[13px] leading-5 text-on-surface-variant/65">
                No entries yet. Start with one honest page.
              </p>
            ) : null}

            {hasEntries && hasSearchQuery && !hasVisibleEntries ? (
              <p className="px-2 py-sm text-[13px] leading-5 text-on-surface-variant/65">
                No matching entries.
              </p>
            ) : null}

            <ul className="space-y-1">
              {entryGroups.map((group) => (
                <li key={group.id}>
                  <SidebarNavRow
                    Icon={group.Icon}
                    aria-expanded={openGroups[group.id]}
                    onClick={() => toggleGroup(group.id)}
                    active={group.entries.some((entry) => entry.id === selectedEntryId)}
                    trailing={
                      openGroups[group.id] ? (
                        <ChevronDown className="size-4" aria-hidden="true" />
                      ) : (
                        <ChevronRight className="size-4" aria-hidden="true" />
                      )
                    }
                  >
                    {group.label}
                  </SidebarNavRow>

                  {openGroups[group.id] ? (
                    <ul className="mt-0.5 space-y-0.5 pl-8">
                      {group.entries.map((entry) => (
                        <li key={entry.id}>
                          <button
                            type="button"
                            onClick={() => {
                              onSelectEntry(entry);
                              onMobileClose?.();
                            }}
                            className={cn(
                              "interactive-element flex h-7 w-full items-center rounded-md px-2 text-left text-[13px] shadow-transparent",
                              selectedEntryId === entry.id
                                ? "bg-surface-container-high text-on-surface shadow-[inset_2px_0_0_var(--primary),0_0_0_1px_color-mix(in_srgb,var(--outline-variant)_28%,transparent)]"
                                : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface hover:shadow-[inset_2px_0_0_color-mix(in_srgb,var(--primary)_65%,transparent)]",
                            )}
                          >
                            <span className="min-w-0 flex-1 truncate">{getEntryLabel(entry)}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
