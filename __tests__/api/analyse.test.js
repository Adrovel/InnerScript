import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockQuery, mockRelease, mockConnect } = vi.hoisted(() => {
  const mockQuery = vi.fn()
  const mockRelease = vi.fn()
  const mockConnect = vi.fn(() => Promise.resolve({ query: mockQuery, release: mockRelease }))
  return { mockQuery, mockRelease, mockConnect }
})

vi.mock('pg', () => ({
  Pool: class Pool {
    connect = mockConnect
  },
}))

vi.mock('next/server', () => ({
  NextResponse: {
    json: (body, init) => ({
      _body: body,
      status: init?.status ?? 200,
      json: async () => body,
    }),
  },
}))

vi.mock('@/lib/ai/extract-note-metadata.js', () => ({
  extractNoteMetadata: vi.fn(),
}))
vi.mock('@/lib/ai/generate-da-reflection.js', () => ({
  generateDaReflection: vi.fn(),
}))
vi.mock('@/lib/ai/generate-embedding.js', () => ({
  generateEmbedding: vi.fn(),
}))

import { POST } from '@/app/api/notes/[id]/analyse/route.js'
import { extractNoteMetadata } from '@/lib/ai/extract-note-metadata.js'
import { generateDaReflection } from '@/lib/ai/generate-da-reflection.js'
import { generateEmbedding } from '@/lib/ai/generate-embedding.js'

const fakeParams = (id) => ({ params: Promise.resolve({ id }) })
const longContent = 'word '.repeat(60).trim()

const fakeMetadata = {
  mood_score: 7,
  arousal: 'calm',
  emotion_label: 'gratitude',
  topics: ['work', 'health'],
  summary: 'A productive day.',
}

beforeEach(() => {
  vi.clearAllMocks()
  delete process.env.ANALYSIS_ENABLED
  delete process.env.ANALYSE_MIN_WORD_COUNT
  mockConnect.mockResolvedValue({ query: mockQuery, release: mockRelease })
})

describe('POST /api/notes/[id]/analyse', () => {
  it('skips when ANALYSIS_ENABLED=false', async () => {
    process.env.ANALYSIS_ENABLED = 'false'

    const res = await POST({}, fakeParams('1'))

    const body = await res.json()
    expect(body.skipped).toBe(true)
    expect(body.reason).toBe('disabled')
  })

  it('returns 404 when note not found', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] })

    const res = await POST({}, fakeParams('999'))

    expect(res.status).toBe(404)
  })

  it('skips when note has analysis_disabled=true', async () => {
    mockQuery.mockResolvedValueOnce({
      rows: [{ id: 1, content: longContent, analysis_disabled: true }],
    })

    const res = await POST({}, fakeParams('1'))

    const body = await res.json()
    expect(body.skipped).toBe(true)
    expect(body.reason).toBe('disabled_per_note')
  })

  it('skips when content is below min word count', async () => {
    mockQuery.mockResolvedValueOnce({
      rows: [{ id: 1, content: 'too short', analysis_disabled: false }],
    })

    const res = await POST({}, fakeParams('1'))

    const body = await res.json()
    expect(body.skipped).toBe(true)
    expect(body.reason).toBe('too_short')
  })

  it('runs full pipeline and returns metadata', async () => {
    mockQuery
      .mockResolvedValueOnce({ rows: [{ id: 1, content: longContent, analysis_disabled: false }] })
      .mockResolvedValueOnce({ rows: [] }) // upsert

    extractNoteMetadata.mockResolvedValueOnce(fakeMetadata)
    generateDaReflection.mockResolvedValueOnce('What if you are wrong about this?')
    generateEmbedding.mockResolvedValueOnce(Array(1536).fill(0.1))

    const res = await POST({}, fakeParams('1'))

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.metadata.mood_score).toBe(7)
    expect(body.metadata.da_reflection).toBe('What if you are wrong about this?')
    expect(body.metadata.topics).toEqual(['work', 'health'])
  })

  it('returns 500 when metadata extraction fails', async () => {
    mockQuery.mockResolvedValueOnce({
      rows: [{ id: 1, content: longContent, analysis_disabled: false }],
    })
    extractNoteMetadata.mockResolvedValueOnce(null)

    const res = await POST({}, fakeParams('1'))

    expect(res.status).toBe(500)
    const body = await res.json()
    expect(body.error).toBe('Metadata extraction failed')
  })

  it('succeeds even when embedding generation fails', async () => {
    mockQuery
      .mockResolvedValueOnce({ rows: [{ id: 1, content: longContent, analysis_disabled: false }] })
      .mockResolvedValueOnce({ rows: [] }) // upsert

    extractNoteMetadata.mockResolvedValueOnce(fakeMetadata)
    generateDaReflection.mockResolvedValueOnce('A good challenge.')
    generateEmbedding.mockRejectedValueOnce(new Error('Embedding API down'))

    const res = await POST({}, fakeParams('1'))

    // Should still succeed — embedding failure is non-fatal
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.metadata.mood_score).toBe(7)
  })
})
