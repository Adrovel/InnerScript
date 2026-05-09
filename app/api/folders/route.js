import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function GET() {
  let client
  try {
    client = await pool.connect()
    const result = await client.query(
      `SELECT id, name, parent_id FROM folders ORDER BY "createdAt" DESC`
    )
    return NextResponse.json({ folders: result.rows })
  } catch (err) {
    console.error('Error fetching folders:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  } finally {
    client?.release()
  }
}

export async function POST(req) {
  let client
  try {
    const { name, parent_id } = await req.json()
    client = await pool.connect()
    const res = await client.query(
      `INSERT INTO folders (name, parent_id) VALUES ($1, $2) RETURNING id, name`,
      [name || 'New Folder', parent_id || null]
    )
    return NextResponse.json({ folder: res.rows[0] }, { status: 201 })
  } catch (err) {
    console.error('Error creating folder:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  } finally {
    client?.release()
  }
}
