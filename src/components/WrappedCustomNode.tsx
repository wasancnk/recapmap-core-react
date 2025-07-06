/**
 * WrappedCustomNode.tsx - Universal Node Component for RecapMap
 * 
 * This is the MAIN node component that handles ALL 12 node types in the RecapMap system.
 * It's called "Wrapped" because it wraps React Flow's basic n  } : {
    backgroundColor: config.bgColor,
    borderColor: config.borderColor,
    color: config.textColor,
    width: '200px',
    height: '160px', 
    padding: '12px'
  };tionality with:
 * - Custom styling and interactions
 * - Panel management (summary, editor, AI chat, etc.)
 * - Dynamic z-index handling
 * - Connection handles with hover effects
 * - Special visual treatments for anchor nodes (view, case)
 * 
 * UNIVERSAL COMPONENT: This single component renders all node types:
 * Business Layer: case, task, capability, outcome
 * Technical Layer: interface, component, process, data  
 * Presentation Layer: view, insight, flow, context
 * 
 * The differentiation happens through:
 * - nodeData.type property (determines styling via getNodeConfig)
 * - Special stripe patterns for 'view' (purple) and 'case' (green) nodes
 * - Dynamic CSS classes: node-{nodeType}
 * 
 * NOTE: There's a new modular version in src/components/nodes/ that replaces this.
 * This file exists for backward compatibility and will be removed once migration is complete.
 */

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { usePanelStore } from '../stores/panelStore';
import { NodePanel } from './panels/NodePanel';
import { SummaryPanel } from './panels/SummaryPanel';
import { EditorPanel } from './panels/EditorPanel';
import { getNodeConfig } from '../config/nodeTypes';
import type { PanelType } from '../stores/panelStore';
import type { NodeType } from '../types';

// Z-INDEX LOGIC - Dynamic z-index constants for node layering
const NODE_Z_INDEX = {
  INACTIVE: 10,    // Default state
  HOVER: 50,       // Mouse hover
  SELECTED: 75,    // Selected state
  ELEVATED: 90,    // Active interaction (drag, panel open)
} as const;

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

