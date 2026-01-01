"use client"

import { useMemo } from "react"
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useSidebarMetadataContext, useActiveTabContext, useOpenTabsContext } from "./files-context"

// Recursively find the path to a note in the sidebar metadata
function findNotePath(items, noteId, ancestors = []) {
  if (!items || !Array.isArray(items)) return null

  for (const item of items) {
    if (item.type === 'note' && item.id === noteId) {
      return {
        folderNames: ancestors,
        noteName: item.name
      }
    }
    
    if (item.type === 'folder' && item.children) {
      const result = findNotePath(item.children, noteId, [...ancestors, item.name])
      if (result) return result
    }
  }
  
  return null
}

export function NoteHeader() {
  const sidebarMetadata = useSidebarMetadataContext()
  const [activeTabId] = useActiveTabContext()
  const { openTabs } = useOpenTabsContext()

  const breadcrumbData = useMemo(() => {
    if (!activeTabId || !sidebarMetadata) return null

    const path = findNotePath(sidebarMetadata, activeTabId)
    if (!path) return null

    // Prefer title from openTabs if available, otherwise use note name from tree
    const tab = openTabs.find(t => t.id === activeTabId)
    const noteName = tab?.title || path.noteName || 'Untitled'

    return {
      folderNames: path.folderNames,
      noteName
    }
  }, [activeTabId, sidebarMetadata, openTabs])

  // Don't render if no active note or path not found
  if (!breadcrumbData) {
    return null
  }

  const { folderNames, noteName } = breadcrumbData
  const folderDepth = folderNames.length

  return (
    <div className="flex justify-center w-full">
      <Breadcrumb className="px-1">
        <BreadcrumbList>
          {/* Always show Scripts as root */}
          <BreadcrumbItem>
            <BreadcrumbLink>Scripts</BreadcrumbLink>
          </BreadcrumbItem>

          {/* Render based on folder depth */}
          {folderDepth === 0 ? (
            // No folders - just show Scripts / Note
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{noteName}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          ) : folderDepth === 1 ? (
            // One folder - show Scripts / Folder / Note
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink>{folderNames[0]}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{noteName}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          ) : (
            // Two or more folders - show Scripts / … / Note
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbEllipsis />
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{noteName}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}
