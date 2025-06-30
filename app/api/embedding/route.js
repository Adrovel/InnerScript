import { NextResponse } from "next/server"
import { updateEmbedding } from "@/lib/temp_embedgen"
// import { generateEmbedding } from "@/lib/utils"

import { Pool } from "pg"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function POST(req) {
  try {
    // const embedding = await generateEmbedding("This is a test embedding")
    // console.log("Generated embedding:", embedding)
    await updateEmbedding()
    return NextResponse.json({ message: "Embeddings updated successfully" }, { status: 200 });
  }
  catch (err) {
    console.error("Error updating embeddings:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
