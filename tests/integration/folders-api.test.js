import { NextRequest } from "next/server";
import { describe, expect, test } from "vitest";
import { GET, POST } from "../../app/api/folders/route.js";
import {
  GET as LIST_ENTRIES,
  POST as CREATE_ENTRY,
} from "../../app/api/entries/route.js";
import {
  DELETE as DELETE_FOLDER,
  GET as GET_FOLDER,
  PUT as UPDATE_FOLDER,
} from "../../app/api/folders/[id]/route.js";

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

describe("folders API", () => {
  test("creates the default Journal folder once when folders are listed", async () => {
    const firstResponse = await GET(new NextRequest("http://localhost/api/folders"));
    const firstPayload = await firstResponse.json();

    expect(firstResponse.status).toBe(200);
    expect(firstPayload.folders).toHaveLength(1);
    expect(firstPayload.folders[0]).toMatchObject({
      name: "Journal",
      parent_folder_id: null,
      sort_order: 0,
    });

    const secondResponse = await GET(new NextRequest("http://localhost/api/folders"));
    const secondPayload = await secondResponse.json();

    expect(secondResponse.status).toBe(200);
    expect(secondPayload.folders.filter((folder) => folder.name === "Journal")).toHaveLength(1);
  });

  test("creates root and nested folders", async () => {
    const rootResponse = await POST(
      jsonRequest("http://localhost/api/folders", {
        name: "Projects",
      }),
    );
    const rootPayload = await rootResponse.json();

    expect(rootResponse.status).toBe(201);
    expect(rootPayload.folder).toMatchObject({
      name: "Projects",
      parent_folder_id: null,
    });

    const childResponse = await POST(
      jsonRequest("http://localhost/api/folders", {
        name: "InnerScript",
        parent_folder_id: rootPayload.folder.id,
      }),
    );
    const childPayload = await childResponse.json();

    expect(childResponse.status).toBe(201);
    expect(childPayload.folder).toMatchObject({
      name: "InnerScript",
      parent_folder_id: rootPayload.folder.id,
    });
  });

  test("lists and reads folders", async () => {
    const createdResponse = await POST(
      jsonRequest("http://localhost/api/folders", {
        name: "Reading",
      }),
    );
    const { folder } = await createdResponse.json();

    const listResponse = await GET(new NextRequest("http://localhost/api/folders"));
    const listPayload = await listResponse.json();

    expect(listResponse.status).toBe(200);
    expect(listPayload.folders).toEqual([
      expect.objectContaining({
        name: "Journal",
        parent_folder_id: null,
      }),
      expect.objectContaining({
        id: folder.id,
        name: "Reading",
      }),
    ]);

    const readResponse = await GET_FOLDER(
      new NextRequest(`http://localhost/api/folders/${folder.id}`),
      params(folder.id),
    );
    const readPayload = await readResponse.json();

    expect(readResponse.status).toBe(200);
    expect(readPayload.folder).toMatchObject({
      id: folder.id,
      name: "Reading",
    });
  });

  test("rejects empty folder names", async () => {
    const response = await POST(
      jsonRequest("http://localhost/api/folders", {
        name: "   ",
      }),
    );

    expect(response.status).toBe(400);
  });

  test("renames a folder", async () => {
    const createdResponse = await POST(
      jsonRequest("http://localhost/api/folders", {
        name: "Drafts",
      }),
    );
    const { folder } = await createdResponse.json();

    const renamedResponse = await UPDATE_FOLDER(
      jsonRequest(
        `http://localhost/api/folders/${folder.id}`,
        {
          name: "Archive",
        },
        "PUT",
      ),
      params(folder.id),
    );
    const renamedPayload = await renamedResponse.json();

    expect(renamedResponse.status).toBe(200);
    expect(renamedPayload.folder).toMatchObject({
      id: folder.id,
      name: "Archive",
    });

    const badResponse = await UPDATE_FOLDER(
      jsonRequest(`http://localhost/api/folders/${folder.id}`, { name: "   " }, "PUT"),
      params(folder.id),
    );
    expect(badResponse.status).toBe(400);
  });

  test("deletes an empty folder", async () => {
    const createdResponse = await POST(
      jsonRequest("http://localhost/api/folders", {
        name: "Temporary",
      }),
    );
    const { folder } = await createdResponse.json();

    const deletedResponse = await DELETE_FOLDER(
      new NextRequest(`http://localhost/api/folders/${folder.id}`, { method: "DELETE" }),
      params(folder.id),
    );
    expect(deletedResponse.status).toBe(204);

    const missingResponse = await GET_FOLDER(
      new NextRequest(`http://localhost/api/folders/${folder.id}`),
      params(folder.id),
    );
    expect(missingResponse.status).toBe(404);
  });

  test("deletes a folder with child folders and entries", async () => {
    const parentResponse = await POST(jsonRequest("http://localhost/api/folders", { name: "Projects" }));
    const { folder: parentFolder } = await parentResponse.json();
    const childResponse = await POST(
      jsonRequest("http://localhost/api/folders", {
        name: "InnerScript",
        parent_folder_id: parentFolder.id,
      }),
    );
    const { folder: childFolder } = await childResponse.json();

    await CREATE_ENTRY(
      jsonRequest("http://localhost/api/entries", {
        title: "Parent note",
        body: "Belongs to parent.",
        folder_id: parentFolder.id,
      }),
    );
    await CREATE_ENTRY(
      jsonRequest("http://localhost/api/entries", {
        title: "Child note",
        body: "Belongs to child.",
        folder_id: childFolder.id,
      }),
    );

    const deletedResponse = await DELETE_FOLDER(
      new NextRequest(`http://localhost/api/folders/${parentFolder.id}`, { method: "DELETE" }),
      params(parentFolder.id),
    );

    expect(deletedResponse.status).toBe(204);

    const parentMissingResponse = await GET_FOLDER(
      new NextRequest(`http://localhost/api/folders/${parentFolder.id}`),
      params(parentFolder.id),
    );
    const childMissingResponse = await GET_FOLDER(
      new NextRequest(`http://localhost/api/folders/${childFolder.id}`),
      params(childFolder.id),
    );
    const entriesResponse = await LIST_ENTRIES(new NextRequest("http://localhost/api/entries"));
    const entriesPayload = await entriesResponse.json();

    expect(parentMissingResponse.status).toBe(404);
    expect(childMissingResponse.status).toBe(404);
    expect(entriesPayload.entries).toEqual([]);
  });
});
