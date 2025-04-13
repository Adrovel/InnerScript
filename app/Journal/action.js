import {
  createNote,
  updateNote,
  getNote,
  deleteNote,
  getAllNotes,
} from "@/lib/db/queries";

const createNoteAction = async (formData) => {
  const title = formData.get("title");
  const content = formData.get("content");

  if (!title || !content) {
    return { success: false, message: "Title or content is missing" };
  }
  try {
    await createNote(title, content);
    return { success: true, message: "Note created successfully" };
  } catch (error) {
    console.error("Error creating note:", error);
    return { success: false, message: "Error creating note" };
  }
};

const updateNoteAction = async (formData, params) => {
  const { id } = params;
  const title = formData.get("title");
  const content = formData.get("content");

  if (!title || !content) {
    return { success: false, message: "Title or content is missing" };
  }
  try {
    await updateNote(id, title, content);
    return { success: true, message: "Note updated successfully" };
  } catch (error) {
    console.error("Error updating note:", error);
    return { success: false, message: "Error updating note" };
  }
};

const getNoteAction = async (req, res) => {
  const { id } = req.params;
  const note = await getNote(id);
  res.status(200).json(note);
};

const deleteNoteAction = async (req, res) => {
  const { id } = req.params;
  await deleteNote(id);
  res.status(204).end();
};

const getAllNotesAction = async (req, res) => {
  const notes = await getAllNotes();
  res.status(200).json(notes);
};

export {
  createNoteAction,
  updateNoteAction,
  getNoteAction,
  deleteNoteAction,
  getAllNotesAction,
};
