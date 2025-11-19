'use client'

import { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { useSelectedNoteContext } from "./files-context"
import StarterKit from "@tiptap/starter-kit"
import { useEditor, EditorContent } from "@tiptap/react"

async function fetchNoteById(noteId) {
  const res = await fetch(`/api/notes/${noteId}`, { cache: 'no-store' })
  if (!res.ok) {
    throw new Error('Unable to load the selected note')
  }
  const { note } = await res.json()
  return note
}

const EMPTY_STATE_HTML = '<p class="text-muted-foreground">Select a note from the sidebar to start writing.</p>'

export function PlainEditor() {
  const [selectedNoteId] = useSelectedNoteContext()

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

  const editor = useEditor({
    extensions: [StarterKit],
    content: EMPTY_STATE_HTML,
    autofocus: 'start',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-neutral dark:prose-invert max-w-none flex-1 w-full min-h-full px-8 py-10 focus:outline-none',
      },
    },
  })

  useEffect(() => {
    if (!editor) return

    if (!selectedNoteId) {
      editor.setEditable(false)
      editor.commands.setContent(EMPTY_STATE_HTML, false)
      return
    }

    editor.setEditable(true)
    editor.commands.setContent(note?.content || '<p></p>', false)
  }, [editor, selectedNoteId, note])

  return (
    <section className="flex flex-1 min-h-screen w-full bg-background">
      <div className="relative flex flex-1">
        <EditorContent editor={editor} className="flex flex-1" />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 text-sm text-muted-foreground">
            Loading note…
          </div>
        )}
        {isError && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 text-sm text-destructive">
            {error?.message ?? 'Unable to load note'}
          </div>
        )}
      </div>
    </section>
  )
}