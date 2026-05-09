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

vi.mock('@/lib/ai/generate-embedding.js', () => ({ generateEmbedding: vi.fn() }))

import { POST } from '@/app/api/notes/search/route.js'
import { generateEmbedding } from '@/lib/ai/generate-embedding.js'

const fakeEmbedding = Array(1536).fill(0.1)

beforeEach(() => {
  vi.clearAllMocks()
  mockConnect.mockResolvedValue({ query: mockQuery, release: mockRelease })
})

describe('POST /api/notes/search', () => {
  it('returns empty array for blank query without hitting DB', async () => {
    const res = await POST({ json: async () => ({ query: '   ' }) })
    const body = await res.json()
    expect(body.notes).toEqual([])
    expect(mockConnect).not.toHaveBeenCalled()
  })

  it('returns semantic results when similarity hits found', async () => {
    generateEmbedding.mockResolvedValueOnce(fakeEmbedding)
    const rows = [{ id: '1', title: 'Note', content: 'content', similarity: 0.9 }]
    mockQuery.mockResolvedValueOnce({ rows })

    const res = await POST({ json: async () => ({ query: 'journal' }) })
    const body = await res.json()

    expect(body.mode).toBe('semantic')
    expect(body.notes).toEqual(rows)
  })

  it('falls back to fulltext when no semantic hits', async () => {
    generateEmbedding.mockResolvedValueOnce(fakeEmbedding)
    mockQuery
      .mockResolvedValueOnce({ rows: [] })       // semantic: no hits
      .mockResolvedValueOnce({ rows: [{ id: '2', title: 'Another', content: 'text', similarity: 0 }] })

    const res = await POST({ json: async () => ({ query: 'journal' }) })
    const body = await res.json()

    expect(body.mode).toBe('fulltext')
    expect(body.notes).toHaveLength(1)
  })

  it('returns 500 when generateEmbedding throws', async () => {
    generateEmbedding.mockRejectedValueOnce(new Error('Embedding failed'))

    const res = await POST({ json: async () => ({ query: 'something' }) })

    expect(res.status).toBe(500)
  })

  it('returns 500 when DB connect throws', async () => {
    generateEmbedding.mockResolvedValueOnce(fakeEmbedding)
    mockConnect.mockRejectedValueOnce(new Error('DB down'))

    const res = await POST({ json: async () => ({ query: 'test' }) })

    expect(res.status).toBe(500)
  })

  it('releases pool client even when fulltext query throws', async () => {
    generateEmbedding.mockResolvedValueOnce(fakeEmbedding)
    mockQuery
      .mockResolvedValueOnce({ rows: [] })
      .mockRejectedValueOnce(new Error('fulltext error'))

    const res = await POST({ json: async () => ({ query: 'test' }) })

    expect(res.status).toBe(500)
    expect(mockRelease).toHaveBeenCalled()
  })
})
