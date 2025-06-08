// Quick Persistence Test - Run this in browser console
// Copy and paste this entire code block into the browser console when RecapMap is loaded

console.log('🚀 Quick Persistence Test Starting...');

// Utility functions
function testLog(message, success = true) {
    const prefix = success ? '✅' : '❌';
    console.log(`${prefix} ${message}`);
}

// Test state
let testNodeId = null;
let testConnectionId = null;

async function quickPersistenceTest() {
    try {
        // 1. Check if stores are available
        if (!window.recapMapStores) {
            console.error('❌ Stores not available. Make sure the app is fully loaded.');
            return;
        }
        
        testLog('Stores available');
        
        const { useNodeStore, useProjectStore } = window.recapMapStores;
        
        // 2. Get initial state
        const initialNodeCount = useNodeStore.getState().nodes.length;
        const initialConnectionCount = useNodeStore.getState().connections.length;
        
        console.log(`📊 Initial state: ${initialNodeCount} nodes, ${initialConnectionCount} connections`);
        
        // 3. Test node creation and persistence
        console.log('🔬 Testing node creation...');
        testNodeId = useNodeStore.getState().addNode('usecase', { x: 150, y: 150 });
        
        useNodeStore.getState().updateNode(testNodeId, {
            title: `Test Node ${new Date().toLocaleTimeString()}`,
            description: 'Created by quick persistence test'
        });
        
        testLog(`Node created with ID: ${testNodeId}`);
        
        // 4. Wait for persistence and check localStorage
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const persistedData = localStorage.getItem('recapmap-node-store');
        if (persistedData) {
            const parsed = JSON.parse(persistedData);
            const persistedNode = parsed.state.nodes.find(n => n.id === testNodeId);
            
            if (persistedNode) {
                testLog('Node persisted to localStorage');
                console.log(`   Title: "${persistedNode.title}"`);
                console.log(`   Position: (${persistedNode.position.x}, ${persistedNode.position.y})`);
            } else {
                testLog('Node NOT found in localStorage', false);
            }
        } else {
            testLog('No localStorage data found', false);
        }
        
        // 5. Test connection creation
        console.log('🔗 Testing connection creation...');
        const targetNodeId = useNodeStore.getState().addNode('task', { x: 300, y: 150 });
        testConnectionId = useNodeStore.getState().addConnection(testNodeId, targetNodeId, 'data');
        
        testLog(`Connection created: ${testNodeId} → ${targetNodeId}`);
        
        // 6. Check connection persistence
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const connectionData = localStorage.getItem('recapmap-node-store');
        if (connectionData) {
            const parsed = JSON.parse(connectionData);
            const persistedConnection = parsed.state.connections.find(c => c.id === testConnectionId);
            
            if (persistedConnection) {
                testLog('Connection persisted to localStorage');
                console.log(`   Type: ${persistedConnection.type}`);
            } else {
                testLog('Connection NOT found in localStorage', false);
            }
        }
        
        // 7. Test cross-store sync
        console.log('🔄 Testing cross-store synchronization...');
        const projectStore = useProjectStore.getState();
        
        // Clear modified state
        projectStore.markAsSaved();
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Make a change to trigger sync
        useNodeStore.getState().updateNode(testNodeId, { title: 'Modified for sync test' });
        
        // Wait for sync
        await new Promise(resolve => setTimeout(resolve, 400));
        
        const isModified = useProjectStore.getState().project.isModified;
        if (isModified) {
            testLog('Cross-store sync working - project marked as modified');
        } else {
            testLog('Cross-store sync NOT working - project not modified', false);
        }
        
        // 8. Test persistence exclusion
        console.log('🎯 Testing persistence exclusion...');
        useNodeStore.getState().selectNode(testNodeId);
        
        await new Promise(resolve => setTimeout(resolve, 200));
        
        const exclusionData = localStorage.getItem('recapmap-node-store');
        if (exclusionData) {
            const parsed = JSON.parse(exclusionData);
            
            if (!parsed.state.selectedNodeIds || parsed.state.selectedNodeIds.length === 0) {
                testLog('selectedNodeIds correctly excluded from persistence');
            } else {
                testLog('selectedNodeIds incorrectly persisted', false);
            }
        }
        
        // 9. Summary
        console.log('\n📋 Test Summary:');
        const finalNodeCount = useNodeStore.getState().nodes.length;
        const finalConnectionCount = useNodeStore.getState().connections.length;
        
        console.log(`   Final state: ${finalNodeCount} nodes, ${finalConnectionCount} connections`);
        console.log(`   Nodes added: ${finalNodeCount - initialNodeCount}`);
        console.log(`   Connections added: ${finalConnectionCount - initialConnectionCount}`);
        
        // 10. Cleanup option
        const cleanup = confirm('Clean up test data?');
        if (cleanup) {
            useNodeStore.getState().deleteNode(testNodeId);
            useNodeStore.getState().deleteNode(targetNodeId);
            console.log('🧹 Test data cleaned up');
        } else {
            console.log('🔍 Test data kept for inspection');
        }
        
        console.log('✨ Quick persistence test completed!');
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

// Auto-run if not already running
if (typeof window !== 'undefined' && !window.quickPersistenceTestRunning) {
    window.quickPersistenceTestRunning = true;
    quickPersistenceTest().finally(() => {
        window.quickPersistenceTestRunning = false;
    });
}

// Also expose for manual execution
window.quickPersistenceTest = quickPersistenceTest;
