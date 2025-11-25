import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { readUsingPK, updateRecord, deleteRecord} from '@/lib/db/sequelize-query'

export async function GET(req, { params }) {
  try {
    const {id} = await params
    const folder = await readUsingPK(db.Folders, id)

    if (folder === null) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 })
    }

    return NextResponse.json({ folder })
  } 
  catch (err) {
    console.error('Error fetching folder:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(req, { params }) {
  try {
    const {id} = await params
    const { name } = await req.json()
    const folder = await updateRecord(db.Folders, { id }, { name })
    return NextResponse.json({ folder })
  }
  catch (err) {
    console.error('Error updating folder:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(req, { params }) {
  try {
    const {id} = await params
    const folder = await deleteRecord(db.Folders, { id })
    return NextResponse.json({ folder })
  }
  catch (err) {
    console.error('Error deleting folder:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
} 