'use client'

import { useState, useEffect, useRef, useCallback } from "react"
import { useFileContext } from "./files-context"

export default function PlainEditor() {
  const { selectedNoteId, setMetadata } = useFileContext()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [saveStatus, setSaveStatus] = useState('idle') // idle | saving | saved | error
  const saveTimer = useRef(null)
  const currentNoteId = useRef(null)

  useEffect(() => {
    if (!selectedNoteId) {
      setTitle('')
      setContent('')
      setMetadata(null)
      return
    }

    const rawId = selectedNoteId.replace('note-', '')
    currentNoteId.current = rawId
    setSaveStatus('idle')

    fetch(`/api/notes/${rawId}`)
      .then(r => r.json())
      .then(({ note }) => {
        if (currentNoteId.current !== rawId) return
        setTitle(note.title || '')
        setContent(note.content || '')
        setMetadata(null)
      })
      .catch(() => setSaveStatus('error'))
  }, [selectedNoteId, setMetadata])

  const scheduleSave = useCallback((newTitle, newContent) => {
    if (!currentNoteId.current) return
    clearTimeout(saveTimer.current)
    setSaveStatus('saving')
    saveTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/notes/${currentNoteId.current}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: newTitle, content: newContent }),
        })
        if (!res.ok) throw new Error('Save failed')
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus('idle'), 2000)

        fetch(`/api/notes/${currentNoteId.current}/analyse`, { method: 'POST' })
          .then(r => r.json())
          .then(data => { if (data.metadata) setMetadata(data.metadata) })
          .catch(() => {})
      } catch {
        setSaveStatus('error')
      }
    }, 2000)
  }, [setMetadata])

  const handleTitleChange = (e) => {
    setTitle(e.target.value)
    scheduleSave(e.target.value, content)
  }

  const handleContentChange = (e) => {
    setContent(e.target.value)
    scheduleSave(title, e.target.value)
  }

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0

  if (!selectedNoteId) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground select-none">
        <span className="text-4xl">✦</span>
        <p className="text-sm">Select a note or create a new one</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-background relative">
      {/* Save status */}
      <div className="absolute top-4 right-6 flex items-center gap-2 text-xs text-muted-foreground select-none z-10">
        {saveStatus === 'saving' && (
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-amber-400 animate-pulse" />
            Saving…
          </span>
        )}
        {saveStatus === 'saved' && (
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Saved
          </span>
        )}
        {saveStatus === 'error' && (
          <span className="text-destructive">Save failed</span>
        )}
      </div>

      <div className="flex-1 flex flex-col max-w-2xl w-full mx-auto px-6 pt-16 pb-12">
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Untitled"
          className="text-3xl font-serif font-semibold mb-6 outline-none bg-transparent placeholder:text-muted-foreground/40 tracking-tight"
        />
        <textarea
          value={content}
          onChange={handleContentChange}
          placeholder="Start writing…"
          className="flex-1 w-full resize-none outline-none font-sans bg-transparent text-base leading-7 placeholder:text-muted-foreground/40"
        />
      </div>

      {/* Footer word count */}
      <div className="absolute bottom-4 right-6 text-xs text-muted-foreground/60 select-none tabular-nums">
        {wordCount > 0 && `${wordCount} words`}
      </div>
    </div>
  )
}
