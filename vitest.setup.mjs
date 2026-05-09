import { vi } from 'vitest'

// Silence console.error in tests unless needed
vi.spyOn(console, 'error').mockImplementation(() => {})
