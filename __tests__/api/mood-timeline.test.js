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

import { GET } from '@/app/api/insights/mood-timeline/route.js'

function makeRequest(params = {}) {
  const url = new URL('http://localhost/api/insights/mood-timeline')
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  return { url: url.toString() }
}

function makeRow(date, mood_score, has_da = false) {
  return { date, mood_score, emotion_label: 'neutral', has_da, note_id: 1, analysed_at: date }
}

beforeEach(() => {
  vi.clearAllMocks()
  mockConnect.mockResolvedValue({ query: mockQuery, release: mockRelease })
})

describe('GET /api/insights/mood-timeline', () => {
  it('returns rows with rolling_avg computed', async () => {
    const rows = [
      makeRow('2026-05-01', 6),
      makeRow('2026-05-02', 8),
      makeRow('2026-05-03', 4),
    ]
    mockQuery.mockResolvedValueOnce({ rows })

    const res = await GET(makeRequest())

    const body = await res.json()
    expect(body.data).toHaveLength(3)
    expect(body.data[0].rolling_avg).toBe(6)   // window [6]: avg=6
    expect(body.data[1].rolling_avg).toBe(7)   // window [6,8]: avg=7
    expect(body.data[2].rolling_avg).toBe(6)   // window [6,8,4]: avg=6
  })

  it('7-day window caps at 7 entries', async () => {
    const rows = Array.from({ length: 8 }, (_, i) =>
      makeRow(`2026-05-0${i + 1}`, 10)
    )
    mockQuery.mockResolvedValueOnce({ rows })

    const res = await GET(makeRequest())

    const body = await res.json()
    body.data.forEach((d) => expect(d.rolling_avg).toBe(10))
  })

  it('returns empty data array when no rows', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] })

    const res = await GET(makeRequest())

    const body = await res.json()
    expect(body.data).toEqual([])
  })

  it('returns 500 on DB error', async () => {
    mockConnect.mockRejectedValueOnce(new Error('DB error'))

    const res = await GET(makeRequest())

    expect(res.status).toBe(500)
  })
})
