'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BarChart2, PenLine, FolderPlus } from 'lucide-react'
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
              onClick={() => handleSidebarAction('newFolder')}
              title="New folder"
              className="p-1.5 rounded-md text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            >
              <FolderPlus size={14} />
            </button>
            <button
              onClick={() => handleSidebarAction('newFile')}
              title="New note"
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
              <p className="text-xs text-sidebar-foreground/40 px-2 py-3 leading-relaxed">
                Right-click to create a note or folder.
              </p>
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
