"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { Annotation, EditorState } from "@codemirror/state";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { markdown } from "@codemirror/lang-markdown";
import { minimalSetup } from "codemirror";
import {
  Decoration,
  EditorView,
  ViewPlugin,
  WidgetType,
  placeholder as placeholderExtension,
} from "@codemirror/view";
import { tags } from "@lezer/highlight";

const markdownHighlightStyle = HighlightStyle.define([
  { tag: tags.heading1, class: "cm-markdown-heading-token cm-markdown-heading-token-1" },
  { tag: tags.heading2, class: "cm-markdown-heading-token cm-markdown-heading-token-2" },
  { tag: tags.heading3, class: "cm-markdown-heading-token cm-markdown-heading-token-3" },
  { tag: tags.heading4, class: "cm-markdown-heading-token cm-markdown-heading-token-4" },
  { tag: tags.heading5, class: "cm-markdown-heading-token cm-markdown-heading-token-5" },
  { tag: tags.heading6, class: "cm-markdown-heading-token cm-markdown-heading-token-6" },
  { tag: tags.strong, class: "cm-markdown-strong-token" },
  { tag: tags.emphasis, class: "cm-markdown-emphasis-token" },
  { tag: tags.monospace, class: "cm-markdown-code-token" },
  { tag: tags.link, class: "cm-markdown-link-token" },
  { tag: tags.quote, class: "cm-markdown-quote-token" },
  { tag: tags.strikethrough, class: "cm-markdown-strike-token" },
]);

const reactSyncAnnotation = Annotation.define();

const markdownEditorTheme = EditorView.theme({
  "&": {
    backgroundColor: "transparent",
    color: "var(--color-on-background)",
  },
  "&.cm-focused": {
    outline: "none",
  },
  ".cm-scroller": {
    overflow: "visible",
  },
  ".cm-content": {
    caretColor: "var(--color-primary)",
  },
  ".cm-cursor": {
    borderLeftColor: "var(--color-primary)",
  },
  ".cm-selectionBackground": {
    backgroundColor: "color-mix(in srgb, var(--color-secondary-container) 55%, transparent)",
  },
  "&.cm-focused .cm-selectionBackground": {
    backgroundColor: "color-mix(in srgb, var(--color-secondary-container) 70%, transparent)",
  },
});

const markdownLineDecorations = ViewPlugin.fromClass(
  class {
    constructor(view) {
      this.decorations = buildLineDecorations(view);
    }

    update(update) {
      if (update.docChanged || update.selectionSet || update.viewportChanged) {
        this.decorations = buildLineDecorations(update.view);
      }
    }
  },
  {
    decorations: (plugin) => plugin.decorations,
  },
);

class MarkdownSyntaxWidget extends WidgetType {
  constructor(text, className) {
    super();
    this.text = text;
    this.className = className;
  }

  eq(other) {
    return this.text === other.text && this.className === other.className;
  }

  toDOM() {
    const marker = document.createElement("span");

    marker.className = this.className;
    marker.textContent = this.text;

    return marker;
  }
}

