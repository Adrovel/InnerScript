'use client'

import { useFileContext } from './files-context'
import { useKeyboardShortcuts } from '../_hooks/use-keyboard-shortcuts'

export default function KeyboardShortcutsMount() {
  const { cycleRail, setSelectedNoteId, openRailTab } = useFileContext()
  useKeyboardShortcuts({ cycleRail, setSelectedNoteId, openRailTab })
  return null
}
