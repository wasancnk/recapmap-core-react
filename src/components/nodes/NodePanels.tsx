/**
 * NodePanels.tsx - Panel Positioning and Rendering Component
 * 
 * This component handles the positioning and rendering of panels attached to nodes:
 * - Panel positioning relative to parent nodes
 * - Panel content routing (summary, editor, ai-chat, share, tools)
 * - Z-index management for panel layering
 * - Panel spacing and layout calculations
 * - Integration with NodePanel wrapper for styling
 * 
 * Panels provide detailed editing interfaces and information displays
 * that appear adjacent to nodes on the canvas for contextual interaction.
 */
import React from 'react';
import { NodePanel } from '../panels/NodePanel';
import { SummaryPanel } from '../panels/SummaryPanel';
import { EditorPanel } from '../panels/EditorPanel';
import type { PanelType, PanelState } from '../../stores/panelStore';
import { PANEL_POSITIONING } from './constants';

interface NodePanelsProps {
  id: string;
  panels: PanelState[];
  PANEL_WIDTH: number;
}

/**
 * Component for rendering node panels positioned relative to the node
 */
export const NodePanels: React.FC<NodePanelsProps> = ({ id, panels, PANEL_WIDTH }) => {
  // Render panel content
  const renderPanelContent = (panelType: PanelType) => {
    switch (panelType) {
      case 'summary':
        return <SummaryPanel nodeId={id} />;
      case 'editor':
        return <EditorPanel nodeId={id} />;
      case 'ai-chat':
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
    <>
      {panels.map((panel, index) => {
        const panelX = PANEL_POSITIONING.OFFSET_X + (index * (PANEL_WIDTH + PANEL_POSITIONING.SPACING)); 
        const panelY = PANEL_POSITIONING.OFFSET_Y;
        
        return (
          <div
            key={`${panel.nodeId}-${panel.panelType}`}
            className="absolute"
            style={{
              left: panelX,
              top: panelY,
              width: PANEL_WIDTH,
              height: PANEL_POSITIONING.HEIGHT,
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
    </>
  );
};
