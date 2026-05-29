'use client'

import { useFileContext } from './files-context'
import NoteMetadataPanel from './note-metadata-panel'
import ChatPanel from './chat-panel'

export default function RightRail() {
  const { railOpen, railTab, openRailTab } = useFileContext()

  if (!railOpen) return null

  return (
    <aside className="h-screen w-[300px] shrink-0 flex flex-col border-l border-border bg-card">
      {/* Tab strip */}
      <div className="flex border-b border-border shrink-0">
        <button
          onClick={() => openRailTab('analysis')}
          className={`flex-1 py-2.5 text-xs font-medium transition-colors
            ${railTab === 'analysis'
              ? 'text-foreground border-b-2 border-primary -mb-px'
              : 'text-muted-foreground hover:text-foreground'
            }`}
        >
          Analysis
        </button>
        <button
          onClick={() => openRailTab('chat')}
          className={`flex-1 py-2.5 text-xs font-medium transition-colors
            ${railTab === 'chat'
              ? 'text-foreground border-b-2 border-primary -mb-px'
              : 'text-muted-foreground hover:text-foreground'
            }`}
        >
          Chat
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        {railTab === 'analysis' && <NoteMetadataPanel />}
        {railTab === 'chat' && <ChatPanel />}
      </div>
    </aside>
  )
}
