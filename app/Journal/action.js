'use server'

import { readRecordsWithOptions } from "@/lib/db/sequelize-query"
import { db } from "@/lib/db"

export async function getExplorerData() {
  try {
    const [folders, notes] = await Promise.all([
      readRecordsWithOptions(db.Folders, {
        attributes: ['id', 'name', 'parent_id', 'createdAt'],
        order: [['createdAt', 'DESC']]
      }),
      readRecordsWithOptions(db.Notes, {
        attributes: ['id', 'title', 'folder_id', 'createdAt'],
        order: [['createdAt', 'DESC']]
      })
    ])
    
    const tree = buildTree(folders, notes)
    return { tree }
  } catch (error) {
    console.error("Error fetching explorer data:", error)
    throw error
  }
}

function buildTree(folders, notes) {
  const folderMap = new Map()
  const rootItems = []

  folders.forEach(folder => {
    const folderItem = {
      id: folder.id,
      name: folder.name,
      type: 'folder',
      createdAt: folder.createdAt,
      parent_id: folder.parent_id,
      children: []
    }
    folderMap.set(folder.id, folderItem)
  })

  folders.forEach(folder => {
    const folderItem = folderMap.get(folder.id)
    
    if (folder.parent_id) {
      const parent = folderMap.get(folder.parent_id)
      if (parent) {
        parent.children.push(folderItem)
      } else {
        rootItems.push(folderItem)
      }
    } else {
      rootItems.push(folderItem)
    }
  })

  notes.forEach(note => {
    const noteItem = {
      id: note.id,
      name: note.title,
      type: 'note',
      createdAt: note.createdAt
    }

    if (note.folder_id) {
      const parentFolder = folderMap.get(note.folder_id)
      if (parentFolder) {
        parentFolder.children.push(noteItem)
      } else {
        rootItems.push(noteItem)
      }
    } else {
      rootItems.push(noteItem)
    }
  })

  return sortTreeItems(rootItems)
}

function sortTreeItems(items) {
  if (!items?.length) return items

  const folders = []
  const notes = []

  items.forEach(item => {
    if (item.type === 'folder') {
      if (item.children?.length) {
        item.children = sortTreeItems(item.children)
      }
      folders.push(item)
    } else {
      notes.push(item)
    }
  })

  const sortByDate = (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  
  folders.sort(sortByDate)
  notes.sort(sortByDate)

  return [...folders, ...notes]
}