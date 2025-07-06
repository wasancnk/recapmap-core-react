import React from 'react';
import { usePanelStore } from '../../stores/panelStore';
import type { PanelState, PanelType } from '../../stores/panelStore';

interface NodePanelProps {
  panelState: PanelState;
  nodeId: string;
  children: React.ReactNode;
}

const PANEL_TITLES: Record<PanelType, string> = {
  summary: 'Summary',
  editor: 'Editor',
  'ai-chat': 'AI Chat',
  share: 'Share',
  tools: 'Tools'
};

export const NodePanel: React.FC<NodePanelProps> = ({
  panelState,
  nodeId,
  children
}) => {
  const { closePanel, promoteNodeGroup } = usePanelStore();

  const handleClose = () => {
    closePanel(nodeId, panelState.panelType);
  };  
  const handleClick = () => {
    promoteNodeGroup(nodeId, 'user-click');
  };

  const handleMouseEnter = () => {
    promoteNodeGroup(nodeId, 'panel-toggle');
  };

  const handleFocus = () => {
    promoteNodeGroup(nodeId, 'user-click');
  };
  return (
    <div
      data-testid={`node-panel-${nodeId}-${panelState.panelType}`}      className="
        w-80 h-96 
        absolute 
        bg-background-secondary 
        backdrop-blur-md 
        border border-surface-border 
        rounded-lg 
        shadow-lg hover:shadow-xl 
        transition-shadow duration-200
        flex flex-col
      "
      style={{
        left: `${panelState.position.x}px`,
        top: `${panelState.position.y}px`,
        zIndex: panelState.zIndex
      }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onFocus={handleFocus}
      tabIndex={0}
    >      {/* Panel Header */}      <div className="
        flex items-center justify-between 
        px-4 py-3 
        border-b border-surface-border/30
        bg-surface-elevated/30
        rounded-t-lg
      ">        <h3 className="text-sm font-semibold text-text-primary">
          {PANEL_TITLES[panelState.panelType]}
        </h3>
        <button
          data-testid="panel-close-button"
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}          className="
            p-1 
            rounded-md 
            hover:bg-surface-elevated/50 
            transition-colors duration-150
            text-text-muted hover:text-text-primary
          ">
          ×
        </button>
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
};
