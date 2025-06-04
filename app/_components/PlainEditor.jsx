'use client'

import { useEffect, useState } from 'react'

export default function PlainEditor({ noteId }) {
  
  const [localTitle, setLocalTitle] = useState(``)
  const [localContent, setLocalContent] = useState(``)

  // Local state for note data.
  useEffect(() => {
    // For some reason, this is triggered two times on ititial render.
    console.log('🔄 PlainEditor useEffect triggered')
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
