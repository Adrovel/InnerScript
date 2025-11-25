import { NextResponse } from 'next/server'

import { db } from '@/lib/db'
import { createRecord } from '@/lib/db/sequelize-query'

export async function POST(req) {
  try {
    const { name, parent_id } = await req.json()
    console.log('Creating folder:', {name, parent_id})

    const folder = await createRecord(db.Folders, {
      name: name,
      parent_id: parent_id === '' ? null : parent_id
    })

    return NextResponse.json({ message: 'Folder created successfully', folder }, { status: 201 })
  }
  catch (error) {
    console.error('Error creating new folder', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}