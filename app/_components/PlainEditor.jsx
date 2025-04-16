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

   // Sync props → local state when switching notes
   
   useEffect(() => {
     const timeout = setTimeout(() => {
       if (noteId) {
         fetch('/api/notes', {
           method: 'PUT',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ id: noteId, title: localTitle, content: localContent }),
          })
        }
      }, 1000)
      
      return () => clearTimeout(timeout)
    }, [localTitle, localContent, noteId])
    
    useEffect(() => {
     setLocalTitle(title)
     setLocalContent(content)
   }, [title, content, noteId])
 
  
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
