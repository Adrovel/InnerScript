'use client'

import { useState } from 'react'

import { ChevronRight } from 'lucide-react'
import {
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger 
} from "@/components/ui/collapsible"
import { ReusableContextMenu } from './reusable-context-menu'
import { useContextMenuDialog } from '@/hooks/use-context-menu-dialog'
import { SidebarActionDialog } from './sidebar-action-dialog'

export function TreeItem({ item, onSelectNote, selectedNoteId}) {
  const [isOpen, setIsOpen] = useState(false)
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
  const isFolder = item.type === 'folder'
  const hasChildren = item.children && item.children.length > 0
  const isSelected = !isFolder && selectedNoteId === item.id


  const handleClick = () => {
    if (!isFolder) {
      onSelectNote(item.id)
    }
  }
  const handleSidebarAction = action => {
    openDialog(action, {
      entityType: item.type,
      entityId: item.id,
      currentName: item.name
    })
  }
  const handleDialogConfirm = async () => await executeAction()
  
  if (isFolder) {
    return (
      <>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <SidebarMenuItem>
          <ReusableContextMenu
            menuType="folder"
            onAction={handleSidebarAction}
          >
            <CollapsibleTrigger asChild>
              <SidebarMenuButton
                onClick={handleClick}
                isActive={false}
                className="rounded-sm whitespace-nowrap"
              >
                <ChevronRight className={`h-4 w-4 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`} />
                <span className="font-sans flex-1 text-left truncate">{item.name}</span>
              </SidebarMenuButton>
            </CollapsibleTrigger>
          </ReusableContextMenu>
        </SidebarMenuItem>

        {hasChildren && (
          <CollapsibleContent style={{ paddingLeft: `16px` }}>
            <div className="border-l border-sidebar-border pl-2 flex flex-col gap-1">
              {item.children.map(child => (
                <TreeItem
                  key={child.id}
                  item={child}
                  onSelectNote={onSelectNote}
                  selectedNoteId={selectedNoteId}
                />
              ))}
            </div>
          </CollapsibleContent>
        )}
      </Collapsible>

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

  return (
    <>
    <SidebarMenuItem>
      <ReusableContextMenu
        menuType="note"
        onAction={handleSidebarAction}
      >
        <SidebarMenuButton
          onClick={handleClick}
          isActive={isSelected}
          className="rounded-sm whitespace-nowrap"
        >
          <div className="h-4 w-4 shrink-0" />
          <span className='font-sans flex-1 text-left truncate'>{item.name}</span>
        </SidebarMenuButton>
      </ReusableContextMenu>
    </SidebarMenuItem>

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
