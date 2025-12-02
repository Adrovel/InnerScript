import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { readUsingPK, updateAndFetchRecord, deleteRecord} from '@/lib/db/sequelize-query'

export async function GET(req, { params }) {
  try {
    const {id} = await params

    // Use findByPk with eager loading to include tags
    const note = await db.Notes.findByPk(id, {
      include: [
        {
          model: db.Tags,
          as: 'tags',
          attributes: ['id', 'name', 'slug', 'color', 'icon'],
          through: { attributes: [] }
        }
      ]
    })

    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    }

    return NextResponse.json({ note: note.toJSON() })
  }
  catch (err) {
    console.error('Error fetching note:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(req, { params }) {
  try {
    const {id} = await params
    const { title, content, content_json, tag_ids } = await req.json()

    const note = await db.Notes.findByPk(id)
    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    }

    // Update note fields
    const updateData = {}
    if (title !== undefined) updateData.title = title
    if (content !== undefined) updateData.content = content
    if (content_json !== undefined) updateData.content_json = content_json

    if (Object.keys(updateData).length > 0) {
      await note.update(updateData)
    }

    // Update tags if provided
    if (tag_ids !== undefined) {
      if (!Array.isArray(tag_ids)) {
        return NextResponse.json({ error: 'tag_ids must be an array' }, { status: 400 })
      }

      // Validate tag IDs exist
      if (tag_ids.length > 0) {
        const existingTags = await db.Tags.findAll({
          where: { id: tag_ids },
          attributes: ['id']
        })

        if (existingTags.length !== tag_ids.length) {
          return NextResponse.json({ error: 'One or more invalid tag IDs' }, { status: 400 })
        }
      }

      // Sequelize's setTags handles add/remove automatically
      await note.setTags(tag_ids)
    }

    // Fetch updated note with tags
    const updatedNote = await db.Notes.findByPk(id, {
      include: [
        {
          model: db.Tags,
          as: 'tags',
          attributes: ['id', 'name', 'slug', 'color', 'icon'],
          through: { attributes: [] }
        }
      ]
    })

    return NextResponse.json({ note: updatedNote.toJSON() })
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