# Technical Architecture Decisions

**Last Updated**: June 8, 2025  
**Purpose**: Core technology stack and architectural patterns for RecapMap

## Architecture Philosophy

### Lean Dependency Strategy
- **Minimal Packages**: 5 core packages only for security and maintainability
- **Zero Trust Frontend**: Business logic protected in Java backend
- **Migration Ready**: React as stepping stone to Unity production platform

### Technology Evolution Path
```
Phase 1A: React MVP → Phase 1B: Java Backend → Phase 2: Unity + Java
```

## Current Technology Stack

### Frontend (Phase 1A - React MVP)
- **React 18+ with TypeScript 5+** - Rapid prototyping and enterprise demos
- **@xyflow/react** - Visual node-based canvas (core requirement)
- **Zustand** - Lightweight state management
- **TailwindCSS** - Utility-first styling system
- **Vite** - Fast build tool and development server

**Rationale**: 
- React enables quick validation and web-based demos
- TypeScript patterns translate well to Unity C#
- Minimal dependencies reduce attack surface and migration complexity

### Backend (Phase 1B - Target)
- **Java Spring Boot** - Enterprise-grade backend services
- **OpenAPI/JSON Schema** - Contract-first API development
- **MongoDB/AuraDB** - Document and graph data storage
- **YAML Generation** - Structured AI task descriptions

**Rationale**:
- Java provides enterprise security and scalability
- Backend handles all business logic and YAML generation
- Frontend becomes pure presentation layer

### Target Platform (Phase 2)
- **Unity + C#** - Native performance and professional visual tools
- **Java Backend** - Maintained for enterprise requirements
- **Single Codebase** - Cross-platform deployment

## Key Architectural Decisions

### 1. No Framework Selection for Users
**Decision**: Users describe business requirements, not technical implementation  
**Impact**: Screen nodes specify WHAT interface is needed, not HOW to implement it  
**Benefit**: Platform handles all technical translation via AI

### 2. Business Logic in Backend
**Decision**: All YAML generation and business rules server-side  
**Impact**: Frontend is stateless presentation layer  
**Benefit**: Security, scalability, and easier Unity migration

### 3. 8-Node System as Universal Language
**Decision**: Fixed vocabulary for all business applications  
**Impact**: Complete coverage without framework complexity  
**Benefit**: Perfect AI translation and visual clarity

### 4. Contract-First Development
**Decision**: TypeScript types become OpenAPI schemas become Java POJOs  
**Impact**: Consistent data models across all layers  
**Benefit**: Type safety and automated code generation

## Migration Strategy

### React to Unity Transition
- **State Management**: Zustand patterns → Unity ScriptableObjects
- **Component Architecture**: React components → Unity prefabs  
- **Styling**: TailwindCSS concepts → Unity UI styling
- **Business Logic**: Already separated in Java backend

### Benefits of Unity Target
- **Professional Visual Tools**: Native drag/drop, advanced graphics
- **Single Codebase**: Desktop, mobile, web from one source
- **No NPM Dependencies**: Eliminates JavaScript ecosystem complexity
- **Enterprise Performance**: Native speed and memory management

## Quality Assurance

### Testing Strategy
- **Unit Tests**: 60+ tests with 100% critical path coverage
- **Integration Tests**: End-to-end workflow validation
- **Type Safety**: Full TypeScript coverage prevents runtime errors

### Code Quality
- **ESLint + Prettier**: Consistent code formatting
- **Vitest**: Fast test runner with good VS Code integration
- **Strict TypeScript**: No implicit any, strict null checks

## Security Considerations

- **Minimal Attack Surface**: 5 packages vs typical 500+ in React apps
- **Zero Trust Frontend**: No business logic in client code
- **Backend Validation**: All user input validated server-side
- **Contract Enforcement**: OpenAPI schemas ensure data integrity
