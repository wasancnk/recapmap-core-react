/**
 * Test Utilities Barrel Export
 * 
 * Centralizes all testing utilities for easy import across test files.
 * This includes mock data factories, test helpers, setup utilities, and dev tools.
 */

// Core test utilities
export * from './setup'
export * from './testHelpers'
export * from './mockData'
export * from './mockFactories'

// Development utilities (for manual testing and debugging)
export { ZustandTest } from './ZustandTest'

// Re-export commonly used testing library functions for convenience
export {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
  cleanup,
  renderHook,
} from '@testing-library/react'

export { default as userEvent } from '@testing-library/user-event'

export { vi, expect, describe, it, test, beforeEach, afterEach, beforeAll, afterAll } from 'vitest'
