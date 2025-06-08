import { useEffect, useCallback, useRef } from 'react';

interface SmartScrollOptions {
  /**
   * Whether smart scroll redirection is enabled
   */
  enabled?: boolean;
  
  /**
   * CSS selector or classname to identify panel elements
   */
  panelSelector?: string;
  
  /**
   * Debounce time for mouse position updates (ms)
   */
  debounceMs?: number;
  
  /**
   * Buffer time to wait after scroll edge before allowing canvas operations (ms)
   */
  edgeBufferMs?: number;
  
  /**
   * Debug logging for development
   */
  debug?: boolean;
}

interface ScrollTarget {
  element: HTMLElement;
  type: 'panel' | 'canvas';
}

const ScrollState = {
  PANEL_SCROLLING: 'panel_scrolling',       // Normal panel scrolling
  EDGE_ABSORPTION: 'edge_absorption',       // At edge, absorbing scroll events
  CANVAS_READY: 'canvas_ready'              // Ready for canvas operations
} as const;

type ScrollState = typeof ScrollState[keyof typeof ScrollState];

interface EdgeScrollState {
  isAtEdge: boolean;
  scrollDirection: 'up' | 'down' | null;
  lastScrollTime: number;
  bufferTimer: NodeJS.Timeout | null;
}

/**
 * Custom hook that intercepts wheel events and redirects scroll behavior
 * to panels when mouse is over them, otherwise allows canvas panning
 */
