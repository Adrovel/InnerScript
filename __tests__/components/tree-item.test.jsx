// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { makeWrapper } from './_helpers'

const { mockRefresh } = vi.hoisted(() => ({ mockRefresh: vi.fn() }))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: mockRefresh }),
}))

vi.mock('@/components/ui/sidebar', () => ({
  SidebarMenuItem:      ({ children }) => <div>{children}</div>,
  SidebarMenuButton:    ({ children, onClick, isActive, ...p }) => <button onClick={onClick} data-active={isActive} {...p}>{children}</button>,
  SidebarMenuSub:       ({ children }) => <div>{children}</div>,
  SidebarMenuSubItem:   ({ children }) => <div>{children}</div>,
  SidebarMenuSubButton: ({ children, onClick, isActive, ...p }) => <button onClick={onClick} data-active={isActive} {...p}>{children}</button>,
}))

vi.mock('@/components/ui/collapsible', () => ({
  Collapsible:        ({ children, open, onOpenChange }) => <div data-open={String(open)} onClick={() => onOpenChange?.(!open)}>{children}</div>,
  CollapsibleTrigger: ({ children, asChild }) => asChild ? children : <button>{children}</button>,
  // Only render children when open — prevents child-note buttons leaking into parent-folder assertions
  CollapsibleContent: ({ children }) => <div data-testid="collapsible-content" style={{ display: 'none' }}>{children}</div>,
}))

vi.mock('@/components/ui/alert-dialog', () => ({
  AlertDialog:            ({ children, open })       => open ? <div role="alertdialog">{children}</div> : null,
  AlertDialogContent:     ({ children })             => <div>{children}</div>,
  AlertDialogHeader:      ({ children })             => <div>{children}</div>,
  AlertDialogTitle:       ({ children })             => <h2>{children}</h2>,
  AlertDialogDescription: ({ children })             => <p>{children}</p>,
  AlertDialogFooter:      ({ children })             => <div>{children}</div>,
  AlertDialogCancel:      ({ children, ...p })       => <button {...p}>{children}</button>,
  AlertDialogAction:      ({ children, onClick, ...p }) => <button onClick={onClick} {...p}>{children}</button>,
}))

vi.mock('@/app/_components/resuable-context-menu', () => ({
  ResuableContextMenu: ({ children }) => <div>{children}</div>,
}))

global.fetch = vi.fn()

import { TreeItem } from '@/app/_components/tree-item'

const noteItem   = { id: 'note-1', type: 'note',   name: 'My Note',   title: 'My Note'   }
const folderItem = { id: 'folder-1', type: 'folder', name: 'My Folder', children: [noteItem] }

function renderNote(props = {}) {
  return render(
    <TreeItem item={noteItem} onSelectNote={vi.fn()} selectedNoteId={null} {...props} />,
    { wrapper: makeWrapper() }
  )
}

function renderFolder(props = {}) {
  return render(
    <TreeItem item={folderItem} onSelectNote={vi.fn()} selectedNoteId={null} {...props} />,
    { wrapper: makeWrapper() }
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  localStorage.clear()
  global.fetch.mockResolvedValue({ ok: true, json: async () => ({}) })
})

describe('TreeItem — note', () => {
  it('renders the note name', () => {
    renderNote()
    expect(screen.getByText('My Note')).toBeInTheDocument()
  })

  it('calls onSelectNote when clicked', async () => {
    const onSelectNote = vi.fn()
    renderNote({ onSelectNote })
    await userEvent.click(screen.getByText('My Note'))
    expect(onSelectNote).toHaveBeenCalledWith('note-1')
  })

  it('shows action buttons on hover', async () => {
    renderNote()
    await userEvent.hover(screen.getByText('My Note').closest('button'))
    expect(screen.getByTitle('Rename')).toBeVisible()
    expect(screen.getByTitle('Delete')).toBeVisible()
  })

  it('entering rename mode shows an input with the current name', async () => {
    renderNote()
    await userEvent.hover(screen.getByText('My Note').closest('button'))
    await userEvent.click(screen.getByTitle('Rename'))
    expect(screen.getByDisplayValue('My Note')).toBeInTheDocument()
  })

  it('commits rename on Enter and calls fetch PUT + router.refresh', async () => {
    renderNote()
    await userEvent.hover(screen.getByText('My Note').closest('button'))
    await userEvent.click(screen.getByTitle('Rename'))

    const input = screen.getByDisplayValue('My Note')
    await userEvent.clear(input)
    await userEvent.type(input, 'Renamed Note')
    await userEvent.keyboard('{Enter}')

    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith(
      '/api/notes/1',
      expect.objectContaining({ method: 'PUT' })
    ))
    expect(mockRefresh).toHaveBeenCalled()
  })

  it('cancels rename on Escape without fetching', async () => {
    renderNote()
    await userEvent.hover(screen.getByText('My Note').closest('button'))
    await userEvent.click(screen.getByTitle('Rename'))
    await userEvent.keyboard('{Escape}')

    expect(global.fetch).not.toHaveBeenCalled()
    expect(screen.getByText('My Note')).toBeInTheDocument()
  })

  it('shows delete AlertDialog when trash is clicked', async () => {
    renderNote()
    await userEvent.hover(screen.getByText('My Note').closest('button'))
    await userEvent.click(screen.getByTitle('Delete'))
    expect(screen.getByRole('alertdialog')).toBeInTheDocument()
    expect(screen.getByText(/delete note/i)).toBeInTheDocument()
  })

  it('calls DELETE and refresh on confirm delete', async () => {
    renderNote()
    await userEvent.hover(screen.getByText('My Note').closest('button'))
    await userEvent.click(screen.getByTitle('Delete'))

    // Click the confirm button inside the dialog (not the trash icon button)
    const dialog = screen.getByRole('alertdialog')
    await userEvent.click(within(dialog).getByRole('button', { name: /delete/i }))

    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith(
      '/api/notes/1',
      expect.objectContaining({ method: 'DELETE' })
    ))
    expect(mockRefresh).toHaveBeenCalled()
  })
})

describe('TreeItem — folder', () => {
  it('renders the folder name', () => {
    renderFolder()
    expect(screen.getByText('My Folder')).toBeInTheDocument()
  })

  it('persists open state to localStorage', async () => {
    renderFolder()
    const folderBtn = screen.getByText('My Folder').closest('button')
    await userEvent.click(folderBtn)
    expect(localStorage.getItem('tree-open-folder-1')).toBe('true')
  })

  it('reads initial open state from localStorage', () => {
    localStorage.setItem('tree-open-folder-1', 'true')
    renderFolder()
    const collapsible = screen.getByText('My Folder').closest('[data-open]')
    expect(collapsible.dataset.open).toBe('true')
  })

  it('shows delete dialog with folder-specific copy', async () => {
    renderFolder()
    await userEvent.hover(screen.getByText('My Folder').closest('button'))
    // The folder row has title="Delete"; get the first one (the folder's own trash button)
    await userEvent.click(screen.getAllByTitle('Delete')[0])
    expect(screen.getByRole('alertdialog')).toBeInTheDocument()
    expect(screen.getByText(/delete folder/i)).toBeInTheDocument()
  })
})
