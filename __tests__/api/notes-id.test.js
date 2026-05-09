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

import { GET, PUT, DELETE } from '@/app/api/notes/[id]/route.js'

const fakeParams = (id) => ({ params: Promise.resolve({ id }) })

beforeEach(() => {
  vi.clearAllMocks()
  mockConnect.mockResolvedValue({ query: mockQuery, release: mockRelease })
})

describe('GET /api/notes/[id]', () => {
  it('returns the note when found', async () => {
    const note = { id: 1, title: 'Test', content: 'Hello', folder_id: null, analysis_disabled: false }
    mockQuery.mockResolvedValueOnce({ rows: [note] })

    const res = await GET({}, fakeParams('1'))

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.note).toEqual(note)
  })

  it('returns 404 when note not found', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] })

    const res = await GET({}, fakeParams('999'))

    expect(res.status).toBe(404)
    const body = await res.json()
    expect(body.error).toBe('Note not found')
  })
})

describe('PUT /api/notes/[id]', () => {
  function mockRequest(body) {
    return { json: async () => body }
  }

  it('updates the note and returns it', async () => {
    const updated = { id: 1, title: 'Updated', content: 'New content' }
    mockQuery.mockResolvedValueOnce({ rows: [updated] })

    const res = await PUT(mockRequest({ title: 'Updated', content: 'New content' }), fakeParams('1'))

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.note).toEqual(updated)
  })

  it('returns 404 when update target not found', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] })

    const res = await PUT(mockRequest({ title: 'X', content: 'Y' }), fakeParams('999'))

    expect(res.status).toBe(404)
  })
})

describe('DELETE /api/notes/[id]', () => {
  it('deletes the note and returns success message', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 1 }] })

    const res = await DELETE({}, fakeParams('1'))

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.message).toBe('Note deleted')
  })

  it('returns 404 when note to delete does not exist', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] })

    const res = await DELETE({}, fakeParams('999'))

    expect(res.status).toBe(404)
  })
})
