/**
 * RecapMap Core Types - TypeScript interfaces for the 8-node system
 * These types define the structure of our business modeling components
 */

// Base Node Interface - Foundation for all 8 node types
export interface BaseNode {
  id: string
  type: NodeType
  position: { x: number; y: number }
  title: string
  description?: string
  metadata: Record<string, any>
  connections: {
    inputs: string[]   // IDs of nodes connected as inputs
    outputs: string[]  // IDs of nodes connected as outputs
  }
  isSelected: boolean
  isValid: boolean
  createdAt: string
  updatedAt: string
}

// 8-Node System Types
export type NodeType = 
  | 'usecase'     // Business requirements, user stories
  | 'screen'      // UI screens, interfaces, views  
  | 'user'        // User roles, personas, actors
  | 'process'     // Business processes, tools, systems
  | 'storage'     // Databases, files, data stores
  | 'controller'  // Decision points, flow control
  | 'error'       // Error handling, rejection flows
  | 'base'        // Abstract base (for templates)

// Specific Node Type Interfaces
export interface UseCaseNode extends BaseNode {
  type: 'usecase'
  priority: 'high' | 'medium' | 'low'
  complexity: 'simple' | 'moderate' | 'complex'
  stakeholders: string[]
  acceptanceCriteria: string[]
}

export interface ScreenNode extends BaseNode {
  type: 'screen'
  screenType: 'page' | 'modal' | 'component' | 'layout'
  framework: string
  responsive: boolean
  accessibility: boolean
  wireframeUrl?: string
}

export interface UserNode extends BaseNode {
  type: 'user'
  role: string
  permissions: string[]
  workflow: string[]
  goals: string[]
  painPoints: string[]
}

export interface ProcessNode extends BaseNode {
  type: 'process'
  processType: 'manual' | 'automated' | 'hybrid'
  tools: string[]
  inputs: string[]
  outputs: string[]
  sla?: string
}

export interface StorageNode extends BaseNode {
  type: 'storage'
  storageType: 'database' | 'file' | 'cache' | 'api'
  technology: string
  schema?: string
  accessPattern: 'read' | 'write' | 'readwrite'
  retention?: string
}

export interface ControllerNode extends BaseNode {
  type: 'controller'
  controlType: 'condition' | 'loop' | 'switch' | 'gateway'
  logic: string
  conditions: Array<{
    condition: string
    outcome: string
    target?: string
  }>
}

export interface ErrorNode extends BaseNode {
  type: 'error'
  errorType: 'validation' | 'system' | 'business' | 'security'
  severity: 'low' | 'medium' | 'high' | 'critical'
  handling: 'retry' | 'fallback' | 'escalate' | 'ignore'
  recovery?: string
}

// Union type for all node types
export type RecapMapNode = 
  | UseCaseNode 
  | ScreenNode 
  | UserNode 
  | ProcessNode 
  | StorageNode 
  | ControllerNode 
  | ErrorNode

// Connection between nodes
export interface NodeConnection {
  id: string
  sourceNodeId: string
  targetNodeId: string
  sourceHandle: string
  targetHandle: string
  type: 'data' | 'control' | 'dependency'
  label?: string
  animated?: boolean
  style?: Record<string, any>
}

// Canvas/Viewport state
export interface CanvasState {
  zoom: number
  center: { x: number; y: number }
  bounds: {
    left: number
    top: number
    right: number
    bottom: number
  }
}

// Panel management types
export interface Panel {
  id: string
  type: PanelType
  title: string
  position: { x: number; y: number }
  size: { width: number; height: number }
  isOpen: boolean
  isMinimized: boolean
  zIndex: number
  data?: any
}

export type PanelType =
  | 'node-properties'
  | 'connection-manager'
  | 'toolbox'
  | 'minimap'
  | 'export'
  | 'ai-assistant'
  | 'validation'
  | 'settings'

// UI State types
export interface UIState {
  selectedTool: Tool
  isGridVisible: boolean
  snapToGrid: boolean
  gridSize: number
  theme: 'dark' | 'light'
  sidebarCollapsed: boolean
  notifications: Notification[]
}

export type Tool =
  | 'select'
  | 'pan'
  | 'usecase'
  | 'screen'
  | 'user'
  | 'process'
  | 'storage'
  | 'controller'
  | 'error'
  | 'connect'

export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  timestamp: string
  duration?: number
  actions?: Array<{
    label: string
    action: () => void
  }>
}

// Project/Document state
export interface ProjectState {
  id: string
  name: string
  description?: string
  version: string
  createdAt: string
  updatedAt: string
  author: string
  tags: string[]
  isModified: boolean
  autoSave: boolean
}

// Validation types
export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
}

export interface ValidationError {
  id: string
  nodeId?: string
  type: 'connection' | 'node' | 'project'
  severity: 'error' | 'warning'
  message: string
  suggestion?: string
}

export interface ValidationWarning extends ValidationError {
  severity: 'warning'
}

// Export/Import types
export interface ExportOptions {
  format: 'yaml' | 'json' | 'png' | 'svg' | 'pdf'
  includeMetadata: boolean
  includePositions: boolean
  compression?: boolean
}

export interface ImportResult {
  success: boolean
  errors: string[]
  warnings: string[]
  nodesImported: number
  connectionsImported: number
}
