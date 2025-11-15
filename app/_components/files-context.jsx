'use client'

import { createContext, useContext, useState } from "react"

const SidebarMetadataContext = createContext(null)
const SelectedNoteContext = createContext(null)

export function FileProvider({ children, sidebarMetadata }) {
  const [selectedNoteId, setSelectedNoteId] = useState(null)

  return (
    <SidebarMetadataContext.Provider value={sidebarMetadata}>
      <SelectedNoteContext.Provider value={[selectedNoteId, setSelectedNoteId]}>
        {children}
      </SelectedNoteContext.Provider>
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

export function useSelectedNoteContext() {
  const context = useContext(SelectedNoteContext)
  if (!context) {
    throw new Error('useSelectedNoteContext must be used within a FileProvider')
  }
  return context
}
