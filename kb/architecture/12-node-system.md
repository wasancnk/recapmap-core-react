# 12-Node Universal System Architecture

**Last Updated**: June 11, 2025  
**Purpose**: Complete business collaboration vocabulary for RecapMap Operating System

## Overview

The 12-node universal system provides a **complete vocabulary** for describing any business collaboration project through visual modeling. This universal language ensures that complex collaborative efforts can be captured visually and translated perfectly into actionable outcomes by both humans and AI systems.

## Architecture Philosophy

The 12-node system is organized into 5 logical groups that cover the complete spectrum of business collaboration:

### Design Principles
1. **Universal Coverage**: Every aspect of business collaboration has a corresponding node type
2. **Human-AI Bridge**: Nodes serve as shared mental models for both human creativity and AI execution
3. **Logical Grouping**: Related concepts are grouped together for easier mental organization
4. **Future-Proof**: Architecture allows for expansion while maintaining core stability

## The Complete 12-Node System

### 🎯 Strategic Planning Nodes (4 nodes)
*High-level direction and outcomes*

#### 1. Use Case Node - Business Requirements Anchor
**Color**: Lime Green (#4d7c0f) | **Icon**: 🎯  
**Purpose**: Top-level business requirements and user scenarios

**Properties**:
- priority: High/Medium/Low priority classification
- acceptance_criteria: Specific success conditions
- business_value: Expected business impact
- stakeholders: Key people involved
- success_metrics: Measurable outcomes

**Role**: Defines what needs to be accomplished at the highest level

#### 2. Task Node - Actionable Work Items
**Color**: Orange-Red (#ea580c) | **Icon**: ⚡  
**Purpose**: Specific, actionable work items and deliverables

**Properties**:
- task_type: Research/Development/Testing/Documentation
- assigned_to: Human team member or AI agent
- deadline: Target completion date
- dependencies: Required predecessor tasks
- effort_estimate: Time/complexity estimation

**Role**: Breaks down use cases into executable work units

#### 3. Expectation Node - Success Criteria
**Color**: Orange (#f59e0b) | **Icon**: 🎯  
**Purpose**: What we expect to achieve or receive

**Properties**:
- expectation_type: Outcome/Deliverable/Performance/Quality
- measurable_criteria: Specific success metrics
- validation_method: How success will be verified
- timeline: When expectation should be met
- responsible_party: Who is accountable

**Role**: Sets clear success criteria and accountability

#### 4. Outcome Node - Actual Results
**Color**: Sky Blue (#0ea5e9) | **Icon**: ✅  
**Purpose**: Actual results and achievements

**Properties**:
- outcome_type: Success/Partial/Failure/Learning
- actual_results: What was actually achieved
- variance_analysis: Difference from expectations
- lessons_learned: Key insights gained
- next_actions: Follow-up steps required

**Role**: Captures what actually happened for learning and improvement

### 👥 Human-Centered Design Nodes (3 nodes)
*User experience and human interaction*

#### 5. Persona Node - Human Stakeholders
**Color**: Orange (#f59e0b) | **Icon**: 👤  
**Purpose**: User personas and stakeholder profiles

**Properties**:
- role: Job title or function
- permissions: Access levels and capabilities
- goals: What they want to achieve
- pain_points: Current challenges
- interaction_patterns: How they work

**Role**: Ensures human needs drive design decisions

#### 6. Screen Node - User Interface
**Color**: Green (#10b981) | **Icon**: 📱  
**Purpose**: User interface components and screens

**Properties**:
- screen_type: Dashboard/Form/List/Detail/Modal
- layout_type: Grid/Flex/Responsive design
- components: UI elements and interactions
- accessibility: WCAG compliance features
- navigation_flow: How users move between screens

**Role**: Defines the user experience interface

#### 7. Presentation Node - Communication Materials
**Color**: Indigo (#4f46e5) | **Icon**: 📽️  
**Purpose**: Presentation slides and demo materials

**Properties**:
- presentation_type: Demo/Training/Proposal/Status
- audience: Target viewers
- key_messages: Main points to communicate
- visual_assets: Required graphics/media
- duration: Expected presentation length

**Role**: Facilitates stakeholder communication and alignment

### ⚙️ Business Workflow Nodes (2 nodes)
*Operational processes and data*

#### 8. Process Node - Business Operations
**Color**: Purple (#8b5cf6) | **Icon**: ⚙️  
**Purpose**: Business processes and workflow steps

**Properties**:
- process_type: Sequential/Parallel/Conditional/Loop
- input_requirements: What's needed to start
- output_deliverables: What gets produced
- business_rules: Decision logic and constraints
- automation_potential: Steps suitable for AI/automation

**Role**: Defines how work flows through the system

#### 9. Storage Node - Data Persistence
**Color**: Yellow (#eab308) | **Icon**: 💾  
**Purpose**: Data storage and persistence layers

**Properties**:
- storage_type: Database/File/Cache/API/Cloud
- data_schema: Structure and relationships
- access_patterns: How data is read/written
- security_requirements: Encryption/access controls
- backup_strategy: Data protection approach

**Role**: Ensures data integrity and accessibility

### 📚 Information & Assets Nodes (2 nodes)
*Knowledge and resource management*

#### 10. Resource Node - Digital Assets
**Color**: Pink (#ec4899) | **Icon**: 📎  
**Purpose**: Files, documents, and external resources

**Properties**:
- resource_type: Document/Image/Video/Code/API
- access_method: URL/File path/API endpoint
- permissions: Who can access/modify
- version_control: Change tracking approach
- integration_method: How it connects to the system

**Role**: Manages external dependencies and assets

#### 11. Knowledge Node - Structured Information
**Color**: Gray (#6b7280) | **Icon**: 🧠  
**Purpose**: Knowledge base and learning materials

**Properties**:
- knowledge_type: Documentation/Tutorial/Best Practice/Lesson Learned
- complexity_level: Beginner/Intermediate/Advanced
- prerequisites: Required background knowledge
- maintenance_schedule: When to review/update
- application_context: When to use this knowledge

**Role**: Captures and organizes institutional knowledge

### 🔧 Meta-Collaboration Tools Nodes (1 node)
*Communication and coordination*

#### 12. Note Node - General Documentation
**Color**: Cyan (#06b6d4) | **Icon**: 📝  
**Purpose**: General notes, comments, and annotations

**Properties**:
- note_type: Comment/Idea/Question/Decision/Reminder
- visibility: Public/Private/Team/Stakeholder-specific
- created_by: Author information
- related_nodes: Connected concepts
- action_required: Follow-up needed

**Role**: Provides flexible communication and documentation

## Implementation Architecture

### Node Relationships
- **Hierarchical**: Use Cases contain Tasks, which produce Outcomes
- **Functional**: Personas interact with Screens through Processes
- **Informational**: Resources support Knowledge, which informs all other nodes
- **Collaborative**: Notes can annotate any other node type

### Color System Strategy
Each node group has a distinct color family:
- **Strategic Planning**: Green to Blue spectrum (growth and success)
- **Human-Centered Design**: Orange to Purple spectrum (human warmth to creativity)
- **Business Workflow**: Purple to Yellow spectrum (logic to data)
- **Information & Assets**: Pink to Gray spectrum (resources to knowledge)
- **Meta-Collaboration**: Cyan (communication and clarity)

### TypeScript Implementation
```typescript
export type NodeType = 
  // Strategic Planning
  | 'usecase' | 'task' | 'expectation' | 'outcome'
  // Human-Centered Design  
  | 'persona' | 'screen' | 'presentation'
  // Business Workflow
  | 'process' | 'storage'
  // Information & Assets
  | 'resource' | 'knowledge'
  // Meta-Collaboration Tools
  | 'note';
```

## Migration from Previous Systems

### From 8-Node to 12-Node System
**Renamed Nodes**:
- `user` → `persona` (better reflects stakeholder focus)
- `attachment` → `resource` (clearer purpose definition)

**Removed Nodes**:
- `controller` (functionality merged into `process`)
- `error` (replaced by outcome variance tracking)
- `concept` (replaced by `knowledge` and `note`)

**Added Nodes**:
- `task` (explicit work breakdown)
- `expectation` (clear success criteria)
- `outcome` (actual results tracking)
- `knowledge` (structured learning)

### Benefits of the New System
1. **Complete Coverage**: Every aspect of business collaboration is represented
2. **Clear Separation**: Each node has a distinct, non-overlapping purpose
3. **Logical Grouping**: Related concepts are grouped for easier understanding
4. **AI-Friendly**: Structured enough for AI processing, flexible enough for human creativity
5. **Scalable**: Can handle simple projects to complex enterprise initiatives

## Usage Guidelines

### When to Use Each Node Type
- Start with **Use Case** to define the overall goal
- Break down into **Tasks** for execution planning
- Set **Expectations** for success criteria
- Track **Outcomes** for learning and improvement
- Define **Personas** for human-centered design
- Create **Screens** for user interaction
- Build **Presentations** for stakeholder communication
- Map **Processes** for workflow optimization
- Plan **Storage** for data management
- Link **Resources** for external dependencies
- Capture **Knowledge** for learning
- Add **Notes** for flexible communication

### Best Practices
1. **Start Simple**: Begin with Use Case and Task nodes
2. **Think Human-First**: Consider Persona needs in every decision
3. **Document Outcomes**: Always track what actually happened
4. **Connect Related Nodes**: Use relationships to show dependencies
5. **Regular Reviews**: Update Knowledge and Notes based on Outcomes

## Future Evolution

The 12-node system is designed to be stable and complete, but can evolve:
- **Specialization**: Subtypes within existing nodes (e.g., different Task types)
- **Integration**: New relationship types between nodes
- **Automation**: AI agents assigned to specific node types
- **Domain Extensions**: Industry-specific property sets

This architecture provides the foundation for RecapMap to serve as a true Collaboration Operating System, bridging human creativity with AI execution capabilities.
