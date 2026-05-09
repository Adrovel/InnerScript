import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function GET() {
  const today = new Date().toISOString().split('T')[0]
  let client
  try {
    client = await pool.connect()

    const existing = await client.query(
      'SELECT id, title, content FROM notes WHERE title = $1 LIMIT 1',
      [today]
    )

    if (existing.rows.length > 0) {
      return NextResponse.json({ note: existing.rows[0] })
    }

    const created = await client.query(
      `INSERT INTO notes (title, content) VALUES ($1, $2) RETURNING id, title, content`,
      [today, '']
    )
    return NextResponse.json({ note: created.rows[0], created: true }, { status: 201 })
  } catch (err) {
    console.error('Error in /api/notes/today:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  } finally {
    client?.release()
  }
}
