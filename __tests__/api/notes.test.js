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

import { GET, POST } from '@/app/api/notes/route.js'

beforeEach(() => {
  vi.clearAllMocks()
  mockConnect.mockResolvedValue({ query: mockQuery, release: mockRelease })
})

describe('GET /api/notes', () => {
  it('returns notes list with status 200', async () => {
    const rows = [{ id: 1, title: 'My Note', folder_id: null, createdAt: '2026-05-08' }]
    mockQuery.mockResolvedValueOnce({ rows })

    const res = await GET()

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.notes).toEqual(rows)
  })

  it('returns 500 when DB connect throws', async () => {
    mockConnect.mockRejectedValueOnce(new Error('Connection refused'))

    const res = await GET()

    expect(res.status).toBe(500)
    const body = await res.json()
    expect(body.error).toBe('Internal Server Error')
  })
})

describe('POST /api/notes', () => {
  function mockRequest(body) {
    return { json: async () => body }
  }

  it('creates a note and returns 201', async () => {
    const created = { id: 5, title: 'New Note', content: 'Hello', folder_id: null }
    mockQuery.mockResolvedValueOnce({ rows: [created] })

    const res = await POST(mockRequest({ title: 'New Note', content: 'Hello' }))

    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.note).toEqual(created)
  })

  it('falls back to "Untitled Note" when title is missing', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 6, title: 'Untitled Note', content: '', folder_id: null }] })

    await POST(mockRequest({ content: 'Some content' }))

    const queryArgs = mockQuery.mock.calls[0]
    expect(queryArgs[1][0]).toBe('Untitled Note')
  })

  it('returns 500 on DB connect error', async () => {
    mockConnect.mockRejectedValueOnce(new Error('DB error'))

    const res = await POST(mockRequest({ title: 'Test' }))

    expect(res.status).toBe(500)
  })
})
