# CSS Architecture Best Practices for RecapMap

## Overview
This guide outlines CSS architecture patterns learned from RecapMap development to prevent common styling issues and maintain scalable, maintainable stylesheets.

## Core Principles

### 1. Component-Specific Classes Over Global Overrides
**❌ Avoid Global Overrides:**
```css
/* BAD - Global override affects everything */
html, body {
  overflow: hidden; /* Affects all pages */
}
```

**✅ Use Component-Specific Classes:**
```css
/* GOOD - Targeted, specific styling */
.canvas-container {
  overflow: hidden; /* Only affects canvas */
}

.content-page {
  overflow: auto; /* Only affects content pages */
}

.documentation-layout {
  min-height: 100vh; /* Flexible for long content */
}
```

### 2. Layout Strategy Hierarchy
```css
/* Level 1: Root Layout */
#root {
  min-height: 100vh; /* Flexible height */
  width: 100vw;      /* Full width */
}

/* Level 2: Page Layouts */
.canvas-layout {
  height: 100vh;     /* Fixed for canvas */
  overflow: hidden;  /* No scroll */
}

.content-layout {
  min-height: 100vh; /* Flexible for content */
  overflow: auto;    /* Allow scroll */
}

/* Level 3: Component Containers */
.panel-base {
  /* Component-specific styling */
}
```

## TailwindCSS Integration

### Custom Classes in @layer components
```css
@layer components {
  .canvas-no-scroll {
    @apply h-screen overflow-hidden;
  }
  
  .content-scrollable {
    @apply min-h-screen overflow-auto;
  }
  
  .panel-base {
    @apply bg-surface-primary border border-surface-border rounded-lg p-6;
  }
}
```

### Dynamic Class Application
```tsx
// React component with conditional styling
export const Layout: React.FC<{ isCanvas: boolean }> = ({ isCanvas }) => {
  useEffect(() => {
    if (isCanvas) {
      document.body.classList.add('canvas-no-scroll');
    } else {
      document.body.classList.remove('canvas-no-scroll');
    }
    
    return () => {
      document.body.classList.remove('canvas-no-scroll');
    };
  }, [isCanvas]);
  
  return (
    <div className={isCanvas ? 'canvas-layout' : 'content-layout'}>
      {/* Content */}
    </div>
  );
};
```

## Responsive Design Patterns

### Mobile-First Approach
```css
/* Base styles (mobile) */
.component {
  @apply p-4 text-sm;
}

/* Tablet and up */
@media (min-width: 768px) {
  .component {
    @apply p-6 text-base;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .component {
    @apply p-8 text-lg;
  }
}
```

### Container Queries (Future)
```css
/* When supported */
.card {
  container-type: inline-size;
}

@container (min-width: 300px) {
  .card-content {
    @apply grid-cols-2;
  }
}
```

## Dark Theme Architecture

### CSS Custom Properties Strategy
```css
:root {
  /* Light theme (default) */
  --bg-primary: #ffffff;
  --text-primary: #000000;
}

[data-theme="dark"] {
  /* Dark theme overrides */
  --bg-primary: #0f0f23;
  --text-primary: #f9fafb;
}

.themed-component {
  background-color: var(--bg-primary);
  color: var(--text-primary);
}
```

### TailwindCSS Dark Mode
```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class', // or 'media'
  theme: {
    extend: {
      colors: {
        background: {
          primary: '#0f0f23',
          secondary: '#1a1a2e',
        }
      }
    }
  }
}
```

## Performance Considerations

### CSS Optimization
```css
/* Use transform for animations (GPU acceleration) */
.animated-element {
  transform: translateX(0);
  transition: transform 0.3s ease;
}

.animated-element:hover {
  transform: translateX(10px);
}

/* Avoid expensive properties for animations */
.avoid {
  transition: left 0.3s ease; /* ❌ Causes layout thrashing */
}
```

### Critical CSS
```html
<!-- Inline critical styles -->
<style>
  .above-fold { /* Critical styles only */ }
</style>

<!-- Load non-critical styles async -->
<link rel="preload" href="styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
```

## Common Pitfalls & Solutions

### 1. Z-Index Management
```css
/* Use a systematic z-index scale */
:root {
  --z-base: 1;
  --z-panel: 10;
  --z-modal: 100;
  --z-toast: 1000;
}

.modal {
  z-index: var(--z-modal);
}
```

### 2. Specificity Management
```css
/* Keep specificity low and predictable */
.component { /* Specificity: 010 */ }
.component--variant { /* Specificity: 020 */ }
.component.is-active { /* Specificity: 020 */ }

/* Avoid deep nesting */
.avoid .deep .nesting .selectors { /* ❌ High specificity */ }
```

### 3. CSS Custom Properties Fallbacks
```css
.component {
  color: var(--text-primary, #000000); /* Fallback for IE */
  background: var(--bg-primary, #ffffff);
}
```

## Testing & Validation

### Browser Testing Checklist
- [ ] Chrome/Chromium latest
- [ ] Firefox latest  
- [ ] Safari latest (if targeting Mac)
- [ ] Edge latest
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

### CSS Validation Tools
```bash
# Stylelint for CSS quality
npm install --save-dev stylelint stylelint-config-standard

# PostCSS for browser compatibility
npm install --save-dev autoprefixer

# CSS purging for production
npm install --save-dev @fullhuman/postcss-purgecss
```

### Accessibility Testing
```css
/* High contrast mode support */
@media (prefers-contrast: high) {
  .component {
    border: 2px solid currentColor;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## File Organization

### Recommended Structure
```
src/styles/
├── base/           # Reset, typography, global styles
├── components/     # Component-specific styles
├── utilities/      # Utility classes
├── themes/         # Theme variations
└── main.css        # Main import file
```

### Import Order
```css
/* main.css */
@import 'base/reset.css';
@import 'base/typography.css';
@import 'components/buttons.css';
@import 'components/panels.css';
@import 'utilities/spacing.css';
@import 'themes/dark.css';
```

## Migration Strategies

### Legacy CSS to TailwindCSS
```css
/* Before: Custom CSS */
.button {
  background-color: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
}

/* After: TailwindCSS */
.btn-primary {
  @apply bg-blue-500 text-white px-4 py-2 rounded-md;
}
```

### CSS-in-JS to TailwindCSS
```tsx
// Before: Styled Components
const Button = styled.button`
  background-color: ${props => props.theme.primary};
  color: white;
  padding: 0.5rem 1rem;
`;

// After: TailwindCSS
const Button = ({ children }: { children: React.ReactNode }) => (
  <button className="bg-primary text-white px-4 py-2">
    {children}
  </button>
);
```

---

*These practices ensure scalable, maintainable CSS architecture that grows with your application while preventing common styling conflicts and performance issues.*
