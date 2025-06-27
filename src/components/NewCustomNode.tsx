import * as React from 'react';
import { Handle, Position } from '@xyflow/react';
import { useNodeStore } from '../stores/nodeStore';
import { usePanelStore } from '../stores/panelStore';
import { getNodeConfig } from '../config/nodeTypes';
import type { NodeType } from '../types';

// Z-INDEX LOGIC - Copilot 1
// Dynamic z-index constants for node layering
const NODE_Z_INDEX = {
  INACTIVE: 10,    // Default state
  HOVER: 50,       // Mouse hover
  SELECTED: 75,    // Selected state
  ELEVATED: 90,    // Active interaction (drag, panel open)
} as const;

type NodeZIndex = number;

// Z-INDEX LOGIC - Copilot 1
// Dynamic z-index calculation function: max(existing_z_indexes) + 1
const calculateDynamicZIndex = (baseZIndex: number, isSelected: boolean): number => {
  if (!isSelected) {
    return baseZIndex;
  }
  
  // For selected nodes, use dynamic calculation: max(existing_z_indexes) + 1
  try {
    // Get all existing z-indexes from node elements in the DOM
    const existingZIndexes: number[] = [];
    
    // Query all node elements and extract their z-index values
    const nodeElements = document.querySelectorAll('[data-node-type]');
    nodeElements.forEach((element) => {
      const style = window.getComputedStyle(element);
      const zIndex = parseInt(style.zIndex, 10);
      if (!isNaN(zIndex) && zIndex > 0) {
        existingZIndexes.push(zIndex);
      }
    });
    
    // Add base z-index values to ensure we have minimums
    existingZIndexes.push(
      NODE_Z_INDEX.INACTIVE,
      NODE_Z_INDEX.HOVER, 
      NODE_Z_INDEX.SELECTED,
      NODE_Z_INDEX.ELEVATED
    );
    
    // Calculate max + 1
    const maxZIndex = Math.max(...existingZIndexes);
    const dynamicZIndex = maxZIndex + 1;
    
    console.log(`🎯 Dynamic z-index calculation for selected node: ${dynamicZIndex} (max: ${maxZIndex})`);
    return dynamicZIndex;
  } catch (error) {
    console.warn('Failed to calculate dynamic z-index, falling back to base value:', error);
    return baseZIndex;
  }
};

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
  const panelStore = usePanelStore();
  // Z-INDEX LOGIC - Copilot 1
  // Dynamic z-index state management
  const [nodeZIndex, setNodeZIndex] = React.useState<NodeZIndex>(NODE_Z_INDEX.INACTIVE);
  const [nodeState, setNodeState] = React.useState<'inactive' | 'hover' | 'selected' | 'elevated'>('inactive');
  const [isFocused, setIsFocused] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const [connectingFromHandle, setConnectingFromHandle] = React.useState<string | null>(null);
  const [isToggling, setIsToggling] = React.useState(false);  // Z-INDEX LOGIC - Copilot 1
  // Update z-index based on interaction state with dynamic calculation
  React.useEffect(() => {
    const hasOpenPanels = panelStore.getNodePanels(id).length > 0;
    
    if (hasOpenPanels) {
      // For elevated state, use dynamic calculation
      const dynamicZIndex = calculateDynamicZIndex(NODE_Z_INDEX.ELEVATED, true);
      setNodeZIndex(dynamicZIndex);
      setNodeState('elevated');
    } else if (selected) {
      // For selected state, use dynamic calculation: max(existing_z_indexes) + 1
      const dynamicZIndex = calculateDynamicZIndex(NODE_Z_INDEX.SELECTED, true);
      setNodeZIndex(dynamicZIndex);
      setNodeState('selected');
    } else if (isHovered || isFocused) {
      setNodeZIndex(NODE_Z_INDEX.HOVER);
      setNodeState('hover');
    } else {
      setNodeZIndex(NODE_Z_INDEX.INACTIVE);
      setNodeState('inactive');
    }
  }, [id, selected, isHovered, isFocused, panelStore]);

  // Z-INDEX LOGIC - Copilot 1
  // Selection state synchronization - ensure proper reset when deselected
  React.useEffect(() => {
    if (!selected && nodeState === 'selected') {
      // Force reset to inactive state when deselected
      console.log(`🔄 Node ${id} deselected, resetting to inactive state`);
      setNodeZIndex(NODE_Z_INDEX.INACTIVE);
      setNodeState('inactive');
    }
  }, [selected, nodeState, id]);

  // Use centralized node configuration
  const config = getNodeConfig(data.nodeType);
  
  // Convert hex border color to rgba for glow effects
  const hexToRgba = (hex: string, alpha: number = 0.6) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };
  
  // Dynamic glow color based on node's border color
  const glowColor = hexToRgba(config.borderColor, 0.6);
  const selectedStyle = selected ? 'ring-2 ring-white' : '';const handleDoubleClick = (e: React.MouseEvent) => {
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
  };  // Z-INDEX LOGIC - Copilot 1 
  // Enhanced mouse event handlers with z-index updates
  const handleMouseEnter = React.useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = React.useCallback(() => {
    setIsHovered(false);
    setConnectingFromHandle(null);
  }, []);

  // Z-INDEX LOGIC - Copilot 1
  // Focus handlers for keyboard navigation
  const handleFocus = React.useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = React.useCallback(() => {
    setIsFocused(false);
  }, []);// Toggle functions for panels
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
  const showConnectors = isHovered || connectingFromHandle || selected;  // Special styling for anchor nodes (presentation and usecase) with stripe patterns
  const nodeStyle = data.nodeType === 'presentation' ? {
    backgroundColor: config.bgColor,
    borderColor: config.borderColor,
    color: config.textColor,
    width: '200px',
    height: '160px', 
    padding: '12px',
    backgroundImage: 'linear-gradient(45deg, #4f46e5 25%, #6366f1 25%, #6366f1 50%, #4f46e5 50%, #4f46e5 75%, #6366f1 75%)',
    backgroundSize: '8px 8px'
  } : data.nodeType === 'usecase' ? {
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
  };return (
    <div 
      className={`
        rounded-lg border-2 
        transition-all duration-200 hover:bg-opacity-90 cursor-pointer
        relative flex flex-col
        node-uniform-size node-grid-aligned
        node-${data.nodeType}        ${selectedStyle}
        node-interactive
        ${(isHovered || isFocused) && nodeState !== 'elevated' ? 'node-hover-effect' : ''}
        ${nodeState === 'selected' ? 'node-selected-effect' : ''}
        ${nodeState === 'elevated' ? 'node-elevated-effect' : ''}
        ${(isHovered || isFocused) && nodeState === 'elevated' ? 'node-elevated-hover-effect' : ''}
        ${isFocused ? 'node-focus-effect' : ''}
      `}style={{
        ...nodeStyle,
        zIndex: nodeZIndex, // Apply dynamic z-index
        '--node-border-color': config.borderColor, // CSS custom property for dynamic border color
        '--node-glow-color': glowColor, // CSS custom property for dynamic glow color
      } as React.CSSProperties & { [key: string]: string | number }}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex={0}
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
      />      {/* Node Header - Type and Delete Button */}
      <div className="flex justify-between items-start mb-2">
        {/* Node Type Label */}
        <div className={`flex items-center gap-1 text-xs ${
          data.nodeType === 'task' || data.nodeType === 'note' 
            ? 'opacity-90 font-semibold' // Sticky notes: stronger font weight, higher opacity
            : 'opacity-75 font-medium'   // Regular nodes: original styling
        }`}>
          <span>{config.icon}</span>
          <span className="uppercase">{config.label}</span>
        </div>        
        {/* Delete Button */}
        <button
          onClick={handleDeleteClick}
          className={`text-xs transition-opacity duration-200 hover:text-red-400 ${
            data.nodeType === 'task' || data.nodeType === 'note'
              ? 'opacity-70 hover:opacity-100' // Sticky notes: higher opacity for visibility
              : 'opacity-60 hover:opacity-100' // Regular nodes: original styling
          }`}
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
