"use client";

import { cn } from "@/lib/utils";
import { getEntryLabel } from "@/lib/journal";
import {
  PanelLeft,
  PanelLeftClose,
  Plus,
  User,
} from "lucide-react";

export function EntrySidebar({
  entries,
  selectedEntryId,
  onSelectEntry,
  onNewNote,
  collapsed = false,
  onToggleCollapse,
  mobileOpen = false,
  onMobileClose,
}) {
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
          "fixed left-0 top-0 z-50 flex h-full w-sidebar-width flex-col border-r border-surface-variant/20 bg-surface-container-low py-lg transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          collapsed ? "md:-translate-x-full" : "md:translate-x-0",
        )}
      >
        <div className="mb-lg px-md">
          <div className="mb-md flex items-center gap-md">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-outline-variant/30 bg-surface-container-high">
              <User className="size-5 text-on-surface-variant" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-sm font-semibold text-on-surface">InnerScript</h2>
              <p className="truncate text-xs text-primary-fixed">Alexandria</p>
            </div>
            <button
              type="button"
              aria-label="Collapse sidebar"
              onClick={onToggleCollapse}
              className="interactive-element hidden shrink-0 rounded-full p-1.5 text-on-surface-variant hover:bg-surface-container-high hover:text-primary md:inline-flex"
            >
              <PanelLeftClose className="size-5" aria-hidden="true" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              onNewNote();
              onMobileClose?.();
            }}
            className="interactive-element flex w-full items-center justify-center gap-2 rounded bg-primary-container px-3 py-1.5 text-sm font-medium text-on-primary shadow-sm hover:opacity-90 active:scale-95"
          >
            <Plus className="size-4 shrink-0" aria-hidden="true" />
            New Note
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-md">
          <div className="ml-md mt-4 border-t border-outline-variant/20 pt-2">
            <ul className="space-y-1">
              {entries.length === 0 ? (
                <li className="px-xs py-1 text-[13px] text-on-surface-variant/70">No entries yet.</li>
              ) : null}
              {entries.map((entry) => (
                <li key={entry.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectEntry(entry);
                      onMobileClose?.();
                    }}
                    className={cn(
                      "interactive-element flex w-full rounded px-xs py-1.5 text-left transition-colors",
                      selectedEntryId === entry.id
                        ? "bg-surface-container-high text-on-surface"
                        : "text-on-surface-variant hover:bg-surface-container-high",
                    )}
                  >
                    <span className="min-w-0 truncate text-[13px]">
                      {getEntryLabel(entry)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
