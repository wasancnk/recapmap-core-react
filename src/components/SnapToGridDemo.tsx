/**
 * SnapToGridDemo Component
 * Interactive demonstration of the snap-to-grid functionality
 */

import React from 'react'
import { useUIStore } from '../stores/uiStore'

export const SnapToGridDemo: React.FC = () => {
  const { ui, toggleSnapToGrid, toggleGrid, setGridSize } = useUIStore()

  return (
    <div className="bg-surface-primary border border-surface-border rounded-lg p-6 space-y-4">
      <div className="text-center">
        <h3 className="text-xl font-bold text-text-primary mb-2">
          ⚡ Snap-to-Grid Demo
        </h3>
        <p className="text-text-secondary text-sm">
          Interactive controls for grid alignment and snapping behavior
        </p>
      </div>

      {/* Current Status */}
      <div className="bg-surface-secondary rounded-lg p-4">
        <h4 className="font-semibold text-text-primary mb-3">Current Status</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-text-secondary">Snap to Grid:</span>
            <span className={`font-medium ${ui.snapToGrid ? 'text-green-400' : 'text-red-400'}`}>
              {ui.snapToGrid ? '✓ Enabled' : '✗ Disabled'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-text-secondary">Grid Visible:</span>
            <span className={`font-medium ${ui.isGridVisible ? 'text-green-400' : 'text-red-400'}`}>
              {ui.isGridVisible ? '✓ Visible' : '✗ Hidden'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-text-secondary">Grid Size:</span>
            <span className="font-medium text-accent-primary">{ui.gridSize}px</span>
          </div>
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="space-y-4">
        <h4 className="font-semibold text-text-primary">Interactive Controls</h4>
        
        {/* Toggle Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            onClick={toggleSnapToGrid}
            className={`
              px-4 py-3 rounded-lg font-medium transition-all duration-200
              flex items-center justify-center gap-2
              ${ui.snapToGrid 
                ? 'bg-accent-primary text-white shadow-lg hover:bg-accent-primary/90' 
                : 'bg-surface-tertiary text-text-secondary hover:bg-surface-border'
              }
            `}
          >
            <span className="text-lg">{ui.snapToGrid ? '⚡' : '○'}</span>
            <span>Snap to Grid</span>
            <span className="text-xs opacity-70">(Ctrl+G)</span>
          </button>

          <button
            onClick={toggleGrid}
            className={`
              px-4 py-3 rounded-lg font-medium transition-all duration-200
              flex items-center justify-center gap-2
              ${ui.isGridVisible 
                ? 'bg-accent-primary text-white shadow-lg hover:bg-accent-primary/90' 
                : 'bg-surface-tertiary text-text-secondary hover:bg-surface-border'
              }
            `}
          >
            <span className="text-lg">{ui.isGridVisible ? '✓' : '○'}</span>
            <span>Show Grid</span>
            <span className="text-xs opacity-70">(Ctrl+Shift+G)</span>
          </button>
        </div>

        {/* Grid Size Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-text-primary">
              Grid Size: {ui.gridSize}px
            </label>
            <span className="text-xs text-text-secondary">
              Range: 10px - 100px
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            step="5"
            value={ui.gridSize}
            onChange={(e) => setGridSize(Number(e.target.value))}
            className="w-full h-2 bg-surface-tertiary rounded-lg appearance-none cursor-pointer
                     slider:appearance-none slider:h-2 slider:rounded-lg slider:bg-accent-primary"
          />
          <div className="flex justify-between text-xs text-text-secondary">
            <span>Fine (10px)</span>
            <span>Medium (20px)</span>
            <span>Coarse (50px)</span>
            <span>Extra Coarse (100px)</span>
          </div>
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="bg-surface-secondary rounded-lg p-4">
        <h4 className="font-semibold text-text-primary mb-3">How to Use</h4>
        <div className="space-y-2 text-sm text-text-secondary">
          <div className="flex items-start gap-2">
            <span className="text-accent-primary font-bold">1.</span>
            <span>Enable "Snap to Grid" to automatically align nodes to grid intersections</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-accent-primary font-bold">2.</span>
            <span>Toggle "Show Grid" to display visual grid dots on the canvas</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-accent-primary font-bold">3.</span>
            <span>Adjust grid size to change the spacing between snap points</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-accent-primary font-bold">4.</span>
            <span>Drag nodes on the canvas - they will snap to the nearest grid intersection</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-accent-primary font-bold">5.</span>
            <span>Use keyboard shortcuts: <code className="bg-surface-tertiary px-1 rounded">Ctrl+G</code> for snap, <code className="bg-surface-tertiary px-1 rounded">Ctrl+Shift+G</code> for grid</span>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-accent-primary/10 border border-accent-primary/20 rounded-lg p-4">
        <h4 className="font-semibold text-accent-primary mb-3">✨ Benefits</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-text-secondary">
            <span className="text-green-400">✓</span>
            <span>Precise node alignment</span>
          </div>
          <div className="flex items-center gap-2 text-text-secondary">
            <span className="text-green-400">✓</span>
            <span>Consistent spacing</span>
          </div>
          <div className="flex items-center gap-2 text-text-secondary">
            <span className="text-green-400">✓</span>
            <span>Professional layouts</span>
          </div>
          <div className="flex items-center gap-2 text-text-secondary">
            <span className="text-green-400">✓</span>
            <span>Faster positioning</span>
          </div>
          <div className="flex items-center gap-2 text-text-secondary">
            <span className="text-green-400">✓</span>
            <span>Visual organization</span>
          </div>
          <div className="flex items-center gap-2 text-text-secondary">
            <span className="text-green-400">✓</span>
            <span>Reduced clutter</span>
          </div>
        </div>
      </div>
    </div>
  )
}
