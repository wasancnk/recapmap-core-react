# Custom Scrollbar Implementation - Dark Theme

## Overview
RecapMap features custom-styled scrollbars that maintain the dark theme aesthetic while providing excellent cross-browser compatibility and user experience.

## Scrollbar Classes

### `.scrollbar-thin`
**Usage**: Subtle scrollbars for general content areas
```css
.scrollbar-thin {
  /* Firefox */
  scrollbar-width: thin;
  scrollbar-color: rgba(75, 85, 99, 0.6) transparent;
}

/* WebKit browsers (Chrome, Safari, Edge) */
.scrollbar-thin::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
```

**Features**:
- ✅ 8px width for comfortable interaction
- ✅ Subtle gray theme matching UI
- ✅ Smooth hover transitions
- ✅ Cross-browser compatible

### `.scrollbar-dark` 
**Usage**: Enhanced scrollbars for panels and important content areas
```css
.scrollbar-dark {
  /* Firefox - allows native auto-hide behavior */
  scrollbar-width: auto;
  scrollbar-color: rgba(59, 130, 246, 0.5) rgba(31, 41, 55, 0.2);
  overflow: auto;
}

/* WebKit browsers */
.scrollbar-dark::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
```

**Features**:
- ✅ 10px width for better visibility
- ✅ Blue accent color matching brand
- ✅ Gradient effects and shadows
- ✅ Enhanced hover/active states
- ✅ Perfect for dark panels
- ✅ Firefox auto-hide compatibility

### `.scrollbar-stable`
**Usage**: Always-visible scrollbars that override Firefox's auto-hide behavior
```css
.scrollbar-stable {
  /* Firefox - forces scrollbar to always be visible */
  scrollbar-width: thin;
  scrollbar-color: rgba(59, 130, 246, 0.7) rgba(31, 41, 55, 0.3);
  overflow: scroll; /* Forces scrollbar presence */
}

/* Firefox-specific override */
@-moz-document url-prefix() {
  .scrollbar-stable {
    scrollbar-width: thin !important;
    overflow: scroll !important;
  }
}
```

**Features**:
- ✅ Consistent behavior across all browsers
- ✅ Overrides Firefox's auto-hide feature
- ✅ Always visible scrollbars for predictable UX
- ✅ Use when scrollbar visibility is critical

### `.scrollbar-none`
**Usage**: Hide scrollbars while maintaining scroll functionality
```css
.scrollbar-none {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.scrollbar-none::-webkit-scrollbar {
  display: none;
}
```

## Browser Compatibility

### ✅ Modern Browsers (Full Support)
- **Chrome 88+**: Full WebKit scrollbar support
- **Firefox 64+**: scrollbar-width and scrollbar-color support
- **Safari 14+**: Full WebKit scrollbar support
- **Edge 88+**: Full WebKit scrollbar support

### 🦊 Firefox-Specific Behavior
Firefox has unique scrollbar auto-hide functionality that affects UX:

**Auto-Hide Feature**:
- Firefox automatically reduces scrollbar width when inactive
- After a few seconds of inactivity, scrollbars completely disappear
- This creates a "overlay scrollbar" experience similar to macOS
- Scrollbars reappear on hover or scroll interaction

**Behavior Impact**:
- ✅ **`.scrollbar-dark`**: Respects Firefox's auto-hide (modern UX)
- 🔒 **`.scrollbar-stable`**: Forces always-visible scrollbars (consistent UX)

**Choose Based On**:
- Use `.scrollbar-dark` for general content where auto-hide is acceptable
- Use `.scrollbar-stable` for critical UI where scrollbar visibility indicates scrollable content

### ⚠️ Legacy Browser Fallbacks
- **Internet Explorer**: Uses system scrollbars (graceful degradation)
- **Old Chrome/Safari**: Basic styling only
- **Old Firefox**: System scrollbars

## Implementation Details

### WebKit Implementation (Chrome, Safari, Edge)
```css
/* Track - the scrollbar background */
::-webkit-scrollbar-track {
  background: rgba(17, 24, 39, 0.4);
  border-radius: 5px;
  margin: 2px;
}

/* Thumb - the draggable scrolling handle */
::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, 
    rgba(59, 130, 246, 0.6) 0%, 
    rgba(37, 99, 235, 0.7) 50%,
    rgba(29, 78, 216, 0.8) 100%
  );
  border-radius: 5px;
  border: 1px solid rgba(59, 130, 246, 0.3);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

/* Hover state */
::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, 
    rgba(79, 149, 255, 0.8) 0%, 
    rgba(59, 130, 246, 0.9) 50%,
    rgba(37, 99, 235, 1) 100%
  );
  box-shadow: 0 2px 6px rgba(59, 130, 246, 0.4);
}
```

