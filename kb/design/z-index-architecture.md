# Z-Index Architecture for RecapMap

## Overview
This document defines the z-index architecture and layering strategy for the RecapMap application, ensuring proper visual hierarchy and preventing layout conflicts.

## Architecture Philosophy
Following Apple's design philosophy of elegant simplicity, our z-index system uses clearly defined layers with sufficient spacing to prevent conflicts and allow for future expansion.

## Z-Index Hierarchy

### Layer 1: Canvas and Background (0-9)
- **0**: Canvas background
- **1**: Grid and background elements
- **5**: Connection lines and edges

### Layer 2: Nodes (10-99)
```typescript
const NODE_Z_INDEX = {
  INACTIVE: 10,    // Default node state
  HOVER: 50,       // Mouse hover interaction
  SELECTED: 75,    // Selected state
  ELEVATED: 90,    // Active interaction (panels open)
} as const;
```

### Layer 3: UI Panels (100-999)
```typescript
const PANEL_Z_INDEX = {
  BASE: 100,           // Basic panels
  ELEVATED: 110,       // Active panels
  PROPERTY_PANEL: 200, // Property panels
  TOOLBAR: 300,        // Toolbar elements
  DROPDOWN: 400,       // Dropdown menus
  CONTEXT_MENU: 500,   // Context menus
} as const;
```

### Layer 4: Modals and Overlays (1000+)
```css
.z-modal { z-index: 1000; }      /* Modal dialogs */
.z-tooltip { z-index: 1010; }    /* Tooltips */
.z-notification { z-index: 1020; } /* Notifications */
.z-loading { z-index: 1100; }    /* Loading overlays */
```

## Dynamic Z-Index Management

### Node Layer Management
Nodes dynamically adjust their z-index based on interaction state:

1. **INACTIVE (10)**: Default state, behind other interactive elements
2. **HOVER (50)**: Mouse interaction, elevated above inactive nodes
3. **SELECTED (75)**: Selected by user, above hover states
4. **ELEVATED (90)**: Has open panels or active interaction

### Panel Layer Management
Panels use the existing panelStore system:

```typescript
interface PanelState {
  zIndex: number;        // Dynamic z-index
  isActive: boolean;     // Affects z-index calculation
  // ... other properties
}

// Base z-index constants
BASE_INACTIVE_Z_INDEX: 2000;
BASE_ACTIVE_Z_INDEX: 3000;
```

## CSS Implementation

### Utility Classes
```css
/* Node z-index utilities */
.z-node-inactive { z-index: 10; }
.z-node-active { z-index: 50; }
.z-node-selected { z-index: 75; }
.z-node-elevated { z-index: 90; }

/* Panel z-index utilities */
.z-panel-base { z-index: 100; }
.z-panel-elevated { z-index: 110; }

/* Modal z-index utilities */
.z-modal { z-index: 1000; }
.z-tooltip { z-index: 1010; }
```

### Visual Effects
Each z-index level has corresponding visual effects:

```css
.node-interactive {
  transition: all 0.2s ease;
  position: relative;
}

.node-hover-effect {
  transform: scale(1.02);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.node-selected-effect {
  transform: scale(1.01);
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.8), 
              0 0 20px rgba(255, 255, 255, 0.3);
}

.node-elevated-effect {
  transform: scale(1.03);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4),
              0 0 0 3px rgba(99, 102, 241, 0.6);
}
```

## Integration Guidelines

### For New Components
1. **Identify the appropriate layer** (Node, Panel, Modal)
2. **Use predefined constants** rather than magic numbers
3. **Add visual effects** corresponding to z-index level
4. **Test interaction** with existing components

### For Node Components
```typescript
// Use the NODE_Z_INDEX constants
import { NODE_Z_INDEX } from './constants';

// Apply dynamic z-index
style={{ zIndex: nodeZIndex }}

// Use corresponding CSS classes
className={`node-interactive ${getZIndexClass(nodeZIndex)}`}
```

### For Panel Components
```typescript
// Use panel store z-index management
const { zIndex } = usePanelStore();

// Apply panel z-index
style={{ zIndex: panelState.zIndex }}
```

## Conflict Resolution

### Prevention Strategies
1. **Layer Separation**: 100+ point gaps between layers
2. **Reserved Ranges**: Each system has allocated ranges
3. **Documentation**: Clear ownership of z-index ranges
4. **Testing**: Regular testing of layer interactions

### Common Conflict Scenarios
1. **Node above Panel**: Ensure panels use 100+ z-index
2. **Panel above Modal**: Ensure modals use 1000+ z-index
3. **Multiple Elevated Nodes**: Use additional criteria (timestamp, selection order)

## Performance Considerations

### Optimization Strategies
1. **CSS Transforms**: Use transform instead of changing layout properties
2. **Transition Duration**: Keep transitions under 300ms
3. **Hardware Acceleration**: Leverage GPU for transforms
4. **Minimal Repaints**: Avoid properties that trigger reflow

### Browser Compatibility
- **Modern Browsers**: Full support for all features
- **Stacking Context**: Properly managed to avoid browser quirks
- **Touch Devices**: Hover states handled appropriately

## Accessibility

### Focus Management
- **Tab Order**: Z-index changes don't affect tab order
- **Focus Indicators**: Visual focus indicators at all levels
- **Screen Readers**: Z-index changes announced appropriately

### Keyboard Navigation
```css
.node-focus-effect {
  outline: 2px solid rgba(99, 102, 241, 0.6);
  outline-offset: 2px;
}
```

## Future Considerations

### Scalability
- **Additional Layers**: Room for expansion in each range
- **Dynamic Ranges**: Ability to adjust ranges as needed
- **Component-Specific**: Individual components can manage sub-ranges

### Enhancement Opportunities
1. **Animated Transitions**: Smooth z-index transitions
2. **Context-Aware Layering**: Intelligent layering based on context
3. **User Preferences**: Customizable visual effects
4. **Performance Monitoring**: Track layer performance

## Testing Strategy

### Automated Tests
```typescript
describe('Z-Index Management', () => {
  it('should elevate nodes on hover', () => {
    // Test hover state z-index
  });
  
  it('should coordinate with panel z-index', () => {
    // Test panel integration
  });
});
```

### Manual Testing
1. **Layer Interaction**: Test all layer combinations
2. **Visual Feedback**: Verify effects at each level
3. **Accessibility**: Test keyboard and screen reader interaction
4. **Performance**: Test on various devices

## Conclusion
This z-index architecture provides a robust foundation for visual layering in RecapMap while maintaining performance, accessibility, and extensibility. The clear separation of concerns and comprehensive documentation ensure maintainable and conflict-free layer management.
