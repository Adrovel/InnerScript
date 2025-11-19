'use client'

import { useState, useRef, useEffect } from 'react'
import { useChat } from '@ai-sdk/react'
import { useSidebarMetadataContext } from './files-context'
import { Button } from '@/components/ui/button'
import { PopoverMenu } from './chat-popover-menu'
import { Send } from 'lucide-react'

const messages = [
  { id: 1, role: 'user', parts: [{ type: 'text', content: 'Hello!' }] },
  { id: 2, role: 'assistant', parts: [{ type: 'text', content: 'Hi there! How can I assist you today?' }] },
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

export function ChatPanel() {
  const { sidebarMetadata } = useSidebarMetadataContext()
  const flattenedFiles = flattenFiles(sidebarMetadata || [])
  const [selectedFiles, setSelectedFiles] = useState([])
  const messagesEndRef = useRef(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    onError: (error) => {
      console.error('Chat error:', error)
    }
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <aside className="h-screen min-w-[350px] flex flex-col bg-sidebar border-l border-border">
      <div className="p-4">
        <h2 className="text-2xl font-serif">Chat</h2>
      </div>
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`p-3 rounded-sm max-w-xs 
                ${message.role === 'user'
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'bg-background text-black border border-black/10'
                }`}
            >
              <span className="whitespace-pre-wrap">{message.content}</span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="p-3 rounded-sm bg-background text-black border border-black/10">
              <span className="animate-pulse">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      {/* Input area */}
      <div className="p-2 space-y-2 border border-border rounded-2xl bg-background m-2">
        <form onSubmit={handleSubmit} className="contents">
          <textarea
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
            placeholder="Type your message..."
            className="w-full min-h-8 resize-none outline-none flex field-sizing-content max-h-32 bg-transparent"
          />
          <div className="flex justify-between">
            <PopoverMenu
              options={flattenedFiles}
              selectedOptions={selectedFiles}
              setSelectedOptions={setSelectedFiles}
            />
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !input.trim()}
              className="rounded-full bg-sidebar-primary text-sidebar-primary-foreground"
            >
              <Send size={16} />
            </Button>
          </div>
        </form>
      </div>
    </aside>
  )
}
