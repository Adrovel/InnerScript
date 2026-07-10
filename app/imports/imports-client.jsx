"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function ImportsClient() {
  const [content, setContent] = useState("");
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState("idle");

  async function previewImport() {
    setStatus("loading");
    const response = await fetch("/api/imports/preview", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ kind: "markdown", filename: "manual-import.md", content }),
    });
    const data = await response.json();
    setPreview(data.preview ?? null);
    setStatus(response.ok ? "preview" : "error");
  }

  async function confirmImport() {
    setStatus("loading");
    const response = await fetch("/api/imports/confirm", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ preview }),
    });
    setStatus(response.ok ? "saved" : "error");
  }

  return (
    <main className="min-h-svh bg-background px-6 py-8 text-on-background">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="text-sm text-primary">Back to journal</Link>
        <h1 className="mt-6 text-3xl font-semibold">Imports</h1>
        <Textarea className="mt-6 min-h-64" value={content} onChange={(event) => setContent(event.target.value)} placeholder="# Old journal&#10;&#10;Paste Markdown or text here." />
        <div className="mt-4 flex gap-3">
          <Button onClick={previewImport}>Preview</Button>
          <Button onClick={confirmImport} disabled={!preview}>Confirm</Button>
        </div>
        {preview ? (
          <div className="mt-8 space-y-3">
            {preview.entries.map((entry, index) => (
              <article key={`${entry.title}-${index}`} className="border-b border-surface-variant/20 pb-3">
                <h2 className="font-medium">{entry.title}</h2>
                <p className="mt-1 line-clamp-3 text-sm text-on-surface-variant">{entry.body}</p>
              </article>
            ))}
          </div>
        ) : null}
        {status === "saved" ? <p className="mt-4 text-sm text-primary">Imported.</p> : null}
      </div>
    </main>
  );
}
