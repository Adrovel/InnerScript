// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { makeWrapper } from './_helpers'

const { mockRouterPush, mockRouterRefresh } = vi.hoisted(() => ({
  mockRouterPush:    vi.fn(),
  mockRouterRefresh: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockRouterPush, refresh: mockRouterRefresh }),
}))

vi.mock('@/components/ui/command', () => ({
  CommandDialog:    ({ children, open, onOpenChange }) =>
    open ? <div role="dialog" onClick={() => onOpenChange(false)}>{children}</div> : null,
  CommandInput:     ({ value, onValueChange, placeholder }) =>
    <input role="searchbox" value={value} onChange={e => onValueChange(e.target.value)} placeholder={placeholder} />,
  CommandList:      ({ children }) => <div>{children}</div>,
  CommandEmpty:     ({ children }) => <p>{children}</p>,
  CommandGroup:     ({ children, heading }) => <div><span>{heading}</span>{children}</div>,
  CommandItem:      ({ children, onSelect, value }) => <button onClick={() => onSelect(value)}>{children}</button>,
  CommandSeparator: () => <hr />,
}))

vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children }) => <span>{children}</span>,
}))

global.fetch = vi.fn()

import CommandPalette from '@/app/_components/command-palette'

function openPalette() {
  act(() => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }))
  })
}

beforeEach(() => {
  vi.useRealTimers() // always restore — fake timers left by a failing test contaminate the next
  vi.clearAllMocks()
  global.fetch.mockResolvedValue({ ok: true, json: async () => ({ notes: [] }) })
})

describe('CommandPalette — opening', () => {
  it('is closed by default (dialog not in DOM)', () => {
    render(<CommandPalette />, { wrapper: makeWrapper() })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('opens on Cmd+K', () => {
    render(<CommandPalette />, { wrapper: makeWrapper() })
    openPalette()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('opens and closes on repeated Cmd+K', () => {
    render(<CommandPalette />, { wrapper: makeWrapper() })
    openPalette()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    openPalette()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})

function typeInSearch(value) {
  // fireEvent.change is more reliable than userEvent.type for controlled inputs
  // in React 19 where the synthetic event system changed
  act(() => {
    fireEvent.change(screen.getByRole('searchbox'), { target: { value } })
  })
}

describe('CommandPalette — search mode', () => {
  it('shows all notes from sidebar when query is empty', async () => {
    render(<CommandPalette />, { wrapper: makeWrapper() })
    openPalette()
    expect(await screen.findByText('Note One')).toBeInTheDocument()
    expect(screen.getByText('Note Two')).toBeInTheDocument()
  })

  it('calls /api/notes/search after the 300ms debounce fires', async () => {
    render(<CommandPalette />, { wrapper: makeWrapper() })
    openPalette()
    typeInSearch('work')
    await waitFor(
      () => expect(global.fetch).toHaveBeenCalledWith('/api/notes/search', expect.objectContaining({ method: 'POST' })),
      { timeout: 2000 }
    )
  })

  it('shows search results returned by the API', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ notes: [{ id: 'x', title: 'Work stuff', similarity: 0.9 }] }),
    })
    render(<CommandPalette />, { wrapper: makeWrapper() })
    openPalette()
    typeInSearch('work')
    expect(await screen.findByText('Work stuff')).toBeInTheDocument()
    expect(screen.getByText('semantic')).toBeInTheDocument()
  })

  it('shows "No notes found" when API returns empty array', async () => {
    render(<CommandPalette />, { wrapper: makeWrapper() })
    openPalette()
    typeInSearch('xyz')
    expect(await screen.findByText(/no notes found/i)).toBeInTheDocument()
  })
})

describe('CommandPalette — command mode (> prefix)', () => {
  it('shows command list when > is typed', async () => {
    render(<CommandPalette />, { wrapper: makeWrapper() })
    openPalette()
    typeInSearch('>')
    expect(await screen.findByText('New note')).toBeInTheDocument()
    expect(screen.getByText('New folder')).toBeInTheDocument()
    expect(screen.getByText('Go to Insights')).toBeInTheDocument()
  })

  it('does not call search API in command mode', async () => {
    render(<CommandPalette />, { wrapper: makeWrapper() })
    openPalette()
    typeInSearch('>new')
    // Wait past the debounce window — no fetch should fire
    await new Promise(r => setTimeout(r, 500))
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('New note command creates a note and closes palette', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ note: { id: 'new-1', title: 'Untitled Note' } }),
    })
    render(<CommandPalette />, { wrapper: makeWrapper() })
    openPalette()
    typeInSearch('>')
    const newNoteBtn = await screen.findByText('New note')
    await userEvent.click(newNoteBtn.closest('button'))

    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith(
      '/api/notes',
      expect.objectContaining({ method: 'POST' })
    ))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('Go to Insights command navigates and closes palette', async () => {
    render(<CommandPalette />, { wrapper: makeWrapper() })
    openPalette()
    typeInSearch('>')
    const insightsBtn = await screen.findByText('Go to Insights')
    await userEvent.click(insightsBtn.closest('button'))

    expect(mockRouterPush).toHaveBeenCalledWith('/Journal/insights')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
