import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import type { Panel, PanelType, CanvasState, UIState, Tool, Notification } from '../types'

// UI Store - Manages panels, canvas state, and UI interactions
interface UIStore {
  // Canvas State
  canvas: CanvasState
  
  // Panel Management
  panels: Panel[]
  activePanelId: string | null
  maxZIndex: number
  
  // UI State
  ui: UIState
  
  // Canvas Actions
  setZoom: (zoom: number) => void
  setCenter: (center: { x: number; y: number }) => void
  setBounds: (bounds: { left: number; top: number; right: number; bottom: number }) => void
  resetCanvas: () => void
  fitToContent: () => void
    // Panel Actions
  openPanel: (type: PanelType, data?: Record<string, string | number | boolean>, position?: { x: number; y: number }) => string
  closePanel: (id: string) => void
  togglePanel: (type: PanelType, data?: Record<string, string | number | boolean>) => void
  movePanel: (id: string, position: { x: number; y: number }) => void
  resizePanel: (id: string, size: { width: number; height: number }) => void
  minimizePanel: (id: string) => void
  maximizePanel: (id: string) => void
  bringPanelToFront: (id: string) => void
  closeAllPanels: () => void
  // UI Actions
  setTool: (tool: Tool) => void
  toggleGrid: () => void
  setGridSize: (size: number) => void
  toggleSnapToGrid: () => void
  toggleMiniMap: () => void
  setTheme: (theme: 'dark' | 'light' | 'bright') => void
  toggleSidebar: () => void
  
  // Presentation Mode Actions
  togglePresentationMode: () => void
  setPresentationMode: (enabled: boolean) => void
  updatePresentationSettings: (settings: Partial<UIState['presentationSettings']>) => void
  
  // Notification Actions
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => string
  removeNotification: (id: string) => void
  clearNotifications: () => void
  
  // Query methods
  getPanel: (id: string) => Panel | undefined
  getPanelByType: (type: PanelType) => Panel | undefined
  getOpenPanels: () => Panel[]
  isGridVisible: () => boolean
  getCurrentTool: () => Tool
}

// Default canvas state
const defaultCanvasState: CanvasState = {
  zoom: 1,
  center: { x: 0, y: 0 },
  bounds: { left: -1000, top: -1000, right: 1000, bottom: 1000 },
}

// Default UI state
const defaultUIState: UIState = {
  selectedTool: 'select',
  isGridVisible: true,
  isMiniMapVisible: true,
  snapToGrid: true,
  gridSize: 20,
  theme: 'dark',
  sidebarCollapsed: false,
  notifications: [],
  isPresentationMode: false,
  presentationSettings: {
    currentSlide: 1,
    totalSlides: 1,
    showPageNumbers: true,
    showTimestamp: false,
    autoAdvance: false,
    autoAdvanceInterval: 30,
    hideToolbar: true,
    hidePanels: true,
    presentationTheme: 'bright',
    backgroundColor: undefined,
    backgroundImage: undefined
  }
}

