'use client'

import { useState } from 'react'
import { Folder, FolderOpen, FileText } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar"

import { useFileContext } from "./FilesContext"

function TreeItem({ item, expandedIds, setExpandedIds, onSelectNote, isSub = false }) {
  const isExpanded = expandedIds.has(item.id)
  const isFolder = item.type === 'folder'
  const hasChildren = item.children && item.children.length > 0

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

  const MenuItem = isSub ? SidebarMenuSubItem : SidebarMenuItem
  const MenuButton = isSub ? SidebarMenuSubButton : SidebarMenuButton

  return (
    <MenuItem>
      <MenuButton onClick={handleClick} isActive={false}>
        {isFolder ? (
          isExpanded ? <FolderOpen className="size-4" /> : <Folder className="size-4" />
        ) : (
          <FileText className="size-4" />
        )}
        <span>{item.title}</span>
      </MenuButton>
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

export function AppSidebar() {
  const { sidebarMetadata, setSelectedNoteId } = useFileContext()
  const [expandedIds, setExpandedIds] = useState(new Set())

  return (
    <Sidebar>
      <SidebarHeader>
        <h2 className="text-lg font-semibold">Journal</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
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
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
