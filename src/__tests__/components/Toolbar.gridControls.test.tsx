/**
 * Toolbar Grid Controls Tests
 * Tests the grid control buttons in the Toolbar component
 */

import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Toolbar } from '../../components/Toolbar'
import { useUIStore } from '../../stores/uiStore'
import { useNodeStore } from '../../stores/nodeStore'

// Mock stores
vi.mock('../../stores/nodeStore')
vi.mock('../../stores/uiStore')

const mockNodeStore = {
  nodes: [],
  connections: [],
}

const mockUIStore = {
  addNotification: vi.fn(),
  openPanel: vi.fn(),
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

describe('Toolbar Grid Controls', () => {  beforeEach(() => {
    vi.clearAllMocks()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(useNodeStore as any).mockReturnValue(mockNodeStore)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(useUIStore as any).mockReturnValue(mockUIStore)
  })

  it('should render grid control section', () => {
    render(<Toolbar />)
    
    expect(screen.getByText('Grid Options')).toBeInTheDocument()
    expect(screen.getByText('Show Grid')).toBeInTheDocument()
    expect(screen.getByText('Snap to Grid')).toBeInTheDocument()
  })

  it('should show active state for Show Grid button when grid is visible', () => {
    render(<Toolbar />)
    
    const showGridButton = screen.getByText('Show Grid').closest('button')
    expect(showGridButton).toHaveClass('bg-accent-primary')
    expect(screen.getByText('✓')).toBeInTheDocument()
  })
  it('should show inactive state for Show Grid button when grid is hidden', () => {
    const hiddenGridUIStore = {
      ...mockUIStore,
      ui: {
        ...mockUIStore.ui,
        isGridVisible: false,
      },
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(useUIStore as any).mockReturnValue(hiddenGridUIStore)

    render(<Toolbar />)
    
    const showGridButton = screen.getByText('Show Grid').closest('button')
    expect(showGridButton).toHaveClass('bg-surface-secondary')
    expect(screen.getByText('○')).toBeInTheDocument()
  })

  it('should show active state for Snap to Grid button when snap is enabled', () => {
    render(<Toolbar />)
    
    const snapButton = screen.getByText('Snap to Grid').closest('button')
    expect(snapButton).toHaveClass('bg-accent-primary')
    expect(screen.getByText('⚡')).toBeInTheDocument()
  })
  it('should show inactive state for Snap to Grid button when snap is disabled', () => {
    const disabledSnapUIStore = {
      ...mockUIStore,
      ui: {
        ...mockUIStore.ui,
        snapToGrid: false,
      },
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(useUIStore as any).mockReturnValue(disabledSnapUIStore)

    render(<Toolbar />)
    
    const snapButton = screen.getByText('Snap to Grid').closest('button')
    expect(snapButton).toHaveClass('bg-surface-secondary')
    // Should have ○ icon instead of ⚡
    const buttons = screen.getAllByText('○')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('should call toggleGrid when Show Grid button is clicked', () => {
    render(<Toolbar />)
    
    const showGridButton = screen.getByText('Show Grid').closest('button')!
    fireEvent.click(showGridButton)
    
    expect(mockUIStore.toggleGrid).toHaveBeenCalledTimes(1)
  })

  it('should call toggleSnapToGrid when Snap to Grid button is clicked', () => {
    render(<Toolbar />)
    
    const snapButton = screen.getByText('Snap to Grid').closest('button')!
    fireEvent.click(snapButton)
    
    expect(mockUIStore.toggleSnapToGrid).toHaveBeenCalledTimes(1)
  })

  it('should display keyboard shortcuts in tooltips', () => {
    render(<Toolbar />)
    
    const showGridButton = screen.getByText('Show Grid').closest('button')!
    const snapButton = screen.getByText('Snap to Grid').closest('button')!
    
    expect(showGridButton).toHaveAttribute('title', 'Toggle grid visibility (Ctrl+Shift+G)')
    expect(snapButton).toHaveAttribute('title', 'Toggle snap to grid (Ctrl+G)')
  })

  it('should render other toolbar sections alongside grid controls', () => {
    render(<Toolbar />)
    
    // Should still have the node creation section
    expect(screen.getByText('Add Nodes')).toBeInTheDocument()
    expect(screen.getByText('Case')).toBeInTheDocument()
    expect(screen.getByText('Interface')).toBeInTheDocument()
    
    // Should still have canvas actions
    expect(screen.getByText('Export YAML')).toBeInTheDocument()
    expect(screen.getByText('Clear All')).toBeInTheDocument()
  })

  it('should maintain proper section order', () => {
    render(<Toolbar />)
    
    const sections = screen.getAllByRole('button').map(button => button.textContent)
    
    // Grid controls should appear after node buttons but before canvas actions
    const gridControlsIndex = sections.findIndex(text => text?.includes('Show Grid'))
    const exportButtonIndex = sections.findIndex(text => text?.includes('Export YAML'))
    
    expect(gridControlsIndex).toBeLessThan(exportButtonIndex)
    expect(gridControlsIndex).toBeGreaterThan(-1)
  })
})
