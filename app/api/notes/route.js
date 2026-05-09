import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function GET() {
  let client
  try {
    client = await pool.connect()
    const result = await client.query(
      `SELECT id, title, folder_id, "createdAt" FROM notes ORDER BY "createdAt" DESC`
    )
    return NextResponse.json({ notes: result.rows })
  } catch (err) {
    console.error('Error fetching notes:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  } finally {
    client?.release()
  }
}

export async function POST(req) {
  let client
  try {
    const { title, content, folder_id } = await req.json()
    client = await pool.connect()
    const res = await client.query(
      `INSERT INTO notes (title, content, folder_id)
       VALUES ($1, $2, $3)
       RETURNING id, title, content, folder_id`,
      [title || 'Untitled Note', content || '', folder_id || null]
    )
    return NextResponse.json({ note: res.rows[0] }, { status: 201 })
  } catch (err) {
    console.error('Error creating note:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  } finally {
    client?.release()
  }
}