export const useSmartScroll = (options: SmartScrollOptions = {}) => {
  const {
    enabled = true,
    panelSelector = '.panel-base, [data-testid*="panel"], .scrollbar-dark, .scrollbar-stable',
    debounceMs = 16, // ~60fps
    edgeBufferMs = 300, // Wait 300ms after scroll edge before allowing canvas operations
    debug = false
  } = options;

  const mousePositionRef = useRef({ x: 0, y: 0 });
  const lastScrollTargetRef = useRef<ScrollTarget | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // New state for edge scroll management
  const scrollStateRef = useRef<ScrollState>(ScrollState.CANVAS_READY);
  const edgeScrollStateRef = useRef<EdgeScrollState>({
    isAtEdge: false,
    scrollDirection: null,
    lastScrollTime: 0,
    bufferTimer: null
  });
  /**
   * Check if an element is scrollable
   */
  const isScrollable = useCallback((element: HTMLElement): boolean => {
    const style = window.getComputedStyle(element);
    const overflowY = style.overflowY;
    const hasVerticalScrollbar = element.scrollHeight > element.clientHeight;
    
    return (
      (overflowY === 'scroll' || overflowY === 'auto' || overflowY === 'overlay') &&
      hasVerticalScrollbar
    );
  }, []);

  /**
   * Check if element is at scroll edge in given direction
   */
  const isAtScrollEdge = useCallback((element: HTMLElement, direction: 'up' | 'down'): boolean => {
    const { scrollTop, scrollHeight, clientHeight } = element;
    const tolerance = 1; // Allow 1px tolerance for floating point precision
    
    if (direction === 'up') {
      return scrollTop <= tolerance;
    } else {
      return scrollTop >= (scrollHeight - clientHeight - tolerance);
    }
  }, []);
  /**
   * Reset edge scroll state
   */
  const resetEdgeScrollState = useCallback(() => {
    const edgeState = edgeScrollStateRef.current;
    
    if (edgeState.bufferTimer) {
      clearTimeout(edgeState.bufferTimer);
    }
    
    edgeScrollStateRef.current = {
      isAtEdge: false,
      scrollDirection: null,
      lastScrollTime: 0,
      bufferTimer: null
    };
    
    scrollStateRef.current = ScrollState.CANVAS_READY;
    
    if (debug) {
      console.log('🔄 Reset edge scroll state');
    }
  }, [debug]);

  /**
   * Handle scroll edge detection and state transitions
   */
  const handleScrollEdge = useCallback((element: HTMLElement, direction: 'up' | 'down') => {
    const now = Date.now();
    const edgeState = edgeScrollStateRef.current;
    
    if (isAtScrollEdge(element, direction)) {
      // Clear any existing buffer timer
      if (edgeState.bufferTimer) {
        clearTimeout(edgeState.bufferTimer);
      }
      
      // Update edge state
      edgeScrollStateRef.current = {
        isAtEdge: true,
        scrollDirection: direction,
        lastScrollTime: now,
        bufferTimer: null
      };
      
      scrollStateRef.current = ScrollState.EDGE_ABSORPTION;
      
      if (debug) {
        console.log(`🚫 Hit ${direction} edge, absorbing scrolls...`);
      }
      
      // Set buffer timer for transition to canvas ready
      const bufferTimer = setTimeout(() => {
        if (edgeScrollStateRef.current.isAtEdge) {
          scrollStateRef.current = ScrollState.CANVAS_READY;
          if (debug) {
            console.log('✅ Buffer expired, ready for canvas operations');
          }
        }
      }, edgeBufferMs);
      
      edgeScrollStateRef.current.bufferTimer = bufferTimer;
      
      return true; // Indicates we're at edge
    }
    
    return false; // Not at edge
  }, [isAtScrollEdge, debug, edgeBufferMs]);

  /**
   * Find scrollable panel element at given coordinates
   */
  const findScrollablePanel = useCallback((x: number, y: number): HTMLElement | null => {
    if (debug) {
      console.log(`🔍 Checking for panels at (${x}, ${y})`);
    }

    // Get element at point
    const elementAtPoint = document.elementFromPoint(x, y);
    if (!elementAtPoint) return null;

    // Check if the element itself is a panel
    if (elementAtPoint.matches(panelSelector)) {
      const panel = elementAtPoint as HTMLElement;
      if (isScrollable(panel)) {
        if (debug) {
          console.log('📋 Found panel (direct):', panel.className);
        }
        return panel;
      }
    }

    // Check if element is inside a panel
    const panelParent = elementAtPoint.closest(panelSelector) as HTMLElement;
    if (panelParent && isScrollable(panelParent)) {
      if (debug) {
        console.log('📋 Found panel (parent):', panelParent.className);
      }
      return panelParent;
    }

    // Special handling for nested scrollable content within panels
    let current = elementAtPoint as HTMLElement;
    while (current && current !== document.body) {
      // Check if current element is scrollable and inside a panel
      if (isScrollable(current)) {
        const panelAncestor = current.closest(panelSelector);
        if (panelAncestor) {
          if (debug) {
            console.log('📋 Found scrollable content in panel:', current.className);
          }
          return current;
        }
      }
      current = current.parentElement as HTMLElement;
    }    return null;  }, [panelSelector, debug, isScrollable]);
  /**
   * Update mouse position with debouncing and edge state management
   */
  const updateMousePosition = useCallback((x: number, y: number) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      mousePositionRef.current = { x, y };
      
      // Update cached scroll target
      const panel = findScrollablePanel(x, y);
      const newTarget = panel 
        ? { element: panel, type: 'panel' as const }
        : { element: document.body, type: 'canvas' as const };
      
      // If mouse moved away from panel, reset edge state
      if (lastScrollTargetRef.current?.type === 'panel' && newTarget.type === 'canvas') {
        resetEdgeScrollState();
        if (debug) {
          console.log('🏃 Mouse left panel area, reset edge state');
        }
      }
      
      lastScrollTargetRef.current = newTarget;
    }, debounceMs);
  }, [findScrollablePanel, debounceMs, resetEdgeScrollState, debug]);
  /**
   * Handle wheel events for smart scroll redirection with edge detection
   */
  const handleWheelEvent = useCallback((event: WheelEvent) => {
    if (!enabled) return;

    const { clientX, clientY } = event;
    
    // Find panel at current mouse position
    const panel = findScrollablePanel(clientX, clientY);
    
    if (panel) {
      const scrollDirection = event.deltaY > 0 ? 'down' : 'up';
      const currentState = scrollStateRef.current;
      const now = Date.now();
      
      if (debug) {
        console.log(`🎯 Panel scroll attempt: ${scrollDirection}, state: ${currentState}`);
      }
      
      // Check if panel can scroll in the intended direction
      const canScrollDown = panel.scrollTop < (panel.scrollHeight - panel.clientHeight);
      const canScrollUp = panel.scrollTop > 0;
      const canScroll = (scrollDirection === 'down' && canScrollDown) || (scrollDirection === 'up' && canScrollUp);
        if (canScroll) {
        // Panel can scroll - always prevent canvas operations
        event.preventDefault();
        event.stopPropagation();
        
        // Apply scroll to panel
        panel.scrollTop += event.deltaY;
        
        // Reset edge state since we're actively scrolling within bounds
        resetEdgeScrollState();
        scrollStateRef.current = ScrollState.PANEL_SCROLLING;
        
        if (debug) {
          console.log(`📜 Panel scrolled to: ${panel.scrollTop}/${panel.scrollHeight - panel.clientHeight}`);
        }
      } else {
        // Panel can't scroll further - we're at edge
        const currentState = scrollStateRef.current;
        
        if (debug) {
          console.log(`🎯 At panel edge, current state: ${currentState}, direction: ${scrollDirection}`);
        }
        
        if (currentState === ScrollState.CANVAS_READY) {
          // Buffer has expired - allow canvas operations
          if (debug) {
            console.log('✅ Buffer expired - allowing canvas operations');
          }
          // Don't prevent default - let canvas handle it
          // Keep state as CANVAS_READY for continuous scrolling
          
        } else if (currentState === ScrollState.PANEL_SCROLLING) {
          // First time hitting edge - start absorption
          handleScrollEdge(panel, scrollDirection);
          event.preventDefault();
          event.stopPropagation();
          
          if (debug) {
            console.log('🚫 First hit at edge - entering absorption mode');
          }
          
        } else if (currentState === ScrollState.EDGE_ABSORPTION) {
          // Already absorbing - continue blocking and reset timer
          event.preventDefault();
          event.stopPropagation();
          
          // Reset buffer timer since user is still trying to scroll
          const edgeState = edgeScrollStateRef.current;
          if (edgeState.bufferTimer) {
            clearTimeout(edgeState.bufferTimer);
          }
          
          // Set new buffer timer
          const bufferTimer = setTimeout(() => {
            if (edgeScrollStateRef.current.isAtEdge) {
              scrollStateRef.current = ScrollState.CANVAS_READY;
              if (debug) {
                console.log('✅ Buffer expired, ready for canvas operations');
              }
            }
          }, edgeBufferMs);
          
          edgeScrollStateRef.current.bufferTimer = bufferTimer;
          edgeScrollStateRef.current.lastScrollTime = now;
          
          if (debug) {
            console.log('🚫 Continuing absorption, resetting buffer timer');
          }
        }
      }    } else {
      // Mouse is over canvas - reset panel state and allow normal panning
      resetEdgeScrollState();
      
      if (debug) {
        console.log('🌐 Allowing canvas panning');
      }
    }
  }, [enabled, findScrollablePanel, debug, handleScrollEdge, resetEdgeScrollState, edgeBufferMs]);
  /**
   * Handle mouse move events to track position
   */
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!enabled) return;
    updateMousePosition(event.clientX, event.clientY);
  }, [enabled, updateMousePosition]);

  /**
   * Set up event listeners
   */
  useEffect(() => {
    if (!enabled) return;

    // Use capture phase to intercept before React Flow
    document.addEventListener('wheel', handleWheelEvent, { 
      passive: false, 
      capture: true 
    });
    
    document.addEventListener('mousemove', handleMouseMove, { 
      passive: true 
    });

    if (debug) {
      console.log('🎛️ Smart scroll redirection enabled');
    }

    return () => {
      document.removeEventListener('wheel', handleWheelEvent, true);
      document.removeEventListener('mousemove', handleMouseMove);
      
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      if (debug) {
        console.log('🎛️ Smart scroll redirection disabled');
      }
    };
  }, [enabled, handleWheelEvent, handleMouseMove, debug]);

  /**
   * Return current scroll target for debugging
   */
  const getCurrentScrollTarget = useCallback(() => {
    return lastScrollTargetRef.current;
  }, []);

  return {
    getCurrentScrollTarget,
    isEnabled: enabled
  };
};
