/**
 * Node Constants & Configuration
 */

// Z-INDEX LOGIC - Dynamic z-index constants for node layering
export const NODE_Z_INDEX = {
  INACTIVE: 10,    // Default state
  HOVER: 50,       // Mouse hover
  SELECTED: 75,    // Selected state
  ELEVATED: 90,    // Active interaction (drag, panel open)
} as const;

// Node dimensions
export const NODE_DIMENSIONS = {
  WIDTH: 200,
  HEIGHT: 160,
  PADDING: 12,
} as const;

// Handle styling constants
export const HANDLE_STYLES = {
  SOURCE: {
    width: 11,
    height: 11,
    border: '1px solid white',
    borderRadius: '50%',
    cursor: 'crosshair',
    transition: 'all 0.2s ease',
    zIndex: 10,
  },
  TARGET: {
    width: 17,
    height: 17,
    backgroundColor: 'transparent',
    border: 'none',
    opacity: 0,
    pointerEvents: 'none' as const,
    zIndex: 5,
  },
  COLORS: {
    VISIBLE: '#60A5FA',
    HIDDEN: '#9CA3AF',
  },
} as const;

// Panel positioning
export const PANEL_POSITIONING = {
  OFFSET_X: 190,
  SPACING: 10,
  OFFSET_Y: 0,
  HEIGHT: 400,
} as const;

// Node state type
export type NodeState = 'inactive' | 'hover' | 'selected' | 'elevated';
