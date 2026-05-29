import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { FileProvider } from '../_components/files-context'
import PlainEditor from '../_components/plain-editor'
import RightRail from '../_components/right-rail'
import { AppSidebar } from '../_components/app-sidebar'
import CommandPalette from '../_components/command-palette'
import KeyboardShortcutsMount from '../_components/keyboard-shortcuts-mount'
import { getExplorerData } from './action'

export const dynamic = 'force-dynamic'

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
        <main className="flex-1 flex min-h-screen overflow-hidden">
          <div className="flex-1 relative overflow-hidden">
            <SidebarTrigger className="fixed top-3 left-3 z-10" />
            <PlainEditor />
          </div>
          <RightRail />
        </main>
        <CommandPalette />
        <KeyboardShortcutsMount />
      </SidebarProvider>
    </FileProvider>
  )
}
