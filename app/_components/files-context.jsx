'use client'

import { createContext, useContext, useState, useCallback } from "react"

const SidebarMetadataContext = createContext(null)
const OpenTabsContext = createContext(null)
const ActiveTabContext = createContext(null)

export function FileProvider({ children, sidebarMetadata }) {
  const [openTabs, setOpenTabs] = useState([]) // Array of { id, title }
  const [activeTabId, setActiveTabId] = useState(null)

  // Helper function to open a note (adds tab if not exists, switches to it)
  const openNote = useCallback((noteId) => {
    if (!noteId) return
    
    setOpenTabs(prevTabs => {
      const existingTab = prevTabs.find(tab => tab.id === noteId)
      if (existingTab) {
        setActiveTabId(noteId)
        return prevTabs
      } else {
        const newTab = { id: noteId }
        setActiveTabId(noteId)
        return [...prevTabs, newTab]
      }
    })
  }, [])

  // Helper function to close a tab
  const closeTab = useCallback((noteId) => {
    setOpenTabs(prevTabs => {
      const filteredTabs = prevTabs.filter(tab => tab.id !== noteId)
      
      // If closing the active tab, switch to adjacent tab
      if (activeTabId === noteId) {
        const currentIndex = prevTabs.findIndex(tab => tab.id === noteId)
        if (filteredTabs.length > 0) {
          // Switch to next tab if available, otherwise previous tab
          const newIndex = currentIndex < filteredTabs.length ? currentIndex : currentIndex - 1
          setActiveTabId(filteredTabs[newIndex]?.id || null)
        } else {
          setActiveTabId(null)
        }
      }
      
      return filteredTabs
    })
  }, [activeTabId])

  // Helper function to update tab title (when note is loaded)
  const updateTabTitle = useCallback((noteId, title) => {
    setOpenTabs(prevTabs => 
      prevTabs.map(tab => 
        tab.id === noteId ? { ...tab, title: title || 'Untitled' } : tab
      )
    )
  }, [])

  return (
    <SidebarMetadataContext.Provider value={sidebarMetadata}>
      <OpenTabsContext.Provider value={{ openTabs, setOpenTabs, openNote, closeTab, updateTabTitle }}>
        <ActiveTabContext.Provider value={[activeTabId, setActiveTabId]}>
          {children}
        </ActiveTabContext.Provider>
      </OpenTabsContext.Provider>
    </SidebarMetadataContext.Provider>
  )
}

export function useSidebarMetadataContext() {
  const context = useContext(SidebarMetadataContext)
  if (!context) {
    throw new Error('useSidebarMetadataContext must be used within a FileProvider')
  }
  return context
}

export function useOpenTabsContext() {
  const context = useContext(OpenTabsContext)
  if (!context) {
    throw new Error('useOpenTabsContext must be used within a FileProvider')
  }
  return context
}

export function useActiveTabContext() {
  const context = useContext(ActiveTabContext)
  if (!context) {
    throw new Error('useActiveTabContext must be used within a FileProvider')
  }
  return context
}

// Keep for backward compatibility (will be removed after updating all usages)
export function useSelectedNoteContext() {
  const [activeTabId] = useActiveTabContext()
  return [activeTabId, () => {}]
}
