"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function PrivacyClient() {
  const [confirmation, setConfirmation] = useState("");
  const [status, setStatus] = useState("idle");

  async function exportData() {
    const response = await fetch("/api/privacy/export");
    const data = await response.json();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "innerscript-privacy-export.json";
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  async function deleteData() {
    const response = await fetch("/api/privacy/delete-account", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ confirmation }),
    });
    setStatus(response.ok ? "deleted" : "error");
  }

  return (
    <main className="min-h-svh bg-background px-6 py-8 text-on-background">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="text-sm text-primary">Back to journal</Link>
        <h1 className="mt-6 text-3xl font-semibold">Privacy</h1>
        <div className="mt-6 flex gap-3">
          <Button onClick={exportData}>Export data</Button>
        </div>
        <div className="mt-10 border-t border-surface-variant/20 pt-6">
          <h2 className="text-lg font-medium">Delete local data</h2>
          <div className="mt-4 flex gap-3">
            <Input value={confirmation} onChange={(event) => setConfirmation(event.target.value)} placeholder="DELETE INNERSCRIPT DATA" />
            <Button onClick={deleteData}>Delete</Button>
          </div>
          {status === "deleted" ? <p className="mt-3 text-sm text-primary">Deleted.</p> : null}
          {status === "error" ? <p className="mt-3 text-sm text-error">Confirmation phrase did not match.</p> : null}
        </div>
      </div>
    </main>
  );
}
