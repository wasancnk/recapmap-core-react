import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import React from 'react';
import Canvas from '../../components/Canvas';

// Mock React Flow to avoid complex setup
vi.mock('@xyflow/react', () => ({
  ReactFlow: ({ children, ...props }: any) => (
    <div data-testid="react-flow-canvas" {...props}>
      {children}
      <div data-testid="canvas-area">Canvas Area</div>
    </div>
  ),
  Background: () => <div data-testid="background" />,
  Controls: () => <div data-testid="controls" />,
  MiniMap: () => <div data-testid="minimap" />,
  MarkerType: { ArrowClosed: 'arrowclosed' },
  ConnectionMode: { Loose: 'loose' },
  useNodesState: () => [[], vi.fn(), vi.fn()],
  useEdgesState: () => [[], vi.fn(), vi.fn()],
  BackgroundVariant: { Dots: 'dots' },
}));

// Mock stores
vi.mock('../../stores/nodeStore', () => ({
  useNodeStore: vi.fn(() => ({
    nodes: [],
    connections: [],
    selectedNodeIds: [],
    addNode: vi.fn(),
    updateNode: vi.fn(),
    deleteNode: vi.fn(),
    selectNode: vi.fn(),
    clearSelection: vi.fn(),
    addConnection: vi.fn(),
  })),
}));

vi.mock('../../stores/uiStore', () => ({
  useUIStore: vi.fn(() => ({
    snapToGrid: false,
    showGrid: true,
    toggleSnapToGrid: vi.fn(),
    toggleGrid: vi.fn(),
  })),
}));

// Mock the smart scroll hook
const mockUseSmartScroll = vi.fn();
vi.mock('../../hooks/useSmartScroll', () => ({
  useSmartScroll: mockUseSmartScroll,
}));

