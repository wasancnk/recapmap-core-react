# Project Setup Guide

## Overview
RecapMap is built using React + TypeScript + Vite with a minimal dependency strategy for security and maintainability. This guide covers project setup, development workflow, and testing.

## Prerequisites
- **Node.js 18+** with npm/yarn
- **VS Code** (recommended) with TypeScript and React extensions
- **Git** for version control

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Run Tests
```bash
npm run test
npm run test:ui          # Visual test runner
npm run test:coverage    # Coverage report
```

### 4. Build for Production
```bash
npm run build
npm run preview          # Preview production build
```

## Project Structure

### Core Architecture
```
src/
├── components/          # React components
│   ├── nodes/          # Node-specific components
│   └── panels/         # Panel system components
├── stores/             # Zustand state management
│   ├── nodeStore.ts    # Node and connection management
│   ├── uiStore.ts      # UI state and panels
│   └── projectStore.ts # Project lifecycle
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── __tests__/          # Test files
```

### Technology Stack
- **React 18+** - UI framework
- **TypeScript 5+** - Type safety
- **@xyflow/react** - Visual node canvas
- **Zustand** - State management
- **TailwindCSS** - Styling system
- **Vite** - Build tool and dev server

## Development Workflow

### State Management
The application uses Zustand with three main stores:

```typescript
// Node management
const { nodes, connections, addNode, updateNode } = useNodeStore()

// UI state and panels
const { canvas, panels, openPanel, closePanel } = useUIStore()

// Project lifecycle
const { project, validateProject, exportProject } = useProjectStore()
```

### Adding New Features
1. **Define TypeScript types** in `src/types/index.ts`
2. **Update store actions** if state management is needed
3. **Create components** with proper props and error handling
4. **Write tests** for critical functionality
5. **Update documentation** as needed

### Testing Strategy
- **Unit Tests**: Component logic and store actions
- **Integration Tests**: Full workflows and user interactions  
- **Type Safety**: Full TypeScript coverage prevents runtime errors

Test files use Vitest with React Testing Library:
```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

describe('Component', () => {
  it('should render correctly', () => {
    render(<Component />)
    expect(screen.getByText('Expected')).toBeInTheDocument()
  })
})
```

## Code Quality Standards

### ESLint Configuration
```javascript
// eslint.config.js - Strict TypeScript rules
export default tseslint.config({
  extends: [js.configs.recommended, ...tseslint.configs.recommended],
  rules: {
    ...reactHooks.configs.recommended.rules,
    'react-refresh/only-export-components': ['warn'],
  }
})
```

### TypeScript Configuration
- **Strict mode**: `strict: true` in tsconfig.json
- **No implicit any**: All types must be explicit
- **Null safety**: Strict null checks enabled

### Styling Guidelines
- **TailwindCSS only**: No custom CSS files
- **Component classes**: Use utility classes consistently
- **Design system**: Follow established color and spacing tokens

## Testing Commands

### Basic Testing
```bash
npm run test                 # Run all tests
npm run test:ui             # Visual test interface
npm run test:coverage       # Generate coverage report
```

### Advanced Testing
```bash
npm run test -- --watch     # Watch mode for development
npm run test -- --reporter=verbose  # Detailed output
```

### Coverage Thresholds
- **Lines**: 70% minimum
- **Functions**: 70% minimum  
- **Branches**: 70% minimum
- **Statements**: 70% minimum

## Build and Deployment

### Development Build
```bash
npm run dev        # Start development server with HMR
```

### Production Build
```bash
npm run build      # TypeScript compilation + Vite build
npm run preview    # Preview production build locally
```

### Linting
```bash
npm run lint       # ESLint check and auto-fix
```

## Environment Variables
```bash
# Development
VITE_LOG_LEVEL=debug

# Production
VITE_LOG_LEVEL=error
```

## VS Code Integration

### Recommended Extensions
- TypeScript and JavaScript Language Features
- React Code Snippets
- Tailwind CSS IntelliSense
- ESLint
- Vitest

### Debug Configuration
VS Code tasks configured in `.vscode/tasks.json`:
- **Build Project**: `Ctrl+Shift+P` → "Run Build Task"

## Common Issues

### Import Errors
- Use absolute paths from `src/` root
- Ensure proper TypeScript paths in `tsconfig.json`

### Test Failures
- Check test setup in `src/test-utils/setup.ts`
- Verify mock implementations match actual APIs

### Build Errors
- Clear `node_modules` and reinstall dependencies
- Check TypeScript compilation: `tsc --noEmit`

## Migration Notes

### React to Unity Path
Current React architecture designed for easy Unity migration:
- **State patterns** → Unity ScriptableObjects
- **Component structure** → Unity prefabs
- **Business logic** → Java backend (unchanged)

This ensures a smooth transition to the target Unity platform while maintaining development velocity.
