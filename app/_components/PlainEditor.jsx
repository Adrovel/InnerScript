'use client'

export default function PlainEditor({ title, content, onTitleChange, onContentChange }) {
  
  
  
  return (
    <div className="flex flex-col h-full ">
      <input
        type="text"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="Untitled Note"
        className="text-4xl font-semibold p-3 outline-none bg-[#f8fafc] text-center"
      />
      <textarea
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        placeholder="Start writing..."
        className="flex-1 w-full resize-none px-12 py-4 rounded-md text-lg outline-none font-sans bg-transparent"
      />
    </div>
  )
}
