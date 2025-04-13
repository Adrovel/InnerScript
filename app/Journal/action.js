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

  if (!title) {
    return { success: false, message: "Title is missing", note: None };
  }
  try {
    const note = await createNote(title, content);
    return { success: true, message: "Note created successfully", note: note };
  } catch (error) {
    console.error("Error creating note:", error);
    return { success: false, message: "Error creating note", note: None };
  }
};

const updateNoteAction = async (formData, params) => {
  const { id } = params;
  const title = formData.get("title");
  const content = formData.get("content");

  if (!title) {
    return { success: false, message: "Title cannot be blank", note: None };
  }
  try {
    const note = await updateNote(id, title, content);
    return { success: true, message: "Note updated successfully", note: note };
  } catch (error) {
    console.error("Error updating note:", error);
    return { success: false, message: "Error updating note", note: None };
  }
};

const getNoteAction = async (params) => {
  const { id } = params;
  try {
    const note = await getNote(id);
    return { success: false, message: "Note is creted", note: note };
  } catch (error) {
    console.error("Couldn't find the note with id:", id);
    return { success: false, message: "Note not found", note: None };
  }
};

const deleteNoteAction = async (params) => {
  const { id } = params;
  try {
    await deleteNote(id);
    return { success: true, message: "Note deleted.", note: None };
  } catch (error) {
    console.error("Error deleting the note.");
    return { success: false, message: "Error deleting the note.", note: None };
  }
};

const getAllNotesAction = async () => {
  try {
    const notes = await getAllNotes();
    return { success: true, message: "Retreived all notes", notes: notes };
  } catch (error) {
    console.error("Error with retrieving notes.");
    return {
      success: false,
      message: "Error with retrieving notes.",
      note: None,
    };
  }
};

export {
  createNoteAction,
  updateNoteAction,
  getNoteAction,
  deleteNoteAction,
  getAllNotesAction,
};
