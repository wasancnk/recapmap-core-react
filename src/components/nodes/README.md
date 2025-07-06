# Node Components Architecture

This directory contains the refactored node system that replaces the monolithic `WrappedCustomNode.tsx`.

## Structure

```
src/components/nodes/
├── index.tsx              # Main export - NodeWrapper component
├── NodeBase.tsx          # Core node rendering & styling
├── NodeHandles.tsx       # Connection handles component  
├── NodeControls.tsx      # Panel toggle buttons
├── NodePanels.tsx        # Panel positioning & rendering
├── constants.ts          # Shared constants & types
└── hooks/
    ├── useNodeZIndex.ts     # Z-index management logic
    ├── useNodeInteraction.ts # Hover, focus, selection states
    └── useNodePanels.ts     # Panel operations
```

## Migration from WrappedCustomNode.tsx

The original `WrappedCustomNode.tsx` (~534 lines) has been split into:

1. **NodeWrapper** (`index.tsx`) - Main orchestrator component (67 lines)
2. **NodeBase** - Node rendering & styling (134 lines)
3. **NodeHandles** - Reusable connection handles (104 lines)
4. **NodeControls** - Panel control buttons (58 lines)
5. **NodePanels** - Panel positioning logic (53 lines)
6. **Custom Hooks** - Extracted logic for z-index, interaction, and panels (150 lines total)

## Benefits

- **Separation of Concerns**: Each component has a single responsibility
- **Reusability**: Components can be reused independently
- **Testability**: Smaller components are easier to test
- **Maintainability**: Easier to understand and modify individual pieces
- **Type Safety**: Better TypeScript support with focused interfaces

## Usage

The node system is used exactly the same way in Canvas.tsx:

```tsx
import WrappedCustomNode from './nodes';

const nodeTypes = {
  customNode: WrappedCustomNode,
};
```

The export from `index.tsx` maintains backward compatibility while providing the improved architecture underneath.

## Key Features Preserved

- ✅ Dynamic z-index calculation
- ✅ Panel management and positioning  
- ✅ Connection handles (hover/selection visibility)
- ✅ Node styling (including stripe patterns for view/case nodes)
- ✅ Keyboard navigation and focus handling
- ✅ All panel types (summary, editor, ai-chat, share, tools)
- ✅ Interaction states (hover, selected, elevated)

## Constants

All shared constants are defined in `constants.ts`:
- `NODE_Z_INDEX` - Z-index values for different states
- `NODE_DIMENSIONS` - Width, height, padding
- `HANDLE_STYLES` - Connection handle styling
- `PANEL_POSITIONING` - Panel layout constants
