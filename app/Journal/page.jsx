'use client'
import React from 'react';
import Sidebar from '../_components/Sidebar';
import MarkdownEditor from '../_components/MarkdownEditor';
import PlainEditor from '../_components/PlainEditor';
import { v4 as uuidv4} from 'uuid'
import { useState } from 'react';
import ChatPanel from '../_components/ChatPanel';

export default function page() {
  const [notes, setNotes] = useState([
    {id: uuidv4(), title:'First Note'},
  ])
  const [selectedNoteId,setSelectedNoteId] = useState(notes[0].id)

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
          // <MarkdownEditor
          //   value={noteContent[selectedNoteId]}
          //   onChange={handleUpdateContent}
          // />
          <PlainEditor
            title={currentNote.title}
            content={noteContent[selectedNoteId]}
            onTitleChange={(newTitle) => {
            setNotes((prev) =>
              prev.map((note) =>
                note.id === selectedNoteId ? { ...note, title: newTitle } : note
              )
            )
          }}
              onContentChange={handleUpdateContent}
            />
        )}
      </main>
      <aside className="w-[300px] border-l p-4 overflow-y-auto">
        <ChatPanel noteContent={noteContent[selectedNoteId]} />
      </aside>
      </div>
    </>
  );
}