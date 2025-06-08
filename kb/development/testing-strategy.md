# Testing Strategy Guide

## Overview
RecapMap uses Vitest with React Testing Library for comprehensive test coverage. This guide covers testing patterns, best practices, and specific testing approaches for the node-based architecture.

## Testing Philosophy

### Test Pyramid Strategy
1. **Unit Tests (70%)**: Individual components and store actions
2. **Integration Tests (25%)**: Multi-component workflows
3. **End-to-End Tests (5%)**: Critical user journeys

### Testing Principles
- **User-Centric**: Test behavior users actually experience
- **Fast Feedback**: Tests run quickly during development
- **Reliable**: Tests are deterministic and don't flake
- **Maintainable**: Tests evolve with the codebase

## Test Structure

### Test Organization
```
src/__tests__/
├── components/          # Component unit tests
│   ├── nodes/          # Node-specific component tests
│   └── panels/         # Panel system tests
├── stores/             # Zustand store tests
├── hooks/              # Custom hook tests
├── utils/              # Utility function tests
└── integration/        # Cross-component tests
```

### Test File Naming
- `Component.test.tsx` - Component tests
- `store.test.ts` - Store action tests
- `utils.test.ts` - Utility function tests
- `Integration.test.tsx` - Multi-component tests

## Testing Patterns

### Component Testing
```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { NodeComponent } from '../NodeComponent'

describe('NodeComponent', () => {
  it('should render node with correct title', () => {
    const mockNode = {
      id: 'test-node',
      type: 'usecase',
      title: 'Test Use Case',
      description: 'Test description'
    }
    
    render(<NodeComponent node={mockNode} />)
    
    expect(screen.getByText('Test Use Case')).toBeInTheDocument()
    expect(screen.getByText('Test description')).toBeInTheDocument()
  })

  it('should handle node selection', () => {
    const onSelect = vi.fn()
    const mockNode = { id: 'test', type: 'usecase', title: 'Test' }
    
    render(<NodeComponent node={mockNode} onSelect={onSelect} />)
    
    fireEvent.click(screen.getByRole('button'))
    expect(onSelect).toHaveBeenCalledWith('test')
  })
})
```

### Store Testing
```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { useNodeStore } from '../stores/nodeStore'

describe('NodeStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useNodeStore.getState().clearSelection()
  })

  it('should add node with correct properties', () => {
    const store = useNodeStore.getState()
    
    const nodeId = store.addNode('usecase', { x: 100, y: 200 })
    
    const node = store.getNode(nodeId)
    expect(node).toBeDefined()
    expect(node?.type).toBe('usecase')
    expect(node?.position).toEqual({ x: 100, y: 200 })
  })

  it('should handle node connections', () => {
    const store = useNodeStore.getState()
    
    const node1 = store.addNode('usecase', { x: 0, y: 0 })
    const node2 = store.addNode('screen', { x: 100, y: 0 })
    
    store.addConnection(node1, node2, 'flow')
    
    const connections = store.getConnections()
    expect(connections).toHaveLength(1)
    expect(connections[0].sourceNodeId).toBe(node1)
    expect(connections[0].targetNodeId).toBe(node2)
  })
})
```

### Integration Testing
```typescript
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App } from '../App'

describe('Node Creation Workflow', () => {
  it('should create and configure node end-to-end', async () => {
    const user = userEvent.setup()
    
    render(<App />)
    
    // Create node
    await user.click(screen.getByText('Add Use Case'))
    expect(screen.getByText('Use Case')).toBeInTheDocument()
    
    // Open property panel
    await user.click(screen.getByRole('button', { name: /edit/i }))
    expect(screen.getByText('Node Properties')).toBeInTheDocument()
    
    // Update title
    const titleInput = screen.getByLabelText('Title')
    await user.clear(titleInput)
    await user.type(titleInput, 'Login Feature')
    
    // Save changes
    await user.click(screen.getByText('Save'))
    expect(screen.getByText('Login Feature')).toBeInTheDocument()
  })
})
```

## Mocking Strategies

### Store Mocking
```typescript
import { vi } from 'vitest'

// Mock Zustand store
vi.mock('../stores/nodeStore', () => ({
  useNodeStore: vi.fn(() => ({
    nodes: [],
    addNode: vi.fn(),
    updateNode: vi.fn(),
    deleteNode: vi.fn()
  }))
}))
```

### React Flow Mocking
```typescript
// Mock React Flow for component tests
vi.mock('@xyflow/react', () => ({
  ReactFlow: vi.fn(() => <div data-testid="react-flow" />),
  Background: vi.fn(() => null),
  Controls: vi.fn(() => null),
  Handle: vi.fn(() => null),
  Position: {
    Top: 'top',
    Right: 'right',
    Bottom: 'bottom',
    Left: 'left'
  }
}))
```

