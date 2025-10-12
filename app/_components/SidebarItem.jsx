'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Folder, FileText } from "lucide-react"

export default function SidebarItem({ item }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const hasChildren = item.children && item.children.length > 0
  const isFolder = item.type === 'folder'

  const toggleExpand = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded)
    }
  }

  const Icon = isFolder ? Folder : FileText

  const itemClassName = [
      'flex items-center px-3 py-2 text-sm rounded-md cursor-pointer transition-colors',
      'hover:bg-accent hover:text-accent-foreground',
    ].filter(Boolean).join(' ');

  return (
    <div className="space-y-0.5">
      <div
        className={itemClassName}
        onClick={toggleExpand}
        title={item.title}
      >
        {hasChildren && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 p-0 mr-2 shrink-0"
          >
            <ChevronRight
              className={`h-3 w-3 transition-transform ${
                isExpanded ? 'rotate-90' : ''
              }`}
            />
          </Button>
        )}
        {!hasChildren && <div className="w-6 h-6 mr-2 shrink-0" />}
        <Icon className="h-3 w-3 mr-2 shrink-0" />
        <span className="truncate">{item.title}</span>
      </div>
      {hasChildren && isExpanded && (
        <div className="ml-6 space-y-0.5 border-l border-border">
          {item.children.map((child) => (
            <SidebarItem key={child.id} item={child} />
          ))}
        </div>
      )}
    </div>
  )
}
