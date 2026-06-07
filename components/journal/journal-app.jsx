"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { EntryEditor } from "@/components/journal/entry-editor";
import { EntrySidebar } from "@/components/journal/entry-sidebar";
import { TopAppBar } from "@/components/journal/top-app-bar";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { getAutosaveTitle, resolveSavedEntryState } from "@/lib/autosave";
import {
  createEntry,
  deleteEntry,
  fetchEntries,
  findTodayJournalEntry,
  getNextUntitledNoteTitle,
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
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <SidebarProvider
      open={sidebarOpen}
      onOpenChange={setSidebarOpen}
      style={{ "--sidebar-width": "var(--spacing-sidebar-width, 280px)" }}
      className="h-svh min-h-0 overflow-hidden bg-background text-on-background"
    >
      <JournalWorkspace initialEntries={initialEntries} initialError={initialError} />
    </SidebarProvider>
  );
}

function JournalWorkspace({ initialEntries = [], initialError = null }) {
  const { setOpenMobile } = useSidebar();
  const initialTodayEntry = findTodayJournalEntry(initialEntries);

  const [entries, setEntries] = useState(initialEntries);
  const [draft, setDraft] = useState(() => createDraft());
  const [selectedEntryId, setSelectedEntryId] = useState(initialTodayEntry?.id ?? null);
  const [saveStatus, setSaveStatus] = useState("idle");
  const [saveActivityId, setSaveActivityId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(initialError);
  const [creatingNote, setCreatingNote] = useState(false);
  const [deletingEntryId, setDeletingEntryId] = useState(null);
  const [editorFocusRequest, setEditorFocusRequest] = useState(null);

  const saveTimerRef = useRef(null);
  const pendingSaveRef = useRef(null);
  const activeSaveRef = useRef(false);
  const deletedEntryIdsRef = useRef(new Set());
  const runSaveRef = useRef(null);

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
      setEditorFocusRequest(null);
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
        title: getAutosaveTitle(title),
        body,
        entry_type: entryType,
        occurred_at: occurredAt,
      });
    }

    const payload = {
      title: getAutosaveTitle(title),
    };

    if (trimmedBody.length > 0) {
      payload.body = body;
    }

    return updateEntry(entryId, payload);
  }, []);

  const runSave = useCallback(async () => {
    if (activeSaveRef.current) {
      return false;
    }

    const pending = pendingSaveRef.current;

    if (!pending) {
      return true;
    }

    activeSaveRef.current = true;
    setSaveStatus("saving");

    try {
      const savedEntry = await persistEntry(pending);

      if (!savedEntry) {
        if (pendingSaveRef.current === pending) {
          setSaveStatus("idle");
          pendingSaveRef.current = null;
        }
        return true;
      }

      if (deletedEntryIdsRef.current.has(savedEntry.id)) {
        if (pendingSaveRef.current?.entryId === savedEntry.id) {
          pendingSaveRef.current = null;
        }
        setSaveStatus("idle");
        return true;
      }

      const { entryForList, nextPending, hasNewerPending } = resolveSavedEntryState({
        pending,
        latestPending: pendingSaveRef.current,
        savedEntry,
      });

      pendingSaveRef.current = nextPending;

      setEntries((current) => {
        const withoutSaved = current.filter((entry) => entry.id !== entryForList.id);
        return [entryForList, ...withoutSaved].sort((left, right) => {
          const leftDate = new Date(left.occurred_at ?? left.created_at).getTime();
          const rightDate = new Date(right.occurred_at ?? right.created_at).getTime();
          return rightDate - leftDate;
        });
      });

      setSelectedEntryId(savedEntry.id);
      setDraft(createDraft());

      if (!hasNewerPending) {
        setSaveStatus("saved");
      } else {
        setSaveStatus("saving");
      }

      return true;
    } catch {
      if (pending.entryId && deletedEntryIdsRef.current.has(pending.entryId)) {
        setSaveStatus("idle");
        return true;
      }

      setSaveStatus("error");
      return false;
    } finally {
      activeSaveRef.current = false;

      if (pendingSaveRef.current && pendingSaveRef.current !== pending) {
        if (saveTimerRef.current) {
          clearTimeout(saveTimerRef.current);
        }

        saveTimerRef.current = setTimeout(() => {
          runSaveRef.current?.();
        }, AUTOSAVE_DELAY_MS);
      }
    }
  }, [persistEntry]);

  useEffect(() => {
    runSaveRef.current = runSave;
  }, [runSave]);

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

      setSaveActivityId((current) => current + 1);
      setSaveStatus("dirty");
    },
    [runSave],
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
      setEditorFocusRequest({ entryId: entry.id, target: "entry-end" });
    },
    [flushPendingSave],
  );

  const handleNewNote = useCallback(async () => {
    if (creatingNote) {
      return;
    }

    setCreatingNote(true);
    await flushPendingSave();
    setSaveStatus("saving");

    try {
      const noteTitle = getNextUntitledNoteTitle(entries);
      const note = await createEntry({
        title: noteTitle,
        body: "",
        entry_type: "note",
        occurred_at: new Date().toISOString(),
      });

      setEntries((current) => [note, ...current.filter((entry) => entry.id !== note.id)]);
      setSelectedEntryId(note.id);
      setDraft(createDraft());
      setEditorFocusRequest({ entryId: note.id, target: "entry-end" });
      setSaveStatus("saved");
    } catch {
      setSaveStatus("error");
    } finally {
      setCreatingNote(false);
    }
  }, [creatingNote, entries, flushPendingSave]);

  const handleDeleteEntry = useCallback(
    async (entry) => {
      if (deletingEntryId) {
        return;
      }

      const entryId = entry.id;
      const isDeletingSelectedEntry = selectedEntryId === entryId;
      let cancelledPendingSave = null;

      setDeletingEntryId(entryId);
      deletedEntryIdsRef.current.add(entryId);

      if (pendingSaveRef.current?.entryId === entryId) {
        cancelledPendingSave = pendingSaveRef.current;
        if (saveTimerRef.current) {
          clearTimeout(saveTimerRef.current);
          saveTimerRef.current = null;
        }
        pendingSaveRef.current = null;
      } else {
        await flushPendingSave();
      }

      if (isDeletingSelectedEntry) {
        setSaveStatus("saving");
      }

      try {
        await deleteEntry(entryId);

        if (isDeletingSelectedEntry) {
          const nextEntries = entries.filter((currentEntry) => currentEntry.id !== entryId);
          const nextSelectedEntry = findTodayJournalEntry(nextEntries) ?? nextEntries[0] ?? null;
          setEntries(nextEntries);
          setSelectedEntryId(nextSelectedEntry?.id ?? null);
          setDraft(createDraft());
          setEditorFocusRequest(
            nextSelectedEntry ? { entryId: nextSelectedEntry.id, target: "entry-end" } : null,
          );
          setSaveStatus("idle");
        } else {
          setEntries((current) => current.filter((currentEntry) => currentEntry.id !== entryId));
        }
      } catch {
        deletedEntryIdsRef.current.delete(entryId);
        if (cancelledPendingSave) {
          pendingSaveRef.current = cancelledPendingSave;
          saveTimerRef.current = setTimeout(() => {
            runSaveRef.current?.();
          }, AUTOSAVE_DELAY_MS);
          setSaveActivityId((current) => current + 1);
          setSaveStatus("dirty");
          return;
        }

        setSaveStatus("error");
      } finally {
        setDeletingEntryId(null);
      }
    },
    [deletingEntryId, entries, flushPendingSave, selectedEntryId],
  );

  const showEmptyState =
    !loading && !loadError && entries.length === 0 && isDraft && draft.body.trim().length === 0;

  return (
    <>
      <EntrySidebar
        entries={entries}
        selectedEntryId={selectedEntryId}
        onSelectEntry={handleSelectEntry}
        onDeleteEntry={handleDeleteEntry}
        onNewNote={handleNewNote}
        onMobileClose={() => setOpenMobile(false)}
        creatingNote={creatingNote}
        deletingEntryId={deletingEntryId}
      />

      <SidebarInset className="h-svh min-w-0 overflow-hidden bg-background">
        <TopAppBar
          saveStatus={saveStatus}
          saveActivityId={saveActivityId}
          onRetrySave={runSave}
          onMenuClick={() => setOpenMobile(true)}
        />

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {loading ? (
            <div className="mx-auto flex min-h-0 w-full max-w-[840px] flex-1 flex-col px-6 py-12 md:px-10">
              <div className="mb-10 flex items-center gap-3">
                <Skeleton className="h-8 w-4 rounded-sm bg-surface-container-high/70" />
                <Skeleton className="h-9 w-56 rounded bg-surface-container-high/70" />
              </div>
              <div className="flex flex-col gap-3">
                <Skeleton className="h-5 w-full rounded bg-surface-container-high/55" />
                <Skeleton className="h-5 w-11/12 rounded bg-surface-container-high/50" />
                <Skeleton className="h-5 w-4/5 rounded bg-surface-container-high/45" />
              </div>
              <div className="mt-auto flex justify-between pt-10">
                <Skeleton className="h-4 w-44 rounded bg-surface-container-high/40" />
                <Skeleton className="h-6 w-32 rounded-full bg-surface-container-high/45" />
              </div>
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
                focusTarget={
                  editorFocusRequest?.entryId === selectedEntryId
                    ? editorFocusRequest.target
                    : isDraft
                      ? "body"
                      : null
                }
                onTitleChange={(title) => updateEditor({ title })}
                onBodyChange={(body) => updateEditor({ body })}
              />
            </>
          ) : null}
        </div>
      </SidebarInset>
    </>
  );
}
