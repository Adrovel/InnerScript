'use client'

import { useState, useRef, useEffect } from 'react'
import { useChat } from 'ai/react'
import { Send, X } from 'lucide-react'
import { data } from '@/temp_data'

import DropDownMenu from './DropdownMenu'

export default function ChatPanel({noteContent}) {
  const [selectedFiles, setSelectedFiles] = useState([])

  const textareaRef = useRef(null)

  const {
    messages,
    input,
    handleInputChange,
    setInput,
    append,
  } = useChat({
    body: { noteContent },
  })

  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 128)}px`
    }
  }, [input])

  const handleSend = async (e) =>{
    e?.preventDefault?.()
    setInput('')
    if(!input.trim()) return
    await append({ role: 'user', content: input})
  }

  return (
    <aside className="w-[300px] border-l p-4 overflow-y-auto bg-[#F5F7FF]">
    <div className="flex flex-col h-full ">
      <div className="flex-1 space-y-2 overflow-y-auto text-sm custom-scroll">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`p-2 rounded-lg break-words whitespace-pre-wrap ${
                msg.role === 'user'
                ? 'mr-1 bg-[#5B8DEF] max-w-[80%] text-white'
                : 'mr-1 bg-[#E2E8F8] max-w-[100%] text-[#2A3142]'
              }`}
              style={{
                borderRadius: msg.role === 'user' ? '15px 0 15px 15px' : '0 15px 15px 15px',
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex-col gap-2 bg-[#D6E3FF] rounded-lg px-2 py-2 border-1 border-[#B7CEFF]">

        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => handleInputChange(e)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSend()
              if (textareaRef.current) {
                textareaRef.current.style.height = 'auto'
              }
            }}
          }

          placeholder="Ask something..."
          className="resize-none bg-transparent outline-none custom-scroll rounded-md p-2 text-sm overflow-y-auto max-h-32 w-full"
          rows={1}
        />
        <div className='flex justify-between'>
          <DropDownMenu options={data} selectedOptions={selectedFiles} setSelectedOptions={setSelectedFiles}/>
          <div className='bg-[#8baef4] rounded-full w-8 h-8 flex items-center justify-center'>
            <button
              onClick={handleSend}
              className="rounded-full bg-transparent text-black"
            >
              <Send size={18} className="stroke-[2]" />
            </button>
          </div>
        </div>
      </div>
    </div>
    </aside>
  );
}
