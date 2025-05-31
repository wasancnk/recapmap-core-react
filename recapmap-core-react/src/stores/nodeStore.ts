import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import type { RecapMapNode, NodeType, NodeConnection } from '../types'

// Node Store - Manages all nodes and their state
interface NodeStore {
  // State
  nodes: RecapMapNode[]
  connections: NodeConnection[]
  selectedNodeIds: string[]
  
  // Actions - Node Management
  addNode: (type: NodeType, position: { x: number; y: number }) => string
  updateNode: (id: string, updates: Partial<RecapMapNode>) => void
  deleteNode: (id: string) => void
  duplicateNode: (id: string) => string
  
  // Actions - Selection Management
  selectNode: (id: string, addToSelection?: boolean) => void
  selectNodes: (ids: string[]) => void
  clearSelection: () => void
  selectAll: () => void
  
  // Actions - Connection Management
  addConnection: (sourceId: string, targetId: string, type?: 'data' | 'control' | 'dependency') => string
  updateConnection: (id: string, updates: Partial<NodeConnection>) => void
  deleteConnection: (id: string) => void
  deleteNodeConnections: (nodeId: string) => void
  
  // Queries
  getNode: (id: string) => RecapMapNode | undefined
  getNodesByType: (type: NodeType) => RecapMapNode[]
  getSelectedNodes: () => RecapMapNode[]
  getNodeConnections: (nodeId: string) => NodeConnection[]
  validateConnections: () => { valid: boolean; errors: string[] }
}

