/**
 * Node Property Schemas - Defines validation rules and UI forms for each node type
 * This system enables dynamic property panels and YAML export validation
 */

import type { PropertyDefinition, NodePropertySchema } from '../types'

// Property validation result interface
interface PropertyValidationResult {
  isValid: boolean
  errors: Array<{ property: string; message: string; value?: unknown }>
  warnings: Array<{ property: string; message: string; value?: unknown }>
}

// Use Case Node Property Schema
const useCaseProperties: PropertyDefinition[] = [
  {
    name: 'featureName',
    type: 'string',
    required: true,
    label: 'Feature Name',
    description: 'Unique identifier for AI generation',
    placeholder: 'user_authentication',
    validation: {
      pattern: '^[a-z][a-z0-9_]*$',
      minLength: 3,
      maxLength: 50,
    }
  },
  {
    name: 'priority',
    type: 'enum',
    required: true,
    label: 'Business Priority',
    description: 'Impact on business objectives',
    enumOptions: [
      { value: 'critical', label: 'Critical' },
      { value: 'high', label: 'High' },
      { value: 'medium', label: 'Medium' },
      { value: 'low', label: 'Low' }
    ]
  },
  {
    name: 'complexity',
    type: 'enum',
    required: true,
    label: 'Implementation Complexity',
    description: 'Development effort estimation',
    enumOptions: [
      { value: 'simple', label: 'Simple (1-2 days)' },
      { value: 'moderate', label: 'Moderate (3-7 days)' },
      { value: 'complex', label: 'Complex (1-2 weeks)' },
      { value: 'epic', label: 'Epic (multiple sprints)' }
    ]
  },
  {
    name: 'businessValue',
    type: 'string',
    required: true,
    label: 'Business Value',
    description: 'Why this feature matters to users and business',
    placeholder: 'Enables secure user access and data protection'
  },
  {
    name: 'stakeholders',
    type: 'array',
    required: false,
    label: 'Stakeholders',
    description: 'Who is involved or affected by this feature'
  },
  {
    name: 'acceptanceCriteria',
    type: 'array',
    required: true,
    label: 'Acceptance Criteria',
    description: 'Specific conditions that must be met',
    validation: {
      minLength: 1,
    }
  }
]

// Screen Node Property Schema
const screenProperties: PropertyDefinition[] = [
  {
    name: 'screenType',
    type: 'enum',
    required: true,
    label: 'Screen Type',
    description: 'Primary interface pattern',
    enumOptions: [
      { value: 'dashboard', label: 'Dashboard' },
      { value: 'form', label: 'Form' },
      { value: 'list', label: 'List/Table' },
      { value: 'detail', label: 'Detail View' },
      { value: 'modal', label: 'Modal/Dialog' },
      { value: 'wizard', label: 'Multi-step Wizard' },
      { value: 'landing', label: 'Landing Page' }
    ]
  },
  {
    name: 'layoutType',
    type: 'enum',
    required: true,
    label: 'Layout Type',
    description: 'Responsive layout strategy',
    enumOptions: [
      { value: 'grid', label: 'CSS Grid' },
      { value: 'flex', label: 'Flexbox' },
      { value: 'fixed', label: 'Fixed Layout' },
      { value: 'responsive', label: 'Responsive' }    ]
  },
  {
    name: 'responsive',
    type: 'boolean',
    required: true,
    label: 'Mobile Responsive',
    description: 'Adapts to different screen sizes',
    defaultValue: true
  },
  {
    name: 'accessibility',
    type: 'boolean',
    required: true,
    label: 'WCAG Compliant',
    description: 'Meets accessibility standards',
    defaultValue: true
  }
]

