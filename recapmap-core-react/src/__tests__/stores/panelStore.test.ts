import { describe, it, expect, beforeEach } from 'vitest';
import { usePanelStore } from '../../stores/panelStore';

describe('PanelStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    usePanelStore.getState().reset();
  });

  describe('Panel Management', () => {
    it('should open a panel for a node', () => {
      const store = usePanelStore.getState();
      
      store.openPanel('node-1', 'summary');
      
      const panels = store.getNodePanels('node-1');
      expect(panels).toHaveLength(1);
      expect(panels[0]).toMatchObject({
        nodeId: 'node-1',
        panelType: 'summary',
        isVisible: true,
        stackOrder: 0
      });
    });

    it('should close a specific panel for a node', () => {
      const store = usePanelStore.getState();
      
      // Open two panels
      store.openPanel('node-1', 'summary');
      store.openPanel('node-1', 'editor');
      
      // Close one panel
      store.closePanel('node-1', 'summary');
      
      const panels = store.getNodePanels('node-1');
      expect(panels).toHaveLength(1);
      expect(panels[0].panelType).toBe('editor');
    });

    it('should stack multiple panels for the same node in order of opening', () => {
      const store = usePanelStore.getState();
      
      store.openPanel('node-1', 'summary');
      store.openPanel('node-1', 'editor');
      store.openPanel('node-1', 'ai-chat');
      
      const panels = store.getNodePanels('node-1');
      expect(panels).toHaveLength(3);
      expect(panels[0].stackOrder).toBe(0); // summary - opened first
      expect(panels[1].stackOrder).toBe(1); // editor - opened second
      expect(panels[2].stackOrder).toBe(2); // ai-chat - opened third
    });

    it('should not duplicate panels of the same type for a node', () => {
      const store = usePanelStore.getState();
      
      store.openPanel('node-1', 'summary');
      store.openPanel('node-1', 'summary'); // Try to open again
      
      const panels = store.getNodePanels('node-1');
      expect(panels).toHaveLength(1);
    });
  });

  describe('Z-Index Management', () => {
    it('should promote a node group to active when interacted with', () => {
      const store = usePanelStore.getState();
      
      // Create panels for multiple nodes
      store.openPanel('node-1', 'summary');
      store.openPanel('node-2', 'editor');
        // Promote node-2 group
      store.promoteNodeGroup('node-2');
      
      expect(store.getActiveNodeGroup()).toBe('node-2');
    });

    it('should assign correct z-index values to active node group', () => {
      const store = usePanelStore.getState();
      
      // Open multiple panels for a node
      store.openPanel('node-1', 'summary');
      store.openPanel('node-1', 'editor');
        // Promote the node group
      store.promoteNodeGroup('node-1');
      
      const panels = store.getNodePanels('node-1');
      const activeNodeZIndex = store.getNodeZIndex('node-1');
      
      expect(activeNodeZIndex).toBe(3000); // Active node base z-index
      expect(panels[0].zIndex).toBe(3001); // First panel
      expect(panels[1].zIndex).toBe(3002); // Second panel
    });

    it('should demote previous active group when promoting new group', () => {
      const store = usePanelStore.getState();
      
      // Create panels for two nodes
      store.openPanel('node-1', 'summary');
      store.openPanel('node-2', 'editor');
        // Promote node-1 first
      store.promoteNodeGroup('node-1');
      expect(store.getActiveNodeGroup()).toBe('node-1');
      
      // Promote node-2
      store.promoteNodeGroup('node-2');
      expect(store.getActiveNodeGroup()).toBe('node-2');
      
      // Check z-index values
      expect(store.getNodeZIndex('node-1')).toBeLessThan(3000); // Demoted
      expect(store.getNodeZIndex('node-2')).toBe(3000); // Active
    });
  });

  describe('Panel Positioning', () => {
    it('should calculate correct panel positions based on node position', () => {
      const store = usePanelStore.getState();
        const nodePosition = { x: 100, y: 200 };
      store.openPanel('node-1', 'summary');
      
      const panelPosition = store.calculatePanelPosition('node-1', 'summary', nodePosition);
      
      // Panel should be positioned to the right of the node
      expect(panelPosition.x).toBeGreaterThan(nodePosition.x);
      expect(panelPosition.y).toBe(nodePosition.y); // Same vertical position
    });

    it('should stack panels horizontally to the right', () => {
      const store = usePanelStore.getState();
      
      const nodePosition = { x: 100, y: 200 };
      store.openPanel('node-1', 'summary');
      store.openPanel('node-1', 'editor');
      
      const summaryPosition = store.calculatePanelPosition('node-1', 'summary', nodePosition);
      const editorPosition = store.calculatePanelPosition('node-1', 'editor', nodePosition);
      
      // Editor should be further right than summary
      expect(editorPosition.x).toBeGreaterThan(summaryPosition.x);
      expect(editorPosition.y).toBe(summaryPosition.y); // Same vertical position
    });
  });

  describe('Cleanup', () => {
    it('should remove all panels when a node is deleted', () => {
      const store = usePanelStore.getState();
      
      store.openPanel('node-1', 'summary');
      store.openPanel('node-1', 'editor');
      
      store.removeNodePanels('node-1');
      
      const panels = store.getNodePanels('node-1');
      expect(panels).toHaveLength(0);
    });

    it('should clean up active node group when all panels are closed', () => {
      const store = usePanelStore.getState();
        store.openPanel('node-1', 'summary');
      store.promoteNodeGroup('node-1');
      
      store.closePanel('node-1', 'summary');
      
      // Active group should be cleared when no panels remain
      expect(store.getActiveNodeGroup()).toBeNull();
    });
  });
});
