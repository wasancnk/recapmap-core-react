/**
 * Main node wrapper component that orchestrates all node functionality
 * This replaces the original WrappedCustomNode.tsx
 */

import React from 'react';
import type { NodeProps } from '@xyflow/react';
import type { NodeType } from '../../types';
import { NodeBase } from './NodeBase';
import { NodePanels } from './NodePanels';
import { useNodeZIndex } from './hooks/useNodeZIndex';
import { useNodeInteraction } from './hooks/useNodeInteraction';
import { useNodePanels } from './hooks/useNodePanels';
import { useNodeStore } from '../../stores/nodeStore';
import { usePanelStore } from '../../stores/panelStore';

const NodeWrapper: React.FC<NodeProps> = ({ 
  id, 
  data, 
  selected 
}) => {
  // Type the data properly
  const nodeData = data as { 
    label: string; 
    description?: string; 
    type: NodeType;
  };

  // Get node store functions
  const { deleteNode } = useNodeStore();
  const { removeNodePanels } = usePanelStore();

  // Custom hooks for functionality
  const { isFocused, isHovered, showConnectors, handlers } = useNodeInteraction();
  const { 
    isToggling, 
    toggleSummaryPanel, 
    toggleEditorPanel, 
    panels, 
    PANEL_WIDTH, 
    isPanelOpen 
  } = useNodePanels(id);
  
  const hasOpenPanels = panels.length > 0;
  const { nodeZIndex, nodeState } = useNodeZIndex(
    id, 
    selected, 
    isHovered, 
    isFocused, 
    hasOpenPanels
  );

  // Delete handler with panel cleanup
  const handleDeleteNode = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Clean up any open panels for this node first
    removeNodePanels(id);
    // Then delete the node
    deleteNode(id);
  };

  return (
    <div 
      className="relative"
      style={{
        // Allow pointer events for interactive elements inside
        pointerEvents: 'auto'
      }}
    >
      {/* The actual node */}
      <NodeBase
        nodeData={nodeData}
        nodeZIndex={nodeZIndex}
        nodeState={nodeState}
        isHovered={isHovered}
        isFocused={isFocused}
        showConnectors={showConnectors || Boolean(selected)}
        isToggling={isToggling}
        toggleSummaryPanel={toggleSummaryPanel}
        toggleEditorPanel={toggleEditorPanel}
        isPanelOpen={isPanelOpen}
        deleteNode={handleDeleteNode}
        handlers={handlers}
      />

      {/* Panels positioned relative to the node */}
      <NodePanels
        id={id}
        panels={panels}
        PANEL_WIDTH={PANEL_WIDTH}
      />
    </div>
  );
};

export default NodeWrapper;
