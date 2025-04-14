'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function ChatPanel({noteContent}) {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    { from: 'ai', text: 'Hi! Ask me anything about your note.' },
  ])

const handleSend = () =>{
  
}

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 space-y-2 overflow-y-auto text-sm">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-md ${
              msg.from === 'user' ? 'bg-primary text-primary-foreground self-end' : 'bg-muted'
            } max-w-[80%]`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 border rounded-md p-2 text-sm outline-none"
          placeholder="Ask something..."
        />
        <Button onClick={handleSend}>Send</Button>
      </div>
    </div>
  );
}