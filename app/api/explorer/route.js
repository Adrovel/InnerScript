import { NextResponse } from 'next/server'
import { readRecordsWithOptions } from "@/lib/db/sequelize-query"
import { db } from "@/lib/db"
import { buildTree } from "@/lib/explorer-tree"

export async function GET() {
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
    return NextResponse.json({ tree })
  } catch (error) {
    console.error("Error fetching explorer data:", error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
