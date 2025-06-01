import React, { useCallback, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  MarkerType,
  type Connection,
  type Edge,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useNodeStore } from '../stores/nodeStore';
import { useUIStore } from '../stores/uiStore';
import { ConnectionPropertyPanel } from './ConnectionPropertyPanel';
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
  const [isHovered, setIsHovered] = React.useState(false);
  const [connectingFromHandle, setConnectingFromHandle] = React.useState<string | null>(null);

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

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setConnectingFromHandle(null);
  };

  // Show connectors when hovering or when connecting
  const showConnectors = isHovered || connectingFromHandle || selected;

  return (
    <div 
      className={`
        px-4 py-2 rounded-lg border-2 min-w-[120px] text-center 
        transition-all duration-200 hover:shadow-md cursor-pointer
        relative
        ${baseStyle} ${selectedStyle}
      `}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      title="Double-click to edit properties"
    >      {/* Dynamic Connectors - Only show when needed */}
      {showConnectors && (
        <>
          {/* TOP Connector - Both source and target */}
          <Handle
            type="source"
            position={Position.Top}
            id="top"
            className="!absolute !-top-1 !left-1/2 !transform !-translate-x-1/2 !w-3 !h-3 !bg-blue-400 !border-2 !border-white !rounded-full !opacity-80 hover:!opacity-100 hover:!scale-125 !transition-all !cursor-crosshair"
          />
          <Handle
            type="target"
            position={Position.Top}
            id="top"
            className="!absolute !-top-1 !left-1/2 !transform !-translate-x-1/2 !w-3 !h-3 !bg-blue-400 !border-2 !border-white !rounded-full !opacity-80 hover:!opacity-100 hover:!scale-125 !transition-all !cursor-crosshair"
          />

          {/* RIGHT Connector - Both source and target */}
          <Handle
            type="source"
            position={Position.Right}
            id="right"
            className="!absolute !-right-1 !top-1/2 !transform !-translate-y-1/2 !w-3 !h-3 !bg-blue-400 !border-2 !border-white !rounded-full !opacity-80 hover:!opacity-100 hover:!scale-125 !transition-all !cursor-crosshair"
          />
          <Handle
            type="target"
            position={Position.Right}
            id="right"
            className="!absolute !-right-1 !top-1/2 !transform !-translate-y-1/2 !w-3 !h-3 !bg-blue-400 !border-2 !border-white !rounded-full !opacity-80 hover:!opacity-100 hover:!scale-125 !transition-all !cursor-crosshair"
          />

          {/* BOTTOM Connector - Both source and target */}
          <Handle
            type="source"
            position={Position.Bottom}
            id="bottom"
            className="!absolute !-bottom-1 !left-1/2 !transform !-translate-x-1/2 !w-3 !h-3 !bg-blue-400 !border-2 !border-white !rounded-full !opacity-80 hover:!opacity-100 hover:!scale-125 !transition-all !cursor-crosshair"
          />
          <Handle
            type="target"
            position={Position.Bottom}
            id="bottom"
            className="!absolute !-bottom-1 !left-1/2 !transform !-translate-x-1/2 !w-3 !h-3 !bg-blue-400 !border-2 !border-white !rounded-full !opacity-80 hover:!opacity-100 hover:!scale-125 !transition-all !cursor-crosshair"
          />

          {/* LEFT Connector - Both source and target */}
          <Handle
            type="source"
            position={Position.Left}
            id="left"
            className="!absolute !-left-1 !top-1/2 !transform !-translate-y-1/2 !w-3 !h-3 !bg-blue-400 !border-2 !border-white !rounded-full !opacity-80 hover:!opacity-100 hover:!scale-125 !transition-all !cursor-crosshair"
          />
          <Handle
            type="target"
            position={Position.Left}
            id="left"
            className="!absolute !-left-1 !top-1/2 !transform !-translate-y-1/2 !w-3 !h-3 !bg-blue-400 !border-2 !border-white !rounded-full !opacity-80 hover:!opacity-100 hover:!scale-125 !transition-all !cursor-crosshair"
          />
        </>
      )}

      {/* Node Content */}
      <div className="font-medium text-sm">{data.label}</div>
      {data.description && (
        <div className="text-xs opacity-80 mt-1">{data.description}</div>
      )}

      {/* Connector indicators when not showing full connectors */}
      {!showConnectors && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Subtle connector hints */}
          <div className="absolute top-0 left-1/2 w-1 h-px bg-gray-400 opacity-30 transform -translate-x-1/2"></div>
          <div className="absolute bottom-0 left-1/2 w-1 h-px bg-gray-400 opacity-30 transform -translate-x-1/2"></div>
          <div className="absolute left-0 top-1/2 w-px h-1 bg-gray-400 opacity-30 transform -translate-y-1/2"></div>
          <div className="absolute right-0 top-1/2 w-px h-1 bg-gray-400 opacity-30 transform -translate-y-1/2"></div>
        </div>
      )}
    </div>
  );
};

