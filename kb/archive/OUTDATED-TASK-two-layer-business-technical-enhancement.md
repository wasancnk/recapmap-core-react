# TASK-two-layer-business-technical-enhancement.md

## Task Overview
Implement a two-layer architecture for node information capture - a simple business layer for executives/stakeholders and an advanced technical layer for developers. Add project-level technical configuration panel to enhance AI code generation capabilities for the complete **10-node system**.

## Background & Context

### Current Situation
- **10 Node Types**: UseCase, Screen, User, Process, Storage, Controller, Error, Presentation, Concept, Attachment
- Nodes contain mixed business and technical properties without clear separation
- No distinction between information that executives vs developers should fill
- Project-level technical context scattered across individual nodes
- YAML export good but could be more AI-comprehensive with better technical details
- Users feel overwhelmed by technical complexity when they just want to capture business requirements

### Vision: Universal AI Code Generation
- **Business Layer**: CEO-friendly fields that capture business value and requirements
- **Technical Layer**: Developer-friendly fields that provide implementation guidance for AI
- **Project Settings**: Centralized technical configuration for architecture and tech stack
- **Enhanced YAML**: Rich exports that any AI/Copilot can understand and use for code generation

## Requirements

### Functional Requirements

#### 1. Business Context Layer (Always Visible)
**For ALL 10 Node Types:**
- **Purpose**: Plain English description of what this component does
- **Business Value**: Why this matters to the business
- **Success Criteria**: How to measure if this works correctly
- **Stakeholder Impact**: Who benefits and how

**Example for Login UseCase:**
```
Purpose: "Allow users to access their accounts securely"
Business Value: "Reduces support calls and protects customer data"
Success Criteria: "Users can login in under 10 seconds with 99.9% success rate"
Stakeholder Impact: "Customers get secure access, support team gets fewer password reset calls"
```

**Example for New Node Types:**

**Presentation Node:**
```
Purpose: "Create executive summary slides from technical diagrams"
Business Value: "Enables stakeholder communication and project buy-in"
Success Criteria: "Clear visual narrative that drives decision-making"
Stakeholder Impact: "Executives get digestible insights, teams get approval faster"
```

**Concept Node:**
```
Purpose: "Define and document key business concepts and definitions"
Business Value: "Ensures consistent understanding across teams"
Success Criteria: "All team members use consistent terminology"
Stakeholder Impact: "Reduces miscommunication, improves collaboration"
```

**Attachment Node:**
```
Purpose: "Link relevant documents and resources to project components"
Business Value: "Centralizes project knowledge and reduces context switching"
Success Criteria: "All team members can quickly find relevant resources"
Stakeholder Impact: "Faster onboarding, better informed decisions"
```

#### 2. Technical Context Layer (Collapsible - "Show Technical Properties")
**Universal Technical Fields (All Node Types):**
- **Implementation Framework**: Primary technology (React, Spring Boot, FastAPI)
- **Design Patterns**: Applicable patterns (Repository, MVC, Observer)
- **API Contract**: Endpoint, method, input/output schemas (when applicable)
- **Security Requirements**: Authentication, validation, authorization needs
- **Testing Strategy**: Unit, integration, e2e testing approaches

**Node-Specific Critical Technical Fields:**

**UseCase Node:**
- Business Logic Complexity: simple | moderate | complex
- Authentication Required: boolean
- Performance Targets: response time, throughput
- External Integrations: payment gateway, email service, etc.

**Screen Node:**
- Component Library: MaterialUI, Tailwind, Ant Design
- State Management: Redux, Zustand, Context API
- Form Validation: Yup, Zod, React Hook Form
- Responsive Design: boolean
- Accessibility Level: basic | wcag_aa | wcag_aaa

**Process Node:**
- Execution Type: synchronous | asynchronous | batch
- Resource Requirements: CPU intensive, memory heavy
- Retry Mechanism: strategy for failures
- Timeout Settings: maximum execution time

**Storage Node:**
- Database Technology: PostgreSQL, MongoDB, Redis
- Access Patterns: read_heavy, write_heavy, balanced
- Data Relationships: one-to-many, many-to-many
- Indexing Strategy: performance optimization

