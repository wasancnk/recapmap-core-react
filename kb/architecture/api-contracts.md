# API Contracts Specification

**Last Updated**: June 8, 2025  
**Purpose**: Contract-first development between frontend TypeScript and backend Java

## Overview

RecapMap uses contract-first development where TypeScript interfaces define the data models, which generate OpenAPI schemas, which generate Java POJOs. This ensures type safety and consistency across all layers.

## Core Data Models

### Base Node Interface
```typescript
interface BaseNode {
  id: string
  type: NodeType
  position: { x: number; y: number }
  title: string
  description?: string
  metadata: Record<string, string | number | boolean>
  connections: {
    inputs: string[]   // IDs of nodes connected as inputs
    outputs: string[]  // IDs of nodes connected as outputs
  }
  isSelected: boolean
  isValid: boolean
  createdAt: string
  updatedAt: string
}
```

### 12-Node Universal System Types
```typescript
type NodeType = 
  // Strategic Planning
  | 'usecase'     // Business requirements, user stories
  | 'task'        // Actionable work items and deliverables
  | 'expectation' // Expected outcomes and success criteria
  | 'outcome'     // Actual results and achievements
  // Human-Centered Design
  | 'persona'     // User roles, personas, actors (renamed from 'user')
  | 'screen'      // UI screens, interfaces, views  
  | 'presentation'// Presentation slides and demo materials
  // Business Workflow
  | 'process'     // Business processes, tools, systems
  | 'storage'     // Databases, files, data stores
  // Information & Assets
  | 'resource'    // Files, documents, external resources (renamed from 'attachment')
  | 'knowledge'   // Knowledge base and learning materials
  // Meta-Collaboration Tools
  | 'note'        // General notes and comments
```

### Specialized Node Interfaces

#### Use Case Node
```typescript
interface UseCaseNode extends BaseNode {
  type: 'usecase'
  priority: 'critical' | 'high' | 'medium' | 'low'
  complexity: 'simple' | 'moderate' | 'complex' | 'epic'
  businessValue: string
  stakeholders: string[]
  acceptanceCriteria: string[]
  featureName: string
  businessRules: string[]
  dependencies: string[]
  successMetrics: string[]
  assumptions: string[]
}
```

#### Screen Node
```typescript
interface ScreenNode extends BaseNode {
  type: 'screen'
  screenType: 'dashboard' | 'form' | 'list' | 'detail' | 'modal' | 'wizard' | 'landing'
  layoutType: 'grid' | 'flex' | 'fixed' | 'responsive'
  responsive: boolean
  accessibility: boolean
  components: Array<{
    type: string
    properties: Record<string, string | number | boolean>
    validation?: string[]
  }>
  navigationFlow: string[]
  dataBindings: string[]
  validationRules: string[]
  wireframeUrl?: string
}
```

#### Process Node
```typescript
interface ProcessNode extends BaseNode {
  type: 'process'
  capabilityName: string
  processType: 'computation' | 'integration' | 'notification' | 'validation' | 'transformation'
  automationLevel: 'manual' | 'semi_automated' | 'fully_automated'
  inputParameters: Array<{
    name: string
    type: string
    required: boolean
    validation?: string
    default?: string | number | boolean
  }>
  outputParameters: Array<{
    name: string
    type: string
    description?: string
  }>
  tools: string[]
  externalDependencies: string[]
  errorConditions: string[]
}
```

### System State Models

#### Project State
```typescript
interface ProjectState {
  id: string
  name: string
  description: string
  version: string
  createdAt: string
  updatedAt: string
  author: string
  nodes: RecapMapNode[]
  connections: NodeConnection[]
  canvasState: CanvasState
  validationResult: ValidationResult
}
```

#### Canvas State
```typescript
interface CanvasState {
  zoom: number
  center: { x: number; y: number }
  bounds: { left: number; top: number; right: number; bottom: number }
}
```

#### Node Connection
```typescript
interface NodeConnection {
  id: string
  sourceNodeId: string
  targetNodeId: string
  sourceHandle?: string
  targetHandle?: string
  connectionType: 'data' | 'control' | 'dependency' | 'composition'
  bidirectional: boolean
  metadata: Record<string, string | number | boolean>
}
```

## YAML Export Models

### YAML Project Specification
```typescript
interface YAMLProjectSpec {
  project: {
    name: string
    description: string
    version: string
    created_at: string
    updated_at: string
    author: string
  }
  architecture: {
    nodes: YAMLNodeSpec[]
    connections: Array<{
      id: string
      source: string
      target: string
      type: string
      description?: string
    }>
  }
  validation: {
    status: 'valid' | 'invalid' | 'warnings'
    errors: ValidationError[]
    warnings: ValidationError[]
    last_validated: string
  }
  ai_generation_hints: {
    target_platform: string
    complexity_level: 'simple' | 'moderate' | 'complex'
    primary_use_cases: string[]
    technical_constraints: string[]
  }
}
```

### YAML Node Specification
```typescript
interface YAMLNodeSpec {
  id: string
  type: NodeType
  title: string
  description: string
  properties: Record<string, unknown>
  connections: {
    inputs: string[]
    outputs: string[]
  }
  metadata: Record<string, string | number | boolean>
}
```

## Validation Models

### Validation Results
```typescript
interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
  warnings: ValidationError[]
  nodeValidation: Record<string, boolean>
  lastValidated: string
}

interface ValidationError {
  id: string
  type: 'error' | 'warning'
  message: string
  nodeId?: string
  field?: string
  severity: 'low' | 'medium' | 'high' | 'critical'
}
```

## API Endpoints (Backend Contract)

### Node Management
- `GET /api/projects/{id}/nodes` - Get all nodes for project
- `POST /api/projects/{id}/nodes` - Create new node
- `PUT /api/nodes/{id}` - Update node properties
- `DELETE /api/nodes/{id}` - Delete node

### Project Management
- `GET /api/projects` - List user projects
- `POST /api/projects` - Create new project
- `GET /api/projects/{id}` - Get project details
- `PUT /api/projects/{id}` - Update project

### YAML Export
- `POST /api/projects/{id}/export/yaml` - Generate YAML specification
- `POST /api/projects/{id}/validate` - Validate project completeness

### AI Integration
- `POST /api/ai/generate-code` - Generate code from YAML specification
- `POST /api/ai/chat` - AI assistant interaction

## Contract Versioning

### Version Strategy
- **v1**: Initial implementation with core 8-node system
- **v2**: Extended properties and advanced AI features
- **Future**: Unity integration and enterprise features

### Backward Compatibility
- All API changes are additive only
- Deprecated fields marked for removal in future versions
- Migration guides provided for breaking changes

## Implementation Path

1. **Extract TypeScript Types** → Generate OpenAPI schema
2. **OpenAPI Schema** → Generate Java POJOs
3. **Java POJOs** → Implement Spring Boot REST API
4. **Frontend Client** → Generate from OpenAPI schema
5. **Integration Tests** → Validate contract compliance
