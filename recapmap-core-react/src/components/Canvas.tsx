import React, { useCallback, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  MarkerType,
  ConnectionMode,
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

// Test nodes for connection testing
const createTestNodes = (addNode: (type: NodeType, position: { x: number; y: number }) => string) => {
  if (localStorage.getItem('recapmap-test-nodes-created') === 'true') {
    return; // Don't create test nodes if they already exist
  }

  // Create a few test nodes
  addNode('usecase', { x: 100, y: 100 });
  addNode('screen', { x: 300, y: 100 });
  addNode('user', { x: 100, y: 250 });
  addNode('process', { x: 300, y: 250 });

  localStorage.setItem('recapmap-test-nodes-created', 'true');
};

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
  const selectedStyle = selected ? 'ring-2 ring-white shadow-glow' : '';  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
      // Calculate adaptive position for the property panel
    const calculateAdaptivePosition = (mouseX: number, mouseY: number) => {
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
      
      // Panel dimensions with some safety margin
      const panelWidth = 400; // w-96 = 384px + some margin for content
      const panelHeight = 620; // max height + margin
      
      // Margins to keep panels away from edges
      const margin = 20;
      
      // Available space calculations
      const availableRight = viewport.width - mouseX - margin;
      const availableLeft = mouseX - margin;
      const availableBelow = viewport.height - mouseY - margin;
      const availableAbove = mouseY - margin;      // Determine best horizontal position with preference for staying near cursor
      let x: number;
      const minHorizontalSpace = Math.min(panelWidth, 320); // Accept smaller space if needed
      
      if (availableRight >= minHorizontalSpace) {
        // Prefer right side with small offset
        x = Math.min(mouseX + 20, viewport.width - panelWidth - margin);
      } else if (availableLeft >= minHorizontalSpace) {
        // Use left side, staying close to cursor
        x = Math.max(mouseX - panelWidth - 20, margin);
      } else {
        // Very constrained space - center in the larger available area
        if (availableRight >= availableLeft) {
          // More space on right
          x = viewport.width - panelWidth - margin;
        } else {
          // More space on left
          x = margin;
        }
      }      // Determine best vertical position with preference for staying near cursor
      let y: number;
      const minVerticalSpace = Math.min(panelHeight, 400); // Accept smaller space if needed
      
      if (availableBelow >= minVerticalSpace) {
        // Use space below, but keep panel as close to cursor as possible
        y = Math.min(mouseY + 20, viewport.height - panelHeight - margin);
      } else if (availableAbove >= minVerticalSpace) {
        // Use space above, keeping close to cursor
        y = Math.max(mouseY - panelHeight - 20, margin);
      } else {
        // Very constrained space - use the larger available area but stay closer to cursor
        if (availableBelow >= availableAbove) {
          // More space below - position as low as possible while fitting
          y = viewport.height - panelHeight - margin;
        } else {
          // More space above - position as high as needed
          y = margin;
        }
      }
      
      // Final bounds check to ensure panel is always fully visible
      x = Math.max(margin, Math.min(x, viewport.width - panelWidth - margin));
      y = Math.max(margin, Math.min(y, viewport.height - panelHeight - margin));
      
      return { x, y };
    };    
    const position = calculateAdaptivePosition(e.clientX, e.clientY);
    
    // Enhanced debug logging with positioning rationale
    console.log('🎯 Panel positioning debug:', {
      cursor: { x: e.clientX, y: e.clientY },
      viewport: { width: window.innerWidth, height: window.innerHeight },
      availableSpace: {
        right: window.innerWidth - e.clientX - 20,
        left: e.clientX - 20,
        below: window.innerHeight - e.clientY - 20,
        above: e.clientY - 20
      },
      calculatedPosition: position,
      panelDimensions: { width: 400, height: 620 },
      positioningReason: {
        horizontal: window.innerWidth - e.clientX >= 320 ? 'right-preferred' : e.clientX >= 320 ? 'left-fallback' : 'edge-constrained',
        vertical: window.innerHeight - e.clientY >= 400 ? 'below-preferred' : e.clientY >= 400 ? 'above-fallback' : 'edge-constrained'
      }
    });
    
    openPanel('node-properties', { nodeId: id }, position);
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
    >      {/* Connection Handles - Always present for React Flow */}
      {/* TOP Handles */}
      <Handle
        type="source"
        position={Position.Top}
        id="top-source"
        isConnectable={true}        style={{
          position: 'absolute',
          top: -4,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 8,
          height: 8,
          backgroundColor: showConnectors ? '#60A5FA' : '#9CA3AF',
          border: '1px solid white',
          borderRadius: '50%',
          cursor: 'crosshair',
          opacity: showConnectors ? 1 : 0,
          transition: 'all 0.2s ease',
          zIndex: 10
        }}
      />
      <Handle
        type="target"
        position={Position.Top}
        id="top-target"
        isConnectable={true}
        style={{
          position: 'absolute',
          top: -8,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 16,
          height: 16,
          backgroundColor: 'transparent',
          border: 'none',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: 5
        }}
      />

      {/* RIGHT Handles */}
      <Handle
        type="source"
        position={Position.Right}
        id="right-source"
        isConnectable={true}        style={{
          position: 'absolute',
          right: -4,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 8,
          height: 8,
          backgroundColor: showConnectors ? '#60A5FA' : '#9CA3AF',
          border: '1px solid white',
          borderRadius: '50%',
          cursor: 'crosshair',
          opacity: showConnectors ? 1 : 0,
          transition: 'all 0.2s ease',
          zIndex: 10
        }}
      />
      <Handle
        type="target"
        position={Position.Right}
        id="right-target"
        isConnectable={true}
        style={{
          position: 'absolute',
          right: -8,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 16,
          height: 16,
          backgroundColor: 'transparent',
          border: 'none',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: 5
        }}
      />

      {/* BOTTOM Handles */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-source"
        isConnectable={true}        style={{
          position: 'absolute',
          bottom: -4,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 8,
          height: 8,
          backgroundColor: showConnectors ? '#60A5FA' : '#9CA3AF',
          border: '1px solid white',
          borderRadius: '50%',
          cursor: 'crosshair',
          opacity: showConnectors ? 1 : 0,
          transition: 'all 0.2s ease',
          zIndex: 10
        }}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom-target"
        isConnectable={true}
        style={{
          position: 'absolute',
          bottom: -8,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 16,
          height: 16,
          backgroundColor: 'transparent',
          border: 'none',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: 5
        }}
      />

      {/* LEFT Handles */}
      <Handle
        type="source"
        position={Position.Left}
        id="left-source"
        isConnectable={true}        style={{
          position: 'absolute',
          left: -4,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 8,
          height: 8,
          backgroundColor: showConnectors ? '#60A5FA' : '#9CA3AF',
          border: '1px solid white',
          borderRadius: '50%',
          cursor: 'crosshair',
          opacity: showConnectors ? 1 : 0,
          transition: 'all 0.2s ease',
          zIndex: 10
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left-target"
        isConnectable={true}
        style={{
          position: 'absolute',
          left: -8,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 16,
          height: 16,
          backgroundColor: 'transparent',
          border: 'none',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: 5
        }}
      />{/* Node Content */}
      <div className="font-medium text-sm">{data.label}</div>
      {data.description && (
        <div className="text-xs opacity-80 mt-1">{data.description}</div>
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
    addNode,
  } = useNodeStore();

  const {
    canvas,
  } = useUIStore();

  // Create test nodes on first load for easier testing
  React.useEffect(() => {
    createTestNodes(addNode);
  }, [addNode]);

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
      connectable: true,
    })),
    [storeNodes, selectedNodeIds]
  );// Convert store connections to React Flow edges
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
    console.log('🔗 Connection attempt detected:', connection);
    console.log('🔍 Source:', connection.source, 'Handle:', connection.sourceHandle);
    console.log('🔍 Target:', connection.target, 'Handle:', connection.targetHandle);
    
    if (connection.source && connection.target) {
      console.log('✅ Creating connection from', connection.source, 'to', connection.target);
      
      // Create connection with the store method
      const connectionId = addConnection(
        connection.source, 
        connection.target, 
        'data' // default type
      );

      console.log('🆔 Connection created with ID:', connectionId);

      // Update the connection with handle information if available
      if (connectionId && (connection.sourceHandle || connection.targetHandle)) {
        updateConnection(connectionId, {
          sourceHandle: connection.sourceHandle || 'right-source',
          targetHandle: connection.targetHandle || 'left-target'
        });
        console.log('🔧 Connection updated with handles:', connection.sourceHandle, connection.targetHandle);
      }
    } else {
      console.error('❌ Missing source or target in connection:', connection);
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
    <div className="w-full h-full bg-background-tertiary">      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onPaneClick={onPaneClick}
        onEdgeClick={onEdgeClick}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
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
        nodesDraggable={true}
        nodesConnectable={true}
        elementsSelectable={true}
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
