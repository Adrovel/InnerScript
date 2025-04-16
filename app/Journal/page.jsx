'use client'

import { useState, useEffect } from 'react';

import { v4 as uuidv4} from 'uuid'

import Sidebar from '../_components/Sidebar';
import PlainEditor from '../_components/PlainEditor';
import ChatPanel from '../_components/ChatPanel';

export default function Page() {

  const [notes, setNotes] = useState([])
  const [selectedNoteId, setSelectedNoteId] = useState([])
  const [noteContent, setNoteContent] = useState({})
  
  const currentNote = notes.find((n) => n.id === selectedNoteId)

  useEffect(() => {
    const fetchNotes = async () => {
      const res = await fetch('/api/notes')
      const data = await res.json()

      setNotes(data)

      if (data.length > 0) {
        setSelectedNoteId(data[0].id)
        setNoteContent(data.reduce((acc, note) => {
          acc[note.id] = note.content || ''
          return acc
        }, {}))
      }
    }
    fetchNotes()
  }, [])




  const handleCreateNote = async () =>{
    const id = uuidv4()
    const title = `Untitled`
    const content = ''

    const newNote = { id, title, content: '' }

    setNotes((prev) => [...prev, newNote])
    setNoteContent((prev) => ({ ...prev, [id]: '' }))
    setSelectedNoteId(id) 

    await fetch('/api/notes', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newNote),
    })
   }

   const handleUpdateContent = async (val) => {
    setNoteContent((prev) => ({ ...prev, [selectedNoteId]: val }))
    const updatedNote = notes.find((note) => note.id === selectedNoteId)
    if (!updatedNote) return

    await fetch('/api/notes', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: selectedNoteId,
        title: updatedNote.title,
        content: val,
      }),
    })
  }

   

    const handleTitleChange = async ( newTitle ) =>{
     setNotes((prev) => 
        prev.map((note) => 
         note.id === selectedNoteId ? {...note, title: newTitle} : note
        ))
        await fetch('/api/notes', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: selectedNoteId,
            title: newTitle,
            content: noteContent[selectedNoteId],
          }),
        })
        
      }

  return (
    <>
      <div className= 'flex h-screen'>
        <Sidebar
          notes={notes}
          selectedNoteId={selectedNoteId}
          onSelectNote={setSelectedNoteId}
          onCreateNote={handleCreateNote}
        />
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