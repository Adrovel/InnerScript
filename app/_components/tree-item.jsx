'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronRight, Pencil, Trash2 } from 'lucide-react'
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { ResuableContextMenu } from './resuable-context-menu'
import { useFileContext } from './files-context'

function getStorageKey(id) { return `tree-open-${id}` }

export function TreeItem({ item, onSelectNote, selectedNoteId, depth = 0 }) {
  const router = useRouter()
  const { setSelectedNoteId } = useFileContext()

  const isFolder = item.type === 'folder'
  const hasChildren = item.children && item.children.length > 0
  const isSelected = !isFolder && selectedNoteId === item.id

  const [isOpen, setIsOpen] = useState(() => {
    if (!isFolder || typeof window === 'undefined') return false
    return localStorage.getItem(getStorageKey(item.id)) === 'true'
  })
  const [renaming, setRenaming] = useState(false)
  const [renameValue, setRenameValue] = useState(item.name || item.title || '')
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [hovered, setHovered] = useState(false)
  const renameInputRef = useRef(null)

  useEffect(() => {
    if (renaming) renameInputRef.current?.focus()
  }, [renaming])

  const toggleOpen = useCallback((v) => {
    setIsOpen(v)
    if (isFolder) localStorage.setItem(getStorageKey(item.id), String(v))
  }, [isFolder, item.id])

  const commitRename = useCallback(async () => {
    const trimmed = renameValue.trim()
    if (!trimmed) { setRenaming(false); return }
    const rawId = item.id.replace('note-', '').replace('folder-', '')
    const endpoint = isFolder ? `/api/folders/${rawId}` : `/api/notes/${rawId}`
    const body = isFolder ? { name: trimmed } : { title: trimmed }
    await fetch(endpoint, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).catch(() => {})
    setRenaming(false)
    router.refresh()
  }, [renameValue, item.id, isFolder, router])

  const confirmDelete = useCallback(async () => {
    const rawId = item.id.replace('note-', '').replace('folder-', '')
    const endpoint = isFolder ? `/api/folders/${rawId}` : `/api/notes/${rawId}`
    await fetch(endpoint, { method: 'DELETE' }).catch(() => {})
    if (!isFolder && selectedNoteId === item.id) setSelectedNoteId(null)
    router.refresh()
  }, [item.id, isFolder, selectedNoteId, setSelectedNoteId, router])

  const handleContextMenuAction = useCallback((action) => {
    if (action === 'rename') { setRenameValue(item.name || item.title || ''); setRenaming(true) }
    if (action === 'delete') setDeleteOpen(true)
  }, [item.name, item.title])

  const paddingLeft = `${depth * 16 + 8}px`
  const MenuItem = depth === 0 ? SidebarMenuItem : SidebarMenuSubItem
  const MenuButton = depth === 0 ? SidebarMenuButton : SidebarMenuSubButton

  const actionButtons = (
    <div className={`flex items-center gap-0.5 shrink-0 transition-opacity ${hovered ? 'opacity-100' : 'opacity-0'}`}>
      <button
        onClick={(e) => { e.stopPropagation(); setRenameValue(item.name || item.title || ''); setRenaming(true) }}
        title="Rename"
        className="p-1 rounded hover:bg-sidebar-accent text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors"
      >
        <Pencil size={11} />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); setDeleteOpen(true) }}
        title="Delete"
        className="p-1 rounded hover:bg-destructive/20 text-sidebar-foreground/50 hover:text-destructive transition-colors"
      >
        <Trash2 size={11} />
      </button>
    </div>
  )

  const labelContent = renaming ? (
    <input
      ref={renameInputRef}
      value={renameValue}
      onChange={e => setRenameValue(e.target.value)}
      onBlur={commitRename}
      onKeyDown={e => {
        if (e.key === 'Enter') { e.preventDefault(); commitRename() }
        if (e.key === 'Escape') { e.stopPropagation(); setRenaming(false) }
      }}
      onClick={e => e.stopPropagation()}
      className="flex-1 bg-sidebar-accent text-sidebar-foreground text-xs px-1 py-0 rounded outline-none border border-sidebar-ring min-w-0"
    />
  ) : (
    <span className="font-sans flex-1 text-left truncate text-xs">
      {item.name || item.title}
    </span>
  )

  if (isFolder) {
    return (
      <>
        <Collapsible open={isOpen} onOpenChange={toggleOpen}>
          <MenuItem>
            <ResuableContextMenu menuType="folder" onAction={handleContextMenuAction}>
              <CollapsibleTrigger asChild>
                <MenuButton
                  isActive={false}
                  className="rounded-sm pr-1"
                  style={{ paddingLeft }}
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                >
                  {labelContent}
                  {!renaming && actionButtons}
                  <ChevronRight className={`h-3 w-3 shrink-0 transition-transform duration-200 ml-1 ${isOpen ? 'rotate-90' : ''}`} />
                </MenuButton>
              </CollapsibleTrigger>
            </ResuableContextMenu>
          </MenuItem>
          {hasChildren && (
            <CollapsibleContent>
              <SidebarMenuSub className="m-0 p-0">
                {item.children.map(child => (
                  <TreeItem
                    key={child.id}
                    item={child}
                    onSelectNote={onSelectNote}
                    selectedNoteId={selectedNoteId}
                    depth={depth + 1}
                  />
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          )}
        </Collapsible>

        <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete folder?</AlertDialogTitle>
              <AlertDialogDescription>
                "{item.name}" and all its contents will be permanently deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90 text-white">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    )
  }

  return (
    <>
      <MenuItem>
        <ResuableContextMenu menuType="note" onAction={handleContextMenuAction}>
          <MenuButton
            onClick={() => !renaming && onSelectNote(item.id)}
            isActive={isSelected}
            className="rounded-sm pr-1"
            style={{ paddingLeft }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {labelContent}
            {!renaming && actionButtons}
          </MenuButton>
        </ResuableContextMenu>
      </MenuItem>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete note?</AlertDialogTitle>
            <AlertDialogDescription>
              "{item.name || item.title}" will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
