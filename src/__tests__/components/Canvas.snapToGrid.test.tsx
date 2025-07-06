/**
 * Canvas Snap-to-Grid Functionality Tests
 * Tests the snap-to-grid implementation in the Canvas component
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Canvas } from '../../components/Canvas'
import { useUIStore } from '../../stores/uiStore'
import { useNodeStore } from '../../stores/nodeStore'

// Mock ReactFlow components with proper TypeScript interfaces
interface MockReactFlowProps {
  snapToGrid?: boolean
  snapGrid?: [number, number]
  children?: React.ReactNode
}

interface MockBackgroundProps {
  gap?: number
  style?: React.CSSProperties
}

// Mock ReactFlow to avoid complex rendering
vi.mock('@xyflow/react', () => ({
  ReactFlow: ({ snapToGrid, snapGrid, children }: MockReactFlowProps) => (
    <div 
      data-testid="react-flow"
      data-snap-to-grid={snapToGrid}
      data-snap-grid={snapGrid ? snapGrid.join(',') : ''}
    >
      {children}
    </div>
  ),
  Background: ({ gap, style }: MockBackgroundProps) => (
    <div 
      data-testid="background"
      data-gap={gap}
      style={style}
    />
  ),
  Controls: () => <div data-testid="controls" />,
  MiniMap: () => <div data-testid="minimap" />,
  Handle: () => <div data-testid="handle" />,
  Position: {
    Top: 'top',
    Right: 'right',
    Bottom: 'bottom',
    Left: 'left',
  },
  MarkerType: {
    ArrowClosed: 'arrowclosed',
  },
  ConnectionMode: {
    Loose: 'loose',
  },
  useNodesState: () => [[], vi.fn(), vi.fn()],
  useEdgesState: () => [[], vi.fn(), vi.fn()],
  useReactFlow: () => ({
    getNode: vi.fn(),
    getNodes: vi.fn(() => []),
    getEdges: vi.fn(() => []),
    getViewport: vi.fn(() => ({ x: 0, y: 0, zoom: 1 })),
    setViewport: vi.fn(),
    project: vi.fn((point) => point),
    getZoom: vi.fn(() => 1),
    fitView: vi.fn(),
    setCenter: vi.fn(),
  }),
  BackgroundVariant: {
    Dots: 'dots',
  },
}))

// Mock stores
vi.mock('../../stores/nodeStore')
vi.mock('../../stores/uiStore')

const mockNodeStore = {
  nodes: [],
  connections: [],
  selectedNodeIds: [],
  updateNode: vi.fn(),
  addConnection: vi.fn(),
  updateConnection: vi.fn(),
  deleteConnection: vi.fn(),
  selectNodes: vi.fn(),
  addNode: vi.fn(),
}

const mockUIStore = {
  canvas: {
    zoom: 1,
    center: { x: 0, y: 0 },
    bounds: { left: -1000, top: -1000, right: 1000, bottom: 1000 },
  },
  ui: {
    snapToGrid: true,
    isGridVisible: true,
    gridSize: 20,
    selectedTool: 'select',
    theme: 'dark',
    sidebarCollapsed: false,
    notifications: [],
  },
  toggleSnapToGrid: vi.fn(),
  toggleGrid: vi.fn(),
}

describe('Canvas Snap-to-Grid Functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(useNodeStore as any).mockReturnValue(mockNodeStore)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(useUIStore as any).mockReturnValue(mockUIStore)
    
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(() => 'true'),
        setItem: vi.fn(),
      },
    })
  })

  it('should pass snapToGrid prop to ReactFlow when enabled', () => {
    render(<Canvas />)
    
    const reactFlow = screen.getByTestId('react-flow')
    expect(reactFlow).toHaveAttribute('data-snap-to-grid', 'true')
  })

  it('should pass correct snapGrid dimensions to ReactFlow', () => {
    render(<Canvas />)
    
    const reactFlow = screen.getByTestId('react-flow')
    expect(reactFlow).toHaveAttribute('data-snap-grid', '20,20')
  })
  it('should disable snap when snapToGrid is false', () => {
    const disabledUIStore = {
      ...mockUIStore,
      ui: {
        ...mockUIStore.ui,
        snapToGrid: false,
      },
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(useUIStore as any).mockReturnValue(disabledUIStore)

    render(<Canvas />)
    
    const reactFlow = screen.getByTestId('react-flow')
    expect(reactFlow).toHaveAttribute('data-snap-to-grid', 'false')
  })
  it('should use custom grid size for snap grid', () => {
    const customGridUIStore = {
      ...mockUIStore,
      ui: {
        ...mockUIStore.ui,
        gridSize: 40,
      },
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(useUIStore as any).mockReturnValue(customGridUIStore)

    render(<Canvas />)
    
    const reactFlow = screen.getByTestId('react-flow')
    expect(reactFlow).toHaveAttribute('data-snap-grid', '40,40')
  })

  it('should sync background grid gap with snap grid size', () => {
    const customGridUIStore = {
      ...mockUIStore,
      ui: {
        ...mockUIStore.ui,
        gridSize: 30,
      },
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(useUIStore as any).mockReturnValue(customGridUIStore)

    render(<Canvas />)
    
    const background = screen.getByTestId('background')
    expect(background).toHaveAttribute('data-gap', '30')
  })

  it('should hide background grid when isGridVisible is false', () => {
    const hiddenGridUIStore = {
      ...mockUIStore,
      ui: {
        ...mockUIStore.ui,
        isGridVisible: false,
      },
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(useUIStore as any).mockReturnValue(hiddenGridUIStore)

    render(<Canvas />)
    
    const background = screen.getByTestId('background')
    expect(background).toHaveStyle({ opacity: 0 })
  })

  it('should show background grid when isGridVisible is true', () => {
    render(<Canvas />)
    
    const background = screen.getByTestId('background')
    expect(background).toHaveStyle({ opacity: 1 })
  })

  it('should display snap status indicator when snap is active', () => {
    render(<Canvas />)
    
    expect(screen.getByText('Snap Active')).toBeInTheDocument()
    expect(screen.getByText('(Ctrl+G)')).toBeInTheDocument()
  })
  it('should not display snap status indicator when snap is disabled', () => {
    const disabledUIStore = {
      ...mockUIStore,
      ui: {
        ...mockUIStore.ui,
        snapToGrid: false,
      },
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(useUIStore as any).mockReturnValue(disabledUIStore)

    render(<Canvas />)
    
    expect(screen.queryByText('Snap Active')).not.toBeInTheDocument()
  })

  it('should handle keyboard shortcuts for grid controls', () => {
    render(<Canvas />)
    
    // Test Ctrl+G for snap toggle
    fireEvent.keyDown(document, {
      key: 'g',
      ctrlKey: true,
    })
    expect(mockUIStore.toggleSnapToGrid).toHaveBeenCalledTimes(1)
    
    // Test Ctrl+Shift+G for grid visibility toggle
    fireEvent.keyDown(document, {
      key: 'G',
      ctrlKey: true,
      shiftKey: true,
    })
    expect(mockUIStore.toggleGrid).toHaveBeenCalledTimes(1)
  })

  it('should prevent default behavior for keyboard shortcuts', () => {
    render(<Canvas />)
    
    const event = new KeyboardEvent('keydown', {
      key: 'g',
      ctrlKey: true,
    })
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault')
    
    fireEvent(document, event)
    
    expect(preventDefaultSpy).toHaveBeenCalled()
  })
})
