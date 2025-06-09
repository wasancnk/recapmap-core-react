import React from 'react'

/**
 * TailwindTest Component - Tests our 8-node design system
 * This component will be removed after verification
 */
export const TailwindTest: React.FC = () => {
  return (
    <div className="min-h-screen bg-background-primary p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-text-primary mb-2">
            RecapMap Design System Test
          </h1>
          <p className="text-text-secondary">
            Testing 8-Node Color Palette & Component Styles
          </p>
        </div>

        {/* Node Color Palette Test */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-text-primary mb-6">
            8-Node Color Palette
          </h2>
          <div className="grid grid-cols-4 gap-6">            {/* Use Case Node */}
            <div className="node-base node-usecase">
              <div className="text-sm font-semibold mb-2">USE CASE</div>
              <div className="text-xs">Dark Green Theme</div>
              <div className="text-xs opacity-75">#4D7C0F</div>
            </div>

            {/* Screen Node */}
            <div className="node-base node-screen">
              <div className="text-sm font-semibold mb-2">SCREEN</div>
              <div className="text-xs">Green Theme</div>
              <div className="text-xs opacity-75">#10B981</div>
            </div>

            {/* User Node */}
            <div className="node-base node-user">
              <div className="text-sm font-semibold mb-2">USER</div>
              <div className="text-xs">Orange Theme</div>
              <div className="text-xs opacity-75">#F59E0B</div>
            </div>

            {/* Process Node */}
            <div className="node-base node-process">
              <div className="text-sm font-semibold mb-2">PROCESS</div>
              <div className="text-xs">Purple Theme</div>
              <div className="text-xs opacity-75">#8B5CF6</div>
            </div>

            {/* Storage Node */}
            <div className="node-base node-storage">
              <div className="text-sm font-semibold mb-2">STORAGE</div>
              <div className="text-xs">Yellow Theme</div>
              <div className="text-xs opacity-75">#EAB308</div>
            </div>

            {/* Controller Node */}
            <div className="node-base node-controller">
              <div className="text-sm font-semibold mb-2">CONTROLLER</div>
              <div className="text-xs">Red Theme</div>
              <div className="text-xs opacity-75">#EF4444</div>
            </div>

            {/* Error Node */}
            <div className="node-base node-error">
              <div className="text-sm font-semibold mb-2">ERROR</div>
              <div className="text-xs">Gray Theme</div>
              <div className="text-xs opacity-75">#6B7280</div>
            </div>

            {/* Empty slot for symmetry */}
            <div className="flex items-center justify-center bg-surface-secondary rounded-node border-2 border-surface-border">
              <span className="text-text-muted text-sm">Base Node Structure</span>
            </div>
          </div>
        </div>

        {/* Panel System Test */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-text-primary mb-6">
            Panel System
          </h2>
          <div className="grid grid-cols-2 gap-6">
            {/* Standard Panel */}
            <div className="panel-base">
              <h3 className="text-panel-title text-text-primary mb-4">Standard Panel</h3>
              <p className="text-panel-content text-text-secondary mb-4">
                This demonstrates the base panel styling with proper shadows and borders.
              </p>
              <div className="flex gap-2">
                <button className="btn-primary">Primary Action</button>
                <button className="btn-secondary">Secondary</button>
              </div>
            </div>

            {/* Elevated Panel */}
            <div className="panel-base panel-elevated">
              <h3 className="text-panel-title text-text-primary mb-4">Elevated Panel</h3>
              <p className="text-panel-content text-text-secondary mb-4">
                This panel has enhanced shadow for higher prominence in the z-order.
              </p>
              <input 
                className="input-base w-full mb-3" 
                placeholder="Test input field..."
              />
              <div className="flex gap-2">
                <button className="btn-primary flex-1">Save</button>
                <button className="btn-secondary">Cancel</button>
              </div>
            </div>
          </div>
        </div>

        {/* Background Test */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-text-primary mb-6">
            Canvas Background Pattern
          </h2>
          <div className="h-64 bg-background-tertiary canvas-background rounded-lg border border-surface-border">
            <div className="h-full flex items-center justify-center">
              <div className="bg-surface-secondary p-6 rounded-panel shadow-panel">
                <span className="text-text-primary">Canvas with Grid Pattern</span>
              </div>
            </div>
          </div>
        </div>

        {/* Color System Reference */}
        <div className="grid grid-cols-3 gap-6 text-sm">
          <div>
            <h3 className="font-semibold text-text-primary mb-3">Background Colors</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-background-primary border border-surface-border"></div>
                <span className="text-text-secondary">Primary (#0f0f23)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-background-secondary border border-surface-border"></div>
                <span className="text-text-secondary">Secondary (#1a1a2e)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-background-tertiary border border-surface-border"></div>
                <span className="text-text-secondary">Tertiary (#16213e)</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-text-primary mb-3">Surface Colors</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-surface-primary border border-surface-border"></div>
                <span className="text-text-secondary">Primary (#16213e)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-surface-secondary border border-surface-border"></div>
                <span className="text-text-secondary">Secondary (#1f2937)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-surface-elevated border border-surface-border"></div>
                <span className="text-text-secondary">Elevated (#374151)</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-text-primary mb-3">Text Colors</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-text-primary border border-surface-border"></div>
                <span className="text-text-secondary">Primary (#f9fafb)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-text-secondary border border-surface-border"></div>
                <span className="text-text-secondary">Secondary (#d1d5db)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-text-muted border border-surface-border"></div>
                <span className="text-text-secondary">Muted (#9ca3af)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
