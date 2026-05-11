// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'

const { mockToggleSidebar, mockRouterPush, mockRouterRefresh } = vi.hoisted(() => ({
  mockToggleSidebar: vi.fn(),
  mockRouterPush:    vi.fn(),
  mockRouterRefresh: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockRouterPush, refresh: mockRouterRefresh }),
}))

vi.mock('@/components/ui/sidebar', () => ({
  useSidebar: () => ({ toggleSidebar: mockToggleSidebar }),
}))

global.fetch = vi.fn()

import { useKeyboardShortcuts } from '@/app/_hooks/use-keyboard-shortcuts'

function fire(key, { metaKey = false, shiftKey = false } = {}) {
  act(() => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key, metaKey, bubbles: true, shiftKey }))
  })
}

const mockCycleRail       = vi.fn()
const mockSetSelectedNoteId = vi.fn()
const mockOpenRailTab     = vi.fn()

function renderShortcuts() {
  return renderHook(() => useKeyboardShortcuts({
    cycleRail: mockCycleRail,
    setSelectedNoteId: mockSetSelectedNoteId,
    openRailTab: mockOpenRailTab,
  }))
}

beforeEach(() => {
  vi.clearAllMocks()
  global.fetch.mockResolvedValue({
    ok: true,
    json: async () => ({ note: { id: 'new-1' }, folder: { id: 'f-1' } }),
  })
})

describe('useKeyboardShortcuts', () => {
  it('Cmd+\\ toggles the sidebar', () => {
    renderShortcuts()
    fire('\\', { metaKey: true })
    expect(mockToggleSidebar).toHaveBeenCalledOnce()
  })

  it('Cmd+J cycles the right rail', () => {
    renderShortcuts()
    fire('j', { metaKey: true })
    expect(mockCycleRail).toHaveBeenCalledOnce()
  })

  it('Cmd+N creates a new note and selects it', async () => {
    renderShortcuts()
    fire('n', { metaKey: true })
    // Wait for both the fetch AND the downstream setSelectedNoteId (separate awaits in the handler)
    await vi.waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/notes', expect.objectContaining({ method: 'POST' }))
      expect(mockSetSelectedNoteId).toHaveBeenCalledWith('note-new-1')
    })
    expect(mockRouterRefresh).toHaveBeenCalled()
  })

  it('Cmd+Shift+N creates a new folder', async () => {
    renderShortcuts()
    fire('N', { metaKey: true, shiftKey: true })
    await vi.waitFor(() => expect(global.fetch).toHaveBeenCalledWith(
      '/api/folders',
      expect.objectContaining({ method: 'POST' })
    ))
    expect(mockRouterRefresh).toHaveBeenCalled()
  })

  it('non-modifier keys are ignored', () => {
    renderShortcuts()
    fire('j')
    fire('n')
    fire('\\')
    expect(mockCycleRail).not.toHaveBeenCalled()
    expect(global.fetch).not.toHaveBeenCalled()
    expect(mockToggleSidebar).not.toHaveBeenCalled()
  })

  it('cleans up listener on unmount', () => {
    const spy = vi.spyOn(document, 'removeEventListener')
    const { unmount } = renderShortcuts()
    unmount()
    expect(spy).toHaveBeenCalledWith('keydown', expect.any(Function))
  })
})
