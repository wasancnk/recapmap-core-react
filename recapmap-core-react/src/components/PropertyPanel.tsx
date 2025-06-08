/**
 * PropertyPanel.tsx - Dynamic property editing component for RecapMap nodes
 * Generates forms based on property schemas with real-time validation
 */

import React from 'react'
import { useNodeStore } from '../stores'
import { useUIStore } from '../stores/uiStore'
import { getPropertySchema, validateNodeProperties } from '../utils/propertySchemas'
import type { RecapMapNode } from '../types'
import { PropertyField } from './PropertyField.js'
import { useDraggable } from '../hooks/useDraggable'

interface PropertyPanelProps {
  nodeId: string | null
  isOpen: boolean
  position: { x: number; y: number }
  onClose: () => void
}

export const PropertyPanel: React.FC<PropertyPanelProps> = ({ 
  nodeId, 
  isOpen, 
  position,
  onClose 
}) => {
  const { nodes, updateNode, deleteNode } = useNodeStore()
  const { addNotification } = useUIStore()
  const node = nodeId ? nodes.find(n => n.id === nodeId) : null

  // Initialize draggable functionality
  const { position: draggablePosition, dragRef, dragHandleProps } = useDraggable({
    initialPosition: position,
  })

  // Add ESC key listener to close the panel
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen || !node) {
    return null
  }  const propertySchema = getPropertySchema(node.type)
  // Extract node-specific properties for validation
  const getNodeProperties = (node: RecapMapNode): Record<string, string | number | boolean | string[]> => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, type, position, title, description, metadata, connections, isSelected, isValid, createdAt, updatedAt, ...properties } = node
    return properties as Record<string, string | number | boolean | string[]>  }
  
  const validationResult = validateNodeProperties(node.type, getNodeProperties(node))

  const handlePropertyChange = (propertyName: string, value: string | number | boolean | string[]) => {
    updateNode(node.id, {
      ...node,
      [propertyName]: value,
      updatedAt: new Date().toISOString()
    })
  }

  const handleBasicPropertyChange = (field: keyof RecapMapNode, value: string) => {
    updateNode(node.id, {
      ...node,
      [field]: value,
      updatedAt: new Date().toISOString()
    })
  }

  const handleDeleteNode = () => {
    if (!node) return

    const confirmMessage = `Are you sure you want to delete the node "${node.title}"? This action cannot be undone.`
    
    if (window.confirm(confirmMessage)) {
      deleteNode(node.id)
      onClose() // Close the property panel
      
      addNotification({
        type: 'success',
        title: 'Node Deleted',
        message: `Successfully deleted node "${node.title}".`,
        duration: 3000
      })    }
  }

  return (
    <div 
      ref={dragRef}
      className="fixed bg-surface-primary border border-surface-border rounded-lg shadow-lg z-50 w-96 flex flex-col"
      style={{ 
        left: draggablePosition.x, 
        top: draggablePosition.y,
        height: '600px',
        maxHeight: '600px'
      }}
      title={`Position: ${draggablePosition.x}, ${draggablePosition.y} | Viewport: ${window.innerWidth}x${window.innerHeight}`}
    >      {/* Fixed Header - Draggable */}
      <div 
        className="flex flex-col select-none flex-shrink-0"
        {...dragHandleProps}
      >{/* Drag indicator dots - centered at top */}
        <div className="flex justify-center py-2">
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-text-muted rounded-full"></div>
            <div className="w-1 h-1 bg-text-muted rounded-full"></div>
            <div className="w-1 h-1 bg-text-muted rounded-full"></div>
            <div className="w-1 h-1 bg-text-muted rounded-full"></div>
          </div>
        </div>
        
        {/* Debug position info - temporary */}
        <div className="text-xs text-text-muted text-center pb-1">
          Pos: {Math.round(draggablePosition.x)},{Math.round(draggablePosition.y)} | 
          VP: {window.innerWidth}x{window.innerHeight}
        </div>
        
        {/* Title and close button */}
        <div className="flex items-center justify-between px-4 pb-4 border-b border-surface-border">
          <h2 className="text-lg font-bold text-text-primary">
            {node.type.charAt(0).toUpperCase() + node.type.slice(1)} Properties
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-secondary rounded-md transition-colors"
            aria-label="Close property panel"
            onMouseDown={(e) => e.stopPropagation()} // Prevent drag when clicking close button
          >
            <svg className="w-5 h-5 text-text-secondary" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>          </button>
        </div>

        {/* Fixed Validation Status */}
        {!validationResult.isValid && (
          <div className="mx-4 mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center">
              <svg className="w-4 h-4 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-red-800">
                {validationResult.errors.length} validation error(s)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto scrollbar-dark p-4 space-y-6">
        {/* Basic Properties Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wide">
            Basic Properties
          </h3>
          
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Title
            </label>
            <input
              type="text"
              value={node.title}
              onChange={(e) => handleBasicPropertyChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-surface-border rounded-md bg-surface-secondary text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent"
              placeholder="Enter node title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Description
            </label>
            <textarea
              value={node.description || ''}
              onChange={(e) => handleBasicPropertyChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-surface-border rounded-md bg-surface-secondary text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent resize-none"
              placeholder="Enter node description"
            />
          </div>
        </div>

        {/* Type-Specific Properties Section */}
        {propertySchema.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wide">
              {node.type.charAt(0).toUpperCase() + node.type.slice(1)} Properties
            </h3>
              {propertySchema.map((property) => (
              <PropertyField
                key={property.name}
                property={property}
                value={getNodeProperties(node)[property.name]}
                onChange={(value: string | number | boolean | string[]) => handlePropertyChange(property.name, value)}
                validationErrors={validationResult.errors.filter((e: { property: string }) => e.property === property.name)}
              />
            ))}
          </div>
        )}        {/* Metadata Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wide">
            Metadata
          </h3>
          
          <div className="bg-surface-secondary rounded-md p-3">
            <div className="text-xs text-text-muted space-y-1">
              <div>ID: {node.id}</div>
              <div>Created: {new Date(node.createdAt).toLocaleString()}</div>
              <div>Updated: {new Date(node.updatedAt).toLocaleString()}</div>
              <div>Valid: {node.isValid ? '✅' : '❌'}</div>
            </div>
          </div>
        </div>

        {/* Delete Section */}
        <div className="space-y-4 border-t border-surface-border pt-4">
          <h3 className="text-sm font-semibold text-red-600 uppercase tracking-wide">
            Danger Zone
          </h3>
          
          <button
            onClick={handleDeleteNode}
            className="
              w-full px-4 py-2 bg-red-500 border border-red-600 text-white rounded-md
              hover:bg-red-600 transition-colors text-sm font-medium
              focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
            "
          >
            🗑️ Delete Node
          </button>
        </div>
      </div>
    </div>
  )
}
