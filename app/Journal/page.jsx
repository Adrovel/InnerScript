'use client'

import { useState } from 'react';

import { v4 as uuidv4} from 'uuid'

import Sidebar from '../_components/Sidebar';
import PlainEditor from '../_components/PlainEditor';
import ChatPanel from '../_components/ChatPanel';

export default function page() {

  const [notes, setNotes] = useState([
    {id: uuidv4(), title:'First Note'},
  ])

  const [selectedNoteId, setSelectedNoteId] = useState(notes[0].id)

  const [noteContent, setNoteContent] = useState({ [notes[0].id]: '' })

  const currentNote = notes.find((n) => n.id === selectedNoteId)

   const handleCreateNote = () =>{
    const id = uuidv4()
    const title = `Untitled`

    setNotes((prev) => [...prev, { id, title }])
    setNoteContent((prev) => ({ ...prev, [id]: '' }))
    setSelectedNoteId(id) 
   }

   const handleUpdateContent = (val) => {
    setNoteContent((prev) => ({ ...prev, [selectedNoteId]: val }))
  }
  const handleTitleChange = ( newTitle ) =>{
    setNotes((prev) => prev.map((note) => note.id === selectedNoteId ? {...note, title: newTitle} : note))
  }

  return (
    <>
      <div className= 'flex h-screen'>
        <Sidebar
          notes={notes}
          selectedNoteId={selectedNoteId}
          onSelectNote={setSelectedNoteId}
          onCreateNote={handleCreateNote} />
           <main className="flex-1 p-0 overflow-auto">
           {currentNote && (
              <PlainEditor
                title={currentNote.title}
                content={noteContent[selectedNoteId]}
                onTitleChange={handleTitleChange}
                onContentChange={handleUpdateContent}
                noteId={selectedNoteId}
                />
              )}
           </main>
        <ChatPanel noteContent={noteContent[selectedNoteId]} />
      </div>
    </>
  );
}