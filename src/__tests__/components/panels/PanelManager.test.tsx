import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PanelManager } from '../../../components/panels/PanelManager';
import type { PanelState } from '../../../stores/panelStore';

// Mock the panel store
vi.mock('../../../stores/panelStore', () => ({
  usePanelStore: vi.fn()
}));

// Mock the node store
vi.mock('../../../stores/nodeStore', () => ({
  useNodeStore: vi.fn()
}));

// Mock React Flow
vi.mock('@xyflow/react', () => ({
  useReactFlow: vi.fn(() => ({
    getViewport: vi.fn(() => ({ x: 0, y: 0, zoom: 1 })),
    project: vi.fn((point) => point),
  }))
}));

import { usePanelStore } from '../../../stores/panelStore';
import { useNodeStore } from '../../../stores/nodeStore';
const mockUsePanelStore = vi.mocked(usePanelStore);
const mockUseNodeStore = vi.mocked(useNodeStore);

describe('PanelManager', () => {
  const mockPanels: PanelState[] = [
    {
      nodeId: 'node-1',
      panelType: 'summary',
      position: { x: 100, y: 200 },
      zIndex: 1000,
      isVisible: true,
      stackOrder: 0,
      openedAt: Date.now()
    },
    {
      nodeId: 'node-1',
      panelType: 'editor',
      position: { x: 340, y: 200 },
      zIndex: 1001,
      isVisible: true,
      stackOrder: 1,
      openedAt: Date.now() + 1000
    },
    {
      nodeId: 'node-2',
      panelType: 'summary',
      position: { x: 200, y: 300 },
      zIndex: 1002,
      isVisible: true,
      stackOrder: 0,
      openedAt: Date.now() + 2000
    }
  ];
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock node store with test nodes
    mockUseNodeStore.mockReturnValue({
      getNode: vi.fn((id: string) => {
        const nodePositions = {
          'node-1': { x: 100, y: 200 },
          'node-2': { x: 200, y: 300 }
        };
        return nodePositions[id as keyof typeof nodePositions] ? {
          id,
          position: nodePositions[id as keyof typeof nodePositions],
          type: 'case',
          title: `Test Node ${id}`,
          metadata: {},
          connections: { inputs: [], outputs: [] },
          isSelected: false,
          isValid: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } : undefined;
      }),
      nodes: [],
      connections: [],
      selectedNodeIds: [],
      addNode: vi.fn(),
      updateNode: vi.fn(),
      deleteNode: vi.fn(),
      duplicateNode: vi.fn(),
      selectNode: vi.fn(),
      selectNodes: vi.fn(),
      clearSelection: vi.fn(),
      selectAll: vi.fn(),
      addConnection: vi.fn(),
      updateConnection: vi.fn(),
      swapConnection: vi.fn(),
      deleteConnection: vi.fn(),
      deleteNodeConnections: vi.fn(),
      getNodesByType: vi.fn(),
      getSelectedNodes: vi.fn(),
      getNodeConnections: vi.fn(),
      validateConnections: vi.fn()
    });      mockUsePanelStore.mockReturnValue({
      panels: new Map([
        ['node-1-summary', mockPanels[0]],
        ['node-1-editor', mockPanels[1]],
        ['node-2-summary', mockPanels[2]]
      ]),
      nodeGroups: new Map(),
      openPanel: vi.fn(),
      closePanel: vi.fn(),
      isPanelOpen: vi.fn().mockReturnValue(false),
      promoteNodeGroup: vi.fn(),
      getNodePanels: vi.fn(),calculatePanelPosition: vi.fn((_nodeId: string, panelType: string, nodePosition: { x: number; y: number }) => {
        // Simulate the real calculation logic
        const panelIndex = panelType === 'summary' ? 0 : 1;
        const horizontalOffset = 220 + (panelIndex * (320 + 20)); // PANEL_WIDTH + PANEL_SPACING
        return {
          x: nodePosition.x + horizontalOffset,
          y: nodePosition.y
        };
      }),
      removeNodePanels: vi.fn(),
      getActiveNodeGroup: vi.fn(),
      getNodeZIndex: vi.fn(),
      PANEL_WIDTH: 320,
      PANEL_HEIGHT: 400,
      PANEL_SPACING: 20,
      BASE_INACTIVE_Z_INDEX: 1000,
      BASE_ACTIVE_Z_INDEX: 3000
    });
  });

  describe('Rendering All Panels', () => {
    it('renders all visible panels', () => {
      render(<PanelManager />);

      // Check that all three panels are rendered
      expect(screen.getByTestId('node-panel-node-1-summary')).toBeInTheDocument();
      expect(screen.getByTestId('node-panel-node-1-editor')).toBeInTheDocument();
      expect(screen.getByTestId('node-panel-node-2-summary')).toBeInTheDocument();
    });

    it('renders panels with correct content based on type', () => {
      render(<PanelManager />);

      // Check panel titles are rendered correctly
      expect(screen.getByText('Summary')).toBeInTheDocument();
      expect(screen.getByText('Editor')).toBeInTheDocument();
    });

    it('does not render panels that are not visible', () => {
      const hiddenPanel = { ...mockPanels[0], isVisible: false };      mockUsePanelStore.mockReturnValue({
        panels: new Map([['node-1-summary', hiddenPanel]]),
        nodeGroups: new Map(),
        openPanel: vi.fn(),
        closePanel: vi.fn(),
        isPanelOpen: vi.fn().mockReturnValue(false),
        promoteNodeGroup: vi.fn(),
        getNodePanels: vi.fn(),
        calculatePanelPosition: vi.fn(),
        removeNodePanels: vi.fn(),
        getActiveNodeGroup: vi.fn(),
        getNodeZIndex: vi.fn(),
        PANEL_WIDTH: 320,
        PANEL_HEIGHT: 400,
        PANEL_SPACING: 20,
        BASE_INACTIVE_Z_INDEX: 1000,
        BASE_ACTIVE_Z_INDEX: 3000
      });

      render(<PanelManager />);

      expect(screen.queryByTestId('node-panel-node-1-summary')).not.toBeInTheDocument();
    });
  });

  describe('Panel Container', () => {
    it('renders with fixed positioning relative to viewport', () => {
      render(<PanelManager />);

      const container = screen.getByTestId('panel-manager-container');
      expect(container).toHaveClass('fixed', 'inset-0', 'pointer-events-none');
    });

    it('allows pointer events on panel content', () => {
      render(<PanelManager />);

      const panel = screen.getByTestId('node-panel-node-1-summary');
      expect(panel.parentElement).toHaveClass('pointer-events-auto');
    });
  });

  describe('Empty State', () => {
    it('renders empty container when no panels exist', () => {      mockUsePanelStore.mockReturnValue({
        panels: new Map(),
        nodeGroups: new Map(),
        openPanel: vi.fn(),
        closePanel: vi.fn(),
        isPanelOpen: vi.fn().mockReturnValue(false),
        promoteNodeGroup: vi.fn(),
        getNodePanels: vi.fn(),
        calculatePanelPosition: vi.fn(),
        removeNodePanels: vi.fn(),
        getActiveNodeGroup: vi.fn(),
        getNodeZIndex: vi.fn(),
        PANEL_WIDTH: 320,
        PANEL_HEIGHT: 400,
        PANEL_SPACING: 20,
        BASE_INACTIVE_Z_INDEX: 1000,
        BASE_ACTIVE_Z_INDEX: 3000
      });

      render(<PanelManager />);

      const container = screen.getByTestId('panel-manager-container');
      expect(container).toBeInTheDocument();
      expect(container.children).toHaveLength(0);
    });
  });

  describe('Panel Positioning', () => {
    it('calculates panel positions based on node positions', () => {
      render(<PanelManager />);

      // Get the panel elements
      const summaryPanel = screen.getByTestId('node-panel-node-1-summary');
      const editorPanel = screen.getByTestId('node-panel-node-1-editor');

      // Check that panels are positioned relative to their nodes
      // Node 1 is at (100, 200), so summary panel should be at (320, 200) and editor at (660, 200)
      expect(summaryPanel).toHaveStyle('left: 320px'); // 100 + 220
      expect(summaryPanel).toHaveStyle('top: 200px');
      
      expect(editorPanel).toHaveStyle('left: 660px'); // 100 + 220 + 320 + 20
      expect(editorPanel).toHaveStyle('top: 200px');
    });

    it('positions panels for different nodes correctly', () => {
      render(<PanelManager />);

      const node2Panel = screen.getByTestId('node-panel-node-2-summary');
      
      // Node 2 is at (200, 300), so its summary panel should be at (420, 300)
      expect(node2Panel).toHaveStyle('left: 420px'); // 200 + 220
      expect(node2Panel).toHaveStyle('top: 300px');
    });
  });
});
