"use client";

import {
  countWords,
  formatEntryCreated,
  formatRelativeEditTime,
} from "@/lib/journal";

export function EntryEditor({
  title,
  body,
  occurredAt,
  updatedAt,
  isDraft = false,
  onTitleChange,
  onBodyChange,
  autoFocus = false,
}) {
  const createdIso = occurredAt ?? new Date().toISOString();
  const editedIso = updatedAt ?? createdIso;
  const wordCount = countWords(body);

  return (
    <main className="relative flex min-h-0 flex-1 flex-col overflow-y-auto scroll-smooth bg-surface">
      <div className="mx-auto flex min-h-full w-full max-w-[680px] flex-1 flex-col px-6 pb-6 pt-2xl md:max-w-[760px] md:px-10 lg:max-w-[840px] xl:max-w-[920px] xl:px-12 2xl:max-w-[1040px]">
        <div className="mb-xl">
          <div className="flex items-baseline gap-2">
            <span
              aria-hidden="true"
              className="shrink-0 font-mono text-xl font-normal text-on-surface-variant/50 md:text-2xl"
            >
              #
            </span>
            <input
              value={title}
              onChange={(event) => onTitleChange(event.target.value)}
              placeholder="Untitled entry"
              className="w-full min-w-0 bg-transparent font-heading text-[1.75rem] font-semibold leading-tight tracking-tight text-on-background outline-none placeholder:font-heading placeholder:font-normal placeholder:text-on-surface-variant/45 md:text-[2rem]"
            />
          </div>
        </div>

        <div className="mb-4 flex items-center gap-sm text-xs text-on-surface-variant/70">
          <span suppressHydrationWarning>
            Created: {formatEntryCreated(createdIso)}
          </span>
          {!isDraft ? (
            <>
              <span className="opacity-30">•</span>
              <span suppressHydrationWarning>
                Edited {formatRelativeEditTime(editedIso)}
              </span>
            </>
          ) : null}
        </div>

        <hr className="mb-xl border-surface-variant" />

        <textarea
          autoFocus={autoFocus}
          value={body}
          onChange={(event) => onBodyChange(event.target.value)}
          placeholder="Start writing…"
          className="min-h-[512px] w-full flex-1 resize-none bg-transparent font-sans text-base leading-7 text-on-background outline-none placeholder:text-on-surface-variant/50 md:text-lg md:leading-8"
        />

        <div className="mt-auto flex justify-end pt-6">
          <div className="rounded-full border border-outline-variant/30 bg-surface-container-low/80 px-3 py-1 text-[11px] text-on-surface-variant shadow-sm backdrop-blur">
            {wordCount} {wordCount === 1 ? "word" : "words"}
          </div>
        </div>
      </div>
    </main>
  );
}
