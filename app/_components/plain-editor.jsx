'use client'

import { useEffect, useMemo, useState, useCallback, useRef } from "react"
import { useQuery, useMutation } from "@tanstack/react-query"
import { useActiveTabContext, useOpenTabsContext } from "./files-context"
import StarterKit from "@tiptap/starter-kit"
import { useEditor, EditorContent } from "@tiptap/react"
import { CheckCircle2, Loader2 } from "lucide-react"

async function fetchNoteById(noteId) {
  const res = await fetch(`/api/notes/${noteId}`, { cache: 'no-store' })
  if (!res.ok) {
    throw new Error('Unable to load the selected note')
  }
  const { note } = await res.json()
  return note
}

async function updateNote(noteId, data) {
  const res = await fetch(`/api/notes/${noteId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    throw new Error('Failed to save note')
  }
  return res.json()
}

const EMPTY_STATE_HTML = '<p class="text-muted-foreground">Select a note from the sidebar to start writing.</p>'

export function PlainEditor() {
  const [activeTabId] = useActiveTabContext()
  const { updateTabTitle } = useOpenTabsContext()
  const [title, setTitle] = useState("")
  const [saveStatus, setSaveStatus] = useState('saved') // 'saved' | 'saving' | 'unsaved'
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const debounceTimer = useRef(null)
  const prevActiveTabId = useRef(activeTabId)

  const {
    data: note,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['note', activeTabId],
    queryFn: () => fetchNoteById(activeTabId),
    enabled: Boolean(activeTabId),
    refetchOnWindowFocus: false,
  })

  const { mutate: saveNote } = useMutation({
    mutationFn: ({ noteId, data }) => updateNote(noteId, data),
    onMutate: () => setSaveStatus('saving'),
    onSuccess: () => {
      setSaveStatus('saved')
    },
    onError: () => {
      setSaveStatus('unsaved')
    },
  })

  // Debounced save function
  const debouncedSave = useCallback((content, contentJson, noteTitle) => {
    // Capture activeTabId at the time debouncedSave is called
    const currentTabId = activeTabId
    if (!currentTabId) return
    
    setSaveStatus('unsaved')
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    
    debounceTimer.current = setTimeout(() => {
      saveNote({ 
        noteId: currentTabId,
        data: {
          title: noteTitle, 
          content: content,
          content_json: contentJson
        }
      })
    }, 1000) // Save 1 second after user stops typing
  }, [saveNote, activeTabId])

  const editor = useEditor({
    extensions: [StarterKit],
    content: EMPTY_STATE_HTML,
    autofocus: 'start',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-lg prose-neutral dark:prose-invert max-w-none flex-1 w-full min-h-full focus:outline-none text-lg leading-8',
      },
    },
    onUpdate: ({ editor }) => {
      // Update word and character counts
      const text = editor.getText()
      const words = text.trim().split(/\s+/).filter(word => word.length > 0)
      setWordCount(words.length)
      setCharCount(text.length)

      // Trigger save whenever content changes
      if (activeTabId) {
        debouncedSave(editor.getText(), editor.getJSON(), title)
      }
    },
  })

  useEffect(() => {
    if (!editor) return

    if (!activeTabId) {
      editor.setEditable(false)
      editor.commands.setContent(EMPTY_STATE_HTML, false)
      setTitle("Loading...")
      setWordCount(0)
      setCharCount(0)
      return
    }

    if (note) {
      editor.setEditable(true)

      // Prefer loading from content_json if available, otherwise fallback to content
      if (note.content_json) {
        // Load from structured JSON
        const currentJson = editor.getJSON()
        const noteJsonStr = JSON.stringify(note.content_json)
        const currentJsonStr = JSON.stringify(currentJson)

        if (noteJsonStr !== currentJsonStr) {
          editor.commands.setContent(note.content_json, false)
        }
      } else if (note.content) {
        // Fallback: load from plain text content
        // Wrap plain text in a paragraph for TipTap
        const wrappedContent = `<p>${note.content}</p>`
        if (editor.getHTML() !== wrappedContent) {
          editor.commands.setContent(wrappedContent, false)
        }
      } else {
        // Empty note
        if (editor.getHTML() !== '<p></p>') {
          editor.commands.setContent('<p></p>', false)
        }
      }

      // Update counts after loading content
      const text = editor.getText()
      const words = text.trim().split(/\s+/).filter(word => word.length > 0)
      setWordCount(words.length)
      setCharCount(text.length)

      const noteTitle = note.title || ""
      setTitle(noteTitle)
      // Update tab title when note is loaded
      updateTabTitle(activeTabId, noteTitle)
    }

  }, [editor, activeTabId, note, updateTabTitle])

  // Also save when title changes (only for user edits, not tab switches)
  useEffect(() => {
    // Skip if activeTabId just changed (tab switch) - the note load effect handles that
    if (prevActiveTabId.current !== activeTabId) {
      prevActiveTabId.current = activeTabId
      return
    }
    
    if (activeTabId && editor && title) {
      debouncedSave(editor.getText(), editor.getJSON(), title)
      // Update tab title when user changes title
      updateTabTitle(activeTabId, title)
    }
  }, [title, editor, activeTabId, debouncedSave, updateTabTitle])

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
    }
  }, [])

    const formattedDate = useMemo(() => {
      if (!note?.createdAt) return { dayMonth: '...', year: '....' }
      const date = new Date(note.createdAt)
      return {
        dayMonth: new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long' }).format(date),
        year: date.getFullYear()
      }
    }, [note?.createdAt])


  return (
    <main className="flex-1 flex flex-col h-full bg-white relative shadow-sm z-0 overflow-hidden">
      <div className="flex-1 overflow-y-auto border-b border-l border-border" id="editor-container">
        <div className="max-w-4xl mx-auto px-8 pt-8 h-full">
          {activeTabId && (
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2 pb-4 gap-2 md:gap-0">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note Title"
                className="text-4xl text-gray-900 font-bold tracking-tight outline-none w-full bg-transparent placeholder:text-gray-300 py-2 leading-tight"
                style={{ fontFamily: 'var(--font-playfair_display)' }}
              />
              <div className="shrink-0 md:ml-4 text-left md:text-right">
                <div className="text-sm font-medium text-gray-500">{formattedDate.dayMonth}</div>
                <div className="text-xs text-gray-400">{formattedDate.year}</div>
              </div>
            </div>
          )}

          <div className="editor-content min-h-[60vh] outline-none">
            <EditorContent editor={editor} />
          </div>

          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-20">
              <div className="text-sm text-gray-500">Loading note...</div>
            </div>
          )}

          {isError && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-20">
              <div className="text-sm text-red-500">{error?.message ?? 'Unable to load note'}</div>
            </div>
          )}
        </div>
      </div>

      {activeTabId && (
        <footer className="bg-sidebar px-4 py-2 h-8 flex items-center">
          <div className="max-w mx-auto w-full flex items-center justify-end text-xs text-gray-500 gap-4">
            <span className="flex items-center gap-1.5">
              <span className="font-medium">{wordCount}</span>
              <span className="text-gray-400">{wordCount === 1 ? 'word' : 'words'}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="font-medium">{charCount}</span>
              <span className="text-gray-400">{charCount === 1 ? 'character' : 'characters'}</span>
            </span>
            <div className="flex items-center gap-2">
              {saveStatus === 'saving' && <Loader2 className="w-3 h-3 animate-spin text-gray-400" />}
              {saveStatus === 'saved' && <CheckCircle2 className="w-3 h-3 text-green-500" />}
              <span className="text-gray-500">
                {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved' : 'Unsaved'}
              </span>
            </div>
          </div>
        </footer>
      )}
    </main>
  )
}
