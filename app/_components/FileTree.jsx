import { useState } from "react";

import { ChevronRight, FilePlus, FolderPlus } from "lucide-react";

import clsx from "clsx";

export default function FileTree({explorer, depth = 0}) {
  const [isOpen, setIsOpen] = useState(false)

  const [showInput, setShowInput] = useState({ visible: false, isFolder: null})

  const isFolder = explorer.isFolder

  const handleToggle = () => {
    if(isFolder) setIsOpen(!isOpen)
  }

  const handleNewFolder = (e, isFolder) => {
      e.stopPropagation();
      setIsOpen(true)

    setShowInput({
      visible: true, 
      isFolder
    })
  }

  const addNewFolder = (e) =>{
    if(e.keyCode === 13 && e.target.value){

    setShowInput({...showInput, visible: false})
  }
}

  return ( 
   <div>
      <div onClick={handleToggle}
         className={clsx(
          'flex items-center justify-between text-sm cursor-pointer rounded px-2 py-2 hover:bg-sky-200 transition-colors',
          isFolder && 'font-medium text-gray-800'
        )}
         style={{ paddingLeft: `${depth * 1.25} rem`}}
      >
      {isFolder && (
        <ChevronRight size={16}
          className={clsx(
           'mr-1 transition-transform',
           isOpen && 'rotate-90'
          )}/>
      )}
        <span className="truncate">{explorer.name}</span>

        {/* {isFolder && (
          <div>
            <button onClick={(e)=>handleNewFolder(e,false)}><FilePlus size={18}/></button>
            <button onClick={(e)=>handleNewFolder(e,true)}><FolderPlus size={18}/></button>
          </div>)} */}

      </div>
        {showInput.visible && (
           <input
            type="text"
            placeholder="Enter name"
            onKeyDown={addNewFolder}
            onBlur={()=> setShowInput({...showInput, visible:false})}
            autoFocus
            class="px-2 py-1 border rounded"/>
          )}
      { isOpen && isFolder && (
        <div>{explorer.Files.map((file)=>{
          return <FileTree key={file.id} explorer={file} depth={depth + 1}/>
        })}
        </div>
      )
    }
  </div>
  );
}