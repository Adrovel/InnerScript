'use client'

import { Files } from 'lucide-react'

export default function DropDownMenu({ options, selectedOptions, setSelectedOptions }) {
  return (
    <div>
      <button
        className='rounded-full bg-transparent text-black p-2'
      >
        <Files size={18} className='stroke-[2]'/>
      </button>
    </div>
  )
}
