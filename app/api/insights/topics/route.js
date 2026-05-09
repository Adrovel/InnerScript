import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const start = searchParams.get('start') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const end = searchParams.get('end') || new Date().toISOString()
  const limit = parseInt(searchParams.get('limit') || '20', 10)

  let client
  try {
    client = await pool.connect()
    const result = await client.query(
      `SELECT
         topic,
         COUNT(*)::int AS count
       FROM note_metadata nm,
            jsonb_array_elements_text(nm.topics) AS topic
       WHERE nm.analysed_at BETWEEN $1 AND $2
       GROUP BY topic
       ORDER BY count DESC
       LIMIT $3`,
      [start, end, limit]
    )
    return NextResponse.json({ topics: result.rows })
  } catch (err) {
    console.error('Topics error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  } finally {
    client?.release()
  }
}
