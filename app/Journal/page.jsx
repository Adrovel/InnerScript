import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { FileProvider } from '../_components/files-context'
import PlainEditor from '../_components/plain-editor'
import ChatPanel from '../_components/chat-panel'
import { AppSidebar } from '../_components/app-sidebar'
import NoteMetadataPanel from '../_components/note-metadata-panel'
import { getExplorerData } from './action'

async function getTodayNote() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/notes/today`,
      { cache: 'no-store' }
    )
    const data = await res.json()
    return data.note || null
  } catch {
    return null
  }
}

export default async function Page() {
  const [sidebarData, todayNote] = await Promise.all([
    getExplorerData(),
    getTodayNote(),
  ])

  const todayNoteId = todayNote ? `note-${todayNote.id}` : null

  return (
    <FileProvider sidebarMetadata={sidebarData.tree} initialNoteId={todayNoteId}>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 w-full flex min-h-screen">
          <div className="flex-1 relative">
            <SidebarTrigger className="fixed z-10" />
            <PlainEditor />
          </div>
          <NoteMetadataPanel />
        </main>
        <ChatPanel />
      </SidebarProvider>
    </FileProvider>
  )
}
