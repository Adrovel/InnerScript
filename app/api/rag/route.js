import { NextResponse } from "next/server";
import { generateEmbedding } from "@/lib/utils";

import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function POST(req) {
  const { question, noteIds } = await req.json()
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
    const result = await client.query(query, [embeddingVector, noteIds])
    const relevantNotes = result.rows.filter(note => note.similarity > 0.75)

    
    return NextResponse.json({ relevantNotes })
  }
  catch (err) {
    console.error("Error in RAG:", error)
    return NextResponse.json({ error: "Failed to process the question"})
  }
  finally {
    client.release()
  }
}
