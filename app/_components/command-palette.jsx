'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useFileContext } from './files-context'
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from '@/components/ui/command'
import { FileText, FolderPlus, PenLine, BarChart2, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

function flattenFiles(items) {
  const files = []
  items.forEach(item => {
    if (item.type === 'note') files.push(item)
    else if (item.children) files.push(...flattenFiles(item.children))
  })
  return files
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const searchDebounce = useRef(null)

  const router = useRouter()
  const { sidebarMetadata, setSelectedNoteId, openRailTab, cycleRail, setRailOpen } = useFileContext()
  const allNotes = flattenFiles(sidebarMetadata || [])

  // Cmd+K to open
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(prev => !prev)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const isCommandMode = query.startsWith('>')
  const searchQuery = isCommandMode ? query.slice(1).trim() : query.trim()

  // Debounced semantic search
  useEffect(() => {
    if (isCommandMode || !searchQuery) {
      setSearchResults([])
      setSearching(false)
      return
    }
    setSearching(true)
    clearTimeout(searchDebounce.current)
    searchDebounce.current = setTimeout(async () => {
      try {
        const res = await fetch('/api/notes/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: searchQuery }),
        })
        const data = await res.json()
        setSearchResults(data.notes || [])
      } catch {
        setSearchResults([])
      } finally {
        setSearching(false)
      }
    }, 300)
    return () => clearTimeout(searchDebounce.current)
  }, [searchQuery, isCommandMode])

  const selectNote = useCallback((id) => {
    setSelectedNoteId(`note-${id}`)
    setOpen(false)
    setQuery('')
  }, [setSelectedNoteId])

  const runCommand = useCallback(async (action) => {
    setOpen(false)
    setQuery('')
    if (action === 'newNote') {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Untitled Note', content: '' }),
      })
      const { note } = await res.json()
      router.refresh()
      setSelectedNoteId(`note-${note.id}`)
    }
    if (action === 'newFolder') {
      await fetch('/api/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'New Folder' }),
      })
      router.refresh()
    }
    if (action === 'insights') router.push('/Journal/insights')
    if (action === 'toggleRail') cycleRail()
    if (action === 'analysis') openRailTab('analysis')
    if (action === 'chat') openRailTab('chat')
  }, [router, setSelectedNoteId, cycleRail, openRailTab])

  const commands = [
    { key: 'newNote', label: 'New note', icon: PenLine },
    { key: 'newFolder', label: 'New folder', icon: FolderPlus },
    { key: 'insights', label: 'Go to Insights', icon: BarChart2 },
    { key: 'analysis', label: 'Show Analysis panel', icon: FileText },
    { key: 'chat', label: 'Show Chat panel', icon: FileText },
    { key: 'toggleRail', label: 'Toggle side panel', icon: FileText },
  ].filter(c => !searchQuery || c.label.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <CommandDialog
      open={open}
      onOpenChange={(v) => { setOpen(v); if (!v) setQuery('') }}
    >
      <CommandInput
        placeholder={isCommandMode ? 'Type a command…' : 'Search notes… (type > for commands)'}
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {!isCommandMode && (
          <>
            {searching && (
              <div className="flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground">
                <Loader2 size={13} className="animate-spin" />
                Searching…
              </div>
            )}
            {!searching && searchQuery && searchResults.length === 0 && (
              <CommandEmpty>No notes found.</CommandEmpty>
            )}
            {searchResults.length > 0 && (
              <CommandGroup heading="Search results">
                {searchResults.map(note => (
                  <CommandItem
                    key={note.id}
                    value={`note-${note.id}-${note.title}`}
                    onSelect={() => selectNote(note.id)}
                    className="gap-2"
                  >
                    <FileText size={13} className="text-muted-foreground shrink-0" />
                    <span className="flex-1 truncate">{note.title}</span>
                    {note.similarity > 0 && (
                      <Badge variant="secondary" className="text-[10px] shrink-0">
                        semantic
                      </Badge>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {!searchQuery && allNotes.length > 0 && (
              <CommandGroup heading="All notes">
                {allNotes.map(note => (
                  <CommandItem
                    key={note.id}
                    value={`note-${note.id}-${note.name || note.title}`}
                    onSelect={() => selectNote(note.id.replace('note-', ''))}
                    className="gap-2"
                  >
                    <FileText size={13} className="text-muted-foreground shrink-0" />
                    <span className="truncate">{note.name || note.title}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {!searchQuery && (
              <>
                {allNotes.length > 0 && <CommandSeparator />}
                <CommandGroup heading="Tip">
                  <p className="px-2 py-1.5 text-xs text-muted-foreground">
                    Type <kbd className="px-1 py-0.5 rounded bg-muted text-[10px]">&gt;</kbd> to run commands
                  </p>
                </CommandGroup>
              </>
            )}
          </>
        )}

        {isCommandMode && (
          <>
            {commands.length === 0 && <CommandEmpty>No commands match.</CommandEmpty>}
            {commands.length > 0 && (
              <CommandGroup heading="Commands">
                {commands.map(({ key, label, icon: Icon }) => (
                  <CommandItem
                    key={key}
                    value={`cmd-${key}-${label}`}
                    onSelect={() => runCommand(key)}
                    className="gap-2"
                  >
                    <Icon size={13} className="text-muted-foreground shrink-0" />
                    {label}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </>
        )}
      </CommandList>
    </CommandDialog>
  )
}
