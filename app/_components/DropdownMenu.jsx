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
import { cn } from '@/lib/utils'
import { Files } from 'lucide-react'
import { useState } from "react"

export default function DropDownMenu({ options, selectedOptions, setSelectedOptions }) {
  const [query, setQuery] = useState("")

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

  const visible = filtered.slice(0, 5)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button>
          <Files size={18} className='stroke-[2]'/>
        </button>
      </PopoverTrigger>
      <PopoverContent className="bg-white border rounded-md shadow-md p-0">
        <Command shouldFilter={false} className="bg-white rounded-md">
          <CommandInput placeholder="search for file" onValueChange={setQuery} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {visible.map((item) => (
              <CommandItem
                key={item.id}
                value={item.title}
                onSelect={() => toggleItem(item)}
                className={cn(
                  "cursor-pointer",
                  selectedOptions.some((file) => file.id === item.id) && "bg-blue-100 text-blue-800"
                )}
              >
                {item.title}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
