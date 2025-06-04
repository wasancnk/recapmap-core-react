import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { useUIStore } from '../stores/uiStore';
import { useNodeStore } from '../stores/nodeStore';
import { usePanelStore } from '../stores/panelStore';
import type { NodeType } from '../types';

// Professional card-style node component
const NewCustomNode = ({ 
  id, 
  data, 
  selected 
}: { 
  id: string;
  data: { label: string; description?: string; nodeType: NodeType }; 
  selected: boolean 
}) => {  const { openPanel } = useUIStore();
  const { deleteNode } = useNodeStore();
  const { openPanel: openNodePanel } = usePanelStore();
  const [isHovered, setIsHovered] = React.useState(false);
  const [connectingFromHandle, setConnectingFromHandle] = React.useState<string | null>(null);

  // Node type configurations with icons and colors
  const nodeTypeConfig = {
    'usecase': { 
      icon: '🎯', 
      label: 'Use Case',
      bgColor: '#1e1e2f',
      borderColor: '#3B82F6', // Blue
      textColor: '#FFFFFF'
    },
    'screen': { 
      icon: '📱', 
      label: 'Screen',
      bgColor: '#1e1e2f',
      borderColor: '#10B981', // Green
      textColor: '#FFFFFF'
    },
    'user': { 
      icon: '👤', 
      label: 'User',
      bgColor: '#1e1e2f',
      borderColor: '#F59E0B', // Orange
      textColor: '#FFFFFF'
    },
    'process': { 
      icon: '⚙️', 
      label: 'Process',
      bgColor: '#1e1e2f',
      borderColor: '#8B5CF6', // Purple
      textColor: '#FFFFFF'
    },
    'storage': { 
      icon: '💾', 
      label: 'Storage',
      bgColor: '#1e1e2f',
      borderColor: '#F59E0B', // Yellow
      textColor: '#FFFFFF'
    },
    'controller': { 
      icon: '🎮', 
      label: 'Controller',
      bgColor: '#1e1e2f',
      borderColor: '#EF4444', // Red
      textColor: '#FFFFFF'
    },
    'error': { 
      icon: '⚠️', 
      label: 'Error',
      bgColor: '#1e1e2f',
      borderColor: '#6B7280', // Gray
      textColor: '#FFFFFF'
    },
    'base': { 
      icon: '🔧', 
      label: 'Base',
      bgColor: '#1e1e2f',
      borderColor: '#06B6D4', // Cyan
      textColor: '#FFFFFF'
    },
  };

  const config = nodeTypeConfig[data.nodeType] || nodeTypeConfig['usecase'];
  const selectedStyle = selected ? 'ring-2 ring-white shadow-glow' : '';

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Calculate adaptive position for the property panel
    const calculateAdaptivePosition = (mouseX: number, mouseY: number) => {
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
      
      // Panel dimensions with some safety margin
      const panelWidth = 400;
      const panelHeight = 620;
      const margin = 20;
      
      // Available space calculations
      const availableRight = viewport.width - mouseX - margin;
      const availableLeft = mouseX - margin;
      const availableBelow = viewport.height - mouseY - margin;
      const availableAbove = mouseY - margin;

      // Determine best horizontal position
      let x: number;
      const minHorizontalSpace = Math.min(panelWidth, 320);
      
      if (availableRight >= minHorizontalSpace) {
        x = Math.min(mouseX + 20, viewport.width - panelWidth - margin);
      } else if (availableLeft >= minHorizontalSpace) {
        x = Math.max(mouseX - panelWidth - 20, margin);
      } else {
        x = availableRight >= availableLeft ? viewport.width - panelWidth - margin : margin;
      }

      // Determine best vertical position
      let y: number;
      const minVerticalSpace = Math.min(panelHeight, 400);
      
      if (availableBelow >= minVerticalSpace) {
        y = Math.min(mouseY + 20, viewport.height - panelHeight - margin);
      } else if (availableAbove >= minVerticalSpace) {
        y = Math.max(mouseY - panelHeight - 20, margin);
      } else {
        y = availableBelow >= availableAbove ? viewport.height - panelHeight - margin : margin;
      }
      
      // Final bounds check
      x = Math.max(margin, Math.min(x, viewport.width - panelWidth - margin));
      y = Math.max(margin, Math.min(y, viewport.height - panelHeight - margin));
      
      return { x, y };
    };    
    const position = calculateAdaptivePosition(e.clientX, e.clientY);
    openPanel('node-properties', { nodeId: id }, position);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    deleteNode(id);
  };  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setConnectingFromHandle(null);
  };
  // Show connectors when hovering or when connecting
  const showConnectors = isHovered || connectingFromHandle || selected;  return (
    <div 
      className={`
        rounded-lg border-2 
        transition-all duration-200 hover:bg-opacity-90 cursor-pointer
        relative flex flex-col
        node-uniform-size node-grid-aligned
        ${selectedStyle}
      `}
        style={{
          backgroundColor: config.bgColor,
          borderColor: config.borderColor,
          color: config.textColor,
          width: '200px',        // Wider for better card layout
          height: '160px',       // Fixed height for consistency
          padding: '12px',       // Standard node padding
        }}
        onDoubleClick={handleDoubleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        title={`${data.label}${data.description ? ` - ${data.description}` : ''}`}
        data-node-type={data.nodeType}
      >
      {/* Connection Handles - All positions */}
      {/* TOP Handles */}
      <Handle
        type="source"
        position={Position.Top}
        id="top-source"
        isConnectable={true}
        style={{
          position: 'absolute',
          top: -4,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 8,
          height: 8,
          backgroundColor: showConnectors ? '#60A5FA' : '#9CA3AF',
          border: '1px solid white',
          borderRadius: '50%',
          cursor: 'crosshair',
          opacity: showConnectors ? 1 : 0,
          transition: 'all 0.2s ease',
          zIndex: 10
        }}
      />
      <Handle
        type="target"
        position={Position.Top}
        id="top-target"
        isConnectable={true}
        style={{
          position: 'absolute',
          top: -8,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 16,
          height: 16,
          backgroundColor: 'transparent',
          border: 'none',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: 5
        }}
      />

      {/* RIGHT Handles */}
      <Handle
        type="source"
        position={Position.Right}
        id="right-source"
        isConnectable={true}
        style={{
          position: 'absolute',
          right: -4,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 8,
          height: 8,
          backgroundColor: showConnectors ? '#60A5FA' : '#9CA3AF',
          border: '1px solid white',
          borderRadius: '50%',
          cursor: 'crosshair',
          opacity: showConnectors ? 1 : 0,
          transition: 'all 0.2s ease',
          zIndex: 10
        }}
      />
      <Handle
        type="target"
        position={Position.Right}
        id="right-target"
        isConnectable={true}
        style={{
          position: 'absolute',
          right: -8,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 16,
          height: 16,
          backgroundColor: 'transparent',
          border: 'none',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: 5
        }}
      />

      {/* BOTTOM Handles */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-source"
        isConnectable={true}
        style={{
          position: 'absolute',
          bottom: -4,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 8,
          height: 8,
          backgroundColor: showConnectors ? '#60A5FA' : '#9CA3AF',
          border: '1px solid white',
          borderRadius: '50%',
          cursor: 'crosshair',
          opacity: showConnectors ? 1 : 0,
          transition: 'all 0.2s ease',
          zIndex: 10
        }}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom-target"
        isConnectable={true}
        style={{
          position: 'absolute',
          bottom: -8,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 16,
          height: 16,
          backgroundColor: 'transparent',
          border: 'none',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: 5
        }}
      />

      {/* LEFT Handles */}
      <Handle
        type="source"
        position={Position.Left}
        id="left-source"
        isConnectable={true}
        style={{
          position: 'absolute',
          left: -4,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 8,
          height: 8,
          backgroundColor: showConnectors ? '#60A5FA' : '#9CA3AF',
          border: '1px solid white',
          borderRadius: '50%',
          cursor: 'crosshair',
          opacity: showConnectors ? 1 : 0,
          transition: 'all 0.2s ease',
          zIndex: 10
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left-target"
        isConnectable={true}
        style={{
          position: 'absolute',
          left: -8,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 16,
          height: 16,
          backgroundColor: 'transparent',
          border: 'none',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: 5
        }}
      />

      {/* Node Header - Type and Delete Button */}
      <div className="flex justify-between items-start mb-2">
        {/* Node Type Label */}
        <div className="flex items-center gap-1 text-xs opacity-75">
          <span>{config.icon}</span>
          <span className="uppercase font-medium">{config.label}</span>
        </div>
        
        {/* Delete Button */}
        <button
          onClick={handleDeleteClick}
          className="text-xs opacity-60 hover:opacity-100 transition-opacity duration-200 hover:text-red-400"
          title="Delete Node"
        >
          ✕        </button>
      </div>

      {/* Panel Toggle Buttons - Show on hover */}
      {isHovered && (
        <div className="flex gap-1 mb-2 opacity-90">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openNodePanel(id, 'summary');
            }}
            className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded hover:bg-blue-500/30 transition-colors"
            title="Show Summary Panel"
          >
            📋
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              openNodePanel(id, 'editor');
            }}
            className="text-xs px-2 py-1 bg-green-500/20 text-green-300 rounded hover:bg-green-500/30 transition-colors"
            title="Show Editor Panel"
          >
            ✏️
          </button>
        </div>
      )}

      {/* Node Title - Center */}
      <div className="flex-1 flex flex-col justify-center">
        <div 
          className="font-bold text-base leading-tight text-left mb-2"
          style={{
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            wordWrap: 'break-word',
            hyphens: 'auto',
          }}
          title={data.label}
        >
          {data.label}
        </div>
        
        {/* Node Description - Bottom Section */}
        {data.description && (
          <div 
            className="text-sm opacity-70 leading-tight text-left"
            style={{
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              wordWrap: 'break-word',
              hyphens: 'auto',
            }}
            title={data.description}
          >
            {data.description}
          </div>        )}
      </div>
    </div>
  );
};

export default NewCustomNode;
