import { useState } from 'react'

export function useContextMenuDialog() {
  const [dialog, setDialog] = useState({
    open: false,
    action: null,
    entityType: null,
    entityId: null,
    currentName: '',
    inputValue: ''
  })

  const openDialog = (action, context = {}) => {
    const { entityType = null, entityId = null, currentName = '' } = context
    
    let defaultInput = ''
    
    switch (action) {
      case 'newFile':
        defaultInput = 'New Note'
        break
      case 'newFolder':
        defaultInput = 'New Folder'
        break
      case 'rename':
        defaultInput = currentName
        break
      case 'delete':
        defaultInput = currentName
        break
      default:
        defaultInput = ''
    }

    setDialog({
      open: true,
      action,
      entityType,
      entityId,
      currentName,
      inputValue: defaultInput
    })
  }

  const closeDialog = () => {
    setDialog({
      open: false,
      action: null,
      entityType: null,
      entityId: null,
      currentName: '',
      inputValue: ''
    })
  }

  const setInputValue = (value) => {
    setDialog(prev => ({ ...prev, inputValue: value }))
  }

  const executeAction = async (onSuccess) => {
    const { action, entityType, entityId, inputValue } = dialog

    try {
      let endpoint = ''
      let method = 'POST'
      let body = {}

      switch (action) {
        case 'newFile':
          endpoint = '/api/notes'
          method = 'POST'
          body = {
            title: inputValue,
            content: '',
            ...(entityId && { folder_id: entityId })
          }
          break

        case 'newFolder':
          endpoint = '/api/folders'
          method = 'POST'
          body = {
            name: inputValue,
            ...(entityId && { parent_id: entityId })
          }
          break

        case 'rename':
          if (entityType === 'note') {
            endpoint = `/api/notes/${entityId}`
            method = 'PUT'
            body = { title: inputValue }
          } else if (entityType === 'folder') {
            endpoint = `/api/folders/${entityId}`
            method = 'PUT'
            body = { name: inputValue }
          }
          break

        case 'delete':
          if (entityType === 'note') {
            endpoint = `/api/notes/${entityId}`
            method = 'DELETE'
          } else if (entityType === 'folder') {
            endpoint = `/api/folders/${entityId}`
            method = 'DELETE'
          }
          break

        default:
          console.warn(`Unknown action: ${action}`)
          closeDialog()
          return
      }

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        ...(method !== 'DELETE' && { body: JSON.stringify(body) })
      })

      if (!response.ok) {
        throw new Error(`Failed to ${action}`)
      }

      if (onSuccess) {
        const data = await response.json()
        onSuccess(data)
      }

      closeDialog()
    } catch (error) {
      console.error(`Error executing ${action}:`, error)
    }
  }

  const getDialogTitle = () => {
    switch (dialog.action) {
      case 'newFile':
        return 'Create New Note'
      case 'newFolder':
        return 'Create New Folder'
      case 'rename':
        return `Rename ${dialog.entityType === 'folder' ? 'Folder' : 'Note'}`
      case 'delete':
        return `Delete ${dialog.entityType === 'folder' ? 'Folder' : 'Note'}`
      default:
        return ''
    }
  }

  const getDialogDescription = () => {
    switch (dialog.action) {
      case 'delete':
        return `Are you sure you want to delete "${dialog.currentName}"? This action cannot be undone.`
      default:
        return null
    }
  }

  const requiresInput = () => {
    return ['newFile', 'newFolder', 'rename'].includes(dialog.action)
  }

  const getConfirmText = () => {
    switch (dialog.action) {
      case 'newFile':
      case 'newFolder':
        return 'Create'
      case 'rename':
        return 'Rename'
      case 'delete':
        return 'Delete'
      default:
        return 'Confirm'
    }
  }

  return {
    dialog,
    openDialog,
    closeDialog,
    setInputValue,
    executeAction,
    getDialogTitle,
    getDialogDescription,
    requiresInput,
    getConfirmText
  }
}