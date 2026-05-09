import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('ai', () => ({
  embed: vi.fn(),
}))
vi.mock('@ai-sdk/openai', () => ({
  openai: Object.assign(vi.fn(() => 'mocked-model'), {
    embedding: vi.fn(() => 'mocked-embedding-model'),
  }),
}))

import { embed } from 'ai'
import { generateEmbedding } from '@/lib/ai/generate-embedding.js'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('generateEmbedding', () => {
  it('returns a number array from embed', async () => {
    const fakeEmbedding = Array.from({ length: 1536 }, (_, i) => i * 0.001)
    embed.mockResolvedValueOnce({ embedding: fakeEmbedding })

    const result = await generateEmbedding('Hello world')

    expect(result).toEqual(fakeEmbedding)
    expect(result).toHaveLength(1536)
  })

  it('passes the text as value to embed', async () => {
    embed.mockResolvedValueOnce({ embedding: [0.1, 0.2] })

    await generateEmbedding('test text')

    const call = embed.mock.calls[0][0]
    expect(call.value).toBe('test text')
  })

  it('propagates errors from embed', async () => {
    embed.mockRejectedValueOnce(new Error('Embedding API error'))

    await expect(generateEmbedding('bad input')).rejects.toThrow('Embedding API error')
  })
})
