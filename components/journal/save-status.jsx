"use client";

import { cn } from "@/lib/utils";
import { Cloud, CloudOff, LoaderCircle } from "lucide-react";

export function SaveStatus({ status, lastEditedAt, onRetry }) {
  const label =
    status === "saving" ? "Saving…" : status === "error" ? "Save failed" : "Saved";

  const Icon =
    status === "saving" ? LoaderCircle : status === "error" ? CloudOff : Cloud;

  return (
    <div className="flex items-center gap-sm">
      <div
        className={cn(
          "hidden items-center gap-2 rounded-full bg-surface-container-low px-3 py-1.5 text-xs text-on-surface-variant md:flex",
          status === "error" && "text-error",
        )}
      >
        <Icon
          className={cn("size-3.5 shrink-0", status === "saving" && "animate-spin")}
          aria-hidden="true"
        />
        <span>{label}</span>
        {lastEditedAt && status !== "saving" ? (
          <>
            <span className="opacity-30">•</span>
            <span suppressHydrationWarning>Edited {lastEditedAt}</span>
          </>
        ) : null}
      </div>
      {status === "error" && onRetry ? (
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
