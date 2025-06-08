# Node Panel System Architecture

## 🧠 Concept Overview

The Node Panel System transforms nodes from simple visual elements into **live interactive widgets**. Each node can spawn multiple contextual panels that provide rich functionality while maintaining a clean, ergonomic canvas experience.

## 🎯 Core Philosophy

### Node = Widget + Panels
- Each node acts as a **live interactive widget**
- Nodes spawn **contextual floating panels** for extended functionality
- **Multi-focus workflow**: Users can work on multiple nodes simultaneously
- **Persistent state**: Panels remain open until manually closed
- **Desktop-first**: Optimized for builder mode experience

### Design Principles
- ✅ **Ergonomic entry**: Bottom-aligned toggler buttons feel natural
- ✅ **Persistent state**: Panels don't auto-close unless toggled or manually closed
- ✅ **Multi-focus workflow**: Users can work on many widgets in parallel
- ✅ **Beginner-friendly**: Easy access without full-screen modal disruptions
- ✅ **Performance-first**: Fixed dimensions, simplified transformations

## 🧩 Node Structure

### Visual Layout
```
[Icon] Node Type          [X]
      Node Title
   Node Description
[📊][⚙️][💬][🔗][🔧]
```

### Components
1. **Node Type** (Top-Left) - Icon + label
2. **Node Name** (Top-Center) - Primary identifier
3. **Delete Button ("X")** (Top-Right) - Node removal
4. **Node Description** (Center) - Contextual information
5. **Panel Toggler Buttons** (Bottom Row) - 5 action buttons

## 🎛️ Panel Types & Implementation Priority

### Phase 1 (Implement First)
1. **📊 Summary Panel** - Replaces tooltip system with rich content
2. **⚙️ Node Editor Panel** - Replaces current floating property panel

### Phase 2 (Placeholder Implementation)
3. **💬 AI Chat Panel** - Node-scoped AI assistance
4. **🔗 Share Panel** - Node linking and sharing functionality
5. **🔧 Other Tools Panel** - Future extensibility hook

### Panel Specifications
- **Fixed dimensions**: Same height and width for all panels
- **Non-responsive**: Better performance with many panels
- **Stacked layout**: Panels stack to the right of originating node
- **Azure-style behavior**: Similar to Windows 11 panel management

## 🪟 Panel Behavior System

### Opening & Stacking
- Click toggler button → Panel opens beside node
- Multiple panels from same node stack horizontally to the right
- Panel opening order maintained (no automatic reordering)
- Each panel has close button (X) for manual dismissal

### Positioning Strategy
- **Canvas transformation inheritance**: Panels scale with canvas zoom/pan
- **No complex coordinate calculations**: Panels inherit global canvas transform
- **Fixed relative positioning**: Panels stick to their originating node
- **Acceptable off-viewport**: Don't handle panels going off-screen

### Multi-Node Support
- Multiple nodes can have panels open simultaneously
- Each node group (node + panels) operates independently
- No cross-node panel interference

## 🎯 Z-Index Management System

### Architecture Decision
- **Centralized control**: PanelManager handles all z-index coordination
- **Group-based promotion**: Entire node group moves together
- **Activity-based promotion**: Any node activity brings group to front

### Z-Index Layers
```
1000-1999: Inactive nodes (base layer)
2000-2999: Inactive panels 
3000-3999: Active node group (node + panels)
4000+:     Modal overlays, dropdowns, etc.
```

### Within Active Node Group
```
3000: Active node itself
3001: First panel of active node (oldest)
3002: Second panel of active node
3003: Third panel of active node (newest)
```

### Promotion Triggers ("Activity")
- **User interactions**: Clicks, edits, panel toggles
- **Content updates**: Node data changes, validation results
- **System alerts**: Error states, completion notifications  
- **Background processes**: AI responses, async operations
- **Real-time updates**: Chat messages, collaborative changes

### Windows 11-Style Behavior
- Latest active group shifts to top z-index
- No manual z-index management required
- Familiar user experience pattern
- Automatic organization of overlapping content

## 🏗️ Technical Architecture

### Core Components

#### PanelManager (Centralized Control)
```typescript
interface PanelManager {
  promoteNodeGroup(nodeId: string, reason: ActivityReason): void
  openPanel(nodeId: string, panelType: PanelType): void
  closePanel(nodeId: string, panelType: PanelType): void
  getActiveNodeGroup(): string | null
  getNodePanels(nodeId: string): PanelState[]
}

type ActivityReason = 
  | 'user-click' 
  | 'panel-toggle' 
  | 'content-update' 
  | 'alert' 
  | 'ai-response'
  | 'background-process'
```

