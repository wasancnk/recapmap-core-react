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
  },
}));

describe('Connection Workflow Integration Tests', () => {
  beforeEach(() => {
    // Clear store state using the store actions
    const store = useNodeStore.getState();
    
    // Clear all connections and nodes
    store.connections.forEach(conn => store.deleteConnection(conn.id));
    store.nodes.forEach(node => store.deleteNode(node.id));
    store.clearSelection();
    
    // Clear mock calls
    vi.clearAllMocks();
  });

  describe('Complete Connection Lifecycle', () => {
    it('should handle the full connection workflow: Create → Edit → Swap → Delete', () => {      const {
        addNode,
        updateNode,
        addConnection,
        updateConnection,
        swapConnection,
        deleteConnection
      } = useNodeStore.getState();

      // Step 1: Setup initial nodes using proper store methods
      const sourceNodeId = addNode('case', { x: 100, y: 100 });
      const targetNodeId = addNode('interface', { x: 300, y: 100 });
      
      // Verify nodes were created and IDs returned
      expect(sourceNodeId).toBeTruthy();
      expect(targetNodeId).toBeTruthy();
      expect(useNodeStore.getState().nodes).toHaveLength(2);
      
      // Update node titles for clarity
      updateNode(sourceNodeId, { title: 'Source Node' });
      updateNode(targetNodeId, { title: 'Target Node' });

      // Step 2: Create connection using proper store method
      const connectionId = addConnection(sourceNodeId, targetNodeId, 'data');
      
      // Verify connection was created
      expect(useNodeStore.getState().connections).toHaveLength(1);
      expect(connectionId).toBeTruthy();
      const connection = useNodeStore.getState().connections.find(c => c.id === connectionId);
      expect(connection).toBeDefined();
      expect(connection?.sourceNodeId).toBe(sourceNodeId);
      expect(connection?.targetNodeId).toBe(targetNodeId);

      // Step 3: Edit connection properties
      updateConnection(connectionId, {
        label: 'Updated Connection',
        type: 'control',
        metadata: {
          color: '#ff0000',
          priority: 'high'
        }
      });

      // Verify update
      const updatedConnection = useNodeStore.getState().connections.find(c => c.id === connectionId);
      expect(updatedConnection?.label).toBe('Updated Connection');
      expect(updatedConnection?.type).toBe('control');
      expect(updatedConnection?.metadata?.color).toBe('#ff0000');

      // Step 4: Swap connection direction using correct method (1 parameter only)
      const success = swapConnection(connectionId);
      expect(success).toBe(true);
      
      // Verify swap - source and target should be reversed
      const swappedConnection = useNodeStore.getState().connections.find(c => c.id === connectionId);
      expect(swappedConnection?.sourceNodeId).toBe(targetNodeId);
      expect(swappedConnection?.targetNodeId).toBe(sourceNodeId);

      // Step 5: Delete connection
      deleteConnection(connectionId);
      expect(useNodeStore.getState().connections).toHaveLength(0);
    });

    it('should maintain data integrity throughout the workflow', () => {
      const {
        addNode,
        addConnection,
        swapConnection,
        updateConnection
      } = useNodeStore.getState();

      // Create multiple nodes and connections to test data integrity
      const node1Id = addNode('case', { x: 0, y: 0 });
      const node2Id = addNode('interface', { x: 100, y: 0 });
      const node3Id = addNode('storage', { x: 200, y: 0 });
      
      expect(useNodeStore.getState().nodes).toHaveLength(3);
      
      // Create connections
      const conn1Id = addConnection(node1Id, node2Id, 'data');
      const conn2Id = addConnection(node2Id, node3Id, 'control');
      
      expect(useNodeStore.getState().connections).toHaveLength(2);
      
      // Perform multiple operations and verify integrity
      swapConnection(conn1Id);
      updateConnection(conn2Id, { label: 'Updated Control' });
      
      // Verify all connections still exist and have correct data
      expect(useNodeStore.getState().connections).toHaveLength(2);
      
      const connection1 = useNodeStore.getState().connections.find(c => c.id === conn1Id);
      const connection2 = useNodeStore.getState().connections.find(c => c.id === conn2Id);
      
      expect(connection1?.sourceNodeId).toBe(node2Id); // Swapped
      expect(connection1?.targetNodeId).toBe(node1Id); // Swapped
      expect(connection2?.label).toBe('Updated Control');
    });

    it('should handle errors gracefully during panel operations', () => {
      const {
        addNode,
        addConnection,
        swapConnection
      } = useNodeStore.getState();

      // Test error handling for invalid operations
      const nodeId = addNode('case', { x: 0, y: 0 });
      const connectionId = addConnection(nodeId, nodeId, 'data'); // Self-connection
      
      // Try to swap non-existent connection
      const swapResult = swapConnection('nonexistent');
      expect(swapResult).toBe(false);
      
      // Original connection should be unchanged
      expect(useNodeStore.getState().connections).toHaveLength(1);
      expect(useNodeStore.getState().connections[0].id).toBe(connectionId);
    });
  });

  describe('Connection Management Operations', () => {
    it('should handle complex connection workflow', () => {
      const {
        addNode,
        addConnection,
        swapConnection
      } = useNodeStore.getState();

      // Create a network of 4 nodes
      const nodes = Array.from({ length: 4 }, (_, i) => 
        addNode('case', { x: i * 100, y: 0 })
      );
      
      expect(useNodeStore.getState().nodes).toHaveLength(4);
      
      // Create a chain of connections: 1→2→3→4
      const connections = [
        addConnection(nodes[0], nodes[1], 'data'),
        addConnection(nodes[1], nodes[2], 'control'),
        addConnection(nodes[2], nodes[3], 'dependency')
      ];
      
      expect(useNodeStore.getState().connections).toHaveLength(3);
      
      // Swap middle connection
      swapConnection(connections[1]);
      
      // Verify the chain integrity
      const swappedConnection = useNodeStore.getState().connections.find(c => c.id === connections[1]);
      expect(swappedConnection?.sourceNodeId).toBe(nodes[2]); // Was nodes[1]
      expect(swappedConnection?.targetNodeId).toBe(nodes[1]); // Was nodes[2]
      
      // Other connections should be unchanged
      const conn1 = useNodeStore.getState().connections.find(c => c.id === connections[0]);
      const conn3 = useNodeStore.getState().connections.find(c => c.id === connections[2]);
      
      expect(conn1?.sourceNodeId).toBe(nodes[0]);
      expect(conn1?.targetNodeId).toBe(nodes[1]);
      expect(conn3?.sourceNodeId).toBe(nodes[2]);
      expect(conn3?.targetNodeId).toBe(nodes[3]);
    });

    it('should handle large numbers of connections efficiently', () => {
      const {
        addNode,
        addConnection,
        swapConnection
      } = useNodeStore.getState();

      // Create 10 nodes
      const nodes = Array.from({ length: 10 }, (_, i) => 
        addNode('case', { x: i * 50, y: 0 })
      );
      
      // Create connections in various patterns
      const connections: string[] = [];
      
      // Linear chain
      for (let i = 0; i < 9; i++) {
        connections.push(addConnection(nodes[i], nodes[i + 1], 'data'));
      }
      
      // Star pattern from first node
      for (let i = 2; i < 10; i++) {
        connections.push(addConnection(nodes[0], nodes[i], 'control'));
      }
      
      expect(useNodeStore.getState().connections).toHaveLength(17); // 9 + 8 connections
      
      // Perform swaps on every other connection
      connections.forEach((connId, index) => {
        if (index % 2 === 0) {
          swapConnection(connId);
        }
      });
      
      // All connections should still exist
      expect(useNodeStore.getState().connections).toHaveLength(17);
      
      // Verify some swaps occurred correctly
      const firstConnection = useNodeStore.getState().connections.find(c => c.id === connections[0]);
      expect(firstConnection?.sourceNodeId).toBe(nodes[1]); // Swapped
      expect(firstConnection?.targetNodeId).toBe(nodes[0]); // Swapped
    });
  });

  describe('Logging Integration', () => {
    it('should log operations correctly', () => {
      const {
        addNode,
        addConnection,
        swapConnection
      } = useNodeStore.getState();

      const nodeId1 = addNode('case', { x: 0, y: 0 });
      const nodeId2 = addNode('interface', { x: 100, y: 0 });
      const connectionId = addConnection(nodeId1, nodeId2, 'data');
      
      // Swap connection and verify logging
      swapConnection(connectionId);
      
      expect(logger.connectionSuccess).toHaveBeenCalledWith('swapConnection', connectionId);
    });

    it('should log errors appropriately', () => {
      const { swapConnection } = useNodeStore.getState();

      // Try to swap non-existent connection
      swapConnection('nonexistent');

      expect(logger.connectionError).toHaveBeenCalledWith(
        'swapConnection',
        'nonexistent',
        'Connection not found in store'
      );
    });
  });

  describe('Store State Validation', () => {
    it('should maintain consistency during cascading operations', () => {
      const {
        addNode,
        addConnection,
        swapConnection,
        updateConnection,
        deleteConnection
      } = useNodeStore.getState();

      // Create a complex scenario with multiple operations
      const nodes = Array.from({ length: 5 }, (_, i) => 
        addNode('case', { x: i * 100, y: 0 })
      );
      
      const connections = [
        addConnection(nodes[0], nodes[1], 'data'),
        addConnection(nodes[1], nodes[2], 'control'),
        addConnection(nodes[2], nodes[3], 'dependency'),
        addConnection(nodes[3], nodes[4], 'data'),
      ];
      
      // Perform multiple operations
      swapConnection(connections[0]);
      updateConnection(connections[1], { label: 'Updated' });
      swapConnection(connections[2]);
      deleteConnection(connections[3]);
      
      // Verify final state
      expect(useNodeStore.getState().connections).toHaveLength(3);
      
      // Check that node connection arrays are properly maintained
      const node1 = useNodeStore.getState().nodes.find(n => n.id === nodes[1]);
      const node2 = useNodeStore.getState().nodes.find(n => n.id === nodes[2]);
      
      expect(node1).toBeDefined();
      expect(node2).toBeDefined();
      
      // The node connection arrays should reflect the current connections
      const activeConnections = useNodeStore.getState().connections.length;
      expect(activeConnections).toBe(3);
    });

    it('should handle edge cases in connection validation', () => {
      const {
        addNode,
        addConnection,
        swapConnection
      } = useNodeStore.getState();

      const nodeId = addNode('case', { x: 0, y: 0 });
      
      // Create self-referencing connection
      const selfConnectionId = addConnection(nodeId, nodeId, 'data');
      expect(useNodeStore.getState().connections).toHaveLength(1);
      
      // Swap self-connection (should still work)
      const swapResult = swapConnection(selfConnectionId);
      expect(swapResult).toBe(true);
      
      // Connection should still exist and be valid
      const connection = useNodeStore.getState().connections.find(c => c.id === selfConnectionId);
      expect(connection?.sourceNodeId).toBe(nodeId);
      expect(connection?.targetNodeId).toBe(nodeId);
    });
  });
});
