import { vi } from 'vitest'
import type { RecapMapNode, NodeType } from '../types'
import { createMockNode, createMockConnection } from './mockData'

/**
 * Advanced mock factories for complex testing scenarios
 */

// Create multiple connected nodes for testing workflows
export const createMockNodeGraph = () => {
  const caseNode = createMockNode({
    id: 'case-1',
    type: 'case',
    position: { x: 100, y: 100 },
    title: 'User Login Case',
  })

  const interfaceNode = createMockNode({
    id: 'interface-1',
    type: 'interface',
    position: { x: 300, y: 100 },
    title: 'Login Screen',
  })

  const dataNode = createMockNode({
    id: 'storage-1',
    type: 'storage',
    position: { x: 500, y: 100 },
    title: 'User Database',
  })

  const connection1 = createMockConnection({
    id: 'conn-1',
    sourceNodeId: 'case-1',
    targetNodeId: 'interface-1',
  })

  const connection2 = createMockConnection({
    id: 'conn-2',
    sourceNodeId: 'interface-1',
    targetNodeId: 'storage-1',
  })

  return {
    nodes: [caseNode, interfaceNode, dataNode],
    connections: [connection1, connection2],
  }
}

// Create nodes of all types for comprehensive testing
export const createAllNodeTypes = (): RecapMapNode[] => {
  const nodeTypes: NodeType[] = [
    'case', 'view', 'persona', 'interface', 'process', 'capability',
    'outcome', 'resource', 'knowledge', 'storage', 'task', 'note'
  ]

  return nodeTypes.map((type, index) => 
    createMockNode({
      id: `${type}-${index + 1}`,
      type,
      position: { x: index * 150, y: 100 },
      title: `Test ${type.charAt(0).toUpperCase() + type.slice(1)}`,
    })
  )
}

// Mock store states for testing
export const createMockStoreState = () => ({
  nodeStore: {
    nodes: createAllNodeTypes(),
    connections: [],
    selectedNodeIds: [],
    clipboard: [],
    history: { past: [], present: [], future: [] },
  },
  uiStore: {
    canvas: {
      zoom: 1,
      position: { x: 0, y: 0 },
      bounds: { x: 0, y: 0, width: 1000, height: 600 },
    },
    panels: {
      editor: { isOpen: false, activeNodeId: null },
      presentation: { isOpen: false, currentSlide: 0 },
      export: { isOpen: false, format: 'json' },
    },
    notifications: [],
    mode: 'design' as const,
  },
  projectStore: {
    metadata: {
      name: 'Test Project',
      description: 'Test project description',
      version: '1.0.0',
      tags: ['test'],
    },
    isModified: false,
    lastSaved: new Date().toISOString(),
  },
})

// Mock React Flow instances for testing
export const createMockReactFlowInstance = () => ({
  getNodes: vi.fn(() => []),
  setNodes: vi.fn(),
  getEdges: vi.fn(() => []),
  setEdges: vi.fn(),
  addNodes: vi.fn(),
  addEdges: vi.fn(),
  deleteElements: vi.fn(),
  fitView: vi.fn(),
  zoomIn: vi.fn(),
  zoomOut: vi.fn(),
  zoomTo: vi.fn(),
  getZoom: vi.fn(() => 1),
  setCenter: vi.fn(),
  fitBounds: vi.fn(),
  project: vi.fn((position) => position),
  screenToFlowPosition: vi.fn((position) => position),
  flowToScreenPosition: vi.fn((position) => position),
})

// Mock validation results
export const createMockValidationResult = (isValid = true) => ({
  isValid,
  errors: isValid ? [] : ['Test validation error'],
  warnings: ['Test warning'],
  nodeValidations: new Map(),
})

// Import the base factories from mockData
// export { createMockNode, createMockConnection } from './mockData'
