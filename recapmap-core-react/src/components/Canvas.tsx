import React, { useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  type Connection,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useNodeStore } from '../stores/nodeStore';
import { useUIStore } from '../stores/uiStore';
import type { NodeType } from '../types';

// Custom node component for our 8-node system
const CustomNode = ({ 
  id, 
  data, 
  selected 
}: { 
  id: string;
  data: { label: string; description?: string; nodeType: NodeType }; 
  selected: boolean 
}) => {
  const { openPanel } = useUIStore();

  const nodeTypeStyles = {
    'usecase': 'bg-blue-500 border-blue-600 text-white',
    'screen': 'bg-green-500 border-green-600 text-white',
    'user': 'bg-orange-500 border-orange-600 text-white',
    'process': 'bg-purple-500 border-purple-600 text-white',
    'storage': 'bg-yellow-500 border-yellow-600 text-black',
    'controller': 'bg-red-500 border-red-600 text-white',
    'error': 'bg-gray-500 border-gray-600 text-white',
    'base': 'bg-cyan-500 border-cyan-600 text-white',
  };

  const baseStyle = nodeTypeStyles[data.nodeType] || nodeTypeStyles['usecase'];
  const selectedStyle = selected ? 'ring-2 ring-white shadow-glow' : '';

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openPanel('node-properties', { nodeId: id });
  };
  return (
    <div 
      className={`
        px-4 py-2 rounded-lg border-2 min-w-[120px] text-center 
        transition-all duration-200 hover:shadow-md cursor-pointer
        relative
        ${baseStyle} ${selectedStyle}
      `}
      onDoubleClick={handleDoubleClick}
      title="Double-click to edit properties"
    >
      {/* Input Handle - Top Center */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-white border-2 border-gray-400 rounded-full"
        style={{ 
          background: '#ffffff',
          border: '2px solid #9ca3af',
          width: '12px',
          height: '12px'
        }}
      />
      
      <div className="font-medium text-sm">{data.label}</div>
      {data.description && (
        <div className="text-xs opacity-80 mt-1">{data.description}</div>
      )}
      
      {/* Output Handle - Bottom Center */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-white border-2 border-gray-400 rounded-full"
        style={{ 
          background: '#ffffff',
          border: '2px solid #9ca3af',
          width: '12px',
          height: '12px'
        }}
      />
    </div>
  );
};

// Node types for React Flow
const nodeTypes = {
  customNode: CustomNode,
};

export const Canvas: React.FC = () => {
  const { 
    nodes: storeNodes, 
    connections: storeConnections, 
    selectedNodeIds,
    updateNode,
    addConnection,
    deleteConnection,
    selectNodes,
  } = useNodeStore();

  const {
    canvas,
  } = useUIStore();

  // Convert store nodes to React Flow nodes
  const reactFlowNodes = React.useMemo(() => 
    storeNodes.map(node => ({
      id: node.id,
      type: 'customNode',
      position: node.position,
      data: {
        label: node.title,
        description: node.description,
        nodeType: node.type,
      },
      selected: selectedNodeIds.includes(node.id),
    })),
    [storeNodes, selectedNodeIds]
  );

  // Convert store connections to React Flow edges
  const reactFlowEdges = React.useMemo(() =>
    storeConnections.map(connection => ({
      id: connection.id,
      source: connection.sourceNodeId,
      target: connection.targetNodeId,
      label: connection.label,
      type: 'default',
      style: { stroke: '#6B7280', strokeWidth: 2 },
      labelStyle: { fill: '#374151', fontSize: 12 },
    })),
    [storeConnections]
  );

  // Use React Flow hooks for local state management
  const [nodes, setNodes, onNodesChange] = useNodesState(reactFlowNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(reactFlowEdges);

  // Sync React Flow nodes with store when they change
  React.useEffect(() => {
    setNodes(reactFlowNodes);
  }, [reactFlowNodes, setNodes]);

  React.useEffect(() => {
    setEdges(reactFlowEdges);
  }, [reactFlowEdges, setEdges]);  // Handle node changes (position, selection, etc.)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleNodesChange = useCallback((changes: any[]) => {
    onNodesChange(changes);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    changes.forEach((change: any) => {
      if (change.type === 'position' && change.position && change.dragging === false) {
        // Update node position in store when drag ends
        updateNode(change.id, { position: change.position });
      } else if (change.type === 'select') {
        // Update selection in store
        const selectedIds = nodes
          .filter(node => node.selected)
          .map(node => node.id);
        selectNodes(selectedIds);
      }
    });
  }, [onNodesChange, updateNode, selectNodes, nodes]);  // Handle edge changes
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEdgesChange = useCallback((changes: any[]) => {
    onEdgesChange(changes);
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    changes.forEach((change: any) => {
      if (change.type === 'remove') {
        deleteConnection(change.id);
      }
    });
  }, [onEdgesChange, deleteConnection]);

  // Handle new connections
  const onConnect = useCallback((connection: Connection) => {
    if (connection.source && connection.target) {
      addConnection(connection.source, connection.target);
    }
  }, [addConnection]);

  // Handle canvas click to deselect
  const onPaneClick = useCallback(() => {
    selectNodes([]);
  }, [selectNodes]);
  return (
    <div className="w-full h-full bg-background-tertiary">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        defaultViewport={{
          x: canvas.center.x,
          y: canvas.center.y,
          zoom: canvas.zoom,
        }}
        minZoom={0.1}
        maxZoom={2}
        fitView
        attributionPosition="bottom-left"
        className="canvas-flow"
      >
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={20} 
          size={1}
          color="#374151"
        />
        <Controls 
          className="controls-panel"
          showInteractive={false}
        />
        <MiniMap 
          className="minimap-panel"
          nodeColor={(node) => {
            const nodeTypeColors = {
              'usecase': '#3B82F6',
              'screen': '#10B981',
              'user': '#F97316',
              'process': '#8B5CF6',
              'storage': '#EAB308',
              'controller': '#EF4444',
              'error': '#6B7280',
              'base': '#06B6D4',
            };
            return nodeTypeColors[node.data?.nodeType as NodeType] || '#3B82F6';
          }}
          nodeStrokeWidth={2}
          pannable
          zoomable
        />
      </ReactFlow>
    </div>
  );
};
