import { Pool } from 'pg'

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'innerscript',
  password: 'InnerScript123#',
  port: 5432,
})


export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM journal_entries ORDER BY updated_at ASC')
    console.log('Fetching')
    return Response.json(result.rows)
  } catch (err) {
    console.error('GET /api/notes error:', err)
    return new Response('Internal Server Error', { status: 500 })
  }
}

export async function PUT(req) {
  try {
    const body = await req.text()

    if (!body) return new Response('Missing body', { status: 400 })

    let data
    try {
      console.log('Raw body:', body)
      data = JSON.parse(body)
    } catch (err) {
      return new Response('Invalid JSON', { status: 400 })
    }

    const { id, title, content } = data

    await pool.query(
      `INSERT INTO journal_entries (id, title, content, updated_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (id) DO UPDATE
       SET title = EXCLUDED.title,
           content = EXCLUDED.content,
           updated_at = NOW()`,
      [id, title, content]
    )

    return new Response('Note upserted', { status: 200 })
  } catch (err) {
    console.error('PUT /api/notes error:', err)
    return new Response('Internal Server Error', { status: 500 })
  }
}