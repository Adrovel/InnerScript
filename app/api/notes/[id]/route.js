import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export async function GET(req, { params }) {
  
  try {
    const {id} = await params

    const client = await pool.connect()
    const fileQuery = `
      SELECT id, name, content FROM notes WHERE id=$1
    `
    const result = await client.query(fileQuery, [id])
    client.release()

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    }

    const note = result.rows[0]
    console.log('Result', note)
    return NextResponse.json({ note })
   } 
  catch (err) {
    console.error('Error fetching note:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}