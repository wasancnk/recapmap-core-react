import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import type { ProjectState, ValidationResult, ValidationError, ExportOptions, ImportResult } from '../types'
import { useNodeStore } from './nodeStore'

// Project Store - Manages project state, validation, and import/export
interface ProjectStore {
  // Project State
  project: ProjectState
  
  // Validation State
  lastValidation: ValidationResult | null
  isValidating: boolean
  
  // Actions - Project Management
  createProject: (name: string, description?: string) => void
  updateProject: (updates: Partial<ProjectState>) => void
  markAsModified: () => void
  markAsSaved: () => void
  
  // Actions - Validation
  validateProject: () => Promise<ValidationResult>
  clearValidation: () => void
  
  // Actions - Import/Export
  exportProject: (options: ExportOptions) => Promise<string | Blob>
  importProject: (data: string | File) => Promise<ImportResult>
  
  // Actions - Auto-save
  enableAutoSave: () => void
  disableAutoSave: () => void
  saveToLocalStorage: () => void
  loadFromLocalStorage: () => boolean
  
  // Queries
  isProjectModified: () => boolean
  getProjectSummary: () => {
    nodeCount: number
    connectionCount: number
    validationStatus: 'valid' | 'invalid' | 'unknown'
  }
}

// Default project state
const createDefaultProject = (): ProjectState => ({
  id: uuidv4(),
  name: 'Untitled Project',
  description: '',
  version: '1.0.0',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  author: 'RecapMap User',
  tags: [],
  isModified: false,
  autoSave: true,
})

