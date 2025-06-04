'use client'

import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { PlusIcon } from 'lucide-react';

import TreeItem from './TreeItem';

export default function Sidebar({setSelectedNoteId, selectedNoteId}) {
  const [explorer, setExplorer] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const res = await fetch('/api/explorer')
        if (!res.ok) throw new Error(`Failed to fetch data`)

        const data = await res.json()
        setExplorer(data.explorer)
      } 
      catch (err) {
        console.error('Error fetching data:', err);
      }
      finally {
        setIsLoading(false)
      }
    }

    fetchData();
  }, [])

  return (
    <div className="w-64 h-full border-r flex flex-col bg-[#f0f4f8]">
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <h2 className="text-lg font-semibold">Notes</h2>
        <Button variant="ghost" size="icon" className="h-4 w-4">
          <PlusIcon />
        </Button>
      </div>
      <ScrollArea className="flex-1">
        {isLoading ? (
          <div className="p-4 text-center text-gray-500">
            <div className="animate-pulse">Loading...</div>
          </div>
        ):(
          explorer.map((item)=> (
            <TreeItem 
              key={item.id} 
              item={item} 
              setSelectedNoteId={setSelectedNoteId} 
              selectedNoteId={selectedNoteId} 
            />
          ))
        )}
      </ScrollArea>
   </div>
  );
}