// Wrapped node component that includes panels and node functionality
const WrappedCustomNode: React.FC<NodeProps> = ({ 
  id, 
  data, 
  selected 
}) => {
  const panelStore = usePanelStore();
  const { getNodePanels, PANEL_WIDTH } = panelStore;
  const panels = getNodePanels(id);
  
  // Type the data properly
  const nodeData = data as { 
    label: string; 
    description?: string; 
    type: NodeType;
  };
  
  // Get node configuration
  const config = getNodeConfig(nodeData.type as NodeType);
  
  // Dynamic z-index state management
  const [nodeZIndex, setNodeZIndex] = React.useState<number>(NODE_Z_INDEX.INACTIVE);
  const [nodeState, setNodeState] = React.useState<'inactive' | 'hover' | 'selected' | 'elevated'>('inactive');
  const [isFocused, setIsFocused] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const [connectingFromHandle, setConnectingFromHandle] = React.useState<string | null>(null);
  const [isToggling, setIsToggling] = React.useState(false);

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
  }, [selected, isHovered, isFocused, panelStore, id]);

  // Mouse event handlers
  const handleMouseEnter = React.useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = React.useCallback(() => {
    setIsHovered(false);
    setConnectingFromHandle(null);
  }, []);

  // Focus handlers for keyboard navigation
  const handleFocus = React.useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = React.useCallback(() => {
    setIsFocused(false);
  }, []);

  // Toggle functions for panels
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

  // Special styling for anchor nodes (view and case) with stripe patterns
  const nodeStyle = nodeData.type === 'view' ? {
    backgroundColor: config.bgColor,
    borderColor: config.borderColor,
    color: config.textColor,
    width: '200px',
    height: '160px', 
    padding: '12px',
    backgroundImage: 'linear-gradient(45deg, #4f46e5 25%, #6366f1 25%, #6366f1 50%, #4f46e5 50%, #4f46e5 75%, #6366f1 75%)',
    backgroundSize: '8px 8px'
  } : nodeData.type === 'case' ? {
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

  // Render panel content
  const renderPanelContent = (panelType: PanelType) => {
    switch (panelType) {
      case 'summary':
        return <SummaryPanel nodeId={id} />;
      case 'editor':
        return <EditorPanel nodeId={id} />;      case 'ai-chat':
        return <div className="p-4 text-gray-300">AI Chat - Coming Soon</div>;
      case 'share':
        return <div className="p-4 text-gray-300">Share - Coming Soon</div>;
      case 'tools':
        return <div className="p-4 text-gray-300">Tools - Coming Soon</div>;
      default:
        return <div className="p-4 text-gray-300">Unknown Panel Type</div>;
    }
  };

  return (
    <div 
      className="relative"
      style={{
        // Make sure the wrapper doesn't interfere with node selection/dragging
        pointerEvents: 'none'
      }}
    >
      {/* The actual node */}
      <div 
        style={{ 
          pointerEvents: 'auto',
          zIndex: nodeZIndex
        }}
        data-node-type={nodeData.type}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        tabIndex={0}
      >
        <div 
          className={`
            rounded-lg border-2 
            transition-all duration-200 hover:bg-opacity-90 cursor-pointer
            relative flex flex-col
            node-uniform-size node-grid-aligned
            node-${nodeData.type}
            node-interactive
            ${(isHovered || isFocused) && nodeState !== 'elevated' ? 'node-hover-effect' : ''}
            ${nodeState === 'elevated' ? 'node-elevated-effect' : ''}
            ${(isHovered || isFocused) && nodeState === 'elevated' ? 'node-elevated-hover-effect' : ''}
            ${isFocused ? 'node-focus-effect' : ''}
          `}
          style={{
            ...nodeStyle,
            zIndex: nodeZIndex
          }}
        >
          {/* TOP Handles */}
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
          />

          {/* LEFT Handles */}
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

          {/* Panel Controls - Inside Node, Top Right */}
          {(isHovered || nodeState === 'elevated') && (
            <div className="absolute top-2 right-2 flex gap-1">
              <button
                className="w-6 h-6 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded flex items-center justify-center transition-colors"
                onClick={toggleSummaryPanel}
                title={
                  isToggling 
                    ? 'Processing...'
                    : panelStore.isPanelOpen(id, 'summary') 
                    ? 'Close Summary Panel' 
                    : 'Open Summary Panel'
                }
              >
                📊
              </button>
              <button
                className="w-6 h-6 bg-green-500 hover:bg-green-600 text-white text-xs rounded flex items-center justify-center transition-colors"
                onClick={toggleEditorPanel}
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

          {/* Node Type Header */}
          <div className="flex items-center gap-2 mb-2 text-sm opacity-80">
            <span className="text-lg">{config.icon}</span>
            <span className="font-medium">{config.label}</span>
          </div>

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
              title={nodeData.label}
            >
              {nodeData.label}
            </div>
            
            {/* Node Description - Bottom Section */}
            {nodeData.description && (
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
                title={nodeData.description}
              >
                {nodeData.description}
              </div>
            )}
          </div>

          {/* RIGHT Handles */}
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
          />

          {/* BOTTOM Handles */}
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
          />
        </div>
      </div>      {/* Panels positioned relative to the node */}
      {panels.map((panel, index) => {
        const panelX = 190 + (index * (PANEL_WIDTH + 10)); 
        const panelY = 0; // Keep panels aligned with the node top
        
        return (
          <div
            key={`${panel.nodeId}-${panel.panelType}`}
            className="absolute"
            style={{
              left: panelX,
              top: panelY,
              width: PANEL_WIDTH,
              height: 400, // Fixed height to match panels
              pointerEvents: 'auto',
              zIndex: panel.zIndex
            }}
          >
            <NodePanel
              panelState={panel}
              nodeId={panel.nodeId}
            >
              {renderPanelContent(panel.panelType)}
            </NodePanel>
          </div>
        );
      })}
    </div>
  );
};

export default WrappedCustomNode;
