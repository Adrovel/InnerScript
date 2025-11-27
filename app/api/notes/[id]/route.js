import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { readUsingPK, updateAndFetchRecord, deleteRecord} from '@/lib/db/sequelize-query'

export async function GET(req, { params }) {
  try {
    const {id} = await params
    const note = await readUsingPK(db.Notes, id)

    if (note === null) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    }

    return NextResponse.json({ note })
  } 
  catch (err) {
    console.error('Error fetching note:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(req, { params }) {
  try {
    const {id} = await params
    const { title, content, content_json } = await req.json()
    
    // Build update object with only provided fields
    const updateData = {}
    if (title !== undefined) updateData.title = title
    if (content !== undefined) updateData.content = content
    if (content_json !== undefined) updateData.content_json = content_json
    
    const note = await updateAndFetchRecord(db.Notes, { id }, updateData)
    
    if (note === null) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    }
    
    return NextResponse.json({ note })
  }
  catch (err) {
    console.error('Error updating note:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(req, { params }) {
  try {
    const {id} = await params
    const note = await deleteRecord(db.Notes, { id })
    return NextResponse.json({ note })
  }
  catch (err) {
    console.error('Error deleting note:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}