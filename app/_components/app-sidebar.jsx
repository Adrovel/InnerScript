'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar"
import { useSidebarMetadataContext, useSelectedNoteContext } from "./files-context"
import { TreeItem } from "./tree-item"
import { ResuableContextMenu } from './resuable-context-menu'

export function AppSidebar() {
  const sidebarMetadata = useSidebarMetadataContext()
  const [selectedNoteId, setSelectedNoteId] = useSelectedNoteContext()

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
    <Sidebar className="border-border">
      <SidebarHeader>
        <h2 className="text-2xl font-serif p-2">Notes</h2>
      </SidebarHeader>
      <ResuableContextMenu
        menuType="sidebarEmpty"
        onAction={handleSidebarAction}
      >
        <SidebarContent className="p-2">
          <SidebarMenu>
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
      <SidebarFooter />
    </Sidebar>
  )
}
