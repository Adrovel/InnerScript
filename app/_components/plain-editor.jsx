'use client'

import { useState } from "react"

// Need to implement:
// Use debounced save -> server + instant save -> cookies.

export default function PlainEditor() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
 
  return (
    <div className="flex flex-col h-full bg-background">
      <input
        type="text"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value)
          console.log('Title Changed')
        }}
        placeholder="Untitled Note"
        className="text-4xl font-semibold py-3 outline-none bg-background px-12"
      />
      <textarea
        value={content}
        onChange={(e) => {
          setContent(e.target.value)
          console.log('Content Changed')
        }}
        placeholder="Start writing..."
        className="flex-1 w-full resize-none px-12 py-4 rounded-md text-lg outline-none font-sans bg-transparent h-full"
      />
    </div>
  )
}
