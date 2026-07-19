import { describe, expect, test } from "vitest";
import { DELETE, GET, PUT } from "../../app/api/notes/[id]/route.js";
import { GET as LIST, POST } from "../../app/api/notes/route.js";

function jsonRequest(url, body, method = "POST") {
  return new Request(url, {
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

async function createNote(input = {}) {
  const response = await POST(
    jsonRequest("http://localhost/api/notes", {
      title: "Morning",
      body: "I wrote a clean first note.",
      ...input,
    }),
  );

  return response.json();
}

describe("notes API", () => {
  test("creates a note with canonical fields", async () => {
    const response = await POST(
      jsonRequest("http://localhost/api/notes", {
        title: "Morning",
        body: "I wrote a clean first note.",
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(payload.note).toMatchObject({
      title: "Morning",
      body: "I wrote a clean first note.",
    });
    expect(Object.keys(payload.note).sort()).toEqual([
      "body",
      "created_at",
      "id",
      "title",
      "updated_at",
    ]);
    expect(payload.note.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(Date.parse(payload.note.created_at)).not.toBeNaN();
    expect(Date.parse(payload.note.updated_at)).not.toBeNaN();
  });

  test("lists notes", async () => {
    await createNote({ title: "First", body: "One" });
    await createNote({ title: "Second", body: "Two" });

    const response = await LIST();
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.notes).toHaveLength(2);
    expect(payload.notes.map((note) => note.title).sort()).toEqual(["First", "Second"]);
  });

  test("opens a note by id", async () => {
    const { note } = await createNote({ title: "Find me" });

    const response = await GET(new Request(`http://localhost/api/notes/${note.id}`), params(note.id));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.note).toMatchObject({
      id: note.id,
      title: "Find me",
      body: "I wrote a clean first note.",
    });
  });

  test("updates a note", async () => {
    const { note } = await createNote({ title: "Draft", body: "Original body." });

    const response = await PUT(
      jsonRequest(
        `http://localhost/api/notes/${note.id}`,
        {
          title: "Updated",
          body: "Updated body.",
        },
        "PUT",
      ),
      params(note.id),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.note).toMatchObject({
      id: note.id,
      title: "Updated",
      body: "Updated body.",
    });
    expect(Date.parse(payload.note.updated_at)).toBeGreaterThanOrEqual(
      Date.parse(note.updated_at),
    );
  });

  test("deletes a note", async () => {
    const { note } = await createNote({ title: "Remove me" });

    const deletedResponse = await DELETE(
      new Request(`http://localhost/api/notes/${note.id}`, { method: "DELETE" }),
      params(note.id),
    );
    const missingResponse = await GET(
      new Request(`http://localhost/api/notes/${note.id}`),
      params(note.id),
    );
    const missingPayload = await missingResponse.json();

    expect(deletedResponse.status).toBe(204);
    expect(missingResponse.status).toBe(404);
    expect(missingPayload.error).toBe("Note not found");
  });

  test("rejects invalid note input", async () => {
    const missingBodyResponse = await POST(
      jsonRequest("http://localhost/api/notes", {
        title: "No body",
      }),
    );
    const badIdResponse = await GET(
      new Request("http://localhost/api/notes/not-a-uuid"),
      params("not-a-uuid"),
    );

    expect(missingBodyResponse.status).toBe(400);
    expect(badIdResponse.status).toBe(400);
  });
});
