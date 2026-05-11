import { FileProvider } from '@/app/_components/files-context'

export const sampleTree = [
  { id: 'note-1', type: 'note', name: 'Note One',  title: 'Note One'  },
  { id: 'note-2', type: 'note', name: 'Note Two',  title: 'Note Two'  },
  {
    id: 'folder-1', type: 'folder', name: 'Work',
    children: [{ id: 'note-3', type: 'note', name: 'Work Note', title: 'Work Note' }],
  },
]

/** Wrap a component under test with FileProvider, pre-loaded with sample data */
export function makeWrapper({ initialNoteId = null, tree = sampleTree } = {}) {
  return function Wrapper({ children }) {
    return (
      <FileProvider sidebarMetadata={tree} initialNoteId={initialNoteId}>
        {children}
      </FileProvider>
    )
  }
}
