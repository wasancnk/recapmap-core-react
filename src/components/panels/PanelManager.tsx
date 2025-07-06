import React from 'react';
import { useReactFlow } from '@xyflow/react';
import { usePanelStore } from '../../stores/panelStore';
import { useNodeStore } from '../../stores/nodeStore';
import type { PanelState } from '../../stores/panelStore';
import { NodePanel } from './NodePanel';

// Import panels
import { SummaryPanel } from './SummaryPanel';
import { EditorPanel } from './EditorPanel';

export const PanelManager: React.FC = () => {
  const { panels, calculatePanelPosition } = usePanelStore();
  const { getNode } = useNodeStore();
  const reactFlow = useReactFlow();

  // Convert Map to Array and filter visible panels
  const visiblePanels = Array.from(panels.values()).filter(panel => panel.isVisible);

  // Get current viewport for reactive updates
  const viewport = reactFlow.getViewport();

  // Calculate dynamic positions for panels based on their associated nodes and viewport
  const panelsWithCalculatedPositions = React.useMemo(() => {
    return visiblePanels.map(panel => {
      const node = getNode(panel.nodeId);
      
      if (node && node.position) {
        // Use the calculatePanelPosition function to get the node-relative position
        const nodeRelativePosition = calculatePanelPosition(
          panel.nodeId, 
          panel.panelType, 
          node.position
        );
        
        // Transform the node-relative position to screen coordinates using viewport
        const screenPosition = {
          x: nodeRelativePosition.x * viewport.zoom + viewport.x,
          y: nodeRelativePosition.y * viewport.zoom + viewport.y
        };
        
        return {
          ...panel,
          position: screenPosition
        };
      }
      
      // Fallback to stored position if node not found
      return panel;
    });
  }, [visiblePanels, getNode, calculatePanelPosition, viewport]);

  const renderPanelContent = (panelState: PanelState) => {
    switch (panelState.panelType) {
      case 'summary':
        return <SummaryPanel nodeId={panelState.nodeId} />;
      case 'editor':
        return <EditorPanel nodeId={panelState.nodeId} />;
      case 'ai-chat':
        return <div className="p-4 text-gray-600">AI Chat - Coming Soon</div>;
      case 'share':
        return <div className="p-4 text-gray-600">Share - Coming Soon</div>;
      case 'tools':
        return <div className="p-4 text-gray-600">Tools - Coming Soon</div>;
      default:
        return <div className="p-4 text-gray-600">Unknown Panel Type</div>;
    }
  };

  return (
    <div 
      data-testid="panel-manager-container"
      className="fixed inset-0 pointer-events-none z-0"
    >
      {panelsWithCalculatedPositions.map((panelState) => (
        <div 
          key={`${panelState.nodeId}-${panelState.panelType}`}
          className="pointer-events-auto"
        >
          <NodePanel
            panelState={panelState}
            nodeId={panelState.nodeId}
          >
            {renderPanelContent(panelState)}
          </NodePanel>
        </div>
      ))}
    </div>
  );
};
