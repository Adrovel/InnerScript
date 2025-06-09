/* 
- GET : Retrieves all folders. 
- POST : Creates a new folder.
*/

import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function GET() {
  try {
    const client = await pool.connect()

    const query = `
      SELECT id, name, parent_folder_id 
      FROM folders 
      ORDER BY created_at DESC
    `
    const result = await client.query(query)
    client.release()

    return NextResponse.json({ folders: result.rows })
  } catch (err) {
    console.error('Error fetching folders:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const { name, parent_folder_id } = await req.json()
    console.log('Creating folder:', {name, parent_folder_id})

    const client = await pool.connect()
    const query = `
      INSERT INTO folders (name, parent_folder_id)
      VALUES ($1, $2)
      RETURNING id, name
    `
    const res = await client.query(query, [name, parent_folder_id])
    client.release()
    console.log('Result', res.rows[0])

    return NextResponse.json({ message: 'Folder created successfully', folder: res.rows[0] }, { status: 200 })
  }
  catch (err) {
    console.error('Error creating new folder', err)
    return NextResponse.json({ error: 'Internal Server Error'}, { status: 500 })
  }
}