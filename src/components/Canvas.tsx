import { useCallback, useState, useEffect, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  MarkerType,
  ConnectionMode,
  type Connection,
  type Edge,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useNodeStore } from '../stores/nodeStore';
import { useUIStore } from '../stores/uiStore';
import { useSmartScroll } from '../hooks/useSmartScroll';
import { ConnectionPropertyPanel } from './ConnectionPropertyPanel';
import WrappedCustomNode from './WrappedCustomNode';
import SmartScrollDemo from './SmartScrollDemo';
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

// Node types for React Flow
const nodeTypes = {
  customNode: WrappedCustomNode,
};

// Inner Canvas component that uses ReactFlow hooks
const CanvasInner: React.FC = () => {
  const { 
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
    ui,
    toggleSnapToGrid,
    toggleGrid,
  } = useUIStore();

  // ReactFlow instance for coordinate transformation
  const reactFlowInstance = useReactFlow();// Enable smart scroll redirection for panels with edge detection
  useSmartScroll({
    enabled: true,
    panelSelector: '.panel-base, [data-testid*="panel"], .scrollbar-dark, .scrollbar-stable, .overflow-y-auto',
    edgeBufferMs: 300, // Wait 300ms after hitting scroll edge before allowing canvas operations
    debug: process.env.NODE_ENV === 'development' // Enable debug in development
  });
  // Keyboard shortcuts for grid controls
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+G: Toggle snap to grid
      if (event.ctrlKey && event.key === 'g') {
        event.preventDefault();
        toggleSnapToGrid();
      }
      // Ctrl+Shift+G: Toggle grid visibility
      if (event.ctrlKey && event.shiftKey && event.key === 'G') {
        event.preventDefault();
        toggleGrid();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [toggleSnapToGrid, toggleGrid]);
  // Create test nodes on first load for easier testing
  useEffect(() => {
    createTestNodes(addNode);
  }, [addNode]);

  // Local state for connection property panel
  const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(null);
  const [connectionPanelPosition, setConnectionPanelPosition] = useState({ x: 0, y: 0 });  // Convert store nodes to React Flow nodes
  const reactFlowNodes = useMemo(() =>
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
    [storeNodes, selectedNodeIds]  );// Convert store connections to React Flow edges
  const reactFlowEdges = useMemo(() =>
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
        sourceHandle: connection.sourceHandle || undefined,        targetHandle: connection.targetHandle || undefined,
        label: connection.label,
        type: 'default',
        style: getLineStyle(lineStyle, lineColor, priorityThickness),
        labelStyle: { 
          fill: '#ffffff',  // White text
          fontSize: 12,
          fontWeight: '500',
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)', // Subtle shadow for readability
        },        labelBgStyle: {
          fill: '#16213e', // Workspace background color (background-tertiary)
          fillOpacity: 1,
        },
        ...getMarkers(directionType),
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
  useEffect(() => {
    setNodes(reactFlowNodes);
  }, [reactFlowNodes, setNodes]);

  useEffect(() => {
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
  }, []);

  // Handle drag over to allow drop
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);
  // Handle drop to create new node at drop position
  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    
    // Get the node type from the drag data
    const nodeType = event.dataTransfer.getData('application/reactflow');
    
    // Only process if we have a valid node type
    if (nodeType && typeof nodeType === 'string') {
      // Convert screen coordinates to flow coordinates
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      // Center the node on the mouse cursor by offsetting by half the node dimensions
      // Node dimensions are 200px x 160px (defined in NewCustomNode.tsx)
      const centeredPosition = {
        x: position.x - 100, // Half of node width (200px / 2)
        y: position.y - 80,  // Half of node height (160px / 2)
      };

      // Apply snap to grid if enabled
      let finalPosition = centeredPosition;
      if (ui.snapToGrid) {
        finalPosition = {
          x: Math.round(centeredPosition.x / ui.gridSize) * ui.gridSize,
          y: Math.round(centeredPosition.y / ui.gridSize) * ui.gridSize,
        };
      }

      // Create the new node at the drop position
      console.log('🎯 Dropping node:', nodeType, 'at centered position:', finalPosition);
      addNode(nodeType as NodeType, finalPosition);
    }
  }, [reactFlowInstance, ui.snapToGrid, ui.gridSize, addNode]);return (
    <div className="w-full h-full bg-background-tertiary relative">      {/* Snap-to-Grid Status Indicator */}
      {ui.snapToGrid && (
        <div className="absolute top-4 right-4 z-50 bg-accent-primary/90 text-white px-3 py-1 rounded text-xs font-medium shadow-lg flex items-center gap-2">
          <span>⚡</span>
          <span>Snap Active</span>
          <span className="opacity-70 text-xs">(Ctrl+G)</span>
        </div>      )}<ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onPaneClick={onPaneClick}
        onEdgeClick={onEdgeClick}
        onDragOver={onDragOver}
        onDrop={onDrop}
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
        snapToGrid={ui.snapToGrid}
        snapGrid={[ui.gridSize, ui.gridSize]}
      >        <Background 
          variant={BackgroundVariant.Dots} 
          gap={ui.gridSize} 
          size={1}
          color="#374151"
          style={{ 
            opacity: ui.isGridVisible ? 1 : 0 
          }}
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
          zoomable        />
        
        {/* Panels are now handled within each WrappedCustomNode */}
      </ReactFlow>{/* Connection Property Panel */}
      {selectedConnectionId && (
        <ConnectionPropertyPanel
          connectionId={selectedConnectionId}
          position={connectionPanelPosition}
          onClose={handleConnectionPanelClose}
        />
      )}      {/* Smart Scroll Demo Component */}
      <SmartScrollDemo />
    </div>
  );
};

// Main Canvas component (now uses ReactFlowProvider from parent)
export const Canvas: React.FC = () => {
  return <CanvasInner />;
};
