import { NextRequest } from "next/server";
import { describe, expect, test } from "vitest";
import { DELETE, GET, PUT } from "../../app/api/entries/[id]/route.js";
import { GET as LIST, POST } from "../../app/api/entries/route.js";
import { GET as EXPORT_MARKDOWN } from "../../app/api/export/markdown/route.js";
import { POST as CREATE_FOLDER } from "../../app/api/folders/route.js";
import { POST as SEARCH } from "../../app/api/search/route.js";
import { POST as REFLECT } from "../../app/api/reflection-question/route.js";

function jsonRequest(url, body, method = "POST") {
  return new NextRequest(url, {
    method,
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

function params(id) {
  return { params: Promise.resolve({ id }) };
}

describe("entries API", () => {
  test("creates and reads a manual note with no source or folder", async () => {
    const createdResponse = await POST(
      jsonRequest("http://localhost/api/entries", {
        title: "Today",
        body: "A manually written entry.",
      }),
    );

    expect(createdResponse.status).toBe(201);
    const created = await createdResponse.json();
    expect(created.entry).toMatchObject({
      title: "Today",
      body: "A manually written entry.",
      entry_type: "note",
      folder_id: null,
      journal_date: null,
      source_id: null,
    });

    const readResponse = await GET(new NextRequest(`http://localhost/api/entries/${created.entry.id}`), params(created.entry.id));
    expect(readResponse.status).toBe(200);
    await expect(readResponse.json()).resolves.toMatchObject({
      entry: {
        id: created.entry.id,
        source_id: null,
      },
    });
  });

  test("lists created entries", async () => {
    await POST(jsonRequest("http://localhost/api/entries", { body: "First" }));
    await POST(jsonRequest("http://localhost/api/entries", { body: "Second" }));

    const response = await LIST(new NextRequest("http://localhost/api/entries"));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.entries).toHaveLength(2);
  });

  test("creates folder documents and date-marked journal documents", async () => {
    const folderResponse = await CREATE_FOLDER(
      jsonRequest("http://localhost/api/folders", {
        name: "Google Prep",
      }),
    );
    const { folder } = await folderResponse.json();

    const response = await POST(
      jsonRequest("http://localhost/api/entries", {
        title: "Interview notes",
        body: "System design practice.",
        folder_id: folder.id,
        journal_date: "2026-06-11",
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(payload.entry).toMatchObject({
      title: "Interview notes",
      entry_type: "note",
      folder_id: folder.id,
      journal_date: "2026-06-11",
    });
  });

  test("rejects conversation creation through the manual entries API", async () => {
    const response = await POST(
      jsonRequest("http://localhost/api/entries", {
        body: "Joel: This came from a chat import.",
        entry_type: "conversation",
      }),
    );

    expect(response.status).toBe(400);
  });

  test("maps legacy sidebar journal and note requests to documents", async () => {
    const journalResponse = await POST(
      jsonRequest("http://localhost/api/entries", {
        title: "Legacy journal",
        body: "Created before frontend folder wiring.",
        entry_type: "journal",
        occurred_at: "2026-06-11T10:00:00.000Z",
      }),
    );
    const journalPayload = await journalResponse.json();

    expect(journalResponse.status).toBe(201);
    expect(journalPayload.entry).toMatchObject({
      entry_type: "note",
      journal_date: "2026-06-11",
    });

    const noteResponse = await POST(
      jsonRequest("http://localhost/api/entries", {
        title: "Legacy note",
        body: "Created before frontend folder wiring.",
        entry_type: "note",
      }),
    );
    const notePayload = await noteResponse.json();

    expect(noteResponse.status).toBe(201);
    expect(notePayload.entry).toMatchObject({
      entry_type: "note",
      journal_date: null,
    });
  });

  test("rejects source_id on manual entry creation", async () => {
    const response = await POST(
      jsonRequest("http://localhost/api/entries", {
        body: "This should not be source-linked from manual CRUD.",
        source_id: "734ac035-a77d-4da9-b8ca-5d9aeb699253",
      }),
    );

    expect(response.status).toBe(400);
  });

  test("updates entry content and location without allowing provenance or shape changes", async () => {
    const createdResponse = await POST(jsonRequest("http://localhost/api/entries", { body: "Original" }));
    const { entry } = await createdResponse.json();
    const folderResponse = await CREATE_FOLDER(
      jsonRequest("http://localhost/api/folders", {
        name: "Archive",
      }),
    );
    const { folder } = await folderResponse.json();

    const updatedResponse = await PUT(
      jsonRequest(
        `http://localhost/api/entries/${entry.id}`,
        {
          title: "Updated",
          body: "Updated body",
          folder_id: folder.id,
          journal_date: "2026-06-11",
        },
        "PUT",
      ),
      params(entry.id),
    );
    const updated = await updatedResponse.json();

    expect(updatedResponse.status).toBe(200);
    expect(updated.entry).toMatchObject({
      id: entry.id,
      title: "Updated",
      body: "Updated body",
      folder_id: folder.id,
      journal_date: "2026-06-11",
      source_id: null,
    });

    const badResponse = await PUT(
      jsonRequest(`http://localhost/api/entries/${entry.id}`, { source_id: null }, "PUT"),
      params(entry.id),
    );
    expect(badResponse.status).toBe(400);
  });

  test("deletes an entry", async () => {
    const createdResponse = await POST(jsonRequest("http://localhost/api/entries", { body: "Delete me" }));
    const { entry } = await createdResponse.json();

    const deletedResponse = await DELETE(new NextRequest(`http://localhost/api/entries/${entry.id}`, { method: "DELETE" }), params(entry.id));
    expect(deletedResponse.status).toBe(204);

    const missingResponse = await GET(new NextRequest(`http://localhost/api/entries/${entry.id}`), params(entry.id));
    expect(missingResponse.status).toBe(404);
  });

  test("indexes entries for local source-backed search", async () => {
    await POST(
      jsonRequest("http://localhost/api/entries", {
        title: "Google prep",
        body: "I felt anxious about Google interviews.\n\nI also felt focused after writing.",
      }),
    );

    const response = await SEARCH(
      jsonRequest("http://localhost/api/search", {
        query: "Google anxious",
        limit: 5,
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.mode).toBe("local-hybrid");
    expect(payload.results[0]).toMatchObject({
      entry: {
        title: "Google prep",
      },
      chunk: {
        text: "I felt anxious about Google interviews.",
      },
    });
  });

  test("exports all entries as one Markdown archive", async () => {
    await POST(jsonRequest("http://localhost/api/entries", { title: "First", body: "One" }));
    await POST(jsonRequest("http://localhost/api/entries", { title: "Second", body: "Two" }));

    const response = await EXPORT_MARKDOWN();
    const markdown = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/markdown");
    expect(markdown).toContain("# First");
    expect(markdown).toContain("---");
    expect(markdown).toContain("# Second");
  });

  test("returns one Echo reflection question for the current entry", async () => {
    const createdResponse = await POST(
      jsonRequest("http://localhost/api/entries", {
        title: "Behind",
        body: "I feel behind in my career and I am scared that I am wasting time.",
      }),
    );
    const { entry } = await createdResponse.json();

    const response = await REFLECT(
      jsonRequest("http://localhost/api/reflection-question", {
        entry_id: entry.id,
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.reflection).toMatchObject({
      mode: "local",
      source: {
        entry_id: entry.id,
        title: "Behind",
      },
    });
    expect(payload.reflection.question).toContain("risk");
  });

  test("blocks Echo when the entry is too thin", async () => {
    const createdResponse = await POST(
      jsonRequest("http://localhost/api/entries", {
        title: "Thin",
        body: "small note",
      }),
    );
    const { entry } = await createdResponse.json();

    const response = await REFLECT(
      jsonRequest("http://localhost/api/reflection-question", {
        entry_id: entry.id,
      }),
    );

    expect(response.status).toBe(422);
  });
});