**Presentation Node:**
- Slide Template: keynote-style, technical-overview, executive-summary
- Auto-advance: boolean with duration settings
- Transition Effects: fade, slide, zoom, flip
- Export Format: PDF, PowerPoint, HTML

**Concept Node:**
- Documentation Framework: Wiki, Confluence, Notion, Markdown
- Knowledge Domain: business, technical, hybrid
- Reference Sources: internal docs, external standards
- Complexity Level: basic, intermediate, advanced, expert

**Attachment Node:**
- File Storage: local, cloud, CDN, version-controlled
- Access Control: public, internal, restricted, confidential
- Sync Strategy: manual, automatic, on-demand
- Preview Generation: thumbnails, metadata extraction

#### 3. Project Technical Configuration Panel
**New Section in Toolbar (Bottom Position):**
- Section: "⚙️ Project Technical Configuration"
- Button: "[🔧 Technical Settings]" - opens dedicated panel

**Panel Content - Critical Fields:**
```yaml
Architecture:
  Pattern: monolith | microservices | serverless | jamstack
  Deployment Model: cloud | on_premise | hybrid

Technology Stack:
  Frontend: [React, TypeScript, Tailwind]
  Backend: [Node.js, Express, Prisma]
  Database: [PostgreSQL, Redis]
  Infrastructure: [Docker, Kubernetes, AWS]

Code Standards:
  Linting: [ESLint, Prettier]
  Testing: [Jest, Cypress, Playwright]
  Documentation: JSDoc | Swagger | Storybook
```

### Design Requirements

#### 1. Progressive Disclosure UX
```
📋 Node Editing Experience:
┌─────────────────────────────────────────┐
│ 📝 Business Context (Always Visible)    │
│ ─────────────────────────────────────── │
│ Purpose: [User login functionality]     │
│ Business Value: [Secure customer access]│
│ Success Criteria: [99.9% login success] │
│ Stakeholder Impact: [Customers, Support]│
└─────────────────────────────────────────┘

▼ 🔧 Show Technical Properties

┌─────────────────────────────────────────┐
│ ⚙️ Technical Context (Collapsible)      │
│ ─────────────────────────────────────── │
│ Framework: [React + Express] (?)        │
│ Auth Method: [JWT] (?)                  │
│ API: [POST /auth/login] (?)             │
│ Security: [bcrypt, rate limiting] (?)   │
│ Testing: [Jest, Cypress] (?)            │
└─────────────────────────────────────────┘
```

#### 2. Contextual Help System
- **Info Icons (?)**: Next to each technical field
- **Hover/Click Help**: Contextual guidance for field completion
- **Placeholder Examples**: "Click ? for how to fill this field"

**Sample Help Content:**
```
Implementation Framework (?):
"Choose the main framework for this component:
• React - for interactive UIs
• Express - for REST APIs  
• FastAPI - for Python APIs
• Spring Boot - for Java services

This helps AI generate framework-specific code patterns."

Design Patterns (?):
"Common patterns that apply to this component:
• Repository - data access abstraction
• Observer - event-driven updates
• Factory - object creation
• Singleton - single instance services

Select patterns that best describe the intended behavior."
```

#### 3. Toolbar Layout Enhancement
```
┌─────────────────────────────────────────┐
│ 📝 Project Information                  │  ← Existing (business)
│ • Name, Description, Status             │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 🎯 Add Nodes                           │  ← Existing (core workflow)
│ [UseCase] [Screen] [User] [Process]     │
│ [Storage] [Controller] [Error]          │
│ [Presentation] [Concept] [Attachment]   │  ← NEW 3 node types
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ ⚡ Grid Options                         │  ← Existing (preferences)
│ [✓ Show Grid] [⚡ Snap to Grid]         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 🚀 Canvas Actions                       │  ← Existing (output)
│ Nodes: 5 | Connections: 3              │
│ [Export YAML] [Clear All]               │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ ⚙️ Project Technical Configuration      │  ← NEW (advanced setup)
│ ─────────────────────────────────────── │
│ [🔧 Technical Settings]                 │  ← Opens panel
└─────────────────────────────────────────┘
```

## Technical Implementation

### Phase 1: Business Context Layer (Sprint 1)

