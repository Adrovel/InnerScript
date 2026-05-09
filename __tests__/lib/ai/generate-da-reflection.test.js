import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('ai', () => ({
  generateText: vi.fn(),
}))
vi.mock('@ai-sdk/openai', () => ({
  openai: vi.fn(() => 'mocked-model'),
}))

import { generateText } from 'ai'
import { generateDaReflection } from '@/lib/ai/generate-da-reflection.js'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('generateDaReflection', () => {
  it('returns trimmed reflection text on success', async () => {
    generateText.mockResolvedValueOnce({ text: '  What if the real obstacle is your own expectations?  ' })

    const result = await generateDaReflection('I failed because of bad luck.', ['luck', 'failure'])

    expect(result).toBe('What if the real obstacle is your own expectations?')
  })

  it('returns null when generateText throws', async () => {
    generateText.mockRejectedValueOnce(new Error('Rate limit'))

    const result = await generateDaReflection('Some content.', [])

    expect(result).toBeNull()
  })

  it('returns null when response text is shorter than 20 chars', async () => {
    generateText.mockResolvedValueOnce({ text: 'Too short.' })

    const result = await generateDaReflection('Long content here.', [])

    expect(result).toBeNull()
  })

  it('includes topics in the prompt when provided', async () => {
    generateText.mockResolvedValueOnce({ text: 'A sufficiently long devil advocate response.' })

    await generateDaReflection('I am tired of this job.', ['work', 'stress'])

    const call = generateText.mock.calls[0][0]
    expect(call.prompt).toContain('work')
    expect(call.prompt).toContain('stress')
  })

  it('does not include topic context when topics array is empty', async () => {
    generateText.mockResolvedValueOnce({ text: 'A sufficiently long devil advocate response.' })

    await generateDaReflection('Just some content.', [])

    const call = generateText.mock.calls[0][0]
    expect(call.prompt).not.toContain('main topics')
  })

  it('sets maxTokens to 120', async () => {
    generateText.mockResolvedValueOnce({ text: 'A sufficiently long devil advocate response.' })

    await generateDaReflection('content', [])

    const call = generateText.mock.calls[0][0]
    expect(call.maxTokens).toBe(120)
  })
})
