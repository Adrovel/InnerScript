'use client'

import { SidebarTrigger } from '@/components/ui/sidebar'
import { Item, ItemContent, ItemTitle, ItemActions } from '@/components/ui/item'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useOpenTabsContext, useActiveTabContext } from './files-context'


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
    <div className="flex items-center w-full h-10 bg-sidebar overflow-visible border-b border-border">
      <SidebarTrigger className="ml-1 shrink-0"/>
      <div className="flex items-center flex-1 min-w-0 px-2">
        {openTabs.map((tab) => {
          const isActive = tab.id === activeTabId
          return (
            <Item
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              variant='default'
              size="sm"
              className={cn(
                "relative bg-accent/70 flex-1 min-w-0 max-w-[200px] shrink overflow-visible px-4 py-2 shadow-sm transition-all duration-150",
                isActive
                  ? "text-foreground bg-white shadow-md"
                  : "text-muted-background hover:text-foreground text-accent-foreground hover:bg-accent/40"
              )}
              style={{ borderRadius: '20px 20px 0px 0px' }}
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