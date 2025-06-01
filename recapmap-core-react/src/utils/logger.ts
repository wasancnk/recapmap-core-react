/**
 * Environment-based Logging System for RecapMap
 * Replaces console.log statements with configurable, scoped logging
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'
export type LogScope = 'connection' | 'node' | 'store' | 'ui' | 'validation' | 'export' | 'general'

interface LogEntry {
  level: LogLevel
  scope: LogScope
  message: string
  data?: unknown
  timestamp: string
}

class Logger {
  private isProduction = import.meta.env.PROD
  private debugMode = import.meta.env.DEV || localStorage.getItem('recapmap-debug') === 'true'
  private logLevel: LogLevel = (import.meta.env.VITE_LOG_LEVEL as LogLevel) || 'info'
  private enabledScopes: Set<LogScope> = new Set()
  private logHistory: LogEntry[] = []
  private maxHistorySize = 1000

  constructor() {    // Initialize enabled scopes based on environment
    if (this.debugMode) {
      this.enabledScopes = new Set(['connection', 'node', 'store', 'ui', 'validation', 'export', 'general'])
    } else {
      // In production, only enable general scope (errors/warnings are always logged regardless of scope)
      this.enabledScopes = new Set(['general'])
    }

    // Allow runtime scope control via localStorage
    const debugScopes = localStorage.getItem('recapmap-debug-scopes')
    if (debugScopes) {
      try {
        const scopes = JSON.parse(debugScopes) as LogScope[]
        this.enabledScopes = new Set(scopes)
      } catch {
        // Invalid JSON, keep defaults
      }
    }
  }
  private shouldLog(level: LogLevel, scope: LogScope): boolean {
    // Always log errors and warnings
    if (level === 'error' || level === 'warn') return true
    
    // In production, only log errors and warnings
    if (this.isProduction && (level === 'info' || level === 'debug')) return false
    
    // Check if scope is enabled
    if (!this.enabledScopes.has(scope)) return false
    
    // Check log level hierarchy
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error']
    const currentLevelIndex = levels.indexOf(this.logLevel)
    const messageLevelIndex = levels.indexOf(level)
    
    return messageLevelIndex >= currentLevelIndex
  }

  private log(level: LogLevel, scope: LogScope, message: string, data?: unknown): void {
    if (!this.shouldLog(level, scope)) return

    const timestamp = new Date().toISOString()
    const logEntry: LogEntry = { level, scope, message, data, timestamp }
    
    // Add to history
    this.logHistory.push(logEntry)
    if (this.logHistory.length > this.maxHistorySize) {
      this.logHistory.shift()
    }

    // Format console output
    const prefix = `[${scope.toUpperCase()}]`
    const formattedMessage = `${prefix} ${message}`
    
    // Use appropriate console method
    switch (level) {
      case 'debug':
        console.debug(formattedMessage, data || '')
        break
      case 'info':
        console.info(formattedMessage, data || '')
        break
      case 'warn':
        console.warn(formattedMessage, data || '')
        break
      case 'error':
        console.error(formattedMessage, data || '')
        break
    }
  }

  // Public API methods
  debug(scope: LogScope, message: string, data?: unknown): void {
    this.log('debug', scope, message, data)
  }

  info(scope: LogScope, message: string, data?: unknown): void {
    this.log('info', scope, message, data)
  }

  warn(scope: LogScope, message: string, data?: unknown): void {
    this.log('warn', scope, message, data)
  }

  error(scope: LogScope, message: string, data?: unknown): void {
    this.log('error', scope, message, data)
  }

  // Development utilities
  enableScope(scope: LogScope): void {
    this.enabledScopes.add(scope)
    this.saveEnabledScopes()
  }

  disableScope(scope: LogScope): void {
    this.enabledScopes.delete(scope)
    this.saveEnabledScopes()
  }

  getEnabledScopes(): LogScope[] {
    return Array.from(this.enabledScopes)
  }

  getLogHistory(): LogEntry[] {
    return [...this.logHistory]
  }

  clearHistory(): void {
    this.logHistory = []
  }

  setLogLevel(level: LogLevel): void {
    this.logLevel = level
  }

  private saveEnabledScopes(): void {
    localStorage.setItem('recapmap-debug-scopes', JSON.stringify(Array.from(this.enabledScopes)))
  }

  // Connection-specific logging methods (for the swap fix)
  connectionStart(operation: string, connectionId: string, details?: unknown): void {
    this.debug('connection', `${operation} started for connection ${connectionId}`, details)
  }

  connectionSuccess(operation: string, connectionId: string, details?: unknown): void {
    this.info('connection', `${operation} completed successfully for connection ${connectionId}`, details)
  }

  connectionError(operation: string, connectionId: string, error: unknown): void {
    this.error('connection', `${operation} failed for connection ${connectionId}`, error)
  }

  connectionDebug(operation: string, message: string, data?: unknown): void {
    this.debug('connection', `${operation}: ${message}`, data)
  }
}

// Export singleton instance
export const logger = new Logger()

// Development utilities for browser console
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  // @ts-expect-error - Adding to window for debugging
  window.recapMapLogger = {
    enable: (scope: LogScope) => logger.enableScope(scope),
    disable: (scope: LogScope) => logger.disableScope(scope),
    setLevel: (level: LogLevel) => logger.setLogLevel(level),
    getHistory: () => logger.getLogHistory(),
    clear: () => logger.clearHistory(),
    scopes: () => logger.getEnabledScopes(),
  }
}
