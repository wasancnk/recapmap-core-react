# RecapMap - Collaboration Operating System

## 🌍 The Heart of RecapMap

**RecapMap is more than a platform - it's humanity's answer to the mother of all problems: ineffective collaboration.**

Every major global challenge shares one root cause: our inability to collaborate effectively at scale. Climate change, unemployment, social inequality, innovation bottlenecks - they all persist because we can't coordinate human potential efficiently.

## 🎯 The Vision

While the world has created countless platforms (Miro, Figma, Notion, JIRA, Discord, Teams, etc.), we still struggle with the fundamental question: *"How can people collaborate better to solve problems together?"*

**RecapMap exists to:**
- **Break down collaboration silos** that fragment our efforts
- **Reduce operational costs** that kill collaborative initiatives  
- **Accelerate problem-solving** from ideation to impact
- **Unleash human potential** through seamless coordination

## 🧠 The Philosophy

### Collaboration as the Meta-Problem
- All 17 UN Sustainable Development Goals require effective collaboration
- Innovation, change, and progress depend on human coordination
- Current tools create more silos instead of eliminating them
- We need **collaboration infrastructure**, not just another tool

### AI-First + Human-First Architecture
RecapMap's **node-based system** serves as a universal language:
- **For Humans**: Visual, intuitive mind-mapping that matches natural thinking
- **For AI**: Structured data enabling maximum operational precision
- **Together**: Shared mental models that both can understand and manipulate

This creates the perfect bridge between human creativity and AI execution capability.

## 🚀 Technical Overview

A React + TypeScript + Vite application implementing the collaboration operating system through interactive node-based interfaces.

### Core Capabilities
- **Universal Node System**: Everything is a node - enabling both human understanding and AI precision
- **Collaboration Acceleration**: From discussion to impact in minutes, not months
- **Platform Consolidation**: Replace multiple scattered tools with one unified system
- **Operational Cost Reduction**: Eliminate the friction that kills collaborative projects
- **AI-Powered Insights**: Intelligent suggestions for optimal collaboration patterns

### Technical Features
- **12-Node Architecture**: Comprehensive node types (Use Case, Screen, Persona, Process, Resource, Storage, Task, Expectation, Outcome, Note, Presentation, Knowledge)
- **Interactive Canvas**: Drag-and-drop interface with smart grid snapping
- **Dark Theme**: Developer-optimized visual design with accessibility compliance
- **Export Capabilities**: YAML and visual export formats
- **Real-time Collaboration**: Zustand-powered state management for instant feedback

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Modern browser with ES6+ support

### Installation
```bash
npm install
npm run dev
```

### Build for Production
```bash
npm run build
npm run preview
```

### Testing
```bash
npm run test          # Run all tests
npm run test:watch    # Watch mode for development
npm run test:coverage # Generate coverage report
```

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── Canvas.tsx       # Main canvas component
│   ├── Toolbar.tsx      # Tool controls
│   ├── nodes/           # Node type components
│   └── panels/          # Property and editor panels
├── hooks/               # Custom React hooks
├── stores/              # Zustand state management
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
└── __tests__/           # Test files (co-located)

kb/                      # 📚 Knowledge Base (see below)
```

## 📚 Knowledge Base Guidelines

### 🔥 IMPORTANT FOR DEVELOPERS & AI ASSISTANTS

**ALL NEW DOCUMENTATION MUST BE CREATED IN THE `kb/` FOLDER STRUCTURE**

The `kb/` (Knowledge Base) folder contains our organized documentation system. When creating any new documentation, architectural decisions, design notes, or development guides:

### KB Structure
```
kb/
├── README.md              # KB overview and usage guide
├── architecture/          # System architecture & technical specs
│   ├── 12-node-system.md
│   ├── technical-decisions.md
│   └── api-contracts.md
├── design/               # UI/UX design system & standards
│   └── design-system.md
├── development/          # Development guides & best practices
│   ├── project-setup.md
│   └── testing-strategy.md
├── vision/               # Business strategy & platform vision
│   └── platform-overview.md
└── archive/              # Historical documentation
    └── unorganized/      # Previous unstructured docs
