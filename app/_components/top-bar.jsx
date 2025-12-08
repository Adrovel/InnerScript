'use client'

import { SidebarTrigger } from '@/components/ui/sidebar'
import { Item, ItemContent, ItemTitle, ItemActions } from '@/components/ui/item'
import { useOpenTabsContext, useActiveTabContext } from './files-context'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

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
    <div className="flex items-center w-full h-10 bg-background border-b overflow-hidden">
      <SidebarTrigger className="ml-1 shrink-0"/>
      <div className="flex items-center gap-1 flex-1 min-w-0 px-2">
        {openTabs.map((tab) => {
          const isActive = tab.id === activeTabId
          return (
            <Item
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              variant='outline'
              className={cn(
                "flex-1 min-w-0 shrink",
                isActive
                  ? "border-primary text-foreground bg-accent/50"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-accent/30"
              )}
            >
              <ItemContent className="min-w-0 flex-1 overflow-hidden">
                <ItemTitle className="w-full min-w-0">
                  <span className="truncate block">{tab.title || 'Loading...'}</span>
                </ItemTitle>
              </ItemContent>
              <ItemActions className="shrink-0 ml-auto">
                <Button variant='ghost' size='icon' onClick={(e) => handleCloseTab(e, tab.id)}>
                  <X className="h-3 w-3" />
                </Button>
              </ItemActions>
            </Item>
          )
        })}
      </div>
    </div>
  )
}