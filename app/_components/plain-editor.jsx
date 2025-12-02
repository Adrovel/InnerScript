'use client'

import { useEffect, useMemo, useState, useCallback, useRef } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useSelectedNoteContext } from "./files-context"
import StarterKit from "@tiptap/starter-kit"
import { useEditor, EditorContent } from "@tiptap/react"
import { CheckCircle2, Loader2 } from "lucide-react"
import { MoodTagSelector } from "./mood-tag-selector"

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

async function fetchAllTags() {
  const res = await fetch('/api/tags', { cache: 'force-cache' })
  if (!res.ok) throw new Error('Failed to load tags')
  const { tags } = await res.json()
  return tags
}

const EMPTY_STATE_HTML = '<p class="text-muted-foreground">Select a note from the sidebar to start writing.</p>'

export function PlainEditor() {
  const [selectedNoteId] = useSelectedNoteContext()
  const [title, setTitle] = useState("")
  const [saveStatus, setSaveStatus] = useState('saved') // 'saved' | 'saving' | 'unsaved'
  const [selectedTagIds, setSelectedTagIds] = useState([])
  const debounceTimer = useRef(null)
  const queryClient = useQueryClient()

  // Query for available tags
  const { data: availableTags = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: fetchAllTags,
    staleTime: 1000 * 60 * 60, // 1 hour cache
  })

  const {
    data: note,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['note', selectedNoteId],
    queryFn: () => fetchNoteById(selectedNoteId),
    enabled: Boolean(selectedNoteId),
    refetchOnWindowFocus: false,
  })

  const { mutate: saveNote } = useMutation({
    mutationFn: (data) => updateNote(selectedNoteId, data),
    onMutate: () => setSaveStatus('saving'),
    onSuccess: () => {
      setSaveStatus('saved')
    },
    onError: () => {
      setSaveStatus('unsaved')
    },
  })

  // Mutation for updating tags (immediate save)
  const { mutate: saveTags } = useMutation({
    mutationFn: (tagIds) => updateNote(selectedNoteId, { tag_ids: tagIds }),
    onSuccess: () => {
      // Invalidate the note query to refetch with updated tags
      queryClient.invalidateQueries(['note', selectedNoteId])
    },
  })

  // Debounced save function
  const debouncedSave = useCallback((content, contentJson, noteTitle) => {
    if (!selectedNoteId) return

    setSaveStatus('unsaved')
    if (debounceTimer.current) clearTimeout(debounceTimer.current)

    debounceTimer.current = setTimeout(() => {
      saveNote({
        title: noteTitle,
        content: content,
        content_json: contentJson
      })
    }, 1000) // Save 1 second after user stops typing
  }, [saveNote, selectedNoteId])

  // Handle tag toggle (immediate save)
  const handleTagToggle = useCallback((tagId) => {
    if (!selectedNoteId) return

    setSelectedTagIds((prev) => {
      const isSelected = prev.includes(tagId)
      const newTagIds = isSelected
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]

      // Immediately save tags (no debounce)
      saveTags(newTagIds)

      return newTagIds
    })
  }, [selectedNoteId, saveTags])

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
      // Trigger save whenever content changes
      if (selectedNoteId) {
        debouncedSave(editor.getText(), editor.getJSON(), title)
      }
    },
  })

  useEffect(() => {
    if (!editor) return

    if (!selectedNoteId) {
      editor.setEditable(false)
      editor.commands.setContent(EMPTY_STATE_HTML, false)
      setTitle("Please select a note from the sidebar to start writing.")
      setSelectedTagIds([])
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

      setTitle(note.title || "")

      // Load tags
      if (note.tags) {
        setSelectedTagIds(note.tags.map(t => t.id))
      } else {
        setSelectedTagIds([])
      }
    }

  }, [editor, selectedNoteId, note])

  // Also save when title changes
  useEffect(() => {
    if (selectedNoteId && editor && title) {
      debouncedSave(editor.getText(), editor.getJSON(), title)
    }
  }, [title, editor, selectedNoteId, debouncedSave])

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
      <div className="flex-1 overflow-y-auto" id="editor-container">
        <div className="max-w-4xl mx-auto px-8 py-12 pb-32">
          {selectedNoteId && (
            <>
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2 border-b border-gray-100 pb-4 gap-2 md:gap-0">
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

              {/* Mood Tag Selector */}
              <MoodTagSelector
                availableTags={availableTags}
                selectedTagIds={selectedTagIds}
                onTagToggle={handleTagToggle}
                disabled={!selectedNoteId}
              />
            </>
          )}

          <div className="editor-content min-h-[60vh] outline-none">
            <EditorContent editor={editor} />
          </div>

          <div className="absolute bottom-8 right-8 text-muted-foreground/50 flex items-center gap-2 text-xs select-none pointer-events-none">
            {saveStatus === 'saving' && <Loader2 className="w-4 h-4 animate-spin" />}
            {saveStatus === 'saved' && <CheckCircle2 className="w-4 h-4" />}
            <span>{saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved' : 'Unsaved'}</span>
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
    </main>
  )
}
