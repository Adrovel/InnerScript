"use client";

import { useCallback, useEffect, useRef } from "react";
import { buildAutosavePayload, resolveSavedEntryState } from "@/lib/autosave";
import { createEntry, updateEntry } from "@/lib/journal";
import {
  createJournalDraft,
  sortEntriesByDate,
  upsertById,
} from "./journal-state-helpers";

export const AUTOSAVE_DELAY_MS = 800;

async function persistEntry({
  title,
  body,
  entryType,
  folderId,
  journalDate,
  occurredAt,
  entryId,
}) {
  const payload = buildAutosavePayload({
    title,
    body,
    entryType,
    folderId,
    journalDate,
    occurredAt,
    entryId,
  });

  if (!payload) {
    return null;
  }

  return entryId ? updateEntry(entryId, payload) : createEntry(payload);
}

export function useJournalAutosave({
  draft,
  journalFolder,
  selectedEntry,
  selectedEntryId,
  setDraft,
  setEntries,
  setSaveActivityId,
  setSaveStatus,
  setSelectedEntryId,
}) {
  const saveTimerRef = useRef(null);
  const pendingSaveRef = useRef(null);
  const activeSaveRef = useRef(false);
  const deletedEntryIdsRef = useRef(new Set());
  const runSaveRef = useRef(null);

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

      setEntries((current) => sortEntriesByDate(upsertById(current, entryForList)));
      setSelectedEntryId(savedEntry.id);
      setDraft(createJournalDraft(journalFolder));
      setSaveStatus(hasNewerPending ? "saving" : "saved");

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
  }, [journalFolder, setDraft, setEntries, setSaveStatus, setSelectedEntryId]);

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
        folderId: nextState.folderId,
        journalDate: nextState.journalDate,
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
    [runSave, setSaveActivityId, setSaveStatus],
  );

  const updateEditor = useCallback(
    (updates) => {
      const currentTitle = selectedEntry ? (selectedEntry.title ?? "") : draft.title;
      const currentBody = selectedEntry ? selectedEntry.body : draft.body;
      const currentEntryType = selectedEntry ? selectedEntry.entry_type : draft.entry_type;
      const currentFolderId = selectedEntry ? selectedEntry.folder_id : draft.folder_id;
      const currentJournalDate = selectedEntry ? selectedEntry.journal_date : draft.journal_date;
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
        folderId: currentFolderId,
        journalDate: currentJournalDate,
        occurredAt: currentOccurredAt,
        entryId: selectedEntryId,
      });
    },
    [draft, queueSave, selectedEntry, selectedEntryId, setDraft, setEntries],
  );

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

  return {
    deletedEntryIdsRef,
    flushPendingSave,
    pendingSaveRef,
    runSave,
    runSaveRef,
    saveTimerRef,
    updateEditor,
  };
}
