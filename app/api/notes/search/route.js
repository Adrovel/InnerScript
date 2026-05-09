import { NextResponse } from 'next/server'
import { Pool } from 'pg'
import { generateEmbedding } from '@/lib/ai/generate-embedding'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function POST(req) {
  try {
    const { query } = await req.json()
    if (!query?.trim()) return NextResponse.json({ notes: [] })

    const embedding = await generateEmbedding(query)
    const vector = `[${embedding.join(',')}]`

    const client = await pool.connect()

    const result = await client.query(
      `SELECT n.id, n.title, n.content,
              1 - (nm.embedding <=> $1::vector) AS similarity
       FROM note_metadata nm
       JOIN notes n ON n.id = nm.note_id
       WHERE 1 - (nm.embedding <=> $1::vector) > 0.75
       ORDER BY nm.embedding <=> $1::vector
       LIMIT 10`,
      [vector]
    )

    if (result.rows.length > 0) {
      client.release()
      return NextResponse.json({ notes: result.rows, mode: 'semantic' })
    }

    const fallback = await client.query(
      `SELECT id, title, content, 0 AS similarity
       FROM notes
       WHERE title ILIKE $1 OR content ILIKE $1
       ORDER BY "createdAt" DESC
       LIMIT 10`,
      [`%${query}%`]
    )
    client.release()

    return NextResponse.json({ notes: fallback.rows, mode: 'fulltext' })
  } catch (err) {
    console.error('Search error:', err)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