describe('Smart Scroll Integration with Canvas', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSmartScroll.mockReturnValue(undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize smart scroll hook in Canvas component', () => {
    render(<Canvas />);

    expect(mockUseSmartScroll).toHaveBeenCalledWith({
      panelSelectors: '.panel-base, [data-testid*="panel"], .scrollbar-dark, .scrollbar-stable, .overflow-y-auto',
      debug: false, // Should be false in test environment
    });
  });

  it('should render SmartScrollDemo component', async () => {
    render(<Canvas />);

    // Check if the demo toggle button is present
    const toggleButton = screen.getByText(/Smart Scroll Demo/i);
    expect(toggleButton).toBeInTheDocument();
  });

  it('should show/hide demo panels when toggle button is clicked', async () => {
    render(<Canvas />);

    const toggleButton = screen.getByText(/Show Smart Scroll Demo/i);
    
    // Initially demo should be hidden
    expect(screen.queryByText('Test Panel 1')).not.toBeInTheDocument();
    
    // Click to show demo
    fireEvent.click(toggleButton);
    
    await waitFor(() => {
      expect(screen.getByText('Test Panel 1')).toBeInTheDocument();
      expect(screen.getByText('Test Panel 2')).toBeInTheDocument();
      expect(screen.getByText('Test Panel 3 - Nested')).toBeInTheDocument();
    });
    
    // Button text should change
    expect(screen.getByText(/Hide Smart Scroll Demo/i)).toBeInTheDocument();
  });

  it('should render demo panels with correct CSS classes', async () => {
    render(<Canvas />);

    const toggleButton = screen.getByText(/Show Smart Scroll Demo/i);
    fireEvent.click(toggleButton);

    await waitFor(() => {
      // Check for panel-base class
      const panel1 = screen.getByText('Test Panel 1').closest('.panel-base');
      expect(panel1).toBeInTheDocument();
      expect(panel1).toHaveClass('scrollbar-dark');

      // Check for data-testid attribute
      const panel2 = screen.getByTestId('demo-panel-2');
      expect(panel2).toBeInTheDocument();
      expect(panel2).toHaveClass('scrollbar-stable');

      // Check for nested panel structure
      const panel3 = screen.getByText('Test Panel 3 - Nested').closest('.panel-base');
      expect(panel3).toBeInTheDocument();
    });
  });

  it('should render instruction panel with proper selectors documentation', async () => {
    render(<Canvas />);

    const toggleButton = screen.getByText(/Show Smart Scroll Demo/i);
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(screen.getByText('Smart Scroll Demo Instructions')).toBeInTheDocument();
      expect(screen.getByText('Detected Panel Selectors:')).toBeInTheDocument();
      
      // Check for documented selectors
      expect(screen.getByText('.panel-base')).toBeInTheDocument();
      expect(screen.getByText('[data-testid*="panel"]')).toBeInTheDocument();
      expect(screen.getByText('.scrollbar-dark')).toBeInTheDocument();
      expect(screen.getByText('.scrollbar-stable')).toBeInTheDocument();
      expect(screen.getByText('.overflow-y-auto')).toBeInTheDocument();
    });
  });

  it('should simulate wheel events on demo panels', async () => {
    render(<Canvas />);

    const toggleButton = screen.getByText(/Show Smart Scroll Demo/i);
    fireEvent.click(toggleButton);

    await waitFor(() => {
      const panel1 = screen.getByText('Test Panel 1').closest('.panel-base');
      expect(panel1).toBeInTheDocument();

      // Simulate wheel event on panel
      fireEvent.wheel(panel1!, { deltaY: 100 });
      
      // The wheel event should be handled by the smart scroll logic
      // (actual scroll behavior is mocked, but we verify the element structure)
      expect(panel1).toHaveClass('overflow-y-auto');
    });
  });

  it('should handle mouse events over canvas area vs panel area', async () => {
    render(<Canvas />);

    const canvasArea = screen.getByTestId('react-flow-canvas');
    expect(canvasArea).toBeInTheDocument();

    // Simulate mouse move over canvas
    fireEvent.mouseMove(canvasArea, { clientX: 100, clientY: 100 });

    // Smart scroll hook should have been initialized
    expect(mockUseSmartScroll).toHaveBeenCalled();
  });

  it('should maintain React Flow functionality while smart scroll is active', async () => {
    render(<Canvas />);

    // Verify React Flow components are rendered
    expect(screen.getByTestId('react-flow-canvas')).toBeInTheDocument();
    expect(screen.getByTestId('background')).toBeInTheDocument();
    expect(screen.getByTestId('controls')).toBeInTheDocument();
    expect(screen.getByTestId('minimap')).toBeInTheDocument();

    // Smart scroll should not interfere with React Flow rendering
    expect(mockUseSmartScroll).toHaveBeenCalledTimes(1);
  });

  it('should pass correct configuration to smart scroll hook', () => {
    render(<Canvas />);

    expect(mockUseSmartScroll).toHaveBeenCalledWith({
      panelSelectors: '.panel-base, [data-testid*="panel"], .scrollbar-dark, .scrollbar-stable, .overflow-y-auto',
      debug: false,
    });
  });

  it('should handle nested scrollable content in demo panels', async () => {
    render(<Canvas />);

    const toggleButton = screen.getByText(/Show Smart Scroll Demo/i);
    fireEvent.click(toggleButton);

    await waitFor(() => {
      const nestedScrollableArea = screen.getByText('Nested Scrollable Area');
      const nestedContainer = nestedScrollableArea.closest('.overflow-y-auto');
      
      expect(nestedContainer).toBeInTheDocument();
      expect(nestedContainer).toHaveClass('scrollbar-thin');
    });
  });

  it('should provide comprehensive demo content for testing', async () => {
    render(<Canvas />);

    const toggleButton = screen.getByText(/Show Smart Scroll Demo/i);
    fireEvent.click(toggleButton);

    await waitFor(() => {
      // Verify demo has multiple test scenarios
      expect(screen.getByText(/panel-base.*class/i)).toBeInTheDocument();
      expect(screen.getByText(/data-testid.*panel/i)).toBeInTheDocument();
      expect(screen.getByText('Nested Scrollable Area')).toBeInTheDocument();
      
      // Verify instructions are comprehensive
      expect(screen.getByText('How to Test:')).toBeInTheDocument();
      expect(screen.getByText("What's Happening:")).toBeInTheDocument();
      expect(screen.getByText('Detected Panel Selectors:')).toBeInTheDocument();
    });
  });
});
