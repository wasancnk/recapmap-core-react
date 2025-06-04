import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NodePanel } from '../../../components/panels/NodePanel';
import type { PanelState } from '../../../stores/panelStore';

// Mock the panel store
vi.mock('../../../stores/panelStore', () => ({
  usePanelStore: vi.fn()
}));

import { usePanelStore } from '../../../stores/panelStore';
const mockUsePanelStore = vi.mocked(usePanelStore);

describe('NodePanel', () => {
  const mockClosePanel = vi.fn();
  const mockPromoteNodeGroup = vi.fn();
  const basePanelState: PanelState = {
    nodeId: 'node-1',
    panelType: 'summary',
    position: { x: 100, y: 200 },
    zIndex: 1000,
    isVisible: true,
    stackOrder: 0,
    openedAt: Date.now()
  };
  beforeEach(() => {
    vi.clearAllMocks();
    mockUsePanelStore.mockReturnValue({
      panels: new Map(),
      nodeGroups: new Map(),
      openPanel: vi.fn(),
      closePanel: mockClosePanel,
      promoteNodeGroup: mockPromoteNodeGroup,
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

  describe('Basic Rendering', () => {    it('renders panel with correct positioning and z-index', () => {
      render(
        <NodePanel
          panelState={basePanelState}
          nodeId="node-1"
        >
          <div>Panel Content</div>
        </NodePanel>
      );

      const panel = screen.getByTestId('node-panel-node-1-summary');
      expect(panel).toBeInTheDocument();
      expect(panel).toHaveStyle({
        position: 'absolute',
        left: '100px',
        top: '200px',
        zIndex: '1000'
      });
    });

    it('applies correct dimensions', () => {
      render(
        <NodePanel
          panelState={basePanelState}
          nodeId="node-1"
        >
          <div>Panel Content</div>
        </NodePanel>
      );      const panel = screen.getByTestId('node-panel-node-1-summary');
      expect(panel).toHaveClass('w-80', 'h-96'); // 320x384px (w-80 = 320px, h-96 = 384px)
    });

    it('renders panel content', () => {
      render(
        <NodePanel
          panelState={basePanelState}
          nodeId="node-1"
        >
          <div data-testid="panel-content">Panel Content</div>
        </NodePanel>
      );

      expect(screen.getByTestId('panel-content')).toBeInTheDocument();
    });
  });

  describe('Panel Header', () => {
    it('renders panel title based on type', () => {
      render(
        <NodePanel
          panelState={basePanelState}
          nodeId="node-1"
        >
          <div>Content</div>
        </NodePanel>
      );

      expect(screen.getByText('Summary')).toBeInTheDocument();
    });

    it('renders close button', () => {
      render(
        <NodePanel
          panelState={basePanelState}
          nodeId="node-1"
        >
          <div>Content</div>
        </NodePanel>
      );

      const closeButton = screen.getByTestId('panel-close-button');
      expect(closeButton).toBeInTheDocument();
    });    it('calls closePanel when close button clicked', () => {
      render(
        <NodePanel
          panelState={basePanelState}
          nodeId="node-1"
        >
          <div>Content</div>
        </NodePanel>
      );

      const closeButton = screen.getByTestId('panel-close-button');
      fireEvent.click(closeButton);
      
      expect(mockClosePanel).toHaveBeenCalledWith('node-1', 'summary');
    });
  });

  describe('Activity Promotion', () => {    it('promotes node group on panel click', () => {
      render(
        <NodePanel
          panelState={basePanelState}
          nodeId="node-1"
        >
          <div>Content</div>
        </NodePanel>
      );

      const panel = screen.getByTestId('node-panel-node-1-summary');
      fireEvent.click(panel);
      
      expect(mockPromoteNodeGroup).toHaveBeenCalledWith('node-1', 'user-click');
    });

    it('promotes node group on mouse enter', () => {
      render(
        <NodePanel
          panelState={basePanelState}
          nodeId="node-1"
        >
          <div>Content</div>
        </NodePanel>
      );

      const panel = screen.getByTestId('node-panel-node-1-summary');
      fireEvent.mouseEnter(panel);
      
      expect(mockPromoteNodeGroup).toHaveBeenCalledWith('node-1', 'panel-toggle');
    });

    it('promotes node group on focus', () => {
      render(
        <NodePanel
          panelState={basePanelState}
          nodeId="node-1"
        >
          <div>Content</div>
        </NodePanel>
      );

      const panel = screen.getByTestId('node-panel-node-1-summary');
      fireEvent.focus(panel);
      
      expect(mockPromoteNodeGroup).toHaveBeenCalledWith('node-1', 'user-click');
    });
  });

  describe('Panel Types', () => {
    const panelTypes = [
      { type: 'summary' as const, expectedTitle: 'Summary' },
      { type: 'editor' as const, expectedTitle: 'Editor' },
      { type: 'ai-chat' as const, expectedTitle: 'AI Chat' },
      { type: 'share' as const, expectedTitle: 'Share' },
      { type: 'tools' as const, expectedTitle: 'Tools' }
    ];    panelTypes.forEach(({ type, expectedTitle }) => {
      it(`renders correct title for ${type} panel`, () => {
        const panelState = { ...basePanelState, panelType: type };
        
        render(
          <NodePanel
            panelState={panelState}
            nodeId="node-1"
          >
            <div>Content</div>
          </NodePanel>
        );

        expect(screen.getByText(expectedTitle)).toBeInTheDocument();
      });
    });
  });

  describe('Styling and Classes', () => {
    it('applies Windows 11 style classes', () => {
      render(
        <NodePanel
          panelState={basePanelState}
          nodeId="node-1"
        >
          <div>Content</div>
        </NodePanel>
      );      const panel = screen.getByTestId('node-panel-node-1-summary');
      expect(panel).toHaveClass(
        'bg-white/90',
        'backdrop-blur-md',
        'border',
        'border-gray-200/50',
        'rounded-lg',
        'shadow-lg'
      );
    });

    it('applies hover styles', () => {
      render(
        <NodePanel
          panelState={basePanelState}
          nodeId="node-1"
        >
          <div>Content</div>
        </NodePanel>
      );      const panel = screen.getByTestId('node-panel-node-1-summary');
      expect(panel).toHaveClass('hover:shadow-xl');
    });
  });
});
