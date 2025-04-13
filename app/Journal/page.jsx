'use client'
import React from 'react';
import Sidebar from '../_components/Sidebar';
import MarkdownEditor from '../_components/MarkdownEditor';
import { v4 as uuidv4} from 'uuid'
import { useState } from 'react';

export default function page() {
  const [notes, setNotes] = useState([
    {id: uuidv4(), title:'First Note'},
  ])
  const [selectedNoteId,setSelectedNoteId] = useState(notes[0].id)

  const [noteContent, setNoteContent] = useState({ [notes[0].id]: '' })

  const currentNote = notes.find((n) => n.id === selectedNoteId)

   const handleCreateNote = () =>{
    const id = uuidv4()
    const title = `Untitled ${notes.length + 1}`
    setNotes((prev) => [...prev, { id, title }])
    setNoteContent((prev) => ({ ...prev, [id]: '' }))

    setSelectedNoteId(id)
    
   }

   const handleUpdateContent = (val) => {
    setNoteContent((prev) => ({ ...prev, [selectedNoteId]: val }))
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
          <MarkdownEditor
            value={noteContent[selectedNoteId]}
            onChange={handleUpdateContent}
          />
        )}
      </main>
      </div>
    </>
  );
}