import { embed } from "ai"
import { openai } from "@ai-sdk/openai"
import { Pool } from "pg"

const embeddingModel = openai.embedding("text-embedding-ada-002")

export const generateEmbedding = async (value) => {
  const { embedding } = await embed({
    model: embeddingModel,
    value: value
  });
  return embedding
};

const pool = new Pool({
  connectionString: "postgresql://postgres:InnerScript123%23@localhost:5432/innerscript"
});

export const updateEmbedding = async () => {
  const client = await pool.connect();

  try{
    const res = await client.query("SELECT id, content FROM notes WHERE embedding IS NULL")

    for (const row of res.rows) {
      const embedding = await generateEmbedding(row.content)
      // console.log(`Generated embedding for note ${embedding}`)

      const vectorString = `[${embedding.join(",")}]`
      const res = await client.query(
        "UPDATE notes SET embedding = $1 WHERE id = $2 RETURNING id",
        [vectorString, row.id]
      )
      console.log(`Updated note ${res.rows[0].id} with embedding`)
    }
  }
  catch (err) {
    console.error("Error connecting to the database:", err)
    throw new Error("Database connection failed")
  }
  finally {
    client.release()
  }

  return "Embeddings updated successfully"
};

