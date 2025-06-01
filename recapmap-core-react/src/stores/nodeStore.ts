import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import type { RecapMapNode, NodeType, NodeConnection, BaseNode } from '../types'
import { logger } from '../utils/logger'

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
  swapConnection: (id: string) => boolean
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
          // Don't auto-select newly created nodes to avoid white border
        }), false, 'addNode')
        
        return id
      },      updateNode: (id: string, updates: Partial<RecapMapNode>) => {
        set((state) => ({
          ...state,
          nodes: state.nodes.map((node) => {
            if (node.id === id) {
              // Create updated node with proper typing, excluding type changes for safety
              const updatedNode = { 
                ...node, 
                ...updates, 
                type: node.type, // Preserve original type
                updatedAt: new Date().toISOString() 
              }
              return updatedNode as RecapMapNode
            }
            return node
          }),
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
      },      // Connection Management Actions
      addConnection: (sourceId: string, targetId: string, type = 'data') => {
        const id = uuidv4()
        
        // Set default metadata based on connection type
        const defaultMetadata = {
          directionType: 'oneway' as const,
          lineStyle: type === 'control' ? 'dashed' as const : 'solid' as const,
          color: type === 'data' ? '#3B82F6' : type === 'control' ? '#F59E0B' : '#6B7280',
          thickness: 2,
          priority: 'medium' as const
        };        const newConnection: NodeConnection = {
          id,
          sourceNodeId: sourceId,
          targetNodeId: targetId,
          sourceHandle: 'right-source',
          targetHandle: 'left-target',
          type,
          animated: type === 'control',
          metadata: defaultMetadata
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
      },      updateConnection: (id: string, updates: Partial<NodeConnection>) => {
        set((state) => ({
          connections: state.connections.map((conn) =>
            conn.id === id ? { ...conn, ...updates } : conn
          ),
        }), false, 'updateConnection')
      },      swapConnection: (id: string) => {
        logger.connectionStart('swapConnection', id)
        
        const state = get()
        logger.connectionDebug('swapConnection', 'Current state analysis', {
          totalConnections: state.connections.length,
          totalNodes: state.nodes.length
        })
        
        const connection = state.connections.find((conn) => conn.id === id)
        if (!connection) {
          logger.connectionError('swapConnection', id, 'Connection not found in store')
          logger.connectionDebug('swapConnection', 'Available connections', 
            state.connections.map(c => ({ id: c.id, source: c.sourceNodeId, target: c.targetNodeId }))
          )
          return false
        }

        logger.connectionDebug('swapConnection', 'Connection found', {
          id: connection.id,
          sourceNodeId: connection.sourceNodeId,
          targetNodeId: connection.targetNodeId,
          sourceHandle: connection.sourceHandle,
          targetHandle: connection.targetHandle,
          type: connection.type
        })

        // Fixed handle transformation - ONLY use visible -source handles
        const getSwappedHandle = (handle: string) => {
          if (!handle) return 'right-source' // fallback
          
          // Extract position and always use -source (visible handles)
          if (handle.includes('top-')) return 'top-source'
          if (handle.includes('right-')) return 'right-source'
          if (handle.includes('bottom-')) return 'bottom-source'
          if (handle.includes('left-')) return 'left-source'
          
          return 'right-source' // fallback
        }

        const newSourceHandle = getSwappedHandle(connection.targetHandle)
        const newTargetHandle = getSwappedHandle(connection.sourceHandle)

        logger.connectionDebug('swapConnection', 'Fixed handle transformation', {
          oldSourceHandle: connection.sourceHandle,
          oldTargetHandle: connection.targetHandle,
          newSourceHandle,
          newTargetHandle,
          note: 'Only using visible -source handles'
        })

        logger.connectionDebug('swapConnection', 'About to perform atomic swap')

        // Perform atomic swap of connection
        set((state) => {
          logger.connectionDebug('swapConnection', 'Inside set function', { 
            currentConnections: state.connections.length 
          })
          
          const newConnections = state.connections.map((conn) =>
            conn.id === id ? {
              ...conn,
              sourceNodeId: connection.targetNodeId,  // Layer 1: Swap nodes
              targetNodeId: connection.sourceNodeId,  // Layer 1: Swap nodes
              sourceHandle: newSourceHandle,          // Layer 2: Use visible handles only
              targetHandle: newTargetHandle,          // Layer 2: Use visible handles only
            } : conn
          )

          logger.connectionDebug('swapConnection', 'New connections array created', { 
            length: newConnections.length 
          })
          const swappedConnection = newConnections.find(c => c.id === id)
          logger.connectionDebug('swapConnection', 'Swapped connection details', swappedConnection)

          // Update node connection arrays to maintain consistency
          const newNodes = state.nodes.map((node) => {
            if (node.id === connection.sourceNodeId) {
              logger.connectionDebug('swapConnection', `Updating old source node ${node.id}: removing from outputs, adding to inputs`)
              // Old source becomes new target - remove from outputs, add to inputs
              return {
                ...node,
                connections: {
                  ...node.connections,
                  outputs: node.connections.outputs.filter((nodeId) => nodeId !== connection.targetNodeId),
                  inputs: [...node.connections.inputs, connection.targetNodeId],
                },
              }
            }
            if (node.id === connection.targetNodeId) {
              logger.connectionDebug('swapConnection', `Updating old target node ${node.id}: removing from inputs, adding to outputs`)
              // Old target becomes new source - remove from inputs, add to outputs
              return {
                ...node,
                connections: {
                  ...node.connections,
                  inputs: node.connections.inputs.filter((nodeId) => nodeId !== connection.sourceNodeId),
                  outputs: [...node.connections.outputs, connection.sourceNodeId],
                },
              }
            }
            return node
          })

          logger.connectionDebug('swapConnection', 'Node connection arrays updated')

          return {
            connections: newConnections,
            nodes: newNodes,
          }
        }, false, 'swapConnection')

        // Verify the swap was successful
        const updatedState = get()
        const updatedConnection = updatedState.connections.find((conn) => conn.id === id)
        
        logger.connectionDebug('swapConnection', 'Post-swap verification', {
          connectionExists: !!updatedConnection,
          totalConnections: updatedState.connections.length,
          updatedConnection: updatedConnection ? {
            id: updatedConnection.id,
            sourceNodeId: updatedConnection.sourceNodeId,
            targetNodeId: updatedConnection.targetNodeId,
            sourceHandle: updatedConnection.sourceHandle,
            targetHandle: updatedConnection.targetHandle
          } : null
        })

        if (!updatedConnection) {
          logger.connectionError('swapConnection', id, 'Connection disappeared during swap operation!')
          return false
        }

        logger.connectionSuccess('swapConnection', id)
        return true
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

// Helper function to create typed nodes with enhanced properties
function createTypedNode(baseNode: BaseNode, type: NodeType): RecapMapNode {
  
  switch (type) {
    case 'usecase':
      return {
        ...baseNode,
        type: 'usecase',
        // Business Context
        priority: 'medium',
        complexity: 'moderate',
        businessValue: '',
        stakeholders: [],
        acceptanceCriteria: [],
        // AI Generation Properties
        featureName: baseNode.title.toLowerCase().replace(/\s+/g, '_'),
        businessRules: [],
        dependencies: [],
        successMetrics: [],
        assumptions: [],
      }
      case 'screen':
      return {
        ...baseNode,
        type: 'screen',
        // UI Context
        screenType: 'dashboard',
        layoutType: 'responsive',
        responsive: true,
        accessibility: true,
        // Component Structure
        components: [],
        navigationFlow: [],
        dataBindings: [],
        validationRules: [],
        wireframeUrl: undefined,
      }
    
    case 'user':
      return {
        ...baseNode,
        type: 'user',
        // Actor Definition
        role: 'Standard User',
        userType: 'standard_user',
        permissions: [],
        accessLevel: 'user',
        // Behavioral Context
        workflow: [],
        goals: [],
        painPoints: [],
        expertise: 'intermediate',
        // Security Context
        authenticationMethod: 'password',
        dataAccess: [],
      }
    
    case 'process':
      return {
        ...baseNode,
        type: 'process',
        // Capability Definition
        capabilityName: baseNode.title.toLowerCase().replace(/\s+/g, '_'),
        processType: 'computation',
        automationLevel: 'semi_automated',
        // Input/Output Specification
        inputParameters: [],
        outputParameters: [],
        // Technical Context
        tools: [],
        externalDependencies: [],
        errorConditions: [],
        // Performance Requirements
        sla: undefined,
        throughputRequirements: undefined,
        scalingConsiderations: undefined,
      }
    
    case 'storage':
      return {
        ...baseNode,
        type: 'storage',
        // Storage Definition
        storageName: baseNode.title.toLowerCase().replace(/\s+/g, '_'),
        storageType: 'database',
        technology: 'PostgreSQL',
        // Data Structure
        dataSchema: [],
        indexingStrategy: [],
        // Access Patterns
        accessPattern: 'balanced',
        queryPatterns: [],
        // Operational Requirements
        backupRequirements: 'daily',
        retentionPolicy: '7 years',
        scalingStrategy: 'vertical',
        securityClassification: 'internal',
      }
    
    case 'controller':
      return {
        ...baseNode,
        type: 'controller',
        // Decision Logic
        controllerName: baseNode.title.toLowerCase().replace(/\s+/g, '_'),
        controlType: 'condition',
        businessRules: [],
        // Logic Definition
        conditions: [],
        // Routing Logic
        routingRules: [],
        defaultPath: undefined,
        // Performance
        timeoutSettings: undefined,
        parallelProcessing: false,
      }
    
    case 'error':
      return {
        ...baseNode,
        type: 'error',
        // Error Classification
        errorType: 'validation',
        severity: 'medium',
        // Detection & Handling
        detectionConditions: [],
        fallbackAction: 'show_error_message',
        retryStrategy: 'none',
        maxRetries: undefined,
        // User Experience
        userNotification: 'An error occurred. Please try again.',
        escalationRules: [],
        // Logging & Monitoring
        loggingRequirements: [],
        alertingThreshold: undefined,
        recoveryProcedure: undefined,
      }
    
    default:
      return baseNode as RecapMapNode
  }
}
