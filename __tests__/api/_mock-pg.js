// Shared pg Pool mock factory for API route tests.
// Import this file and spread into vi.mock('pg') factory.
import { vi } from 'vitest'

export const mockQuery = vi.fn()
export const mockRelease = vi.fn()
export const mockConnect = vi.fn(() =>
  Promise.resolve({ query: mockQuery, release: mockRelease })
)

// Pool must be a proper constructor (class) to work with `new Pool()`
export function createPgMock() {
  return {
    Pool: function Pool() {
      this.connect = mockConnect
    },
  }
}
