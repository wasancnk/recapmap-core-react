import { vi } from 'vitest'
import type { RecapMapNode, NodeConnection } from '../types'

/**
 * Mock data factory for testing
 */

// Mock node creation
export const createMockNode = (overrides: Partial<RecapMapNode> = {}): RecapMapNode => {
  const baseNode = {
    id: 'test-node-1',
    type: 'usecase' as const,
    position: { x: 100, y: 100 },
    title: 'Test Use Case',
    description: 'Test description',
    metadata: {},
    connections: { inputs: [], outputs: [] },
    isSelected: false,
    isValid: true,
    createdAt: '2025-06-01T10:00:00.000Z',
    updatedAt: '2025-06-01T10:00:00.000Z',
    // Use case specific properties
    priority: 'medium' as const,
    complexity: 'moderate' as const,
    businessValue: 'Test business value',
    stakeholders: ['Test Stakeholder'],
    acceptanceCriteria: ['Test criteria'],
    featureName: 'test_feature',
    businessRules: [],
    dependencies: [],
    successMetrics: [],
    assumptions: [],
  }
  
  return { ...baseNode, ...overrides } as RecapMapNode
}

// Mock connection creation
export const createMockConnection = (overrides: Partial<NodeConnection> = {}): NodeConnection => ({
  id: 'test-connection-1',
  sourceNodeId: 'source-node',
  targetNodeId: 'target-node',
  sourceHandle: 'right-source',
  targetHandle: 'left-target',
  type: 'data',
  animated: false,
  metadata: {
    directionType: 'oneway' as const,
    lineStyle: 'solid' as const,
    color: '#3B82F6',
    thickness: 2,
    priority: 'medium' as const,
  },
  ...overrides,
})

// Mock multiple nodes for testing
export const createMockNodes = (count = 3): RecapMapNode[] => {
  return Array.from({ length: count }, (_, index) =>
    createMockNode({
      id: `test-node-${index + 1}`,
      title: `Test Node ${index + 1}`,
      position: { x: 100 + index * 200, y: 100 },
      type: index % 2 === 0 ? 'usecase' : 'screen',
    })
  )
}

// Mock multiple connections for testing
export const createMockConnections = (nodes: RecapMapNode[]): NodeConnection[] => {
  if (nodes.length < 2) return []
  
  return nodes.slice(0, -1).map((node, index) =>
    createMockConnection({
      id: `test-connection-${index + 1}`,
      sourceNodeId: node.id,
      targetNodeId: nodes[index + 1].id,
    })
  )
}

// Mock store states
export const createMockNodeStoreState = () => ({
  nodes: createMockNodes(3),
  connections: [],
  selectedNodeIds: [],
})

export const createMockUIStoreState = () => ({
  canvas: {
    zoom: 1,
    position: { x: 0, y: 0 },
    showGrid: true,
    showMiniMap: true,
  },
  panels: [],
  ui: {
    selectedTool: 'select' as const,
    theme: 'dark' as const,
    sidebarCollapsed: false,
  },
  notifications: [],
})

export const createMockProjectStoreState = () => ({
  project: {
    id: 'test-project',
    name: 'Test Project',
    description: 'Test project description',
    version: '1.0.0',
    createdAt: '2025-06-01T10:00:00.000Z',
    updatedAt: '2025-06-01T10:00:00.000Z',
    isModified: false,
    autoSave: false,
  },
  isValidating: false,
  lastValidation: null,
})

// Mock logger for tests
export const createMockLogger = () => ({
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  connectionStart: vi.fn(),
  connectionSuccess: vi.fn(),
  connectionError: vi.fn(),
  connectionDebug: vi.fn(),
  enableScope: vi.fn(),
  disableScope: vi.fn(),
  getEnabledScopes: vi.fn(() => ['connection', 'node']),
  getLogHistory: vi.fn(() => []),
  clearHistory: vi.fn(),
  setLogLevel: vi.fn(),
})

// Mock React Flow node/edge conversion
export const createReactFlowNode = (node: RecapMapNode) => ({
  id: node.id,
  type: 'custom',
  position: node.position,
  data: {
    ...node,
    label: node.title,
  },
})

export const createReactFlowEdge = (connection: NodeConnection) => ({
  id: connection.id,
  source: connection.sourceNodeId,
  target: connection.targetNodeId,
  sourceHandle: connection.sourceHandle,
  targetHandle: connection.targetHandle,
  type: 'custom',
  animated: connection.animated,
  data: connection.metadata,
})
