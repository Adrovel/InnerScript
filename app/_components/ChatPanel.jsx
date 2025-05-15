'use client'             

import { Button } from '@/components/ui/button'
import { useChat } from 'ai/react'

export default function ChatPanel({noteContent}) {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    initialMessages: [
      { role: 'assistant', content: 'Hi! Ask me anything about your note.' }
    ],
    body: {
      noteContent
    }
  })

  return (
     <aside className="w-[300px] border-l p-4 overflow-y-auto bg-[#F6F5F4]">
    <div className="flex flex-col h-full ">
      <div className="flex-1 space-y-2 overflow-y-auto text-sm">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-md ${
              msg.role === 'user' ? 'bg-[#B7ABED]  self-end' : 'bg-[#9FE5F9]'
            } max-w-[80%]`}
          >
            {msg.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={handleInputChange}
          className="flex-1 border-[#cbd5e1] rounded-md p-2 text-sm outline-none"
          placeholder="Ask something..."
        />
        <Button type="submit">Send</Button>
      </form>
    </div>
    </aside>
  );
}