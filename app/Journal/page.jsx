import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { FileProvider } from '../_components/files-context'
import { PlainEditor } from '../_components/plain-editor'
import { ChatPanel } from '../_components/chat-panel'
import { AppSidebar } from '../_components/app-sidebar'

import { getExplorerData } from './action'


export default async function Page() {

  const sidebarData = await getExplorerData()

  return (
    <FileProvider sidebarMetadata={sidebarData.tree}>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 w-full">
            <SidebarTrigger className="fixed"/>
            <PlainEditor />
       </main>
       {/* <ChatPanel /> */}
      </SidebarProvider>
    </FileProvider>
  );
}
