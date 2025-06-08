import { describe, it, expect, beforeEach } from 'vitest';
import { usePanelStore } from '../../stores/panelStore';

describe('Node Panel Integration Test', () => {
  beforeEach(() => {
    // Reset store state before each test
    usePanelStore.getState().reset();
  });

  it('should open and close panels for nodes', () => {
    const store = usePanelStore.getState();
    
    // Open a summary panel for a node
    store.openPanel('test-node-1', 'summary');
    
    // Verify panel was created
    const panels = store.getNodePanels('test-node-1');
    expect(panels).toHaveLength(1);
    expect(panels[0].panelType).toBe('summary');
    expect(panels[0].isVisible).toBe(true);
    
    // Open an editor panel for the same node
    store.openPanel('test-node-1', 'editor');
    
    // Verify both panels exist
    const updatedPanels = store.getNodePanels('test-node-1');
    expect(updatedPanels).toHaveLength(2);
    
    // Close the summary panel
    store.closePanel('test-node-1', 'summary');
    
    // Verify only editor panel remains
    const finalPanels = store.getNodePanels('test-node-1');
    expect(finalPanels).toHaveLength(1);
    expect(finalPanels[0].panelType).toBe('editor');
  });

  it('should promote node groups correctly', () => {
    const store = usePanelStore.getState();
    
    // Create panels for two different nodes
    store.openPanel('node-1', 'summary');
    store.openPanel('node-2', 'editor');
      // Promote node-1
    store.promoteNodeGroup('node-1');
    expect(store.getActiveNodeGroup()).toBe('node-1');
    
    // Promote node-2
    store.promoteNodeGroup('node-2');
    expect(store.getActiveNodeGroup()).toBe('node-2');
    
    // Verify z-index management
    expect(store.getNodeZIndex('node-2')).toBe(3000); // Active
    expect(store.getNodeZIndex('node-1')).toBeLessThan(3000); // Inactive
  });

  it('should calculate panel positions correctly', () => {
    const store = usePanelStore.getState();
    
    const nodePosition = { x: 100, y: 200 };
    
    // Open first panel
    store.openPanel('test-node', 'summary');
    
    const summaryPosition = store.calculatePanelPosition('test-node', 'summary', nodePosition);
    
    // Panel should be positioned to the right of the node
    expect(summaryPosition.x).toBeGreaterThan(nodePosition.x);
    expect(summaryPosition.y).toBe(nodePosition.y);
    
    // Open second panel
    store.openPanel('test-node', 'editor');
    
    const editorPosition = store.calculatePanelPosition('test-node', 'editor', nodePosition);
    
    // Second panel should be further to the right
    expect(editorPosition.x).toBeGreaterThan(summaryPosition.x);
    expect(editorPosition.y).toBe(nodePosition.y);
  });
});
