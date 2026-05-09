import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('ai', () => ({
  generateObject: vi.fn(),
}))
vi.mock('@ai-sdk/openai', () => ({
  openai: vi.fn(() => 'mocked-model'),
}))

import { generateObject } from 'ai'
import { extractNoteMetadata } from '@/lib/ai/extract-note-metadata.js'

const validMetadata = {
  mood_score: 7,
  arousal: 'calm',
  emotion_label: 'gratitude',
  topics: ['work', 'health'],
  summary: 'A productive day with a sense of accomplishment.',
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('extractNoteMetadata', () => {
  it('returns structured metadata from generateObject', async () => {
    generateObject.mockResolvedValueOnce({ object: validMetadata })

    const result = await extractNoteMetadata('I had a great day at work.')

    expect(result).toEqual(validMetadata)
    expect(generateObject).toHaveBeenCalledOnce()
    expect(generateObject).toHaveBeenCalledWith(
      expect.objectContaining({ prompt: 'I had a great day at work.' })
    )
  })

  it('returns null when generateObject throws', async () => {
    generateObject.mockRejectedValueOnce(new Error('API timeout'))

    const result = await extractNoteMetadata('Some content.')

    expect(result).toBeNull()
  })

  it('passes content as the prompt', async () => {
    generateObject.mockResolvedValueOnce({ object: validMetadata })
    const content = 'Feeling anxious about the presentation tomorrow.'

    await extractNoteMetadata(content)

    const call = generateObject.mock.calls[0][0]
    expect(call.prompt).toBe(content)
  })

  it('uses a schema with mood_score bounded 1-10', async () => {
    generateObject.mockResolvedValueOnce({ object: validMetadata })
    await extractNoteMetadata('test content')

    const call = generateObject.mock.calls[0][0]
    expect(call.schema).toBeDefined()
    // Schema should reject mood_score outside 1-10
    const parseResult = call.schema.safeParse({ ...validMetadata, mood_score: 11 })
    expect(parseResult.success).toBe(false)
  })
})
