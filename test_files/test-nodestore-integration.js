// nodeStore Persistence Integration Test
// This script tests the actual nodeStore implementation

import { useNodeStore } from '../src/stores/nodeStore.js';

// Test the persistence functionality
function testNodeStorePersistence() {
    console.log('🧪 Testing NodeStore Persistence Implementation');
    console.log('================================================');
    
    // Get the store instance
    const store = useNodeStore.getState();
    
    console.log('📊 Initial Store State:');
    console.log('- Nodes:', store.nodes.length);
    console.log('- Connections:', store.connections.length);
    console.log('- Selected:', store.selectedNodeIds.length);
    
    // Test 1: Add a node
    console.log('\n🔧 Test 1: Adding a usecase node...');
    const nodeId = store.addNode('usecase', { x: 100, y: 100 });
    console.log('- Created node ID:', nodeId);
    console.log('- Total nodes:', store.nodes.length);
    
    // Test 2: Add another node
    console.log('\n🔧 Test 2: Adding a screen node...');
    const screenId = store.addNode('screen', { x: 300, y: 100 });
    console.log('- Created screen ID:', screenId);
    console.log('- Total nodes:', store.nodes.length);
    
    // Test 3: Create a connection
    console.log('\n🔧 Test 3: Creating connection...');
    const connectionId = store.addConnection(nodeId, screenId);
    console.log('- Created connection ID:', connectionId);
    console.log('- Total connections:', store.connections.length);
    
    // Test 4: Check localStorage
    console.log('\n💾 Test 4: Checking localStorage...');
    const stored = localStorage.getItem('recapmap-node-store');
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            console.log('- Storage key found: ✅');
            console.log('- Stored nodes:', parsed.state?.nodes?.length || 0);
            console.log('- Stored connections:', parsed.state?.connections?.length || 0);
            console.log('- Version:', parsed.version);
            
            // Check if selectedNodeIds is excluded (should not be in storage)
            const hasSelectedIds = 'selectedNodeIds' in (parsed.state || {});
            console.log('- selectedNodeIds excluded:', !hasSelectedIds ? '✅' : '❌');
            
        } catch (error) {
            console.error('- Error parsing stored data:', error);
        }
    } else {
        console.log('- No localStorage data found: ❌');
    }
    
    // Test 5: Validate data integrity
    console.log('\n🔍 Test 5: Data integrity validation...');
    const validation = store.validateConnections();
    console.log('- Connections valid:', validation.valid ? '✅' : '❌');
    if (!validation.valid) {
        console.log('- Errors:', validation.errors);
    }
    
    // Test 6: Test node retrieval
    console.log('\n📖 Test 6: Node retrieval...');
    const retrievedNode = store.getNode(nodeId);
    console.log('- Node retrieved:', retrievedNode ? '✅' : '❌');
    console.log('- Node type:', retrievedNode?.type);
    console.log('- Node title:', retrievedNode?.title);
    
    // Test 7: Test type-specific queries
    console.log('\n🎯 Test 7: Type-specific queries...');
    const usecaseNodes = store.getNodesByType('usecase');
    const screenNodes = store.getNodesByType('screen');
    console.log('- Usecase nodes:', usecaseNodes.length);
    console.log('- Screen nodes:', screenNodes.length);
    
    console.log('\n✨ Persistence test completed!');
    console.log('================================');
    
    return {
        nodesCreated: store.nodes.length,
        connectionsCreated: store.connections.length,
        persistenceWorking: !!stored,
        validationPassed: validation.valid
    };
}

// Export for potential use in tests
export { testNodeStorePersistence };

// Run test if this script is executed directly
if (typeof window !== 'undefined') {
    // Browser environment - attach to window for manual testing
    window.testNodeStorePersistence = testNodeStorePersistence;
    console.log('🚀 NodeStore persistence test available as window.testNodeStorePersistence()');
} else {
    // Node environment - run test immediately
    testNodeStorePersistence();
}
