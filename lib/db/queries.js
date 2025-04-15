import { db } from ".";

async function createNote(title, content) {
  const note = await db.File.create({ title: title, content: content });
  return note.toJSON();
}

async function updateNote(id, title, content) {
  const response = await db.File.update(
    { id: id },
    { title: title, content: content },
  );
  return response;
}

async function getNote(id) {
  const note = await db.File.findByPk(id);
  return note.toJSON();
}

async function deleteNote(id) {
  const response = await db.File.destroy({ where: { id: id } });
  return response;
}

async function getAllNotes() {
  const data = await db.File.findAll();
  return !data ? [] : data.map((note) => note.toJSON());
}

export { createNote, updateNote, getNote, deleteNote, getAllNotes };
