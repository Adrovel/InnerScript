'use client'

import { Folder, FolderOpen, FileText } from 'lucide-react'
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar"
import { ResuableContextMenu } from './resuable-context-menu'

export function TreeItem({ item, expandedIds, setExpandedIds, onSelectNote, isSub = false }) {
  const isExpanded = expandedIds.has(item.id)
  const isFolder = item.type === 'folder'
  const hasChildren = item.children && item.children.length > 0

  // Use a set to handle expanded state. If the item is a folder, toggle
  // the expanded state. If the item is a note, select it.
  const handleClick = () => {
    if (isFolder) {
      setExpandedIds(prev => {
        const newSet = new Set(prev)
        if (newSet.has(item.id)) {
          newSet.delete(item.id)
        } else {
          newSet.add(item.id)
        }
        return newSet
      })
    } else {
      onSelectNote(item.id)
    }
  }

  const handleContextMenuAction = (action) => {
    console.log(`${action} action triggered for ${isFolder ? 'folder' : 'file'}: ${item.title}`)
  }

  const MenuItem = isSub ? SidebarMenuSubItem : SidebarMenuItem
  const MenuButton = isSub ? SidebarMenuSubButton : SidebarMenuButton

  return (
    <MenuItem>
      <ResuableContextMenu
        menuType={isFolder ? "folderItems" : "noteItems"}
        onAction={handleContextMenuAction}
      >
        <MenuButton onClick={handleClick} isActive={false}>
          {isFolder ? (
            isExpanded ? <FolderOpen className="size-4" /> : <Folder className="size-4" />
          ) : (
            <FileText className="size-4" />
          )}
          <span>{item.title}</span>
        </MenuButton>
      </ResuableContextMenu>

      {isFolder && hasChildren && isExpanded && (
        <SidebarMenuSub>
          {item.children.map(child => (
            <TreeItem
              key={child.id}
              item={child}
              expandedIds={expandedIds}
              setExpandedIds={setExpandedIds}
              onSelectNote={onSelectNote}
              isSub={true}
            />
          ))}
        </SidebarMenuSub>
      )}
    </MenuItem>
  )
}