#### 1.1 Enhanced Data Model
```typescript
// New interface for business context
interface BusinessContext {
  purpose: string              // "Allow users to login securely"
  businessValue: string        // "Reduces support calls"
  successCriteria: string      // "99.9% login success rate"
  stakeholderImpact: string    // "Customers get secure access"
}

// Enhanced BaseNode
interface EnhancedBaseNode extends BaseNode {
  businessContext: BusinessContext
  technicalContext?: TechnicalContext  // Phase 2
}
```

#### 1.2 Node Type Extensions
```typescript
// Extend each node type with business context
interface EnhancedUseCaseNode extends UseCaseNode {
  businessContext: BusinessContext
  // Keep existing properties for backward compatibility
}

interface EnhancedScreenNode extends ScreenNode {
  businessContext: BusinessContext
  // Keep existing properties for backward compatibility
}

// Apply to all 10 node types: UseCase, Screen, User, Process, Storage, Controller, Error, Presentation, Concept, Attachment
```

#### 1.3 UI Components Enhancement
**Files to Modify:**
- `src/components/panels/EditorPanel.tsx` - Add business context section
- `src/types/index.ts` - Add new interfaces
- `src/stores/nodeStore.ts` - Update node creation/update logic

### Phase 2: Collapsible Technical Layer (Sprint 2)

#### 2.1 Technical Context Data Model
```typescript
interface TechnicalContext {
  // Universal fields (all node types)
  implementationFramework?: string    // "React", "Express", "FastAPI"
  designPatterns?: string[]          // ["Repository", "MVC"]
  apiContract?: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
    endpoint?: string                // "/api/auth/login"
    inputSchema?: object
    outputSchema?: object
  }
  securityRequirements?: string[]    // ["authentication", "validation"]
  testingStrategy?: string[]         // ["unit", "integration", "e2e"]
  
  // Node-specific fields (varying by type)
  nodeSpecificContext?: Record<string, unknown>
}

// Node-specific technical contexts
interface UseCaseTechnicalContext {
  businessLogicComplexity?: 'simple' | 'moderate' | 'complex'
  authenticationRequired?: boolean
  performanceTargets?: string
  externalIntegrations?: string[]
}

interface ScreenTechnicalContext {
  componentLibrary?: string          // "MaterialUI", "Tailwind"
  stateManagement?: string          // "Redux", "Zustand"
  formValidation?: string           // "Yup", "Zod"
  responsiveDesign?: boolean
  accessibilityLevel?: 'basic' | 'wcag_aa' | 'wcag_aaa'
}

interface PresentationTechnicalContext {
  slideTemplate?: string            // "keynote-style", "technical-overview"
  autoAdvance?: boolean
  transitionEffects?: string        // "fade", "slide", "zoom"
  exportFormat?: string[]           // ["PDF", "PowerPoint", "HTML"]
}

interface ConceptTechnicalContext {
  documentationFramework?: string   // "Wiki", "Confluence", "Notion"
  knowledgeDomain?: 'business' | 'technical' | 'hybrid'
  referenceSources?: string[]       // ["internal_docs", "external_standards"]
  complexityLevel?: 'basic' | 'intermediate' | 'advanced' | 'expert'
}

interface AttachmentTechnicalContext {
  fileStorage?: string              // "local", "cloud", "CDN"
  accessControl?: 'public' | 'internal' | 'restricted' | 'confidential'
  syncStrategy?: string             // "manual", "automatic", "on-demand"
  previewGeneration?: boolean       // thumbnails, metadata extraction
}

// Continue for Process, Storage, Controller, Error, User, Presentation, Concept, Attachment nodes
```

#### 2.2 Collapsible UI Implementation
```tsx
// Enhanced EditorPanel with collapsible sections
const [showTechnicalProperties, setShowTechnicalProperties] = useState(false)

return (
  <div className="space-y-4">
    {/* Business Context - Always Visible */}
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Business Context</h3>
      <PropertyField
        label="Purpose"
        value={node.businessContext.purpose}
        onChange={(value) => updateNode(node.id, { 
          businessContext: { ...node.businessContext, purpose: value }
        })}
        placeholder="What does this component do?"
      />
      {/* Additional business fields */}
    </div>

    {/* Technical Context - Collapsible */}
    <div className="border-t pt-4">
      <button
        onClick={() => setShowTechnicalProperties(!showTechnicalProperties)}
        className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary"
      >
        {showTechnicalProperties ? '▼' : '▶'} 🔧 Show Technical Properties
      </button>
      
      {showTechnicalProperties && (
        <div className="mt-3 space-y-3 pl-4 border-l-2 border-surface-border">
          <PropertyField
            label="Implementation Framework"
            value={node.technicalContext?.implementationFramework || ''}
            onChange={(value) => updateTechnicalContext('implementationFramework', value)}
            placeholder="React, Express, FastAPI..."
            helpText="Choose the main framework for this component"
          />
          {/* Additional technical fields based on node type */}
        </div>
      )}
    </div>
  </div>
)
```

