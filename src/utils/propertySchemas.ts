/**
 * Node Property Schemas - Dynamic Form Generation & Validation System for RecapMap
 * 
 * This comprehensive system provides:
 * - **Dynamic UI Generation**: Automatically creates property editing forms for all 12 node types
 * - **Real-time Validation**: Validates user input with business rules, patterns, and constraints
 * - **Export Quality Control**: Ensures data integrity before YAML/JSON export operations
 * - **Type Safety**: Bridges TypeScript interfaces with runtime validation and UI metadata
 * - **Extensible Architecture**: Easy to add new node types or modify validation rules
 * 
 * Core Functions:
 * - `getPropertySchema(nodeType)`: Returns form field definitions for a node type
 * - `validateNodeProperties(nodeType, properties)`: Validates node data against business rules
 * - `nodePropertySchema`: Central registry mapping node types to their property definitions
 * 
 * Each property definition includes:
 * - UI metadata (labels, descriptions, placeholders, enum options)
 * - Validation rules (required fields, patterns, min/max values, custom validators)
 * - Form behavior (field types, dependencies, default values)
 * 
 * Used by PropertyPanel.tsx for form generation and ExportPanel.tsx for data validation.
 * This system ensures consistent user experience and data quality across the entire application.
 */

import type { PropertyDefinition, NodePropertySchema } from '../types'

// Property validation result interface
interface PropertyValidationResult {
  isValid: boolean
  errors: Array<{ property: string; message: string; value?: unknown }>
  warnings: Array<{ property: string; message: string; value?: unknown }>
}

