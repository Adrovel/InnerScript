import { NextRequest } from "next/server";
import { describe, expect, test } from "vitest";
import { GET as INSIGHTS } from "../../app/api/insights/route.js";
import { GET as WEEKLY_DIGEST } from "../../app/api/digests/weekly/route.js";
import { POST as CONFIRM_IMPORT } from "../../app/api/imports/confirm/route.js";
import { POST as PREVIEW_IMPORT } from "../../app/api/imports/preview/route.js";
import { DELETE as DELETE_PERSON, GET as GET_PERSON, PUT as UPDATE_PERSON } from "../../app/api/people/[id]/route.js";
import { GET as LIST_PEOPLE, POST as CREATE_PERSON } from "../../app/api/people/route.js";
import { GET as PRIVACY_EXPORT } from "../../app/api/privacy/export/route.js";
import { POST as PRIVACY_DELETE } from "../../app/api/privacy/delete-account/route.js";
import { POST as SEARCH } from "../../app/api/search/route.js";
import { POST as TRANSCRIBE } from "../../app/api/voice/transcribe/route.js";
import { POST as RATE_LIMIT } from "../../app/api/rate-limit/check/route.js";
import { GET as READINESS } from "../../app/api/system/readiness/route.js";

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

describe("product APIs", () => {
  test("previews and confirms Markdown imports with source-backed search", async () => {
    const previewResponse = await PREVIEW_IMPORT(
      jsonRequest("http://localhost/api/imports/preview", {
        kind: "markdown",
        filename: "old-journal.md",
        content: "# Fear\n\nI felt anxious about interviews.\n\n# Focus\n\nWriting made me calmer.",
      }),
    );
    const previewPayload = await previewResponse.json();

    expect(previewResponse.status).toBe(200);
    expect(previewPayload.preview.entries).toHaveLength(2);

    const confirmResponse = await CONFIRM_IMPORT(
      jsonRequest("http://localhost/api/imports/confirm", {
        preview: previewPayload.preview,
      }),
    );
    const confirmPayload = await confirmResponse.json();

    expect(confirmResponse.status).toBe(201);
    expect(confirmPayload.source).toMatchObject({
      source_type: "markdown",
      original_filename: "old-journal.md",
    });

    const searchResponse = await SEARCH(
      jsonRequest("http://localhost/api/search", {
        query: "anxious interviews",
      }),
    );
    const searchPayload = await searchResponse.json();

    expect(searchPayload.results[0].entry.title).toBe("Fear");
  });

  test("manages people manually without auto-created relationship claims", async () => {
    const createResponse = await CREATE_PERSON(
      jsonRequest("http://localhost/api/people", {
        display_name: "Prithvi",
        aliases: ["P"],
        relationship_type: "teammate",
      }),
    );
    const { person } = await createResponse.json();

    expect(createResponse.status).toBe(201);
    expect(person).toMatchObject({
      display_name: "Prithvi",
      aliases: ["P"],
      relationship_type: "teammate",
    });

    const updateResponse = await UPDATE_PERSON(
      jsonRequest(
        `http://localhost/api/people/${person.id}`,
        {
          display_name: "Prithvi",
          aliases: ["P", "Prithvi N"],
          description: "Works on delivery depth.",
          relationship_type: "teammate",
        },
        "PUT",
      ),
      params(person.id),
    );
    const updated = await updateResponse.json();

    expect(updateResponse.status).toBe(200);
    expect(updated.person.aliases).toContain("Prithvi N");

    const listResponse = await LIST_PEOPLE();
    const listPayload = await listResponse.json();
    expect(listPayload.people).toHaveLength(1);

    const getResponse = await GET_PERSON(new NextRequest(`http://localhost/api/people/${person.id}`), params(person.id));
    expect(getResponse.status).toBe(200);

    const deleteResponse = await DELETE_PERSON(
      new NextRequest(`http://localhost/api/people/${person.id}`, { method: "DELETE" }),
      params(person.id),
    );
    expect(deleteResponse.status).toBe(204);
  });

  test("returns local insights and privacy export", async () => {
    await CONFIRM_IMPORT(
      jsonRequest("http://localhost/api/imports/confirm", {
        kind: "text_file",
        filename: "journal.txt",
        content: "I felt anxious but focused. Google prep showed up again.",
      }),
    );
    await CREATE_PERSON(
      jsonRequest("http://localhost/api/people", {
        display_name: "Joel",
      }),
    );

    const insightsResponse = await INSIGHTS();
    const insightsPayload = await insightsResponse.json();
    expect(insightsResponse.status).toBe(200);
    expect(insightsPayload.insights.entry_count).toBe(1);
    expect(insightsPayload.insights.emotions).toEqual(
      expect.arrayContaining([expect.objectContaining({ term: "anxious" })]),
    );

    const privacyResponse = await PRIVACY_EXPORT();
    const privacyPayload = await privacyResponse.json();
    expect(privacyResponse.status).toBe(200);
    expect(privacyPayload.entries).toHaveLength(1);
    expect(privacyPayload.people).toHaveLength(1);
  });

  test("requires an explicit phrase before deleting local data", async () => {
    await CREATE_PERSON(
      jsonRequest("http://localhost/api/people", {
        display_name: "Joel",
      }),
    );

    const blockedResponse = await PRIVACY_DELETE(
      jsonRequest("http://localhost/api/privacy/delete-account", {
        confirmation: "delete",
      }),
    );
    expect(blockedResponse.status).toBe(400);

    const deletedResponse = await PRIVACY_DELETE(
      jsonRequest("http://localhost/api/privacy/delete-account", {
        confirmation: "DELETE INNERSCRIPT DATA",
      }),
    );
    expect(deletedResponse.status).toBe(200);

    const listResponse = await LIST_PEOPLE();
    const listPayload = await listResponse.json();
    expect(listPayload.people).toHaveLength(0);
  });

  test("supports local voice transcript review and weekly digest contracts", async () => {
    const transcriptResponse = await TRANSCRIBE(
      jsonRequest("http://localhost/api/voice/transcribe", {
        transcript_text: "I felt focused after writing this voice note.",
      }),
    );
    const transcriptPayload = await transcriptResponse.json();
    expect(transcriptResponse.status).toBe(200);
    expect(transcriptPayload.transcription).toMatchObject({
      transcript: "I felt focused after writing this voice note.",
      audio_retained: false,
    });

    await CONFIRM_IMPORT(
      jsonRequest("http://localhost/api/imports/confirm", {
        kind: "text_file",
        filename: "voice-note.txt",
        content: transcriptPayload.transcription.transcript,
      }),
    );

    const digestResponse = await WEEKLY_DIGEST();
    const digestPayload = await digestResponse.json();
    expect(digestResponse.status).toBe(200);
    expect(digestPayload.digest.body).toContain("indexed entries");
  });

  test("checks hosted rate-limit algorithms through an API contract", async () => {
    const response = await RATE_LIMIT(
      jsonRequest("http://localhost/api/rate-limit/check", {
        now: 10_000,
        previous_tokens: 0,
        previous_refill_at: 10_000,
        refill_per_second: 1,
        capacity: 10,
        timestamps: [9_500, 9_700],
        window_ms: 1_000,
        limit: 2,
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.token_bucket.allowed).toBe(false);
    expect(payload.sliding_window.allowed).toBe(false);
  });

  test("reports readiness actions for remaining deployment configuration", async () => {
    const response = await READINESS();
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.readiness).toHaveProperty("ready_for_local_use");
    expect(payload.readiness.actions_for_joel).toBeInstanceOf(Array);
  });
});
