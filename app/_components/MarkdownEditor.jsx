'use client'
import React from "react"
import { useEffect, useState } from "react";
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'


export default function MarkdownEditor({value, onChange}) {

  const [input, setInput] = useState(value)

  useEffect(() => {
    setInput(value)
  }, [value])

  const handleChange = (e) => {
    const val = e.target.value
    setInput(val)
    onChange(val)
  }

  return (
    <div className="flex h-full gap-4">
      <textarea
        className="w-1/2 h-full p-4 border rounded-md font-mono text-sm resize-none outline-none"
        value={input}
        onChange={handleChange}
        placeholder="Write your markdown here..."
      />
      <div className="w-1/2 h-full p-4 border rounded-md overflow-auto prose dark:prose-invert">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {input}
        </ReactMarkdown>
      </div>
    </div>
  );
}