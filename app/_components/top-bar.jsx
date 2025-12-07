'use client'

import { SidebarTrigger } from '@/components/ui/sidebar'
import { useOpenTabsContext, useActiveTabContext } from './files-context'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function TopBar() {
  const { openTabs, closeTab } = useOpenTabsContext()
  const [activeTabId, setActiveTabId] = useActiveTabContext()

  const handleTabClick = (tabId) => {
    setActiveTabId(tabId)
  }

  const handleCloseTab = (e, tabId) => {
    e.stopPropagation()
    closeTab(tabId)
  }

  return (
    <div className="flex items-center w-full h-10 bg-background border-b">
      <SidebarTrigger className="ml-1 shrink-0"/>
      <div className="flex items-center gap-1 overflow-x-auto flex-1 min-w-0">
        {openTabs.map((tab) => {
          const isActive = tab.id === activeTabId
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 h-8 text-sm font-medium transition-colors shrink-0 border-b-2",
                isActive
                  ? "border-primary text-foreground bg-accent/50"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-accent/30"
              )}
            >
              <span className="truncate max-w-[200px]">{tab.title}</span>
              <button
                onClick={(e) => handleCloseTab(e, tab.id)}
                className={cn(
                  "rounded-sm p-0.5 hover:bg-accent transition-colors",
                  isActive ? "opacity-70 hover:opacity-100" : "opacity-50 hover:opacity-70"
                )}
                aria-label="Close tab"
              >
                <X className="h-3 w-3" />
              </button>
            </button>
          )
        })}
      </div>
    </div>
  )
}