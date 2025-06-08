/**
 * RecapMap Store Index - Central export for all Zustand stores
 * This provides a clean API for accessing state management throughout the app
 */

// Export all stores
export { useNodeStore } from './nodeStore'
export { useUIStore } from './uiStore'
export { useProjectStore } from './projectStore'

// Import stores for internal use
import { useNodeStore } from './nodeStore'
import { useUIStore } from './uiStore'
import { useProjectStore } from './projectStore'

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
