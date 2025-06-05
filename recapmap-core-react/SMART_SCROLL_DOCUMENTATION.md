# Smart Scroll Feature Documentation

## Overview

The Smart Scroll feature intelligently intercepts mouse wheel events when the cursor is positioned over scrollable panels, redirecting the scroll action to the panel content instead of allowing React Flow canvas panning. This provides a more intuitive user experience when working with panels that contain scrollable content.

## Key Features

- **Automatic Panel Detection**: Detects scrollable panels using CSS selectors
- **Scroll Direction Intelligence**: Prevents interference when panels reach scroll limits
- **Performance Optimized**: Uses debounced mouse tracking and capture-phase event handling
- **Non-Intrusive**: Maintains normal canvas panning when mouse is over canvas areas
- **Configurable**: Customizable panel selectors and scroll sensitivity
- **Debug Support**: Optional debug logging for development

## Implementation

### Core Hook: `useSmartScroll`

Located in `src/hooks/useSmartScroll.ts`, this custom React hook provides the main functionality:

```typescript
import { useSmartScroll } from '../hooks/useSmartScroll';

// Basic usage
useSmartScroll();

// With custom configuration
useSmartScroll({
  panelSelectors: '.my-panel, [data-panel="true"]',
  scrollSensitivity: 1.5,
  debug: true
});
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `panelSelectors` | `string` | `'.panel-base, [data-testid*="panel"], .scrollbar-dark, .scrollbar-stable, .overflow-y-auto'` | CSS selectors to identify scrollable panels |
| `scrollSensitivity` | `number` | `1` | Multiplier for scroll speed |
| `debug` | `boolean` | `false` | Enable debug logging |

### Default Panel Selectors

The hook automatically detects the following panel types:

- `.panel-base` - Standard panel components
- `[data-testid*="panel"]` - Elements with test IDs containing "panel"
- `.scrollbar-dark` - Elements with dark scrollbar styling
- `.scrollbar-stable` - Elements with stable scrollbar styling
- `.overflow-y-auto` - Elements with automatic vertical overflow

## Integration with Canvas

The feature is integrated into the main Canvas component:

```typescript
// In Canvas.tsx
import { useSmartScroll } from '../hooks/useSmartScroll';

