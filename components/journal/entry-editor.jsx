"use client";

import { useRef } from "react";
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
  const characterCount = body.length;
  const bodyRef = useRef(null);

  function handleTitleKeyDown(event) {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    bodyRef.current?.focus();
  }

  return (
    <main className="relative flex min-h-0 flex-1 flex-col overflow-y-auto scroll-smooth bg-surface">
      <div className="mx-auto flex min-h-full w-full max-w-[680px] flex-1 flex-col px-6 pb-6 pt-2xl md:max-w-[760px] md:px-10 lg:max-w-[840px] xl:max-w-[920px] xl:px-12 2xl:max-w-[1040px]">
        <div className="mb-xl">
          <div className="flex items-baseline">
            <input
              value={title}
              onChange={(event) => onTitleChange(event.target.value)}
              onKeyDown={handleTitleKeyDown}
              placeholder="Untitled"
              className="w-full min-w-0 bg-transparent font-heading text-[1.75rem] font-semibold leading-tight tracking-tight text-on-background outline-none placeholder:font-heading placeholder:font-normal placeholder:text-on-surface-variant/45 md:text-[2rem]"
            />
          </div>
        </div>

        <textarea
          ref={bodyRef}
          autoFocus={autoFocus}
          value={body}
          onChange={(event) => onBodyChange(event.target.value)}
          placeholder="How was your day?"
          className="min-h-[512px] w-full flex-1 resize-none bg-transparent font-sans text-base leading-7 text-on-background outline-none placeholder:text-on-surface-variant/50 md:text-lg md:leading-8"
        />

        <div className="mt-auto flex flex-col gap-2 pt-6 text-[11px] text-on-surface-variant/55 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span suppressHydrationWarning>
              Created {formatEntryCreated(createdIso)}
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
          <div className="w-fit rounded-full bg-surface-container-low/80 px-3 py-1 text-[11px] text-on-surface-variant/70">
            {wordCount} {wordCount === 1 ? "word" : "words"} · {characterCount}{" "}
            {characterCount === 1 ? "character" : "characters"}
          </div>
        </div>
      </div>
    </main>
  );
}
