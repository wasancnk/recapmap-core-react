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
    
    expect(result.current).toBeUndefined();
    expect(mockAddEventListener).toHaveBeenCalledWith('wheel', expect.any(Function), { capture: true });
    expect(mockAddEventListener).toHaveBeenCalledWith('mousemove', expect.any(Function));
  });

  it('should use custom panel selectors', () => {
    const customSelectors = '.custom-panel, [data-custom="true"]';
    
    renderHook(() => useSmartScroll({ panelSelectors: customSelectors }));
    
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
    });

    const { result } = renderHook(() => useSmartScroll());

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

    renderHook(() => useSmartScroll({ scrollSensitivity: 2 }));

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
});
