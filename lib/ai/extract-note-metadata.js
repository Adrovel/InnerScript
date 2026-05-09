import { generateObject } from 'ai'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'

const metadataSchema = z.object({
  mood_score: z.number().min(1).max(10),
  arousal: z.enum(['calm', 'energised', 'tense', 'neutral']),
  emotion_label: z.string(),
  topics: z.array(z.string()).max(5),
  summary: z.string(),
})

/**
 * Extract structured emotional metadata from a journal entry.
 * @param {string} content
 * @returns {Promise<{mood_score, arousal, emotion_label, topics, summary}|null>}
 */
export async function extractNoteMetadata(content) {
  try {
    const { object } = await generateObject({
      model: openai('gpt-4o-mini'),
      schema: metadataSchema,
      system: `You are an empathetic journaling analyst. Analyse the emotional content of this journal entry.
mood_score is valence 1–10 (1=very negative, 10=very positive).
arousal is one of: calm, energised, tense, neutral.
emotion_label is the primary emotion (joy, sadness, anxiety, anger, gratitude, frustration, neutral).
topics are up to 5 lowercase semantic themes (e.g. work, sleep, family, health).
summary is one sentence describing the entry's main subject and emotional tone.`,
      prompt: content,
    })
    return object
  } catch (err) {
    console.error('Metadata extraction failed:', err.message)
    return null
  }
}
