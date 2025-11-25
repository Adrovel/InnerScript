import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { readUsingPK, updateRecord, deleteRecord} from '@/lib/db/sequelize-query'

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
    const { title } = await req.json()
    const note = await updateRecord(db.Notes, { id }, { title })
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