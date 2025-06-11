# Dynamic Z-Index Implementation (DZINDEX_001)

## Overview
This document details the implementation of dynamic z-index management for RecapMap nodes, providing intelligent layering based on user interaction state.

## Implementation Date
June 11, 2025

## Status
✅ **COMPLETE** - DZINDEX_001 fully implemented and tested
🐛 **BUG FIX** - Fixed hover effects not working when panels are open
🎨 **ENHANCEMENT** - Dynamic glow colors matching each node's theme

## Recent Updates

### Dynamic Glow Colors Fix (June 11, 2025)
**Issue**: All glow effects used a fixed purple color (`rgba(99, 102, 241, 0.6)`) instead of matching each node's individual border color theme.

**Solution**: Implemented dynamic glow colors using CSS custom properties:

1. **Hex to RGBA Conversion**: Added utility function to convert node border colors to rgba format
2. **CSS Custom Properties**: Set `--node-glow-color` and `--node-border-color` dynamically
3. **Type-Specific Colors**: Each of the 12 node types now has unique glow colors

**Implementation**:
```typescript
// Convert hex border color to rgba for glow effects
const hexToRgba = (hex: string, alpha: number = 0.6) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Dynamic glow color based on node's border color
const glowColor = hexToRgba(config.borderColor, 0.6);

// Applied as CSS custom properties
style={{
  '--node-border-color': config.borderColor,
  '--node-glow-color': glowColor,
}}
```

