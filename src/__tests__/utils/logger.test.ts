import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { logger } from '../../utils/logger'

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(global, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
})

// Mock console methods
const mockConsole = {
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
}

Object.defineProperty(global, 'console', {
  value: mockConsole,
  writable: true,
})

describe('Logger', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockLocalStorage.getItem.mockReturnValue(null)
  })

  afterEach(() => {
    logger.clearHistory()
  })

  describe('Basic Logging', () => {
    it('should log debug messages with correct format', () => {
      logger.debug('connection', 'Test debug message', { test: true })
      
      expect(mockConsole.debug).toHaveBeenCalledWith(
        '[CONNECTION] Test debug message',
        { test: true }
      )
    })

    it('should log info messages with correct format', () => {
      logger.info('node', 'Test info message')
      
      expect(mockConsole.info).toHaveBeenCalledWith(
        '[NODE] Test info message',
        ''
      )
    })

    it('should log warning messages with correct format', () => {
      logger.warn('validation', 'Test warning message')
      
      expect(mockConsole.warn).toHaveBeenCalledWith(
        '[VALIDATION] Test warning message',
        ''
      )
    })

    it('should log error messages with correct format', () => {
      logger.error('store', 'Test error message', new Error('Test error'))
      
      expect(mockConsole.error).toHaveBeenCalledWith(
        '[STORE] Test error message',
        new Error('Test error')
      )
    })
  })

  describe('Connection-specific logging', () => {
    it('should log connection start correctly', () => {
      logger.connectionStart('swapConnection', 'conn-123', { source: 'node1', target: 'node2' })
      
      expect(mockConsole.debug).toHaveBeenCalledWith(
        '[CONNECTION] swapConnection started for connection conn-123',
        { source: 'node1', target: 'node2' }
      )
    })

    it('should log connection success correctly', () => {
      logger.connectionSuccess('swapConnection', 'conn-123')
      
      expect(mockConsole.info).toHaveBeenCalledWith(
        '[CONNECTION] swapConnection completed successfully for connection conn-123',
        undefined
      )
    })

    it('should log connection error correctly', () => {
      const error = new Error('Connection failed')
      logger.connectionError('swapConnection', 'conn-123', error)
      
      expect(mockConsole.error).toHaveBeenCalledWith(
        '[CONNECTION] swapConnection failed for connection conn-123',
        error
      )
    })

    it('should log connection debug correctly', () => {
      logger.connectionDebug('swapConnection', 'Handle transformation', { old: 'left', new: 'right' })
      
      expect(mockConsole.debug).toHaveBeenCalledWith(
        '[CONNECTION] swapConnection: Handle transformation',
        { old: 'left', new: 'right' }
      )
    })
  })

  describe('Log History', () => {
    it('should maintain log history', () => {
      logger.info('general', 'First message')
      logger.debug('connection', 'Second message')
      logger.error('node', 'Third message')
      
      const history = logger.getLogHistory()
      expect(history).toHaveLength(3)
      expect(history[0].message).toBe('First message')
      expect(history[1].message).toBe('Second message')
      expect(history[2].message).toBe('Third message')
    })

    it('should clear log history', () => {
      logger.info('general', 'Test message')
      expect(logger.getLogHistory()).toHaveLength(1)
      
      logger.clearHistory()
      expect(logger.getLogHistory()).toHaveLength(0)
    })

    it('should limit history size', () => {
      // Log more than max history size (1000)
      for (let i = 0; i < 1002; i++) {
        logger.debug('general', `Message ${i}`)
      }
      
      const history = logger.getLogHistory()
      expect(history).toHaveLength(1000)
      expect(history[0].message).toBe('Message 2') // First two should be removed
    })
  })

  describe('Scope Management', () => {
    it('should enable and disable scopes', () => {
      logger.enableScope('connection')
      expect(logger.getEnabledScopes()).toContain('connection')
      
      logger.disableScope('connection')
      expect(logger.getEnabledScopes()).not.toContain('connection')
    })

    it('should save enabled scopes to localStorage', () => {
      logger.enableScope('connection')
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'recapmap-debug-scopes',
        expect.stringContaining('connection')
      )
    })

    it('should load enabled scopes from localStorage', async () => {
      mockLocalStorage.getItem.mockReturnValue('["connection", "node"]')
      
      // Create new logger instance to test loading
      const { logger: newLogger } = await import('../../utils/logger')
      
      expect(newLogger.getEnabledScopes()).toEqual(
        expect.arrayContaining(['connection', 'node'])
      )
    })
  })

  describe('Log Level Filtering', () => {
    it('should respect log level hierarchy', () => {
      logger.setLogLevel('warn')
      
      logger.debug('general', 'Debug message')
      logger.info('general', 'Info message')
      logger.warn('general', 'Warning message')
      logger.error('general', 'Error message')
      
      expect(mockConsole.debug).not.toHaveBeenCalled()
      expect(mockConsole.info).not.toHaveBeenCalled()
      expect(mockConsole.warn).toHaveBeenCalled()
      expect(mockConsole.error).toHaveBeenCalled()
    })

    it('should always log errors and warnings regardless of scope', () => {
      logger.disableScope('general')
      
      logger.warn('general', 'Warning message')
      logger.error('general', 'Error message')
      
      expect(mockConsole.warn).toHaveBeenCalled()
      expect(mockConsole.error).toHaveBeenCalled()
    })
  })
})
