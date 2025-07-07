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
  showConnectors: boolean;
  isToggling: boolean;
  toggleSummaryPanel: (e: React.MouseEvent) => void;
  toggleEditorPanel: (e: React.MouseEvent) => void;
  isPanelOpen: (panelType: PanelType) => boolean;
  deleteNode: (e: React.MouseEvent) => void;
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
  showConnectors,
  isToggling,
  toggleSummaryPanel,
  toggleEditorPanel,
  isPanelOpen,
  deleteNode,
  handlers,
}) => {
  const config = getNodeConfig(nodeData.type);

  // Define the regular nodes that should have colored names (matching border color)
  // Blueprint, view, case, and snippet are special - they have dark backgrounds so need white text, not colored text
  const regularNodes: NodeType[] = ['persona', 'interface', 'process', 'capability', 'outcome', 'resource', 'knowledge', 'storage'];
  const isRegularNode = regularNodes.includes(nodeData.type);
  
  // Task and note nodes should use their configured textColor (black), not border color
  // Blueprint, view, case, and snippet nodes should use white text for readability
  const shouldUseColoredName = isRegularNode;

  // Special styling for nodes with patterns (view, case, blueprint, snippet)
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
  } : nodeData.type === 'blueprint' ? {
    backgroundColor: config.bgColor,
    borderColor: config.borderColor,
    color: '#ffffff', // Force white text like Case node
    width: `${NODE_DIMENSIONS.WIDTH}px`,
    height: `${NODE_DIMENSIONS.HEIGHT}px`, 
    padding: `${NODE_DIMENSIONS.PADDING}px`,
    backgroundImage: `
      linear-gradient(rgba(70, 130, 180, 0.3) 1px, transparent 1px), 
      linear-gradient(90deg, rgba(70, 130, 180, 0.3) 1px, transparent 1px),
      linear-gradient(rgba(70, 130, 180, 0.15) 1px, transparent 1px), 
      linear-gradient(90deg, rgba(70, 130, 180, 0.15) 1px, transparent 1px)
    `,
    backgroundSize: '20px 20px, 20px 20px, 5px 5px, 5px 5px',
    backgroundPosition: '-1px -1px, -1px -1px, -1px -1px, -1px -1px'
  } : nodeData.type === 'snippet' ? {
    backgroundColor: '#1a1527', // Modern Pink base color
    borderColor: config.borderColor,
    color: '#ffffff', // White text for readability
    width: `${NODE_DIMENSIONS.WIDTH}px`,
    height: `${NODE_DIMENSIONS.HEIGHT}px`, 
    padding: `${NODE_DIMENSIONS.PADDING}px`,
    backgroundImage: `
      linear-gradient(135deg, #2a1f2e 21px, #3d2f42 22px, #3d2f42 24px, transparent 24px, transparent 67px, #3d2f42 67px, #3d2f42 69px, transparent 69px),
      linear-gradient(225deg, #2a1f2e 21px, #3d2f42 22px, #3d2f42 24px, transparent 24px, transparent 67px, #3d2f42 67px, #3d2f42 69px, transparent 69px)
    `,
    backgroundSize: '64px 128px',
    backgroundPosition: '0 0, 0 64px'
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
          rounded-lg border-2 cursor-pointer
          relative flex flex-col
          node-uniform-size node-grid-aligned
          node-${nodeData.type}
          node-interactive
        `}
        style={{
          ...nodeStyle,
          zIndex: nodeZIndex
        }}
      >
        {/* Connection Handles */}
        <NodeHandles showConnectors={showConnectors} />

        {/* Node Type Header with Delete Button */}
        <div 
          className="flex items-center justify-between gap-2 mb-2 text-sm opacity-80"
          style={{
            color: (nodeData.type === 'task' || nodeData.type === 'note') ? '#1f2937' : 'inherit'
          }}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">{config.icon}</span>
            <span className="font-medium">{config.label}</span>
          </div>
          <button
            className="w-6 h-6 border-none bg-transparent rounded flex items-center justify-center font-light z-50"
            style={{ 
              pointerEvents: 'auto',
              fontSize: '24px',
              lineHeight: '1',
              fontWeight: '300',
              marginTop: '-2px',
              color: (nodeData.type === 'task' || nodeData.type === 'note') ? '#374151' : '#FFFFFF'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#ef4444'; // Red on hover regardless of node type
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = (nodeData.type === 'task' || nodeData.type === 'note') ? '#374151' : '#FFFFFF';
            }}
            onClick={deleteNode}
            title="Delete Node"
          >
            ×
          </button>
        </div>

        {/* Panel Controls - positioned below header */}
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
              color: shouldUseColoredName ? config.borderColor : 
                     (nodeData.type === 'blueprint' || nodeData.type === 'view' || nodeData.type === 'case' || nodeData.type === 'snippet') ? '#ffffff' : 
                     config.textColor,
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
