import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { readRecordsWithOptions } from '@/lib/db/sequelize-query'

export async function GET(req) {
  try {
    const tags = await readRecordsWithOptions(db.Tags, {
      attributes: ['id', 'name', 'slug', 'color', 'icon', 'display_order'],
      order: [['display_order', 'ASC']]
    })

    return NextResponse.json({ tags }, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      }
    })
  } catch (err) {
    console.error('Error fetching tags:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
