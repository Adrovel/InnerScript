/*
What are the endpoints for this API?
- GET : Retrieve specific folder.
- DELETE : Deletes a folder by ID.
- PUT : Updates a folder name by ID.
*/

import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function GET(req, {params}) {
  try {
    const {id} = await params

    const client = await pool.connect()
    const query = `
      SELECT * FROM folders
      WHERE id=$1
    `
    const res = await client.query(query, [id])
    client.release()

    if (res.rows.length === 0) {
      return NextResponse.json({"message": "Folder does not exist."}, {status: 404})
    }
    console.log("Result GET folder:", res.rows[0])

    return NextResponse.json({"folder": res.rows[0], "message": "Folder fetched succefully"}, {status: 200})
  }
  catch (err) {
    console.error("Error fetching data:", err)
    return NextResponse.json({"error": "Internal Server Error"}, {status: 500})
  }
}

export async function DELETE(req, {params}) {
  try {
    const {id} = await params

    const client = await pool.connect()
    const query = `
      DELETE FROM folders
      WHERE id=$1
      RETURNING (id, name, parent_folder_id)
    `
    const res = await client.query(query, [id])
    client.release()

    if (res.rows.length === 0) {
      return NextResponse.json({"message": "Folder does not exist."}, {status: 404})
    }
    console.log("Result DELETE folder:", res.rows[0])

    return NextResponse.json({"folder": res.rows[0], "message": "Folder deleted succefully"}, {status: 200})
  }
  catch (err) {
    console.error("Error fetching data:", err)
    return NextResponse.json({"error": "Internal Server Error"}, {status: 500})
  }  
}

export async function PUT(req, { params}) {
  try {
    const {id} = await params
    const {name} = await req.json()
    console.log('Updating folder:', {id, name})

    const client = await pool.connect()
    const updateQuery = `
      UPDATE folders 
      SET name=$1, updated_at=CURRENT_TIMESTAMP
      WHERE id=$2
      RETURNING id, name
    `
    const res = await client.query(updateQuery, [name, id])
    console.log('Update result:', res.rows[0])
    client.release()

    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Note updated successfully', folder: res.rows[0] }, { status: 200 })
  }
  catch (err) {
    console.error('Error updating note:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}