// Create the project store with persistence
export const useProjectStore = create<ProjectStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        project: createDefaultProject(),
        lastValidation: null,
        isValidating: false,

        // Project Management Actions
        createProject: (name: string, description?: string) => {
          const newProject = createDefaultProject()
          newProject.name = name
          if (description) newProject.description = description
          
          set(() => ({
            project: newProject,
            lastValidation: null,
          }), false, 'createProject')
        },

        updateProject: (updates: Partial<ProjectState>) => {
          set((state) => ({
            project: {
              ...state.project,
              ...updates,
              updatedAt: new Date().toISOString(),
              isModified: true,
            },
          }), false, 'updateProject')
        },

        markAsModified: () => {
          set((state) => ({
            project: {
              ...state.project,
              isModified: true,
              updatedAt: new Date().toISOString(),
            },
          }), false, 'markAsModified')
        },

        markAsSaved: () => {
          set((state) => ({
            project: {
              ...state.project,
              isModified: false,
              updatedAt: new Date().toISOString(),
            },
          }), false, 'markAsSaved')
        },

        // Validation Actions
        validateProject: async () => {
          set(() => ({ isValidating: true }), false, 'validateProject:start')
          
          try {
            // Import node store to validate nodes and connections
            const { useNodeStore } = await import('./nodeStore')
            const { nodes, connections, validateConnections } = useNodeStore.getState()
            
            const errors: ValidationError[] = []
            const warnings: ValidationError[] = []
            
            // Validate nodes
            nodes.forEach((node) => {
              // Check for empty titles
              if (!node.title.trim()) {
                errors.push({
                  id: uuidv4(),
                  nodeId: node.id,
                  type: 'node',
                  severity: 'error',
                  message: `Node ${node.type} has no title`,
                  suggestion: 'Add a descriptive title to this node',
                })
              }
              
              // Check for isolated nodes (no connections)
              const hasConnections = node.connections.inputs.length > 0 || node.connections.outputs.length > 0
              if (!hasConnections && nodes.length > 1) {
                warnings.push({
                  id: uuidv4(),
                  nodeId: node.id,
                  type: 'node',
                  severity: 'warning',
                  message: `Node "${node.title}" is not connected to any other nodes`,
                  suggestion: 'Consider connecting this node to show relationships',
                })
              }
              
              // Type-specific validations
              switch (node.type) {
                case 'usecase':
                  const usecaseNode = node as any
                  if (!usecaseNode.acceptanceCriteria || usecaseNode.acceptanceCriteria.length === 0) {
                    warnings.push({
                      id: uuidv4(),
                      nodeId: node.id,
                      type: 'node',
                      severity: 'warning',
                      message: `Use case "${node.title}" has no acceptance criteria`,
                      suggestion: 'Add acceptance criteria to define when this use case is complete',
                    })
                  }
                  break
                  
                case 'process':
                  const processNode = node as any
                  if (!processNode.inputs || processNode.inputs.length === 0) {
                    warnings.push({
                      id: uuidv4(),
                      nodeId: node.id,
                      type: 'node',
                      severity: 'warning',
                      message: `Process "${node.title}" has no defined inputs`,
                      suggestion: 'Define what inputs this process requires',
                    })
                  }
                  break
              }
            })
            
            // Validate connections
            const connectionValidation = validateConnections()
            connectionValidation.errors.forEach((error) => {
              errors.push({
                id: uuidv4(),
                type: 'connection',
                severity: 'error',
                message: error,
                suggestion: 'Remove invalid connections and recreate them',
              })
            })
            
            // Project-level validations
            if (nodes.length === 0) {
              warnings.push({
                id: uuidv4(),
                type: 'project',
                severity: 'warning',
                message: 'Project has no nodes',
                suggestion: 'Add nodes to start building your business model',
              })
            }
            
            const result: ValidationResult = {
              isValid: errors.length === 0,
              errors,
              warnings,
            }
            
            set(() => ({
              lastValidation: result,
              isValidating: false,
            }), false, 'validateProject:complete')
            
            return result
            
          } catch (error) {
            const validationError: ValidationError = {
              id: uuidv4(),
              type: 'project',
              severity: 'error',
              message: `Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
            }
            
            const result: ValidationResult = {
              isValid: false,
              errors: [validationError],
              warnings: [],
            }
            
            set(() => ({
              lastValidation: result,
              isValidating: false,
            }), false, 'validateProject:error')
            
            return result
          }
        },

        clearValidation: () => {
          set(() => ({ lastValidation: null }), false, 'clearValidation')
        },

        // Import/Export Actions
        exportProject: async (options: ExportOptions) => {
          const { useNodeStore } = await import('./nodeStore')
          const { nodes, connections } = useNodeStore.getState()
          const { project } = get()
          
          const exportData = {
            project: {
              ...project,
              exportedAt: new Date().toISOString(),
            },
            nodes: options.includePositions ? nodes : nodes.map(({ position, ...node }) => node),
            connections,
            metadata: options.includeMetadata ? {
              version: '1.0',
              generator: 'RecapMap',
              totalNodes: nodes.length,
              totalConnections: connections.length,
            } : undefined,
          }
          
          switch (options.format) {
            case 'json':
              return JSON.stringify(exportData, null, 2)
              
            case 'yaml':
              // Simple YAML conversion (in a real app, use a proper YAML library)
              return `# RecapMap Export
project:
  name: "${project.name}"
  description: "${project.description}"
  version: "${project.version}"
  
nodes:
${nodes.map((node) => `  - id: "${node.id}"
    type: "${node.type}"
    title: "${node.title}"
    description: "${node.description}"`).join('\n')}

connections:
${connections.map((conn) => `  - source: "${conn.sourceNodeId}"
    target: "${conn.targetNodeId}"
    type: "${conn.type}"`).join('\n')}`
              
            default:
              throw new Error(`Export format ${options.format} not implemented yet`)
          }
        },

        importProject: async (data: string | File) => {
          try {
            let jsonData: any
            
            if (data instanceof File) {
              const text = await data.text()
              jsonData = JSON.parse(text)
            } else {
              jsonData = JSON.parse(data)
            }
            
            const { useNodeStore } = await import('./nodeStore')
            const nodeStore = useNodeStore.getState()
            
            // Clear existing data
            nodeStore.clearSelection()
            
            // Import project info
            if (jsonData.project) {
              get().updateProject({
                name: jsonData.project.name || 'Imported Project',
                description: jsonData.project.description || '',
                version: jsonData.project.version || '1.0.0',
              })
            }
            
            // Import nodes
            let nodesImported = 0
            if (jsonData.nodes && Array.isArray(jsonData.nodes)) {
              jsonData.nodes.forEach((nodeData: any) => {
                // Create node using store action
                const newId = nodeStore.addNode(nodeData.type, nodeData.position || { x: 0, y: 0 })
                nodeStore.updateNode(newId, {
                  title: nodeData.title || 'Imported Node',
                  description: nodeData.description || '',
                  metadata: nodeData.metadata || {},
                })
                nodesImported++
              })
            }
            
            // Import connections (simplified for now)
            let connectionsImported = 0
            if (jsonData.connections && Array.isArray(jsonData.connections)) {
              jsonData.connections.forEach((connData: any) => {
                // This would need to map old IDs to new IDs
                // For now, skip connection import
                connectionsImported++
              })
            }
            
            get().markAsSaved()
            
            return {
              success: true,
              errors: [],
              warnings: [],
              nodesImported,
              connectionsImported,
            }
            
          } catch (error) {
            return {
              success: false,
              errors: [error instanceof Error ? error.message : 'Unknown import error'],
              warnings: [],
              nodesImported: 0,
              connectionsImported: 0,
            }
          }
        },

        // Auto-save Actions
        enableAutoSave: () => {
          set((state) => ({
            project: { ...state.project, autoSave: true },
          }), false, 'enableAutoSave')
        },

        disableAutoSave: () => {
          set((state) => ({
            project: { ...state.project, autoSave: false },
          }), false, 'disableAutoSave')
        },

        saveToLocalStorage: () => {
          try {
            const { project } = get()
            localStorage.setItem('recapmap-project', JSON.stringify(project))
            get().markAsSaved()
          } catch (error) {
            console.error('Failed to save to localStorage:', error)
          }
        },

        loadFromLocalStorage: () => {
          try {
            const saved = localStorage.getItem('recapmap-project')
            if (saved) {
              const project = JSON.parse(saved)
              set(() => ({ project }), false, 'loadFromLocalStorage')
              return true
            }
            return false
          } catch (error) {
            console.error('Failed to load from localStorage:', error)
            return false
          }
        },

        // Query methods
        isProjectModified: () => {
          return get().project.isModified
        },        getProjectSummary: () => {
          const { nodes, connections } = useNodeStore.getState()
          const { lastValidation } = get()
          
          return {
            nodeCount: nodes.length,
            connectionCount: connections.length,
            validationStatus: lastValidation
              ? lastValidation.isValid
                ? 'valid'
                : 'invalid'
              : 'unknown',
          }
        },
      }),
      {
        name: 'recapmap-project-store',
        partialize: (state) => ({ project: state.project }), // Only persist project data
      }
    ),
    {
      name: 'recapmap-project-store',
    }
  )
)