// Case Node Property Schema
const caseProperties: PropertyDefinition[] = [
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

// Interface Node Property Schema
const interfaceProperties: PropertyDefinition[] = [
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

// User Node Property Schema (Renamed to Persona for 12-node system)
const personaProperties: PropertyDefinition[] = [
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

// Task Node Property Schema
const taskProperties: PropertyDefinition[] = [
  {
    name: 'taskName',
    type: 'string',
    required: true,
    label: 'Task Name',
    description: 'Clear, actionable task title',
    placeholder: 'Implement user authentication'
  },
  {
    name: 'taskType',
    type: 'enum',
    required: true,
    label: 'Task Type',
    description: 'Category of work item',
    enumOptions: [
      { value: 'feature', label: 'Feature Development' },
      { value: 'bug', label: 'Bug Fix' },
      { value: 'improvement', label: 'Enhancement' },
      { value: 'research', label: 'Research & Analysis' },
      { value: 'documentation', label: 'Documentation' },
      { value: 'review', label: 'Code Review' }
    ]
  },
  {
    name: 'priority',
    type: 'enum',
    required: true,
    label: 'Priority',
    description: 'Urgency and importance level',
    enumOptions: [
      { value: 'critical', label: 'Critical' },
      { value: 'high', label: 'High' },
      { value: 'medium', label: 'Medium' },
      { value: 'low', label: 'Low' }
    ]
  },
  {
    name: 'status',
    type: 'enum',
    required: true,
    label: 'Status',
    description: 'Current state of the task',
    enumOptions: [
      { value: 'todo', label: 'To Do' },
      { value: 'in_progress', label: 'In Progress' },
      { value: 'review', label: 'In Review' },
      { value: 'done', label: 'Done' },
      { value: 'blocked', label: 'Blocked' }
    ]
  },
  {
    name: 'estimatedEffort',
    type: 'string',
    required: false,
    label: 'Estimated Effort',
    description: 'Time estimate for completion',
    placeholder: '2 days, 4 hours, 1 week'
  },
  {
    name: 'assignedTo',
    type: 'array',
    required: false,
    label: 'Assigned To',
    description: 'Team members responsible for this task'
  },
  {
    name: 'acceptanceCriteria',
    type: 'array',
    required: false,
    label: 'Acceptance Criteria',
    description: 'Conditions that must be met to consider task complete'
  },
  {
    name: 'dueDate',
    type: 'string',
    required: false,
    label: 'Due Date',
    description: 'Target completion date',
    placeholder: 'YYYY-MM-DD'
  }
]

// Capability Node Property Schema
const capabilityProperties: PropertyDefinition[] = [
  {
    name: 'expectationName',
    type: 'string',
    required: true,
    label: 'Expectation Name',
    description: 'Clear description of what is expected',
    placeholder: 'System response time under 200ms'
  },
  {
    name: 'expectationType',
    type: 'enum',
    required: true,
    label: 'Expectation Type',
    description: 'Category of expectation',
    enumOptions: [
      { value: 'delivery', label: 'Delivery' },
      { value: 'behavior', label: 'Behavior' },
      { value: 'performance', label: 'Performance' },
      { value: 'quality', label: 'Quality' },
      { value: 'timeline', label: 'Timeline' },
      { value: 'outcome', label: 'Outcome' }
    ]
  },
  {
    name: 'criteria',
    type: 'array',
    required: true,
    label: 'Success Criteria',
    description: 'Specific, measurable criteria for success',
    validation: {
      minLength: 1
    }
  },
  {
    name: 'measurementMethod',
    type: 'string',
    required: true,
    label: 'Measurement Method',
    description: 'How success will be measured',
    placeholder: 'Load testing with 1000 concurrent users'
  },
  {
    name: 'successThreshold',
    type: 'string',
    required: true,
    label: 'Success Threshold',
    description: 'Minimum acceptable result',
    placeholder: '95% of requests under 200ms'
  },
  {
    name: 'stakeholder',
    type: 'string',
    required: false,
    label: 'Stakeholder',
    description: 'Who has this expectation',
    placeholder: 'Product Manager, End Users'
  },
  {
    name: 'businessValue',
    type: 'string',
    required: false,
    label: 'Business Value',
    description: 'Why this expectation matters',
    placeholder: 'Improved user satisfaction and retention'
  },
  {
    name: 'riskLevel',
    type: 'enum',
    required: false,
    label: 'Risk Level',
    description: 'Risk if expectation is not met',
    enumOptions: [
      { value: 'low', label: 'Low Risk' },
      { value: 'medium', label: 'Medium Risk' },
      { value: 'high', label: 'High Risk' },
      { value: 'critical', label: 'Critical Risk' }
    ]
  }
]

// Outcome Node Property Schema
const outcomeProperties: PropertyDefinition[] = [
  {
    name: 'outcomeName',
    type: 'string',
    required: true,
    label: 'Outcome Name',
    description: 'Clear description of what was achieved',
    placeholder: 'System response time averaging 150ms'
  },
  {
    name: 'outcomeType',
    type: 'enum',
    required: true,
    label: 'Outcome Type',
    description: 'Category of outcome',
    enumOptions: [
      { value: 'delivery', label: 'Delivery' },
      { value: 'behavior', label: 'Behavior' },
      { value: 'performance', label: 'Performance' },
      { value: 'quality', label: 'Quality' },
      { value: 'timeline', label: 'Timeline' },
      { value: 'impact', label: 'Impact' }
    ]
  },
  {
    name: 'status',
    type: 'enum',
    required: true,
    label: 'Achievement Status',
    description: 'How well the outcome was achieved',
    enumOptions: [
      { value: 'achieved', label: 'Fully Achieved' },
      { value: 'partially_achieved', label: 'Partially Achieved' },
      { value: 'not_achieved', label: 'Not Achieved' },
      { value: 'exceeded', label: 'Exceeded Expectations' }
    ]
  },
  {
    name: 'actualResults',
    type: 'array',
    required: true,
    label: 'Actual Results',
    description: 'What was actually delivered or achieved',
    validation: {
      minLength: 1
    }
  },
  {
    name: 'measuredValue',
    type: 'string',
    required: true,
    label: 'Measured Value',
    description: 'Quantitative result',
    placeholder: 'Average 147ms response time'
  },
  {
    name: 'variance',
    type: 'string',
    required: false,
    label: 'Variance from Expectation',
    description: 'Difference from original expectation',
    placeholder: '+26% better than expected'
  },
  {
    name: 'successFactors',
    type: 'array',
    required: false,
    label: 'Success Factors',
    description: 'What contributed to the positive outcome'
  },
  {
    name: 'challenges',
    type: 'array',
    required: false,
    label: 'Challenges',
    description: 'Obstacles encountered during execution'
  },
  {
    name: 'lessonsLearned',
    type: 'array',
    required: false,
    label: 'Lessons Learned',
    description: 'Key insights for future projects'
  },
  {
    name: 'achievedDate',
    type: 'string',
    required: false,
    label: 'Achievement Date',
    description: 'When the outcome was realized',
    placeholder: 'YYYY-MM-DD'
  }
]

// View Node Property Schema
const viewProperties: PropertyDefinition[] = [
  {
    name: 'presentationTitle',
    type: 'string',
    required: true,
    label: 'Presentation Title',
    description: 'Title for this presentation slide',
    placeholder: 'Project Overview'
  },
  {
    name: 'slideOrder',
    type: 'number',
    required: true,
    label: 'Slide Order',
    description: 'Position in presentation sequence',
    validation: {
      min: 1
    }
  },
  {
    name: 'layout',
    type: 'enum',
    required: true,
    label: 'Slide Layout',
    description: 'Visual layout template',
    enumOptions: [
      { value: 'title', label: 'Title Slide' },
      { value: 'content', label: 'Content' },
      { value: 'two-column', label: 'Two Column' },
      { value: 'full-screen', label: 'Full Screen' },
      { value: 'node-showcase', label: 'Node Showcase' }
    ]
  },
  {
    name: 'linkedNodes',
    type: 'array',
    required: false,
    label: 'Linked Nodes',
    description: 'Node IDs to include in this slide'
  },
  {
    name: 'transition',
    type: 'enum',
    required: false,
    label: 'Slide Transition',
    description: 'Animation between slides',
    enumOptions: [
      { value: 'fade', label: 'Fade' },
      { value: 'slide', label: 'Slide' },
      { value: 'zoom', label: 'Zoom' },
      { value: 'flip', label: 'Flip' },
      { value: 'none', label: 'No Transition' }
    ]
  },
  {
    name: 'duration',
    type: 'number',
    required: false,
    label: 'Auto-advance (seconds)',
    description: 'Seconds before auto-advancing to next slide',
    validation: {
      min: 1,
      max: 300
    }
  },
  {
    name: 'backgroundColor',
    type: 'string',
    required: false,
    label: 'Background Color',
    description: 'Custom background color for this slide',
    placeholder: '#1e1e2f'
  },
  {
    name: 'showPageNumber',
    type: 'boolean',
    required: false,
    label: 'Show Page Number',
    description: 'Display slide number'
  }
]

// Resource Node Property Schema  
const resourceProperties: PropertyDefinition[] = [
  {
    name: 'resourceName',
    type: 'string',
    required: true,
    label: 'Resource Name',
    description: 'Descriptive name for the resource',
    placeholder: 'API Documentation'
  },
  {
    name: 'resourceType',
    type: 'enum',
    required: true,
    label: 'Resource Type',
    description: 'Category of resource',
    enumOptions: [
      { value: 'file', label: 'File' },
      { value: 'image', label: 'Image' },
      { value: 'link', label: 'Web Link' },
      { value: 'document', label: 'Document' },
      { value: 'video', label: 'Video' },
      { value: 'audio', label: 'Audio' },
      { value: 'code', label: 'Code Repository' },
      { value: 'data', label: 'Data File' }
    ]
  },
  {
    name: 'url',
    type: 'string',
    required: false,
    label: 'URL',
    description: 'Web link or file path',
    placeholder: 'https://example.com/resource'
  },
  {
    name: 'fileName',
    type: 'string',
    required: false,
    label: 'File Name',
    description: 'Original file name',
    placeholder: 'api-docs.pdf'
  },
  {
    name: 'category',
    type: 'string',
    required: false,
    label: 'Category',
    description: 'Organization category',
    placeholder: 'Documentation, Images, Code'
  },
  {
    name: 'tags',
    type: 'array',
    required: false,
    label: 'Tags',
    description: 'Keywords for organization and search'
  },
  {
    name: 'isPublic',
    type: 'boolean',
    required: false,
    label: 'Public Access',
    description: 'Whether resource is publicly accessible'
  },
  {
    name: 'accessLevel',
    type: 'enum',
    required: false,
    label: 'Access Level',
    description: 'Who can access this resource',
    enumOptions: [
      { value: 'public', label: 'Public' },
      { value: 'internal', label: 'Internal Team' },
      { value: 'restricted', label: 'Restricted' },
      { value: 'confidential', label: 'Confidential' }
    ]
  },
  {
    name: 'version',
    type: 'string',
    required: false,
    label: 'Version',
    description: 'Version number or identifier',
    placeholder: 'v1.2.0'
  }
]

// Knowledge Node Property Schema
const knowledgeProperties: PropertyDefinition[] = [
  {
    name: 'knowledgeName',
    type: 'string',
    required: true,
    label: 'Knowledge Title',
    description: 'Clear, descriptive title',
    placeholder: 'REST API Best Practices'
  },
  {
    name: 'knowledgeType',
    type: 'enum',
    required: true,
    label: 'Knowledge Type',
    description: 'Category of knowledge',
    enumOptions: [
      { value: 'fact', label: 'Fact' },
      { value: 'process', label: 'Process' },
      { value: 'principle', label: 'Principle' },
      { value: 'best_practice', label: 'Best Practice' },
      { value: 'lesson_learned', label: 'Lesson Learned' },
      { value: 'insight', label: 'Insight' }
    ]
  },
  {
    name: 'domain',
    type: 'string',
    required: true,
    label: 'Domain',
    description: 'Subject area or field',
    placeholder: 'Software Development, API Design'
  },
  {
    name: 'definition',
    type: 'string',
    required: true,
    label: 'Definition',
    description: 'Core definition or explanation',
    placeholder: 'Clear, concise explanation of the concept'
  },
  {
    name: 'examples',
    type: 'array',
    required: false,
    label: 'Examples',
    description: 'Concrete examples demonstrating the knowledge'
  },
  {
    name: 'applications',
    type: 'array',
    required: false,
    label: 'Applications',
    description: 'How this knowledge can be applied'
  },
  {
    name: 'confidence',
    type: 'enum',
    required: false,
    label: 'Confidence Level',
    description: 'How certain we are about this knowledge',
    enumOptions: [
      { value: 'low', label: 'Low Confidence' },
      { value: 'medium', label: 'Medium Confidence' },
      { value: 'high', label: 'High Confidence' },
      { value: 'verified', label: 'Verified' }
    ]
  },
  {
    name: 'complexity',
    type: 'enum',
    required: false,
    label: 'Complexity',
    description: 'Difficulty level to understand/apply',
    enumOptions: [
      { value: 'basic', label: 'Basic' },
      { value: 'intermediate', label: 'Intermediate' },
      { value: 'advanced', label: 'Advanced' },
      { value: 'expert', label: 'Expert Level' }
    ]
  },
  {
    name: 'sources',
    type: 'array',
    required: false,
    label: 'Sources',
    description: 'References and sources for this knowledge'
  },
  {
    name: 'keywords',
    type: 'array',
    required: false,
    label: 'Keywords',
    description: 'Search keywords and related terms'
  }
]

// Note Node Property Schema
const noteProperties: PropertyDefinition[] = [
  {
    name: 'noteType',
    type: 'enum',
    required: true,
    label: 'Note Type',
    description: 'Category of note',
    enumOptions: [
      { value: 'meeting', label: 'Meeting Notes' },
      { value: 'decision', label: 'Decision Record' },
      { value: 'idea', label: 'Idea/Brainstorm' },
      { value: 'reminder', label: 'Reminder' },
      { value: 'observation', label: 'Observation' },
      { value: 'question', label: 'Question' }
    ]
  },
  {
    name: 'content',
    type: 'string',
    required: true,
    label: 'Content',
    description: 'Main note content',
    placeholder: 'Write your note content here...'
  },
  {
    name: 'summary',
    type: 'string',
    required: false,
    label: 'Summary',
    description: 'Brief summary of the note',
    placeholder: 'Key takeaways in one sentence'
  },
  {
    name: 'author',
    type: 'string',
    required: false,
    label: 'Author',
    description: 'Who created this note',
    placeholder: 'Team member name'
  },
  {
    name: 'audience',
    type: 'array',
    required: false,
    label: 'Audience',
    description: 'Who should see this note'
  },
  {
    name: 'category',
    type: 'string',
    required: false,
    label: 'Category',
    description: 'Organization category',
    placeholder: 'Project Planning, Technical, Business'
  },
  {
    name: 'importance',
    type: 'enum',
    required: false,
    label: 'Importance',
    description: 'Priority level of this note',
    enumOptions: [
      { value: 'low', label: 'Low' },
      { value: 'medium', label: 'Medium' },
      { value: 'high', label: 'High' },
      { value: 'critical', label: 'Critical' }
    ]
  },
  {
    name: 'tags',
    type: 'array',
    required: false,
    label: 'Tags',
    description: 'Keywords for organization and search'
  },
  {
    name: 'shared',
    type: 'boolean',
    required: false,
    label: 'Shared',
    description: 'Whether this note is shared with the team'
  },
  {
    name: 'editable',
    type: 'boolean',
    required: false,
    label: 'Editable',
    description: 'Whether others can edit this note'
  }
]

// Complete Property Schema Registry - 12-Node Universal System
export const nodePropertySchema: NodePropertySchema = {
  // Strategic Planning Nodes
  case: caseProperties,
  task: taskProperties,
  capability: capabilityProperties,
  outcome: outcomeProperties,
  
  // Human-Centered Design Nodes
  persona: personaProperties,
  interface: interfaceProperties,
  view: viewProperties,
  
  // Business Workflow Nodes
  process: processProperties,
  storage: storageProperties,
  
  // Information & Assets Nodes
  resource: resourceProperties,
  knowledge: knowledgeProperties,
  
  // Meta-Collaboration Tools Nodes
  note: noteProperties,
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