#### Panel Component
```typescript
interface NodePanel {
  nodeId: string
  panelType: PanelType
  position: { x: number, y: number }
  zIndex: number
  isVisible: boolean
  stackOrder: number
}

type PanelType = 'summary' | 'editor' | 'ai-chat' | 'share' | 'tools'
```

### State Management Integration
- **Zustand store**: Panel state management
- **React Flow coordination**: Canvas transformation handling
- **Node component integration**: Button handling and panel spawning

### Performance Considerations
- **Fixed dimensions**: Prevents layout thrashing
- **Canvas inheritance**: No complex coordinate calculations
- **Minimal re-renders**: Efficient state updates
- **Lazy panel content**: Load panel content only when opened

## 🚀 Implementation Strategy

### Development Phases

#### Phase 1: Foundation
1. **PanelManager infrastructure** - Z-index coordination system
2. **Basic panel rendering** - Fixed dimensions, positioning
3. **Node button integration** - Toggle functionality

#### Phase 2: Core Panels
1. **Summary Panel** - Rich tooltip replacement
2. **Node Editor Panel** - Property editing interface
3. **Panel state persistence** - Remember open panels

#### Phase 3: Advanced Features
1. **AI Chat Panel** - Node-scoped conversations
2. **Share Panel** - Link generation and sharing
3. **Background activity triggers** - Auto-promotion system

### Migration Strategy
- **Tooltip replacement**: Summary panel replaces existing tooltip system
- **Property panel replacement**: Node editor panel replaces floating property UI
- **Gradual rollout**: Phase implementation allows incremental adoption

## 🎨 Visual Design Specifications

### Node Layout Adjustments
- **Title/description shift**: Move up to accommodate bottom buttons
- **Button row spacing**: Adequate touch targets for 5 buttons
- **Visual hierarchy**: Clear separation between content and controls

### Panel Styling
- **Consistent theming**: Match existing RecapMap design system
- **Professional appearance**: Clean, modern interface
- **Clear hierarchy**: Header, content, controls sections
- **Close affordance**: Obvious close button placement

### Interaction Feedback
- **Button states**: Hover, active, disabled states
- **Panel transitions**: Smooth open/close animations (minimal)
- **Loading states**: For async panel content
- **Error states**: Clear error communication

## 🔮 Future Extensions

### Universal Sidecar System
- Evolution into comprehensive sidecar panel system
- Replace all floating UI elements
- Modular, extensible architecture
- Reduced complexity, improved UX

### Advanced Panel Types
- **Data Inspector**: Real-time data visualization
- **Test Runner**: In-context testing and validation
- **Version History**: Node change tracking
- **Collaboration**: Real-time user presence and comments

### Cross-Node Features
- **Panel linking**: Connect related panels across nodes
- **Workflow views**: Multi-node process visualization
- **Bulk operations**: Actions across multiple selected nodes

## 📝 Implementation Notes

### Avoid Pitfalls
- ❌ **No browser native tooltips** - These are interactive panels
- ❌ **No complex positioning math** - Use canvas transformation inheritance
- ❌ **No automatic panel management** - User controls panel lifecycle
- ❌ **No mobile optimization** - Desktop-first approach

### Best Practices
- ✅ **Centralized state management** - Single source of truth
- ✅ **Predictable behavior** - Consistent interaction patterns
- ✅ **Performance optimization** - Fixed dimensions, minimal calculations
- ✅ **Extensible architecture** - Easy to add new panel types

## 🧪 Use Case Examples

### Scenario 1: Form Validation
1. User creates "Form Input" node
2. Clicks 📊 Summary → See input specifications
3. Clicks ⚙️ Editor → Configure validation rules
4. Clicks 💬 AI Chat → "Help me improve validation"
5. All panels remain open for cross-reference

### Scenario 2: Multi-Node Workflow
1. User has 3 nodes with various panels open
2. Clicks on different node → That group comes to front
3. Background AI process completes → Related node group auto-promotes
4. User can see all active work simultaneously

### Scenario 3: Collaborative Development
1. Multiple users working on same canvas
2. Real-time updates trigger node group promotions
3. Each user sees relevant activity surface automatically
4. No manual window management required

---

*This architecture provides a foundation for rich, interactive node-based development while maintaining simplicity and performance.*
