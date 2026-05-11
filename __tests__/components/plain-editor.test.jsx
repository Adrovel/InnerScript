// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { makeWrapper } from './_helpers'
import PlainEditor from '@/app/_components/plain-editor'

global.fetch = vi.fn()

beforeEach(() => {
  vi.clearAllMocks()
  global.fetch.mockResolvedValue({
    ok: true,
    json: async () => ({ note: { id: '1', title: 'My Note', content: 'Hello world' } }),
  })
})

describe('PlainEditor — empty state', () => {
  it('shows prompt when no note is selected', () => {
    render(<PlainEditor />, { wrapper: makeWrapper() })
    expect(screen.getByText(/select a note/i)).toBeInTheDocument()
  })

  it('does not show the editor textarea without a selected note', () => {
    render(<PlainEditor />, { wrapper: makeWrapper() })
    expect(screen.queryByPlaceholderText(/start writing/i)).not.toBeInTheDocument()
  })
})

describe('PlainEditor — with selected note', () => {
  it('fetches and renders the note content', async () => {
    render(<PlainEditor />, { wrapper: makeWrapper({ initialNoteId: 'note-1' }) })
    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('/api/notes/1'))
    expect(await screen.findByDisplayValue('My Note')).toBeInTheDocument()
  })

  it('shows the PanelRight toggle button', async () => {
    render(<PlainEditor />, { wrapper: makeWrapper({ initialNoteId: 'note-1' }) })
    await screen.findByDisplayValue('My Note')
    expect(screen.getByTitle(/toggle side panel/i)).toBeInTheDocument()
  })

  it('toggle button has active styling when rail is open', async () => {
    render(<PlainEditor />, { wrapper: makeWrapper({ initialNoteId: 'note-1' }) })
    await screen.findByDisplayValue('My Note')
    const btn = screen.getByTitle(/toggle side panel/i)
    // Default railOpen=true → should have primary styling
    expect(btn.className).toContain('text-primary')
  })

  it('triggers a PUT save after typing stops', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({ note: { id: '1', title: 'T', content: 'Hello world' } }) })
      .mockResolvedValue({ ok: true, json: async () => ({}) })

    render(<PlainEditor />, { wrapper: makeWrapper({ initialNoteId: 'note-1' }) })
    vi.useRealTimers() // let the fetch/useEffect settle
    await screen.findByDisplayValue('T')

    vi.useFakeTimers({ shouldAdvanceTime: true })
    await userEvent.type(screen.getByDisplayValue('T'), 'x', { delay: null })
    vi.advanceTimersByTime(3000) // past the 2s debounce
    vi.useRealTimers()

    await waitFor(() => {
      const calls = global.fetch.mock.calls
      expect(calls.some(([url, opts]) => url.includes('/api/notes') && opts?.method === 'PUT')).toBe(true)
    })
  })
})
