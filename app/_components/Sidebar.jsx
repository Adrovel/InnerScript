'use client'

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { PlusIcon, ChevronRight, ChevronLeft } from 'lucide-react';

import clsx from 'clsx';

import FileTree from './FileTree';


const explorer = [
  {
    id: 1,
    name: "First Folder",
    isFolder: true,
    Files: [
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
    Files: [
      {
        id: 5,
        name: "Second File",
        isFolder: false,
      }
    ]
  }
]

export default function Sidebar({notes, onSelectNote, onCreateNote, selectedNoteId}) {

  return (
      <div className="w-64 h-full border-r flex flex-col bg-[#f0f4f8]">
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
                'bg-[#9FE5F9]  font-medium': selectedNoteId === note.id,
              })}>
            {note.title}
          </li>
        ))}
      </ul>
      {explorer.map((item)=> (
          <FileTree key={item.id} explorer={item}/>
        ))
      }
    </ScrollArea>
   </div>
  );
}