import React from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { vi } from 'vitest'

/**
 * Test utilities and custom render functions
 */

// Custom render function that includes providers if needed
const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  // For now, we'll use the basic render
  // Later we can add providers like React Router if needed
  return render(ui, options)
}

// Mock event helpers
export const createMockEvent = (type: string, properties: Record<string, unknown> = {}) => ({
  type,
  preventDefault: vi.fn(),
  stopPropagation: vi.fn(),
  target: { value: '' },
  currentTarget: { value: '' },
  ...properties,
})

// Mock React Flow events
export const createMockConnectionEvent = (
  source: string,
  target: string,
  sourceHandle = 'right-source',
  targetHandle = 'left-target'
) => ({
  source,
  target,
  sourceHandle,
  targetHandle,
})

// Mock drag events for React Flow
export const createMockDragEvent = (nodeId: string, position: { x: number; y: number }) => ({
  type: 'dragend',
  node: {
    id: nodeId,
    position,
  },
})

// Helper to wait for async operations
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0))

// Mock window methods
export const mockWindowMethods = () => {
  Object.defineProperty(window, 'getComputedStyle', {
    value: () => ({
      getPropertyValue: () => '',
    }),
  })
}

// Re-export everything from testing library
export * from '@testing-library/react'
export * from '@testing-library/user-event'
export { customRender as render }
