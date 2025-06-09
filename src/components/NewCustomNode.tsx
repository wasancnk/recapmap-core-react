import * as React from 'react';
import { Handle, Position } from '@xyflow/react';
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
}) => {  const { deleteNode } = useNodeStore();
  const panelStore = usePanelStore();  const [isHovered, setIsHovered] = React.useState(false);
  const [connectingFromHandle, setConnectingFromHandle] = React.useState<string | null>(null);
  const [isToggling, setIsToggling] = React.useState(false);

  // Node type configurations with icons and colors
  const nodeTypeConfig = {    'usecase': { 
      icon: '🎯', 
      label: 'Use Case',
      bgColor: '#1e1e2f',
      borderColor: '#4d7c0f', // Darker green-lime
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
      textColor: '#FFFFFF'    },
    'concept': { 
      icon: '💡', 
      label: 'Concept',
      bgColor: '#1e1e2f',
      borderColor: '#06B6D4', // Cyan
      textColor: '#FFFFFF'    },    'presentation': { 
      icon: '📽️', 
      label: 'Presentation',
      bgColor: '#1e1e2f',
      borderColor: '#4F46E5', // Darker/richer Indigo
      textColor: '#FFFFFF'
    },
    'attachment': { 
      icon: '📎', 
      label: 'Attachment',
      bgColor: '#1e1e2f',
      borderColor: '#EC4899', // Pink
      textColor: '#FFFFFF'
    },
  };

  const config = nodeTypeConfig[data.nodeType] || nodeTypeConfig['usecase'];
  const selectedStyle = selected ? 'ring-2 ring-white shadow-glow' : '';  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Toggle editor panel on double-click
    if (panelStore.isPanelOpen(id, 'editor')) {
      panelStore.closePanel(id, 'editor');
    } else {
      panelStore.openPanel(id, 'editor');
    }
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
  };  // Toggle functions for panels
  const toggleSummaryPanel = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (isToggling) {
      console.log(`[${id}] Summary panel toggle ignored - already toggling`);
      return;
    }
    
    setIsToggling(true);
    
    const isCurrentlyOpen = panelStore.isPanelOpen(id, 'summary');
    console.log(`[${id}] Summary panel toggle - currently open: ${isCurrentlyOpen}`);
    
    if (isCurrentlyOpen) {
      panelStore.closePanel(id, 'summary');
    } else {
      panelStore.openPanel(id, 'summary');
    }
    
    // Reset toggle state after a short delay
    setTimeout(() => setIsToggling(false), 100);
  }, [id, panelStore, isToggling]);

  const toggleEditorPanel = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (isToggling) {
      console.log(`[${id}] Editor panel toggle ignored - already toggling`);
      return;
    }
    
    setIsToggling(true);
    
    const isCurrentlyOpen = panelStore.isPanelOpen(id, 'editor');
    console.log(`[${id}] Editor panel toggle - currently open: ${isCurrentlyOpen}`);
    
    if (isCurrentlyOpen) {
      panelStore.closePanel(id, 'editor');
    } else {
      panelStore.openPanel(id, 'editor');
    }
    
    // Reset toggle state after a short delay
    setTimeout(() => setIsToggling(false), 100);
  }, [id, panelStore, isToggling]);
  // Show connectors when hovering or when connecting
  const showConnectors = isHovered || connectingFromHandle || selected;
  // Special styling for anchor nodes (presentation and usecase) with stripe patterns
  const nodeStyle = data.nodeType === 'presentation' ? {
    backgroundColor: config.bgColor,
    borderColor: config.borderColor,
    color: config.textColor,
    width: '200px',
    height: '160px', 
    padding: '12px',
    backgroundImage: 'linear-gradient(45deg, #4f46e5 25%, #6366f1 25%, #6366f1 50%, #4f46e5 50%, #4f46e5 75%, #6366f1 75%)',
    backgroundSize: '8px 8px'  } : data.nodeType === 'usecase' ? {
    backgroundColor: config.bgColor,
    borderColor: config.borderColor,
    color: config.textColor,
    width: '200px',
    height: '160px', 
    padding: '12px',
    backgroundImage: 'linear-gradient(45deg, #4d7c0f 25%, #65a30d 25%, #65a30d 50%, #4d7c0f 50%, #4d7c0f 75%, #65a30d 75%)',
    backgroundSize: '8px 8px'
  } : {
    backgroundColor: config.bgColor,
    borderColor: config.borderColor,
    color: config.textColor,
    width: '200px',
    height: '160px',
    padding: '12px'
  };
  return (
    <div 
      className={`
        rounded-lg border-2 
        transition-all duration-200 hover:bg-opacity-90 cursor-pointer
        relative flex flex-col
        node-uniform-size node-grid-aligned
        node-${data.nodeType}
        ${selectedStyle}
      `}
        style={nodeStyle}
        onDoubleClick={handleDoubleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        title={`${data.label}${data.description ? ` - ${data.description}` : ''}`}
        data-node-type={data.nodeType}
      >
      {/* Connection Handles - All positions */}      {/* TOP Handles */}
      <Handle
        type="source"
        position={Position.Top}
        id="top-source"
        isConnectable={true}
        style={{
          position: 'absolute',
          top: -6,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 11,
          height: 11,
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
          top: -9,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 17,
          height: 17,
          backgroundColor: 'transparent',
          border: 'none',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: 5
        }}
      />      {/* RIGHT Handles */}
      <Handle
        type="source"
        position={Position.Right}
        id="right-source"
        isConnectable={true}
        style={{
          position: 'absolute',
          right: -6,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 11,
          height: 11,
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
          right: -9,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 17,
          height: 17,
          backgroundColor: 'transparent',
          border: 'none',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: 5
        }}
      />      {/* BOTTOM Handles */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-source"
        isConnectable={true}
        style={{
          position: 'absolute',
          bottom: -6,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 11,
          height: 11,
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
          bottom: -9,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 17,
          height: 17,
          backgroundColor: 'transparent',
          border: 'none',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: 5
        }}
      />      {/* LEFT Handles */}
      <Handle
        type="source"
        position={Position.Left}
        id="left-source"
        isConnectable={true}
        style={{
          position: 'absolute',
          left: -6,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 11,
          height: 11,
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
          left: -9,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 17,
          height: 17,
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
      </div>      {/* Panel Toggle Buttons - Show on hover */}
      {isHovered && (
        <div className="flex gap-1 mb-2 opacity-90">
          <button
            onClick={toggleSummaryPanel}
            disabled={isToggling}
            className={`panel-toggle-button text-xs px-2 py-1 rounded transition-all ${
              isToggling 
                ? '' // Disabled styling handled by CSS
                : panelStore.isPanelOpen(id, 'summary')
                ? 'panel-open'
                : ''
            }`}
            title={
              isToggling 
                ? 'Processing...'
                : panelStore.isPanelOpen(id, 'summary') 
                ? 'Close Summary Panel' 
                : 'Open Summary Panel'
            }
          >
            📋
          </button>
          <button
            onClick={toggleEditorPanel}
            disabled={isToggling}
            className={`panel-toggle-button text-xs px-2 py-1 rounded transition-all ${
              isToggling 
                ? '' // Disabled styling handled by CSS
                : panelStore.isPanelOpen(id, 'editor')
                ? 'panel-open'
                : ''
            }`}
            title={
              isToggling 
                ? 'Processing...'
                : panelStore.isPanelOpen(id, 'editor') 
                ? 'Close Editor Panel' 
                : 'Open Editor Panel'
            }
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
