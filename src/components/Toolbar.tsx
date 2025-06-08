import React from 'react';
import { useNodeStore } from '../stores/nodeStore';
import { useUIStore } from '../stores/uiStore';
import { useDraggable } from '../hooks/useDraggable';
import type { NodeType } from '../types';

interface NodeButtonProps {
  nodeType: NodeType;
  label: string;
  className: string;
  icon: string;
}

const NodeButton: React.FC<NodeButtonProps> = ({ nodeType, label, className, icon }) => {
  const { addNode } = useNodeStore();

  const handleAddNode = () => {
    // Add node at center of current viewport with some randomness
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    addNode(nodeType, { 
      x: centerX + (Math.random() - 0.5) * 200, 
      y: centerY + (Math.random() - 0.5) * 200 
    });
  };

  return (
    <button
      onClick={handleAddNode}
      className={`
        ${className} px-3 py-2 rounded-lg border-2 font-medium text-sm
        transition-all duration-200 hover:shadow-md hover:scale-105
        flex items-center gap-2 min-w-[120px] justify-center
      `}
      title={`Add ${label} Node`}
    >
      <span className="text-lg">{icon}</span>
      {label}
    </button>
  );
};

export const Toolbar: React.FC = () => {
  const { nodes, connections } = useNodeStore();
  const { addNotification, openPanel, ui, toggleSnapToGrid, toggleGrid } = useUIStore();

  // Stable initial position to prevent re-render loops
  const initialPosition = React.useMemo(() => ({ x: 16, y: 16 }), []);

  // Initialize draggable functionality
  const { position: draggablePosition, dragRef, dragHandleProps } = useDraggable({
    initialPosition,
  });

  const nodeTypes: Array<{
    type: NodeType;
    label: string;
    className: string;
    icon: string;
  }> = [
    {
      type: 'usecase',
      label: 'Use Case',
      className: 'bg-blue-500 border-blue-600 text-white hover:bg-blue-600',
      icon: '🎯'
    },
    {
      type: 'screen',
      label: 'Screen',
      className: 'bg-green-500 border-green-600 text-white hover:bg-green-600',
      icon: '📱'
    },
    {
      type: 'user',
      label: 'User',
      className: 'bg-orange-500 border-orange-600 text-white hover:bg-orange-600',
      icon: '👤'
    },
    {
      type: 'process',
      label: 'Process',
      className: 'bg-purple-500 border-purple-600 text-white hover:bg-purple-600',
      icon: '⚙️'
    },
    {
      type: 'storage',
      label: 'Storage',
      className: 'bg-yellow-500 border-yellow-600 text-black hover:bg-yellow-600',
      icon: '💾'
    },
    {
      type: 'controller',
      label: 'Controller',
      className: 'bg-red-500 border-red-600 text-white hover:bg-red-600',
      icon: '🎮'
    },
    {
      type: 'error',
      label: 'Error',
      className: 'bg-gray-500 border-gray-600 text-white hover:bg-gray-600',
      icon: '⚠️'
    },    {
      type: 'base',
      label: 'Base',
      className: 'bg-cyan-500 border-cyan-600 text-white hover:bg-cyan-600',
      icon: '🏗️'
    },
  ];
  const handleClearAll = () => {
    if (nodes.length > 0 || connections.length > 0) {
      if (window.confirm('Are you sure you want to clear all nodes and connections?')) {
        // For now, we'll implement this when we add the clearAll method to the store
        addNotification({ 
          type: 'info', 
          title: 'Info',
          message: 'Clear all functionality coming soon!' 
        });
      }
    }
  };

  const handleExport = () => {
    openPanel('export');
  };
  return (
    <div 
      ref={dragRef}
      className="fixed z-panel-base"
      style={{ 
        left: draggablePosition.x, 
        top: draggablePosition.y 
      }}
    >
      <div className="bg-surface-primary border border-surface-border rounded-lg shadow-lg p-4">
        {/* Drag Handle */}
        <div 
          className="flex justify-center py-2 cursor-grab active:cursor-grabbing select-none"
          {...dragHandleProps}
        >
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-text-muted rounded-full"></div>
            <div className="w-1 h-1 bg-text-muted rounded-full"></div>
            <div className="w-1 h-1 bg-text-muted rounded-full"></div>
            <div className="w-1 h-1 bg-text-muted rounded-full"></div>
          </div>
        </div>
        
        <h3 className="text-text-primary font-semibold mb-3 text-sm">Add Nodes</h3>
        
        {/* Node Type Buttons Grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {nodeTypes.map((nodeType) => (
            <NodeButton
              key={nodeType.type}
              nodeType={nodeType.type}
              label={nodeType.label}
              className={nodeType.className}
              icon={nodeType.icon}
            />
          ))}
        </div>

        {/* Grid Controls */}
        <div className="border-t border-surface-border pt-3 mb-4">
          <h4 className="text-text-primary font-semibold mb-2 text-xs">Grid Options</h4>
          
          <div className="space-y-2">            <button
              onClick={toggleGrid}
              className={`
                w-full px-3 py-2 rounded text-sm font-medium transition-colors
                ${ui.isGridVisible 
                  ? 'bg-accent-primary text-white border border-accent-primary hover:bg-accent-primary/90' 
                  : 'bg-surface-secondary text-text-secondary border border-surface-border hover:bg-surface-tertiary'
                }
              `}
              title="Toggle grid visibility (Ctrl+Shift+G)"
            >
              <span className="mr-2">{ui.isGridVisible ? '✓' : '○'}</span>
              Show Grid
            </button>
            
            <button
              onClick={toggleSnapToGrid}
              className={`
                w-full px-3 py-2 rounded text-sm font-medium transition-colors
                ${ui.snapToGrid 
                  ? 'bg-accent-primary text-white border border-accent-primary hover:bg-accent-primary/90' 
                  : 'bg-surface-secondary text-text-secondary border border-surface-border hover:bg-surface-tertiary'
                }
              `}
              title="Toggle snap to grid (Ctrl+G)"
            >
              <span className="mr-2">{ui.snapToGrid ? '⚡' : '○'}</span>
              Snap to Grid
            </button>
          </div>
        </div>        {/* Canvas Actions */}
        <div className="border-t border-surface-border pt-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-text-secondary text-xs">
              Nodes: {nodes.length} | Connections: {connections.length}
            </span>
          </div>
          
          <div className="space-y-2">
            <button
              onClick={handleExport}
              className="
                w-full px-3 py-2 bg-accent-primary border border-accent-primary text-white rounded
                hover:bg-accent-primary/90 transition-colors text-sm font-medium
                disabled:opacity-50 disabled:cursor-not-allowed
              "
              disabled={nodes.length === 0}
            >
              Export YAML
            </button>
            
            <button
              onClick={handleClearAll}
              className="
                w-full px-3 py-2 bg-red-500 border border-red-600 text-white rounded
                hover:bg-red-600 transition-colors text-sm font-medium
                disabled:opacity-50 disabled:cursor-not-allowed
              "
              disabled={nodes.length === 0 && connections.length === 0}
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
