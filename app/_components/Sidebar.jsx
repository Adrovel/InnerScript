'use client'

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { PlusIcon } from 'lucide-react';

import SidebarItem from './SidebarItem';

export default function Sidebar({ sidebarData }) {
  const [isLoading, setIsLoading] = useState(false)

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
        ):sidebarData?.length ?(
          sidebarData.map((item)=> (
            <SidebarItem
              key={item.id}
              item={item}
            />
          ))
        ):(
          <div className="p-4 text-center text-muted-foreground">
            No notes found.
          </div>
        )}
      </ScrollArea>
   </div>
  );
}
