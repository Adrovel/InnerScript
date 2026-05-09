import { embed } from 'ai'
import { openai } from '@ai-sdk/openai'

const embeddingModel = openai.embedding('text-embedding-ada-002')

/**
 * Generate a 1536-dim embedding for the given text.
 * @param {string} text
 * @returns {Promise<number[]>}
 */
export async function generateEmbedding(text) {
  const { embedding } = await embed({
    model: embeddingModel,
    value: text,
  })
  return embedding
}
