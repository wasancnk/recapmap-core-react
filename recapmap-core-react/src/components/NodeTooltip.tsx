import React from 'react';
import type { NodeType } from '../types';

interface NodeTooltipProps {
  isVisible: boolean;
  position: { x: number; y: number };
  data: {
    label: string;
    description?: string;
    nodeType: NodeType;
  };
  nodeId: string;
}

const NodeTooltip: React.FC<NodeTooltipProps> = ({ isVisible, position, data, nodeId }) => {
  console.log('Tooltip render called - isVisible:', isVisible, 'position:', position, 'nodeId:', nodeId);
  
  if (!isVisible) {
    console.log('Tooltip not visible, returning null');
    return null;
  }

  console.log('Tooltip rendering with position:', position, 'isVisible:', isVisible);

  return (
    <div
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        zIndex: 10000,
        backgroundColor: 'red',
        color: 'white',
        padding: '10px',
        border: '3px solid yellow',
        borderRadius: '4px',
        fontSize: '14px',
        fontWeight: 'bold',
        pointerEvents: 'none',
        minWidth: '200px',
        minHeight: '50px',
      }}
    >
      TEST TOOLTIP - Node: {nodeId}
      <br />
      Position: {position.x}, {position.y}
      <br />
      Label: {data.label}
    </div>
  );
};

export default NodeTooltip;
