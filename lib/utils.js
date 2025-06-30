import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

import { embed } from "ai";
import { openai } from "@ai-sdk/openai";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const embeddingModel = openai.embedding('text-embedding-ada-002')

export const generateEmbedding = async (value) => {
  const { embedding } = await embed({
    model: embeddingModel,
    value: value
  })
  return embedding
}
