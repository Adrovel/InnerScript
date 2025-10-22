'use client'

import { useState } from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar"
import { useFileContext } from "./FilesContext"
import { TreeItem } from "./tree-item"
import { ResuableContextMenu } from './resuable-context-menu'

export function AppSidebar() {
  const { sidebarMetadata, setSelectedNoteId } = useFileContext()
  const [expandedIds, setExpandedIds] = useState(new Set())

  const handleSidebarAction = (action) => {
    switch (action) {
      case 'newFile':
        console.log('New File action triggered')
        break
      case 'newFolder':
        console.log('New Folder action triggered')
        break
    }
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <h2 className="text-lg font-semibold">Journal</h2>
      </SidebarHeader>
      <ResuableContextMenu
        menuType="sidebarEmpty"
        onAction={handleSidebarAction}
      >
        <SidebarContent>
          <SidebarMenu className="p-2">
            {sidebarMetadata.map(item => (
              <TreeItem
                key={item.id}
                item={item}
                expandedIds={expandedIds}
                setExpandedIds={setExpandedIds}
                onSelectNote={setSelectedNoteId}
              />
            ))}
          </SidebarMenu>
        </SidebarContent>
      </ResuableContextMenu>
      <SidebarFooter />
    </Sidebar>
  )
}
