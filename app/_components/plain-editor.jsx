'use client'

import { useEffect, useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useSelectedNoteContext } from "./files-context"
import StarterKit from "@tiptap/starter-kit"
import { useEditor, EditorContent } from "@tiptap/react"
import { CheckCircle2 } from "lucide-react"

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
  const [title, setTitle] = useState("")

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
        class: 'prose prose-lg prose-neutral dark:prose-invert max-w-none flex-1 w-full min-h-full focus:outline-none text-lg leading-8',
      },
    },
  })

  useEffect(() => {
    if (!editor) return

    if (!selectedNoteId) {
      editor.setEditable(false)
      editor.commands.setContent(EMPTY_STATE_HTML, false)
      setTitle("Please select a note from the sidebar to start writing.")
      return
    }

    if (note) {
        editor.setEditable(true)
        if (editor.getHTML() !== note.content) {
             editor.commands.setContent(note.content || '<p></p>', false)
        }
        setTitle(note.title || "")
    }

  }, [editor, selectedNoteId, note])

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
            <div className="max-w-3xl mx-auto px-8 py-12 pb-32">
                 {selectedNoteId && (
                    <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-8 border-b border-gray-100 pb-4 gap-2 md:gap-0">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Note Title"
                            className="text-4xl text-gray-900 font-bold tracking-tight outline-none bg-transparent w-full placeholder:text-gray-300"
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

                 <div className="absolute bottom-8 right-8 text-muted-foreground/50 flex items-center gap-2 text-xs select-none pointer-events-none">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Saved</span>
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