### API Mocking
```typescript
// Mock fetch for export/import tests
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ success: true })
  })
)
```

## Specific Testing Scenarios

### Node Panel System Testing
```typescript
describe('Node Panel System', () => {
  it('should open and manage multiple panels', () => {
    const { usePanelStore } = require('../stores/panelStore')
    const store = usePanelStore.getState()
    
    // Open summary panel
    store.openPanel('node-1', 'summary')
    expect(store.getNodePanels('node-1')).toHaveLength(1)
    
    // Open editor panel for same node
    store.openPanel('node-1', 'editor')
    expect(store.getNodePanels('node-1')).toHaveLength(2)
    
    // Close specific panel
    store.closePanel('node-1', 'summary')
    const panels = store.getNodePanels('node-1')
    expect(panels).toHaveLength(1)
    expect(panels[0].panelType).toBe('editor')
  })
})
```

### YAML Export Testing
```typescript
describe('YAML Export', () => {
  it('should export valid YAML structure', async () => {
    const { useProjectStore } = require('../stores/projectStore')
    const { useNodeStore } = require('../stores/nodeStore')
    
    // Setup test data
    const nodeStore = useNodeStore.getState()
    nodeStore.addNode('usecase', { x: 0, y: 0 })
    
    // Export project
    const projectStore = useProjectStore.getState()
    const yamlContent = await projectStore.exportProject({
      format: 'yaml',
      includePositions: true,
      includeMetadata: true
    })
    
    expect(yamlContent).toContain('project:')
    expect(yamlContent).toContain('nodes:')
    expect(yamlContent).toContain('usecase')
  })
})
```

### Validation Testing
```typescript
describe('Project Validation', () => {
  it('should validate node completeness', async () => {
    const { useProjectStore } = require('../stores/projectStore')
    const { useNodeStore } = require('../stores/nodeStore')
    
    // Create incomplete node
    const nodeStore = useNodeStore.getState()
    const nodeId = nodeStore.addNode('usecase', { x: 0, y: 0 })
    nodeStore.updateNode(nodeId, { title: '', description: '' })
    
    // Run validation
    const projectStore = useProjectStore.getState()
    const result = await projectStore.validateProject()
    
    expect(result.isValid).toBe(false)
    expect(result.errors).toHaveLength(1)
    expect(result.errors[0].message).toContain('has no title')
  })
})
```

## Test Utilities

### Custom Render Helper
```typescript
// src/test-utils/testHelpers.tsx
import { render as rtlRender } from '@testing-library/react'
import { ReactElement } from 'react'

export const render = (ui: ReactElement) => {
  return rtlRender(ui, {
    wrapper: ({ children }) => (
      <div data-testid="test-wrapper">
        {children}
      </div>
    )
  })
}
```

### Mock Data Generators
```typescript
// src/test-utils/mockData.ts
export const createMockNode = (overrides = {}) => ({
  id: 'test-node-1',
  type: 'usecase',
  title: 'Test Node',
  description: 'Test description',
  position: { x: 100, y: 200 },
  ...overrides
})

export const createMockProject = (overrides = {}) => ({
  id: 'test-project',
  name: 'Test Project',
  description: 'Test project description',
  version: '1.0.0',
  ...overrides
})
```

## Coverage Requirements

### Minimum Thresholds
- **Lines**: 70%
- **Functions**: 70%
- **Branches**: 70%
- **Statements**: 70%

### Critical Paths (100% Coverage Required)
- Node creation and deletion
- Connection management
- Project validation
- Store state mutations
- YAML export functionality

## Running Tests

### Development Testing
```bash
npm run test                # Run all tests once
npm run test:watch         # Watch mode for development
npm run test:ui            # Visual test runner interface
```

### CI/CD Testing
```bash
npm run test:coverage      # Generate coverage report
npm run test -- --run      # Run tests once (no watch)
```

### Debugging Tests
```bash
npm run test -- --reporter=verbose    # Detailed output
npm run test -- --grep="specific"     # Run specific test pattern
```

## Best Practices

### Writing Good Tests
1. **Descriptive Names**: Test names explain what is being tested
2. **Arrange-Act-Assert**: Clear test structure
3. **Single Responsibility**: One concept per test
4. **Test Isolation**: Tests don't depend on each other

### Avoiding Common Pitfalls
- **Don't test implementation details**: Test user-visible behavior
- **Don't mock everything**: Use real implementations when possible
- **Don't test third-party libraries**: Focus on your own code
- **Don't write brittle tests**: Tests should survive refactoring

### Performance Testing
- Keep test suites fast (< 10 seconds total)
- Use `beforeEach` to reset state, not heavy setup
- Mock expensive operations (network, timers)
- Parallelize tests when possible
