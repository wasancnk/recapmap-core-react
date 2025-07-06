/**
 * NodeControls.tsx - Panel Toggle Control Buttons
 * 
 * This component renders the control buttons that appear on nodes for opening panels:
 * - Summary panel button (📝) 
 * - Editor panel button (✏️)
 * - Panel state management and toggle functionality
 * - Button visibility based on node interaction states
 * - Integration with panelStore for panel operations
 * 
 * These controls provide users with quick access to detailed node editing
 * and information panels without cluttering the main canvas interface.
 */
import React from 'react';
import type { NodeState } from './constants';
import type { PanelType } from '../../stores/panelStore';

interface NodeControlsProps {
  isHovered: boolean;
  nodeState: NodeState;
  isToggling: boolean;
  toggleSummaryPanel: (e: React.MouseEvent) => void;
  toggleEditorPanel: (e: React.MouseEvent) => void;
  isPanelOpen: (panelType: PanelType) => boolean;
}

/**
 * Component for rendering node panel control buttons
 */
export const NodeControls: React.FC<NodeControlsProps> = ({
  isHovered,
  nodeState,
  isToggling,
  toggleSummaryPanel,
  toggleEditorPanel,
  isPanelOpen,
}) => {
  // Only show controls when hovered or elevated
  if (!isHovered && nodeState !== 'elevated') {
    return null;
  }

  return (
    <div className="flex gap-1 mb-2 relative z-50" style={{ pointerEvents: 'auto' }}>
      <button
        className="w-6 h-6 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded flex items-center justify-center transition-colors relative z-50"
        style={{ pointerEvents: 'auto' }}
        onClick={toggleSummaryPanel}
        title={
          isToggling 
            ? 'Processing...'
            : isPanelOpen('summary' as PanelType)
            ? 'Close Summary Panel' 
            : 'Open Summary Panel'
        }
      >
        📊
      </button>
      <button
        className="w-6 h-6 bg-green-500 hover:bg-green-600 text-white text-xs rounded flex items-center justify-center transition-colors relative z-50"
        style={{ pointerEvents: 'auto' }}
        onClick={toggleEditorPanel}
        title={
          isToggling 
            ? 'Processing...'
            : isPanelOpen('editor' as PanelType)
            ? 'Close Editor Panel' 
            : 'Open Editor Panel'
        }
      >
        ✏️
      </button>
    </div>
  );
};
