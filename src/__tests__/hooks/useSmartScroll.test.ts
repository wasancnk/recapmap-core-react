import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useSmartScroll } from '../../hooks/useSmartScroll';

// Mock DOM methods
const mockElementFromPoint = vi.fn();
const mockAddEventListener = vi.fn();
const mockRemoveEventListener = vi.fn();
const mockGetComputedStyle = vi.fn();

// Mock document
Object.defineProperty(document, 'elementFromPoint', {
  value: mockElementFromPoint,
  writable: true,
});

Object.defineProperty(document, 'addEventListener', {
  value: mockAddEventListener,
  writable: true,
});

Object.defineProperty(document, 'removeEventListener', {
  value: mockRemoveEventListener,
  writable: true,
});

Object.defineProperty(window, 'getComputedStyle', {
  value: mockGetComputedStyle,
  writable: true,
});

// Mock console methods in non-development environment
const originalNodeEnv = process.env.NODE_ENV;

describe('useSmartScroll', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NODE_ENV = 'test';
  });

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });
  it('should initialize with default options', () => {
    const { result } = renderHook(() => useSmartScroll());
    
    expect(result.current).toEqual({
      getCurrentScrollTarget: expect.any(Function),
      isEnabled: true
    });
    expect(mockAddEventListener).toHaveBeenCalledWith('wheel', expect.any(Function), { capture: true, passive: false });
    expect(mockAddEventListener).toHaveBeenCalledWith('mousemove', expect.any(Function), { passive: true });
  });

  it('should use custom panel selectors', () => {
    const customSelectors = '.custom-panel, [data-custom="true"]';
    
    renderHook(() => useSmartScroll({ panelSelector: customSelectors }));
    
    // The hook should be initialized (event listeners added)
    expect(mockAddEventListener).toHaveBeenCalledTimes(2);
  });

  it('should enable/disable debug mode based on environment', () => {
    // Test with development environment
    process.env.NODE_ENV = 'development';
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    renderHook(() => useSmartScroll({ debug: true }));
    
    expect(mockAddEventListener).toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });

  it('should handle wheel events when mouse is over scrollable panel', () => {
    const mockPanel = {
      matches: vi.fn().mockReturnValue(true),
      scrollTop: 0,
      scrollHeight: 200,
      clientHeight: 100,
      scrollLeft: 0,
      scrollWidth: 100,
      clientWidth: 100,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    const mockEvent = {
      clientX: 100,
      clientY: 100,
      deltaY: -10,
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    };

    mockElementFromPoint.mockReturnValue(mockPanel);
    mockGetComputedStyle.mockReturnValue({
      overflowY: 'auto',
      overflowX: 'hidden',
    });    renderHook(() => useSmartScroll());

    // Simulate wheel event
    const wheelHandler = mockAddEventListener.mock.calls.find(
      call => call[0] === 'wheel'
    )?.[1];

    expect(wheelHandler).toBeDefined();

    act(() => {
      wheelHandler(mockEvent);
    });

    expect(mockElementFromPoint).toHaveBeenCalledWith(100, 100);
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
  });

  it('should not intercept wheel events when mouse is not over scrollable panel', () => {
    const mockNonScrollableElement = {
      matches: vi.fn().mockReturnValue(false),
    };

    const mockEvent = {
      clientX: 100,
      clientY: 100,
      deltaY: -10,
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    };

    mockElementFromPoint.mockReturnValue(mockNonScrollableElement);

    renderHook(() => useSmartScroll());

    const wheelHandler = mockAddEventListener.mock.calls.find(
      call => call[0] === 'wheel'
    )?.[1];

    act(() => {
      wheelHandler(mockEvent);
    });

    expect(mockEvent.preventDefault).not.toHaveBeenCalled();
    expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
  });

  it('should handle vertical scrolling correctly', () => {
    const mockPanel = {
      matches: vi.fn().mockReturnValue(true),
      scrollTop: 50,
      scrollHeight: 200,
      clientHeight: 100,
      scrollLeft: 0,
      scrollWidth: 100,
      clientWidth: 100,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    mockElementFromPoint.mockReturnValue(mockPanel);
    mockGetComputedStyle.mockReturnValue({
      overflowY: 'auto',
      overflowX: 'hidden',
    });

    const mockEvent = {
      clientX: 100,
      clientY: 100,
      deltaY: 10, // Scrolling down
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    };

    renderHook(() => useSmartScroll());

    const wheelHandler = mockAddEventListener.mock.calls.find(
      call => call[0] === 'wheel'
    )?.[1];

    act(() => {
      wheelHandler(mockEvent);
    });

    expect(mockPanel.scrollTop).toBe(60); // 50 + 10
    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });

  it('should handle horizontal scrolling correctly', () => {
    const mockPanel = {
      matches: vi.fn().mockReturnValue(true),
      scrollTop: 0,
      scrollHeight: 100,
      clientHeight: 100,
      scrollLeft: 50,
      scrollWidth: 200,
      clientWidth: 100,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    mockElementFromPoint.mockReturnValue(mockPanel);
    mockGetComputedStyle.mockReturnValue({
      overflowY: 'hidden',
      overflowX: 'auto',
    });

    const mockEvent = {
      clientX: 100,
      clientY: 100,
      deltaX: 10, // Scrolling right
      deltaY: 0,
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    };

    renderHook(() => useSmartScroll());

    const wheelHandler = mockAddEventListener.mock.calls.find(
      call => call[0] === 'wheel'
    )?.[1];

    act(() => {
      wheelHandler(mockEvent);
    });

    expect(mockPanel.scrollLeft).toBe(60); // 50 + 10
    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });

  it('should not scroll when panel is at scroll limit', () => {
    const mockPanel = {
      matches: vi.fn().mockReturnValue(true),
      scrollTop: 100, // At bottom (scrollHeight - clientHeight = 200 - 100 = 100)
      scrollHeight: 200,
      clientHeight: 100,
      scrollLeft: 0,
      scrollWidth: 100,
      clientWidth: 100,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    mockElementFromPoint.mockReturnValue(mockPanel);
    mockGetComputedStyle.mockReturnValue({
      overflowY: 'auto',
      overflowX: 'hidden',
    });

    const mockEvent = {
      clientX: 100,
      clientY: 100,
      deltaY: 10, // Trying to scroll down when already at bottom
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    };

    renderHook(() => useSmartScroll());

    const wheelHandler = mockAddEventListener.mock.calls.find(
      call => call[0] === 'wheel'
    )?.[1];

    act(() => {
      wheelHandler(mockEvent);
    });

    // Should not prevent default when at scroll limit
    expect(mockEvent.preventDefault).not.toHaveBeenCalled();
    expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
  });

  it('should handle mouse move events for position tracking', () => {
    const mockEvent = {
      clientX: 150,
      clientY: 250,
    };

    renderHook(() => useSmartScroll());

    const mouseMoveHandler = mockAddEventListener.mock.calls.find(
      call => call[0] === 'mousemove'
    )?.[1];

    expect(mouseMoveHandler).toBeDefined();

    act(() => {
      mouseMoveHandler(mockEvent);
    });

    // Mouse position should be updated (though we can't directly test the internal state)
    expect(mockAddEventListener).toHaveBeenCalledWith('mousemove', expect.any(Function));
  });

  it('should clean up event listeners on unmount', () => {
    const { unmount } = renderHook(() => useSmartScroll());

    unmount();

    expect(mockRemoveEventListener).toHaveBeenCalledWith('wheel', expect.any(Function), { capture: true });
    expect(mockRemoveEventListener).toHaveBeenCalledWith('mousemove', expect.any(Function));
  });

  it('should handle nested scrollable elements', () => {
    const mockChildPanel = {
      matches: vi.fn().mockReturnValue(true),
      scrollTop: 0,
      scrollHeight: 150,
      clientHeight: 75,
      scrollLeft: 0,
      scrollWidth: 100,
      clientWidth: 100,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      parentElement: {
        matches: vi.fn().mockReturnValue(true),
        scrollTop: 0,
        scrollHeight: 300,
        clientHeight: 200,
      },
    };

    mockElementFromPoint.mockReturnValue(mockChildPanel);
    mockGetComputedStyle.mockReturnValue({
      overflowY: 'auto',
      overflowX: 'hidden',
    });

    const mockEvent = {
      clientX: 100,
      clientY: 100,
      deltaY: -5,
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    };

    renderHook(() => useSmartScroll());

    const wheelHandler = mockAddEventListener.mock.calls.find(
      call => call[0] === 'wheel'
    )?.[1];

    act(() => {
      wheelHandler(mockEvent);
    });

    // Should handle the inner scrollable element
    expect(mockChildPanel.scrollTop).toBe(5); // 0 + 5 (negative delta becomes positive scroll)
    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });

  it('should respect custom scroll sensitivity', () => {
    const mockPanel = {
      matches: vi.fn().mockReturnValue(true),
      scrollTop: 0,
      scrollHeight: 200,
      clientHeight: 100,
      scrollLeft: 0,
      scrollWidth: 100,
      clientWidth: 100,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    mockElementFromPoint.mockReturnValue(mockPanel);
    mockGetComputedStyle.mockReturnValue({
      overflowY: 'auto',
      overflowX: 'hidden',
    });

    const mockEvent = {
      clientX: 100,
      clientY: 100,
      deltaY: 1, // Small delta
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    };

    renderHook(() => useSmartScroll({ debounceMs: 32 }));

    const wheelHandler = mockAddEventListener.mock.calls.find(
      call => call[0] === 'wheel'
    )?.[1];

    act(() => {
      wheelHandler(mockEvent);
    });

    expect(mockPanel.scrollTop).toBe(2); // 1 * 2 (sensitivity multiplier)
    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });

  it('should handle elements with different panel selectors', () => {
    const testCases = [
      { className: 'panel-base', shouldMatch: true },
      { 'data-testid': 'my-panel-component', shouldMatch: true },
      { className: 'scrollbar-dark', shouldMatch: true },
      { className: 'scrollbar-stable', shouldMatch: true },
      { className: 'overflow-y-auto', shouldMatch: true },
      { className: 'regular-div', shouldMatch: false },
    ];

    testCases.forEach(({ className, 'data-testid': testId, shouldMatch }) => {
      const mockElement = {
        matches: vi.fn().mockImplementation((selector) => {
          if (className && selector.includes(`.${className}`)) return true;
          if (testId && selector.includes('[data-testid*="panel"]') && testId.includes('panel')) return true;
          return false;
        }),
        scrollTop: 0,
        scrollHeight: 200,
        clientHeight: 100,
        scrollLeft: 0,
        scrollWidth: 100,
        clientWidth: 100,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      };

      mockElementFromPoint.mockReturnValue(mockElement);
      mockGetComputedStyle.mockReturnValue({
        overflowY: 'auto',
        overflowX: 'hidden',
      });

      const mockEvent = {
        clientX: 100,
        clientY: 100,
        deltaY: 10,
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      };

      renderHook(() => useSmartScroll());

      const wheelHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'wheel'
      )?.[1];

      act(() => {
        wheelHandler(mockEvent);
      });

      if (shouldMatch) {
        expect(mockEvent.preventDefault).toHaveBeenCalled();
      } else {
        expect(mockEvent.preventDefault).not.toHaveBeenCalled();
      }

      // Reset mocks for next test case
      vi.clearAllMocks();
    });
  });
  describe('Edge detection and buffer functionality', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });    it('should initialize with edgeBufferMs option', () => {
      const { result } = renderHook(() => useSmartScroll({ 
        edgeBufferMs: 500,
        debug: true 
      }));
      
      expect(result.current).toEqual({
        getCurrentScrollTarget: expect.any(Function),
        isEnabled: true
      });
      expect(mockAddEventListener).toHaveBeenCalledWith('wheel', expect.any(Function), { 
        passive: false, 
        capture: true 
      });
    });

    it('should absorb scroll events when at panel edge', () => {
      const mockPanel = {
        matches: vi.fn().mockReturnValue(true),
        scrollTop: 0, // At top edge
        scrollHeight: 200,
        clientHeight: 100,
        closest: vi.fn().mockReturnValue(null),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      };

      mockElementFromPoint.mockReturnValue(mockPanel);
      mockGetComputedStyle.mockReturnValue({
        overflowY: 'auto',
      });

      renderHook(() => useSmartScroll({ 
        edgeBufferMs: 300,
        debug: true 
      }));

      const wheelHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'wheel'
      )?.[1];

      const mockEvent = {
        clientX: 100,
        clientY: 100,
        deltaY: -10, // Scroll up at top edge
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      };

      // First scroll at edge should be absorbed
      act(() => {
        wheelHandler(mockEvent);
      });

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
    });

    it('should allow canvas operations after buffer expires', () => {
      const mockPanel = {
        matches: vi.fn().mockReturnValue(true),
        scrollTop: 190, // At bottom edge (scrollHeight 200 - clientHeight 100 = 100, with tolerance)
        scrollHeight: 200,
        clientHeight: 100,
        closest: vi.fn().mockReturnValue(null),
        addEventListener: vi.fn(),  
        removeEventListener: vi.fn(),
      };

      mockElementFromPoint.mockReturnValue(mockPanel);
      mockGetComputedStyle.mockReturnValue({
        overflowY: 'auto',
      });

      renderHook(() => useSmartScroll({ 
        edgeBufferMs: 300,
        debug: true 
      }));

      const wheelHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'wheel'
      )?.[1];

      const mockEvent = {
        clientX: 100,
        clientY: 100,
        deltaY: 10, // Scroll down at bottom edge
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      };

      // First scroll at edge - should be absorbed
      act(() => {
        wheelHandler(mockEvent);
      });

      expect(mockEvent.preventDefault).toHaveBeenCalled();

      // Reset event mock
      mockEvent.preventDefault = vi.fn();
      mockEvent.stopPropagation = vi.fn();      // Fast forward past buffer time
      act(() => {
        vi.advanceTimersByTime(301);
      });

      // Another scroll should now allow canvas operations
      act(() => {
        wheelHandler(mockEvent);
      });

      // Should not prevent default after buffer expires
      expect(mockEvent.preventDefault).not.toHaveBeenCalled();
    });

    it('should reset buffer timer on continued scrolling at edge', () => {
      const mockPanel = {
        matches: vi.fn().mockReturnValue(true),
        scrollTop: 0, // At top edge
        scrollHeight: 200,
        clientHeight: 100,
        closest: vi.fn().mockReturnValue(null),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      };

      mockElementFromPoint.mockReturnValue(mockPanel);
      mockGetComputedStyle.mockReturnValue({
        overflowY: 'auto',
      });

      renderHook(() => useSmartScroll({ 
        edgeBufferMs: 300,
        debug: true 
      }));

      const wheelHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'wheel'
      )?.[1];

      const mockEvent = {
        clientX: 100,
        clientY: 100,
        deltaY: -10, // Scroll up at top edge
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      };

      // First scroll at edge
      act(() => {
        wheelHandler(mockEvent);
      });      // Fast forward partway through buffer
      act(() => {
        vi.advanceTimersByTime(150);
      });

      // Reset event mock
      mockEvent.preventDefault = vi.fn();
      mockEvent.stopPropagation = vi.fn();

      // Another scroll at edge should restart the buffer timer
      act(() => {
        wheelHandler(mockEvent);
      });

      expect(mockEvent.preventDefault).toHaveBeenCalled();      // Fast forward the remaining original time (should still be blocked)
      act(() => {
        vi.advanceTimersByTime(151);
      });

      // Reset event mock
      mockEvent.preventDefault = vi.fn();
      mockEvent.stopPropagation = vi.fn();

      // Should still be blocking since timer was reset
      act(() => {
        wheelHandler(mockEvent);
      });

      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    it('should reset edge state when mouse leaves panel area', () => {
      const mockPanel = {
        matches: vi.fn().mockReturnValue(true),
        scrollTop: 0,
        scrollHeight: 200,
        clientHeight: 100,
        closest: vi.fn().mockReturnValue(null),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      };

      // Initially return panel element
      mockElementFromPoint.mockReturnValue(mockPanel);
      mockGetComputedStyle.mockReturnValue({
        overflowY: 'auto',
      });

      renderHook(() => useSmartScroll({ 
        edgeBufferMs: 300,
        debug: true 
      }));

      const mouseMoveHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'mousemove'
      )?.[1];

      // Simulate mouse leaving panel area
      mockElementFromPoint.mockReturnValue(document.body);

      const mockMouseEvent = {
        clientX: 500,
        clientY: 500,
      };

      act(() => {
        mouseMoveHandler(mockMouseEvent);
      });      // Fast forward past debounce time
      act(() => {
        vi.advanceTimersByTime(20);
      });

      // Edge state should be reset - verify by testing wheel event behavior
      const wheelHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'wheel'
      )?.[1];

      const mockWheelEvent = {
        clientX: 500,
        clientY: 500,
        deltaY: 10,
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      };

      act(() => {
        wheelHandler(mockWheelEvent);
      });

      // Should not prevent default since we're over canvas now
      expect(mockWheelEvent.preventDefault).not.toHaveBeenCalled();
    });
  });
});
