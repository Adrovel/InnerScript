'use client'

import { useEffect, useState } from 'react'

const noteUpdate = async (noteId, name, content) => {
  try {
    const id = noteId.split('_')[1]
    const res = await fetch(`/api/notes/${id}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ name: name, content: content})
    })

    if (!res.ok) throw new Error('Failed to update note')
    console.log('Note updated successfully')
  }
  catch (err) {
    console.error('Error updating note:', err)
  }
}

export default function PlainEditor({ noteId }) {
  const [localTitle, setLocalTitle] = useState('')
  const [localContent, setLocalContent] = useState('')
  const [counter, setCounter] = useState(0)
  
  useEffect(() => {
    const fetchNoteData = async () => {
      try {
        const id = noteId.split('_')[1]
        const res = await fetch(`/api/notes/${id}`)
        const data = await res.json()
        setLocalTitle(data.note.name)
        setLocalContent(data.note.content)
      } 
      catch (err) {
        console.error('Error fetching note data:', err)
      }
    }
    fetchNoteData()
  }, [noteId])

  const onTitleChange = async (newTitle) => {
    await noteUpdate(noteId, newTitle, localContent)
    setCounter(prev => prev + 1)
    console.log(counter)
  }

  const onContentChange = async (newContent) => {
    await noteUpdate(noteId, localTitle, newContent)
    setCounter(prev => prev + 1)
    console.log(counter)
  }
  
  return (
    <div className="flex flex-col h-full ">
      <input
        type="text"
        value={localTitle}
        onChange={(e) => {
          setLocalTitle(e.target.value)
          onTitleChange(e.target.value)
        }}
        placeholder="Untitled Note"
        className="text-4xl font-semibold p-3 outline-none bg-[#f8fafc] text-center"
      />
      <textarea
        value={localContent}
        onChange={(e) => {
          setLocalContent(e.target.value)
          onContentChange(e.target.value)
        }}
        placeholder="Start writing..."
        className="flex-1 w-full resize-none px-12 py-4 rounded-md text-lg outline-none font-sans bg-transparent"
      />
    </div>
  )
}
