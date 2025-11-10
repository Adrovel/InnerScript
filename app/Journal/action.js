'use server'

import { readAllRecords } from "@/lib/db/sequelize-query"
import { db } from "@/lib/db"

export async function getExplorerData() {
  try {
    const foldersWithNotes = await readAllRecords(
      db.Folders,
      [{
        model: db.Notes,
        as: 'notes',
        required: false
      }],
      [
        ['createdAt', 'DESC'],
        ['notes', 'createdAt', 'DESC']
      ]
    )
    
    const tree = buildTree(foldersWithNotes)
    // console.log("Tree", tree)
    return { tree }
  } catch (error) {
    console.error("Error fetching explorer data:", error)
    throw error
  }
}

function buildTree(foldersWithNotes) {
  const map = new Map()
  const rootItems = []

  foldersWithNotes.forEach(folder => {
    const folderItem = {
      id: folder.id,
      name: folder.name,
      type: 'folder',
      createdAt: folder.createdAt || new Date().toISOString(),
      children: folder.notes ? folder.notes.map(note => ({
        id: `note-${note.id}`,
        name: note.title,
        type: 'note',
        createdAt: note.createdAt || new Date().toISOString()
      })) : []
    }
    map.set(folder.id, folderItem)
    if (folder.parent_id) {
      const parent = map.get(folder.parent_id)
      if (parent) {
        parent.children.push(folderItem)
      }
    } else {
      rootItems.push(folderItem)
    }
  })
  return rootItems
}