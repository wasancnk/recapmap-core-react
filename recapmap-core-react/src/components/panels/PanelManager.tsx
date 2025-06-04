import React from 'react';
import { usePanelStore } from '../../stores/panelStore';
import type { PanelState } from '../../stores/panelStore';
import { NodePanel } from './NodePanel';

// Import panels with explicit file extensions to help TypeScript resolve modules
import { SummaryPanel } from './SummaryPanel.tsx';
import { EditorPanel } from './EditorPanel.tsx';

export const PanelManager: React.FC = () => {
  const { panels } = usePanelStore();

  // Convert Map to Array and filter visible panels
  const visiblePanels = Array.from(panels.values()).filter(panel => panel.isVisible);

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
      {visiblePanels.map((panelState) => (
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
