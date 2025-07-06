/**
 * useNodeInteraction.ts - Node Interaction State Management Hook
 * 
 * This hook manages user interaction states for individual nodes:
 * - Hover state tracking and visual feedback
 * - Focus management for keyboard navigation
 * - Connection state during drag operations
 * - Selection state coordination with global selection
 * - Interactive feedback for user actions
 * 
 * Provides consistent interaction patterns across all node types
 * and ensures proper state management for visual feedback systems.
 */
import { useState, useCallback } from 'react';

/**
 * Hook for managing node interaction states (hover, focus, connection)
 */
export const useNodeInteraction = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [connectingFromHandle, setConnectingFromHandle] = useState<string | null>(null);

  // Mouse event handlers
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setConnectingFromHandle(null);
  }, []);

  // Focus handlers for keyboard navigation
  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  // Show connectors when hovering or when connecting
  const showConnectors = isHovered || Boolean(connectingFromHandle);

  return {
    isFocused,
    isHovered,
    connectingFromHandle,
    showConnectors,
    handlers: {
      handleMouseEnter,
      handleMouseLeave,
      handleFocus,
      handleBlur,
    },
  };
};
