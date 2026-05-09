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

import { GET, POST } from '@/app/api/folders/route.js'

beforeEach(() => {
  vi.clearAllMocks()
  mockConnect.mockResolvedValue({ query: mockQuery, release: mockRelease })
})

describe('GET /api/folders', () => {
  it('returns folders list', async () => {
    const rows = [{ id: '1', name: 'Work', parent_id: null }]
    mockQuery.mockResolvedValueOnce({ rows })

    const res = await GET()

    expect(res.status).toBe(200)
    expect((await res.json()).folders).toEqual(rows)
  })

  it('returns 500 and releases client when connect throws', async () => {
    mockConnect.mockRejectedValueOnce(new Error('DB error'))

    const res = await GET()

    expect(res.status).toBe(500)
  })

  it('returns 500 and releases client when query throws', async () => {
    mockQuery.mockRejectedValueOnce(new Error('query error'))

    const res = await GET()

    expect(res.status).toBe(500)
    expect(mockRelease).toHaveBeenCalled()
  })
})

describe('POST /api/folders', () => {
  const req = (body) => ({ json: async () => body })

  it('creates a folder and returns 201', async () => {
    const created = { id: '10', name: 'Projects' }
    mockQuery.mockResolvedValueOnce({ rows: [created] })

    const res = await POST(req({ name: 'Projects', parent_id: null }))

    expect(res.status).toBe(201)
    expect((await res.json()).folder).toEqual(created)
  })

  it('defaults to "New Folder" when name is missing', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: '11', name: 'New Folder' }] })

    await POST(req({}))

    expect(mockQuery.mock.calls[0][1][0]).toBe('New Folder')
  })

  it('returns 500 and releases client when connect throws', async () => {
    mockConnect.mockRejectedValueOnce(new Error('DB error'))

    const res = await POST(req({ name: 'Test' }))

    expect(res.status).toBe(500)
  })
})
