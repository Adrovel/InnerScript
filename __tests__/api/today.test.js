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

import { GET } from '@/app/api/notes/today/route.js'

const todayDate = new Date().toISOString().split('T')[0]

beforeEach(() => {
  vi.clearAllMocks()
  mockConnect.mockResolvedValue({ query: mockQuery, release: mockRelease })
})

describe('GET /api/notes/today', () => {
  it('returns existing today note when found', async () => {
    const existingNote = { id: 10, title: todayDate, content: 'existing content' }
    mockQuery.mockResolvedValueOnce({ rows: [existingNote] })

    const res = await GET()

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.note).toEqual(existingNote)
  })

  it('creates a new note when none exists for today', async () => {
    const createdNote = { id: 11, title: todayDate, content: '' }
    mockQuery
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [createdNote] })

    const res = await GET()

    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.note).toEqual(createdNote)
    expect(body.created).toBe(true)
  })

  it("queries using today's ISO date as title", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 1, title: todayDate, content: '' }] })

    await GET()

    const queryArgs = mockQuery.mock.calls[0]
    expect(queryArgs[1][0]).toBe(todayDate)
  })

  it('returns 500 on DB error', async () => {
    mockConnect.mockRejectedValueOnce(new Error('DB unreachable'))

    const res = await GET()

    expect(res.status).toBe(500)
    const body = await res.json()
    expect(body.error).toBe('Internal Server Error')
  })
})
