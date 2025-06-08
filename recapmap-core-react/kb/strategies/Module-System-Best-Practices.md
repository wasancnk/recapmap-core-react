# Module System Best Practices

## ES6 Module Consistency Guidelines

### Core Principles
1. **Single Module System**: Use ES6 modules throughout the application
2. **Static Imports**: Prefer static imports over dynamic imports when possible
3. **Browser Compatibility**: Avoid Node.js specific features in browser code

### Import Patterns

#### ✅ Recommended: Static ES6 Imports
```typescript
// At the top of the file
import { useNodeStore } from './nodeStore'
import { someUtility } from '../utils/helpers'

// Use imported references in functions
const myFunction = () => {
  const { nodes } = useNodeStore.getState()
  return someUtility(nodes)
}
```

#### ❌ Avoid: CommonJS in Browser Code
```typescript
// Don't use require() in browser environments
const { useNodeStore } = require('./nodeStore') // ❌ Browser error

// Don't mix module systems
import { something } from './module'
const other = require('./other') // ❌ Inconsistent
```

#### ⚠️ Use Sparingly: Dynamic Imports
```typescript
// Only when truly needed for code splitting
const loadHeavyModule = async () => {
  const { heavyFunction } = await import('./heavyModule')
  return heavyFunction()
}
```

### Store Cross-References

#### ✅ Recommended Pattern
```typescript
// Import all store dependencies at the top
import { useNodeStore } from './nodeStore'
import { useUIStore } from './uiStore'

export const useProjectStore = create<ProjectState>((set, get) => ({
  // Use imported stores directly
  getProjectSummary: () => {
    const { nodes, connections } = useNodeStore.getState()
    const { activeTool } = useUIStore.getState()
    
    return {
      nodeCount: nodes.length,
      connectionCount: connections.length,
      activeTool
    }
  }
}))
```

### ESLint Configuration

Add these rules to prevent module system mixing:

```json
{
  "rules": {
    "import/no-commonjs": "error",
    "@typescript-eslint/no-var-requires": "error",
    "import/no-dynamic-require": "warn"
  }
}
```

### Testing Checklist

- [ ] All imports use ES6 syntax
- [ ] No `require()` statements in browser code
- [ ] Browser console shows no module errors
- [ ] TypeScript compilation passes
- [ ] All store cross-references work correctly

### Common Pitfalls

1. **Mixed Imports**: Using both `import` and `require` in the same file
2. **Dynamic Requires**: Using `require()` inside functions for browser code
3. **Circular Dependencies**: Store A importing Store B which imports Store A

### Recovery Steps

If you encounter module system errors:

1. **Identify the Error**: Check browser console for `require is not defined`
2. **Locate the Source**: Find the file with mixed module syntax
3. **Convert to ES6**: Replace `require()` with `import` statements
4. **Move Imports**: Place all imports at the top of the file
5. **Test**: Verify the fix in browser environment

---

*This guide helps maintain consistent, browser-compatible module usage across the RecapMap codebase.*