### Firefox Implementation
```css
/* Default - respects Firefox auto-hide */
.scrollbar-dark {
  scrollbar-width: auto; /* Allows Firefox's auto-hide behavior */
  scrollbar-color: rgba(59, 130, 246, 0.5) rgba(31, 41, 55, 0.2);
  overflow: auto;
}

/* Force always-visible in Firefox */
.scrollbar-stable {
  scrollbar-width: thin; /* Thinner but always visible */
  scrollbar-color: rgba(59, 130, 246, 0.7) rgba(31, 41, 55, 0.3);
  overflow: scroll; /* Forces scrollbar presence */
}

/* Firefox-specific override for stable scrollbars */
@-moz-document url-prefix() {
  .scrollbar-stable {
    scrollbar-width: thin !important;
    overflow: scroll !important;
  }
}
```

**Firefox Auto-Hide Behavior**:
- `scrollbar-width: auto` allows Firefox's native overlay scrollbar behavior
- `scrollbar-width: thin` with `overflow: scroll` forces always-visible scrollbars
- `@-moz-document url-prefix()` targets Firefox specifically for stable behavior

## Usage Examples

### Panel Components
```tsx
// Panel with enhanced dark scrollbar (allows Firefox auto-hide)
<div className="p-4 h-full overflow-y-auto scrollbar-dark">
  {/* Panel content */}
</div>

// Always-visible scrollbar (overrides Firefox auto-hide)
<div className="p-4 h-full overflow-y-auto scrollbar-stable">
  {/* Critical content where scrollbar visibility is important */}
</div>

// Subtle scrollbar for secondary content
<div className="max-h-48 overflow-y-auto scrollbar-thin">
  {/* List content */}
</div>
```

### Browser-Specific Considerations
```tsx
// For Firefox users who prefer modern auto-hide behavior
<div className="overflow-y-auto scrollbar-dark">
  {/* Content with modern scrollbar experience */}
</div>

// For consistent cross-browser experience
<div className="overflow-y-auto scrollbar-stable">
  {/* Content with predictable scrollbar visibility */}
</div>
```

### Current Implementation
All major panel components now use the enhanced scrollbars:

- ✅ **SummaryPanel**: `scrollbar-dark` for panel content (auto-hide in Firefox)
- ✅ **EditorPanel**: `scrollbar-dark` for editing areas (auto-hide in Firefox)
- ✅ **PropertyPanel**: `scrollbar-dark` for properties (auto-hide in Firefox)
- ✅ **ConnectionPropertyPanel**: `scrollbar-dark` for connection details
- ✅ **ExportPanel**: `scrollbar-dark` for export options
- ✅ **ZustandTest**: `scrollbar-thin` for debugging content

**Note**: All components currently use `scrollbar-dark` which respects Firefox's auto-hide behavior. Switch to `scrollbar-stable` for components where scrollbar visibility is critical for UX.

## Visual Design Features

### Color Scheme
- **Track**: Dark gray with transparency `rgba(17, 24, 39, 0.4)`
- **Thumb**: Blue gradient matching brand colors
- **Hover**: Brighter blue with glow effect
- **Active**: Even brighter with reduced shadow

### Interaction Design
- **Smooth Transitions**: 0.2s-0.3s ease transitions
- **Progressive Enhancement**: Gradual color/shadow changes
- **Visual Feedback**: Clear hover and active states
- **Accessibility**: Sufficient contrast and size for interaction

## Performance Considerations

### CSS Optimizations
- **GPU Acceleration**: Uses transforms and opacity where possible
- **Minimal Repaints**: Hover effects use efficient properties
- **Smooth Scrolling**: Hardware-accelerated scroll behavior

### Memory Efficiency
- **Shared Styles**: Common scrollbar styles shared across components
- **Minimal DOM Impact**: Uses pseudo-elements efficiently
- **Optimized Selectors**: Simple, fast CSS selectors

## Future Enhancements

### Planned Features
- **Theme Variants**: Light mode scrollbar styling
- **Animation Options**: Smooth scroll animations
- **Accessibility**: Enhanced keyboard navigation
- **Custom Widths**: Component-specific scrollbar widths

### Browser Evolution
- **CSS Scrollbars Module**: Future standard support
- **Container Queries**: Responsive scrollbar sizing
- **View Transitions**: Smooth scrollbar transitions

---

**Result**: Professional, cohesive scrollbars that enhance the dark theme while maintaining excellent cross-browser compatibility and user experience! 🎨
