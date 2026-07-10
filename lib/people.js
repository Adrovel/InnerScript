import "server-only";

import { eq } from "drizzle-orm";
import { getDb } from "../db/client.js";
import { people } from "../db/schema.js";

function serializePerson(person) {
  return {
    id: person.id,
    display_name: person.displayName,
    aliases: person.aliases,
    description: person.description,
    relationship_type: person.relationshipType,
    created_at: person.createdAt.toISOString(),
    updated_at: person.updatedAt.toISOString(),
  };
}

function personValues(input) {
  const displayName = input.display_name?.trim();

  if (!displayName) {
    throw new SyntaxError("display_name is required");
  }

  return {
    displayName,
    aliases: Array.isArray(input.aliases) ? input.aliases : [],
    description: input.description?.trim() || null,
    relationshipType: input.relationship_type?.trim() || null,
    updatedAt: new Date(),
  };
}

export async function listPeople() {
  const rows = await getDb().select().from(people);
  return rows.map(serializePerson);
}

export async function createPerson(input) {
  const [row] = await getDb().insert(people).values(personValues(input)).returning();
  return serializePerson(row);
}

export async function getPerson(id) {
  const [row] = await getDb().select().from(people).where(eq(people.id, id)).limit(1);
  return row ? serializePerson(row) : null;
}

export async function updatePerson(id, input) {
  const [row] = await getDb()
    .update(people)
    .set(personValues(input))
    .where(eq(people.id, id))
    .returning();

  return row ? serializePerson(row) : null;
}

export async function deletePerson(id) {
  const [row] = await getDb().delete(people).where(eq(people.id, id)).returning({ id: people.id });
  return Boolean(row);
}