// Create the UI store
export const useUIStore = create<UIStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        canvas: defaultCanvasState,
        panels: [],
        activePanelId: null,
        maxZIndex: 100,
        ui: defaultUIState,

      // Canvas Actions
      setZoom: (zoom: number) => {
        set((state) => ({
          canvas: { ...state.canvas, zoom: Math.max(0.1, Math.min(3, zoom)) },
        }), false, 'setZoom')
      },

      setCenter: (center: { x: number; y: number }) => {
        set((state) => ({
          canvas: { ...state.canvas, center },
        }), false, 'setCenter')
      },

      setBounds: (bounds: { left: number; top: number; right: number; bottom: number }) => {
        set((state) => ({
          canvas: { ...state.canvas, bounds },
        }), false, 'setBounds')
      },      resetCanvas: () => {
        set(() => ({
          canvas: defaultCanvasState,
        }), false, 'resetCanvas')
      },

      fitToContent: () => {
        // This would be implemented to fit canvas to all nodes
        // For now, just reset to default
        get().resetCanvas()
      },      // Panel Actions
      openPanel: (type: PanelType, data?: Record<string, string | number | boolean>, position?: { x: number; y: number }) => {
        const id = uuidv4()
        const { maxZIndex } = get()
        
        // Close existing panel of same type (single instance panels)
        const singleInstancePanels: PanelType[] = ['node-properties', 'toolbox', 'minimap', 'settings']
        if (singleInstancePanels.includes(type)) {
          const existingPanel = get().getPanelByType(type)
          if (existingPanel) {
            get().closePanel(existingPanel.id)
          }
        }

        const defaultPosition = position || {
          x: 100 + (get().panels.length * 20),
          y: 100 + (get().panels.length * 20),
        }

        const newPanel: Panel = {
          id,
          type,
          title: getPanelTitle(type),
          position: defaultPosition,
          size: getPanelDefaultSize(type),
          isOpen: true,
          isMinimized: false,
          zIndex: maxZIndex + 1,
          data,
        }
        
        set((state) => ({
          panels: [...state.panels, newPanel],
          activePanelId: id,
          maxZIndex: maxZIndex + 1,
        }), false, 'openPanel')
        
        return id
      },

      closePanel: (id: string) => {
        set((state) => ({
          panels: state.panels.filter((panel) => panel.id !== id),
          activePanelId: state.activePanelId === id ? null : state.activePanelId,
        }), false, 'closePanel')
      },

      togglePanel: (type: PanelType, data?: Record<string, string | number | boolean>) => {
        const existingPanel = get().getPanelByType(type)
        if (existingPanel) {
          get().closePanel(existingPanel.id)
        } else {
          get().openPanel(type, data)
        }
      },

      movePanel: (id: string, position: { x: number; y: number }) => {
        set((state) => ({
          panels: state.panels.map((panel) =>
            panel.id === id ? { ...panel, position } : panel
          ),
        }), false, 'movePanel')
      },

      resizePanel: (id: string, size: { width: number; height: number }) => {
        set((state) => ({
          panels: state.panels.map((panel) =>
            panel.id === id ? { ...panel, size } : panel
          ),
        }), false, 'resizePanel')
      },

      minimizePanel: (id: string) => {
        set((state) => ({
          panels: state.panels.map((panel) =>
            panel.id === id ? { ...panel, isMinimized: !panel.isMinimized } : panel
          ),
        }), false, 'minimizePanel')
      },

      maximizePanel: (id: string) => {
        const panel = get().getPanel(id)
        if (!panel) return

        const newSize = panel.size.width === window.innerWidth - 40
          ? getPanelDefaultSize(panel.type)
          : { width: window.innerWidth - 40, height: window.innerHeight - 40 }

        get().resizePanel(id, newSize)
        get().movePanel(id, { x: 20, y: 20 })
      },

      bringPanelToFront: (id: string) => {
        const { maxZIndex } = get()
        set((state) => ({
          panels: state.panels.map((panel) =>
            panel.id === id ? { ...panel, zIndex: maxZIndex + 1 } : panel
          ),
          activePanelId: id,
          maxZIndex: maxZIndex + 1,
        }), false, 'bringPanelToFront')
      },

      closeAllPanels: () => {
        set(() => ({
          panels: [],
          activePanelId: null,
        }), false, 'closeAllPanels')
      },

      // UI Actions
      setTool: (tool: Tool) => {
        set((state) => ({
          ui: { ...state.ui, selectedTool: tool },
        }), false, 'setTool')
      },

      toggleGrid: () => {
        set((state) => ({
          ui: { ...state.ui, isGridVisible: !state.ui.isGridVisible },
        }), false, 'toggleGrid')
      },

      setGridSize: (size: number) => {
        set((state) => ({
          ui: { ...state.ui, gridSize: Math.max(10, Math.min(100, size)) },
        }), false, 'setGridSize')
      },      toggleSnapToGrid: () => {
        set((state) => ({
          ui: { ...state.ui, snapToGrid: !state.ui.snapToGrid },
        }), false, 'toggleSnapToGrid')
      },

      toggleMiniMap: () => {
        set((state) => ({
          ui: { ...state.ui, isMiniMapVisible: !state.ui.isMiniMapVisible },
        }), false, 'toggleMiniMap')
      },      setTheme: (theme: 'dark' | 'light' | 'bright') => {
        set((state) => ({
          ui: { ...state.ui, theme },
        }), false, 'setTheme')
        
        // Apply theme to document
        document.documentElement.classList.toggle('dark', theme === 'dark')
        document.documentElement.classList.toggle('bright', theme === 'bright')
      },

      toggleSidebar: () => {
        set((state) => ({
          ui: { ...state.ui, sidebarCollapsed: !state.ui.sidebarCollapsed },
        }), false, 'toggleSidebar')
      },

      // Presentation Mode Actions
      togglePresentationMode: () => {
        set((state) => ({
          ui: { ...state.ui, isPresentationMode: !state.ui.isPresentationMode },
        }), false, 'togglePresentationMode')
      },

      setPresentationMode: (enabled: boolean) => {
        set((state) => ({
          ui: { ...state.ui, isPresentationMode: enabled },
        }), false, 'setPresentationMode')
      },

      updatePresentationSettings: (settings: Partial<UIState['presentationSettings']>) => {
        set((state) => ({
          ui: { 
            ...state.ui, 
            presentationSettings: { ...state.ui.presentationSettings, ...settings }
          },
        }), false, 'updatePresentationSettings')
      },

      // Notification Actions
      addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => {
        const id = uuidv4()
        const timestamp = new Date().toISOString()
        
        const newNotification: Notification = {
          ...notification,
          id,
          timestamp,
        }
          set((state) => ({
          ui: {
            ...state.ui,
            notifications: [...(state.ui.notifications || []), newNotification],
          },
        }), false, 'addNotification')
        
        // Auto-remove notification after duration
        if (notification.duration) {
          setTimeout(() => {
            get().removeNotification(id)
          }, notification.duration)
        }
        
        return id
      },      removeNotification: (id: string) => {
        set((state) => ({
          ui: {
            ...state.ui,
            notifications: (state.ui.notifications || []).filter((notif) => notif.id !== id),
          },
        }), false, 'removeNotification')
      },

      clearNotifications: () => {
        set((state) => ({
          ui: { ...state.ui, notifications: [] },
        }), false, 'clearNotifications')
      },

      // Query methods
      getPanel: (id: string) => {
        return get().panels.find((panel) => panel.id === id)
      },

      getPanelByType: (type: PanelType) => {
        return get().panels.find((panel) => panel.type === type)
      },

      getOpenPanels: () => {
        return get().panels.filter((panel) => panel.isOpen)
      },      isGridVisible: () => {
        return get().ui.isGridVisible
      },

      getCurrentTool: () => {
        return get().ui.selectedTool
      },
    }),      {
        name: 'recapmap-ui-store',
        partialize: (state) => ({
          canvas: state.canvas,
          ui: {
            selectedTool: state.ui.selectedTool,
            isGridVisible: state.ui.isGridVisible,
            isMiniMapVisible: state.ui.isMiniMapVisible,
            snapToGrid: state.ui.snapToGrid,
            gridSize: state.ui.gridSize,
            theme: state.ui.theme,
            sidebarCollapsed: state.ui.sidebarCollapsed,
            isPresentationMode: state.ui.isPresentationMode,
            presentationSettings: state.ui.presentationSettings,
            // Always include empty notifications array in persisted state
            notifications: [],
          }
        }),
      }
    ),
    {
      name: 'recapmap-ui-store',
    }
  )
)

// Helper functions
function getPanelTitle(type: PanelType): string {
  const titles: Record<PanelType, string> = {
    'node-properties': 'Node Properties',
    'connection-manager': 'Connection Manager',
    'toolbox': 'Toolbox',
    'minimap': 'Minimap',
    'export': 'Export',
    'ai-assistant': 'AI Assistant',
    'validation': 'Validation',
    'settings': 'Settings',
    'presentation': 'Presentation',
  }
  return titles[type]
}

function getPanelDefaultSize(type: PanelType): { width: number; height: number } {
  const sizes: Record<PanelType, { width: number; height: number }> = {
    'node-properties': { width: 320, height: 400 },
    'connection-manager': { width: 400, height: 300 },
    'toolbox': { width: 280, height: 500 },
    'minimap': { width: 200, height: 150 },
    'export': { width: 350, height: 250 },
    'ai-assistant': { width: 400, height: 500 },
    'validation': { width: 450, height: 300 },
    'settings': { width: 500, height: 400 },
    'presentation': { width: 400, height: 600 },
  }
  return sizes[type]
}
