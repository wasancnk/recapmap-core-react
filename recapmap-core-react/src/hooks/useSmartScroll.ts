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
   * Debug logging for development
   */
  debug?: boolean;
}

interface ScrollTarget {
  element: HTMLElement;
  type: 'panel' | 'canvas';
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
    debug = false
  } = options;

  const mousePositionRef = useRef({ x: 0, y: 0 });
  const lastScrollTargetRef = useRef<ScrollTarget | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

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
    }

    return null;
  }, [panelSelector, debug]);

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
   * Update mouse position with debouncing
   */
  const updateMousePosition = useCallback((x: number, y: number) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      mousePositionRef.current = { x, y };
      
      // Update cached scroll target
      const panel = findScrollablePanel(x, y);
      lastScrollTargetRef.current = panel 
        ? { element: panel, type: 'panel' }
        : { element: document.body, type: 'canvas' };
    }, debounceMs);
  }, [findScrollablePanel, debounceMs]);

  /**
   * Handle wheel events for smart scroll redirection
   */
  const handleWheelEvent = useCallback((event: WheelEvent) => {
    if (!enabled) return;

    const { clientX, clientY } = event;
    
    // Find panel at current mouse position
    const panel = findScrollablePanel(clientX, clientY);
    
    if (panel) {
      // Mouse is over a panel - redirect scroll to panel
      if (debug) {
        console.log('🎯 Redirecting scroll to panel');
      }

      // Check if panel can scroll in the intended direction
      const canScrollDown = panel.scrollTop < (panel.scrollHeight - panel.clientHeight);
      const canScrollUp = panel.scrollTop > 0;
      const scrollingDown = event.deltaY > 0;
      const scrollingUp = event.deltaY < 0;

      // Only prevent default if panel can actually scroll in that direction
      if ((scrollingDown && canScrollDown) || (scrollingUp && canScrollUp)) {
        event.preventDefault();
        event.stopPropagation();
        
        // Apply scroll to panel
        panel.scrollTop += event.deltaY;
        
        if (debug) {
          console.log(`📜 Panel scrolled to: ${panel.scrollTop}/${panel.scrollHeight - panel.clientHeight}`);
        }
      } else {
        // Panel can't scroll further, allow event to bubble to canvas
        if (debug) {
          console.log('📜 Panel scroll exhausted, allowing canvas panning');
        }
      }
    } else {
      // Mouse is over canvas - allow normal panning behavior
      if (debug) {
        console.log('🌐 Allowing canvas panning');
      }
    }
  }, [enabled, findScrollablePanel, debug]);

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
