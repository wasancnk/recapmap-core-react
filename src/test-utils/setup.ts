import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Mock import.meta.env for tests
vi.mock('import.meta', () => ({
  env: {
    DEV: true,
    PROD: false,
    VITE_LOG_LEVEL: 'debug',
  },
}))

// Mock React Flow (for tests that don't need full React Flow)
vi.mock('@xyflow/react', () => ({
  ReactFlow: vi.fn(() => null),
  Background: vi.fn(() => null),
  Controls: vi.fn(() => null),
  MiniMap: vi.fn(() => null),
  Handle: vi.fn(() => null),
  Position: {
    Top: 'top',
    Right: 'right',
    Bottom: 'bottom',
    Left: 'left',
  },
  MarkerType: {
    Arrow: 'arrow',
    ArrowClosed: 'arrowclosed',
  },
  ConnectionMode: {
    Strict: 'strict',
    Loose: 'loose',
  },
  useNodesState: vi.fn(() => [[], vi.fn(), vi.fn()]),
  useEdgesState: vi.fn(() => [[], vi.fn(), vi.fn()]),
}))

// Global test utilities
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Suppress console warnings during tests (but keep errors)
const originalWarn = console.warn
beforeEach(() => {
  console.warn = vi.fn()
})

afterEach(() => {
  console.warn = originalWarn
  vi.clearAllMocks()
})
