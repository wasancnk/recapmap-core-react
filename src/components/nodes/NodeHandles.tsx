/**
 * NodeHandles.tsx - Connection Handles Component
 * 
 * This component manages the connection points (handles) for React Flow nodes:
 * - Left/right handle positioning and styling
 * - Handle visibility based on hover/selection states
 * - Connection validation and handle types
 * - Visual feedback for connection interactions
 * - Integration with React Flow's connection system
 * 
 * Handles are the visual connection points that users drag between nodes
 * to create relationships in the business model canvas.
 */
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { HANDLE_STYLES } from './constants';

interface NodeHandlesProps {
  showConnectors: boolean;
}

/**
 * Reusable component for rendering node connection handles
 */
export const NodeHandles: React.FC<NodeHandlesProps> = ({ showConnectors }) => {
  const sourceStyle = {
    ...HANDLE_STYLES.SOURCE,
    backgroundColor: showConnectors ? HANDLE_STYLES.COLORS.VISIBLE : HANDLE_STYLES.COLORS.HIDDEN,
    opacity: showConnectors ? 1 : 0,
  };

  const targetStyle = {
    ...HANDLE_STYLES.TARGET,
  };

  return (
    <>
      {/* TOP Handles */}
      <Handle
        type="source"
        position={Position.Top}
        id="top-source"
        isConnectable={true}
        style={{
          ...sourceStyle,
          position: 'absolute',
          top: -6,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      />
      <Handle
        type="target"
        position={Position.Top}
        id="top-target"
        isConnectable={true}
        style={{
          ...targetStyle,
          position: 'absolute',
          top: -9,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      />

      {/* LEFT Handles */}
      <Handle
        type="source"
        position={Position.Left}
        id="left-source"
        isConnectable={true}
        style={{
          ...sourceStyle,
          position: 'absolute',
          left: -6,
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left-target"
        isConnectable={true}
        style={{
          ...targetStyle,
          position: 'absolute',
          left: -9,
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      />

      {/* RIGHT Handles */}
      <Handle
        type="source"
        position={Position.Right}
        id="right-source"
        isConnectable={true}
        style={{
          ...sourceStyle,
          position: 'absolute',
          right: -6,
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      />
      <Handle
        type="target"
        position={Position.Right}
        id="right-target"
        isConnectable={true}
        style={{
          ...targetStyle,
          position: 'absolute',
          right: -9,
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      />

      {/* BOTTOM Handles */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-source"
        isConnectable={true}
        style={{
          ...sourceStyle,
          position: 'absolute',
          bottom: -6,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom-target"
        isConnectable={true}
        style={{
          ...targetStyle,
          position: 'absolute',
          bottom: -9,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      />
    </>
  );
};
