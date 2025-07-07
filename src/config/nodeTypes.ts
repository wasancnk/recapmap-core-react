import type { NodeType } from '../types';

/**
 * CENTRALIZED NODE TYPE CONFIGURATION
 * 
 * This is the single source of truth for all node type definitions.
 * Used across components: nodes/NodeBase, Toolbar, Panels, etc.
 * 
 * UPDATE POLICY: Only modify this file to change node configurations.
 * All other files should import and use these definitions.
 */

export interface NodeTypeConfig {
  type: NodeType;
  icon: string;
  label: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  category: 'strategic' | 'human-centered' | 'business-workflow' | 'information-assets' | 'meta-collaboration';
  description?: string;
  // Toolbar-specific styling
  toolbarClassName: string;
  hasStripePattern?: boolean;
}

/**
 * Complete 12-Node Universal System Configuration
 * Professional color distribution with Storage as neutral gray
 * 
 * PROFESSIONAL COLOR PALETTE - Optimal Spectrum Distribution:
 * - 8 Regular nodes: Strategic distribution across color spectrum for visual harmony
 * - Storage as neutral gray (infrastructure utility)
 * - Consistent saturation and contrast for accessibility (WCAG AA compliant)
 * - Task & Note: Bright sticky note colors (unchanged)
 * - Case & View: Special striped patterns (unchanged)
 * - Blueprint & Snippet: Special patterns with distinctive designs
 * 
 * Color Distribution:
 * Magenta (Persona) → Red-Orange (Interface) → Yellow (Process) → Green (Capability) → 
 * Improved Teal (Outcome) → Blue (Resource) → Purple (Knowledge) → Gray (Storage)
 */
export const NODE_TYPE_CONFIGS: Record<NodeType, NodeTypeConfig> = {
  // Strategic Planning Nodes (Special striped patterns)
  'case': {
    type: 'case',
    icon: '📋',
    label: 'Case',
    bgColor: '#22543d', // Special: Dark green with stripes
    borderColor: '#4d7c0f',
    textColor: '#FFFFFF',
    category: 'strategic',
    description: 'Business use cases and scenarios',
    toolbarClassName: 'bg-lime-700 border-lime-800 text-white hover:bg-lime-800 usecase-stripes',
    hasStripePattern: true
  },
  
  'view': {
    type: 'view',
    icon: '📽️',
    label: 'View',
    bgColor: '#312e81', // Special: Dark indigo with stripes
    borderColor: '#4f46e5',
    textColor: '#FFFFFF',
    category: 'human-centered',
    description: 'Presentation layers and views',
    toolbarClassName: 'bg-indigo-600 border-indigo-700 text-white hover:bg-indigo-700 presentation-stripes',
    hasStripePattern: true
  },

  // 8 Regular Nodes - Professional Spectrum Distribution with Storage as Neutral Gray
  'persona': {
    type: 'persona',
    icon: '👤',
    label: 'Persona',
    bgColor: '#21262d', // GitHub's tertiary dark
    borderColor: '#e91e63', // Magenta - Human-focused, vibrant
    textColor: '#FFFFFF',
    category: 'human-centered',
    description: 'User personas and stakeholders',
    toolbarClassName: 'bg-pink-500 border-pink-600 text-white hover:bg-pink-600'
  },
  
  'interface': {
    type: 'interface',
    icon: '📱',
    label: 'Interface',
    bgColor: '#21262d', // GitHub's tertiary dark
    borderColor: '#fd7e14', // Red-Orange - Digital interaction, distinct from yellow
    textColor: '#FFFFFF',
    category: 'human-centered',
    description: 'User interfaces and screens',
    toolbarClassName: 'bg-orange-600 border-orange-700 text-white hover:bg-orange-700'
  },
  
  'process': {
    type: 'process',
    icon: '⚙️',
    label: 'Process',
    bgColor: '#21262d', // GitHub's tertiary dark
    borderColor: '#f1c40f', // Yellow - Active workflow, energy
    textColor: '#FFFFFF',
    category: 'business-workflow',
    description: 'Business processes and workflows',
    toolbarClassName: 'bg-yellow-500 border-yellow-600 text-white hover:bg-yellow-600'
  },
  
  'capability': {
    type: 'capability',
    icon: '⚡',
    label: 'Capability',
    bgColor: '#21262d', // GitHub's tertiary dark
    borderColor: '#2ecc71', // Green - Growth, power, potential
    textColor: '#FFFFFF',
    category: 'strategic',
    description: 'System capabilities and expectations',
    toolbarClassName: 'bg-green-500 border-green-600 text-white hover:bg-green-600'
  },
  
  'outcome': {
    type: 'outcome',
    icon: '✅',
    label: 'Outcome',
    bgColor: '#21262d', // GitHub's tertiary dark
    borderColor: '#5fb4d0', // Brighter blue-teal - Better separation from Resource node
    textColor: '#FFFFFF',
    category: 'strategic',
    description: 'Expected outcomes and results',
    toolbarClassName: 'bg-sky-500 border-sky-600 text-white hover:bg-sky-600'
  },
  
  'resource': {
    type: 'resource',
    icon: '📦',
    label: 'Resource',
    bgColor: '#21262d', // GitHub's tertiary dark
    borderColor: '#3498db', // Blue - Reliability, assets, materials
    textColor: '#FFFFFF',
    category: 'information-assets',
    description: 'Resources and assets',
    toolbarClassName: 'bg-blue-500 border-blue-600 text-white hover:bg-blue-600'
  },
  
  'knowledge': {
    type: 'knowledge',
    icon: '🧠',
    label: 'Knowledge',
    bgColor: '#21262d', // GitHub's tertiary dark
    borderColor: '#9b59b6', // Purple - Wisdom, intellect, information
    textColor: '#FFFFFF',
    category: 'information-assets',
    description: 'Knowledge bases and information',
    toolbarClassName: 'bg-purple-500 border-purple-600 text-white hover:bg-purple-600'
  },
  
  'storage': {
    type: 'storage',
    icon: '💾',
    label: 'Storage',
    bgColor: '#21262d', // GitHub's tertiary dark
    borderColor: '#7f8c8d', // Gray - Neutral infrastructure, utility
    textColor: '#FFFFFF',
    category: 'business-workflow',
    description: 'Data storage and persistence',
    toolbarClassName: 'bg-gray-500 border-gray-600 text-white hover:bg-gray-600'
  },

  // New Node Types - Blueprint with Subtle Dark Pattern, Snippet with HSL Distribution
  'blueprint': {
    type: 'blueprint',
    icon: '📐',
    label: 'Blueprint',
    bgColor: '#1e293b', // Much darker blue-gray base (like Case/View approach)
    borderColor: '#4682b4', // Steel blue border
    textColor: '#FFFFFF', // White text for dark background
    category: 'information-assets',
    description: 'Architecture blueprints and technical designs',
    toolbarClassName: 'bg-slate-700 border-blue-500 text-white hover:bg-slate-600 blueprint-grid',
    hasStripePattern: true
  },

  'snippet': {
    type: 'snippet',
    icon: '🧩',
    label: 'Snippet',
    bgColor: '#1a1527', // Modern Pink base color (will be overridden by pattern)
    borderColor: '#e91e63', // HSL(324°, 65%, 55%) - Pink - code, reusable components
    textColor: '#FFFFFF',
    category: 'information-assets',
    description: 'Code snippets and reusable components',
    toolbarClassName: 'bg-pink-600 border-pink-700 text-white hover:bg-pink-700 snippet-pattern',
    hasStripePattern: true
  },

  // Meta-Collaboration Tools Nodes (Sticky Note Style)
  'task': {
    type: 'task',
    icon: '✔️',
    label: 'Task',
    bgColor: '#f9a8d4', // Bright pastel rose gold background
    borderColor: '#ec4899', // Darker pink border
    textColor: '#1f2937', // Dark gray text (softer than pure black)
    category: 'meta-collaboration',
    description: 'Tasks and action items',
    toolbarClassName: 'bg-rose-300 border-rose-400 text-black hover:bg-rose-400'
  },
  
  'note': {
    type: 'note',
    icon: '🖊️',
    label: 'Note',
    bgColor: '#fde047', // Bright pastel yellow background
    borderColor: '#eab308', // Darker yellow border
    textColor: '#1f2937', // Dark gray text (softer than pure black)
    category: 'meta-collaboration',
    description: 'Notes and annotations',
    toolbarClassName: 'bg-yellow-300 border-yellow-400 text-black hover:bg-yellow-400'
  }
};

