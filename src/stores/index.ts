/**
 * RecapMap Store Index - Central export for all Zustand stores
 * This provides a clean API for accessing state management throughout the app
 */

// Export all stores
export { useNodeStore } from './nodeStore'
export { useUIStore } from './uiStore'
export { useProjectStore } from './projectStore'

// Export sync utilities
export { 
  setupStoreSynchronization, 
  cleanupStoreSynchronization, 
  getSynchronizationStatus,
  triggerSync 
} from './syncManager'

// Import stores for internal use
import { useNodeStore } from './nodeStore'
import { useUIStore } from './uiStore'
import { useProjectStore } from './projectStore'
import { setupStoreSynchronization } from './syncManager'

// Export types for convenience
export type {
  RecapMapNode,
  NodeType,
  NodeConnection,
  Panel,
  PanelType,
  CanvasState,
  UIState,
  Tool,
  Notification,
  ProjectState,
  ValidationResult,
  ExportOptions,
  ImportResult,
} from '../types'

// Store utilities and hooks
export const useStores = () => {
  const nodeStore = useNodeStore()
  const uiStore = useUIStore()
  const projectStore = useProjectStore()
  
  return {
    nodes: nodeStore,
    ui: uiStore,
    project: projectStore,
  }
}

// Initialize store synchronization
// This should be called once during app startup
let syncInitialized = false

export const initializeStores = () => {
  if (!syncInitialized) {
    setupStoreSynchronization()
    syncInitialized = true
    console.log('🔄 Store synchronization initialized')
  }
}

// Auto-initialize if in browser environment
if (typeof window !== 'undefined') {
  // Initialize on next tick to ensure all stores are ready
  setTimeout(initializeStores, 0)
}
