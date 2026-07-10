"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SearchClient() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("idle");

  async function runSearch(event) {
    event.preventDefault();
    setStatus("loading");

    const response = await fetch("/api/search", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ query }),
    });
    const data = await response.json();

    setResults(data.results ?? []);
    setStatus(response.ok ? "ready" : "error");
  }

  return (
    <main className="min-h-svh bg-background px-6 py-8 text-on-background">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="text-sm text-primary">Back to journal</Link>
        <h1 className="mt-6 text-3xl font-semibold">Search</h1>
        <form onSubmit={runSearch} className="mt-6 flex gap-3">
          <Input
            aria-label="Search query"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="times I felt behind"
          />
          <Button type="submit">{status === "loading" ? "Searching" : "Search"}</Button>
        </form>
        <div className="mt-8 space-y-4">
          {results.map((result) => (
            <article key={result.chunk.id} className="border-b border-surface-variant/20 pb-4">
              <h2 className="font-medium">{result.entry.title ?? "Untitled"}</h2>
              <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">{result.chunk.text}</p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