```

### Documentation Rules
1. **Never create documentation outside kb/ folder**
2. **Choose the correct subfolder** based on content type:
   - `architecture/` - Technical architecture, API specs, system design
   - `design/` - UI/UX, color systems, component design
   - `development/` - Setup guides, coding standards, testing
   - `vision/` - Business strategy, user journeys, platform goals
3. **Use descriptive filenames** with kebab-case format
4. **Keep it concise** - Focus on essential information only
5. **Include examples** - TypeScript/React code snippets where helpful

### For AI Assistants (Copilot/Claude/etc.)
When asked to document anything about this project:
- ✅ Always create files in `kb/` subfolders
- ✅ Reference existing KB structure for consistency
- ✅ Consolidate related information into single documents
- ❌ Never create loose documentation files in root or src/
- ❌ Don't duplicate information already in KB

## 🛠️ Technology Stack

### Core Technologies
- **React 18** - UI framework with modern hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **TailwindCSS** - Utility-first styling
- **Zustand** - Lightweight state management

### Development & Testing
- **Vitest** - Fast unit testing framework
- **React Testing Library** - Component testing utilities
- **ESLint** - Code quality and style enforcement
- **PostCSS** - CSS processing and optimization

### Design & Visualization
- **React Flow** - Node-based diagram library
- **Custom Design System** - Dark theme with accessibility focus
- **Professional Color Palette** - 12-node semantic color coding

## 🎨 Design Philosophy

RecapMap embodies a **collaboration-first design approach**:

### Universal Mental Models
- **Node-Based Thinking** - Everything is connected, just like human thought
- **Visual Relationships** - Immediate understanding of complex collaborations
- **Semantic Clarity** - Each element has clear meaning and purpose
- **AI-Human Symbiosis** - Designed for both human intuition and AI precision

### Experience Principles
- **Reduce Cognitive Load** - One platform instead of context-switching chaos
- **Accelerate Understanding** - Visual collaboration patterns over abstract concepts
- **Enable Flow States** - Minimal friction from idea to implementation
- **Scale Human Potential** - Amplify what people can achieve together

### Technical Excellence
- **Dark Theme Optimized** - Reduced eye strain for extended collaborative sessions
- **WCAG 2.1 AA Compliant** - Accessible collaboration for all users
- **Professional Aesthetics** - Enterprise-ready for serious problem-solving

## 🧪 Testing Strategy

### Test Structure
- **Unit Tests** - Component and utility function testing
- **Integration Tests** - Cross-component workflow testing
- **Accessibility Tests** - WCAG compliance verification
- **Visual Regression** - UI consistency validation

### Coverage Requirements
- **Components**: 90%+ coverage for critical UI components
- **Business Logic**: 95%+ coverage for stores and utilities
- **Integration**: Complete user workflow coverage

## 📈 Development Workflow

### Branch Strategy
- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - Individual feature development

### Code Standards
- **TypeScript strict mode** - Full type safety
- **ESLint compliance** - Consistent code style
- **Component co-location** - Tests alongside components
- **Semantic commits** - Clear commit message format

## 🔄 State Management

### Zustand Stores
- **nodeStore** - Canvas nodes and connections
- **panelStore** - UI panel visibility and state
- **projectStore** - Project-level data and settings
- **uiStore** - Global UI state management

### Data Flow
1. User interactions → Store actions
2. Store updates → Component re-renders
3. Component changes → Canvas visualization updates

## 📦 Build & Deployment

### Production Build
```bash
npm run build        # Creates optimized dist/ folder
npm run preview      # Preview production build locally
```

### Environment Configuration
- **Development**: Hot reload, debug tools, expanded logging
- **Production**: Minified bundle, performance optimized, error boundaries

## 🤝 Contributing

### Development Setup
1. Read `kb/development/project-setup.md` for detailed setup
2. Follow `kb/development/testing-strategy.md` for testing guidelines
3. Reference `kb/design/design-system.md` for UI standards
4. Check `kb/architecture/` for technical decisions

### Documentation Requirements
- **All new features** must include KB documentation updates
- **Architectural changes** require `kb/architecture/` updates
- **UI changes** need `kb/design/` documentation
- **Process changes** go in `kb/development/`

## 📚 Additional Resources

- **Knowledge Base**: `kb/README.md` - Complete documentation index
- **Platform Vision**: `kb/vision/platform-overview.md` - The big picture strategy
- **Architecture Guide**: `kb/architecture/12-node-system.md` - Technical deep-dive
- **Design System**: `kb/design/design-system.md` - UI/UX principles
- **Setup Guide**: `kb/development/project-setup.md` - Development environment

## 🌟 Join the Mission

**We're not just building software - we're building the infrastructure for human collaboration.**

Every commit, every component, every feature brings us closer to a world where:
- Ideas become reality in minutes, not months
- Global problems get solved through coordinated human effort  
- Collaboration becomes humanity's superpower, not its bottleneck

---

*"The future belongs to those who can coordinate human potential at scale. RecapMap is that coordination layer."*

**Remember**: Always document in `kb/` folder structure. Keep the knowledge base current and organized for future developers and AI assistants.
