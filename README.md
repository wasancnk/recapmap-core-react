# RecapMap Core - React Application

A React + TypeScript + Vite application for visualizing and managing business models through interactive node-based diagrams.

## 🎯 Overview

RecapMap is a professional diagramming tool designed for business modeling, system architecture visualization, and process mapping. Built with modern web technologies and optimized for developer productivity.

### Key Features
- **8-Node System**: Specialized node types (Use Case, Screen, User, Process, Storage, Controller, Error, Integration)
- **Interactive Canvas**: Drag-and-drop interface with smart grid snapping
- **Dark Theme**: Developer-optimized visual design with accessibility compliance
- **Export Capabilities**: YAML and visual export formats
- **Real-time Updates**: Zustand-powered state management for instant feedback

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
│   ├── 8-node-system.md
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
- **Professional Color Palette** - 8-node semantic color coding

## 🎨 Design Philosophy

RecapMap follows a **developer-first design approach**:
- **Dark Theme Optimized** - Reduced eye strain for extended use
- **Semantic Color Coding** - Each node type has logical, memorable colors
- **WCAG 2.1 AA Compliant** - Accessible for all users
- **Professional Aesthetics** - Enterprise-ready visual design

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
- **Architecture Guide**: `kb/architecture/8-node-system.md`
- **Design System**: `kb/design/design-system.md`
- **Setup Guide**: `kb/development/project-setup.md`

---

**Remember**: Always document in `kb/` folder structure. Keep the knowledge base current and organized for future developers and AI assistants.