// Node types for React Flow
const nodeTypes = {
  customNode: CustomNode,
};

export const Canvas: React.FC = () => {  const { 
    nodes: storeNodes, 
    connections: storeConnections, 
    selectedNodeIds,
    updateNode,
    addConnection,
    updateConnection,
    deleteConnection,
    selectNodes,
  } = useNodeStore();

  const {
    canvas,
  } = useUIStore();

  // Local state for connection property panel
  const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(null);
  const [connectionPanelPosition, setConnectionPanelPosition] = useState({ x: 0, y: 0 });

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
  );  // Convert store connections to React Flow edges
  const reactFlowEdges = React.useMemo(() =>
    storeConnections.map(connection => {
      // Determine arrow markers based on direction type
      const getMarkers = (directionType: string) => {
        switch (directionType) {
          case 'twoway':
            return {
              markerStart: { type: MarkerType.ArrowClosed, color: '#6B7280' },
              markerEnd: { type: MarkerType.ArrowClosed, color: '#6B7280' }
            };
          case 'undirected':
            return {};
          case 'oneway':
          default:
            return {
              markerEnd: { type: MarkerType.ArrowClosed, color: '#6B7280' }
            };
        }
      };      // Determine line style
      const getLineStyle = (style: string, color: string, thickness: number) => {
        const baseStyle = {
          stroke: color || '#6B7280',
          strokeWidth: thickness
        };

        switch (style) {
          case 'dashed':
            return { ...baseStyle, strokeDasharray: '8,4' };
          case 'dotted':
            return { ...baseStyle, strokeDasharray: '2,2' };
          case 'solid':
          default:
            return baseStyle;
        }
      };// Get enhanced properties from connection metadata
      const directionType = connection.metadata?.directionType || 'oneway';
      const lineStyle = connection.metadata?.lineStyle || 'solid';
      const lineColor = connection.metadata?.color || (connection.type === 'data' ? '#3B82F6' : connection.type === 'control' ? '#F59E0B' : '#6B7280');
      const thickness = connection.metadata?.thickness || 2;
      const priority = connection.metadata?.priority || 'medium';

      // Apply priority-based thickness adjustments
      const priorityThickness = priority === 'critical' ? thickness + 2 : 
                              priority === 'high' ? thickness + 1 : 
                              priority === 'low' ? Math.max(1, thickness - 1) : thickness;

      return {
        id: connection.id,
        source: connection.sourceNodeId,
        target: connection.targetNodeId,
        sourceHandle: connection.sourceHandle || undefined,
        targetHandle: connection.targetHandle || undefined,
        label: connection.label,
        type: 'default',
        style: getLineStyle(lineStyle, lineColor, priorityThickness),
        labelStyle: { 
          fill: '#374151', 
          fontSize: 12,
          fontWeight: '500' 
        },        ...getMarkers(directionType),
        // Add connection type and priority styling
        className: `connection-${connection.type} connection-priority-${priority}`,
      };
    }),
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
  }, [onEdgesChange, deleteConnection]);  // Handle new connections
  const onConnect = useCallback((connection: Connection) => {
    if (connection.source && connection.target) {
      // Create connection with the store method
      const connectionId = addConnection(
        connection.source, 
        connection.target, 
        'data' // default type
      );
      
      // Update the connection with handle information if needed
      if (connectionId && (connection.sourceHandle || connection.targetHandle)) {
        updateConnection(connectionId, {
          sourceHandle: connection.sourceHandle || 'right',
          targetHandle: connection.targetHandle || 'left'
        });
      }
    }
  }, [addConnection, updateConnection]);
  // Handle canvas click to deselect
  const onPaneClick = useCallback(() => {
    selectNodes([]);
    setSelectedConnectionId(null);
  }, [selectNodes]);
  // Handle edge click for connection property panel
  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    event.stopPropagation();
    
    // Calculate position for the property panel near the edge
    const x = event.clientX + 20; // Offset to the right
    const y = event.clientY - 100; // Offset up to avoid cursor
    
    setConnectionPanelPosition({ x, y });
    setSelectedConnectionId(edge.id);
  }, []);

  const handleConnectionPanelClose = useCallback(() => {
    setSelectedConnectionId(null);
  }, []);  return (
    <div className="w-full h-full bg-background-tertiary">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onPaneClick={onPaneClick}
        onEdgeClick={onEdgeClick}
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

      {/* Connection Property Panel */}
      {selectedConnectionId && (
        <ConnectionPropertyPanel
          connectionId={selectedConnectionId}
          position={connectionPanelPosition}
          onClose={handleConnectionPanelClose}
        />
      )}
    </div>
  );
};
