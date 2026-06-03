"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { EntryEditor } from "@/components/journal/entry-editor";
import { EntrySidebar } from "@/components/journal/entry-sidebar";
import { TopAppBar } from "@/components/journal/top-app-bar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  createEntry,
  fetchEntries,
  findTodayJournalEntry,
  formatRelativeEditTime,
  updateEntry,
} from "@/lib/journal";

const AUTOSAVE_DELAY_MS = 800;

function createDraft({ entryType = "journal", occurredAt = new Date().toISOString() } = {}) {
  return {
    id: null,
    title: "",
    body: "",
    entry_type: entryType,
    occurred_at: occurredAt,
  };
}

export function JournalApp({ initialEntries = [], initialError = null }) {
  const initialTodayEntry = findTodayJournalEntry(initialEntries);

  const [entries, setEntries] = useState(initialEntries);
  const [draft, setDraft] = useState(() => createDraft());
  const [selectedEntryId, setSelectedEntryId] = useState(initialTodayEntry?.id ?? null);
  const [saveStatus, setSaveStatus] = useState("idle");
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(initialError);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [lastEditedAt, setLastEditedAt] = useState(null);

  const saveTimerRef = useRef(null);
  const pendingSaveRef = useRef(null);

  const selectedEntry = useMemo(
    () => entries.find((entry) => entry.id === selectedEntryId) ?? null,
    [entries, selectedEntryId],
  );

  const isDraft = !selectedEntryId;

  const editorState = selectedEntry
    ? {
        title: selectedEntry.title ?? "",
        body: selectedEntry.body,
        entryType: selectedEntry.entry_type,
        occurredAt: selectedEntry.occurred_at ?? selectedEntry.created_at,
        updatedAt: selectedEntry.updated_at ?? selectedEntry.created_at,
      }
    : {
        title: draft.title,
        body: draft.body,
        entryType: draft.entry_type,
        occurredAt: draft.occurred_at,
        updatedAt: draft.occurred_at,
      };

  const headerEditedLabel = lastEditedAt ? formatRelativeEditTime(lastEditedAt) : null;

  const loadEntries = useCallback(async () => {
    setLoading(true);
    setLoadError(null);

    try {
      const nextEntries = await fetchEntries();
      setEntries(nextEntries);

      const todayEntry = findTodayJournalEntry(nextEntries);

      if (todayEntry) {
        setSelectedEntryId(todayEntry.id);
        setDraft(createDraft());
      } else {
        setSelectedEntryId(null);
        setDraft(createDraft());
      }
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Failed to load entries");
    } finally {
      setLoading(false);
    }
  }, []);

  const persistEntry = useCallback(async ({ title, body, entryType, occurredAt, entryId }) => {
    const trimmedBody = body.trim();

    if (!entryId) {
      if (trimmedBody.length === 0) {
        return null;
      }

      return createEntry({
        title: title.trim() ? title.trim() : null,
        body,
        entry_type: entryType,
        occurred_at: occurredAt,
      });
    }

    const payload = {
      title: title.trim() ? title.trim() : null,
    };

    if (trimmedBody.length > 0) {
      payload.body = body;
    }

    return updateEntry(entryId, payload);
  }, []);

  const runSave = useCallback(async () => {
    const pending = pendingSaveRef.current;

    if (!pending) {
      return true;
    }

    setSaveStatus("saving");

    try {
      const savedEntry = await persistEntry(pending);

      if (!savedEntry) {
        setSaveStatus("idle");
        pendingSaveRef.current = null;
        return true;
      }

      setEntries((current) => {
        const withoutSaved = current.filter((entry) => entry.id !== savedEntry.id);
        return [savedEntry, ...withoutSaved].sort((left, right) => {
          const leftDate = new Date(left.occurred_at ?? left.created_at).getTime();
          const rightDate = new Date(right.occurred_at ?? right.created_at).getTime();
          return rightDate - leftDate;
        });
      });

      setSelectedEntryId(savedEntry.id);
      setDraft(createDraft());
      setSaveStatus("saved");
      setLastEditedAt(new Date());
      pendingSaveRef.current = null;
      return true;
    } catch {
      setSaveStatus("error");
      return false;
    }
  }, [persistEntry]);

  const flushPendingSave = useCallback(async () => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }

    if (pendingSaveRef.current) {
      await runSave();
    }
  }, [runSave]);

  const queueSave = useCallback(
    (nextState) => {
      pendingSaveRef.current = {
        title: nextState.title,
        body: nextState.body,
        entryType: nextState.entryType,
        occurredAt: nextState.occurredAt,
        entryId: nextState.entryId,
      };

      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }

      saveTimerRef.current = setTimeout(() => {
        runSave();
      }, AUTOSAVE_DELAY_MS);

      setLastEditedAt(new Date());

      if (saveStatus === "saved" || saveStatus === "error") {
        setSaveStatus("idle");
      }
    },
    [runSave, saveStatus],
  );

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

  const updateEditor = useCallback(
    (updates) => {
      const currentTitle = selectedEntry ? (selectedEntry.title ?? "") : draft.title;
      const currentBody = selectedEntry ? selectedEntry.body : draft.body;
      const currentEntryType = selectedEntry ? selectedEntry.entry_type : draft.entry_type;
      const currentOccurredAt = selectedEntry
        ? (selectedEntry.occurred_at ?? selectedEntry.created_at)
        : draft.occurred_at;

      const nextTitle = updates.title ?? currentTitle;
      const nextBody = updates.body ?? currentBody;

      if (selectedEntryId) {
        setEntries((current) =>
          current.map((entry) =>
            entry.id === selectedEntryId
              ? {
                  ...entry,
                  title: nextTitle,
                  body: nextBody,
                }
              : entry,
          ),
        );
      } else {
        setDraft((current) => ({
          ...current,
          title: nextTitle,
          body: nextBody,
        }));
      }

      queueSave({
        title: nextTitle,
        body: nextBody,
        entryType: currentEntryType,
        occurredAt: currentOccurredAt,
        entryId: selectedEntryId,
      });
    },
    [draft, queueSave, selectedEntry, selectedEntryId],
  );

  const handleSelectEntry = useCallback(
    async (entry) => {
      await flushPendingSave();
      setSelectedEntryId(entry.id);
      setDraft(createDraft());
      setSaveStatus("idle");
      setLastEditedAt(entry.updated_at ? new Date(entry.updated_at) : new Date(entry.created_at));
    },
    [flushPendingSave],
  );

  const handleNewNote = useCallback(async () => {
    await flushPendingSave();
    setSelectedEntryId(null);
    setDraft(createDraft({ entryType: "note" }));
    setSaveStatus("idle");
    setLastEditedAt(null);
  }, [flushPendingSave]);

  const showEmptyState =
    !loading && !loadError && entries.length === 0 && isDraft && draft.body.trim().length === 0;

  return (
    <div className="flex h-svh overflow-hidden bg-background text-on-background">
      <EntrySidebar
        entries={entries}
        selectedEntryId={selectedEntryId}
        onSelectEntry={handleSelectEntry}
        onNewNote={handleNewNote}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((current) => !current)}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <div
        className={cn(
          "flex h-full flex-1 flex-col transition-all duration-300",
          sidebarCollapsed ? "md:ml-0" : "md:ml-sidebar-width",
        )}
      >
        <TopAppBar
          saveStatus={saveStatus}
          lastEditedAt={headerEditedLabel}
          onRetrySave={runSave}
          onMenuClick={() => setMobileSidebarOpen(true)}
          onRefresh={loadEntries}
        />

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {loading ? (
            <div className="flex flex-col gap-4 px-12 py-10">
              <Skeleton className="h-8 w-48 bg-surface-container-high" />
              <Skeleton className="h-6 w-full bg-surface-container-high" />
              <Skeleton className="h-6 w-5/6 bg-surface-container-high" />
              <Skeleton className="h-6 w-2/3 bg-surface-container-high" />
            </div>
          ) : null}

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
              <EntryEditor
                key={selectedEntryId ?? `${draft.entry_type}-${draft.occurred_at}`}
                title={editorState.title}
                body={editorState.body}
                occurredAt={editorState.occurredAt}
                updatedAt={editorState.updatedAt}
                isDraft={isDraft}
                autoFocus={isDraft}
                onTitleChange={(title) => updateEditor({ title })}
                onBodyChange={(body) => updateEditor({ body })}
              />
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
