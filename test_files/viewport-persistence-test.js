// Test viewport persistence functionality
console.log('🧪 Testing Viewport Persistence');

// Helper function to check localStorage
function checkLocalStorage() {
  console.log('\n📦 Current localStorage state:');
  
  // Check uiStore persistence
  const uiStoreData = localStorage.getItem('recapmap-ui-store');
  if (uiStoreData) {
    console.log('✅ UI Store found in localStorage:');
    const parsedData = JSON.parse(uiStoreData);
    console.log('   Canvas state:', parsedData.state?.canvas);
    console.log('   UI state:', parsedData.state?.ui);
  } else {
    console.log('❌ UI Store not found in localStorage');
  }
  
  // Check nodeStore persistence (should still work)
  const nodeStoreData = localStorage.getItem('recapmap-node-store');
  if (nodeStoreData) {
    console.log('✅ Node Store found in localStorage');
    const parsedData = JSON.parse(nodeStoreData);
    console.log('   Nodes count:', parsedData.state?.nodes?.length || 0);
    console.log('   Connections count:', parsedData.state?.connections?.length || 0);
  } else {
    console.log('❌ Node Store not found in localStorage');
  }
}

// Test persistence immediately
checkLocalStorage();

// Function to simulate viewport changes (for manual testing)
function simulateViewportChange() {
  console.log('\n🎯 To test viewport persistence:');
  console.log('1. Open the app in browser');
  console.log('2. Pan around the canvas (drag empty space)');
  console.log('3. Zoom in/out using mouse wheel');
  console.log('4. Refresh the page');
  console.log('5. Check if the viewport position and zoom are restored');
  console.log('6. Run this script again to see if canvas state was persisted');
}

simulateViewportChange();

// Monitor localStorage changes (if run in browser)
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'recapmap-ui-store') {
      console.log('🔄 UI Store localStorage changed:', e.newValue);
    }
  });
  
  // Set up periodic checking
  setInterval(() => {
    console.log('\n⏱️  Periodic localStorage check:');
    checkLocalStorage();
  }, 10000); // Check every 10 seconds
}
