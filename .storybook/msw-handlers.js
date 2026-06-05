import { http, HttpResponse } from "msw";

const now = "2026-06-05T12:00:00.000Z";

let entries = [
  {
    id: "entry-journal-1",
    title: "Friday reflection",
    body: "I noticed the same loop again: wanting clarity, then avoiding the quiet work that would create it.",
    entry_type: "journal",
    occurred_at: now,
    created_at: now,
    updated_at: now,
  },
  {
    id: "entry-note-1",
    title: "Therapy question",
    body: "What evidence would make this fear smaller?",
    entry_type: "note",
    occurred_at: "2026-06-04T18:30:00.000Z",
    created_at: "2026-06-04T18:30:00.000Z",
    updated_at: "2026-06-04T18:30:00.000Z",
  },
];

function nextEntry(payload) {
  const timestamp = new Date().toISOString();

  return {
    id: `entry-${entries.length + 1}`,
    title: payload.title ?? "",
    body: payload.body ?? "",
    entry_type: payload.entry_type ?? "journal",
    occurred_at: payload.occurred_at ?? timestamp,
    created_at: timestamp,
    updated_at: timestamp,
  };
}

export const mswHandlers = {
  entries: [
    http.get("/api/entries", () => HttpResponse.json({ entries })),
    http.post("/api/entries", async ({ request }) => {
      const payload = await request.json();
      const entry = nextEntry(payload);
      entries = [entry, ...entries];

      return HttpResponse.json({ entry }, { status: 201 });
    }),
    http.put("/api/entries/:id", async ({ params, request }) => {
      const payload = await request.json();
      const id = String(params.id);
      const existing = entries.find((entry) => entry.id === id);

      if (!existing) {
        return HttpResponse.json({ error: "Entry not found" }, { status: 404 });
      }

      const entry = {
        ...existing,
        ...payload,
        updated_at: new Date().toISOString(),
      };

      entries = entries.map((current) => (current.id === id ? entry : current));

      return HttpResponse.json({ entry });
    }),
  ],
};
