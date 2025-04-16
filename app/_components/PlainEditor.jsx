'use client'
import { useEffect, useState } from 'react'

export default function PlainEditor({
  noteId,
  title,
  content, 
  onTitleChange, 
  onContentChange 
}) {
  
  const [localTitle, setLocalTitle] = useState(title)
  const [localContent, setLocalContent] = useState(content)

  const saveNoteToDB = async (id, title, content) => {
    await fetch('/api/notes', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, title, content }),
    })
  }
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (noteId) {
        saveNoteToDB(noteId, localTitle, localContent)
      }
    }, 1000) // Save 1s after the user stops typing

    return () => clearTimeout(timeout)
  }, [localTitle, localContent, noteId])


 
  
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
