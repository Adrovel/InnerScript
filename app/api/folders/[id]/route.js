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

    return NextResponse.json({"folder": res.rows[0], "message": "Folder fetched successfully"}, {status: 200})
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
      RETURNING id, name, parent_folder_id
    `
    const res = await client.query(query, [id])
    client.release()

    if (res.rows.length === 0) {
      return NextResponse.json({"message": "Folder does not exist."}, {status: 404})
    }
    console.log("Result DELETE folder:", res.rows[0])

    return NextResponse.json({"folder": res.rows[0], "message": "Folder deleted successfully"}, {status: 200})
  }
  catch (err) {
    console.error("Error deleting folder:", err)
    return NextResponse.json({"error": "Internal Server Error"}, {status: 500})
  }  
}

export async function PUT(req, { params}) {
  try {
    const {id} = await params
    const {name, parent_folder_id} = await req.json()
    console.log('Updating folder:', {id, name, parent_folder_id})

    const updates = []
    const values = []
    let paramCount = 1

    if (name !== undefined) {
      updates.push(`name = $${paramCount}`)
      values.push(name)
      paramCount++
    }

    if (parent_folder_id !== undefined) {
      updates.push(`parent_folder_id = $${paramCount}`)
      values.push(parent_folder_id)
      paramCount++
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`)

    if (updates.length === 1) { 
      return NextResponse.json({ error: 'At least one field (name or parent_folder_id) is required' }, { status: 400 })
    }

    values.push(id)

    const client = await pool.connect()
    const updateQuery = `
      UPDATE folders 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, name, parent_folder_id, updated_at
    `

    const res = await client.query(updateQuery, values)
    client.release()

    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      message: 'Folder updated successfully', 
      folder: res.rows[0] 
    }, { status: 200 })
  }
  catch (err) {
    console.error('Error updating folder:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}