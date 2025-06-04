import React from 'react';
import type { NodeProps } from '@xyflow/react';
import { usePanelStore } from '../stores/panelStore';
import { NodePanel } from './panels/NodePanel';
import { SummaryPanel } from './panels/SummaryPanel';
import { EditorPanel } from './panels/EditorPanel';
import NewCustomNode from './NewCustomNode';
import type { PanelType } from '../stores/panelStore';
import type { NodeType } from '../types';

// Wrapped node component that includes panels
const WrappedCustomNode: React.FC<NodeProps> = ({ 
  id, 
  data, 
  selected 
}) => {
  const { getNodePanels, PANEL_WIDTH } = usePanelStore();
  const panels = getNodePanels(id);

  // Render panel content
  const renderPanelContent = (panelType: PanelType) => {
    switch (panelType) {
      case 'summary':
        return <SummaryPanel nodeId={id} />;
      case 'editor':
        return <EditorPanel nodeId={id} />;
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
      className="relative"
      style={{
        // Make sure the wrapper doesn't interfere with node selection/dragging
        pointerEvents: 'none'
      }}
    >
      {/* The actual node */}
      <div style={{ pointerEvents: 'auto' }}>
        <NewCustomNode
          id={id}
          data={data as { label: string; description?: string; nodeType: NodeType }}
          selected={selected || false}
        />
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
