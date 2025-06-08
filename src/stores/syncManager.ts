/**
 * Store Synchronization Manager
 * Handles cross-store synchronization for RecapMap stores
 * 
 * Phase 2 Implementation: nodeStore ↔ projectStore synchronization
 */

import { useNodeStore } from './nodeStore'
import { useProjectStore } from './projectStore'
import { logger } from '../utils/logger'

// Track subscription cleanup functions
const subscriptions = new Map<string, (() => void)>()

/**
 * Set up cross-store synchronization
 * Call this once during app initialization
 */
export function setupStoreSynchronization() {
  logger.info('store', 'Setting up store synchronization...')
  
  // Clean up any existing subscriptions
  cleanupStoreSynchronization()
  
  // nodeStore → projectStore synchronization
  const nodeStoreUnsubscribe = useNodeStore.subscribe((state, prevState) => {
    // Check if actual data changed (not just transient UI state)
    const nodesChanged = state.nodes !== prevState.nodes
    const connectionsChanged = state.connections !== prevState.connections
    
    if (nodesChanged || connectionsChanged) {
      logger.debug('store', 'Node data changed, updating project status')
      
      const projectStore = useProjectStore.getState()
      
      // Mark project as modified
      projectStore.markAsModified()
      
      // Clear validation on structural changes
      if (isStructuralChange(state, prevState)) {
        projectStore.clearValidation()
      }
      
      // Auto-save if enabled
      if (projectStore.project.autoSave) {
        // Debounce auto-save to avoid excessive saves
        setTimeout(() => {
          const currentProjectStore = useProjectStore.getState()
          if (currentProjectStore.project.autoSave && currentProjectStore.project.isModified) {
            currentProjectStore.saveToLocalStorage()
          }
        }, 500) // 500ms debounce
      }
    }
  })
  
  // Store subscription for cleanup
  subscriptions.set('nodeStore-to-projectStore', nodeStoreUnsubscribe)
  
  logger.info('store', 'Store synchronization setup complete')
}

/**
 * Clean up all store subscriptions
 * Call this during app cleanup or before re-initializing
 */
export function cleanupStoreSynchronization() {
  subscriptions.forEach((unsubscribe, key) => {
    logger.debug('store', `Cleaning up subscription: ${key}`)
    unsubscribe()
  })
  subscriptions.clear()
}

/**
 * Check if the change is structural (affects node count or connections)
 * These changes should trigger validation clearing
 */
function isStructuralChange(
  currentState: ReturnType<typeof useNodeStore.getState>,
  prevState: ReturnType<typeof useNodeStore.getState>
): boolean {
  // Node count changed
  if (currentState.nodes.length !== prevState.nodes.length) {
    return true
  }
  
  // Connection count changed
  if (currentState.connections.length !== prevState.connections.length) {
    return true
  }
  
  // Node types changed (this would be unusual but possible)
  const currentNodeTypes = currentState.nodes.map(n => `${n.id}:${n.type}`).sort()
  const prevNodeTypes = prevState.nodes.map(n => `${n.id}:${n.type}`).sort()
  if (JSON.stringify(currentNodeTypes) !== JSON.stringify(prevNodeTypes)) {
    return true
  }
  
  return false
}

/**
 * Get synchronization status for debugging
 */
export function getSynchronizationStatus() {
  return {
    activeSubscriptions: Array.from(subscriptions.keys()),
    nodeStoreHasPersistence: !!useNodeStore.persist,
    projectStoreHasPersistence: !!useProjectStore.persist,
  }
}

/**
 * Manual trigger for cross-store synchronization
 * Useful for testing or recovery scenarios
 */
export function triggerSync() {
  logger.debug('store', 'Manual sync triggered')
  
  const nodeStore = useNodeStore.getState()
  const projectStore = useProjectStore.getState()
  
  // Check if node data exists and project should be marked as modified
  if ((nodeStore.nodes.length > 0 || nodeStore.connections.length > 0) && !projectStore.project.isModified) {
    projectStore.markAsModified()
    logger.info('store', 'Project marked as modified due to existing node data')
  }
  
  return {
    nodeCount: nodeStore.nodes.length,
    connectionCount: nodeStore.connections.length,
    projectModified: projectStore.project.isModified,
  }
}
