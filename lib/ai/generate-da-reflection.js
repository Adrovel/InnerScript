import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'

/**
 * Generate a devil's advocate challenge for a journal entry.
 * @param {string} content
 * @param {string[]} topics
 * @returns {Promise<string|null>}
 */
export async function generateDaReflection(content, topics = []) {
  try {
    const topicContext = topics.length > 0
      ? `The main topics are: ${topics.join(', ')}.`
      : ''

    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      system: `You are a thoughtful devil's advocate. The user just wrote a private journal entry.
Identify the single strongest assumption underlying their thinking and challenge it in 2–3 sentences.
Be direct but not harsh. Do not summarise what they wrote — only challenge the assumption.
Do not start your response with "I" or "You wrote". Keep it under 60 words.`,
      prompt: `${content}\n\n${topicContext}`,
      maxTokens: 120,
      temperature: 0.7,
    })

    if (!text || text.length < 20) return null
    return text.trim()
  } catch (err) {
    console.error('DA reflection failed:', err.message)
    return null
  }
}
