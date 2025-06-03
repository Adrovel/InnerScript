import clsx from "clsx"

import { useState } from "react";

import { ChevronRight, FileText } from "lucide-react"

export default function TreeItem({ item, depth = 0 }) {
  const [isOpen, setIsOpen] = useState(false)

  const handleToggle = () => setIsOpen(!isOpen)

  return (
    <>
    <div key={item.id}
      className={clsx(
        'flex justify-between items-center text-sm cursor-pointer rounded py-2 px-2 hover:bg-sky-200 transition-colors'
      )}
      style={{ paddingLeft: `${depth * 1.25 + 0.5}rem` }}
    >
      {item.isFolder ? (
        <div className='flex items-center' onClick={handleToggle}>
          <ChevronRight size={16}
          className={clsx(
            'mr-1 transition-transform',
            isOpen && 'rotate-90'
          )}/>
          <span className='truncate'>{item.name}</span>

        </div>
      ) : (
        <div className='flex items-center'>
          <div className="w-4 h-4 mr-1"></div>
          <span className='truncate'>{item.name}</span>
        </div>
      )}
    </div>

    {isOpen && item.isFolder && item.Contents && (
      <div>
        {item.Contents.map((child) => (
          <TreeItem key={child.id} item={child} depth={depth+1} />
        ))}
      </div>
    )}
    </>
  )
} 