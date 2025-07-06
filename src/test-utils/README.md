# Test Utilities Documentation

This directory contains comprehensive testing utilities for the RecapMap project, organized to support both unit testing and development/debugging workflows.

## 📁 File Structure

```
src/test-utils/
├── index.ts              # Barrel export - import everything from here
├── setup.ts              # Global test configuration and mocks
├── testHelpers.tsx       # Custom render functions and test utilities
├── mockData.ts           # Basic mock data factories
├── mockFactories.ts      # Advanced mock scenarios and complex data
├── ZustandTest.tsx       # Development utility for testing stores
└── README.md            # This documentation
```

## 🚀 Quick Start

```typescript
// Import everything you need from the barrel export
import {
  render,
  screen,
  fireEvent,
  waitFor,
  userEvent,
  createMockNode,
  createMockNodeGraph,
  createAllNodeTypes,
  ZustandTest
} from '../test-utils'

// Use in your tests
test('should render a node', () => {
  const mockNode = createMockNode({ type: 'case', title: 'Test Case' })
  // ... rest of test
})
```

## 📋 Available Utilities

### Core Test Functions
- **render**: Custom render with providers
- **screen, fireEvent, waitFor**: Standard testing library functions
- **userEvent**: User interaction utilities
- **vi, expect, describe, it, test**: Vitest functions

### Mock Data Factories

#### Basic Factories (`mockData.ts`)
- `createMockNode(overrides?)`: Create a single mock node
- `createMockConnection(overrides?)`: Create a mock connection between nodes

#### Advanced Factories (`mockFactories.ts`)
- `createMockNodeGraph()`: Create a connected graph of nodes (case → interface → storage)
- `createAllNodeTypes()`: Create one node of each type (all 12 node types)
- `createMockStoreState()`: Mock complete Zustand store state
- `createMockReactFlowInstance()`: Mock React Flow instance with methods
- `createMockValidationResult(isValid?)`: Mock validation results

### Test Helpers (`testHelpers.tsx`)
- `createMockEvent(type, properties?)`: Mock DOM events
- `createMockConnectionEvent()`: Mock React Flow connection events
- `createMockDragEvent()`: Mock drag and drop events
- `waitForAsync()`: Helper for async operations
- `mockWindowMethods()`: Mock global window methods

### Development Tools
- `ZustandTest`: Interactive component for testing store functionality

## 🧪 Testing Patterns

### Testing Components

```typescript
import { render, screen, createMockNode } from '../test-utils'
import { NodeComponent } from '../components/NodeComponent'

test('renders node with title', () => {
  const mockNode = createMockNode({ 
    type: 'case', 
    title: 'User Login Case' 
  })
  
  render(<NodeComponent node={mockNode} />)
  
  expect(screen.getByText('User Login Case')).toBeInTheDocument()
})
```

### Testing Store Interactions

```typescript
import { renderHook, act, createMockStoreState } from '../test-utils'
import { useNodeStore } from '../stores'

test('adds node to store', () => {
  const { result } = renderHook(() => useNodeStore())
  
  act(() => {
    result.current.addNode(createMockNode({ type: 'case' }))
  })
  
  expect(result.current.nodes).toHaveLength(1)
})
```

### Testing Complex Workflows

```typescript
import { render, userEvent, createMockNodeGraph } from '../test-utils'
import { Canvas } from '../components/Canvas'

test('connects nodes via drag and drop', async () => {
  const { nodes, connections } = createMockNodeGraph()
  
  render(<Canvas initialNodes={nodes} initialConnections={connections} />)
  
  // Test connection workflow
  const sourceHandle = screen.getByTestId('node-handle-case-1-right')
  const targetHandle = screen.getByTestId('node-handle-interface-1-left')
  
  await userEvent.dragAndDrop(sourceHandle, targetHandle)
  
  // Assert connection was created
  // ...
})
```

## 🔧 Development Utilities

### ZustandTest Component

A powerful development tool for manually testing store functionality:

```typescript
import { ZustandTest } from '../test-utils'

// Use in development for debugging stores
export const DevPage = () => (
  <div>
    <h1>Store Testing</h1>
    <ZustandTest />
  </div>
)
```

The ZustandTest component provides:
- Interactive node creation for all 12 types
- Connection management testing
- Canvas controls testing
- Panel state management
- Project validation testing
- Store state inspection

## 🎯 Best Practices

### 1. Use Specific Mock Factories
```typescript
// ✅ Good - specific to your test needs
const loginCase = createMockNode({ 
  type: 'case', 
  title: 'User Login',
  priority: 'high' 
})

// ❌ Avoid - generic mock might not match test requirements
const genericNode = createMockNode()
```

### 2. Test Data Isolation
```typescript
// ✅ Good - each test gets fresh data
beforeEach(() => {
  const { nodes } = createMockNodeGraph()
  // Setup test with fresh data
})
```

### 3. Mock External Dependencies
```typescript
// ✅ Good - mocks are already configured in setup.ts
// React Flow, localStorage, window methods are pre-mocked
```

### 4. Use Semantic Test Queries
```typescript
// ✅ Good - tests user-facing behavior
expect(screen.getByRole('button', { name: 'Add Case Node' })).toBeInTheDocument()

// ❌ Avoid - tests implementation details
expect(screen.getByTestId('add-case-button')).toBeInTheDocument()
```

## 🏗️ Extending Test Utilities

### Adding New Mock Factories

Add new factories to `mockFactories.ts`:

```typescript
export const createMockWorkflow = () => {
  // Create complex workflow scenarios
  return {
    nodes: [...],
    connections: [...],
    validation: createMockValidationResult()
  }
}
```

### Adding New Test Helpers

Add utilities to `testHelpers.tsx`:

```typescript
export const waitForStoreUpdate = async (store: any, timeout = 1000) => {
  // Custom waiting logic for store updates
}
```

### Development Testing

The `test_files/` directory contains additional integration tests and validation scripts:
- HTML-based integration tests
- Console-based persistence tests
- Canvas interaction validations
- Z-index and styling tests

These complement the unit tests by providing end-to-end validation scenarios.

## 🔗 Integration with Main Codebase

All test utilities are designed to work seamlessly with:
- **Zustand stores**: Pre-configured mocks and state factories
- **React Flow**: Mocked instances and event handlers
- **TypeScript**: Full type safety with your RecapMap types
- **Vitest**: Optimized for the project's test runner
- **12-node system**: Supports all current node types

The utilities automatically stay in sync with your type definitions and store interfaces, ensuring tests remain reliable as the codebase evolves.
