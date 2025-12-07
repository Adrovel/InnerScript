import { SidebarProvider } from '@/components/ui/sidebar'
import { FileProvider } from '../_components/files-context'
import { PlainEditor } from '../_components/plain-editor'
// import { ChatPanel } from '../_components/bak_chat-panel'
import { TopBar } from '../_components/top-bar'
import { AppSidebar } from '../_components/app-sidebar'

import { getExplorerData } from './action'


export default async function Page() {

  const sidebarData = await getExplorerData()

  return (
    <FileProvider sidebarMetadata={sidebarData.tree}>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 w-full relative flex flex-col">
            <TopBar />
            <PlainEditor />
       </main>
       {/* <ChatPanel /> */}
      </SidebarProvider>
    </FileProvider>
  );
}
