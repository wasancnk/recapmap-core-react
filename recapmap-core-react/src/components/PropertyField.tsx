/**
 * PropertyField.tsx - Individual property input component with validation
 * Dynamically renders different input types based on property definitions
 */

import React from 'react'
import type { PropertyDefinition } from '../types'

interface PropertyFieldProps {
  property: PropertyDefinition
  value: string | number | boolean | string[] | undefined
  onChange: (value: string | number | boolean | string[]) => void
  validationErrors: Array<{ property: string; message: string; value?: unknown }>
}

export const PropertyField: React.FC<PropertyFieldProps> = ({
  property,
  value,
  onChange,
  validationErrors
}) => {
  const hasErrors = validationErrors.length > 0

  const renderInput = () => {
    switch (property.type) {
      case 'string':
        return (
          <input
            type="text"
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={property.placeholder}
            className={`w-full px-3 py-2 border rounded-md bg-surface-secondary text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:border-transparent ${
              hasErrors 
                ? 'border-red-400 focus:ring-red-500' 
                : 'border-surface-border focus:ring-accent-primary'
            }`}
          />
        )

      case 'number':
        return (
          <input
            type="number"
            value={typeof value === 'number' ? value : ''}
            onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
            placeholder={property.placeholder}
            min={property.validation?.min}
            max={property.validation?.max}
            className={`w-full px-3 py-2 border rounded-md bg-surface-secondary text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:border-transparent ${
              hasErrors 
                ? 'border-red-400 focus:ring-red-500' 
                : 'border-surface-border focus:ring-accent-primary'
            }`}
          />
        )

      case 'boolean':
        return (
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={typeof value === 'boolean' ? value : false}
              onChange={(e) => onChange(e.target.checked)}
              className="w-4 h-4 text-accent-primary bg-surface-secondary border-surface-border rounded focus:ring-accent-primary focus:ring-2"
            />
            <span className="text-sm text-text-secondary">
              {property.description || 'Enable this option'}
            </span>
          </label>
        )

      case 'enum':
        return (
          <select
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md bg-surface-secondary text-text-primary focus:outline-none focus:ring-2 focus:border-transparent ${
              hasErrors 
                ? 'border-red-400 focus:ring-red-500' 
                : 'border-surface-border focus:ring-accent-primary'
            }`}
          >
            <option value="">Select {property.label}</option>
            {property.enumOptions?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )

      case 'array':
        return (
          <ArrayField 
            property={property} 
            value={Array.isArray(value) ? value : []} 
            onChange={(newValue: string[]) => onChange(newValue)} 
            hasErrors={hasErrors} 
          />
        )

      case 'object':
        return (
          <ObjectField 
            property={property} 
            value={typeof value === 'object' && value !== null && !Array.isArray(value) ? value as Record<string, unknown> : {}} 
            onChange={(newValue: Record<string, unknown>) => onChange(newValue as unknown as string | number | boolean | string[])} 
            hasErrors={hasErrors} 
          />
        )

      default:
        return (
          <div className="text-sm text-text-muted italic">
            Unsupported property type: {property.type}
          </div>
        )
    }
  }

  return (
    <div className="space-y-2">
      {/* Label */}
      <label className="block text-sm font-medium text-text-primary">
        {property.label}
        {property.required && (
          <span className="text-red-500 ml-1">*</span>
        )}
      </label>

      {/* Description */}
      {property.description && (
        <p className="text-xs text-text-muted">
          {property.description}
        </p>
      )}

      {/* Input */}
      {renderInput()}

      {/* Validation Errors */}
      {hasErrors && (
        <div className="space-y-1">
          {validationErrors.map((error, index) => (
            <p key={index} className="text-xs text-red-600 flex items-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error.message}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

// Array Field Component
const ArrayField: React.FC<{
  property: PropertyDefinition
  value: string[]
  onChange: (value: string[]) => void
  hasErrors: boolean
}> = ({ property, value = [], onChange, hasErrors }) => {
  const [newItem, setNewItem] = React.useState('')

  const addItem = () => {
    if (newItem.trim()) {
      onChange([...value, newItem.trim()])
      setNewItem('')
    }
  }

  const removeItem = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, newValue: string) => {
    const updated = [...value]
    updated[index] = newValue
    onChange(updated)
  }

  return (
    <div className="space-y-2">
      {/* Existing Items */}
      {value.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <input
            type="text"
            value={item}
            onChange={(e) => updateItem(index, e.target.value)}
            className={`flex-1 px-3 py-2 border rounded-md bg-surface-secondary text-text-primary focus:outline-none focus:ring-2 focus:border-transparent ${
              hasErrors 
                ? 'border-red-400 focus:ring-red-500' 
                : 'border-surface-border focus:ring-accent-primary'
            }`}
          />
          <button
            onClick={() => removeItem(index)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
            type="button"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      ))}

      {/* Add New Item */}
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addItem()}
          placeholder={property.placeholder || `Add ${property.label.toLowerCase()}`}
          className={`flex-1 px-3 py-2 border rounded-md bg-surface-secondary text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:border-transparent ${
            hasErrors 
              ? 'border-red-400 focus:ring-red-500' 
              : 'border-surface-border focus:ring-accent-primary'
          }`}
        />
        <button
          onClick={addItem}
          disabled={!newItem.trim()}
          className="px-3 py-2 bg-accent-primary text-white rounded-md hover:bg-accent-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          type="button"
        >
          Add
        </button>
      </div>

      {/* Item Count */}
      <p className="text-xs text-text-muted">
        {value.length} item{value.length !== 1 ? 's' : ''}
        {property.validation?.minLength && (
          <span className="ml-2">
            (minimum: {property.validation.minLength})
          </span>
        )}
      </p>
    </div>
  )
}

// Object Field Component (for complex nested properties)
const ObjectField: React.FC<{
  property: PropertyDefinition
  value: Record<string, unknown>
  onChange: (value: Record<string, unknown>) => void
  hasErrors: boolean
}> = ({ property, value, hasErrors }) => {
  return (
    <div className={`p-3 border rounded-md bg-surface-secondary/50 ${
      hasErrors ? 'border-red-400' : 'border-surface-border'
    }`}>
      <p className="text-sm text-text-muted mb-2">
        {property.description || 'Complex object editing'}
      </p>
      <pre className="text-xs text-text-muted bg-surface-primary p-2 rounded overflow-auto">
        {JSON.stringify(value, null, 2)}
      </pre>
    </div>
  )
}
