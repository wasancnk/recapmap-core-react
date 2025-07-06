# WrappedCustomNode Refactoring Proposal

## Current Issues
- Large, monolithic component (~534 lines)
- Multiple responsibilities mixed together
- Complex z-index logic
- Tight coupling to panel system

## Proposed Refactoring

### Option 1: Split into Smaller Components
```
src/components/nodes/
├── NodeBase.tsx              # Core node rendering & styling
├── NodeHandles.tsx           # Connection handles
├── NodeControls.tsx          # Panel toggle buttons
├── NodePanels.tsx           # Panel positioning & rendering
├── hooks/
│   ├── useNodeZIndex.ts      # Z-index management
│   ├── useNodeInteraction.ts # Hover, focus, selection
│   └── useNodePanels.ts      # Panel operations
└── index.ts                  # Main WrappedCustomNode export
```

### Option 2: Simplify & Extract
1. **Extract Z-Index Logic**: Move complex z-index calculations to a custom hook
2. **Extract Panel Logic**: Move panel rendering to a separate component
3. **Simplify Styling**: Use CSS classes instead of inline styles where possible
4. **Extract Handle Logic**: Move connection handles to a reusable component

### Option 3: Keep But Clean Up
1. **Add Better Comments**: Explain each section clearly
2. **Group Related Logic**: Organize imports, hooks, handlers better
3. **Extract Constants**: Move magic numbers and styles to constants
4. **Simplify Conditionals**: Reduce nested ternary operators

## Recommendation
**Option 2: Simplify & Extract** - Keep the component but break it down into:
- Core node component (simplified)
- Custom hooks for complex logic
- Separate components for panels and handles

This maintains functionality while improving maintainability.
