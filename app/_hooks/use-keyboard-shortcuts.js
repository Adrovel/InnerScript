'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSidebar } from '@/components/ui/sidebar'

export function useKeyboardShortcuts({ cycleRail, setSelectedNoteId, openRailTab }) {
  const router = useRouter()
  const { toggleSidebar } = useSidebar()

  useEffect(() => {
    const handler = async (e) => {
      const mod = e.metaKey || e.ctrlKey

      // Cmd+K handled in CommandPalette directly
      if (!mod) return

      // Cmd+N — new note
      if (e.key === 'n' && !e.shiftKey) {
        e.preventDefault()
        const res = await fetch('/api/notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: 'Untitled Note', content: '' }),
        })
        const { note } = await res.json()
        router.refresh()
        setSelectedNoteId(`note-${note.id}`)
      }

      // Cmd+Shift+N — new folder
      if (e.key === 'N' && e.shiftKey) {
        e.preventDefault()
        await fetch('/api/folders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: 'New Folder' }),
        })
        router.refresh()
      }

      // Cmd+\ — toggle sidebar
      if (e.key === '\\') {
        e.preventDefault()
        toggleSidebar()
      }

      // Cmd+J — cycle right rail (analysis → chat → hidden → analysis)
      if (e.key === 'j') {
        e.preventDefault()
        cycleRail()
      }
    }

    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [router, cycleRail, setSelectedNoteId, openRailTab, toggleSidebar])
}
