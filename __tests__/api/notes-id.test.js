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
    const note = { id: '1', title: 'Test', content: 'Hello', folder_id: null, analysis_disabled: false }
    mockQuery.mockResolvedValueOnce({ rows: [note] })

    const res = await GET({}, fakeParams('1'))

    expect(res.status).toBe(200)
    expect((await res.json()).note).toEqual(note)
  })

  it('returns 404 when note not found', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] })

    const res = await GET({}, fakeParams('999'))

    expect(res.status).toBe(404)
    expect((await res.json()).error).toBe('Note not found')
  })

  it('returns 500 when DB connect throws', async () => {
    mockConnect.mockRejectedValueOnce(new Error('connect failed'))

    const res = await GET({}, fakeParams('1'))

    expect(res.status).toBe(500)
  })

  it('returns 500 when query throws', async () => {
    mockQuery.mockRejectedValueOnce(new Error('query failed'))

    const res = await GET({}, fakeParams('1'))

    expect(res.status).toBe(500)
  })
})

describe('PUT /api/notes/[id]', () => {
  const req = (body) => ({ json: async () => body })

  it('updates the note and returns it', async () => {
    const updated = { id: '1', title: 'Updated', content: 'New content' }
    mockQuery.mockResolvedValueOnce({ rows: [updated] })

    const res = await PUT(req({ title: 'Updated', content: 'New content' }), fakeParams('1'))

    expect(res.status).toBe(200)
    expect((await res.json()).note).toEqual(updated)
  })

  it('returns 404 when note not found', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] })

    const res = await PUT(req({ title: 'X', content: 'Y' }), fakeParams('999'))

    expect(res.status).toBe(404)
  })

  it('returns 500 when DB connect throws', async () => {
    mockConnect.mockRejectedValueOnce(new Error('connect failed'))

    const res = await PUT(req({ title: 'X', content: 'Y' }), fakeParams('1'))

    expect(res.status).toBe(500)
  })
})

describe('DELETE /api/notes/[id]', () => {
  it('deletes the note and returns success', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: '1' }] })

    const res = await DELETE({}, fakeParams('1'))

    expect(res.status).toBe(200)
    expect((await res.json()).message).toBe('Note deleted')
  })

  it('returns 404 when note does not exist', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] })

    const res = await DELETE({}, fakeParams('999'))

    expect(res.status).toBe(404)
  })

  it('returns 500 when DB connect throws', async () => {
    mockConnect.mockRejectedValueOnce(new Error('connect failed'))

    const res = await DELETE({}, fakeParams('1'))

    expect(res.status).toBe(500)
  })
})
