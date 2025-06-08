/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // 8-Node System Color Palette
      colors: {
        // Node Type Colors
        nodes: {
          usecase: {
            50: '#eff6ff',
            100: '#dbeafe', 
            500: '#3b82f6',  // Primary Blue
            600: '#2563eb',
            700: '#1d4ed8',
            900: '#1e3a8a'
          },
          screen: {
            50: '#ecfdf5',
            100: '#d1fae5',
            500: '#10b981',  // Primary Green
            600: '#059669',
            700: '#047857',
            900: '#064e3b'
          },
          user: {
            50: '#fefce8',
            100: '#fef3c7',
            500: '#f59e0b',  // Primary Orange
            600: '#d97706',
            700: '#b45309',
            900: '#78350f'
          },
          process: {
            50: '#f5f3ff',
            100: '#ede9fe',
            500: '#8b5cf6',  // Primary Purple
            600: '#7c3aed',
            700: '#6d28d9',
            900: '#4c1d95'
          },
          storage: {
            50: '#fefce8',
            100: '#fef3c7',
            500: '#eab308',  // Primary Yellow
            600: '#ca8a04',
            700: '#a16207',
            900: '#713f12'
          },
          controller: {
            50: '#fef2f2',
            100: '#fee2e2',
            500: '#ef4444',  // Primary Red
            600: '#dc2626',
            700: '#b91c1c',
            900: '#7f1d1d'
          },
          error: {
            50: '#f8fafc',
            100: '#f1f5f9',
            500: '#6b7280',  // Primary Gray
            600: '#4b5563',
            700: '#374151',
            900: '#111827'
          }
        },
        
        // UI Theme Colors
        background: {
          primary: '#0f0f23',     // Deep navy background
          secondary: '#1a1a2e',   // Secondary panels
          tertiary: '#16213e',    // Canvas background
          modal: 'rgba(15, 15, 35, 0.95)' // Modal overlay
        },
        
        surface: {
          primary: '#16213e',     // Card backgrounds
          secondary: '#1f2937',   // Panel backgrounds
          elevated: '#374151',    // Raised surfaces
          border: '#4b5563'       // Border colors
        },
        
        text: {
          primary: '#f9fafb',     // Main text
          secondary: '#d1d5db',   // Secondary text
          muted: '#9ca3af',       // Muted text
          accent: '#60a5fa'       // Accent text
        },
        
        accent: {
          primary: '#3b82f6',     // Primary actions
          secondary: '#10b981',   // Success states
          warning: '#f59e0b',     // Warning states
          danger: '#ef4444'       // Error states
        }
      },
      
      // Custom Shadows for Node Elevation
      boxShadow: {
        'node': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.1)',
        'node-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.1)',
        'node-selected': '0 0 0 2px rgba(59, 130, 246, 0.5), 0 10px 15px -3px rgba(0, 0, 0, 0.4)',
        'panel': '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
        'panel-elevated': '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      },
      
      // Animation Configurations
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-subtle': 'pulseSubtle 2s infinite'
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' }
        }
      },
      
      // Typography Scale
      fontSize: {
        'node-title': ['14px', { lineHeight: '20px', fontWeight: '600' }],
        'node-content': ['12px', { lineHeight: '16px', fontWeight: '400' }],
        'panel-title': ['16px', { lineHeight: '24px', fontWeight: '600' }],
        'panel-content': ['14px', { lineHeight: '20px', fontWeight: '400' }]
      },
      
      // Spacing for Node System
      spacing: {
        'node-width': '160px',  // Standard node width
        'node-height': '120px', // Standard node height
        'node-padding': '12px', // Internal node padding
        'node-gap': '24px',     // Gap between nodes
        'panel-padding': '16px' // Panel internal padding
      },
      
      // Border Radius System
      borderRadius: {
        'node': '8px',
        'panel': '12px',
        'button': '6px'
      },
        // Custom Scrollbar Utilities
      utilities: {
        '.scrollbar-none': {
          'scrollbar-width': 'none',
          '-ms-overflow-style': 'none',
        },
        '.scrollbar-none::-webkit-scrollbar': {
          'display': 'none',
        },
        '.scrollbar-thin': {
          'scrollbar-width': 'thin',
          'scrollbar-color': 'rgba(75, 85, 99, 0.6) transparent',
        },
        '.scrollbar-dark': {
          'scrollbar-width': 'auto',
          'scrollbar-color': 'rgba(59, 130, 246, 0.5) rgba(31, 41, 55, 0.2)',
        },
        '.scrollbar-stable': {
          'scrollbar-width': 'thin',
          'scrollbar-color': 'rgba(59, 130, 246, 0.7) rgba(31, 41, 55, 0.3)',
          'overflow': 'scroll',
        },
      }
    },
  },
  plugins: [],
}
