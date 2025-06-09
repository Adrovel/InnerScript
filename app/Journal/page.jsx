'use client'

import { useState } from 'react';

import Sidebar from '../_components/Sidebar';
import PlainEditor from '../_components/PlainEditor';
import ChatPanel from '../_components/ChatPanel';

{/*
My approach: 
1. The Sidebar will collect all the notes and folders from the database.
2. On User click the noteId will be set and updated from Sidebar.
3. The PlainEditor will then retrieve the data of noteId from database and render it.

Pros:
- No need for all functions to be in this page.jsx file, thus making the code loosely coupled.
- The PlainEditor will only re-render on noteId change.
Cons:
- Multiple API calls to fetch notes.
*/}

export default function Page() {

  const [selectedNoteId, setSelectedNoteId] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  return (
    <>
      <div className="flex h-screen">
        <Sidebar
          selectedNoteId={selectedNoteId}
          setSelectedNoteId={setSelectedNoteId}
        />
        <main className="flex-1 p-0 overflow-auto">
          {selectedNoteId !== '' && (
            <PlainEditor 
              noteId={selectedNoteId}
              // localTitle={localTitle}
              // setLocalTitle={setLocalTitle}
              // localContent={localContent}
              // setLocalContent={setLocalContent}
            />
          )}
        </main>
        <ChatPanel />
      </div>
    </>
  );
}