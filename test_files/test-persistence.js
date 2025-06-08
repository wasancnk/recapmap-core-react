// Simple test to verify nodeStore can be imported and persistence works
import { useNodeStore } from '../src/stores/nodeStore.js';

// Test the import works
console.log('✅ Successfully imported useNodeStore');

// Test basic store functionality
const store = useNodeStore.getState();
console.log('📦 Current nodes:', store.nodes.length);
console.log('🔗 Current connections:', store.connections.length);

// Add a test node
const testNodeId = store.addNode('usecase', { x: 100, y: 100 });
console.log('➕ Added test node with ID:', testNodeId);

// Check if node was added
const updatedStore = useNodeStore.getState();
console.log('📦 Nodes after adding:', updatedStore.nodes.length);

// Check localStorage persistence
const persistedData = localStorage.getItem('recapmap-node-store');
if (persistedData) {
  console.log('💾 Data persisted to localStorage successfully');
  const parsed = JSON.parse(persistedData);
  console.log('📊 Persisted data structure:', Object.keys(parsed.state || {}));
} else {
  console.log('❌ No data found in localStorage');
}
