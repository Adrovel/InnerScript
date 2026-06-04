"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Cloud, CloudOff, LoaderCircle } from "lucide-react";

const SAVING_VISIBILITY_DELAY_MS = 150;
const SAVED_READ_TIME_MS = 1600;

export function SaveStatus({ status, activityId = 0, lastEditedAt, onRetry }) {
  const [displayStatus, setDisplayStatus] = useState(status);
  const timerRef = useRef(null);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    function clearTimer() {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    }

    if (status === "dirty") {
      timerRef.current = setTimeout(() => {
        setDisplayStatus("dirty");
      }, 0);
      return clearTimer;
    }

    if (status === "saving") {
      timerRef.current = setTimeout(() => {
        setDisplayStatus("saving");
      }, SAVING_VISIBILITY_DELAY_MS);
      return clearTimer;
    }

    if (status === "saved") {
      timerRef.current = setTimeout(() => {
        setDisplayStatus("saved");
        timerRef.current = setTimeout(() => {
          setDisplayStatus("idle");
        }, SAVED_READ_TIME_MS);
      }, 0);
      return clearTimer;
    }

    timerRef.current = setTimeout(() => {
      setDisplayStatus(status);
    }, 0);
    return clearTimer;
  }, [status, activityId]);

  const label =
    displayStatus === "dirty"
      ? "Unsaved changes"
      : displayStatus === "saving"
      ? "Saving…"
      : displayStatus === "error"
        ? "Save failed"
        : "Saved";

  const Icon =
    displayStatus === "saving" ? LoaderCircle : displayStatus === "error" ? CloudOff : Cloud;

  return (
    <div className="flex items-center gap-sm">
      <div
        className={cn(
          "hidden items-center gap-2 rounded-full bg-surface-container-low px-3 py-1.5 text-xs text-on-surface-variant md:flex",
          displayStatus === "error" && "text-error",
        )}
      >
        <Icon
          className={cn("size-3.5 shrink-0", displayStatus === "saving" && "animate-spin")}
          aria-hidden="true"
        />
        <span>{label}</span>
        {lastEditedAt && displayStatus !== "saving" ? (
          <>
            <span className="opacity-30">•</span>
            <span suppressHydrationWarning>Edited {lastEditedAt}</span>
          </>
        ) : null}
      </div>
      {displayStatus === "error" && onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="interactive-element rounded-full px-3 py-1 text-xs text-primary hover:bg-surface-container-high"
        >
          Retry
        </button>
      ) : null}
    </div>
  );
}
