'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { useChat } from '@ai-sdk/react'
import { useFileContext } from './files-context'
import { Button } from '@/components/ui/button'
import { PopoverMenu } from './chat-popover-menu'
import { Send, Bot, X } from 'lucide-react'

function flattenFiles(items) {
  const files = []
  items.forEach(item => {
    if (item.type === 'note') files.push(item)
    else if (item.children) files.push(...flattenFiles(item.children))
  })
  return files
}

export default function ChatPanel() {
  const { sidebarMetadata, selectedNoteId } = useFileContext()
  const flattenedFiles = flattenFiles(sidebarMetadata || [])
  const [selectedFiles, setSelectedFiles] = useState([])
  const messagesEndRef = useRef(null)

  // Auto-seed with the currently open note when chat panel mounts or note changes
  useEffect(() => {
    if (!selectedNoteId) return
    const note = flattenedFiles.find(f => f.id === selectedNoteId)
    if (!note) return
    setSelectedFiles(prev => {
      const already = prev.some(f => f.id === selectedNoteId)
      return already ? prev : [note, ...prev.filter(f => f.id !== selectedNoteId)]
    })
  // flattenedFiles changes on every render — intentionally only react to selectedNoteId
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNoteId])

  const noteIDs = selectedFiles.map(f => f.id.replace('note-', ''))

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: '/api/chat',
    body: { noteIDs },
  })

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const clearChat = useCallback(() => setMessages([]), [setMessages])

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot size={14} className="text-primary" />
          <h2 className="text-sm font-semibold tracking-tight">Ask your notes</h2>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            title="Clear chat"
            className="p-1 rounded-md text-muted-foreground/50 hover:text-muted-foreground hover:bg-muted transition-colors"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Note chips */}
      <div className="px-3 py-2 border-b border-border">
        <PopoverMenu
          options={flattenedFiles}
          selectedOptions={selectedFiles}
          setSelectedOptions={setSelectedFiles}
        />
        {selectedFiles.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {selectedFiles.map(f => (
              <span
                key={f.id}
                className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium"
              >
                {f.name || f.title}
                <button
                  onClick={() => setSelectedFiles(prev => prev.filter(x => x.id !== f.id))}
                  className="opacity-60 hover:opacity-100 transition-opacity"
                >
                  <X size={9} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-center text-muted-foreground">
            <Bot size={28} className="text-muted-foreground/30" />
            <p className="text-xs leading-relaxed max-w-[200px]">
              {selectedFiles.length > 0
                ? `Chatting with ${selectedFiles.length} note${selectedFiles.length > 1 ? 's' : ''}. Ask anything.`
                : 'Open a note and ask anything about it.'}
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
      <form onSubmit={handleSubmit} className="p-3 border-t border-border">
        <div className="flex items-end gap-2 bg-muted rounded-xl px-3 py-2 border border-border focus-within:border-ring focus-within:ring-1 focus-within:ring-ring transition-all">
          <textarea
            value={input}
            onChange={handleInputChange}
            placeholder="Ask something… (Shift+Enter for new line)"
            rows={1}
            className="flex-1 resize-none outline-none bg-transparent text-xs leading-relaxed placeholder:text-muted-foreground/50 max-h-24 field-sizing-content"
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
      </form>
    </div>
  )
}
