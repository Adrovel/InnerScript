import { NextRequest } from "next/server";
import { describe, expect, test } from "vitest";
import { DELETE, GET, PUT } from "../../app/api/entries/[id]/route.js";
import { GET as LIST, POST } from "../../app/api/entries/route.js";

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
  test("creates and reads a manual journal entry with no source", async () => {
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
      entry_type: "journal",
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

  test("rejects source_id on manual entry creation", async () => {
    const response = await POST(
      jsonRequest("http://localhost/api/entries", {
        body: "This should not be source-linked from manual CRUD.",
        source_id: "734ac035-a77d-4da9-b8ca-5d9aeb699253",
      }),
    );

    expect(response.status).toBe(400);
  });

  test("updates entry content without allowing provenance changes", async () => {
    const createdResponse = await POST(jsonRequest("http://localhost/api/entries", { body: "Original" }));
    const { entry } = await createdResponse.json();

    const updatedResponse = await PUT(
      jsonRequest(`http://localhost/api/entries/${entry.id}`, { title: "Updated", body: "Updated body" }, "PUT"),
      params(entry.id),
    );
    const updated = await updatedResponse.json();

    expect(updatedResponse.status).toBe(200);
    expect(updated.entry).toMatchObject({
      id: entry.id,
      title: "Updated",
      body: "Updated body",
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
});
