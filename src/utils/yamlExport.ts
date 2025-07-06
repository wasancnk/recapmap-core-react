/**
 * yamlExport.ts - YAML export system for AI-optimized code generation
 * Converts RecapMap projects to structured YAML for AI assistance
 */

import type { 
  RecapMapNode, 
  NodeConnection, 
  ProjectState, 
  YAMLProjectSpec, 
  YAMLNodeSpec,
  YAMLExportOptions,
  ValidationResult
} from '../types'

/**
 * Convert a RecapMap node to YAML specification format
 */
export function nodeToYAMLSpec(node: RecapMapNode): YAMLNodeSpec {
  // Extract all non-base properties for the specific node type
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id: _id, type: _type, position: _position, title: _title, description: _description, metadata: _metadata, connections: _connections, isSelected: _isSelected, isValid: _isValid, createdAt: _createdAt, updatedAt: _updatedAt, ...properties } = node

  return {
    id: node.id,
    type: node.type,
    metadata: {
      title: node.title,
      description: node.description || '',
      created_at: node.createdAt,
      updated_at: node.updatedAt
    },
    properties: properties as Record<string, string | number | boolean | string[]>,
    connections: {
      inputs: node.connections.inputs,
      outputs: node.connections.outputs
    },
    validation_status: node.isValid ? 'valid' : 'invalid'
  }
}

/**
 * Generate AI-optimized YAML export
 */
export function exportToYAML(
  nodes: RecapMapNode[],
  connections: NodeConnection[],
  project: ProjectState,
  validation: ValidationResult,
  options: YAMLExportOptions
): string {
  // Build the complete project specification
  const yamlSpec: YAMLProjectSpec = {
    project: {
      name: project.name,
      description: project.description || '',
      version: project.version,
      created_at: project.createdAt,
      updated_at: project.updatedAt,
      author: project.author
    },
    architecture: {
      nodes: nodes.map(nodeToYAMLSpec),
      connections: connections.map(conn => ({
        id: conn.id,
        source: conn.sourceNodeId,
        target: conn.targetNodeId,
        type: conn.type,
        description: conn.label
      }))
    },
    validation: {
      status: validation.isValid ? 'valid' : (validation.warnings.length > 0 ? 'warnings' : 'invalid'),
      errors: validation.errors,
      warnings: validation.warnings,
      last_validated: new Date().toISOString()
    },
    ai_generation_hints: generateAIHints(nodes, options)
  }

  // Convert to YAML string with proper formatting
  return stringifyYAML(yamlSpec, options)
}

/**
 * Generate AI optimization hints based on project structure
 */
function generateAIHints(nodes: RecapMapNode[], options: YAMLExportOptions) {
  const complexity = determineComplexity(nodes)
  const primaryUseCases = extractPrimaryUseCases(nodes)
  const technicalConstraints = extractTechnicalConstraints(nodes, options.targetPlatform)

  return {
    target_platform: options.targetPlatform,
    complexity_level: complexity,
    primary_use_cases: primaryUseCases,
    technical_constraints: technicalConstraints
  }
}

/**
 * Determine project complexity based on node analysis
 */
function determineComplexity(nodes: RecapMapNode[]): 'simple' | 'moderate' | 'complex' {
  const nodeCount = nodes.length
  const caseNodes = nodes.filter(n => n.type === 'case')
  const hasComplexNodes = nodes.some(n => 
    (n.type === 'case' && (n as unknown as { complexity?: string }).complexity === 'complex') ||
    (n.type === 'process' && (n as unknown as { processType?: string }).processType === 'integration')
  )

  if (nodeCount <= 5 && !hasComplexNodes) return 'simple'
  if (nodeCount <= 15 && caseNodes.length <= 3) return 'moderate'
  return 'complex'
}

/**
 * Extract primary use cases for AI context
 */
function extractPrimaryUseCases(nodes: RecapMapNode[]): string[] {
  return nodes
    .filter(n => n.type === 'case')
    .map(n => (n as unknown as { featureName?: string }).featureName || n.title)
    .filter(Boolean)
    .slice(0, 5) // Limit to top 5 for AI focus
}

/**
 * Extract technical constraints based on platform and nodes
 */
function extractTechnicalConstraints(nodes: RecapMapNode[], platform: string): string[] {
  const constraints: string[] = []

  // Platform-specific constraints
  switch (platform) {
    case 'java':
      constraints.push('spring_boot_compatible', 'maven_build_system')
      break
    case 'python':
      constraints.push('fastapi_compatible', 'pip_installable')
      break
    case 'nodejs':
      constraints.push('express_compatible', 'npm_package_manager')
      break
  }
  // Node-based constraints
  const storageNodes = nodes.filter(n => n.type === 'storage')
  if (storageNodes.length > 0) {
    const storageTypes = storageNodes.map(n => (n as unknown as { storageType?: string }).storageType).filter(Boolean)
    constraints.push(...storageTypes.map(type => `requires_${type}_support`))
  }

  // Note: Framework selection removed per architectural clarity analysis
  // RecapMap uses React as its rendering engine, no user choice needed

  return [...new Set(constraints)] // Remove duplicates
}

/**
 * Convert JavaScript object to YAML string with proper formatting
 */
