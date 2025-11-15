import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { readUsingPK } from '@/lib/db/sequelize-query'

export async function GET(req, { params }) {
  
  try {
    const {id} = await params
    const note = await readUsingPK(db.Notes, id)

    if (note === null) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    }

    // console.log('Result', note)
    return NextResponse.json({ note })
  } 
  catch (err) {
    console.error('Error fetching note:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}