// User Node Property Schema
const userProperties: PropertyDefinition[] = [
  {
    name: 'role',
    type: 'string',
    required: true,
    label: 'User Role',
    description: 'Primary role or job function',
    placeholder: 'System Administrator'
  },
  {
    name: 'userType',
    type: 'enum',
    required: true,
    label: 'User Type',
    description: 'System access level category',
    enumOptions: [
      { value: 'admin', label: 'Administrator' },
      { value: 'power_user', label: 'Power User' },
      { value: 'standard_user', label: 'Standard User' },
      { value: 'guest', label: 'Guest User' },
      { value: 'system', label: 'System Account' }
    ]
  },
  {
    name: 'accessLevel',
    type: 'enum',
    required: true,
    label: 'Access Level',
    description: 'Permission tier',
    enumOptions: [
      { value: 'admin', label: 'Full Admin Access' },
      { value: 'manager', label: 'Management Access' },
      { value: 'user', label: 'Standard Access' },
      { value: 'read_only', label: 'Read Only' }
    ]
  },
  {
    name: 'expertise',
    type: 'enum',
    required: true,
    label: 'Technical Expertise',
    description: 'User skill level with technology',
    enumOptions: [
      { value: 'beginner', label: 'Beginner' },
      { value: 'intermediate', label: 'Intermediate' },
      { value: 'expert', label: 'Expert' }
    ]
  },
  {
    name: 'authenticationMethod',
    type: 'enum',
    required: true,
    label: 'Authentication',
    description: 'How user proves identity',
    enumOptions: [
      { value: 'password', label: 'Username/Password' },
      { value: 'mfa', label: 'Multi-Factor Auth' },
      { value: 'sso', label: 'Single Sign-On' },
      { value: 'oauth', label: 'OAuth Provider' },
      { value: 'certificate', label: 'Digital Certificate' }
    ]
  }
]

// Process Node Property Schema
const processProperties: PropertyDefinition[] = [
  {
    name: 'capabilityName',
    type: 'string',
    required: true,
    label: 'Capability Name',
    description: 'Function name for code generation',
    placeholder: 'authenticate_user',
    validation: {
      pattern: '^[a-z][a-z0-9_]*$',
      minLength: 3,
      maxLength: 50,
    }
  },
  {
    name: 'processType',
    type: 'enum',
    required: true,
    label: 'Process Type',
    description: 'Primary function category',
    enumOptions: [
      { value: 'computation', label: 'Data Processing' },
      { value: 'integration', label: 'System Integration' },
      { value: 'notification', label: 'User Notification' },
      { value: 'validation', label: 'Data Validation' },
      { value: 'transformation', label: 'Data Transformation' }
    ]
  },
  {
    name: 'automationLevel',
    type: 'enum',
    required: true,
    label: 'Automation Level',
    description: 'Human involvement required',
    enumOptions: [
      { value: 'manual', label: 'Manual Process' },
      { value: 'semi_automated', label: 'Semi-Automated' },
      { value: 'fully_automated', label: 'Fully Automated' }
    ]
  },
  {
    name: 'sla',
    type: 'string',
    required: false,
    label: 'SLA Requirements',
    description: 'Performance expectations',
    placeholder: '< 200ms response time, 99.9% uptime'
  }
]

// Storage Node Property Schema
const storageProperties: PropertyDefinition[] = [
  {
    name: 'storageName',
    type: 'string',
    required: true,
    label: 'Storage Name',
    description: 'Database/table/collection name',
    placeholder: 'user_profiles',
    validation: {
      pattern: '^[a-z][a-z0-9_]*$',
      minLength: 3,
      maxLength: 50,
    }
  },
  {
    name: 'storageType',
    type: 'enum',
    required: true,
    label: 'Storage Type',
    description: 'Data persistence technology',
    enumOptions: [
      { value: 'database', label: 'Database (SQL/NoSQL)' },
      { value: 'cache', label: 'Cache (Redis/Memcached)' },
      { value: 'file_system', label: 'File System' },
      { value: 'memory', label: 'In-Memory' },
      { value: 'external_api', label: 'External API' },
      { value: 'blob_storage', label: 'Blob Storage' }
    ]
  },
  {
    name: 'technology',
    type: 'string',
    required: true,
    label: 'Technology',
    description: 'Specific implementation',
    placeholder: 'PostgreSQL, MongoDB, Redis'
  },
  {
    name: 'accessPattern',
    type: 'enum',
    required: true,
    label: 'Access Pattern',
    description: 'Primary usage pattern',
    enumOptions: [
      { value: 'read_heavy', label: 'Read Heavy' },
      { value: 'write_heavy', label: 'Write Heavy' },
      { value: 'balanced', label: 'Balanced Read/Write' },
      { value: 'append_only', label: 'Append Only' }
    ]
  },
  {
    name: 'securityClassification',
    type: 'enum',
    required: true,
    label: 'Security Level',
    description: 'Data sensitivity classification',
    enumOptions: [
      { value: 'public', label: 'Public' },
      { value: 'internal', label: 'Internal Use' },
      { value: 'confidential', label: 'Confidential' },
      { value: 'restricted', label: 'Restricted' }
    ]
  }
]

