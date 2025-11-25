'use client'

import { useState } from 'react'

import { ChevronRight } from 'lucide-react'
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
import { ReusableContextMenu } from './reusable-context-menu'
import { useContextMenuDialog } from '@/hooks/use-context-menu-dialog'
import { SidebarActionDialog } from './sidebar-action-dialog'

export function TreeItem({ item, onSelectNote, selectedNoteId, depth = 0 }) {
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
  const paddingLeft = `${depth * 16 + 16}px`
  const MenuItem = depth === 0 ? SidebarMenuItem : SidebarMenuSubItem
  const MenuButton = depth === 0 ? SidebarMenuButton : SidebarMenuSubButton


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
        <MenuItem>
          <ReusableContextMenu
            menuType="folder"
            onAction={handleSidebarAction}
          >
            <CollapsibleTrigger asChild>
              <MenuButton
                onClick={handleClick}
                isActive={false}
                className="rounded-sm"
                style={{ paddingLeft }}
              >
                <span className="font-sans flex-1 text-left truncate">{item.name}</span>
                <ChevronRight className={`h-4 w-4 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`} />
              </MenuButton>
            </CollapsibleTrigger>
          </ReusableContextMenu>
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
    <MenuItem>
      <ReusableContextMenu
        menuType="note"
        onAction={handleSidebarAction}
      >
        <MenuButton
          onClick={handleClick}
          isActive={isSelected}
          className="rounded-sm whitespace-nowrap"
          style={{ paddingLeft }}
        >
          <span className='font-sans flex-1 text-left truncate'>{item.name}</span>
        </MenuButton>
      </ReusableContextMenu>
    </MenuItem>

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
