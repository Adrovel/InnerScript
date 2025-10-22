import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger
} from "@/components/ui/context-menu";

// Menu configurations - now just define the structure, actions come from props
const MENU_CONFIGS = {
  sidebarEmpty: {
    items: [
      { label: "New File", actionKey: "newFile" },
      { label: "New Folder", actionKey: "newFolder" }
    ]
  },
  noteItems: {
    items: [
      { label: "Rename", actionKey: "rename" },
      { label: "Delete", actionKey: "delete", variant: 'destructive' }
    ]
  },
  folderItems: {
    items: [
      { label: "New File", actionKey: "newFile" },
      { label: "New Folder", actionKey: "newFolder" },
      { type: "separator" },
      { label: "Rename", actionKey: "rename" },
      { label: "Delete", actionKey: "delete", variant: 'destructive' }
    ]
  }
}

export function ResuableContextMenu({
  children,
  menuType,
  onAction,
  data=null,
  className = "w-32"
}) {
  const config = MENU_CONFIGS[menuType]

  if (!config) {
    console.warn(`ResuableContextMenu: Unknown menuType "${menuType}"`)
    return children
  }

  const handleAction = (actionKey) => {
    if (onAction) {
      onAction(actionKey, data)
    }
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className={className}>
        {config.items.map((item, index) => {
          if (item.type === 'separator') {
            return <ContextMenuSeparator key={index} />
          }

          return (
            <ContextMenuItem
              key={index}
              onClick={() => handleAction(item.actionKey)}
              variant={item.variant || 'default'}
            >
              {item.label}
            </ContextMenuItem>
          )
        })}
      </ContextMenuContent>
    </ContextMenu>
  )
}
