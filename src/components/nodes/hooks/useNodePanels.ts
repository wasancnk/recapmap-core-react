/**
 * useNodePanels.ts - Node Panel Operations Hook
 * 
 * This hook provides panel management functionality for individual nodes:
 * - Panel open/close operations for specific nodes
 * - Panel state queries and status checking
 * - Integration with global panel store
 * - Panel type routing and validation
 * - Coordination between node interactions and panel visibility
 * 
 * Serves as the bridge between node components and the panel management
 * system, enabling contextual panel operations tied to specific nodes.
 */
import { useState, useCallback } from 'react';
import { usePanelStore, type PanelType } from '../../../stores/panelStore';

/**
 * Hook for managing node panel operations
 */
export const useNodePanels = (id: string) => {
  const panelStore = usePanelStore();
  const [isToggling, setIsToggling] = useState(false);

  // Toggle functions for panels
  const toggleSummaryPanel = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (isToggling) {
      console.log(`[${id}] Summary panel toggle ignored - already toggling`);
      return;
    }
    
    setIsToggling(true);
    
    const isCurrentlyOpen = panelStore.isPanelOpen(id, 'summary');
    console.log(`[${id}] Summary panel toggle - currently open: ${isCurrentlyOpen}`);
    
    if (isCurrentlyOpen) {
      panelStore.closePanel(id, 'summary');
    } else {
      panelStore.openPanel(id, 'summary');
    }
    
    // Reset toggle state after a short delay
    setTimeout(() => setIsToggling(false), 100);
  }, [id, panelStore, isToggling]);

  const toggleEditorPanel = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (isToggling) {
      console.log(`[${id}] Editor panel toggle ignored - already toggling`);
      return;
    }
    
    setIsToggling(true);
    
    const isCurrentlyOpen = panelStore.isPanelOpen(id, 'editor');
    console.log(`[${id}] Editor panel toggle - currently open: ${isCurrentlyOpen}`);
    
    if (isCurrentlyOpen) {
      panelStore.closePanel(id, 'editor');
    } else {
      panelStore.openPanel(id, 'editor');
    }
    
    // Reset toggle state after a short delay
    setTimeout(() => setIsToggling(false), 100);
  }, [id, panelStore, isToggling]);

  return {
    isToggling,
    toggleSummaryPanel,
    toggleEditorPanel,
    panels: panelStore.getNodePanels(id),
    PANEL_WIDTH: panelStore.PANEL_WIDTH,
    isPanelOpen: (panelType: PanelType) => panelStore.isPanelOpen(id, panelType),
  };
};
