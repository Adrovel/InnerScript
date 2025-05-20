'use client'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import { Files, X } from 'lucide-react'
import { useState } from "react"

export default function DropDownMenu({ options, selectedOptions, setSelectedOptions }) {
  const [query, setQuery] = useState("")
  var visible = []

  const toggleItem = (item) => {
    setSelectedOptions((prev) =>
      prev.some((file) => file.id === item.id)
       ? prev.filter((file) => file.id !== item.id)
       : [...prev, item]
    )
  }
  
  const filtered = options.filter(post => 
    post.title.toLowerCase().startsWith(query.toLowerCase())
  )
  
  if (query === "" && selectedOptions.length > 0) {
    visible = selectedOptions
  }
  else {
    visible = filtered.slice(0, 5)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative w-8 h-8 flex items-center justify-center bg-[#8baef4] rounded-full">
          <button>
            <Files size={18} className='stroke-[2]'/>
          </button> 
          <span 
            className="absolute -bottom-1 -right-1 bg-red-500 text-white text-xs font-bold px-1 py-0.5 rounded-full">
            {selectedOptions.length}
          </span>
        </div>
      </PopoverTrigger>
      <PopoverContent className="bg-white border rounded-md shadow-md p-0">
        <Command shouldFilter={false} className="bg-white rounded-md">
          <CommandInput placeholder="Search for File" onValueChange={setQuery} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {visible.map((item) => (
              <CommandItem
                key={item.id}
                value={item.title}
                onSelect={() => toggleItem(item)}
              >
                {item.title}
                {selectedOptions.some((file) => file.id === item.id) && (
                  <button className="ml-auto">
                  <X size={16} />
                  </button>
                )}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
