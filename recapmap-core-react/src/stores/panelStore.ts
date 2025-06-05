import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Types based on our architecture
export type PanelType = 'summary' | 'editor' | 'ai-chat' | 'share' | 'tools';

export interface PanelState {
  nodeId: string;
  panelType: PanelType;
  position: { x: number; y: number };
  zIndex: number;
  isVisible: boolean;
  stackOrder: number;
  openedAt: number; // Timestamp for ordering
}

export interface NodeGroup {
  nodeId: string;
  zIndex: number;
  isActive: boolean;
  lastActivity: number;
}

interface PanelStoreState {
  // Panel data
  panels: Map<string, PanelState>; // Key: `${nodeId}-${panelType}`
  nodeGroups: Map<string, NodeGroup>; // Key: nodeId
  activeNodeGroup: string | null;
  
  // Constants
  readonly PANEL_WIDTH: number;
  readonly PANEL_HEIGHT: number;
  readonly PANEL_SPACING: number;
  readonly BASE_INACTIVE_Z_INDEX: number;
  readonly BASE_ACTIVE_Z_INDEX: number;
    // Actions
  openPanel: (nodeId: string, panelType: PanelType) => void;
  closePanel: (nodeId: string, panelType: PanelType) => void;
  isPanelOpen: (nodeId: string, panelType: PanelType) => boolean;
  promoteNodeGroup: (nodeId: string) => void;
  getNodePanels: (nodeId: string) => PanelState[];
  getActiveNodeGroup: () => string | null;
  getNodeZIndex: (nodeId: string) => number;
  calculatePanelPosition: (nodeId: string, panelType: PanelType, nodePosition: { x: number; y: number }) => { x: number; y: number };
  removeNodePanels: (nodeId: string) => void;
  reset: () => void;
}

const createPanelKey = (nodeId: string, panelType: PanelType): string => 
  `${nodeId}-${panelType}`;

