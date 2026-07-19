import "server-only";

import { desc, eq } from "drizzle-orm";
import { getDb } from "../db/client.js";
import { notes } from "../db/schema.js";
import {
  createNoteInputSchema,
  idSchema,
  updateNoteInputSchema,
} from "./contracts.js";

function serializeNote(note) {
  return {
    id: note.id,
    title: note.title,
    body: note.body,
    created_at: note.createdAt.toISOString(),
    updated_at: note.updatedAt.toISOString(),
  };
}

export async function listNotes() {
  const rows = await getDb()
    .select()
    .from(notes)
    .orderBy(desc(notes.createdAt));

  return rows.map(serializeNote);
}

export async function getNote(id) {
  const noteId = idSchema.parse(id);
  const [row] = await getDb().select().from(notes).where(eq(notes.id, noteId)).limit(1);

  return row ? serializeNote(row) : null;
}

export async function createNote(input) {
  const parsed = createNoteInputSchema.parse(input);
  const now = new Date();
  const [row] = await getDb()
    .insert(notes)
    .values({
      title: parsed.title ?? null,
      body: parsed.body,
      updatedAt: now,
    })
    .returning();

  return serializeNote(row);
}

export async function updateNote(id, input) {
  const noteId = idSchema.parse(id);
  const parsed = updateNoteInputSchema.parse(input);
  const updates = {
    updatedAt: new Date(),
  };

  if (parsed.title !== undefined) {
    updates.title = parsed.title;
  }

  if (parsed.body !== undefined) {
    updates.body = parsed.body;
  }

  const [row] = await getDb()
    .update(notes)
    .set(updates)
    .where(eq(notes.id, noteId))
    .returning();

  return row ? serializeNote(row) : null;
}

export async function deleteNote(id) {
  const noteId = idSchema.parse(id);
  const [row] = await getDb()
    .delete(notes)
    .where(eq(notes.id, noteId))
    .returning({ id: notes.id });

  return Boolean(row);
}