// Create the node store with proper typing
export const useNodeStore = create<NodeStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      nodes: [],
      connections: [],
      selectedNodeIds: [],

      // Node Management Actions
      addNode: (type: NodeType, position: { x: number; y: number }) => {
        const id = uuidv4()
        const now = new Date().toISOString()
        
        // Create base node structure
        const baseNode = {
          id,
          type,
          position,
          title: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
          description: '',
          metadata: {},
          connections: { inputs: [], outputs: [] },
          isSelected: false,
          isValid: true,
          createdAt: now,
          updatedAt: now,
        }

        // Add type-specific properties
        const newNode = createTypedNode(baseNode, type)
        
        set((state) => ({
          nodes: [...state.nodes, newNode],
          selectedNodeIds: [id], // Auto-select newly created node
        }), false, 'addNode')
        
        return id
      },

      updateNode: (id: string, updates: Partial<RecapMapNode>) => {
        set((state) => ({
          nodes: state.nodes.map((node) =>
            node.id === id
              ? { ...node, ...updates, updatedAt: new Date().toISOString() }
              : node
          ),
        }), false, 'updateNode')
      },

      deleteNode: (id: string) => {
        set((state) => {
          // Remove connections related to this node
          const filteredConnections = state.connections.filter(
            (conn) => conn.sourceNodeId !== id && conn.targetNodeId !== id
          )
          
          return {
            nodes: state.nodes.filter((node) => node.id !== id),
            connections: filteredConnections,
            selectedNodeIds: state.selectedNodeIds.filter((nodeId) => nodeId !== id),
          }
        }, false, 'deleteNode')
      },

      duplicateNode: (id: string) => {
        const originalNode = get().getNode(id)
        if (!originalNode) return ''

        const newId = uuidv4()
        const now = new Date().toISOString()
        
        const duplicatedNode = {
          ...originalNode,
          id: newId,
          title: `${originalNode.title} (Copy)`,
          position: {
            x: originalNode.position.x + 20,
            y: originalNode.position.y + 20,
          },
          connections: { inputs: [], outputs: [] }, // Reset connections
          isSelected: false,
          createdAt: now,
          updatedAt: now,
        }
        
        set((state) => ({
          nodes: [...state.nodes, duplicatedNode],
        }), false, 'duplicateNode')
        
        return newId
      },

      // Selection Management Actions
      selectNode: (id: string, addToSelection = false) => {
        set((state) => {
          const newSelection = addToSelection 
            ? state.selectedNodeIds.includes(id)
              ? state.selectedNodeIds.filter((nodeId) => nodeId !== id) // Deselect if already selected
              : [...state.selectedNodeIds, id] // Add to selection
            : [id] // Replace selection

          return {
            selectedNodeIds: newSelection,
            nodes: state.nodes.map((node) => ({
              ...node,
              isSelected: newSelection.includes(node.id),
            })),
          }
        }, false, 'selectNode')
      },

      selectNodes: (ids: string[]) => {
        set((state) => ({
          selectedNodeIds: ids,
          nodes: state.nodes.map((node) => ({
            ...node,
            isSelected: ids.includes(node.id),
          })),
        }), false, 'selectNodes')
      },

      clearSelection: () => {
        set((state) => ({
          selectedNodeIds: [],
          nodes: state.nodes.map((node) => ({
            ...node,
            isSelected: false,
          })),
        }), false, 'clearSelection')
      },

      selectAll: () => {
        set((state) => ({
          selectedNodeIds: state.nodes.map((node) => node.id),
          nodes: state.nodes.map((node) => ({
            ...node,
            isSelected: true,
          })),
        }), false, 'selectAll')
      },

      // Connection Management Actions
      addConnection: (sourceId: string, targetId: string, type = 'data') => {
        const id = uuidv4()
        const newConnection: NodeConnection = {
          id,
          sourceNodeId: sourceId,
          targetNodeId: targetId,
          sourceHandle: 'output',
          targetHandle: 'input',
          type,
          animated: type === 'control',
        }
        
        set((state) => ({
          connections: [...state.connections, newConnection],
          nodes: state.nodes.map((node) => {
            if (node.id === sourceId) {
              return {
                ...node,
                connections: {
                  ...node.connections,
                  outputs: [...node.connections.outputs, targetId],
                },
              }
            }
            if (node.id === targetId) {
              return {
                ...node,
                connections: {
                  ...node.connections,
                  inputs: [...node.connections.inputs, sourceId],
                },
              }
            }
            return node
          }),
        }), false, 'addConnection')
        
        return id
      },

      updateConnection: (id: string, updates: Partial<NodeConnection>) => {
        set((state) => ({
          connections: state.connections.map((conn) =>
            conn.id === id ? { ...conn, ...updates } : conn
          ),
        }), false, 'updateConnection')
      },

      deleteConnection: (id: string) => {
        set((state) => {
          const connection = state.connections.find((conn) => conn.id === id)
          if (!connection) return state

          return {
            connections: state.connections.filter((conn) => conn.id !== id),
            nodes: state.nodes.map((node) => {
              if (node.id === connection.sourceNodeId) {
                return {
                  ...node,
                  connections: {
                    ...node.connections,
                    outputs: node.connections.outputs.filter((nodeId) => nodeId !== connection.targetNodeId),
                  },
                }
              }
              if (node.id === connection.targetNodeId) {
                return {
                  ...node,
                  connections: {
                    ...node.connections,
                    inputs: node.connections.inputs.filter((nodeId) => nodeId !== connection.sourceNodeId),
                  },
                }
              }
              return node
            }),
          }
        }, false, 'deleteConnection')
      },

      deleteNodeConnections: (nodeId: string) => {
        set((state) => ({
          connections: state.connections.filter(
            (conn) => conn.sourceNodeId !== nodeId && conn.targetNodeId !== nodeId
          ),
        }), false, 'deleteNodeConnections')
      },

      // Query methods
      getNode: (id: string) => {
        return get().nodes.find((node) => node.id === id)
      },

      getNodesByType: (type: NodeType) => {
        return get().nodes.filter((node) => node.type === type)
      },

      getSelectedNodes: () => {
        const { nodes, selectedNodeIds } = get()
        return nodes.filter((node) => selectedNodeIds.includes(node.id))
      },

      getNodeConnections: (nodeId: string) => {
        return get().connections.filter(
          (conn) => conn.sourceNodeId === nodeId || conn.targetNodeId === nodeId
        )
      },

      validateConnections: () => {
        const { nodes, connections } = get()
        const errors: string[] = []
        
        // Check for orphaned connections
        connections.forEach((conn) => {
          const sourceExists = nodes.some((node) => node.id === conn.sourceNodeId)
          const targetExists = nodes.some((node) => node.id === conn.targetNodeId)
          
          if (!sourceExists) {
            errors.push(`Connection ${conn.id} has invalid source node ${conn.sourceNodeId}`)
          }
          if (!targetExists) {
            errors.push(`Connection ${conn.id} has invalid target node ${conn.targetNodeId}`)
          }
        })
        
        return {
          valid: errors.length === 0,
          errors,
        }
      },
    }),
    {
      name: 'recapmap-node-store',
    }
  )
)

// Helper function to create typed nodes
function createTypedNode(baseNode: any, type: NodeType): RecapMapNode {
  const now = new Date().toISOString()
  
  switch (type) {
    case 'usecase':
      return {
        ...baseNode,
        type: 'usecase',
        priority: 'medium',
        complexity: 'moderate',
        stakeholders: [],
        acceptanceCriteria: [],
      }
    
    case 'screen':
      return {
        ...baseNode,
        type: 'screen',
        screenType: 'page',
        framework: 'React',
        responsive: true,
        accessibility: true,
      }
    
    case 'user':
      return {
        ...baseNode,
        type: 'user',
        role: 'End User',
        permissions: [],
        workflow: [],
        goals: [],
        painPoints: [],
      }
    
    case 'process':
      return {
        ...baseNode,
        type: 'process',
        processType: 'manual',
        tools: [],
        inputs: [],
        outputs: [],
      }
    
    case 'storage':
      return {
        ...baseNode,
        type: 'storage',
        storageType: 'database',
        technology: 'PostgreSQL',
        accessPattern: 'readwrite',
      }
    
    case 'controller':
      return {
        ...baseNode,
        type: 'controller',
        controlType: 'condition',
        logic: '',
        conditions: [],
      }
    
    case 'error':
      return {
        ...baseNode,
        type: 'error',
        errorType: 'validation',
        severity: 'medium',
        handling: 'retry',
      }
    
    default:
      return baseNode as RecapMapNode
  }
}
