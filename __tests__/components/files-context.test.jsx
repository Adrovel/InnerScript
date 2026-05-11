// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FileProvider, useFileContext } from '@/app/_components/files-context'

function Inspector() {
  const ctx = useFileContext()
  return (
    <div>
      <span data-testid="tab">{ctx.railTab}</span>
      <span data-testid="open">{String(ctx.railOpen)}</span>
      <span data-testid="note">{ctx.selectedNoteId ?? 'none'}</span>
      <button data-testid="cycle"    onClick={ctx.cycleRail} />
      <button data-testid="set-chat" onClick={() => ctx.openRailTab('chat')} />
      <button data-testid="set-note" onClick={() => ctx.setSelectedNoteId('note-x')} />
    </div>
  )
}

function wrap(initialNoteId = null) {
  return render(
    <FileProvider sidebarMetadata={[]} initialNoteId={initialNoteId}>
      <Inspector />
    </FileProvider>
  )
}

describe('FileProvider — initial state', () => {
  it('opens on analysis tab by default', () => {
    wrap()
    expect(screen.getByTestId('tab').textContent).toBe('analysis')
    expect(screen.getByTestId('open').textContent).toBe('true')
  })

  it('seeds selectedNoteId from initialNoteId prop', () => {
    wrap('note-abc')
    expect(screen.getByTestId('note').textContent).toBe('note-abc')
  })

  it('throws when used outside provider', () => {
    expect(() => render(<Inspector />)).toThrow('useFileContext must be used within a FileProvider')
  })
})

describe('cycleRail', () => {
  it('analysis → chat (first cycle when open)', async () => {
    wrap()
    await userEvent.click(screen.getByTestId('cycle'))
    expect(screen.getByTestId('tab').textContent).toBe('chat')
    expect(screen.getByTestId('open').textContent).toBe('true')
  })

  it('chat → closed (second cycle)', async () => {
    wrap()
    await userEvent.click(screen.getByTestId('cycle')) // → chat
    await userEvent.click(screen.getByTestId('cycle')) // → closed
    expect(screen.getByTestId('open').textContent).toBe('false')
  })

  it('closed → opens again (third cycle)', async () => {
    wrap()
    await userEvent.click(screen.getByTestId('cycle')) // → chat
    await userEvent.click(screen.getByTestId('cycle')) // → closed
    await userEvent.click(screen.getByTestId('cycle')) // → open (stays on chat tab)
    expect(screen.getByTestId('open').textContent).toBe('true')
  })
})

describe('openRailTab', () => {
  it('switches tab and ensures rail is open', async () => {
    wrap()
    // Close it first
    await userEvent.click(screen.getByTestId('cycle'))
    await userEvent.click(screen.getByTestId('cycle'))
    expect(screen.getByTestId('open').textContent).toBe('false')

    await userEvent.click(screen.getByTestId('set-chat'))
    expect(screen.getByTestId('tab').textContent).toBe('chat')
    expect(screen.getByTestId('open').textContent).toBe('true')
  })
})

describe('setSelectedNoteId', () => {
  it('updates selectedNoteId', async () => {
    wrap()
    await userEvent.click(screen.getByTestId('set-note'))
    expect(screen.getByTestId('note').textContent).toBe('note-x')
  })
})
