import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { MarkdownRenderer } from "../../components/journal/markdown-renderer.jsx";

function renderMarkdown(markdown) {
  return renderToStaticMarkup(createElement(MarkdownRenderer, null, markdown));
}

describe("MarkdownRenderer", () => {
  test("renders GFM tables and task lists", () => {
    const html = renderMarkdown([
      "| Signal | Evidence |",
      "| --- | --- |",
      "| calm | wrote it down |",
      "",
      "- [x] Save raw Markdown",
    ].join("\n"));

    expect(html).toContain("<table>");
    expect(html).toContain("<td>calm</td>");
    expect(html).toContain("type=\"checkbox\"");
    expect(html).toContain("checked=\"\"");
  });

  test("does not trust raw HTML from notes", () => {
    const html = renderMarkdown("<script>alert('x')</script>\n\n<strong>not trusted html</strong>");

    expect(html).not.toContain("<script>");
    expect(html).not.toContain("<strong>not trusted html</strong>");
    expect(html).toContain("&lt;script&gt;");
  });

  test("drops unsafe link protocols", () => {
    const html = renderMarkdown("[bad](javascript:alert(1)) [good](https://example.com)");

    expect(html).toContain("<a href=\"\"");
    expect(html).toContain("<a href=\"https://example.com\"");
    expect(html).not.toContain("javascript:alert");
  });
});
