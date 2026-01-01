'use client'

import { createContext, useContext, useState, useCallback } from "react"

const SidebarMetadataContext = createContext(null)
const OpenTabsContext = createContext(null)
const ActiveTabContext = createContext(null)

export function FileProvider({ children, sidebarMetadata: initialSidebarMetadata }) {
  const [sidebarMetadata, setSidebarMetadata] = useState(initialSidebarMetadata)
  const [openTabs, setOpenTabs] = useState([]) 
  const [activeTabId, setActiveTabId] = useState(null)

  // Refresh sidebar metadata from API
  const refreshSidebarMetadata = useCallback(async () => {
    try {
      const response = await fetch('/api/explorer')
      if (!response.ok) {
        throw new Error('Failed to fetch explorer data')
      }
      const data = await response.json()
      setSidebarMetadata(data.tree)
    } catch (error) {
      console.error('Error refreshing sidebar metadata:', error)
    }
  }, [])

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
      if (activeTabId === noteId) {
        const currentIndex = prevTabs.findIndex(tab => tab.id === noteId)
        if (filteredTabs.length > 0) {
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
    <SidebarMetadataContext.Provider value={{ sidebarMetadata, refreshSidebarMetadata }}>
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
  return context.sidebarMetadata
}

export function useRefreshSidebarMetadata() {
  const context = useContext(SidebarMetadataContext)
  if (!context) {
    throw new Error('useRefreshSidebarMetadata must be used within a FileProvider')
  }
  return context.refreshSidebarMetadata
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
