import { NextResponse } from 'next/server'

import { db } from '@/lib/db'
import { createRecord } from '@/lib/db/sequelize-query'

export async function POST(req) {
  try {
    const {title, content, content_json, folder_id} = await req.json()
    console.log('Creating note:', {title, content, content_json, folder_id})

    const note = await createRecord(db.Notes, {
      title: title, 
      content: content, 
      content_json: content_json,
      folder_id: folder_id === '' ? null : folder_id
    })

    return NextResponse.json({ message: 'Note created successfully', note }, {status: 201})
  }
  catch (err) {
    console.error('Error creating note:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}