function stringifyYAML(obj: YAMLProjectSpec, options: YAMLExportOptions): string {
  const lines: string[] = []
  
  if (options.includeComments) {
    lines.push('# RecapMap Project Export - AI-Optimized YAML')
    lines.push('# Generated on: ' + new Date().toISOString())
    lines.push('# Target Platform: ' + options.targetPlatform)
    lines.push('')
  }

  // Project section
  lines.push('project:')
  lines.push(`  name: "${obj.project.name}"`)
  lines.push(`  description: "${obj.project.description}"`)
  lines.push(`  version: "${obj.project.version}"`)
  lines.push(`  created_at: "${obj.project.created_at}"`)
  lines.push(`  updated_at: "${obj.project.updated_at}"`)
  lines.push(`  author: "${obj.project.author}"`)
  lines.push('')

  // Architecture section
  lines.push('architecture:')
  lines.push('  nodes:')
  
  obj.architecture.nodes.forEach(node => {
    lines.push(`    - id: "${node.id}"`)
    lines.push(`      type: "${node.type}"`)
    lines.push('      metadata:')
    lines.push(`        title: "${node.metadata.title}"`)
    lines.push(`        description: "${node.metadata.description}"`)
    lines.push(`        created_at: "${node.metadata.created_at}"`)
    lines.push(`        updated_at: "${node.metadata.updated_at}"`)
    
    lines.push('      properties:')
    Object.entries(node.properties).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        lines.push(`        ${key}:`)
        value.forEach(item => lines.push(`          - "${item}"`))
      } else {
        lines.push(`        ${key}: ${typeof value === 'string' ? `"${value}"` : value}`)
      }
    })
    
    lines.push('      connections:')
    lines.push(`        inputs: [${node.connections.inputs.map(id => `"${id}"`).join(', ')}]`)
    lines.push(`        outputs: [${node.connections.outputs.map(id => `"${id}"`).join(', ')}]`)
    lines.push(`      validation_status: "${node.validation_status}"`)
    lines.push('')
  })

  // Connections section
  lines.push('  connections:')
  obj.architecture.connections.forEach(conn => {
    lines.push(`    - id: "${conn.id}"`)
    lines.push(`      source: "${conn.source}"`)
    lines.push(`      target: "${conn.target}"`)
    lines.push(`      type: "${conn.type}"`)
    if (conn.description) {
      lines.push(`      description: "${conn.description}"`)
    }
    lines.push('')
  })

  // Validation section
  lines.push('validation:')
  lines.push(`  status: "${obj.validation.status}"`)
  lines.push(`  last_validated: "${obj.validation.last_validated}"`)
  
  if (obj.validation.errors.length > 0) {
    lines.push('  errors:')
    obj.validation.errors.forEach(error => {
      lines.push(`    - type: "${error.type}"`)
      lines.push(`      message: "${error.message}"`)
      if (error.nodeId) lines.push(`      node_id: "${error.nodeId}"`)
    })
  }

  if (obj.validation.warnings.length > 0) {
    lines.push('  warnings:')
    obj.validation.warnings.forEach(warning => {
      lines.push(`    - type: "${warning.type}"`)
      lines.push(`      message: "${warning.message}"`)
      if (warning.nodeId) lines.push(`      node_id: "${warning.nodeId}"`)
    })
  }

  lines.push('')

  // AI generation hints
  if (options.aiOptimized) {
    lines.push('ai_generation_hints:')
    lines.push(`  target_platform: "${obj.ai_generation_hints.target_platform}"`)
    lines.push(`  complexity_level: "${obj.ai_generation_hints.complexity_level}"`)
    
    lines.push('  primary_use_cases:')
    obj.ai_generation_hints.primary_use_cases.forEach(useCase => {
      lines.push(`    - "${useCase}"`)
    })
    
    lines.push('  technical_constraints:')
    obj.ai_generation_hints.technical_constraints.forEach(constraint => {
      lines.push(`    - "${constraint}"`)
    })
  }

  return lines.join('\n')
}

/**
 * Export convenience functions for different platforms
 */
export const exportForJava = (nodes: RecapMapNode[], connections: NodeConnection[], project: ProjectState, validation: ValidationResult) =>
  exportToYAML(nodes, connections, project, validation, {
    format: 'yaml',
    includeMetadata: true,
    includePositions: false,
    includeComments: true,
    aiOptimized: true,
    targetPlatform: 'java'
  })

export const exportForPython = (nodes: RecapMapNode[], connections: NodeConnection[], project: ProjectState, validation: ValidationResult) =>
  exportToYAML(nodes, connections, project, validation, {
    format: 'yaml',
    includeMetadata: true,
    includePositions: false,
    includeComments: true,
    aiOptimized: true,
    targetPlatform: 'python'
  })

export const exportForNodeJS = (nodes: RecapMapNode[], connections: NodeConnection[], project: ProjectState, validation: ValidationResult) =>
  exportToYAML(nodes, connections, project, validation, {
    format: 'yaml',
    includeMetadata: true,
    includePositions: false,
    includeComments: true,
    aiOptimized: true,
    targetPlatform: 'nodejs'
  })

export const exportGeneric = (nodes: RecapMapNode[], connections: NodeConnection[], project: ProjectState, validation: ValidationResult) =>
  exportToYAML(nodes, connections, project, validation, {
    format: 'yaml',
    includeMetadata: true,
    includePositions: false,
    includeComments: true,
    aiOptimized: true,
    targetPlatform: 'generic'
  })
