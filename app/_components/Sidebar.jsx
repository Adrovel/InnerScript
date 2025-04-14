'use client'
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { PlusIcon } from 'lucide-react';
import clsx from 'clsx';

export default function Sidebar({notes, onSelectNote, onCreateNote, selectedNoteId}) {
  return (
   <div className="w-64 h-full border-r flex flex-col bg-background">
  <div className="flex items-center justify-between px-4 py-2 border-b">
  <h2 className="text-lg font-semibold">Notes</h2>
  <Button variant="ghost" size="icon" onClick={onCreateNote}>
    <PlusIcon className="h-4 w-4" />
  </Button>
  </div>
  <ScrollArea className="flex-1">
  <ul>
  {notes.map((note) => (
            <li
             key={note.id}
             onClick={()=>onSelectNote(note.id)}
             className={clsx(
              'cursor-pointer h-9 px-4 py-2 text-sm hover:bg-muted transition-colors',
              {
                'bg-muted font-medium': selectedNoteId === note.id,
              }

             )}
             
             >
            {note.title}
          </li>
        ))}
      </ul>
    </ScrollArea>
   </div>
  );
}