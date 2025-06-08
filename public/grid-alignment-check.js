// Grid Alignment Verification Script
// Run this in the browser console to check node alignment

const GRID_SIZE = 20;
const NODE_WIDTH = 160;
const NODE_HEIGHT_BASE = 120;

console.log('🔍 GRID ALIGNMENT VERIFICATION');
console.log('================================');

// Check if all nodes are properly grid-aligned
const verifyGridAlignment = () => {
  const nodes = document.querySelectorAll('[data-node-type]');
  
  if (nodes.length === 0) {
    console.log('❌ No nodes found in the canvas');
    return;
  }

  console.log(`📊 Found ${nodes.length} nodes to verify`);
  console.log('');

  let allAligned = true;
  const results = [];

  nodes.forEach((node, index) => {
    const rect = node.getBoundingClientRect();
    const parent = node.closest('.react-flow__node');
    const transform = parent ? window.getComputedStyle(parent).transform : 'none';
    
    // Extract position from transform matrix
    let x = 0, y = 0;
    if (transform && transform !== 'none') {
      const matrix = transform.match(/matrix\(([^)]+)\)/);
      if (matrix) {
        const values = matrix[1].split(',').map(Number);
        x = values[4];
        y = values[5];
      }
    }

    const nodeType = node.dataset.nodeType;
    const gridHeight = node.dataset.gridHeight;
    
    // Check alignment
    const isXAligned = x % GRID_SIZE === 0;
    const isYAligned = y % GRID_SIZE === 0;
    const isWidthAligned = rect.width % GRID_SIZE === 0;
    const isHeightAligned = rect.height % GRID_SIZE === 0;
    
    const nodeAligned = isXAligned && isYAligned && isWidthAligned && isHeightAligned;
    if (!nodeAligned) allAligned = false;

    const result = {
      index: index + 1,
      type: nodeType,
      position: { x: Math.round(x), y: Math.round(y) },
      size: { width: Math.round(rect.width), height: Math.round(rect.height) },
      gridPosition: { x: x / GRID_SIZE, y: y / GRID_SIZE },
      gridSize: { width: rect.width / GRID_SIZE, height: rect.height / GRID_SIZE },
      alignment: {
        x: isXAligned,
        y: isYAligned,
        width: isWidthAligned,
        height: isHeightAligned,
        overall: nodeAligned
      },
      gridHeight: gridHeight
    };

    results.push(result);

    // Log individual node results
    const status = nodeAligned ? '✅' : '❌';
    console.log(`${status} Node ${index + 1} (${nodeType}):`);
    console.log(`   Position: (${result.position.x}, ${result.position.y}) - Grid: (${result.gridPosition.x}, ${result.gridPosition.y})`);
    console.log(`   Size: ${result.size.width}×${result.size.height}px - Grid: ${result.gridSize.width}×${result.gridSize.height} units`);
    console.log(`   Alignment: X:${isXAligned} Y:${isYAligned} W:${isWidthAligned} H:${isHeightAligned}`);
    if (!nodeAligned) {
      console.log(`   ⚠️  Misalignment detected!`);
    }
    console.log('');
  });

  // Summary
  console.log('📋 ALIGNMENT SUMMARY');
  console.log('===================');
  console.log(`Total nodes checked: ${results.length}`);
  console.log(`Properly aligned: ${results.filter(r => r.alignment.overall).length}`);
  console.log(`Misaligned: ${results.filter(r => !r.alignment.overall).length}`);
  console.log(`Overall result: ${allAligned ? '✅ All nodes grid-aligned' : '❌ Some nodes misaligned'}`);

  return { allAligned, results };
};

// Check visual grid alignment (centers vs grid dots)
const checkVisualAlignment = () => {
  console.log('');
  console.log('🎯 VISUAL ALIGNMENT CHECK');
  console.log('=========================');
  
  const nodes = document.querySelectorAll('[data-node-type]');
  
  nodes.forEach((node, index) => {
    const rect = node.getBoundingClientRect();
    const parent = node.closest('.react-flow__node');
    const transform = parent ? window.getComputedStyle(parent).transform : 'none';
    
    let x = 0, y = 0;
    if (transform && transform !== 'none') {
      const matrix = transform.match(/matrix\(([^)]+)\)/);
      if (matrix) {
        const values = matrix[1].split(',').map(Number);
        x = values[4];
        y = values[5];
      }
    }

    // Calculate node center
    const centerX = x + rect.width / 2;
    const centerY = y + rect.height / 2;
    
    // Find nearest grid intersection
    const nearestGridX = Math.round(centerX / GRID_SIZE) * GRID_SIZE;
    const nearestGridY = Math.round(centerY / GRID_SIZE) * GRID_SIZE;
    
    const offsetX = Math.abs(centerX - nearestGridX);
    const offsetY = Math.abs(centerY - nearestGridY);
    
    const isVisuallyCentered = offsetX <= 1 && offsetY <= 1; // Allow 1px tolerance
    
    const status = isVisuallyCentered ? '✅' : '⚠️';
    console.log(`${status} Node ${index + 1}: Center (${Math.round(centerX)}, ${Math.round(centerY)}) - Nearest grid (${nearestGridX}, ${nearestGridY}) - Offset: (${Math.round(offsetX)}, ${Math.round(offsetY)})`);
  });
};

// Run all checks
const runFullAlignment = () => {
  const mainResult = verifyGridAlignment();
  checkVisualAlignment();
  
  console.log('');
  console.log('🔧 RECOMMENDED ACTIONS');
  console.log('======================');
  
  if (mainResult.allAligned) {
    console.log('✅ No action needed - all nodes are properly grid-aligned!');
  } else {
    console.log('❌ Grid alignment issues detected:');
    console.log('1. Check if snap-to-grid is enabled (Ctrl+G)');
    console.log('2. Drag and drop nodes to trigger re-alignment');
    console.log('3. Verify grid size is set to 20px');
    console.log('4. Check if node positioning logic is correct');
  }
  
  return mainResult;
};

// Export functions for manual use
window.gridAlignmentTools = {
  verify: verifyGridAlignment,
  checkVisual: checkVisualAlignment,
  runFull: runFullAlignment,
  GRID_SIZE,
  NODE_WIDTH,
  NODE_HEIGHT_BASE
};

console.log('🚀 Grid alignment verification tools loaded!');
console.log('📝 Available commands:');
console.log('   gridAlignmentTools.runFull() - Run complete alignment check');
console.log('   gridAlignmentTools.verify() - Check grid alignment only');
console.log('   gridAlignmentTools.checkVisual() - Check visual centering only');
console.log('');
console.log('▶️  Running automatic check...');
runFullAlignment();
