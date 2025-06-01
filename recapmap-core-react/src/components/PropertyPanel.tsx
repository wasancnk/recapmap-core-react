/**
 * PropertyPanel.tsx - Dynamic property editing component for RecapMap nodes
 * Generates forms based on property schemas with real-time validation
 */

import React from 'react'
import { useNodeStore } from '../stores'
import { getPropertySchema, validateNodeProperties } from '../utils/propertySchemas'
import type { RecapMapNode } from '../types'
import { PropertyField } from './PropertyField.js'

interface PropertyPanelProps {
  nodeId: string | null
  isOpen: boolean
  onClose: () => void
}

export const PropertyPanel: React.FC<PropertyPanelProps> = ({ 
  nodeId, 
  isOpen, 
  onClose 
}) => {
  const { nodes, updateNode } = useNodeStore()
  const node = nodeId ? nodes.find(n => n.id === nodeId) : null

  if (!isOpen || !node) {
    return null
  }  const propertySchema = getPropertySchema(node.type)
  // Extract node-specific properties for validation
  const getNodeProperties = (node: RecapMapNode): Record<string, string | number | boolean | string[]> => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, type, position, title, description, metadata, connections, isSelected, isValid, createdAt, updatedAt, ...properties } = node
    return properties as Record<string, string | number | boolean | string[]>
  }
  
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

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-surface-primary border-l border-surface-border z-50 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-surface-border">
        <h2 className="text-lg font-bold text-text-primary">
          {node.type.charAt(0).toUpperCase() + node.type.slice(1)} Properties
        </h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-surface-secondary rounded-md transition-colors"
          aria-label="Close property panel"
        >
          <svg className="w-5 h-5 text-text-secondary" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Validation Status */}
      {!validationResult.isValid && (
        <div className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
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

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
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
        )}

        {/* Metadata Section */}
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
      </div>
    </div>
  )
}
