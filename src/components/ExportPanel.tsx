/**
 * ExportPanel.tsx - YAML export interface with AI optimization options
 * Provides user-friendly export options for different platforms
 */

import React, { useState } from 'react'
import { useNodeStore, useProjectStore } from '../stores'
import { validateNodeProperties } from '../utils/propertySchemas'
import { exportForJava, exportForPython, exportForNodeJS, exportGeneric } from '../utils/yamlExport'
import type { YAMLExportOptions, RecapMapNode, PropertyValidationResult, ValidationResult } from '../types'

interface ExportPanelProps {
  isOpen: boolean
  onClose: () => void
}

interface ValidationError {
  id: string
  nodeId: string
  type: 'node' | 'connection'
  severity: 'error' | 'warning'
  message: string
  suggestion?: string
}

interface ExportValidationResult {
  isValid: boolean
  errors: ValidationError[]
  warnings: ValidationError[]
}

export const ExportPanel: React.FC<ExportPanelProps> = ({ isOpen, onClose }) => {
  const { nodes, connections } = useNodeStore()
  const { project } = useProjectStore()
  
  const [exportOptions, setExportOptions] = useState<YAMLExportOptions>({
    format: 'yaml',
    includeMetadata: true,
    includePositions: false,
    includeComments: true,
    aiOptimized: true,
    targetPlatform: 'generic'
  })
  
  const [exportResult, setExportResult] = useState<string>('')
  const [isExporting, setIsExporting] = useState(false)

  // Extract node-specific properties for validation
  const getNodeProperties = (node: RecapMapNode): Record<string, string | number | boolean | string[]> => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, type, position, title, description, metadata, connections, isSelected, isValid, createdAt, updatedAt, ...properties } = node
    return properties as Record<string, string | number | boolean | string[]>
  }

  // Generate unique ID for validation errors
  const generateId = () => Math.random().toString(36).substr(2, 9)

  // Validate all nodes for export
  const validateAllNodes = (): ExportValidationResult => {
    const errors: ValidationError[] = []
    const warnings: ValidationError[] = []

    nodes.forEach(node => {
      const validation: PropertyValidationResult = validateNodeProperties(node.type, getNodeProperties(node))
      
      // Convert property validation errors to export validation errors
      errors.push(...validation.errors.map((e) => ({
        id: generateId(),
        nodeId: node.id,
        type: 'node' as const,
        severity: 'error' as const,
        message: `${node.title}: ${e.message}`,
        suggestion: `Check the ${e.property} property for node ${node.title}`
      })))

      warnings.push(...validation.warnings.map((w) => ({
        id: generateId(),
        nodeId: node.id,
        type: 'node' as const,
        severity: 'warning' as const,
        message: `${node.title}: ${w.message}`,
        suggestion: `Consider updating the ${w.property} property for node ${node.title}`
      })))
    })

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const validation = validateAllNodes()      // Create ValidationResult for export functions
      const validationForExport: ValidationResult = {
        isValid: validation.isValid,
        errors: validation.errors.map(e => ({
          id: e.id,
          nodeId: e.nodeId,
          type: e.type,
          severity: e.severity,
          message: e.message,
          suggestion: e.suggestion
        })),
        warnings: validation.warnings.map(w => ({
          id: w.id,
          nodeId: w.nodeId,
          type: w.type,
          severity: 'warning' as const,
          message: w.message,
          suggestion: w.suggestion
        }))
      }
      
      let yamlContent: string
      
      switch (exportOptions.targetPlatform) {
        case 'java':
          yamlContent = exportForJava(nodes, connections, project, validationForExport)
          break
        case 'python':
          yamlContent = exportForPython(nodes, connections, project, validationForExport)
          break
        case 'nodejs':
          yamlContent = exportForNodeJS(nodes, connections, project, validationForExport)
          break
        default:
          yamlContent = exportGeneric(nodes, connections, project, validationForExport)
      }
      
      setExportResult(yamlContent)
    } catch (error) {
      setExportResult('Export failed: ' + (error as Error).message)
    } finally {
      setIsExporting(false)
    }
  }

  const handleDownload = () => {
    if (!exportResult) return
    
    const blob = new Blob([exportResult], { type: 'application/x-yaml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${project.name.toLowerCase().replace(/\s+/g, '_')}_${exportOptions.targetPlatform}.yaml`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleCopyToClipboard = async () => {
    if (!exportResult) return
    
    try {
      await navigator.clipboard.writeText(exportResult)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }

  const validation = validateAllNodes()

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-surface-primary rounded-lg w-full max-w-4xl h-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-surface-border">
          <h2 className="text-lg font-bold text-text-primary">Export Project</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-secondary rounded-md transition-colors"
            aria-label="Close export panel"
          >
            <svg className="w-5 h-5 text-text-secondary" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Options Panel */}
          <div className="w-80 border-r border-surface-border p-4 overflow-y-auto">
            <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wide mb-4">
              Export Options
            </h3>

            {/* Validation Status */}
            <div className={`p-3 rounded-md mb-4 ${
              validation.isValid 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center">
                <svg className={`w-4 h-4 mr-2 ${
                  validation.isValid ? 'text-green-500' : 'text-red-500'
                }`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className={`text-sm font-medium ${
                  validation.isValid ? 'text-green-800' : 'text-red-800'
                }`}>
                  {validation.isValid 
                    ? 'Ready to export' 
                    : `${validation.errors.length} error(s), ${validation.warnings.length} warning(s)`
                  }
                </span>
              </div>
            </div>

            {/* Target Platform */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-primary mb-2">
                Target Platform
              </label>
              <select
                value={exportOptions.targetPlatform}
                onChange={(e) => setExportOptions(prev => ({ 
                  ...prev, 
                  targetPlatform: e.target.value as YAMLExportOptions['targetPlatform']
                }))}
                className="w-full px-3 py-2 border border-surface-border rounded-md bg-surface-secondary text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent"
              >
                <option value="generic">Generic</option>
                <option value="java">Java/Spring</option>
                <option value="python">Python/FastAPI</option>
                <option value="nodejs">Node.js/Express</option>
              </select>
            </div>

            {/* Export Features */}
            <div className="space-y-3 mb-4">
              <h4 className="text-sm font-medium text-text-primary">Include</h4>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={exportOptions.includeMetadata}
                  onChange={(e) => setExportOptions(prev => ({ 
                    ...prev, 
                    includeMetadata: e.target.checked 
                  }))}
                  className="w-4 h-4 text-accent-primary bg-surface-secondary border-surface-border rounded focus:ring-accent-primary focus:ring-2"
                />
                <span className="text-sm text-text-secondary">Metadata</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={exportOptions.includePositions}
                  onChange={(e) => setExportOptions(prev => ({ 
                    ...prev, 
                    includePositions: e.target.checked 
                  }))}
                  className="w-4 h-4 text-accent-primary bg-surface-secondary border-surface-border rounded focus:ring-accent-primary focus:ring-2"
                />
                <span className="text-sm text-text-secondary">Node Positions</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={exportOptions.includeComments}
                  onChange={(e) => setExportOptions(prev => ({ 
                    ...prev, 
                    includeComments: e.target.checked 
                  }))}
                  className="w-4 h-4 text-accent-primary bg-surface-secondary border-surface-border rounded focus:ring-accent-primary focus:ring-2"
                />
                <span className="text-sm text-text-secondary">Comments</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={exportOptions.aiOptimized}
                  onChange={(e) => setExportOptions(prev => ({ 
                    ...prev, 
                    aiOptimized: e.target.checked 
                  }))}
                  className="w-4 h-4 text-accent-primary bg-surface-secondary border-surface-border rounded focus:ring-accent-primary focus:ring-2"
                />
                <span className="text-sm text-text-secondary">AI Optimization</span>
              </label>
            </div>

            {/* Export Actions */}
            <div className="space-y-2">
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="w-full px-4 py-2 bg-accent-primary text-white rounded-md hover:bg-accent-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isExporting ? 'Exporting...' : 'Generate YAML'}
              </button>

              {exportResult && (
                <>
                  <button
                    onClick={handleDownload}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Download File
                  </button>
                  <button
                    onClick={handleCopyToClipboard}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Copy to Clipboard
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Preview Panel */}
          <div className="flex-1 p-4 overflow-hidden flex flex-col">
            <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wide mb-4">
              YAML Preview
            </h3>
            
            <div className="flex-1 bg-surface-secondary rounded-md p-4 overflow-auto">
              {exportResult ? (
                <pre className="text-xs text-text-primary font-mono whitespace-pre-wrap">
                  {exportResult}
                </pre>
              ) : (
                <div className="flex items-center justify-center h-full text-text-muted">
                  <div className="text-center">
                    <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm">Click "Generate YAML" to see the export preview</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
