'use client'

import { useState, useRef, useEffect } from 'react'
import { useChat } from '@ai-sdk/react'
import { Send, X } from 'lucide-react'

import DropDownMenu from './DropdownMenu'
import { useFileContext } from './FilesContext'

export default function ChatPanel() {
  const { sidebarMetadata } = useFileContext()
  const [selectedFiles, setSelectedFiles] = useState([])

  // Flatten the tree structure to get all files
  const flattenFiles = (items) => {
    const files = []
    items.forEach(item => {
      if (item.type === 'file') {
        files.push(item)
      } else if (item.children) {
        files.push(...flattenFiles(item.children))
      }
    })
    return files
  }

  const data = flattenFiles(sidebarMetadata || [])

  const textareaRef = useRef(null)

  const {
    messages,
    input,
    handleInputChange,
    setInput,
    append,
  } = useChat()

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
    <aside className="w-[300px] border-l p-4 overflow-y-auto bg-background">
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
                ? 'mr-1 bg-primary max-w-[80%] text-primary-foreground'
                : 'mr-1 bg-secondary max-w-[100%] text-secondary-foreground'
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

      <div className="mt-4 flex-col gap-2 bg-accent rounded-lg px-2 py-2 border border-border">

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
          <div className='bg-primary rounded-full w-8 h-8 flex items-center justify-center'>
            <button
              onClick={handleSend}
              className="rounded-full bg-transparent text-primary-foreground"
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
