'use client'

import { useRef, useEffect, useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { useFileContext } from './files-context'
import { Button } from '@/components/ui/button'
import { PopoverMenu } from './chat-popover-menu'
import { Send, Bot } from 'lucide-react'

function flattenFiles(items) {
  const files = []
  items.forEach(item => {
    if (item.type === 'note') files.push(item)
    else if (item.children) files.push(...flattenFiles(item.children))
  })
  return files
}

export default function ChatPanel() {
  const { sidebarMetadata } = useFileContext()
  const flattenedFiles = flattenFiles(sidebarMetadata || [])
  const [selectedFiles, setSelectedFiles] = useState([])
  const messagesEndRef = useRef(null)

  const noteIDs = selectedFiles.map(f => f.id.replace('note-', ''))

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    body: { noteIDs },
  })

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <aside className="h-screen w-[320px] shrink-0 flex flex-col bg-card border-l border-border">
      {/* Header */}
      <div className="px-4 pt-5 pb-3 border-b border-border flex items-center gap-2">
        <Bot size={15} className="text-primary" />
        <h2 className="text-sm font-semibold tracking-tight">Ask your notes</h2>
      </div>

      {/* Note selector */}
      <div className="px-3 py-2 border-b border-border">
        <PopoverMenu
          options={flattenedFiles}
          selectedOptions={selectedFiles}
          setSelectedOptions={setSelectedFiles}
        />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-center text-muted-foreground">
            <Bot size={28} className="text-muted-foreground/40" />
            <p className="text-xs leading-relaxed max-w-[200px]">
              Select notes above, then ask anything about them.
            </p>
          </div>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`px-3 py-2 rounded-xl max-w-[240px] text-xs leading-relaxed
                ${message.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-sm'
                  : 'bg-muted text-foreground rounded-bl-sm border border-border'
                }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="px-3 py-2 rounded-xl rounded-bl-sm bg-muted border border-border">
              <span className="flex gap-1 items-center">
                <span className="size-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:0ms]" />
                <span className="size-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:150ms]" />
                <span className="size-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:300ms]" />
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="p-3 border-t border-border"
      >
        <div className="flex items-end gap-2 bg-muted rounded-xl px-3 py-2 border border-border focus-within:border-ring focus-within:ring-1 focus-within:ring-ring transition-all">
          <textarea
            value={input}
            onChange={handleInputChange}
            placeholder="Ask something…"
            rows={1}
            className="flex-1 resize-none outline-none bg-transparent text-xs leading-relaxed placeholder:text-muted-foreground/60 max-h-24 field-sizing-content"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input?.trim()}
            className="size-6 shrink-0 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
          >
            <Send size={11} />
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground/50 mt-1.5 text-center">
          Shift+Enter for new line
        </p>
      </form>
    </aside>
  )
}
