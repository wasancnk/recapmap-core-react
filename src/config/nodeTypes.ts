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
 * Unified dark theme for most nodes, with special treatments for Note/Task/Case/View
 */
export const NODE_TYPE_CONFIGS: Record<NodeType, NodeTypeConfig> = {
  // Strategic Planning Nodes
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
  
  'persona': {
    type: 'persona',
    icon: '👤',
    label: 'Persona',
    bgColor: '#21262d', // GitHub's tertiary dark
    borderColor: '#f97316', // Orange border for distinction
    textColor: '#FFFFFF',
    category: 'human-centered',
    description: 'User personas and stakeholders',
    toolbarClassName: 'bg-orange-500 border-orange-600 text-white hover:bg-orange-600'
  },
  
  'interface': {
    type: 'interface',
    icon: '📱',
    label: 'Interface',
    bgColor: '#21262d', // GitHub's tertiary dark
    borderColor: '#10b981', // Green border for distinction
    textColor: '#FFFFFF',
    category: 'human-centered',
    description: 'User interfaces and screens',
    toolbarClassName: 'bg-green-500 border-green-600 text-white hover:bg-green-600'
  },
  
  'process': {
    type: 'process',
    icon: '⚙️',
    label: 'Process',
    bgColor: '#21262d', // GitHub's tertiary dark
    borderColor: '#8b5cf6', // Purple border for distinction
    textColor: '#FFFFFF',
    category: 'business-workflow',
    description: 'Business processes and workflows',
    toolbarClassName: 'bg-purple-500 border-purple-600 text-white hover:bg-purple-600'
  },
  
  'capability': {
    type: 'capability',
    icon: '⚡',
    label: 'Capability',
    bgColor: '#21262d', // GitHub's tertiary dark
    borderColor: '#3b82f6', // Blue border for distinction
    textColor: '#FFFFFF',
    category: 'strategic',
    description: 'System capabilities and expectations',
    toolbarClassName: 'bg-blue-500 border-blue-600 text-white hover:bg-blue-600'
  },
  
  'outcome': {
    type: 'outcome',
    icon: '✅',
    label: 'Outcome',
    bgColor: '#21262d', // GitHub's tertiary dark
    borderColor: '#10b981', // Emerald border for distinction
    textColor: '#FFFFFF',
    category: 'strategic',
    description: 'Expected outcomes and results',
    toolbarClassName: 'bg-emerald-500 border-emerald-600 text-white hover:bg-emerald-600'
  },
  
  'resource': {
    type: 'resource',
    icon: '📦',
    label: 'Resource',
    bgColor: '#21262d', // GitHub's tertiary dark
    borderColor: '#ec4899', // Pink border for distinction
    textColor: '#FFFFFF',
    category: 'information-assets',
    description: 'Resources and assets',
    toolbarClassName: 'bg-pink-500 border-pink-600 text-white hover:bg-pink-600'
  },
  
  'knowledge': {
    type: 'knowledge',
    icon: '🧠',
    label: 'Knowledge',
    bgColor: '#21262d', // GitHub's tertiary dark
    borderColor: '#06b6d4', // Cyan border for distinction
    textColor: '#FFFFFF',
    category: 'information-assets',
    description: 'Knowledge bases and information',
    toolbarClassName: 'bg-cyan-500 border-cyan-600 text-white hover:bg-cyan-600'
  },
  
  'storage': {
    type: 'storage',
    icon: '💾',
    label: 'Storage',
    bgColor: '#21262d', // GitHub's tertiary dark
    borderColor: '#6b7280', // Gray border for distinction
    textColor: '#FFFFFF',
    category: 'business-workflow',
    description: 'Data storage and persistence',
    toolbarClassName: 'bg-gray-500 border-gray-600 text-white hover:bg-gray-600'
  },
  
  // Meta-Collaboration Tools Nodes (Sticky Note Style)
  'task': {
    type: 'task',
    icon: '✔️',
    label: 'Task',
    bgColor: '#f9a8d4', // Bright pastel rose gold background
    borderColor: '#ec4899', // Darker pink border
    textColor: '#000000', // Pure black text
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
    textColor: '#000000', // Pure black text
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
  return Object.values(NODE_TYPE_CONFIGS);
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
