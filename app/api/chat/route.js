import { NextResponse } from 'next/server'
import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'
import { generateEmbedding } from '@/lib/ai/generate-embedding'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function POST(req) {
  try {
    const { messages, noteIDs } = await req.json()

    const latestMessage = messages[messages.length - 1]
    const userQuestion = latestMessage?.content || ''

    let context = ''
    if (noteIDs?.length > 0 && userQuestion) {
      context = await createContext(userQuestion, noteIDs)
    }

    const enhancedMessages = [...messages]
    if (context) {
      enhancedMessages[enhancedMessages.length - 1] = {
        ...latestMessage,
        content: `Context from notes:\n${context}\n\nQuestion: ${userQuestion}`,
      }
    }

    const result = await streamText({
      model: openai('gpt-4o-mini'),
      messages: enhancedMessages,
      system:
        'You are a helpful journaling assistant. Use the provided note context to answer questions accurately. If the context is not relevant, say so.',
    })

    return result.toDataStreamResponse()
  } catch (err) {
    console.error('Chat error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

async function createContext(question, noteIDs) {
  let client
  try {
    const questionEmbedding = await generateEmbedding(question)
    const embeddingVector = `[${questionEmbedding.join(',')}]`

    client = await pool.connect()
    const result = await client.query(
      `SELECT content, 1 - (embedding <=> $1::vector) AS similarity
       FROM notes
       WHERE id = ANY($2)
       ORDER BY embedding <=> $1::vector
       LIMIT 3`,
      [embeddingVector, noteIDs]
    )

    return result.rows
      .filter(r => r.similarity > 0.75)
      .map(r => r.content)
      .join('\n\n')
  } catch (err) {
    console.error('RAG context error:', err)
    return ''
  } finally {
    client?.release()
  }
}