function buildLineDecorations(view) {
  const ranges = [];
  const doc = view.state.doc;
  let inCodeFence = false;

  function isActiveLine(line) {
    return view.state.selection.ranges.some(
      (range) => range.from <= line.to && range.to >= line.from,
    );
  }

  function addLineClass(position, classes) {
    ranges.push(Decoration.line({ class: classes.join(" ") }).range(position));
  }

  function addMarker(from, to, className = "cm-markdown-syntax-marker") {
    if (to > from) {
      ranges.push(Decoration.mark({ class: className }).range(from, to));
    }
  }

  function replaceMarker(from, to, text, className) {
    if (to > from) {
      ranges.push(
        Decoration.replace({
          widget: new MarkdownSyntaxWidget(text, className),
        }).range(from, to),
      );
    }
  }

  function addDelimitedMarkers(line, pattern, delimiterIndex = 1) {
    for (const match of line.text.matchAll(pattern)) {
      const delimiter = match[delimiterIndex];

      if (!delimiter) {
        continue;
      }

      const start = line.from + match.index;
      const endMarkerStart = start + match[0].length - delimiter.length;

      addMarker(start, start + delimiter.length);
      addMarker(endMarkerStart, endMarkerStart + delimiter.length);
    }
  }

  for (let lineNumber = 1; lineNumber <= doc.lines; lineNumber += 1) {
    const line = doc.line(lineNumber);
    const trimmed = line.text.trimStart();
    const contentStart = line.from + line.text.length - trimmed.length;
    const isFence = /^(```|~~~)/.test(trimmed);
    const isActive = isActiveLine(line);
    const classes = [];

    if (inCodeFence || isFence) {
      classes.push("cm-markdown-code-line");
    }

    if (!inCodeFence) {
      const headingMatch = /^(#{1,6})(\s+|$)/.exec(trimmed);
      const taskMatch = /^([-*+]\s+)(\[[ xX]\])(\s*)/.exec(trimmed);
      const unorderedListMatch = /^([-*+]\s+)/.exec(trimmed);
      const orderedListMatch = /^(\d+\.\s+)/.exec(trimmed);
      const quoteMatch = /^(>\s*)/.exec(trimmed);

      if (headingMatch) {
        classes.push(
          "cm-markdown-heading-line",
          `cm-markdown-heading-line-${headingMatch[1].length}`,
        );

        const markerEnd = contentStart + headingMatch[1].length + headingMatch[2].length;

        if (isActive) {
          addMarker(contentStart, markerEnd);
        } else {
          addMarker(contentStart, markerEnd, "cm-markdown-hidden-syntax-marker");
        }
      } else if (trimmed.startsWith(">")) {
        classes.push("cm-markdown-quote-line");

        if (quoteMatch) {
          addMarker(contentStart, contentStart + quoteMatch[1].length);
        }
      } else if (taskMatch) {
        classes.push("cm-markdown-task-line");

        if (isActive) {
          addMarker(contentStart, contentStart + taskMatch[1].length, "cm-markdown-list-marker");
        } else {
          replaceMarker(
            contentStart,
            contentStart + taskMatch[1].length,
            "• ",
            "cm-markdown-bullet-widget",
          );
        }

        addMarker(
          contentStart + taskMatch[1].length,
          contentStart + taskMatch[1].length + taskMatch[2].length,
          "cm-markdown-task-marker",
        );
      } else if (unorderedListMatch) {
        classes.push("cm-markdown-list-line");

        if (isActive) {
          addMarker(
            contentStart,
            contentStart + unorderedListMatch[1].length,
            "cm-markdown-list-marker",
          );
        } else {
          replaceMarker(
            contentStart,
            contentStart + unorderedListMatch[1].length,
            "• ",
            "cm-markdown-bullet-widget",
          );
        }
      } else if (orderedListMatch) {
        classes.push("cm-markdown-list-line");
        addMarker(
          contentStart,
          contentStart + orderedListMatch[1].length,
          "cm-markdown-list-marker",
        );
      } else if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
        classes.push("cm-markdown-rule-line");
      }

      addDelimitedMarkers(line, /(\*\*|__)(?=\S)(.*?\S)\1/g);
      addDelimitedMarkers(line, /(`+)([^`]+)\1/g);
      addDelimitedMarkers(line, /(~~)(?=\S)(.*?\S)\1/g);
    }

    if (classes.length > 0) {
      addLineClass(line.from, classes);
    }

    if (isFence) {
      inCodeFence = !inCodeFence;
    }
  }

  return Decoration.set(ranges, true);
}

export const MarkdownEditor = forwardRef(function MarkdownEditor(
  {
    value,
    onChange,
    placeholder = "How was your day?",
    ariaLabel = "Entry body",
  },
  ref,
) {
  const containerRef = useRef(null);
  const viewRef = useRef(null);
  const onChangeRef = useRef(onChange);
  const initialConfigRef = useRef({ ariaLabel, placeholder, value });

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useImperativeHandle(ref, () => ({
    focus() {
      viewRef.current?.focus();
    },
    focusEnd() {
      const view = viewRef.current;

      if (!view) {
        return;
      }

      view.focus();
      view.dispatch({
        selection: { anchor: view.state.doc.length },
        scrollIntoView: true,
      });
    },
  }), []);

  useEffect(() => {
    if (!containerRef.current || viewRef.current) {
      return undefined;
    }

    const initialConfig = initialConfigRef.current;
    const updateListener = EditorView.updateListener.of((update) => {
      const isReactSync = update.transactions.some((transaction) =>
        transaction.annotation(reactSyncAnnotation),
      );

      if (update.docChanged && !isReactSync) {
        onChangeRef.current(update.state.doc.toString());
      }
    });

    const state = EditorState.create({
      doc: initialConfig.value,
      extensions: [
        minimalSetup,
        markdown({ completeHTMLTags: false }),
        syntaxHighlighting(markdownHighlightStyle),
        markdownLineDecorations,
        placeholderExtension(initialConfig.placeholder),
        EditorView.lineWrapping,
        EditorView.contentAttributes.of({
          "aria-label": initialConfig.ariaLabel,
          autocapitalize: "sentences",
          spellcheck: "true",
        }),
        updateListener,
        markdownEditorTheme,
      ],
    });

    viewRef.current = new EditorView({
      state,
      parent: containerRef.current,
    });

    return () => {
      viewRef.current?.destroy();
      viewRef.current = null;
    };
  }, []);

  useEffect(() => {
    const view = viewRef.current;

    if (!view || view.state.doc.toString() === value) {
      return;
    }

    view.dispatch({
      changes: {
        from: 0,
        to: view.state.doc.length,
        insert: value,
      },
      annotations: reactSyncAnnotation.of(true),
    });
  }, [value]);

  return <div ref={containerRef} className="innerscript-markdown-editor" />;
});
