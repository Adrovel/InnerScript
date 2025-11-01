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
import { ResuableContextMenu } from './resuable-context-menu'

export function TreeItem({ item, onSelectNote, selectedNoteId, depth = 0 }) {
  const [isOpen, setIsOpen] = useState(false)
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

  const handleContextMenuAction = (action) => {
    console.log(`${action} action triggered for ${isFolder ? 'folder' : 'file'}: ${item.title}`)
  }
  
  if (isFolder) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <MenuItem>
          <ResuableContextMenu
            menuType="folder"
            onAction={handleContextMenuAction}
          >
            <CollapsibleTrigger asChild>
              <MenuButton
                onClick={handleClick}
                isActive={false}
                className="rounded-sm"
                style={{ paddingLeft }}
              >
                <span className="font-sans flex-1 text-left truncate">{item.title}</span>
                <ChevronRight className={`h-4 w-4 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`} />
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
    )
  }

  return (
    <MenuItem>
      <ResuableContextMenu
        menuType="note"
        onAction={handleContextMenuAction}
      >
        <MenuButton
          onClick={handleClick}
          isActive={isSelected}
          className="rounded-sm whitespace-nowrap"
          style={{ paddingLeft }}
        >
          <span className='font-sans flex-1 text-left truncate'>{item.title}</span>
        </MenuButton>
      </ResuableContextMenu>
    </MenuItem>
  )
}
