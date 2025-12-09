'use client'

import { useCallback } from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar"
import { useSidebarMetadataContext, useOpenTabsContext, useActiveTabContext } from "./files-context"
import { TreeItem } from "./tree-item"
import { ReusableContextMenu } from './reusable-context-menu'
import { SidebarActionDialog } from './sidebar-action-dialog'
import { useContextMenuDialog } from '@/hooks/use-context-menu-dialog'

export function AppSidebar() {
  const sidebarMetadata = useSidebarMetadataContext()
  const { openNote } = useOpenTabsContext()
  const [activeTabId] = useActiveTabContext()

  const handleSelectNote = useCallback((noteId) => {
    openNote(noteId)
  }, [openNote])
  
  const {
    dialog,
    openDialog,
    closeDialog,
    setInputValue,
    executeAction,
    getDialogTitle,
    getDialogDescription,
    requiresInput,
    getConfirmText
  } = useContextMenuDialog()

  const handleSidebarAction = (action) => {
    openDialog(action)
  }

  const handleDialogConfirm = async () => {
    await executeAction()
  }

  return (
    <>
    <Sidebar className="border-none">
      <SidebarHeader>
        <h2 className="text-2xl font-serif p-2">Scripts</h2>
      </SidebarHeader>
      <ReusableContextMenu
        menuType="sidebarEmpty"
        onAction={handleSidebarAction}
      >
        <SidebarContent className="p-2">
          <SidebarMenu>
            {sidebarMetadata.map(item => (
              <TreeItem
                key={item.id}
                item={item}
                onSelectNote={handleSelectNote}
                selectedNoteId={activeTabId}
              />
            ))}
          </SidebarMenu>
        </SidebarContent>
      </ReusableContextMenu>
      <SidebarFooter />
    </Sidebar>

    <SidebarActionDialog
      open={dialog.open}
      onOpenChange={closeDialog}
      title={getDialogTitle()}
      description={getDialogDescription()}
      inputValue={dialog.inputValue}
      onInputChange={e => setInputValue(e.target.value)}
      onConfirm={handleDialogConfirm}
      onCancel={closeDialog}
      confirmText={getConfirmText()}
      requiresInput={requiresInput()}
      isDestructive={dialog.action === 'delete'}
    />
    </>
  )
}
