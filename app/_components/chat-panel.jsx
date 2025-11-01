'use client'

import { useState, useRef, useEffect } from 'react'
import { useChat } from '@ai-sdk/react'
import { useFileContext } from './files-context'
import { Button } from '@/components/ui/button'
import DropDownMenu from './dropdown-menu'
import { Send } from 'lucide-react'

const messages = [
  {id: 1, role: 'user', parts: [{type: 'text', content: 'Hello!'}]},
  {id: 2, role: 'assistant', parts: [{type: 'text', content: 'Hi there! How can I assist you today?'}]},
]

function flattenFiles(items) {
  const files = []
  items.forEach(item => {
    if (item.type === 'note') {
      files.push(item)
    } else if (item.children) {
      files.push(...flattenFiles(item.children))
    }
  })
  return files
}

export default function ChatPanel() {
  const { sidebarMetadata } = useFileContext()
  const flattenedFiles = flattenFiles(sidebarMetadata || [])
  const [selectedFiles, setSelectedFiles] = useState([])
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(scrollToBottom, []) // Placeholder; integrate with messages later

  return (
    <aside className="h-screen flex flex-col bg-sidebar border-l border-black/10">
      <div className="p-4">
        <h2 className="text-2xl font-serif">Chat</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div 
            key={message.id || index} 
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`p-3 rounded-lg max-w-xs ${message.role === 'user' ? 'bg-cyan-200 text-black' : 'bg-background text-black border border-black/10'}`}
            >
              {message.parts.map((part, pIndex) => (
                <span key={pIndex}>{part.content}</span>
              ))}
            </div>
          </div>
        ))}
       </div>
       <div className="p-2 space-y-2 border border-black/20 rounded-2xl bg-background m-2">
        <textarea 
          placeholder="Type your message..."
          className="w-full min-h-8 resize-none outline-none flex field-sizing-content max-h-32"
        />
        <div className="flex justify-between">
          <DropDownMenu 
            options={flattenedFiles}
            selectedOptions={selectedFiles}
            setSelectedOptions={setSelectedFiles}
          />
          <Button 
            size="icon" 
            className="rounded-full bg-cyan-200"
          >
            <Send size={16}/>
          </Button>
        </div>
      </div>
    </aside>
  )
}
