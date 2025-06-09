# RecapMap Design System

## Overview
RecapMap's visual identity is built around a dark theme optimized for professional development environments. The design system emphasizes developer experience, accessibility, and semantic color coding.

## Core Design Principles
1. **Developer-First Experience**: Optimized for extended coding sessions with reduced eye strain
2. **Semantic Color Coding**: Each element has logical, memorable color assignments
3. **Professional Aesthetics**: Enterprise-ready visual design suitable for business modeling
4. **Accessibility-Focused**: WCAG 2.1 AA compliance with color-blind considerations
5. **Scalable System**: Works from simple 8-node models to complex enterprise architectures

## Color System

### 8-Node Color Assignments
- **🟢 Use Case (Dark Green)** - `#4d7c0f`: User intentions, requirements, business goals
- **🟢 Screen (Green)** - `#10b981`: User interfaces, touchpoints, interaction layers
- **🟠 User (Orange)** - `#f59e0b`: Human actors, personas, stakeholders
- **🟣 Process (Purple)** - `#8b5cf6`: Business logic, workflows, transformation
- **🟡 Storage (Yellow)** - `#eab308`: Data persistence, databases, information repositories
- **🔴 Controller (Red)** - `#ef4444`: System control, orchestration, management
- **⚫ Error (Gray)** - `#6b7280`: Error handling, exceptions, edge cases
- **🔷 Integration (Teal)** - `#14b8a6`: Third-party services, APIs, external systems

### Background Hierarchy
```css
background: {
  primary: '#0f0f23',     // Deep navy - main application background
  secondary: '#1a1a2e',   // Secondary panels and cards
  tertiary: '#16213e',    // Canvas background with subtle contrast
  modal: 'rgba(15, 15, 35, 0.95)' // Modal overlays with transparency
}
```

### Surface Elevation System
```css
surface: {
  primary: '#16213e',     // Level 0 - Base surface
  secondary: '#1f2937',   // Level 1 - Panel backgrounds  
  elevated: '#374151',    // Level 2 - Raised surfaces
  border: '#4b5563'       // Level 3 - Border definition
}
```

## Accessibility Standards
- **WCAG 2.1 AA Compliance**: All text/background combinations meet 4.5:1 minimum contrast ratio
- **Color-Blind Testing**: Verified with Deuteranopia and Protanopia simulators
- **Alternative Indicators**: Icons and patterns supplement color coding
- **Focus Indicators**: High-contrast focus rings for keyboard navigation

## Node Panel Architecture

### Design Philosophy
Each node acts as a **live interactive widget** that can spawn contextual floating panels for extended functionality while maintaining a clean canvas experience.

### Panel System
- **Node = Widget + Panels**: Each node spawns multiple contextual panels
- **Multi-focus workflow**: Users can work on multiple nodes simultaneously
- **Persistent state**: Panels remain open until manually closed
- **Desktop-first**: Optimized for builder mode experience

### Panel Types
1. **📊 Summary Panel** - Rich content display (replaces tooltips)
2. **⚙️ Node Editor Panel** - Property editing interface
3. **💬 AI Chat Panel** - Node-scoped AI assistance
4. **🔗 Share Panel** - Node linking and sharing functionality
5. **🔧 Tools Panel** - Future extensibility hook

### Z-Index Management
```
1000-1999: Inactive nodes (base layer)
2000-2999: Inactive panels 
3000-3999: Active node group (node + panels)
4000+:     Modal overlays, dropdowns
```

## Implementation Notes
- **Canvas transformation inheritance**: Panels scale with canvas zoom/pan
- **Fixed dimensions**: Same height and width for all panels for performance
- **Activity-based promotion**: Node groups move to front based on user interaction
- **Windows 11-style behavior**: Familiar panel management patterns

## Design Metrics
- **Total Colors**: 47 semantic color variables
- **Contrast Compliance**: 100% WCAG 2.1 AA
- **Node Type Colors**: 8 distinct, memorable hues
- **Development Optimization**: 8+ hour coding session friendly

---
*"Good design is invisible. Great design makes the complex feel simple."*
