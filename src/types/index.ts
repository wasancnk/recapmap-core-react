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
  metadata: Record<string, string | number | boolean>
  connections: {
    inputs: string[]   // IDs of nodes connected as inputs
    outputs: string[]  // IDs of nodes connected as outputs
  }
  isSelected: boolean
  isValid: boolean
  createdAt: string
  updatedAt: string
}

// 10-Node System Types - Following Apple's Design Philosophy of Elegant Simplicity
export type NodeType = 
  | 'usecase'     // Business requirements, user stories
  | 'screen'      // UI screens, interfaces, views  
  | 'user'        // User roles, personas, actors
  | 'process'     // Business processes, tools, systems
  | 'storage'     // Databases, files, data stores
  | 'controller'  // Decision points, flow control
  | 'error'       // Error handling, rejection flows
  | 'presentation'// Presentation page for keynote-style presentations
  | 'concept'     // General concepts, abstract ideas, definitions
  | 'attachment'  // Files, images, links, resources, documents

// Specific Node Type Interfaces with Enhanced Properties

export interface UseCaseNode extends BaseNode {
  type: 'usecase'
  // Business Context
  priority: 'critical' | 'high' | 'medium' | 'low'
  complexity: 'simple' | 'moderate' | 'complex' | 'epic'
  businessValue: string
  stakeholders: string[]
  acceptanceCriteria: string[]
  // AI Generation Properties
  featureName: string
  businessRules: string[]
  dependencies: string[]
  successMetrics: string[]
  assumptions: string[]
}

export interface ScreenNode extends BaseNode {
  type: 'screen'
  // UI Context
  screenType: 'dashboard' | 'form' | 'list' | 'detail' | 'modal' | 'wizard' | 'landing'
  layoutType: 'grid' | 'flex' | 'fixed' | 'responsive'
  responsive: boolean
  accessibility: boolean
  // Component Structure
  components: Array<{
    type: string
    properties: Record<string, string | number | boolean>
    validation?: string[]
  }>
  navigationFlow: string[]
  dataBindings: string[]
  validationRules: string[]
  wireframeUrl?: string
}

export interface UserNode extends BaseNode {
  type: 'user'
  // Actor Definition
  role: string
  userType: 'admin' | 'power_user' | 'standard_user' | 'guest' | 'system'
  permissions: string[]
  accessLevel: 'admin' | 'manager' | 'user' | 'read_only'
  // Behavioral Context
  workflow: string[]
  goals: string[]
  painPoints: string[]
  expertise: 'beginner' | 'intermediate' | 'expert'
  // Security Context
  authenticationMethod: 'password' | 'mfa' | 'sso' | 'oauth' | 'certificate'
  dataAccess: string[]
}

export interface ProcessNode extends BaseNode {
  type: 'process'
  // Capability Definition
  capabilityName: string
  processType: 'computation' | 'integration' | 'notification' | 'validation' | 'transformation'
  automationLevel: 'manual' | 'semi_automated' | 'fully_automated'  // Input/Output Specification
  inputParameters: Array<{
    name: string
    type: string
    required: boolean
    validation?: string
    default?: string | number | boolean
  }>
  outputParameters: Array<{
    name: string
    type: string
    description?: string
  }>
  // Technical Context
  tools: string[]
  externalDependencies: string[]
  errorConditions: string[]
  // Performance Requirements
  sla?: string
  throughputRequirements?: string
  scalingConsiderations?: string
}

export interface StorageNode extends BaseNode {
  type: 'storage'
  // Storage Definition
  storageName: string
  storageType: 'database' | 'cache' | 'file_system' | 'memory' | 'external_api' | 'blob_storage'
  technology: string
  // Data Structure
  dataSchema: Array<{
    field: string
    type: string
    constraints?: string[]
    indexed?: boolean
    unique?: boolean
  }>
  indexingStrategy: string[]
  // Access Patterns
  accessPattern: 'read_heavy' | 'write_heavy' | 'balanced' | 'append_only'
  queryPatterns: string[]
  // Operational Requirements
  backupRequirements: string
  retentionPolicy: string
  scalingStrategy: string
  securityClassification: 'public' | 'internal' | 'confidential' | 'restricted'
}

export interface ControllerNode extends BaseNode {
  type: 'controller'
  // Decision Logic
  controllerName: string
  controlType: 'condition' | 'loop' | 'switch' | 'parallel' | 'gateway' | 'merge'
  businessRules: string[]
  // Logic Definition
  conditions: Array<{
    name: string
    condition: string
    outcome: string
    priority?: number
    target?: string
  }>
  // Routing Logic
  routingRules: Array<{
    source: string
    condition: string
    destination: string
  }>
  defaultPath?: string
  // Performance
  timeoutSettings?: string
  parallelProcessing: boolean
}

export interface ErrorNode extends BaseNode {
  type: 'error'
  // Error Classification
  errorType: 'validation' | 'system' | 'network' | 'business_rule' | 'security' | 'data_integrity'
  severity: 'low' | 'medium' | 'high' | 'critical'
  // Detection & Handling
  detectionConditions: string[]
  fallbackAction: string
  retryStrategy: 'none' | 'fixed_delay' | 'exponential_backoff' | 'circuit_breaker'
  maxRetries?: number
  // User Experience
  userNotification: string
  escalationRules: string[]
  // Logging & Monitoring
  loggingRequirements: string[]
  alertingThreshold?: string
  recoveryProcedure?: string
}

