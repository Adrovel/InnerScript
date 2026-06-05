import { NextRequest } from "next/server";
import { describe, expect, test } from "vitest";
import { POST as CREATE_ENTRY } from "../../app/api/entries/route.js";
import { POST as CREATE_REFLECTION } from "../../app/api/reflection-question/route.js";

function jsonRequest(url, body) {
  return new NextRequest(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

describe("reflection question API", () => {
  test("creates one reflection question for the selected current entry", async () => {
    const createdResponse = await CREATE_ENTRY(
      jsonRequest("http://localhost/api/entries", {
        title: "Current entry",
        body: "I keep circling the same decision about what to build next, and today I noticed I want more signal than comfort.",
      }),
    );
    const { entry } = await createdResponse.json();

    const response = await CREATE_REFLECTION(
      jsonRequest("http://localhost/api/reflection-question", {
        entry_id: entry.id,
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.reflection).toMatchObject({
      entry_id: entry.id,
      source: "local_fallback",
      ai_available: false,
    });
    expect(payload.reflection.question).toMatch(/\?$/);
  });

  test("rejects missing entries", async () => {
    const response = await CREATE_REFLECTION(
      jsonRequest("http://localhost/api/reflection-question", {
        entry_id: "734ac035-a77d-4da9-b8ca-5d9aeb699253",
      }),
    );

    expect(response.status).toBe(404);
  });

  test("rejects empty current entries without making a broad claim", async () => {
    const createdResponse = await CREATE_ENTRY(
      jsonRequest("http://localhost/api/entries", {
        title: "Empty",
        body: "",
      }),
    );
    const { entry } = await createdResponse.json();

    const response = await CREATE_REFLECTION(
      jsonRequest("http://localhost/api/reflection-question", {
        entry_id: entry.id,
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(422);
    expect(payload.error).toBe("The current entry is empty.");
  });
});
