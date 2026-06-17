"use client";

import { useState } from "react";
import { EntryEditor } from "@/components/journal/entry-editor";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { TopAppBar } from "@/components/journal/top-app-bar";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { JournalEditorSkeleton } from "@/components/journal/journal-shell-skeleton";
import { useJournalWorkspace } from "./use-journal-workspace";

export function JournalApp({
  initialEntries = [],
  initialFolders = [],
  initialError = null,
  initialDraftOccurredAt = null,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <SidebarProvider
      open={sidebarOpen}
      onOpenChange={setSidebarOpen}
      style={{ "--sidebar-width": "var(--spacing-sidebar-width, 280px)" }}
      className="h-svh min-h-0 overflow-hidden bg-background text-on-background"
    >
      <JournalWorkspace
        initialEntries={initialEntries}
        initialFolders={initialFolders}
        initialError={initialError}
        initialDraftOccurredAt={initialDraftOccurredAt}
      />
    </SidebarProvider>
  );
}

function JournalWorkspace({
  initialEntries = [],
  initialFolders = [],
  initialError = null,
  initialDraftOccurredAt = null,
}) {
  const { setOpenMobile } = useSidebar();
  const {
    editorKey,
    editorProps,
    loadEntries,
    loadError,
    loading,
    showEmptyState,
    sidebarProps,
    topAppBarProps,
  } = useJournalWorkspace({
    initialEntries,
    initialFolders,
    initialError,
    initialDraftOccurredAt,
  });

  return (
    <>
      <AppSidebar
        {...sidebarProps}
        onMobileClose={() => setOpenMobile(false)}
      />

      <SidebarInset className="h-svh min-w-0 overflow-hidden bg-background">
        <TopAppBar
          {...topAppBarProps}
          onMenuClick={() => setOpenMobile(true)}
        />

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {loading ? <JournalEditorSkeleton /> : null}

          {!loading && loadError ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
              <p className="text-sm text-on-surface-variant">{loadError}</p>
              <Button onClick={loadEntries}>Try again</Button>
            </div>
          ) : null}

          {!loading && !loadError ? (
            <>
              {showEmptyState ? (
                <div className="border-b border-surface-variant/20 bg-surface-container-low px-8 py-3 text-sm text-on-surface-variant">
                  No entries yet. Start with today&apos;s journal or create a note from the sidebar.
                </div>
              ) : null}
              <EntryEditor key={editorKey} {...editorProps} />
            </>
          ) : null}
        </div>
      </SidebarInset>
    </>
  );
}