// Complete Property Schema Registry - 12-Node Universal System
export const nodePropertySchema: NodePropertySchema = {
  // Strategic Planning Nodes
  usecase: useCaseProperties,
  task: [], // TODO: Add task-specific property definitions
  expectation: [], // TODO: Add expectation-specific property definitions
  outcome: [], // TODO: Add outcome-specific property definitions,
  
  // Human-Centered Design Nodes
  persona: userProperties, // Reuse existing user properties for persona
  screen: screenProperties,
  presentation: [], // TODO: Add presentation-specific property definitions
  
  // Business Workflow Nodes
  process: processProperties,
  storage: storageProperties,
  
  // Information & Assets Nodes
  resource: [], // TODO: Add resource-specific property definitions (renamed from attachment)
  knowledge: [], // TODO: Add knowledge-specific property definitions
  
  // Meta-Collaboration Tools Nodes
  note: [], // TODO: Add note-specific property definitions
}

// Property validation functions
export function validateNodeProperties(nodeType: string, properties: Record<string, unknown>): PropertyValidationResult {
  const schema = nodePropertySchema[nodeType]
  if (!schema) {
    return {
      isValid: false,
      errors: [{ property: 'type', message: `Unknown node type: ${nodeType}` }],
      warnings: []
    }
  }

  const errors: Array<{ property: string; message: string; value?: unknown }> = []
  const warnings: Array<{ property: string; message: string; value?: unknown }> = []

  schema.forEach(propertyDef => {
    const value = properties[propertyDef.name]

    // Required field validation
    if (propertyDef.required && (value === undefined || value === null || value === '')) {
      errors.push({
        property: propertyDef.name,
        message: `${propertyDef.label} is required`,
        value
      })
      return
    }

    // Skip further validation if value is empty and not required
    if (!value && !propertyDef.required) return

    // Type-specific validation
    if (propertyDef.validation) {
      const validation = propertyDef.validation

      // String validation
      if (propertyDef.type === 'string' && typeof value === 'string') {
        if (validation.minLength && value.length < validation.minLength) {
          errors.push({
            property: propertyDef.name,
            message: `${propertyDef.label} must be at least ${validation.minLength} characters`,
            value
          })
        }
        if (validation.maxLength && value.length > validation.maxLength) {
          errors.push({
            property: propertyDef.name,
            message: `${propertyDef.label} must be no more than ${validation.maxLength} characters`,
            value
          })
        }
        if (validation.pattern && !new RegExp(validation.pattern).test(value)) {
          errors.push({
            property: propertyDef.name,
            message: `${propertyDef.label} format is invalid`,
            value
          })
        }
      }

      // Number validation
      if (propertyDef.type === 'number' && typeof value === 'number') {
        if (validation.min !== undefined && value < validation.min) {
          errors.push({
            property: propertyDef.name,
            message: `${propertyDef.label} must be at least ${validation.min}`,
            value
          })
        }
        if (validation.max !== undefined && value > validation.max) {
          errors.push({
            property: propertyDef.name,
            message: `${propertyDef.label} must be no more than ${validation.max}`,
            value
          })
        }
      }      // Custom validation
      if (validation.custom && (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean')) {
        const customResult = validation.custom(value)
        if (!customResult.valid) {
          errors.push({
            property: propertyDef.name,
            message: customResult.message || `${propertyDef.label} is invalid`,
            value
          })
        }
      }
    }

    // Array validation
    if (propertyDef.type === 'array' && Array.isArray(value)) {
      if (propertyDef.validation?.minLength && value.length < propertyDef.validation.minLength) {
        errors.push({
          property: propertyDef.name,
          message: `${propertyDef.label} must have at least ${propertyDef.validation.minLength} items`,
          value
        })
      }
    }
  })

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

export function getPropertySchema(nodeType: string): PropertyDefinition[] {
  return nodePropertySchema[nodeType] || []
}
