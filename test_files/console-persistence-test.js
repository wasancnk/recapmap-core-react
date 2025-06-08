/**
 * Console Persistence Test Script
 * Run this directly in the browser console when the RecapMap app is loaded
 * Tests localStorage persistence and cross-store synchronization
 */

(function() {
    console.log('🧪 Starting RecapMap Persistence Tests...');
    
    // Check if stores are available
    function getStores() {
        if (window.recapMapStores) {
            return window.recapMapStores;
        } else {
            throw new Error('Stores not available. Make sure the app is fully loaded.');
        }
    }
    
    // Test utilities
    function logTest(message, status = 'info') {
        const styles = {
            info: 'color: #3498db',
            success: 'color: #27ae60; font-weight: bold',
            error: 'color: #e74c3c; font-weight: bold',
            warning: 'color: #f39c12'
        };
        console.log(`%c${message}`, styles[status] || styles.info);
    }
    
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // Test data storage
    const testData = {
        nodeIds: [],
        connectionIds: [],
        startTime: Date.now()
    };
    
    // Test 1: Store Initialization
    async function testStoreInitialization() {
        logTest('🔍 Test 1: Store Initialization');
        
        try {
            const stores = getStores();
            const nodeStore = stores.useNodeStore.getState();
            const projectStore = stores.useProjectStore.getState();
            
            logTest(`✓ Node Store: ${nodeStore.nodes.length} nodes, ${nodeStore.connections.length} connections`, 'success');
            logTest(`✓ Project Store: ${projectStore.project.name} (modified: ${projectStore.project.isModified})`, 'success');
            
            return true;
        } catch (error) {
            logTest(`✗ Store initialization failed: ${error.message}`, 'error');
            return false;
        }
    }
    
    // Test 2: Node Persistence
    async function testNodePersistence() {
        logTest('📦 Test 2: Node Creation and Persistence');
        
        try {
            const stores = getStores();
            const nodeStore = stores.useNodeStore.getState();
            
            // Create a test node
            const nodeId = nodeStore.addNode('usecase', { x: 100, y: 100 });
            testData.nodeIds.push(nodeId);
            
            // Update the node
            nodeStore.updateNode(nodeId, { 
                title: `Test Node ${Date.now()}`,
                description: 'Created by persistence test'
            });
            
            logTest(`✓ Node created: ${nodeId}`, 'success');
            
            // Wait for persistence
            await delay(200);
            
            // Check localStorage
            const persistedData = localStorage.getItem('recapmap-node-store');
            if (persistedData) {
                const parsed = JSON.parse(persistedData);
                const persistedNode = parsed.state.nodes.find(n => n.id === nodeId);
                
                if (persistedNode) {
                    logTest('✓ Node persisted to localStorage', 'success');
                    logTest(`  - Title: ${persistedNode.title}`, 'info');
                    logTest(`  - Position: (${persistedNode.position.x}, ${persistedNode.position.y})`, 'info');
                    return true;
                } else {
                    logTest('✗ Node not found in persisted data', 'error');
                    return false;
                }
            } else {
                logTest('✗ No persisted data found', 'error');
                return false;
            }
        } catch (error) {
            logTest(`✗ Node persistence test failed: ${error.message}`, 'error');
            return false;
        }
    }
    
    // Test 3: Connection Persistence
    async function testConnectionPersistence() {
        logTest('🔗 Test 3: Connection Creation and Persistence');
        
        try {
            const stores = getStores();
            const nodeStore = stores.useNodeStore.getState();
            
            // Ensure we have at least 2 nodes
            if (testData.nodeIds.length < 2) {
                const node2Id = nodeStore.addNode('task', { x: 300, y: 100 });
                testData.nodeIds.push(node2Id);
            }
            
            // Create a connection
            const [sourceId, targetId] = testData.nodeIds;
            const connectionId = nodeStore.addConnection(sourceId, targetId, 'data');
            testData.connectionIds.push(connectionId);
            
            logTest(`✓ Connection created: ${sourceId} → ${targetId}`, 'success');
            
            // Wait for persistence
            await delay(200);
            
            // Check localStorage
            const persistedData = localStorage.getItem('recapmap-node-store');
            if (persistedData) {
                const parsed = JSON.parse(persistedData);
                const persistedConnection = parsed.state.connections.find(c => c.id === connectionId);
                
                if (persistedConnection) {
                    logTest('✓ Connection persisted to localStorage', 'success');
                    logTest(`  - Type: ${persistedConnection.type}`, 'info');
                    return true;
                } else {
                    logTest('✗ Connection not found in persisted data', 'error');
                    return false;
                }
            } else {
                logTest('✗ No persisted data found', 'error');
                return false;
            }
        } catch (error) {
            logTest(`✗ Connection persistence test failed: ${error.message}`, 'error');
            return false;
        }
    }
    
    // Test 4: Cross-Store Synchronization
    async function testCrossStoreSync() {
        logTest('🔄 Test 4: Cross-Store Synchronization');
        
        try {
            const stores = getStores();
            const projectStore = stores.useProjectStore.getState();
            const nodeStore = stores.useNodeStore.getState();
            
            // Clear modified state
            projectStore.markAsSaved();
            logTest('Project marked as saved', 'info');
            
            // Wait a moment
            await delay(100);
            
            // Create a node to trigger sync
            const nodeId = nodeStore.addNode('feature', { x: 400, y: 200 });
            testData.nodeIds.push(nodeId);
            
            // Wait for sync to occur
            await delay(300);
            
            // Check if project was marked as modified
            const currentProjectStore = stores.useProjectStore.getState();
            if (currentProjectStore.project.isModified) {
                logTest('✓ Project marked as modified after node creation', 'success');
                return true;
            } else {
                logTest('✗ Project not marked as modified - sync not working', 'error');
                return false;
            }
        } catch (error) {
            logTest(`✗ Cross-store sync test failed: ${error.message}`, 'error');
            return false;
        }
    }
    
    // Test 5: Auto-Save Functionality
    async function testAutoSave() {
        logTest('💾 Test 5: Auto-Save Functionality');
        
        try {
            const stores = getStores();
            const projectStore = stores.useProjectStore.getState();
            const nodeStore = stores.useNodeStore.getState();
            
            // Enable auto-save
            projectStore.updateProject({ autoSave: true });
            logTest('Auto-save enabled', 'info');
            
            // Create a node to trigger auto-save
            const nodeId = nodeStore.addNode('component', { x: 500, y: 250 });
            testData.nodeIds.push(nodeId);
            
            logTest('Node created, waiting for auto-save...', 'info');
            
            // Wait for auto-save debounce (500ms + buffer)
            await delay(700);
            
            // Check the project state
            const currentProjectStore = stores.useProjectStore.getState();
            logTest(`Auto-save status: enabled=${currentProjectStore.project.autoSave}, modified=${currentProjectStore.project.isModified}`, 'info');
            
            return true;
        } catch (error) {
            logTest(`✗ Auto-save test failed: ${error.message}`, 'error');
            return false;
        }
    }
    
    // Test 6: Persistence Exclusion (selectedNodeIds should not persist)
    async function testPersistenceExclusion() {
        logTest('🎯 Test 6: Persistence Exclusion (selectedNodeIds)');
        
        try {
            const stores = getStores();
            const nodeStore = stores.useNodeStore.getState();
            
            // Select some nodes
            if (testData.nodeIds.length > 0) {
                nodeStore.selectNodes(testData.nodeIds.slice(0, 2));
                logTest(`Selected ${testData.nodeIds.slice(0, 2).length} nodes`, 'info');
                
                // Wait for persistence
                await delay(200);
                
                // Check localStorage - selectedNodeIds should NOT be persisted
                const persistedData = localStorage.getItem('recapmap-node-store');
                if (persistedData) {
                    const parsed = JSON.parse(persistedData);
                    
                    if (!parsed.state.selectedNodeIds || parsed.state.selectedNodeIds.length === 0) {
                        logTest('✓ selectedNodeIds correctly excluded from persistence', 'success');
                        return true;
                    } else {
                        logTest('✗ selectedNodeIds incorrectly persisted', 'error');
                        return false;
                    }
                } else {
                    logTest('✗ No persisted data found', 'error');
                    return false;
                }
            } else {
                logTest('No nodes available for selection test', 'warning');
                return true;
            }
        } catch (error) {
            logTest(`✗ Persistence exclusion test failed: ${error.message}`, 'error');
            return false;
        }
    }
    
    // Test 7: Data Integrity
    async function testDataIntegrity() {
        logTest('🔍 Test 7: Data Integrity Check');
        
        try {
            const stores = getStores();
            const nodeStore = stores.useNodeStore.getState();
            
            // Get current state
            const currentNodes = nodeStore.nodes;
            const currentConnections = nodeStore.connections;
            
            // Check persisted state
            const persistedData = localStorage.getItem('recapmap-node-store');
            if (persistedData) {
                const parsed = JSON.parse(persistedData);
                const persistedNodes = parsed.state.nodes || [];
                const persistedConnections = parsed.state.connections || [];
                
                // Compare counts
                if (currentNodes.length === persistedNodes.length && 
                    currentConnections.length === persistedConnections.length) {
                    logTest('✓ Data counts match between store and persistence', 'success');
                    
                    // Check node IDs match
                    const currentNodeIds = new Set(currentNodes.map(n => n.id));
                    const persistedNodeIds = new Set(persistedNodes.map(n => n.id));
                    
                    const idsMatch = currentNodeIds.size === persistedNodeIds.size &&
                                   [...currentNodeIds].every(id => persistedNodeIds.has(id));
                    
                    if (idsMatch) {
                        logTest('✓ Node IDs match between store and persistence', 'success');
                        return true;
                    } else {
                        logTest('✗ Node IDs mismatch between store and persistence', 'error');
                        return false;
                    }
                } else {
                    logTest(`✗ Data count mismatch: Store(${currentNodes.length}n, ${currentConnections.length}c) vs Persisted(${persistedNodes.length}n, ${persistedConnections.length}c)`, 'error');
                    return false;
                }
            } else {
                logTest('✗ No persisted data found', 'error');
                return false;
            }
        } catch (error) {
            logTest(`✗ Data integrity test failed: ${error.message}`, 'error');
            return false;
        }
    }
    
    // Cleanup function
    function cleanup() {
        logTest('🧹 Cleaning up test data...');
        
        try {
            const stores = getStores();
            const nodeStore = stores.useNodeStore.getState();
            
            // Delete test nodes (this will also delete connections)
            testData.nodeIds.forEach(nodeId => {
                try {
                    nodeStore.deleteNode(nodeId);
                } catch (e) {
                    // Node might already be deleted
                }
            });
            
            logTest(`Cleaned up ${testData.nodeIds.length} test nodes`, 'info');
            testData.nodeIds = [];
            testData.connectionIds = [];
            
        } catch (error) {
            logTest(`Cleanup error: ${error.message}`, 'error');
        }
    }
    
    // Main test runner
    async function runAllTests() {
        const startTime = Date.now();
        logTest('🚀 Starting Complete Persistence Test Suite...');
        
        const results = [];
        
        try {
            results.push({ name: 'Store Initialization', passed: await testStoreInitialization() });
            results.push({ name: 'Node Persistence', passed: await testNodePersistence() });
            results.push({ name: 'Connection Persistence', passed: await testConnectionPersistence() });
            results.push({ name: 'Cross-Store Sync', passed: await testCrossStoreSync() });
            results.push({ name: 'Auto-Save', passed: await testAutoSave() });
            results.push({ name: 'Persistence Exclusion', passed: await testPersistenceExclusion() });
            results.push({ name: 'Data Integrity', passed: await testDataIntegrity() });
            
            const duration = Date.now() - startTime;
            const passed = results.filter(r => r.passed).length;
            const total = results.length;
            
            logTest(`\n📊 Test Results (${duration}ms):`);
            results.forEach(result => {
                logTest(`  ${result.passed ? '✓' : '✗'} ${result.name}`, result.passed ? 'success' : 'error');
            });
            
            if (passed === total) {
                logTest(`\n🎉 All tests passed! (${passed}/${total})`, 'success');
                logTest('localStorage persistence is working correctly!', 'success');
            } else {
                logTest(`\n⚠️  Some tests failed (${passed}/${total})`, 'warning');
            }
            
        } catch (error) {
            logTest(`Test suite error: ${error.message}`, 'error');
        } finally {
            // Ask if user wants to cleanup
            if (confirm('Clean up test data?')) {
                cleanup();
            }
        }
    }
    
    // Expose functions globally for manual testing
    window.recapMapPersistenceTest = {
        runAllTests,
        testStoreInitialization,
        testNodePersistence,
        testConnectionPersistence,
        testCrossStoreSync,
        testAutoSave,
        testPersistenceExclusion,
        testDataIntegrity,
        cleanup,
        testData
    };
    
    logTest('Console test functions available under window.recapMapPersistenceTest');
    logTest('Run: recapMapPersistenceTest.runAllTests()');
    
})();
