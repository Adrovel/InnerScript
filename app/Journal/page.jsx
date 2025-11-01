import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { FileProvider } from '../_components/files-context'
import PlainEditor from '../_components/plain-editor'
import ChatPanel from '../_components/chat-panel'

import { getFileData } from './action'
import { AppSidebar } from '../_components/app-sidebar'

export default async function Page() {

  const sidebarData = await getFileData()

  return (
    <FileProvider sidebarMetadata={sidebarData}>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 w-full">
            <SidebarTrigger />
            <PlainEditor />
       </main>
       <ChatPanel />
      </SidebarProvider>
    </FileProvider>
  );
}
