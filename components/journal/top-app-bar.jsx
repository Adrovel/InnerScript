"use client";

import { SaveStatus } from "@/components/journal/save-status";
import { Menu } from "lucide-react";

export function TopAppBar({
  saveStatus,
  saveActivityId,
  onRetrySave,
  onMenuClick,
}) {
  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center border-b border-surface-variant/20 bg-surface md:border-b-0">
      <div className="flex h-full w-full items-center justify-between px-md md:justify-end md:gap-md md:px-xl">
        <div className="md:hidden">
          <button
            type="button"
            aria-label="Menu"
            onClick={onMenuClick}
            className="interactive-element rounded-full p-2 text-on-surface-variant hover:bg-surface-container-high hover:text-primary"
          >
            <Menu className="size-5" aria-hidden="true" />
          </button>
        </div>

        <SaveStatus
          status={saveStatus}
          activityId={saveActivityId}
          onRetry={onRetrySave}
        />
      </div>
    </header>
  );
}
