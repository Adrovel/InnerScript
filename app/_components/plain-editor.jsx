'use client'

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { useSelectedNoteContext } from "./files-context"

export function PlainEditor() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const selectedNoteId = useSelectedNoteContext()[0]

  // Fetch note data using TanStack Query
  const { data: noteData, isLoading, error } = useQuery({
    queryKey: ['note', selectedNoteId],
    queryFn: async () => {
      if (!selectedNoteId) return null
      
      const response = await fetch(`/api/notes/${selectedNoteId}`)
      if (!response.ok) {
        throw new Error('Failed to load note')
      }
      const data = await response.json()
      return data.note
    },
    enabled: !!selectedNoteId
  })

  // Update editor state when note data changes
  useEffect(() => {
    if (noteData) {
      setTitle(noteData.title || 'Untitled Note')
      setContent(noteData.content || '')
    } else if (error) {
      setTitle('Untitled Note')
      setContent('')
    }
  }, [noteData, error])

  return (
    <div className="flex flex-col h-full bg-background">
      {isLoading && (
        <div className="flex items-center justify-center h-32">
          <div className="text-sm text-muted-foreground">Loading note...</div>
        </div>
      )}
      
      {error && (
        <div className="flex items-center justify-center h-32">
          <div className="text-sm text-destructive">Error loading note: {error.message}</div>
        </div>
      )}
      
      {!isLoading && !error && (
        <>
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
        </>
      )}
    </div>
  )
}
