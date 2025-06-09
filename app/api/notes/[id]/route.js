import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function GET(req, { params }) {
  
  try {
    const {id} = await params

    const client = await pool.connect()
    const fileQuery = `
      SELECT id, name, content 
      FROM notes 
      WHERE id=$1
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

export async function PUT(req, { params}) {
  try {
    const {id} = await params
    const {name, content} = await req.json()
    console.log('Updating note:', {id, name, content})

    const client = await pool.connect()
    const updateQuery = `
      UPDATE notes 
      SET name=$1, content=$2 
      WHERE id=$3
      RETURNING id, name, content
    `
    const res = await client.query(updateQuery, [name, content, id])
    console.log('Update result:', res.rows[0])
    client.release()

    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Note updated successfully' }, { status: 200 })
  }
  catch (err) {
    console.error('Error updating note:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(req, { params}) {
  try {
    const {id} = await params
    console.log('Deleting note:', id)

    const client = await pool.connect()
    const deleteQuery = `
      DELETE FROM notes
      WHERE id=$1
      RETURNING id
    `
    const res = await client.query(deleteQuery, [id])
    client.release()
    console.log('Delete result:', res.rows[0])

    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Note deleted successfully' }, { status: 200 })
  }
  catch (err) {
    console.error('Error deleting note:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}