#### 2.3 Contextual Help System
```tsx
// Enhanced PropertyField with help icon
interface PropertyFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  helpText?: string  // New prop
  helpDetail?: string  // New prop for detailed help
}

const PropertyField: React.FC<PropertyFieldProps> = ({ 
  label, value, onChange, placeholder, helpText, helpDetail 
}) => {
  const [showHelp, setShowHelp] = useState(false)
  
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-text-primary">{label}</label>
        {helpText && (
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="w-4 h-4 rounded-full bg-surface-secondary text-text-muted hover:bg-surface-tertiary flex items-center justify-center text-xs"
            title="Click for help"
          >
            ?
          </button>
        )}
      </div>
      
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-gray-100 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
      />
      
      {showHelp && helpDetail && (
        <div className="text-xs text-text-secondary bg-surface-secondary p-2 rounded border">
          {helpDetail}
        </div>
      )}
    </div>
  )
}
```

### Phase 3: Project Technical Configuration Panel (Sprint 2)

#### 3.1 Enhanced ProjectState
```typescript
interface ProjectTechnicalContext {
  architecture: {
    pattern: 'monolith' | 'microservices' | 'serverless' | 'jamstack'
    deploymentModel: 'cloud' | 'on_premise' | 'hybrid'
  }
  technologyStack: {
    frontend: string[]      // ["React", "TypeScript", "Tailwind"]
    backend: string[]       // ["Node.js", "Express", "Prisma"]
    database: string[]      // ["PostgreSQL", "Redis"]
    infrastructure: string[] // ["Docker", "Kubernetes", "AWS"]
  }
  codeStandards: {
    linting: string[]       // ["ESLint", "Prettier"]
    testing: string[]       // ["Jest", "Cypress", "Playwright"]
    documentation: string   // "JSDoc" | "Swagger" | "Storybook"
  }
}

interface EnhancedProjectState extends ProjectState {
  technicalContext?: ProjectTechnicalContext
}
```

#### 3.2 Toolbar Enhancement
```tsx
// Add new section to Toolbar.tsx
{/* Project Technical Configuration - NEW SECTION */}
<div className="border-t border-surface-border pt-3">
  <h4 className="text-text-primary font-semibold mb-2 text-xs">Project Technical Configuration</h4>
  
  <button
    onClick={() => openPanel('project-settings')}
    className="w-full px-3 py-2 bg-surface-secondary text-text-secondary border border-surface-border hover:bg-surface-tertiary rounded text-sm font-medium transition-colors flex items-center gap-2"
    title="Configure project technical settings"
  >
    <span>🔧</span>
    Technical Settings
  </button>
</div>
```

#### 3.3 ProjectSettingsPanel Component
```tsx
// New component: src/components/panels/ProjectSettingsPanel.tsx
interface ProjectSettingsPanelProps {
  isOpen: boolean
  onClose: () => void
}

export const ProjectSettingsPanel: React.FC<ProjectSettingsPanelProps> = ({ isOpen, onClose }) => {
  const { project, updateProject } = useProjectStore()
  const [technicalContext, setTechnicalContext] = useState<ProjectTechnicalContext>(
    project.technicalContext || getDefaultTechnicalContext()
  )

  const handleSave = () => {
    updateProject({ technicalContext })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-surface-primary border border-surface-border rounded-lg shadow-xl w-[600px] max-h-[80vh] overflow-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-text-primary">⚙️ Project Technical Configuration</h2>
            <button onClick={onClose} className="text-text-muted hover:text-text-primary">✕</button>
          </div>

          {/* Architecture Section */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-3">🏗️ Architecture</h3>
              <div className="space-y-3">
                <PropertyField
                  label="Pattern"
                  value={technicalContext.architecture.pattern}
                  onChange={(value) => setTechnicalContext(prev => ({
                    ...prev,
                    architecture: { ...prev.architecture, pattern: value as any }
                  }))}
                  helpText="Overall architecture approach"
                  helpDetail="• Monolith - Single deployable unit\n• Microservices - Independent services\n• Serverless - Function-based\n• JAMstack - Static site with APIs"
                />
                {/* Additional architecture fields */}
              </div>
            </div>

            {/* Technology Stack Section */}
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-3">🔧 Technology Stack</h3>
              {/* Frontend, Backend, Database, Infrastructure fields */}
            </div>

            {/* Code Standards Section */}
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-3">📋 Code Standards</h3>
              {/* Linting, Testing, Documentation fields */}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-surface-border">
            <button
              onClick={onClose}
              className="px-4 py-2 text-text-secondary hover:text-text-primary transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-accent-primary text-white rounded hover:bg-accent-primary/90 transition-colors"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
```

