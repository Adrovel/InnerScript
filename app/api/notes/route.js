import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function POST(req) {
  try {
    const {name, content} = await req.json()
    console.log('Creating note:', (name, content))

    const client = await pool.connect()
    const insertQuery = `
      INSERT INTO notes (name, content)
      VALUES ($1, $2)
      RETURNING id, name, content
    `
    const res = await client.query(insertQuery, [name, content])
    client.release()
    console.log('Insert result:', res.rows[0])

    return NextResponse.json({ message: 'Note created successfully', note: res.rows[0] }, {status: 201})
  }
  catch (err) {
    console.error('Error creating note:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}