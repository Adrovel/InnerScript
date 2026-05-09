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

vi.mock('@ai-sdk/openai', () => ({ openai: vi.fn(() => 'mocked-model') }))
vi.mock('@/lib/ai/generate-embedding.js', () => ({ generateEmbedding: vi.fn() }))

const mockToDataStreamResponse = vi.fn(() => ({ _stream: true }))
vi.mock('ai', () => ({
  streamText: vi.fn(() => ({ toDataStreamResponse: mockToDataStreamResponse })),
}))

import { POST } from '@/app/api/chat/route.js'
import { generateEmbedding } from '@/lib/ai/generate-embedding.js'
import { streamText } from 'ai'

const userMessage = { role: 'user', content: 'What did I write about work?' }

beforeEach(() => {
  vi.clearAllMocks()
  mockConnect.mockResolvedValue({ query: mockQuery, release: mockRelease })
})

describe('POST /api/chat', () => {
  it('streams response without context when no noteIDs provided', async () => {
    const req = { json: async () => ({ messages: [userMessage], noteIDs: [] }) }

    const res = await POST(req)

    expect(streamText).toHaveBeenCalledOnce()
    expect(mockConnect).not.toHaveBeenCalled()
    expect(res).toEqual({ _stream: true })
  })

  it('enriches message with note context when noteIDs provided', async () => {
    generateEmbedding.mockResolvedValueOnce(Array(1536).fill(0.1))
    mockQuery.mockResolvedValueOnce({
      rows: [{ content: 'I worked hard today', similarity: 0.9 }],
    })

    const req = { json: async () => ({ messages: [userMessage], noteIDs: ['id-1'] }) }
    await POST(req)

    const call = streamText.mock.calls[0][0]
    const lastMsg = call.messages[call.messages.length - 1]
    expect(lastMsg.content).toContain('I worked hard today')
    expect(lastMsg.content).toContain(userMessage.content)
  })

  it('proceeds without context when embedding fails', async () => {
    generateEmbedding.mockRejectedValueOnce(new Error('Embedding down'))

    const req = { json: async () => ({ messages: [userMessage], noteIDs: ['id-1'] }) }
    await POST(req)

    // streamText still called — graceful degradation
    expect(streamText).toHaveBeenCalledOnce()
    const call = streamText.mock.calls[0][0]
    const lastMsg = call.messages[call.messages.length - 1]
    expect(lastMsg.content).toBe(userMessage.content) // original, not enriched
  })

  it('handles message with no content (empty string fallback)', async () => {
    const req = { json: async () => ({ messages: [{ role: 'user', content: '' }], noteIDs: [] }) }
    await POST(req)
    // userQuestion is '' so no context fetch, streamText still called
    expect(streamText).toHaveBeenCalledOnce()
    expect(mockConnect).not.toHaveBeenCalled()
  })

  it('returns 500 when streamText throws', async () => {
    streamText.mockImplementationOnce(() => { throw new Error('AI error') })
    const req = { json: async () => ({ messages: [userMessage], noteIDs: [] }) }

    const res = await POST(req)

    expect(res.status).toBe(500)
  })

  it('releases DB client after context fetch even if query throws', async () => {
    generateEmbedding.mockResolvedValueOnce(Array(1536).fill(0.1))
    mockQuery.mockRejectedValueOnce(new Error('DB error'))

    const req = { json: async () => ({ messages: [userMessage], noteIDs: ['id-1'] }) }
    await POST(req)

    expect(mockRelease).toHaveBeenCalled()
  })
})
