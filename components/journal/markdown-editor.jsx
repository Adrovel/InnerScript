"use client";

import "./editorTheme.css";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { Annotation, EditorState, Prec } from "@codemirror/state";
import { HighlightStyle, syntaxHighlighting, syntaxTree } from "@codemirror/language";
import { markdown } from "@codemirror/lang-markdown";
import { minimalSetup } from "codemirror";
import {
  Decoration,
  EditorView,
  ViewPlugin,
  WidgetType,
  keymap,
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
]);

const reactSyncAnnotation = Annotation.define();
const EMPTY_QUOTE_LINE_PATTERN = /^\s*>\s*$/;

const markdownTreeDecorations = ViewPlugin.fromClass(
  class {
    constructor(view) {
      this.decorations = buildTreeDecorations(view);
    }

    update(update) {
      if (update.docChanged || update.selectionSet || update.viewportChanged) {
        this.decorations = buildTreeDecorations(update.view);
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

const HEADING_LEVEL_PATTERN = /^(?:ATX|Setext)Heading(\d)$/;
const QUOTE_ATTRIBUTION_PATTERN = /^\s*>\s*(?:—|--)\s+\S/;
const DOUBLE_HYPHEN_QUOTE_ATTRIBUTION_PATTERN = /^(\s*>\s*)--(?=\s+\S)/;

const INLINE_SYNTAX_MARKS = new Set([
  "EmphasisMark",
  "CodeMark",
  "LinkMark",
]);

function headingLevel(nodeName) {
  const match = HEADING_LEVEL_PATTERN.exec(nodeName);

  return match ? Number(match[1]) : null;
}

function isActiveLine(view, line) {
  return view.state.selection.ranges.some(
    (range) => range.from <= line.to && range.to >= line.from,
  );
}

function addLineDecoration(ranges, position, className) {
  ranges.push(Decoration.line({ class: className }).range(position));
}

function addLineDecorationsForRange(doc, ranges, from, to, className) {
  const startLine = doc.lineAt(from).number;
  const endLine = doc.lineAt(to).number;

  for (let lineNumber = startLine; lineNumber <= endLine; lineNumber += 1) {
    addLineDecoration(ranges, doc.line(lineNumber).from, className);
  }
}

function decorateBlockquoteLines(doc, ranges, from, to) {
  const startLine = doc.lineAt(from).number;
  const endLine = doc.lineAt(to).number;

  for (let lineNumber = startLine; lineNumber <= endLine; lineNumber += 1) {
    const line = doc.line(lineNumber);
    const doubleHyphenAttribution = DOUBLE_HYPHEN_QUOTE_ATTRIBUTION_PATTERN.exec(line.text);
    const className = QUOTE_ATTRIBUTION_PATTERN.test(line.text)
      ? "cm-markdown-quote-line cm-markdown-quote-attribution-line"
      : "cm-markdown-quote-line";

    addLineDecoration(ranges, line.from, className);

    if (doubleHyphenAttribution) {
      const markerFrom = line.from + doubleHyphenAttribution[1].length;

      addReplaceDecoration(
        ranges,
        markerFrom,
        markerFrom + 2,
        "—",
        "cm-markdown-syntax-marker",
      );
    }
  }
}

function addMarkDecoration(ranges, from, to, className = "cm-markdown-syntax-marker") {
  if (to > from) {
    ranges.push(Decoration.mark({ class: className }).range(from, to));
  }
}

function addInlineSyntaxDecoration(view, ranges, from, to) {
  const line = view.state.doc.lineAt(from);
  const className = isActiveLine(view, line)
    ? "cm-markdown-syntax-marker"
    : "cm-markdown-hidden-syntax-marker";

  addMarkDecoration(ranges, from, to, className);
}

function addReplaceDecoration(ranges, from, to, text, className) {
  if (to > from) {
    ranges.push(
      Decoration.replace({
        widget: new MarkdownSyntaxWidget(text, className),
      }).range(from, to),
    );
  }
}

function addHiddenReplaceDecoration(ranges, from, to) {
  if (to > from) {
    ranges.push(Decoration.replace({}).range(from, to));
  }
}

function removeEmptyQuoteMarkerOnEnter(view) {
  const selection = view.state.selection.main;

  if (!selection.empty) {
    return false;
  }

  const line = view.state.doc.lineAt(selection.from);

  if (!EMPTY_QUOTE_LINE_PATTERN.test(line.text)) {
    return false;
  }

  view.dispatch({
    changes: { from: line.from, to: line.to, insert: "\n" },
    selection: { anchor: line.from + 1 },
    scrollIntoView: true,
  });

  return true;
}

const markdownKeymap = Prec.highest(
  keymap.of([
    {
      key: "Enter",
      run: removeEmptyQuoteMarkerOnEnter,
    },
  ]),
);

function markerPrefixEnd(line, markerEnd) {
  let end = Math.min(markerEnd, line.to);

  if (end < line.to) {
    const char = line.text[end - line.from];

    if (char === " " || char === "\t") {
      end += 1;
    }
  }

  return end;
}

function decorateMarkerPrefix(
  ranges,
  {
    from,
    markerEnd,
    line,
    isActive,
    activeClass = "cm-markdown-syntax-marker",
    inactiveWidget,
    inactiveWidgetClass,
  },
) {
  const prefixEnd = markerPrefixEnd(line, markerEnd);

  if (isActive) {
    addMarkDecoration(ranges, from, prefixEnd, activeClass);
    return;
  }

  if (inactiveWidget !== undefined) {
    addReplaceDecoration(ranges, from, prefixEnd, inactiveWidget, inactiveWidgetClass);
    return;
  }

  addHiddenReplaceDecoration(ranges, from, prefixEnd);
}

function decorateListMark(view, ranges, node) {
  const line = view.state.doc.lineAt(node.from);
  const isActive = isActiveLine(view, line);
  const markerText = view.state.doc.sliceString(node.from, node.to);

  addLineDecoration(ranges, line.from, "cm-markdown-list-line");

  if (node.matchContext(["OrderedList", "ListItem"])) {
    decorateMarkerPrefix(ranges, {
      from: node.from,
      markerEnd: node.to,
      line,
      isActive,
      activeClass: "cm-markdown-list-marker",
      inactiveWidget: markerText,
      inactiveWidgetClass: "cm-markdown-ordered-widget",
    });
    return;
  }

  if (node.matchContext(["BulletList", "ListItem"])) {
    decorateMarkerPrefix(ranges, {
      from: node.from,
      markerEnd: node.to,
      line,
      isActive,
      activeClass: "cm-markdown-list-marker",
      inactiveWidget: "•",
      inactiveWidgetClass: "cm-markdown-bullet-widget",
    });
  }
}

function buildTreeDecorations(view) {
  const ranges = [];
  const doc = view.state.doc;

  for (const { from, to } of view.visibleRanges) {
    syntaxTree(view.state).iterate({
      from,
      to,
      enter(node) {
        const level = headingLevel(node.name);

        if (level !== null) {
          const line = doc.lineAt(node.from);

          addLineDecoration(
            ranges,
            line.from,
            `cm-markdown-heading-line cm-markdown-heading-line-${level}`,
          );
        }

        if (node.name === "Blockquote") {
          decorateBlockquoteLines(doc, ranges, node.from, node.to);
        }

        if (node.name === "FencedCode") {
          addLineDecorationsForRange(doc, ranges, node.from, node.to, "cm-markdown-code-line");
        }

        if (node.name === "HorizontalRule") {
          addLineDecoration(ranges, doc.lineAt(node.from).from, "cm-markdown-rule-line");
        }

        if (node.name === "HeaderMark") {
          const line = doc.lineAt(node.from);

          decorateMarkerPrefix(ranges, {
            from: node.from,
            markerEnd: node.to,
            line,
            isActive: isActiveLine(view, line),
          });
        }

        if (node.name === "QuoteMark") {
          const line = doc.lineAt(node.from);

          decorateMarkerPrefix(ranges, {
            from: node.from,
            markerEnd: node.to,
            line,
            isActive: isActiveLine(view, line),
          });
        }

        if (node.name === "ListMark") {
          decorateListMark(view, ranges, node);
        }

        if (INLINE_SYNTAX_MARKS.has(node.name) && !node.matchContext(["FencedCode"])) {
          addInlineSyntaxDecoration(view, ranges, node.from, node.to);
        }
      },
    });
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
        markdownKeymap,
        markdown({ completeHTMLTags: false }),
        syntaxHighlighting(markdownHighlightStyle),
        markdownTreeDecorations,
        placeholderExtension(initialConfig.placeholder),
        EditorView.lineWrapping,
        EditorView.contentAttributes.of({
          "aria-label": initialConfig.ariaLabel,
          autocapitalize: "sentences",
          spellcheck: "true",
        }),
        updateListener,
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
