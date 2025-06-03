import React from 'react';
import type { NodeType } from '../types';

interface NodeTooltipProps {
  isVisible: boolean;
  position: { x: number; y: number };
  data: {
    label: string;
    description?: string;
    nodeType: NodeType;
  };
  nodeId: string;
}

const NodeTooltip: React.FC<NodeTooltipProps> = ({ isVisible, position, data, nodeId }) => {
  if (!isVisible) return null;

  // Node type configurations for tooltip display
  const nodeTypeConfig = {
    'usecase': { 
      icon: '🎯', 
      label: 'Use Case',
      color: '#3B82F6'
    },
    'screen': { 
      icon: '📱', 
      label: 'Screen',
      color: '#10B981'
    },
    'user': { 
      icon: '👤', 
      label: 'User',
      color: '#F59E0B'
    },
    'process': { 
      icon: '⚙️', 
      label: 'Process',
      color: '#8B5CF6'
    },
    'storage': { 
      icon: '💾', 
      label: 'Storage',
      color: '#F59E0B'
    },
    'controller': { 
      icon: '🎮', 
      label: 'Controller',
      color: '#EF4444'
    },
    'error': { 
      icon: '⚠️', 
      label: 'Error',
      color: '#6B7280'
    },
    'base': { 
      icon: '🔧', 
      label: 'Base',
      color: '#06B6D4'
    },
  };

  const config = nodeTypeConfig[data.nodeType] || nodeTypeConfig['usecase'];

  return (
    <div
      className="fixed z-50 pointer-events-none"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -120%)', // Center horizontally, position above cursor
      }}
    >
      <div 
        className="bg-gray-900 border border-gray-600 rounded-lg shadow-xl p-3 min-w-64 max-w-80"
        style={{
          backgroundColor: '#1f2937',
          borderColor: config.color,
          borderWidth: '1px',
        }}
      >
        {/* Tooltip Header */}
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-700">
          <span className="text-lg">{config.icon}</span>
          <div className="flex-1">
            <div className="text-xs uppercase font-medium opacity-75" style={{ color: config.color }}>
              {config.label}
            </div>
            <div className="text-xs text-gray-400 font-mono">
              ID: {nodeId}
            </div>
          </div>
        </div>

        {/* Tooltip Content */}
        <div className="space-y-2">
          {/* Title */}
          <div>
            <div className="text-sm font-medium text-gray-300 mb-1">Title</div>
            <div className="text-white font-semibold leading-tight">
              {data.label}
            </div>
          </div>

          {/* Description */}
          {data.description && (
            <div>
              <div className="text-sm font-medium text-gray-300 mb-1">Description</div>
              <div className="text-gray-200 text-sm leading-relaxed">
                {data.description}
              </div>
            </div>
          )}

          {/* Brief Details */}
          <div>
            <div className="text-sm font-medium text-gray-300 mb-1">Details</div>
            <div className="text-gray-200 text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-400">Type:</span>
                <span>{config.label}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Node ID:</span>
                <span className="font-mono text-xs">{nodeId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className="text-green-400">Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tooltip Arrow */}
        <div 
          className="absolute top-full left-1/2 transform -translate-x-1/2"
          style={{
            width: 0,
            height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: `6px solid ${config.color}`,
          }}
        />
      </div>
    </div>
  );
};

export default NodeTooltip;
