'use client'

import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { PlusIcon, ChevronRight, ChevronLeft } from 'lucide-react';

import TreeItem from './temp/TreeItem';

const tempExplorer = [
  {
    id: 1,
    name: "First Folder",
    isFolder: true,
    Contents: [
      {
        id: 2,
        name: "First File",
        isFolder: false,
      },
      {
        id: 5,
        name: "Third File",
        isFolder: false,
      }
    ]
  },
  {
    id: 3,
    name: "Second Folder",
    isFolder: true,
    Contents: [
      {
        id: 5,
        name: "Second File",
        isFolder: false,
      }
    ]
  },
  {
    id: 4,
    name: "Fourth File",
    isFolder: false,
  }
]

export default function Sidebar({onSelectNote, onCreateNote, selectedNoteId}) {
  const [explorer, setExplorer] = useState({})
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

  // Log state updates for debugging
  useEffect(() => {
    console.log('🔄 State updated - Explorer:', explorer)
  }, [explorer])

  return (
    <div className="w-64 h-full border-r flex flex-col bg-[#f0f4f8]">
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <h2 className="text-lg font-semibold">Notes</h2>
        <Button variant="ghost" size="icon" onClick={onCreateNote} className="h-4 w-4">
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
            <TreeItem key={item.id} item={item}/>
          ))
        )}
      </ScrollArea>
   </div>
  );
}