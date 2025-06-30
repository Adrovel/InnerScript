import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

import { generateEmbedding } from "@/lib/utils"

import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function POST(req) {
  const { messages, noteIDs } = await req.json()

  const latestMessage = messages[messages.length - 1]
  const userQuestion = latestMessage?.content || ""

  let context = ""
  if (noteIDs && noteIDs.length > 0 && userQuestion) {
    context = await createContext(userQuestion, noteIDs)
  }

  console.log("Context from notes:", context)

  const enhancedMessages = [...messages]
  if (context) {
    enhancedMessages[enhancedMessages.length - 1] = {
      ...latestMessage,
      content: `Context from notes: ${context}
      Question: ${userQuestion}`
    }
  }

  console.log("Enhanced messages:", enhancedMessages)

  const result = await streamText({
    model: openai("gpt-4o-mini"),
    messages: enhancedMessages,
    system: "You are a helpful assistant. When provided with context from user's notes, use that information to answer questions accurately. If the context doesn't contain relevant information, let the user know."
  })

  return result.toDataStreamResponse()
}


export async function createContext(question, noteIDs) {
  const client = await pool.connect()

  const questionEmbedding = await generateEmbedding(question)
  console.log("Question embedding:", questionEmbedding)

  try {
    const embeddingVector = `[${questionEmbedding.join(',')}]`
    const query = `
      SELECT 
        id, 
        content,
        (1 - (embedding <=> $1::vector)) as similarity
      FROM notes
      WHERE id = ANY($2)
      ORDER BY embedding <=> $1::vector
      LIMIT 3
    `
    const result = await client.query(query, [embeddingVector, noteIDs])
    const relevantNotes = result.rows.filter(note => note.similarity > 0.75)

    const context = relevantNotes
      .map(note => note.content)
      .join('\n\n')
    
    return context
  }
  catch (err) {
    console.error("Error in RAG:", err)
    return err
  }
  finally {
    client.release()
  }
}