import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useNodeStore } from '../../stores/nodeStore';
import { logger } from '../../utils/logger';

// Mock the logger
vi.mock('../../utils/logger', () => ({
  logger: {
    connectionStart: vi.fn(),
    connectionSuccess: vi.fn(),
    connectionError: vi.fn(),
    connectionDebug: vi.fn(),
    error: vi.fn(),
  },
}));

describe('NodeStore - swapConnection', () => {
  beforeEach(() => {
    // Reset store to initial state
    const store = useNodeStore.getState();
    store.connections.forEach(conn => store.deleteConnection(conn.id));
    store.nodes.forEach(node => store.deleteNode(node.id));
    store.clearSelection();
    vi.clearAllMocks();
  });

  describe('swapConnection method', () => {
    it('should successfully swap connection between two nodes', () => {
      const {
        addNode,
        addConnection,
        swapConnection
      } = useNodeStore.getState();
      
      // Arrange - create nodes using proper store methods
      const sourceNodeId = addNode('case', { x: 100, y: 100 });
      const targetNodeId = addNode('interface', { x: 300, y: 100 });
      const connectionId = addConnection(sourceNodeId, targetNodeId, 'data');
      
      // Get the initial connection state
      const initialState = useNodeStore.getState();
      const initialConnection = initialState.connections.find(c => c.id === connectionId);
      expect(initialConnection?.sourceNodeId).toBe(sourceNodeId);
      expect(initialConnection?.targetNodeId).toBe(targetNodeId);

      // Act - swap the connection direction
      const result = swapConnection(connectionId);

      // Assert - connection direction should be reversed
      expect(result).toBe(true);
      
      const updatedState = useNodeStore.getState();
      const swappedConnection = updatedState.connections.find(c => c.id === connectionId);
      expect(swappedConnection?.sourceNodeId).toBe(targetNodeId); // Now target is source
      expect(swappedConnection?.targetNodeId).toBe(sourceNodeId); // Now source is target      
      // Verify logging was called correctly
      expect(logger.connectionStart).toHaveBeenCalledWith('swapConnection', connectionId);
      expect(logger.connectionSuccess).toHaveBeenCalledWith('swapConnection', connectionId);
    });

    it('should update node connection arrays correctly during swap', () => {
      const {
        addNode,
        addConnection,
        swapConnection,
        getNode
      } = useNodeStore.getState();
      
      // Arrange
      const sourceNodeId = addNode('case', { x: 100, y: 100 });
      const targetNodeId = addNode('interface', { x: 300, y: 100 });
      const connectionId = addConnection(sourceNodeId, targetNodeId, 'data');
      
      // Verify initial node connection arrays
      const initialSourceNode = getNode(sourceNodeId);
      const initialTargetNode = getNode(targetNodeId);
      expect(initialSourceNode?.connections.outputs).toContain(targetNodeId);
      expect(initialTargetNode?.connections.inputs).toContain(sourceNodeId);

      // Act
      const result = swapConnection(connectionId);

      // Assert
      expect(result).toBe(true);
      
      // Verify node connection arrays are updated correctly
      const updatedSourceNode = getNode(sourceNodeId);
      const updatedTargetNode = getNode(targetNodeId);
      
      // Original source node should now have target in inputs and source removed from outputs
      expect(updatedSourceNode?.connections.outputs).not.toContain(targetNodeId);
      expect(updatedSourceNode?.connections.inputs).toContain(targetNodeId);
      
      // Original target node should now have source in outputs and target removed from inputs
      expect(updatedTargetNode?.connections.inputs).not.toContain(sourceNodeId);
      expect(updatedTargetNode?.connections.outputs).toContain(sourceNodeId);
    });

    it('should handle swapping when connection has complex metadata', () => {
      const {
        addNode,
        addConnection,
        updateConnection,
        swapConnection
      } = useNodeStore.getState();
      
      // Arrange
      const sourceNodeId = addNode('case', { x: 100, y: 100 });
      const targetNodeId = addNode('interface', { x: 300, y: 100 });
      const connectionId = addConnection(sourceNodeId, targetNodeId, 'control');
      
      // Update connection with custom metadata
      updateConnection(connectionId, {
        metadata: {
          color: '#ff0000',
          priority: 'high',
          directionType: 'twoway',
          lineStyle: 'dashed',
          thickness: 3
        }
      });

      // Act
      const result = swapConnection(connectionId);

      // Assert
      expect(result).toBe(true);
      
      const updatedState = useNodeStore.getState();
      const swappedConnection = updatedState.connections.find(c => c.id === connectionId);
      expect(swappedConnection?.sourceNodeId).toBe(targetNodeId);
      expect(swappedConnection?.targetNodeId).toBe(sourceNodeId);
      expect(swappedConnection?.metadata?.color).toBe('#ff0000');
      expect(swappedConnection?.metadata?.priority).toBe('high');
      expect(swappedConnection?.metadata?.directionType).toBe('twoway');
    });    it('should transform handles correctly during swap', () => {
      const {
        addNode,
        addConnection,
        swapConnection
      } = useNodeStore.getState();
      
      // Arrange
      const sourceNodeId = addNode('case', { x: 100, y: 100 });
      const targetNodeId = addNode('interface', { x: 300, y: 100 });
      const connectionId = addConnection(sourceNodeId, targetNodeId, 'data');
      
      // Get initial handle configuration
      const initialState = useNodeStore.getState();
      const initialConnection = initialState.connections.find(c => c.id === connectionId);
      expect(initialConnection?.sourceHandle).toBe('right-source');
      expect(initialConnection?.targetHandle).toBe('left-target');

      // Act
      const result = swapConnection(connectionId);

      // Assert
      expect(result).toBe(true);
      
      const updatedState = useNodeStore.getState();
      const swappedConnection = updatedState.connections.find(c => c.id === connectionId);
      // Both handles should be transformed to visible -source handles
      expect(swappedConnection?.sourceHandle).toBe('left-source');
      expect(swappedConnection?.targetHandle).toBe('right-source');
    });    it('should fail when connection does not exist', () => {
      const { swapConnection } = useNodeStore.getState();
      
      // Act
      const result = swapConnection('nonexistent-conn');

      // Assert
      expect(result).toBe(false);
      expect(logger.connectionError).toHaveBeenCalledWith(
        'swapConnection', 
        'nonexistent-conn', 
        'Connection not found in store'
      );
    });    it('should handle self-referencing connections correctly', () => {
      const {
        addNode,
        addConnection,
        swapConnection
      } = useNodeStore.getState();
      
      // Arrange - create a self-referencing connection
      const nodeId = addNode('case', { x: 100, y: 100 });
      const connectionId = addConnection(nodeId, nodeId, 'data');

      // Act
      const result = swapConnection(connectionId);

      // Assert
      expect(result).toBe(true);
      
      const updatedState = useNodeStore.getState();
      const swappedConnection = updatedState.connections.find(c => c.id === connectionId);
      expect(swappedConnection?.sourceNodeId).toBe(nodeId);
      expect(swappedConnection?.targetNodeId).toBe(nodeId);
      expect(logger.connectionSuccess).toHaveBeenCalledWith('swapConnection', connectionId);
    });    it('should preserve connection type and metadata during swap', () => {
      const {
        addNode,
        addConnection,
        swapConnection
      } = useNodeStore.getState();
      
      // Arrange
      const sourceNodeId = addNode('case', { x: 100, y: 100 });
      const targetNodeId = addNode('interface', { x: 300, y: 100 });
      const connectionId = addConnection(sourceNodeId, targetNodeId, 'dependency');
      
      const initialState = useNodeStore.getState();
      const originalConnection = initialState.connections.find(c => c.id === connectionId);
      const originalMetadata = originalConnection?.metadata;

      // Act
      const result = swapConnection(connectionId);

      // Assert
      expect(result).toBe(true);
      
      const updatedState = useNodeStore.getState();
      const swappedConnection = updatedState.connections.find(c => c.id === connectionId);
      expect(swappedConnection?.metadata).toEqual(originalMetadata);
      expect(swappedConnection?.type).toBe('dependency');
      expect(swappedConnection?.animated).toBe(false); // dependency connections are not animated
    });    it('should log detailed debugging information during swap', () => {
      const {
        addNode,
        addConnection,
        swapConnection
      } = useNodeStore.getState();
      
      // Arrange
      const sourceNodeId = addNode('case', { x: 100, y: 100 });
      const targetNodeId = addNode('interface', { x: 300, y: 100 });
      const connectionId = addConnection(sourceNodeId, targetNodeId, 'data');

      // Act
      swapConnection(connectionId);

      // Assert - verify debug logging calls
      expect(logger.connectionDebug).toHaveBeenCalledWith(
        'swapConnection', 
        'Connection found', 
        expect.objectContaining({
          id: connectionId,
          sourceNodeId: sourceNodeId,
          targetNodeId: targetNodeId
        })
      );
      
      expect(logger.connectionDebug).toHaveBeenCalledWith(
        'swapConnection',
        'About to perform atomic swap'
      );

      expect(logger.connectionDebug).toHaveBeenCalledWith(
        'swapConnection',
        'Post-swap verification',
        expect.objectContaining({
          connectionExists: true,
          updatedConnection: expect.objectContaining({
            id: connectionId,
            sourceNodeId: targetNodeId,
            targetNodeId: sourceNodeId
          })
        })
      );
    });
  });
  describe('Edge cases and error handling', () => {
    it('should handle empty connection ID', () => {
      const { swapConnection } = useNodeStore.getState();
      
      const result = swapConnection('');
      expect(result).toBe(false);
      expect(logger.connectionError).toHaveBeenCalledWith(
        'swapConnection',
        '',
        'Connection not found in store'
      );
    });

    it('should handle null or undefined parameters gracefully', () => {
      const { swapConnection } = useNodeStore.getState();
      
      // These tests verify the method is robust against invalid inputs
      expect(() => swapConnection(null as unknown as string)).not.toThrow();
      expect(() => swapConnection(undefined as unknown as string)).not.toThrow();
      
      // Should return false for invalid inputs
      expect(swapConnection(null as unknown as string)).toBe(false);
      expect(swapConnection(undefined as unknown as string)).toBe(false);
    });

    it('should maintain store consistency after multiple swaps', () => {
      const {
        addNode,
        addConnection,
        swapConnection
      } = useNodeStore.getState();
      
      // Arrange - create multiple connections
      const node1Id = addNode('case', { x: 100, y: 100 });
      const node2Id = addNode('interface', { x: 300, y: 100 });
      const node3Id = addNode('storage', { x: 500, y: 100 });
      
      const conn1Id = addConnection(node1Id, node2Id, 'data');
      const conn2Id = addConnection(node2Id, node3Id, 'control');
      
      const initialState = useNodeStore.getState();
      const initialConnectionCount = initialState.connections.length;
      const initialNodeCount = initialState.nodes.length;

      // Act - perform multiple swaps
      const result1 = swapConnection(conn1Id);
      const result2 = swapConnection(conn2Id);
      const result3 = swapConnection(conn1Id); // Swap back

      // Assert
      expect(result1).toBe(true);
      expect(result2).toBe(true);
      expect(result3).toBe(true);
      
      // Store should maintain consistency
      const finalState = useNodeStore.getState();
      expect(finalState.connections.length).toBe(initialConnectionCount);
      expect(finalState.nodes.length).toBe(initialNodeCount);
      
      // All connections should still exist and be valid
      const finalConn1 = finalState.connections.find(c => c.id === conn1Id);
      const finalConn2 = finalState.connections.find(c => c.id === conn2Id);
      
      expect(finalConn1).toBeDefined();
      expect(finalConn2).toBeDefined();
      
      // Connection 1 should be back to original direction after two swaps
      expect(finalConn1?.sourceNodeId).toBe(node1Id);
      expect(finalConn1?.targetNodeId).toBe(node2Id);
      
      // Connection 2 should be swapped
      expect(finalConn2?.sourceNodeId).toBe(node3Id);
      expect(finalConn2?.targetNodeId).toBe(node2Id);
    });

    it('should verify store state consistency with validation', () => {
      const {
        addNode,
        addConnection,
        swapConnection,
        validateConnections
      } = useNodeStore.getState();
      
      // Arrange
      const sourceNodeId = addNode('case', { x: 100, y: 100 });
      const targetNodeId = addNode('interface', { x: 300, y: 100 });
      const connectionId = addConnection(sourceNodeId, targetNodeId, 'data');

      // Act
      swapConnection(connectionId);

      // Assert - use store's validation method
      const validation = validateConnections();
      expect(validation.valid).toBe(true);
      expect(validation.errors).toEqual([]);
    });
  });
});
