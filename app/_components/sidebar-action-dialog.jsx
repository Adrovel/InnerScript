'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function SidebarActionDialog({
  open,
  onOpenChange,
  title,
  description,
  inputValue,
  onInputChange,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  requiresInput = true,
  isDestructive = false,
}) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (!requiresInput || inputValue.trim())) {
      e.preventDefault()
      onConfirm()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {requiresInput && (
          <Input
           value={inputValue} 
           onChange={onInputChange} 
           onKeyDown={handleKeyDown} 
           placeholder="Enter name..." 
           autoFocus
          />
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button 
            variant={isDestructive ? "destructive" : "default"} 
            onClick={onConfirm}
            disabled={requiresInput && !inputValue.trim()}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}