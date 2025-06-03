import { OpenAI } from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Set the maximum duration for streaming responses
export const maxDuration = 30;

export async function POST(req) {
  const { messages, noteContent } = await req.json();

  // Add the note content as context to the system message
  const systemMessage = {
    role: 'system',
    content: `You are a helpful AI assistant. The user has shared a note with you: ${noteContent}. 
    Please help them understand and work with this note. Be concise and helpful.`
  };

  // Request the OpenAI API for the response
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    stream: true,
    messages: [systemMessage, ...messages],
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);

  // Return a StreamingTextResponse, which can be consumed by the client
  return new StreamingTextResponse(stream);
}