export interface PresentationNode extends BaseNode {
  type: 'presentation'
  // Presentation Structure
  presentationTitle: string
  slideOrder: number
  // Content Management
  linkedNodes: string[] // IDs of nodes to include in this presentation page
  slideContent: {
    title: string
    subtitle?: string
    content: string[]
    notes?: string // Speaker notes
  }
  // Presentation Settings
  transition: 'fade' | 'slide' | 'zoom' | 'flip' | 'none'
  duration?: number // Auto-advance time in seconds
  backgroundColor?: string
  backgroundImage?: string
  // Layout Configuration
  layout: 'title' | 'content' | 'two-column' | 'full-screen' | 'node-showcase'
  showPageNumber: boolean
  showTimestamp: boolean
  // Navigation
  navigationHints: string[]
}

export interface ConceptNode extends BaseNode {
  type: 'concept'
  // Concept Definition
  conceptName: string
  conceptType: 'definition' | 'principle' | 'framework' | 'methodology' | 'best-practice' | 'guideline'
  // Content Structure
  definition: string
  examples: string[]
  counterExamples?: string[]
  // Relationships
  relatedConcepts: string[]
  prerequisites: string[]
  // Context
  domain: string
  complexity: 'basic' | 'intermediate' | 'advanced' | 'expert'
  tags: string[]
  // Documentation
  references: string[]
  notes?: string
}

export interface AttachmentNode extends BaseNode {
  type: 'attachment'
  // Attachment Core Properties
  attachmentName: string
  attachmentType: 'file' | 'image' | 'link' | 'document' | 'video' | 'audio' | 'code' | 'data'
  // File/Resource Information
  fileName?: string
  fileSize?: number
  mimeType?: string
  url?: string
  filePath?: string
  // Content Management
  content?: string // For text-based attachments
  preview?: string // Preview text or base64 image
  // Metadata
  tags: string[]
  category: string
  version?: string
  // Access & Security
  isPublic: boolean
  accessLevel: 'public' | 'internal' | 'restricted' | 'confidential'
  permissions: string[]
  // Integration
  sourceSystem?: string
  lastSyncedAt?: string
  // Organization
  folderPath?: string
  relatedNodes: string[]
}

// Complete 10-Node System Union Type - Following Apple's Design Philosophy
export type RecapMapNode = 
  | UseCaseNode 
  | ScreenNode 
  | UserNode 
  | ProcessNode 
  | StorageNode 
  | ControllerNode 
  | ErrorNode
  | PresentationNode
  | ConceptNode
  | AttachmentNode

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
  style?: Record<string, string | number>
  // Enhanced Connection Metadata
  metadata?: {
    directionType?: 'oneway' | 'twoway' | 'undirected'
    lineStyle?: 'solid' | 'dashed' | 'dotted'
    color?: string
    thickness?: number
    // Business context properties
    businessRule?: string
    priority?: 'low' | 'medium' | 'high' | 'critical'
    conditions?: string[]
    dataFlow?: string
    weight?: number // For importance/strength of relationship
  }
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
  data?: Record<string, string | number | boolean>
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
  | 'presentation'

// UI State types
export interface UIState {
  selectedTool: Tool
  isGridVisible: boolean
  isMiniMapVisible: boolean
  snapToGrid: boolean
  gridSize: number
  theme: 'dark' | 'light' | 'bright'
  sidebarCollapsed: boolean
  notifications: Notification[]
  // Presentation Mode
  isPresentationMode: boolean
  presentationSettings: {
    currentSlide: number
    totalSlides: number
    showPageNumbers: boolean
    showTimestamp: boolean
    autoAdvance: boolean
    autoAdvanceInterval: number // seconds
    hideToolbar: boolean
    hidePanels: boolean
    presentationTheme: 'bright' | 'dark' | 'custom'
    backgroundColor?: string
    backgroundImage?: string
  }
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
  | 'presentation'
  | 'concept'
  | 'attachment'
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

// Enhanced Property Validation System
export interface PropertyDefinition {
  name: string
  type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'enum'
  required: boolean
  label: string
  description?: string
  placeholder?: string
  validation?: PropertyValidation
  defaultValue?: string | number | boolean
  enumOptions?: Array<{ value: string; label: string }>
  dependsOn?: string[]
}

export interface PropertyValidation {
  minLength?: number
  maxLength?: number
  pattern?: string
  min?: number
  max?: number
  custom?: (value: string | number | boolean) => { valid: boolean; message?: string }
}

export interface NodePropertySchema {
  [nodeType: string]: PropertyDefinition[]
}

export interface PropertyValidationResult {
  isValid: boolean
  errors: Array<{
    property: string
    message: string
    value?: unknown
  }>
  warnings: Array<{
    property: string
    message: string
    value?: unknown
  }>
}

// YAML Export System Types
export interface YAMLExportOptions extends ExportOptions {
  format: 'yaml'
  includeComments: boolean
  aiOptimized: boolean
  targetPlatform: 'java' | 'python' | 'nodejs' | 'generic'
}

export interface YAMLNodeSpec {
  id: string
  type: string
  metadata: {
    title: string
    description: string
    created_at: string
    updated_at: string
  }
  properties: Record<string, string | number | boolean | string[]>
  connections: {
    inputs: string[]
    outputs: string[]
  }
  validation_status: 'valid' | 'invalid' | 'warning'
}

export interface YAMLProjectSpec {
  project: {
    name: string
    description: string
    version: string
    created_at: string
    updated_at: string
    author: string
  }
  architecture: {
    nodes: YAMLNodeSpec[]
    connections: Array<{
      id: string
      source: string
      target: string
      type: string
      description?: string
    }>
  }
  validation: {
    status: 'valid' | 'invalid' | 'warnings'
    errors: ValidationError[]
    warnings: ValidationError[]
    last_validated: string
  }
  ai_generation_hints: {
    target_platform: string
    complexity_level: 'simple' | 'moderate' | 'complex'
    primary_use_cases: string[]
    technical_constraints: string[]
  }
}