/**
 * Helper functions for working with node configurations
 */
export const getNodeConfig = (nodeType: NodeType): NodeTypeConfig => {
  const config = NODE_TYPE_CONFIGS[nodeType];
  if (!config) {
    console.error(`Invalid node type: "${nodeType}". Available types:`, Object.keys(NODE_TYPE_CONFIGS));
    throw new Error(`Invalid node type: "${nodeType}"`);
  }
  return config;
};

export const getNodesByCategory = (category: NodeTypeConfig['category']): NodeTypeConfig[] => {
  return Object.values(NODE_TYPE_CONFIGS).filter(config => config.category === category);
};

export const getAllNodeTypes = (): NodeTypeConfig[] => {
  // Custom order for toolbar: regular nodes first, then internal-only nodes at bottom
  const nodeOrder: NodeType[] = [
    // Row 1: Strategic Planning (striped patterns)
    'case', 'view',
    // Row 2: Human-Centered Design  
    'persona', 'interface',
    // Row 3: Business Workflow
    'process', 'capability',
    // Row 4: Information Assets & Outcomes
    'outcome', 'resource',
    // Row 5: Knowledge & Storage
    'knowledge', 'storage',
    // Row 6: Meta-Collaboration (sticky notes)
    'task', 'note',
    // Row 7: Internal-Only Tools (visually separated)
    'blueprint', 'snippet'
  ];
  
  return nodeOrder.map(nodeType => NODE_TYPE_CONFIGS[nodeType]);
};

// Legacy format for backward compatibility (can be removed after migration)
export const getLegacyNodeTypeConfig = () => {
  const legacy: Record<string, {
    icon: string;
    label: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
  }> = {};
  Object.entries(NODE_TYPE_CONFIGS).forEach(([key, config]) => {
    legacy[key] = {
      icon: config.icon,
      label: config.label,
      bgColor: config.bgColor,
      borderColor: config.borderColor,
      textColor: config.textColor
    };
  });
  return legacy;
};