### Phase 4: Enhanced YAML Export (Sprint 3)

#### 4.1 Enhanced Export Structure
```yaml
# Enhanced YAML with business/technical layers
project:
  name: "Customer Portal"
  description: "Self-service customer account management"
  version: "1.0.0"
  
  # NEW: Business summary
  business_context:
    primary_value: "Reduce customer service load by 60%"
    key_stakeholders: ["customers", "support_team", "product_managers"]
    success_metrics: ["customer_satisfaction", "support_ticket_reduction"]
  
  # NEW: Technical architecture
  technical_architecture:
    pattern: "microservices"
    deployment_model: "cloud"
    technology_stack:
      frontend: ["React", "TypeScript", "Tailwind"]
      backend: ["Node.js", "Express", "Prisma"]
      database: ["PostgreSQL", "Redis"]

architecture:
  nodes:
    - id: "user_login"
      type: "usecase"
      
      # Business layer (always present)
      business_context:
        purpose: "Allow users to access their accounts securely"
        business_value: "Reduces support calls and protects customer data"
        success_criteria: "99.9% login success rate under 10 seconds"
        stakeholder_impact: "Customers get secure access, support gets fewer password resets"
      
      # Technical layer (when available)
      technical_context:
        implementation_framework: "React + Express"
        design_patterns: ["Repository", "JWT_Auth"]
        api_contract:
          method: "POST"
          endpoint: "/auth/login"
          input_schema: { email: "string", password: "string" }
          output_schema: { token: "string", user: "object" }
        security_requirements: ["bcrypt", "rate_limiting", "input_validation"]
        testing_strategy: ["unit", "integration", "e2e"]
        
        # UseCase-specific technical fields
        business_logic_complexity: "moderate"
        authentication_required: true
        performance_targets: "< 200ms response time"
        external_integrations: ["email_service"]

# Enhanced AI generation hints
ai_generation_hints:
  business_priority: "security_and_user_experience"
  technical_complexity: "moderate"
  implementation_patterns: ["jwt_authentication", "input_validation", "error_handling"]
  code_generation_focus: ["security", "performance", "user_experience"]
```

#### 4.2 Smart Export Logic
```typescript
// Enhanced yamlExport.ts
export function exportToEnhancedYAML(
  nodes: RecapMapNode[],
  connections: NodeConnection[],
  project: EnhancedProjectState,
  validation: ValidationResult,
  options: YAMLExportOptions
): string {
  const yamlSpec: EnhancedYAMLProjectSpec = {
    project: {
      // Existing project fields
      ...project,
      
      // NEW: Business context summary
      business_context: generateBusinessSummary(nodes),
      
      // NEW: Technical architecture (when available)
      ...(project.technicalContext && {
        technical_architecture: project.technicalContext
      })
    },
    
    architecture: {
      nodes: nodes.map(node => ({
        // Existing node fields
        id: node.id,
        type: node.type,
        
        // NEW: Business context (always present)
        business_context: node.businessContext,
        
        // NEW: Technical context (when available)
        ...(node.technicalContext && {
          technical_context: node.technicalContext
        })
      })),
      
      connections: connections.map(enhanceConnectionWithContext)
    },
    
    // Enhanced AI hints
    ai_generation_hints: generateEnhancedAIHints(nodes, project, options)
  }
  
  return stringifyEnhancedYAML(yamlSpec, options)
}
```

