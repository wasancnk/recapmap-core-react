/**
 * useNodeZIndex.ts - Z-Index Management Hook for Node Layering
 * 
 * This hook manages the visual layering of nodes on the canvas:
 * - Dynamic z-index calculation based on interaction states
 * - Elevation logic for selected, hovered, and elevated nodes
 * - Integration with global z-index hierarchy
 * - Performance optimization for layering updates
 * - Coordination with panel z-index management
 * 
 * Ensures proper visual stacking order for nodes and their associated
 * panels, providing intuitive layering behavior during interactions.
 */
import { useState, useEffect } from 'react';
import { NODE_Z_INDEX, type NodeState } from '../constants';

/**
 * Dynamic z-index calculation function: max(existing_z_indexes) + 1
 */
const calculateDynamicZIndex = (baseZIndex: number, isSelected: boolean): number => {
  if (!isSelected) {
    return baseZIndex;
  }
  
  // For selected nodes, use dynamic calculation: max(existing_z_indexes) + 1
  try {
    // Get all existing z-indexes from node elements in the DOM
    const existingZIndexes: number[] = [];
    
    // Query all node elements and extract their z-index values
    const nodeElements = document.querySelectorAll('[data-node-type]');
    nodeElements.forEach((element) => {
      const style = window.getComputedStyle(element);
      const zIndex = parseInt(style.zIndex, 10);
      if (!isNaN(zIndex) && zIndex > 0) {
        existingZIndexes.push(zIndex);
      }
    });
    
    // Add base z-index values to ensure we have minimums
    existingZIndexes.push(
      NODE_Z_INDEX.INACTIVE,
      NODE_Z_INDEX.HOVER, 
      NODE_Z_INDEX.SELECTED,
      NODE_Z_INDEX.ELEVATED
    );
    
    // Calculate max + 1
    const maxZIndex = Math.max(...existingZIndexes);
    const dynamicZIndex = maxZIndex + 1;
    
    console.log(`🎯 Dynamic z-index calculation for selected node: ${dynamicZIndex} (max: ${maxZIndex})`);
    return dynamicZIndex;
  } catch (error) {
    console.warn('Failed to calculate dynamic z-index, falling back to base value:', error);
    return baseZIndex;
  }
};

/**
 * Hook for managing node z-index based on interaction state
 */
export const useNodeZIndex = (
  id: string,
  selected: boolean,
  isHovered: boolean,
  isFocused: boolean,
  hasOpenPanels: boolean
) => {
  const [nodeZIndex, setNodeZIndex] = useState<number>(NODE_Z_INDEX.INACTIVE);
  const [nodeState, setNodeState] = useState<NodeState>('inactive');

  useEffect(() => {
    if (hasOpenPanels) {
      // For elevated state, use dynamic calculation
      const dynamicZIndex = calculateDynamicZIndex(NODE_Z_INDEX.ELEVATED, true);
      setNodeZIndex(dynamicZIndex);
      setNodeState('elevated');
    } else if (selected) {
      // For selected state, use dynamic calculation: max(existing_z_indexes) + 1
      const dynamicZIndex = calculateDynamicZIndex(NODE_Z_INDEX.SELECTED, true);
      setNodeZIndex(dynamicZIndex);
      setNodeState('selected');
    } else if (isHovered || isFocused) {
      setNodeZIndex(NODE_Z_INDEX.HOVER);
      setNodeState('hover');
    } else {
      setNodeZIndex(NODE_Z_INDEX.INACTIVE);
      setNodeState('inactive');
    }
  }, [selected, isHovered, isFocused, hasOpenPanels, id]);

  return { nodeZIndex, nodeState };
};
