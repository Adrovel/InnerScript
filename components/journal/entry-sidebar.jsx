"use client";

import { cn } from "@/lib/utils";
import { getEntryLabel } from "@/lib/journal";
import {
  ChevronDown,
  FileText,
  Folder,
  PanelLeft,
  PanelLeftClose,
  Plus,
  User,
} from "lucide-react";

function groupEntries(entries) {
  return [
    {
      id: "journal",
      label: "Journal",
      entries: entries.filter((entry) => entry.entry_type === "journal"),
    },
    {
      id: "notes",
      label: "Notes",
      entries: entries.filter((entry) => entry.entry_type !== "journal"),
    },
  ].filter((group) => group.entries.length > 0);
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
  const entryGroups = groupEntries(entries);

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
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full w-sidebar-width flex-col border-r border-surface-variant/20 bg-surface-container-low py-md transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          collapsed ? "md:-translate-x-full" : "md:translate-x-0",
        )}
      >
        <div className="mb-md px-sm">
          <div className="mb-sm flex items-center gap-sm px-1">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface-container-high">
              <User className="size-5 text-on-surface-variant" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-sm font-semibold text-on-surface">InnerScript</h2>
              <p className="truncate text-xs text-on-surface-variant/65">Journal</p>
            </div>
            <button
              type="button"
              aria-label="Collapse sidebar"
              onClick={onToggleCollapse}
              className="interactive-element hidden shrink-0 rounded-full p-1.5 text-on-surface-variant hover:bg-surface-container-high hover:text-primary hover:shadow-[0_0_0_1px_color-mix(in_srgb,var(--outline-variant)_45%,transparent)] md:inline-flex"
            >
              <PanelLeftClose className="size-5" aria-hidden="true" />
            </button>
          </div>

          <button
            type="button"
            disabled={creatingNote}
            aria-busy={creatingNote}
            onClick={() => {
              onNewNote();
              onMobileClose?.();
            }}
            className="interactive-element flex w-full items-center justify-center gap-2 rounded-md bg-primary-container px-3 py-2 text-sm font-medium text-on-primary shadow-sm hover:shadow-[0_6px_18px_color-mix(in_srgb,var(--primary-container)_28%,transparent)] hover:brightness-110 disabled:cursor-wait disabled:opacity-70 disabled:active:scale-100"
          >
            <Plus className="size-4 shrink-0" aria-hidden="true" />
            {creatingNote ? "Creating..." : "New Note"}
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-sm">
          <div className="border-t border-outline-variant/10 pt-sm">
            {entries.length === 0 ? (
              <p className="px-2 py-sm text-[13px] leading-5 text-on-surface-variant/65">
                No entries yet. Start with one honest page.
              </p>
            ) : null}

            <ul className="space-y-1">
              {entryGroups.map((group) => (
                <li key={group.id}>
                  <div className="flex h-7 items-center gap-1.5 px-1 text-[12px] font-medium text-on-surface-variant/70">
                    <ChevronDown className="size-3.5 shrink-0" aria-hidden="true" />
                    <Folder className="size-3.5 shrink-0" aria-hidden="true" />
                    <span className="truncate">{group.label}</span>
                  </div>
                  <ul className="space-y-0.5 pl-5">
                    {group.entries.map((entry) => (
                      <li key={entry.id}>
                        <button
                          type="button"
                          onClick={() => {
                            onSelectEntry(entry);
                            onMobileClose?.();
                          }}
                          className={cn(
                            "interactive-element group flex h-7 w-full items-center gap-1.5 rounded px-1.5 text-left text-[13px] shadow-transparent",
                            selectedEntryId === entry.id
                              ? "bg-surface-container-high text-on-surface shadow-[inset_2px_0_0_var(--primary),0_0_0_1px_color-mix(in_srgb,var(--outline-variant)_28%,transparent)]"
                              : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface hover:shadow-[inset_2px_0_0_color-mix(in_srgb,var(--primary)_65%,transparent)]",
                          )}
                        >
                          <FileText
                            className={cn(
                              "size-3.5 shrink-0 transition-colors",
                              selectedEntryId === entry.id
                                ? "text-primary"
                                : "text-on-surface-variant/55 group-hover:text-primary/80",
                            )}
                            aria-hidden="true"
                          />
                          <span className="min-w-0 flex-1 truncate">{getEntryLabel(entry)}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
