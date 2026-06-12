import { NextRequest } from "next/server";
import { describe, expect, test } from "vitest";
import { GET, POST } from "../../app/api/folders/route.js";
import { GET as GET_FOLDER } from "../../app/api/folders/[id]/route.js";

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
});
