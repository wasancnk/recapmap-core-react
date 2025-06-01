# Automated Testing Infrastructure Setup Guide

## Overview
This guide outlines the automated testing strategy for RecapMap, focusing on the connection swap functionality and broader application testing needs.

## Testing Strategy

### 1. Unit Tests (Vitest + React Testing Library)
**Purpose**: Test individual components and store logic
**Coverage Target**: 90% for utility functions, 80% for components
**Framework**: Vitest (Vite-native, faster than Jest)

#### Key Areas:
- **Store Logic**: Connection operations, node management, state mutations
- **Utility Functions**: Logger, YAML export, property schemas  
- **Component Logic**: Form validation, event handling, state management

### 2. Integration Tests (Vitest + React Testing Library)
**Purpose**: Test component interactions and store integration
**Coverage Target**: Key user workflows

#### Key Areas:
- **Connection Workflows**: Create → Edit → Swap → Delete
- **Node Operations**: Create → Connect → Validate → Export
- **Panel Management**: Open → Edit → Save → Close

### 3. End-to-End Tests (Playwright)
**Purpose**: Test real user scenarios in actual browser
**Coverage Target**: Critical user journeys

#### Key Areas:
- **Canvas Interaction**: Drag nodes, create connections
- **Real Browser Testing**: Handle visibility, React Flow integration
- **Cross-browser Compatibility**: Chrome, Firefox, Safari

## Installation Commands

```bash
# Unit and Integration Testing
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom

# Test utilities and mocking
npm install --save-dev @vitest/ui happy-dom

# End-to-End Testing (Optional - install when ready)
npm install --save-dev @playwright/test

# Type definitions
npm install --save-dev @types/testing-library__jest-dom
```

## Project Benefits

### Immediate Benefits:
- **Regression Prevention**: Catch breaking changes in connection logic
- **Refactoring Confidence**: Safe code improvements and optimizations
- **Documentation**: Tests serve as executable specifications
- **Debugging Aid**: Pinpoint exact failure locations

### Long-term Benefits:
- **Team Collaboration**: Clear behavioral contracts for components
- **Continuous Integration**: Automated quality gates
- **User Experience**: Fewer bugs reaching production
- **Technical Debt Prevention**: Maintain clean, testable architecture

## Recommended Implementation Order

### Phase 1: Core Testing Infrastructure (Week 1)
1. Install Vitest and React Testing Library
2. Configure test environment and setup files
3. Create test utilities and mocks
4. Write first connection swap tests

### Phase 2: Component Testing (Week 2)
1. Test `swapConnection` store method
2. Test `ConnectionPropertyPanel` component
3. Test logging system functionality
4. Test error handling and edge cases

### Phase 3: Integration Testing (Week 3)
1. Test full connection workflows
2. Test React Flow integration
3. Test handle visibility logic
4. Test state synchronization

### Phase 4: End-to-End Testing (Future)
1. Install Playwright when UI is stable
2. Test real browser interactions
3. Test cross-browser compatibility
4. Test performance under load

## Test File Structure
```
src/
├── __tests__/
│   ├── utils/
│   │   ├── logger.test.ts
│   │   └── yamlExport.test.ts
│   ├── stores/
│   │   ├── nodeStore.test.ts
│   │   └── projectStore.test.ts
│   ├── components/
│   │   ├── ConnectionPropertyPanel.test.tsx
│   │   └── Canvas.test.tsx
│   └── integration/
│       ├── connectionWorkflow.test.tsx
│       └── swapConnection.test.tsx
├── test-utils/
│   ├── setup.ts
│   ├── mockData.ts
│   └── testHelpers.tsx
└── vitest.config.ts
```

## Alignment with Project Goals

### Security Benefits:
- **Dependency Minimization**: Vitest adds minimal dependencies vs Jest ecosystem
- **Native Integration**: Works seamlessly with existing Vite setup
- **Development Only**: Testing dependencies don't affect production bundle

### Unity Migration Benefits:
- **Logic Testing**: Store and utility tests translate well to C# unit tests
- **Component Contracts**: Clear interfaces that map to Unity UI components
- **State Management**: Testing patterns applicable to Unity ScriptableObjects

### Performance Benefits:
- **Fast Feedback**: Vitest runs tests faster than Jest
- **Watch Mode**: Instant re-runs during development
- **Parallel Execution**: Multiple test files run simultaneously

## Next Steps

1. **Review and Approve**: Confirm testing strategy aligns with project goals
2. **Install Dependencies**: Run the installation commands above
3. **Configure Environment**: Set up test configuration files
4. **Write First Tests**: Start with connection swap functionality
5. **Iterate and Expand**: Add more tests as components stabilize

This testing infrastructure will provide confidence in the connection swap fix and create a foundation for reliable, maintainable code as the project grows.
