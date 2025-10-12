import Sidebar from '../_components/Sidebar'
import PlainEditor from '../_components/PlainEditor'
import ChatPanel from '../_components/ChatPanel'

import { getTreeData } from './action'

export default async function Page() {

  const sidebarData = await getTreeData()

  return (
    <>
      <div className="flex h-screen">
        <Sidebar
          sidebarData={sidebarData}
        />
        {/* <main className="flex-1 p-0 overflow-auto">
            <PlainEditor/>
        </main>
        <ChatPanel />*/}
      </div>
    </>
  );
}
