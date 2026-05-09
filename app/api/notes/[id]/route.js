import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function GET(req, { params }) {
  let client
  try {
    const { id } = await params
    client = await pool.connect()
    const result = await client.query(
      'SELECT id, title, content, folder_id, analysis_disabled FROM notes WHERE id = $1',
      [id]
    )
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    }
    return NextResponse.json({ note: result.rows[0] })
  } catch (err) {
    console.error('Error fetching note:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  } finally {
    client?.release()
  }
}

export async function PUT(req, { params }) {
  let client
  try {
    const { id } = await params
    const { title, content } = await req.json()
    client = await pool.connect()
    const res = await client.query(
      `UPDATE notes SET title = $1, content = $2, "updatedAt" = NOW()
       WHERE id = $3
       RETURNING id, title, content`,
      [title, content, id]
    )
    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    }
    return NextResponse.json({ note: res.rows[0] })
  } catch (err) {
    console.error('Error updating note:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  } finally {
    client?.release()
  }
}

export async function DELETE(req, { params }) {
  let client
  try {
    const { id } = await params
    client = await pool.connect()
    const res = await client.query(
      'DELETE FROM notes WHERE id = $1 RETURNING id',
      [id]
    )
    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    }
    return NextResponse.json({ message: 'Note deleted' })
  } catch (err) {
    console.error('Error deleting note:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  } finally {
    client?.release()
  }
}