export const usePanelStore = create<PanelStoreState>()(
  devtools(
    (set, get) => ({
      // Initial state
      panels: new Map(),
      nodeGroups: new Map(),
      activeNodeGroup: null,
      
      // Constants from our architecture
      PANEL_WIDTH: 320,
      PANEL_HEIGHT: 400,
      PANEL_SPACING: 20,
      BASE_INACTIVE_Z_INDEX: 1000,
      BASE_ACTIVE_Z_INDEX: 3000,
      
      openPanel: (nodeId: string, panelType: PanelType) => {
        const key = createPanelKey(nodeId, panelType);
        const state = get();
        
        // Don't duplicate existing panels
        if (state.panels.has(key)) {
          return;
        }
        
        // Get existing panels for this node to determine stack order
        const existingPanels = state.getNodePanels(nodeId);
        const stackOrder = existingPanels.length;
        
        // Create new panel
        const newPanel: PanelState = {
          nodeId,
          panelType,
          position: { x: 0, y: 0 }, // Will be calculated dynamically
          zIndex: state.BASE_INACTIVE_Z_INDEX + stackOrder + 1,
          isVisible: true,
          stackOrder,
          openedAt: Date.now()
        };
        
        set((state) => {
          const newPanels = new Map(state.panels);
          newPanels.set(key, newPanel);
          
          // Ensure node group exists
          const newNodeGroups = new Map(state.nodeGroups);
          if (!newNodeGroups.has(nodeId)) {
            newNodeGroups.set(nodeId, {
              nodeId,
              zIndex: state.BASE_INACTIVE_Z_INDEX,
              isActive: false,
              lastActivity: Date.now()
            });
          }
          
          return {
            panels: newPanels,
            nodeGroups: newNodeGroups
          };
        });
          // Auto-promote the node group when opening a panel
        get().promoteNodeGroup(nodeId);
      },
      
      closePanel: (nodeId: string, panelType: PanelType) => {
        const key = createPanelKey(nodeId, panelType);
        
        set((state) => {
          const newPanels = new Map(state.panels);
          newPanels.delete(key);
          
          // Check if this was the last panel for the node
          const remainingPanels = Array.from(newPanels.values())
            .filter(panel => panel.nodeId === nodeId);
            let newActiveNodeGroup = state.activeNodeGroup;
          const newNodeGroups = new Map(state.nodeGroups);
          
          // If no panels remain for this node and it was active, clear active state
          if (remainingPanels.length === 0 && state.activeNodeGroup === nodeId) {
            newActiveNodeGroup = null;
            newNodeGroups.delete(nodeId);
          }
          
          return {
            panels: newPanels,
            nodeGroups: newNodeGroups,
            activeNodeGroup: newActiveNodeGroup
          };
        });
      },
        promoteNodeGroup: (nodeId: string) => {
        set((state) => {
          const newNodeGroups = new Map(state.nodeGroups);
          const newPanels = new Map(state.panels);
          
          // Demote previous active group
          if (state.activeNodeGroup && state.activeNodeGroup !== nodeId) {
            const prevActiveGroup = newNodeGroups.get(state.activeNodeGroup);
            if (prevActiveGroup) {
              prevActiveGroup.isActive = false;
              prevActiveGroup.zIndex = state.BASE_INACTIVE_Z_INDEX;
              
              // Update z-index for all panels of previous active group
              Array.from(newPanels.values())
                .filter(panel => panel.nodeId === state.activeNodeGroup)
                .forEach((panel, index) => {
                  panel.zIndex = state.BASE_INACTIVE_Z_INDEX + index + 1;
                });
            }
          }
          
          // Promote new active group
          let nodeGroup = newNodeGroups.get(nodeId);
          if (!nodeGroup) {
            nodeGroup = {
              nodeId,
              zIndex: state.BASE_ACTIVE_Z_INDEX,
              isActive: true,
              lastActivity: Date.now()
            };
          } else {
            nodeGroup.isActive = true;
            nodeGroup.zIndex = state.BASE_ACTIVE_Z_INDEX;
            nodeGroup.lastActivity = Date.now();
          }
          newNodeGroups.set(nodeId, nodeGroup);
          
          // Update z-index for all panels of new active group
          Array.from(newPanels.values())
            .filter(panel => panel.nodeId === nodeId)
            .forEach((panel, index) => {
              panel.zIndex = state.BASE_ACTIVE_Z_INDEX + index + 1;
            });
          
          return {
            panels: newPanels,
            nodeGroups: newNodeGroups,
            activeNodeGroup: nodeId
          };
        });
      },
      
      getNodePanels: (nodeId: string) => {
        const state = get();
        return Array.from(state.panels.values())
          .filter(panel => panel.nodeId === nodeId)
          .sort((a, b) => a.stackOrder - b.stackOrder);
      },
      
      getActiveNodeGroup: () => {
        return get().activeNodeGroup;
      },
        getNodeZIndex: (nodeId: string) => {
        const state = get();
        const nodeGroup = state.nodeGroups.get(nodeId);
        return nodeGroup?.zIndex ?? state.BASE_INACTIVE_Z_INDEX;
      },
      
      isPanelOpen: (nodeId: string, panelType: PanelType) => {
        const key = createPanelKey(nodeId, panelType);
        return get().panels.has(key);
      },calculatePanelPosition: (nodeId: string, panelType: PanelType, nodePosition: { x: number; y: number }) => {
        const state = get();
        const nodePanels = state.getNodePanels(nodeId);
        const panelIndex = nodePanels.findIndex(panel => panel.panelType === panelType);        if (panelIndex === -1) {
          // Panel not found, return default position
          return {
            x: nodePosition.x + 190, // Matched with WrappedCustomNode spacing
            y: nodePosition.y
          };
        }
          // Calculate horizontal offset for side-by-side panel layout
        const horizontalOffset = 190 + (panelIndex * (state.PANEL_WIDTH + 10)); // Matched with WrappedCustomNode spacing
        
        return {
          x: nodePosition.x + horizontalOffset,
          y: nodePosition.y // Keep panels aligned with node top
        };
      },
      
      removeNodePanels: (nodeId: string) => {
        set((state) => {
          const newPanels = new Map(state.panels);
          const newNodeGroups = new Map(state.nodeGroups);
          
          // Remove all panels for this node
          Array.from(newPanels.keys())
            .filter(key => key.startsWith(`${nodeId}-`))
            .forEach(key => newPanels.delete(key));
          
          // Remove node group
          newNodeGroups.delete(nodeId);
          
          // Clear active node group if it was this node
          const newActiveNodeGroup = state.activeNodeGroup === nodeId ? null : state.activeNodeGroup;
          
          return {
            panels: newPanels,
            nodeGroups: newNodeGroups,
            activeNodeGroup: newActiveNodeGroup
          };
        });
      },
      
      reset: () => {
        set({
          panels: new Map(),
          nodeGroups: new Map(),
          activeNodeGroup: null
        });
      }
    }),
    {
      name: 'panel-store'
    }
  )
);