## Implementation Strategy

### Sprint 1: Business Context Foundation
**Week 1-2: Core Data Model & Basic UI**
1. Create `BusinessContext` interface and extend node types
2. Add business context section to EditorPanel
3. Update nodeStore for business context handling
4. Basic business context fields for all 10 node types (including Presentation, Concept, Attachment)

### Sprint 2: Technical Layer & Project Settings
**Week 3-4: Advanced Features**
1. Create `TechnicalContext` interface and extend node types
2. Implement collapsible technical properties UI
3. Build ProjectSettingsPanel component
4. Add project technical configuration section to Toolbar
5. Implement contextual help system with (?) icons

### Sprint 3: Enhanced Export & Polish
**Week 5-6: Integration & Export**
1. Enhance YAML export with business/technical layers
2. Add smart export logic for conditional depth
3. Create enhanced AI generation hints
4. Testing, documentation, and refinements

## Success Criteria

### Functional Success
- [ ] Business context fields available on all 10 node types (including Presentation, Concept, Attachment)
- [ ] Technical properties collapsible and contextual for all 10 node types
- [ ] Project technical configuration panel functional
- [ ] Enhanced YAML export with business/technical layers
- [ ] Contextual help system operational
- [ ] All existing functionality preserved

### User Experience Success
- [ ] **Business Users**: Can capture requirements without technical overwhelm
- [ ] **Developers**: Can add technical details for comprehensive AI generation
- [ ] **Progressive Disclosure**: Complex information hidden until needed
- [ ] **Intuitive Navigation**: Logical information hierarchy and placement

### Technical Success
- [ ] **Backward Compatibility**: Existing projects continue to work
- [ ] **Performance**: No impact on application responsiveness
- [ ] **Data Integrity**: Business and technical contexts properly persisted
- [ ] **Export Quality**: YAML suitable for any AI/Copilot code generation

## Files to Modify

### Phase 1: Business Context Layer
- `src/types/index.ts` - Add BusinessContext interface
- `src/components/panels/EditorPanel.tsx` - Add business context UI
- `src/stores/nodeStore.ts` - Update node creation/update logic
- `src/stores/projectStore.ts` - Update project state for enhanced export

### Phase 2: Technical Layer & Project Settings
- `src/types/index.ts` - Add TechnicalContext interfaces
- `src/components/panels/EditorPanel.tsx` - Add collapsible technical section
- `src/components/Toolbar.tsx` - Add project technical configuration section
- `src/components/panels/ProjectSettingsPanel.tsx` - NEW: Project settings panel
- `src/components/PropertyField.tsx` - Enhance with contextual help
- `src/stores/uiStore.ts` - Add project-settings panel type

### Phase 3: Enhanced Export
- `src/utils/yamlExport.ts` - Enhance export with business/technical layers
- `src/types/index.ts` - Add enhanced YAML specification interfaces

## Dependencies & Considerations

### Technical Dependencies
- ✅ Existing panel system (reuse for ProjectSettingsPanel)
- ✅ Existing property field components (enhance for help system)
- ✅ Existing YAML export infrastructure (extend for enhanced export)
- ✅ Existing store architecture (extend for business/technical contexts)

### UX Dependencies
- ✅ Existing toolbar layout (add new section at bottom)
- ✅ Existing property panel patterns (extend with collapsible sections)
- ✅ Existing color scheme and design tokens

### Data Migration
- **Backward Compatibility**: Existing nodes work without business context (show defaults)
- **Graceful Degradation**: YAML export works with or without technical context
- **Progressive Enhancement**: Users can add business/technical details over time

## Future Enhancements (Post-MVP)

### Phase 5: AI-Assisted Technical Field Population
- Template suggestions based on business context
- Auto-fill technical fields from project settings
- Pattern recognition from existing projects

### Phase 6: Advanced Code Generation
- Framework-specific code templates
- Implementation roadmap generation
- Cross-cutting concern detection

### Phase 7: Collaboration Features
- Business/technical context approval workflows
- Comment system for technical decisions
- Change tracking for business requirements

---

**This task creates the foundation for universal AI code generation by separating business and technical concerns while maintaining a clean, progressive disclosure user experience.**
