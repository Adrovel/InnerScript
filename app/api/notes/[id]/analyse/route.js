import { NextResponse } from 'next/server'
import { Pool } from 'pg'
import { extractNoteMetadata } from '@/lib/ai/extract-note-metadata'
import { generateDaReflection } from '@/lib/ai/generate-da-reflection'
import { generateEmbedding } from '@/lib/ai/generate-embedding'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const MIN_WORD_COUNT = parseInt(process.env.ANALYSE_MIN_WORD_COUNT || '50', 10)

export async function POST(req, { params }) {
  if (process.env.ANALYSIS_ENABLED === 'false') {
    return NextResponse.json({ skipped: true, reason: 'disabled' })
  }

  let client
  try {
    const { id } = await params
    client = await pool.connect()

    const noteResult = await client.query(
      'SELECT id, title, content, analysis_disabled FROM notes WHERE id = $1',
      [id]
    )

    if (noteResult.rows.length === 0) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    }

    const note = noteResult.rows[0]

    if (note.analysis_disabled) {
      return NextResponse.json({ skipped: true, reason: 'disabled_per_note' })
    }

    const wordCount = (note.content || '').split(/\s+/).filter(Boolean).length
    if (wordCount < MIN_WORD_COUNT) {
      return NextResponse.json({ skipped: true, reason: 'too_short', wordCount })
    }

    const extracted = await extractNoteMetadata(note.content)
    if (!extracted) {
      return NextResponse.json({ error: 'Metadata extraction failed' }, { status: 500 })
    }

    const [daReflection, embeddingRaw] = await Promise.all([
      generateDaReflection(note.content, extracted.topics),
      generateEmbedding(note.content).catch((err) => {
        console.error('Embedding failed, skipping vector storage:', err.message)
        return null
      }),
    ])

    const embeddingVector = embeddingRaw ? `[${embeddingRaw.join(',')}]` : null

    await client.query(
      `INSERT INTO note_metadata
         (note_id, mood_score, arousal, emotion_label, topics, summary, da_reflection, embedding, analysed_at)
       VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7, $8::vector, NOW())
       ON CONFLICT (note_id) DO UPDATE SET
         mood_score = EXCLUDED.mood_score,
         arousal = EXCLUDED.arousal,
         emotion_label = EXCLUDED.emotion_label,
         topics = EXCLUDED.topics,
         summary = EXCLUDED.summary,
         da_reflection = EXCLUDED.da_reflection,
         embedding = EXCLUDED.embedding,
         analysed_at = NOW()`,
      [
        id,
        extracted.mood_score,
        extracted.arousal,
        extracted.emotion_label,
        JSON.stringify(extracted.topics),
        extracted.summary,
        daReflection,
        embeddingVector,
      ]
    )

    return NextResponse.json({
      metadata: {
        mood_score: extracted.mood_score,
        arousal: extracted.arousal,
        emotion_label: extracted.emotion_label,
        topics: extracted.topics,
        summary: extracted.summary,
        da_reflection: daReflection,
        analysed_at: new Date().toISOString(),
      }
    })
  } catch (err) {
    console.error('Analyse endpoint error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  } finally {
    client?.release()
  }
}
