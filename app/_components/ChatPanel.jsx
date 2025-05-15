'use client'             


import { useState, useRef, useEffect } from 'react'
import { useChat } from 'ai/react'
import { Send, Files, X } from 'lucide-react'
import DropdownMenu from './DropdownMenu'

export default function ChatPanel({noteContent}) {
  const [dropDownState, setDropDownState] = useState(false)
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

<<<<<<< Updated upstream
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0')
    const secs = (seconds % 60).toString().padStart(2, '0')
    return `${mins}:${secs}`
  }

  const handleMicClick = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop()
      setIsRecording(false)
      clearInterval((timerRef.current))
      setRecordingTime(0)
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const mediaRecorder = new MediaRecorder(stream)

        mediaStreamRef.current = stream

        mediaRecorder.ondataavailable = (e) => audioChunks.current.push(e.data)
        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' })
          // audio processing space
          setAudioUrl(URL.createObjectURL((audioBlob)))
          audioChunks.current = []
          stream.getTracks().forEach((track) => track.stop())
        }
        mediaRecorder.start()
        setRecordingTime(0)
        timerRef.current = setInterval(() => {
          setRecordingTime((prev) => prev + 1)
        }, 1000)
        mediaRecorderRef.current = mediaRecorder
        setIsRecording(true)
      } catch (e) {
        console.error('Mic access is denied or error', err)
      }
    }
  }


=======
>>>>>>> Stashed changes
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
          <button
            className='rounded-full bg-transparent text-black p-2'
          >
            <Files size={18} className='stroke-[2]'/>
          </button>
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
