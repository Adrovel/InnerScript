"use client";

import { useEffect, useRef } from "react";
import { MarkdownEditor } from "./markdown-editor";
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
  focusTarget = null,
}) {
  const createdIso = occurredAt ?? new Date().toISOString();
  const editedIso = updatedAt ?? createdIso;
  const wordCount = countWords(body);
  const characterCount = body.length;
  const titleRef = useRef(null);
  const bodyRef = useRef(null);
  const titleValueRef = useRef(title);
  const bodyValueRef = useRef(body);

  useEffect(() => {
    titleValueRef.current = title;
    bodyValueRef.current = body;
  }, [body, title]);

  useEffect(() => {
    const currentTitle = titleValueRef.current;
    const currentBody = bodyValueRef.current;

    if (focusTarget === "title-all") {
      const titleInput = titleRef.current;

      titleInput?.focus();
      titleInput?.setSelectionRange(0, currentTitle.length);
      return;
    }

    if (focusTarget === "entry-end") {
      if (currentBody.length > 0) {
        bodyRef.current?.focusEnd();
        return;
      }

      const titleInput = titleRef.current;

      titleInput?.focus();
      titleInput?.setSelectionRange(currentTitle.length, currentTitle.length);
      return;
    }

    if (focusTarget === "body") {
      bodyRef.current?.focus();
    }
  }, [focusTarget]);

  function handleTitleKeyDown(event) {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    bodyRef.current?.focus();
  }

  return (
    <main className="relative flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-surface">
      <div className="mx-auto flex min-h-0 w-full max-w-[640px] flex-1 flex-col px-6 pb-4 pt-2xl md:max-w-[700px] md:px-10 lg:max-w-[760px] xl:max-w-[820px] xl:px-12 2xl:max-w-[880px]">
        <div className="mb-xl shrink-0">
          <div className="flex items-baseline">
            <input
              ref={titleRef}
              value={title}
              onChange={(event) => onTitleChange(event.target.value)}
              onKeyDown={handleTitleKeyDown}
              placeholder="Untitled"
              className="w-full min-w-0 bg-transparent font-sans text-[1.75rem] font-semibold leading-tight tracking-tight text-on-background outline-none placeholder:font-sans placeholder:font-normal placeholder:text-on-surface-variant/45 md:text-[2rem]"
            />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto scroll-smooth">
          <MarkdownEditor
            ref={bodyRef}
            value={body}
            onChange={onBodyChange}
            placeholder="How was your day?"
          />
        </div>

        <footer className="flex shrink-0 flex-col gap-2 border-t border-surface-variant/20 pt-3 text-[11px] text-on-surface-variant/55 sm:flex-row sm:items-center sm:justify-between">
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
        </footer>
      </div>
    </main>
  );
}
