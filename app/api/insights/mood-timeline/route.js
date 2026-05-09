import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const start = searchParams.get('start') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const end = searchParams.get('end') || new Date().toISOString()

  let client
  try {
    client = await pool.connect()
    const result = await client.query(
      `SELECT
         n.title AS date,
         nm.mood_score,
         nm.emotion_label,
         nm.da_reflection IS NOT NULL AS has_da,
         n.id AS note_id,
         nm.analysed_at
       FROM note_metadata nm
       JOIN notes n ON n.id = nm.note_id
       WHERE nm.analysed_at BETWEEN $1 AND $2
       ORDER BY nm.analysed_at ASC`,
      [start, end]
    )

    const rows = result.rows
    const withRolling = rows.map((row, i) => {
      const window = rows.slice(Math.max(0, i - 6), i + 1)
      const avg = window.reduce((sum, r) => sum + r.mood_score, 0) / window.length
      return { ...row, rolling_avg: Math.round(avg * 10) / 10 }
    })

    return NextResponse.json({ data: withRolling })
  } catch (err) {
    console.error('Mood timeline error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  } finally {
    client?.release()
  }
}
