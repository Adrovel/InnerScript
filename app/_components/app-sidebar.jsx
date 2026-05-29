'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BarChart2, PenLine, FolderPlus, Search } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar"
import { useFileContext } from "./files-context"
import { TreeItem } from "./tree-item"
import { ResuableContextMenu } from './resuable-context-menu'

export function AppSidebar() {
  const router = useRouter()
  const { sidebarMetadata, selectedNoteId, setSelectedNoteId } = useFileContext()

  const handleSidebarAction = async (action) => {
    if (action === 'newFile') {
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
  }

  return (
    <Sidebar className="border-sidebar-border">
      <SidebarHeader className="px-4 pt-5 pb-3 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-serif font-semibold text-sidebar-foreground tracking-tight">
            InnerScript
          </h2>
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                const e = new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true })
                document.dispatchEvent(e)
              }}
              title="Search (⌘K)"
              className="p-1.5 rounded-md text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            >
              <Search size={13} />
            </button>
            <button
              onClick={() => handleSidebarAction('newFolder')}
              title="New folder (⌘⇧N)"
              className="p-1.5 rounded-md text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            >
              <FolderPlus size={14} />
            </button>
            <button
              onClick={() => handleSidebarAction('newFile')}
              title="New note (⌘N)"
              className="p-1.5 rounded-md text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            >
              <PenLine size={14} />
            </button>
          </div>
        </div>
      </SidebarHeader>

      <ResuableContextMenu
        menuType="sidebarEmpty"
        onAction={handleSidebarAction}
      >
        <SidebarContent className="p-2">
          <SidebarMenu>
            {sidebarMetadata.length === 0 && (
              <div className="flex flex-col items-center gap-3 px-3 py-8 text-center">
                <span className="text-3xl select-none">✦</span>
                <p className="text-xs text-sidebar-foreground/50 leading-relaxed">
                  No notes yet. Start writing.
                </p>
                <button
                  onClick={() => handleSidebarAction('newFile')}
                  className="text-xs px-3 py-1.5 rounded-md bg-sidebar-accent text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/80 transition-colors"
                >
                  + New note
                </button>
              </div>
            )}
            {sidebarMetadata.map(item => (
              <TreeItem
                key={item.id}
                item={item}
                onSelectNote={setSelectedNoteId}
                selectedNoteId={selectedNoteId}
              />
            ))}
          </SidebarMenu>
        </SidebarContent>
      </ResuableContextMenu>

      <SidebarFooter className="p-2 border-t border-sidebar-border">
        <Link
          href="/Journal/insights"
          className="flex items-center gap-2 text-xs text-sidebar-foreground/50 hover:text-sidebar-foreground px-2 py-2 rounded-md hover:bg-sidebar-accent transition-colors"
        >
          <BarChart2 size={13} />
          Insights
        </Link>
      </SidebarFooter>
    </Sidebar>
  )
}
