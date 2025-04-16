'use client'

import { useState, useRef, useEffect } from 'react'
import { useChat } from 'ai/react'
import { Mic, MicOff, Send } from 'lucide-react'

export default function ChatPanel({noteContent}) {
  const [isRecording, setIsRecording] = useState(false)

  const textareaRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const audioChunks = useRef([])

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
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

const handleMicClick = async () => {
  if (isRecording) {
    mediaRecorderRef.current?.stop()
    setIsRecording(false)
  } else {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      audioChunks.current = []

      mediaRecorder.ondataavailable = (e) => audioChunks.current.push(e.data)
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' })
        const audioUrl = URL.createObjectURL(audioBlob)
        console.log('Audio recorded:', audioUrl)
      }
      mediaRecorder.start()
      setIsRecording(true)
    } catch (e) {
      console.error('Mic access is denied or error', err)
    }
  }
}

  return (
    <aside className="w-[300px] border-l p-4 overflow-y-auto bg-white">
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

      <div className="mt-4 flex gap-2 bg-[#D6E3FF] rounded-lg items-end px-2 py-2 border-1 border-[#B7CEFF]">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => {
            handleInputChange(e)
            if (isRecording) {
              mediaRecorderRef.current?.stop()
              setIsRecording(false)
            }
          }}
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
          onClick={input.trim() ? handleSend : handleMicClick}
          className="rounded-full bg-transparent text-black p-2"
        >
          {input.trim() ? (
            <Send size={18} className="stroke-[2]" />
          ) : isRecording ? (
            <MicOff size={18} className="stroke-[2] text-red-600" />
          ) : (
            <Mic size={18} className="stroke-[2]" />
          )}
        </button>
      </div>
    </div>
    </aside>
  );
}
