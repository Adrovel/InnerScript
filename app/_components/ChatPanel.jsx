'use client'

import { useState, useRef, useEffect } from 'react'
// import { Button } from '@/components/ui/button'
import { Mic, Send } from 'lucide-react'

export default function ChatPanel({noteContent}) {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    { from: 'ai', text: 'Hi! Ask me anything about your note.' },
  ])
  const textareaRef = useRef(null)
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 128)}px` // 128px = max-h-32
    }
  }, [input])

const handleSend = (e) =>{
  e?.preventDefault?.()
  if(!input.trim()) return
  setMessages((prev) => [...prev,{ from: 'user', text: input}])
  setInput('')
}

  return (
    <aside className="w-[300px] border-l p-4 overflow-y-auto bg-[#F6F5F4]">
    <div className="flex flex-col h-full ">
      <div className="flex-1 space-y-2 overflow-y-auto text-sm custom-scroll">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`p-2 rounded-sm break-words whitespace-pre-wrap ${
                msg.from === 'user' ? 'bg-[#B7ABED] max-w-[80%]' : 'bg-transparent'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2 bg-[#D4D1CD] rounded-lg items-end px-2 py-2">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSend()
              if (textareaRef.current) {
                textareaRef.current.style.height = 'auto' // reset height
              }
            }}
          }

          placeholder="Ask something..."
          className="flex-1 resize-none bg-transparent outline-none custom-scroll rounded-md p-2 text-sm overflow-y-auto max-h-32"
          rows={1}
        />
        <button
          onClick={handleSend}
          className="rounded-full bg-[#D4D1CD] text-black p-2"
        >
          {input.trim() ? (
            <Send size={18} className="stroke-[2]" />
          ) : (
            <Mic size={18} className="stroke-[2]" />
          )}
        </button>
      </div>
    </div>
    </aside>
  );
}