const Canvas: React.FC = () => {
  // Initialize smart scroll with panel selectors
  useSmartScroll({
    panelSelectors: '.panel-base, [data-testid*="panel"], .scrollbar-dark, .scrollbar-stable, .overflow-y-auto',
    debug: process.env.NODE_ENV === 'development',
  });

  // ... rest of component
};
```

## Demo Component

A comprehensive demo component (`SmartScrollDemo.tsx`) is available to test and showcase the functionality:

### Features of the Demo

1. **Multiple Test Panels**: Three different panel configurations to test various scenarios
2. **Interactive Toggle**: Show/hide demo panels with a toggle button
3. **Comprehensive Instructions**: Step-by-step testing guide
4. **Visual Feedback**: Different styling for each panel type
5. **Nested Scrolling**: Tests complex nested scrollable scenarios

### Using the Demo

1. Open the application in development mode
2. Click "Show Smart Scroll Demo" in the top-right corner
3. Try scrolling over different panels to see the smart scroll behavior
4. Move the mouse to canvas areas to test normal panning

## How It Works

### Event Flow

1. **Mouse Tracking**: Debounced mouse position tracking (60fps)
2. **Element Detection**: Uses `document.elementFromPoint()` to find elements under cursor
3. **Panel Matching**: Checks if the element matches panel selectors
4. **Scroll Capability Check**: Verifies the element can actually scroll
5. **Event Interception**: Captures wheel events in the capture phase
6. **Scroll Redirection**: Applies scroll to panel instead of allowing canvas panning
7. **Limit Detection**: Allows canvas panning when panel reaches scroll limits

### Technical Details

- **Capture Phase**: Events are handled in the capture phase to intercept before React Flow
- **Debounced Tracking**: Mouse position updates are debounced to ~60fps for performance
- **Scroll Limit Detection**: Prevents event blocking when panels can't scroll further
- **Cleanup**: Proper event listener cleanup on component unmount

## Performance Considerations

- **Minimal Overhead**: Only active when mouse wheel events occur
- **Debounced Updates**: Mouse position tracking is throttled for performance
- **Event Delegation**: Uses capture phase for efficient event handling
- **Memory Management**: Proper cleanup prevents memory leaks

## Browser Compatibility

- **Modern Browsers**: Works with all modern browsers supporting ES6+
- **Wheel Events**: Uses standard `wheel` events for broad compatibility
- **DOM APIs**: Relies on `document.elementFromPoint` and `getComputedStyle`

## Testing

### Unit Tests

Comprehensive unit tests are available in `src/__tests__/hooks/useSmartScroll.test.ts`:

- Hook initialization and cleanup
- Event handling scenarios
- Panel detection logic
- Scroll limit detection
- Custom configuration options
- Edge cases and error handling

### Integration Tests

Integration tests in `src/__tests__/integration/smartScrollIntegration.test.tsx`:

- Canvas component integration
- Demo component functionality
- React Flow compatibility
- Event propagation behavior

### Running Tests

```bash
npm test                    # Run all tests
npm run test:ui            # Run tests with UI
npm run test:coverage      # Run with coverage report
```

## Troubleshooting

### Common Issues

1. **Panels Not Detected**
   - Verify panel elements have the correct CSS classes or attributes
   - Check that elements are actually scrollable (`overflow: auto/scroll`)
   - Use debug mode to see detection logs

2. **Scroll Not Working**
   - Ensure panels have proper `scrollHeight > clientHeight`
   - Check for CSS that might prevent scrolling
   - Verify event listeners are properly attached

3. **Canvas Panning Issues**
   - Confirm that non-panel areas still allow normal panning
   - Check that scroll limits are properly detected
   - Verify event propagation is working correctly

### Debug Mode

Enable debug mode to see detailed logging:

```typescript
useSmartScroll({ debug: true });
```

Debug logs include:
- Panel detection results
- Scroll capability checks
- Event interception decisions
- Scroll limit calculations

## Best Practices

### Panel Implementation

1. **Consistent Classes**: Use standard panel classes for automatic detection
2. **Proper Overflow**: Ensure panels have `overflow: auto` or `overflow: scroll`
3. **Adequate Height**: Set explicit heights to enable scrolling
4. **Test Attributes**: Use `data-testid` attributes containing "panel" for test panels

### Performance

1. **Minimize Redraws**: Use CSS transforms for smooth scrolling
2. **Debounce Events**: Avoid creating too many event handlers
3. **Cleanup Resources**: Always cleanup event listeners in useEffect cleanup

### Accessibility

1. **Keyboard Support**: Ensure panels remain keyboard accessible
2. **Screen Readers**: Don't break screen reader navigation
3. **Focus Management**: Maintain proper focus handling

## Future Enhancements

Potential improvements for future versions:

1. **Touch Support**: Add touch gesture support for mobile devices
2. **Custom Scroll Animations**: Support for smooth scroll animations
3. **Panel Priority**: Allow panels to specify scroll priority
4. **Gesture Recognition**: Support for complex scroll gestures
5. **Plugin System**: Extensible plugin architecture for custom behaviors

## Contributing

When contributing to the smart scroll feature:

1. Run all tests before submitting changes
2. Add tests for new functionality
3. Update documentation for API changes
4. Test with the demo component
5. Verify browser compatibility

## API Reference

### Interfaces

```typescript
interface SmartScrollOptions {
  panelSelectors?: string;
  scrollSensitivity?: number;
  debug?: boolean;
}

interface ScrollTarget {
  element: HTMLElement;
  canScrollVertically: boolean;
  canScrollHorizontally: boolean;
}
```

### Methods

- `useSmartScroll(options?: SmartScrollOptions): void`
- `findScrollablePanel(element: Element): HTMLElement | null`
- `isScrollable(element: HTMLElement): boolean`
- `handleWheelEvent(event: WheelEvent): void`
- `updateMousePosition(event: MouseEvent): void`

---

*This documentation is part of the RecapMap Core React application. For more information, see the main project README.*
