/**
 * Snap-to-Grid Integration Test
 * Tests the complete snap-to-grid workflow across components and stores
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { useUIStore } from '../../stores/uiStore'

describe('Snap-to-Grid Integration', () => {
  beforeEach(() => {
    // Reset store to default state
    useUIStore.setState({
      canvas: {
        zoom: 1,
        center: { x: 0, y: 0 },
        bounds: { left: -1000, top: -1000, right: 1000, bottom: 1000 },
      },
      panels: [],
      activePanelId: null,
      maxZIndex: 100,
      ui: {
        selectedTool: 'select',
        isGridVisible: true,
        snapToGrid: true,
        gridSize: 20,
        theme: 'dark',
        sidebarCollapsed: false,
        notifications: [],
      },
    })
  })

  it('should have correct default grid settings', () => {
    const store = useUIStore.getState()
    
    expect(store.ui.snapToGrid).toBe(true)
    expect(store.ui.isGridVisible).toBe(true)
    expect(store.ui.gridSize).toBe(20)
  })

  it('should toggle snap to grid functionality', () => {
    const { toggleSnapToGrid } = useUIStore.getState()
    
    // Initial state should be enabled
    expect(useUIStore.getState().ui.snapToGrid).toBe(true)
    
    // Toggle off
    toggleSnapToGrid()
    expect(useUIStore.getState().ui.snapToGrid).toBe(false)
    
    // Toggle back on
    toggleSnapToGrid()
    expect(useUIStore.getState().ui.snapToGrid).toBe(true)
  })

  it('should toggle grid visibility independently', () => {
    const { toggleGrid } = useUIStore.getState()
    
    // Initial state should be visible
    expect(useUIStore.getState().ui.isGridVisible).toBe(true)
    
    // Toggle off
    toggleGrid()
    expect(useUIStore.getState().ui.isGridVisible).toBe(false)
    
    // Toggle back on
    toggleGrid()
    expect(useUIStore.getState().ui.isGridVisible).toBe(true)
  })

  it('should maintain snap functionality when grid is hidden', () => {
    const { toggleGrid } = useUIStore.getState()
    
    // Hide grid but keep snap enabled
    toggleGrid()
    
    const state = useUIStore.getState()
    expect(state.ui.isGridVisible).toBe(false)
    expect(state.ui.snapToGrid).toBe(true) // Snap should remain independent
  })

  it('should allow custom grid sizes within valid range', () => {
    const { setGridSize } = useUIStore.getState()
    
    // Test valid sizes
    setGridSize(10)
    expect(useUIStore.getState().ui.gridSize).toBe(10)
    
    setGridSize(50)
    expect(useUIStore.getState().ui.gridSize).toBe(50)
    
    setGridSize(100)
    expect(useUIStore.getState().ui.gridSize).toBe(100)
  })

  it('should enforce grid size limits', () => {
    const { setGridSize } = useUIStore.getState()
    
    // Test minimum limit
    setGridSize(5) // Below minimum of 10
    expect(useUIStore.getState().ui.gridSize).toBe(10)
    
    // Test maximum limit
    setGridSize(150) // Above maximum of 100
    expect(useUIStore.getState().ui.gridSize).toBe(100)
  })

  it('should have query methods for grid state', () => {
    const { isGridVisible, getCurrentTool } = useUIStore.getState()
    
    expect(typeof isGridVisible).toBe('function')
    expect(typeof getCurrentTool).toBe('function')
    
    expect(isGridVisible()).toBe(true)
    expect(getCurrentTool()).toBe('select')
  })

  it('should persist state changes correctly', () => {
    const store = useUIStore.getState()
    
    // Make multiple changes
    store.toggleSnapToGrid()
    store.toggleGrid()
    store.setGridSize(40)
    
    // Verify all changes are applied
    const finalState = useUIStore.getState()
    expect(finalState.ui.snapToGrid).toBe(false)
    expect(finalState.ui.isGridVisible).toBe(false)
    expect(finalState.ui.gridSize).toBe(40)
  })

  it('should maintain separate state for each UI feature', () => {
    const store = useUIStore.getState()
    
    // Change snap without affecting other features
    store.toggleSnapToGrid()
    
    const state = useUIStore.getState()
    expect(state.ui.snapToGrid).toBe(false)
    expect(state.ui.isGridVisible).toBe(true) // Should remain unchanged
    expect(state.ui.selectedTool).toBe('select') // Should remain unchanged
    expect(state.ui.theme).toBe('dark') // Should remain unchanged
  })

  it('should handle rapid state changes correctly', () => {
    const store = useUIStore.getState()
    
    // Rapid toggles
    for (let i = 0; i < 10; i++) {
      store.toggleSnapToGrid()
    }
    
    // Should end up back at original state (even number of toggles)
    expect(useUIStore.getState().ui.snapToGrid).toBe(true)
    
    // One more toggle
    store.toggleSnapToGrid()
    expect(useUIStore.getState().ui.snapToGrid).toBe(false)
  })
})