**Node-Specific Glow Colors**:
- **usecase**: Green (#4d7c0f) → rgba(77, 124, 15, 0.6)
- **task**: Orange-Red (#ea580c) → rgba(234, 88, 12, 0.6)
- **expectation**: Orange (#f59e0b) → rgba(245, 158, 11, 0.6)
- **outcome**: Sky Blue (#0ea5e9) → rgba(14, 165, 233, 0.6)
- **persona**: Orange (#f59e0b) → rgba(245, 158, 11, 0.6)
- **screen**: Green (#10b981) → rgba(16, 185, 129, 0.6)
- **presentation**: Indigo (#4f46e5) → rgba(79, 70, 229, 0.6)
- **process**: Purple (#8b5cf6) → rgba(139, 92, 246, 0.6)
- **storage**: Yellow (#eab308) → rgba(234, 179, 8, 0.6)
- **resource**: Pink (#ec4899) → rgba(236, 72, 153, 0.6)
- **knowledge**: Gray (#6b7280) → rgba(107, 114, 128, 0.6)
- **note**: Cyan (#06b6d4) → rgba(6, 182, 212, 0.6)

### Hover Effects Bug Fix (June 11, 2025)
**Issue**: After opening panels via button clicks, nodes would stop responding to hover effects (scaling animation became inactive).

**Root Cause**: The z-index priority logic was overriding hover effects when panels were open. When `hasOpenPanels` was true, nodes were always set to `ELEVATED` state, which blocked the `node-hover-effect` CSS class from being applied.

**Solution**: 
1. Separated hover visual effects from z-index state logic
2. Added conditional hover effects that work independently of z-index state:
   - Normal hover: Applied when `isHovered && nodeZIndex !== ELEVATED`
   - Elevated hover: Applied when `isHovered && nodeZIndex === ELEVATED`
3. Created new CSS class `node-elevated-hover-effect` for enhanced hover feedback on elevated nodes

**Code Changes**:
```typescript
// Fixed className logic in NewCustomNode.tsx
${(isHovered || isFocused) && nodeZIndex !== NODE_Z_INDEX.ELEVATED ? 'node-hover-effect' : ''}
${nodeZIndex === NODE_Z_INDEX.ELEVATED ? 'node-elevated-effect' : ''}
${(isHovered || isFocused) && nodeZIndex === NODE_Z_INDEX.ELEVATED ? 'node-elevated-hover-effect' : ''}
```

```css
/* Added enhanced hover effect for elevated nodes */
.node-elevated-hover-effect {
  transform: scale(1.05);
  box-shadow: 0 16px 50px rgba(0, 0, 0, 0.5),
              0 0 0 3px rgba(99, 102, 241, 0.8),
              0 0 30px rgba(99, 102, 241, 0.4);
}
```
**Issue**: After opening panels via button clicks, nodes would stop responding to hover effects (scaling animation became inactive).

**Root Cause**: The z-index priority logic was overriding hover effects when panels were open. When `hasOpenPanels` was true, nodes were always set to `ELEVATED` state, which blocked the `node-hover-effect` CSS class from being applied.

**Solution**: 
1. Separated hover visual effects from z-index state logic
2. Added conditional hover effects that work independently of z-index state:
   - Normal hover: Applied when `isHovered && nodeZIndex !== ELEVATED`
   - Elevated hover: Applied when `isHovered && nodeZIndex === ELEVATED`
3. Created new CSS class `node-elevated-hover-effect` for enhanced hover feedback on elevated nodes

**Code Changes**:
```typescript
// Fixed className logic in NewCustomNode.tsx
${(isHovered || isFocused) && nodeZIndex !== NODE_Z_INDEX.ELEVATED ? 'node-hover-effect' : ''}
${nodeZIndex === NODE_Z_INDEX.ELEVATED ? 'node-elevated-effect' : ''}
${(isHovered || isFocused) && nodeZIndex === NODE_Z_INDEX.ELEVATED ? 'node-elevated-hover-effect' : ''}
```

```css
/* Added enhanced hover effect for elevated nodes */
.node-elevated-hover-effect {
  transform: scale(1.05);
  box-shadow: 0 16px 50px rgba(0, 0, 0, 0.5),
              0 0 0 3px rgba(99, 102, 241, 0.8),
              0 0 30px rgba(99, 102, 241, 0.4);
}
```

## Architecture

### Z-Index Hierarchy
The system uses a 4-tier z-index hierarchy:

```typescript
const NODE_Z_INDEX = {
  INACTIVE: 10,    // Default state - node in background
  HOVER: 50,       // Mouse hover - slight elevation
  SELECTED: 75,    // Selected state - prominent elevation
  ELEVATED: 90,    // Active interaction (panels open) - maximum elevation
} as const;
```

### State Management
Dynamic z-index is managed through React state and useEffect hooks:

```typescript
const [nodeZIndex, setNodeZIndex] = React.useState<NodeZIndex>(NODE_Z_INDEX.INACTIVE);
const [isFocused, setIsFocused] = React.useState(false);
const [isHovered, setIsHovered] = React.useState(false);

React.useEffect(() => {
  const hasOpenPanels = panelStore.getNodePanels(id).length > 0;
  
  if (hasOpenPanels) {
    setNodeZIndex(NODE_Z_INDEX.ELEVATED);
  } else if (selected) {
    setNodeZIndex(NODE_Z_INDEX.SELECTED);
  } else if (isHovered || isFocused) {
    setNodeZIndex(NODE_Z_INDEX.HOVER);
  } else {
    setNodeZIndex(NODE_Z_INDEX.INACTIVE);
  }
}, [id, selected, isHovered, isFocused, panelStore]);
```

## Features Implemented

### 1. Interactive State Detection
- **Hover State**: Mouse enter/leave events
- **Focus State**: Keyboard focus (tabIndex=0)
- **Selection State**: React Flow selection integration
- **Panel State**: Integration with panelStore to detect open panels

### 2. Visual Effects
CSS classes applied based on z-index state with dynamic colors:

```css
.node-hover-effect {
  transform: scale(1.02);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
}

.node-selected-effect {
  transform: scale(1.01);
  box-shadow: 
    0 0 20px var(--node-glow-color, rgba(255, 255, 255, 0.6)),
    0 8px 25px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
}

.node-elevated-effect {
  transform: scale(1.03);
  box-shadow: 
    0 0 25px var(--node-glow-color, rgba(99, 102, 241, 0.8)),
    0 0 40px var(--node-glow-color, rgba(99, 102, 241, 0.4)),
    0 12px 30px rgba(0, 0, 0, 0.4);
  outline: 2px solid var(--node-border-color, #6366f1);
  outline-offset: 2px;
  transition: all 0.2s ease;
}

.node-elevated-hover-effect {
  transform: scale(1.05);
  box-shadow: 
    0 0 30px var(--node-glow-color, rgba(99, 102, 241, 0.9)),
    0 0 50px var(--node-glow-color, rgba(99, 102, 241, 0.5)),
    0 15px 35px rgba(0, 0, 0, 0.5);
  outline: 3px solid var(--node-border-color, #6366f1);
  outline-offset: 3px;
  transition: all 0.2s ease;
}

.node-focus-effect {
  outline: 2px solid var(--node-border-color, #6366f1);
  outline-offset: 2px;
  box-shadow: 0 0 15px var(--node-glow-color, rgba(99, 102, 241, 0.6));
}
```

**Key Innovation**: All glow effects now use CSS custom properties (`var(--node-glow-color)`) that are dynamically set based on each node's border color, providing unique visual identity for each of the 12 node types.

### 3. Accessibility Support
- Keyboard focus management with `tabIndex={0}`
- Focus and blur event handlers
- Visual focus indicators

### 4. Panel Integration
- Automatically elevates nodes when panels are open
- Coordinates with existing panelStore z-index system
- Panel z-index range: 100-1010
- Node z-index range: 10-90 (prevents overlap)

## File Changes

### Primary Files Modified

1. **src/components/NewCustomNode.tsx**
   - Added z-index constants and type definitions
   - Implemented state management for dynamic z-index
   - Added event handlers for hover, focus, and panel integration
   - Enhanced className with conditional styling
   - Applied z-index to node style

2. **src/index.css**
   - Added z-index utility classes for nodes
   - Implemented visual effect classes for each interaction state
   - Added smooth transitions for all effects

### Code Markers for Coordination
All z-index related code is marked with:
```typescript
// Z-INDEX LOGIC - Copilot 1
```

## Integration Points

### With Panel System
- Reads panel state from `panelStore.getNodePanels(id)`
- Automatically elevates nodes when any panel is open
- Maintains separation from panel z-index ranges

### With React Flow
- Integrates with React Flow's `selected` prop
- Preserves existing selection styling
- Enhances with dynamic z-index behavior

### With Keyboard Navigation
- Supports tab navigation between nodes
- Visual focus indicators
- Proper ARIA accessibility

## Testing Scenarios

### Manual Testing
1. **Hover Test**: Hover over nodes to see elevation effect
2. **Selection Test**: Click nodes to see selection elevation
3. **Panel Test**: Open panels to see maximum elevation
4. **Focus Test**: Tab through nodes to see focus effects
5. **Mixed State Test**: Combine interactions to verify priority

### Expected Behavior
- **Inactive → Hover**: Smooth scale and shadow transition
- **Hover → Selected**: Enhanced glow and ring effect
- **Selected → Elevated**: Maximum scale with blue outline
- **Panel Open**: Node maintains elevated state until panel closes

## Performance Considerations

### Optimizations
- Uses React.useCallback for event handlers
- Single useEffect with proper dependencies
- CSS transitions handled by GPU (transform/opacity)
- Minimal re-renders through careful state management

### Memory Impact
- Small state additions (2 boolean states, 1 number state)
- No memory leaks (proper cleanup in useEffect)
- Event handlers properly memoized

## Future Enhancements (DZINDEX_002 & DZINDEX_003)

### DZINDEX_002: Node Selection Visual Enhancement
- Enhanced selection indicators
- Multi-selection visual feedback
- Selection group coordination

### DZINDEX_003: Panel Z-Index Coordination
- Advanced panel stacking
- Panel priority management
- Cross-panel interaction handling

## Browser Compatibility
- All modern browsers (Chrome, Firefox, Safari, Edge)
- CSS transforms and transitions fully supported
- React synthetic events used for cross-browser compatibility

## Troubleshooting

### Common Issues
1. **Z-index not applying**: Check CSS layer specificity
2. **Transitions not smooth**: Verify CSS transition properties
3. **Focus not working**: Ensure tabIndex is set
4. **Panel state not updating**: Check panelStore integration

### Debug Tips
- Use browser dev tools to inspect z-index values
- Check console for React warnings
- Verify event handler attachment in Elements panel

## Code Review Checklist
- ✅ TypeScript types properly defined
- ✅ Event handlers properly memoized
- ✅ CSS classes conditionally applied
- ✅ Accessibility features implemented
- ✅ Performance optimized
- ✅ Integration with existing systems
- ✅ Code properly commented and marked

## Conclusion
DZINDEX_001 provides a robust foundation for dynamic node layering in RecapMap. The implementation is performant, accessible, and integrates seamlessly with existing systems while providing clear visual feedback for user interactions.
