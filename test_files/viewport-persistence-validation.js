// Viewport Persistence Test Script
// This script validates that viewport state is being persisted to localStorage

console.log('🧪 Testing Viewport Persistence...');

// Function to simulate viewport changes and test persistence
function testViewportPersistence() {
    console.log('\n📋 Current localStorage state:');
    
    // Check if ui store persistence exists
    const uiStoreData = localStorage.getItem('recapmap-ui-store');
    if (uiStoreData) {
        try {
            const parsed = JSON.parse(uiStoreData);
            console.log('✅ UI Store found in localStorage');
            console.log('📊 Canvas state:', parsed.state?.canvas);
            console.log('🎛️ UI settings:', {
                theme: parsed.state?.ui?.theme,
                isGridVisible: parsed.state?.ui?.isGridVisible,
                isMiniMapVisible: parsed.state?.ui?.isMiniMapVisible,
                snapToGrid: parsed.state?.ui?.snapToGrid,
                gridSize: parsed.state?.ui?.gridSize
            });
        } catch (error) {
            console.error('❌ Error parsing UI store data:', error);
        }
    } else {
        console.log('⚠️ No UI store data found in localStorage');
    }
    
    // Check node store for comparison
    const nodeStoreData = localStorage.getItem('recapmap-node-store');
    if (nodeStoreData) {
        try {
            const parsed = JSON.parse(nodeStoreData);
            console.log('✅ Node Store found in localStorage');
            console.log('📈 Node count:', parsed.state?.nodes?.length || 0);
            console.log('🔗 Connection count:', parsed.state?.connections?.length || 0);
        } catch (error) {
            console.error('❌ Error parsing node store data:', error);
        }
    }
    
    console.log('\n🔑 All localStorage keys:');
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.includes('recapmap')) {
            console.log(`  - ${key}`);
        }
    }
}

// Instructions for manual testing
console.log('\n📝 Manual Testing Instructions:');
console.log('1. Open the RecapMap application');
console.log('2. Pan the canvas to a different position');
console.log('3. Zoom in or out');
console.log('4. Change UI settings (grid visibility, theme, etc.)');
console.log('5. Refresh the page');
console.log('6. Check if the viewport position and UI settings are restored');

// Run the test
testViewportPersistence();

// Export for browser console usage
if (typeof window !== 'undefined') {
    window.testViewportPersistence = testViewportPersistence;
    console.log('\n💡 You can run testViewportPersistence() in the browser console to check persistence state');
}
