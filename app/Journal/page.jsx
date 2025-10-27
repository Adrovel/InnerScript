import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { FileProvider } from '../_components/FilesContext'
import PlainEditor from '../_components/PlainEditor'
import ChatPanel from '../_components/ChatPanel'

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
       </main>
      </SidebarProvider>
    </FileProvider>
  );
}
