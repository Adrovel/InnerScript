import { Pool } from 'pg'

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'innerscript',
  password: 'InnerScript123#',
  port: 5432,
})

export async function PUT(req) {
  try {
    const { id, title, content } = await req.json()

    await pool.query(
      'UPDATE journal_entries SET title = $1, content = $2, updated_at = NOW() WHERE id = $3',
      [title, content, id]
    )

    return new Response('Note updated', { status: 200 })
  } catch (err) {
    console.error('PUT /api/notes error:', err)
    return new Response('Internal Server Error', { status: 500 })
  }
}