'use client'

import { createContext, useContext, useState, useCallback } from "react"

const FileContext = createContext(null)

// railTab: 'analysis' | 'chat' | null (null = closed)
export function FileProvider({ children, sidebarMetadata, initialNoteId }) {
  const [selectedNoteId, setSelectedNoteId] = useState(initialNoteId || null)
  const [metadata, setMetadata] = useState(null)
  const [railTab, setRailTab] = useState('analysis')
  const [railOpen, setRailOpen] = useState(true)

  const cycleRail = useCallback(() => {
    if (!railOpen) { setRailOpen(true); return }
    if (railTab === 'analysis') { setRailTab('chat'); return }
    if (railTab === 'chat') { setRailOpen(false); return }
  }, [railOpen, railTab])

  const openRailTab = useCallback((tab) => {
    setRailTab(tab)
    setRailOpen(true)
  }, [])

  const value = {
    sidebarMetadata,
    selectedNoteId,
    setSelectedNoteId,
    metadata,
    setMetadata,
    railTab,
    railOpen,
    setRailOpen,
    openRailTab,
    cycleRail,
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
