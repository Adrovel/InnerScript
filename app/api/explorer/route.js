import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

function buildExplorerStructure(folders, notes) {
  const folderMap = new Map();
  const explorer = [];

  folders.forEach(fol => {
    folderMap.set(`fol_${fol.id}`, {...fol, isFolder: true, Contents: []})
  });

  folders.forEach(fol => {
    if (fol.parent_folder_id) {
      folderMap.get(`fol_${fol.parent_folder_id}`).Contents.push(folderMap.get(`fol_${fol.id}`))
    }
    else {
      explorer.push(folderMap.get(`fol_${fol.id}`))
    }
  })

  notes.forEach(ele => {
    const note = {id: `note_${ele.id}`, name: ele.name, idFolder: false}
    if (ele.folder_id) {
      folderMap.get(`fol_${ele.folder_id}`)?.Contents.push(note)
    }
    else {
      explorer.push(note)
    }
  })

  return explorer
}

export async function GET() {
  try {
    const client = await pool.connect();

    const folderQuery = `
      SELECT * FROM folders
      ORDER BY created_at DESC
    `
    const notesQuery = `
      SELECT id, name, folder_id FROM notes
      ORDER BY created_at DESC
    `

    const [folderResult, notesResult] = await Promise.all([
      client.query(folderQuery),
      client.query(notesQuery)
    ])

    client.release();

    const explorer = buildExplorerStructure(folderResult.rows, notesResult.rows);

    console.log("Explorer structure:", explorer)

    return NextResponse.json({
      explorer: explorer,
    })

  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500}
    )
  }
}
