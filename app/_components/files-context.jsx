'use client'

import { createContext, useContext, useState } from "react"

const FileContext = createContext(null)

export function FileProvider({ children, sidebarMetadata, initialNoteId }) {
  const [selectedNoteId, setSelectedNoteId] = useState(initialNoteId || null)
  const [metadata, setMetadata] = useState(null)

  const value = {
    sidebarMetadata,
    selectedNoteId,
    setSelectedNoteId,
    metadata,
    setMetadata,
  }

  return (
    <FileContext.Provider value={value}>
      {children}
    </FileContext.Provider>
  )
}

export function useFileContext() {
  const context = useContext(FileContext)
  if (!context) throw new Error('useFileContext must be used within a FileProvider')
  return context
}
