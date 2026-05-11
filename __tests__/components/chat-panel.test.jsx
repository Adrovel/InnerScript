// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { makeWrapper } from './_helpers'

const { mockSetMessages, mockHandleSubmit, mockMessages } = vi.hoisted(() => {
  const mockSetMessages = vi.fn()
  const mockHandleSubmit = vi.fn()
  const mockMessages = { current: [] }
  return { mockSetMessages, mockHandleSubmit, mockMessages }
})

vi.mock('@ai-sdk/react', () => ({
  useChat: vi.fn(() => ({
    messages: mockMessages.current,
    input: '',
    handleInputChange: vi.fn(),
    handleSubmit: mockHandleSubmit,
    isLoading: false,
    setMessages: mockSetMessages,
  })),
}))

// PopoverMenu is irrelevant to these tests — stub it
vi.mock('@/app/_components/chat-popover-menu', () => ({
  PopoverMenu: ({ options, selectedOptions }) => (
    <div data-testid="popover" data-count={selectedOptions.length} />
  ),
}))

import ChatPanel from '@/app/_components/chat-panel'
import { sampleTree } from './_helpers'

beforeEach(() => {
  vi.clearAllMocks()
  mockMessages.current = []
  // jsdom doesn't implement scrollIntoView
  Element.prototype.scrollIntoView = vi.fn()
})

describe('ChatPanel — note auto-seeding', () => {
  it('adds the currently selected note as a chip when panel mounts', async () => {
    render(<ChatPanel />, { wrapper: makeWrapper({ initialNoteId: 'note-1' }) })
    // note-1 is "Note One" in sampleTree
    await waitFor(() => expect(screen.getByText('Note One')).toBeInTheDocument())
  })

  it('does not duplicate the chip if the same note is already selected', async () => {
    render(<ChatPanel />, { wrapper: makeWrapper({ initialNoteId: 'note-1' }) })
    await waitFor(() => screen.getByText('Note One'))
    const chips = screen.getAllByText('Note One')
    expect(chips).toHaveLength(1)
  })

  it('shows no chips when no note is selected', () => {
    render(<ChatPanel />, { wrapper: makeWrapper() })
    expect(screen.queryByText('Note One')).not.toBeInTheDocument()
    expect(screen.queryByText('Note Two')).not.toBeInTheDocument()
  })

  it('removes chip when × button is clicked', async () => {
    render(<ChatPanel />, { wrapper: makeWrapper({ initialNoteId: 'note-1' }) })
    await waitFor(() => screen.getByText('Note One'))

    // Find the × button inside the chip
    const removeButtons = screen.getAllByRole('button')
    const removeChip = removeButtons.find(btn => btn.closest('span') && btn.querySelector('svg'))
    await userEvent.click(removeChip)
    await waitFor(() => expect(screen.queryByText('Note One')).not.toBeInTheDocument())
  })
})

describe('ChatPanel — clear chat', () => {
  it('does not show clear button when messages are empty', () => {
    render(<ChatPanel />, { wrapper: makeWrapper() })
    expect(screen.queryByTitle(/clear chat/i)).not.toBeInTheDocument()
  })

  it('shows clear button and calls setMessages([]) when clicked', async () => {
    mockMessages.current = [{ id: '1', role: 'user', content: 'Hello' }]
    render(<ChatPanel />, { wrapper: makeWrapper() })

    const clearBtn = await screen.findByTitle(/clear chat/i)
    await userEvent.click(clearBtn)
    expect(mockSetMessages).toHaveBeenCalledWith([])
  })
})

describe('ChatPanel — empty state hint', () => {
  it('shows contextual hint based on selected files', async () => {
    render(<ChatPanel />, { wrapper: makeWrapper({ initialNoteId: 'note-1' }) })
    await waitFor(() => screen.getByText('Note One'))
    expect(screen.getByText(/chatting with 1 note/i)).toBeInTheDocument()
  })

  it('shows generic hint when no notes selected', () => {
    render(<ChatPanel />, { wrapper: makeWrapper() })
    expect(screen.getByText(/open a note and ask/i)).toBeInTheDocument()
  })
})
