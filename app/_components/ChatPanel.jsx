'use client'

import { useState, useRef, useEffect } from 'react'
import { useChat } from 'ai/react'
import { Send, Files, X } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { data } from '@/data'
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import { cn } from '@/lib/utils'

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
      textarea.style.height = `${Math.min(textarea.scrollHeight, 128)}px` // 128px = max-h-32
    }
  }, [input])

  const handleSend = async (e) =>{
    e?.preventDefault?.()
    setInput('')
    if(!input.trim()) return
    await append({ role: 'user', content: input})
  }

  const toggleItem = (id) => {
    setSelectedFiles((prev) =>
      prev.includes(id)
       ? prev.filter((itemId) => itemId !== id)
       : [...prev, id]
    )
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
        { selectedFiles.length > 0 && (
          <div className='flex flex-row'>
            <button className='bg-transparent rounded-ful outline outline-[#5B8DEF]'>
              <X size={15} className="stroke-[2]"/>
            </button>
          </div>
        )}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => handleInputChange(e)}
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
          className="resize-none bg-transparent outline-none custom-scroll rounded-md p-2 text-sm overflow-y-auto max-h-32 w-full"
          rows={1}
        />
        <div className='flex justify-between'>
          <Popover>
            <PopoverTrigger asChild>
              <button>
                <Files size={18} className='stroke-[2]'/>
              </button>
            </PopoverTrigger>
            <PopoverContent className="bg-white border rounded-md shadow-md p-0">
              <Command className="bg-white rounded-md">
                <CommandInput placeholder="search for file" />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  {data.map((item) => (
                    <CommandItem
                      key={item.id}
                      value={item.id.toString()}
                      onSelect={() => toggleItem(item.id)}
                      className={cn(
                        "cursor-pointer",
                        selectedFiles.includes(item.id) && "bg-blue-100 text-blue-800"
                      )}
                    >
                      {item.title}
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <button
            onClick={handleSend}
            className="rounded-full bg-transparent text-black p-2"
          >
            <Send size={18} className="stroke-[2]" />
          </button>
        </div>
      </div>
    </div>
    </aside>
  );
}
