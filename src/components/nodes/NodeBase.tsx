/**
 * NodeBase.tsx - Core Node Rendering Component
 * 
 * This component handles the visual rendering of all 12 node types including:
 * - Node styling and theming based on node type
 * - Special visual treatments (stripe patterns for view/case nodes)
 * - Interactive states (hover, selected, elevated)
 * - Connection handles integration
 * - Panel control buttons
 * - Dynamic CSS classes and styling
 * 
 * Part of the modular node system that replaced WrappedCustomNode.tsx.
 * Works with NodeHandles, NodeControls, and NodePanels for complete functionality.
 */
import React from 'react';
import { getNodeConfig } from '../../config/nodeTypes';
import type { NodeType } from '../../types';
import type { PanelType } from '../../stores/panelStore';
import type { NodeState } from './constants';
import { NODE_DIMENSIONS } from './constants';
import { NodeHandles } from './NodeHandles';
import { NodeControls } from './NodeControls';

interface NodeBaseProps {
  nodeData: {
    label: string;
    description?: string;
    type: NodeType;
  };
  nodeZIndex: number;
  nodeState: NodeState;
  isHovered: boolean;
  isFocused: boolean;
  showConnectors: boolean;
  isToggling: boolean;
  toggleSummaryPanel: (e: React.MouseEvent) => void;
  toggleEditorPanel: (e: React.MouseEvent) => void;
  isPanelOpen: (panelType: PanelType) => boolean;
  handlers: {
    handleMouseEnter: () => void;
    handleMouseLeave: () => void;
    handleFocus: () => void;
    handleBlur: () => void;
  };
}

/**
 * Core node rendering component with styling and content
 */
export const NodeBase: React.FC<NodeBaseProps> = ({
  nodeData,
  nodeZIndex,
  nodeState,
  isHovered,
  isFocused,
  showConnectors,
  isToggling,
  toggleSummaryPanel,
  toggleEditorPanel,
  isPanelOpen,
  handlers,
}) => {
  const config = getNodeConfig(nodeData.type);

  // Special styling for anchor nodes (view and case) with stripe patterns
  const nodeStyle = nodeData.type === 'view' ? {
    backgroundColor: config.bgColor,
    borderColor: config.borderColor,
    color: config.textColor,
    width: `${NODE_DIMENSIONS.WIDTH}px`,
    height: `${NODE_DIMENSIONS.HEIGHT}px`, 
    padding: `${NODE_DIMENSIONS.PADDING}px`,
    backgroundImage: 'linear-gradient(45deg, #4f46e5 25%, #6366f1 25%, #6366f1 50%, #4f46e5 50%, #4f46e5 75%, #6366f1 75%)',
    backgroundSize: '8px 8px'
  } : nodeData.type === 'case' ? {
    backgroundColor: config.bgColor,
    borderColor: config.borderColor,
    color: config.textColor,
    width: `${NODE_DIMENSIONS.WIDTH}px`,
    height: `${NODE_DIMENSIONS.HEIGHT}px`, 
    padding: `${NODE_DIMENSIONS.PADDING}px`,
    backgroundImage: 'linear-gradient(45deg, #4d7c0f 25%, #65a30d 25%, #65a30d 50%, #4d7c0f 50%, #4d7c0f 75%, #65a30d 75%)',
    backgroundSize: '8px 8px'
  } : {
    backgroundColor: config.bgColor,
    borderColor: config.borderColor,
    color: config.textColor,
    width: `${NODE_DIMENSIONS.WIDTH}px`,
    height: `${NODE_DIMENSIONS.HEIGHT}px`,
    padding: `${NODE_DIMENSIONS.PADDING}px`
  };

  return (
    <div 
      style={{ 
        pointerEvents: 'auto',
        zIndex: nodeZIndex
      }}
      data-node-type={nodeData.type}
      onMouseEnter={handlers.handleMouseEnter}
      onMouseLeave={handlers.handleMouseLeave}
      onFocus={handlers.handleFocus}
      onBlur={handlers.handleBlur}
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
        {/* Connection Handles */}
        <NodeHandles showConnectors={showConnectors} />

        {/* Panel Controls */}
        <NodeControls
          isHovered={isHovered}
          nodeState={nodeState}
          isToggling={isToggling}
          toggleSummaryPanel={toggleSummaryPanel}
          toggleEditorPanel={toggleEditorPanel}
          isPanelOpen={isPanelOpen}
        />

        {/* Node Content */}
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
          
          {/* Node Description */}
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
      </div>
    </div>
  );
};
