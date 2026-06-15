"use client";

import { useCallback, useMemo, useState } from "react";
import { findDefaultJournalFolder } from "@/lib/folder-defaults";
import {
  createEntry,
  createFolder,
  deleteEntry,
  deleteFolder,
  fetchEntries,
  fetchFolders,
  findTodayJournalEntry,
  getLocalDayKey,
  getNextUntitledEntryTitle,
  updateEntry,
  updateFolder,
} from "@/lib/journal";
import {
  createJournalDraft,
  getEditorKey,
  getEditorState,
  getFocusTarget,
  removeById,
  replaceById,
  upsertById,
} from "./journal-state-helpers";
import { AUTOSAVE_DELAY_MS, useJournalAutosave } from "./use-journal-autosave";

export function useJournalWorkspace({
  initialEntries = [],
  initialFolders = [],
  initialError = null,
  initialDraftOccurredAt = null,
}) {
  const initialTodayEntry = findTodayJournalEntry(initialEntries);
  const initialJournalFolder = findDefaultJournalFolder(initialFolders);

  const [entries, setEntries] = useState(initialEntries);
  const [folders, setFolders] = useState(initialFolders);
  const [draft, setDraft] = useState(() =>
    createJournalDraft(initialJournalFolder, initialDraftOccurredAt ?? new Date().toISOString()),
  );
  const [selectedEntryId, setSelectedEntryId] = useState(initialTodayEntry?.id ?? null);
  const [saveStatus, setSaveStatus] = useState("idle");
  const [saveActivityId, setSaveActivityId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(initialError);
  const [creatingNote, setCreatingNote] = useState(false);
  const [creatingFolderParentId, setCreatingFolderParentId] = useState(undefined);
  const [deletingEntryId, setDeletingEntryId] = useState(null);
  const [deletingFolderId, setDeletingFolderId] = useState(null);
  const [renamingEntryId, setRenamingEntryId] = useState(null);
  const [renamingFolderId, setRenamingFolderId] = useState(null);
  const [editorFocusRequest, setEditorFocusRequest] = useState(null);

  const selectedEntry = useMemo(
    () => entries.find((entry) => entry.id === selectedEntryId) ?? null,
    [entries, selectedEntryId],
  );
  const journalFolder = useMemo(() => findDefaultJournalFolder(folders), [folders]);
  const isDraft = !selectedEntryId;
  const editorState = getEditorState({ selectedEntry, draft });

  const {
    deletedEntryIdsRef,
    flushPendingSave,
    pendingSaveRef,
    runSave,
    runSaveRef,
    saveTimerRef,
    updateEditor,
  } = useJournalAutosave({
    draft,
    journalFolder,
    selectedEntry,
    selectedEntryId,
    setDraft,
    setEntries,
    setSaveActivityId,
    setSaveStatus,
    setSelectedEntryId,
  });

  const loadEntries = useCallback(async () => {
    setLoading(true);
    setLoadError(null);

    try {
      const [nextEntries, nextFolders] = await Promise.all([fetchEntries(), fetchFolders()]);
      const todayEntry = findTodayJournalEntry(nextEntries);

      setEntries(nextEntries);
      setFolders(nextFolders);
      setSelectedEntryId(todayEntry?.id ?? null);
      setDraft(createJournalDraft(findDefaultJournalFolder(nextFolders)));
      setEditorFocusRequest(null);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Failed to load entries");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSelectEntry = useCallback(
    async (entry) => {
      await flushPendingSave();
      setSelectedEntryId(entry.id);
      setDraft(createJournalDraft(journalFolder));
      setSaveStatus("idle");
      setEditorFocusRequest({ entryId: entry.id, target: "entry-end" });
    },
    [flushPendingSave, journalFolder],
  );

  const handleNewNote = useCallback(async (folderId = null) => {
    if (creatingNote) {
      return;
    }

    setCreatingNote(true);
    await flushPendingSave();
    setSaveStatus("saving");

    try {
      const occurredAt = new Date().toISOString();
      const isJournalFolder = folderId === journalFolder?.id;
      const entry = await createEntry({
        title: getNextUntitledEntryTitle(entries),
        body: "",
        entry_type: "document",
        folder_id: folderId,
        journal_date: isJournalFolder ? getLocalDayKey(new Date(occurredAt)) : null,
        occurred_at: occurredAt,
      });

      setEntries((current) => upsertById(current, entry));
      setSelectedEntryId(entry.id);
      setDraft(createJournalDraft(journalFolder));
      setEditorFocusRequest({ entryId: entry.id, target: "entry-end" });
      setSaveStatus("saved");
    } catch {
      setSaveStatus("error");
    } finally {
      setCreatingNote(false);
    }
  }, [creatingNote, entries, flushPendingSave, journalFolder]);

  const handleCreateFolder = useCallback(async ({ name, parentFolderId = null }) => {
    if (creatingFolderParentId !== undefined) {
      throw new Error("Folder creation is already running");
    }

    setCreatingFolderParentId(parentFolderId);
    await flushPendingSave();
    setSaveStatus("saving");

    try {
      const folder = await createFolder({
        name,
        parent_folder_id: parentFolderId,
      });

      setFolders((current) => [...removeById(current, folder.id), folder]);
      setSaveStatus("saved");
      return folder;
    } catch (error) {
      setSaveStatus("error");
      throw error;
    } finally {
      setCreatingFolderParentId(undefined);
    }
  }, [creatingFolderParentId, flushPendingSave]);

  const renameItem = useCallback(async ({
    item,
    name,
    busyId,
    setBusyId,
    save,
    setItems,
    payloadKey,
  }) => {
    if (busyId) {
      throw new Error("Rename is already running");
    }

    setBusyId(item.id);
    await flushPendingSave();
    setSaveStatus("saving");

    try {
      const updatedItem = await save(item.id, { [payloadKey]: name });

      setItems((current) => replaceById(current, updatedItem));
      setSaveStatus("saved");
      return updatedItem;
    } catch (error) {
      setSaveStatus("error");
      throw error;
    } finally {
      setBusyId(null);
    }
  }, [flushPendingSave]);

  const handleRenameEntry = useCallback((entry, name) => renameItem({
    item: entry,
    name,
    busyId: renamingEntryId,
    setBusyId: setRenamingEntryId,
    save: updateEntry,
    setItems: setEntries,
    payloadKey: "title",
  }), [renameItem, renamingEntryId]);

  const handleRenameFolder = useCallback((folder, name) => renameItem({
    item: folder,
    name,
    busyId: renamingFolderId,
    setBusyId: setRenamingFolderId,
    save: updateFolder,
    setItems: setFolders,
    payloadKey: "name",
  }), [renameItem, renamingFolderId]);

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
          const nextEntries = removeById(entries, entryId);
          const nextSelectedEntry = findTodayJournalEntry(nextEntries) ?? nextEntries[0] ?? null;
          setEntries(nextEntries);
          setSelectedEntryId(nextSelectedEntry?.id ?? null);
          setDraft(createJournalDraft(journalFolder));
          setEditorFocusRequest(
            nextSelectedEntry ? { entryId: nextSelectedEntry.id, target: "entry-end" } : null,
          );
          setSaveStatus("idle");
        } else {
          setEntries((current) => removeById(current, entryId));
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
    [deletingEntryId, entries, flushPendingSave, journalFolder, selectedEntryId],
  );

  const handleDeleteFolder = useCallback(async (folder) => {
    if (deletingFolderId) {
      return;
    }

    setDeletingFolderId(folder.id);
    await flushPendingSave();
    setSaveStatus("saving");

    try {
      await deleteFolder(folder.id);
      setFolders((current) => removeById(current, folder.id));
      setSaveStatus("saved");
    } catch {
      setSaveStatus("error");
    } finally {
      setDeletingFolderId(null);
    }
  }, [deletingFolderId, flushPendingSave]);

  return {
    editorKey: getEditorKey({ selectedEntryId, draft }),
    editorProps: {
      title: editorState.title,
      body: editorState.body,
      occurredAt: editorState.occurredAt,
      updatedAt: editorState.updatedAt,
      isDraft,
      focusTarget: getFocusTarget({ editorFocusRequest, selectedEntryId, isDraft }),
      onTitleChange: (title) => updateEditor({ title }),
      onBodyChange: (body) => updateEditor({ body }),
    },
    loadEntries,
    loadError,
    loading,
    showEmptyState:
      !loading && !loadError && entries.length === 0 && isDraft && draft.body.trim().length === 0,
    sidebarProps: {
      entries,
      folders,
      selectedEntryId,
      onSelectEntry: handleSelectEntry,
      onDeleteEntry: handleDeleteEntry,
      onRenameEntry: handleRenameEntry,
      onNewNote: handleNewNote,
      onCreateFolder: handleCreateFolder,
      onDeleteFolder: handleDeleteFolder,
      onRenameFolder: handleRenameFolder,
      creatingNote,
      creatingFolderParentId,
      deletingEntryId,
      deletingFolderId,
      renamingEntryId,
      renamingFolderId,
    },
    topAppBarProps: {
      saveStatus,
      saveActivityId,
      onRetrySave: runSave,
    },
  };
}
