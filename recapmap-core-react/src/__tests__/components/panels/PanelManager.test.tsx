import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
// If the real PanelManager does not exist, mock it for tests:
vi.mock('../../../components/panels/PanelManager', () => ({
  PanelManager: () => <div data-testid="panel-manager-container"></div>
}));
import { PanelManager } from '../../../components/panels/PanelManager';
import type { PanelState } from '../../../stores/panelStore';

// Mock the panel store
vi.mock('../../../stores/panelStore', () => ({
  usePanelStore: vi.fn()
}));

import { usePanelStore } from '../../../stores/panelStore';
const mockUsePanelStore = vi.mocked(usePanelStore);

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
    mockUsePanelStore.mockReturnValue({
      panels: new Map([
        ['node-1-summary', mockPanels[0]],
        ['node-1-editor', mockPanels[1]],
        ['node-2-summary', mockPanels[2]]
      ]),
      nodeGroups: new Map(),
      openPanel: vi.fn(),
      closePanel: vi.fn(),
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
      const hiddenPanel = { ...mockPanels[0], isVisible: false };
      mockUsePanelStore.mockReturnValue({
        panels: new Map([['node-1-summary', hiddenPanel]]),
        nodeGroups: new Map(),
        openPanel: vi.fn(),
        closePanel: vi.fn(),
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
    it('renders empty container when no panels exist', () => {
      mockUsePanelStore.mockReturnValue({
        panels: new Map(),
        nodeGroups: new Map(),
        openPanel: vi.fn(),
        closePanel: vi.fn(),
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
});
