import React, { useState } from 'react';

/**
 * Demo component to showcase smart scroll functionality
 * This component creates test panels with scrollable content to demonstrate
 * how scroll events are intercepted and redirected to panel content
 */
const SmartScrollDemo: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const generateLongContent = (prefix: string) => {
    return Array.from({ length: 50 }, (_, i) => `${prefix} Line ${i + 1}: This is scrollable content to test the smart scroll functionality.`);
  };

  const panelContent = generateLongContent("Panel");
  const sidebarContent = generateLongContent("Sidebar");

  return (
    <div className="fixed top-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="btn-primary mb-4 px-4 py-2 rounded shadow-lg"
      >
        {isVisible ? 'Hide' : 'Show'} Smart Scroll Demo
      </button>

      {/* Demo Panels */}
      {isVisible && (
        <div className="flex gap-4">
          {/* Test Panel 1 - Using panel-base class */}
          <div className="panel-base w-80 h-96 overflow-y-auto scrollbar-dark">
            <h3 className="font-bold text-lg mb-4 sticky top-0 bg-surface-secondary z-10 pb-2">
              Test Panel 1
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-text-secondary mb-4">
                This panel uses the <code className="bg-surface-elevated px-1 rounded">panel-base</code> class.
                Try scrolling while your mouse is over this panel - it should scroll the panel content
                instead of panning the canvas.
              </p>
              {panelContent.map((line, index) => (
                <div
                  key={index}
                  className={`p-2 rounded text-sm ${
                    index % 2 === 0 ? 'bg-surface-elevated' : 'bg-surface-primary'
                  }`}
                >
                  {line}
                </div>
              ))}
            </div>
          </div>

          {/* Test Panel 2 - Using data-testid attribute */}
          <div 
            data-testid="demo-panel-2"
            className="bg-surface-secondary border border-surface-border rounded-panel shadow-panel p-4 w-80 h-96 overflow-y-auto scrollbar-stable"
          >
            <h3 className="font-bold text-lg mb-4 sticky top-0 bg-surface-secondary z-10 pb-2">
              Test Panel 2
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-text-secondary mb-4">
                This panel uses <code className="bg-surface-elevated px-1 rounded">data-testid="demo-panel-2"</code>.
                The smart scroll hook detects elements with data-testid containing "panel".
              </p>
              {sidebarContent.map((line, index) => (
                <div
                  key={index}
                  className={`p-2 rounded text-sm ${
                    index % 3 === 0 
                      ? 'bg-accent-primary/10 border-l-2 border-accent-primary' 
                      : index % 3 === 1
                      ? 'bg-surface-elevated'
                      : 'bg-surface-primary'
                  }`}
                >
                  {line}
                </div>
              ))}
            </div>
          </div>

          {/* Test Panel 3 - Nested scrollable content */}
          <div className="panel-base w-80 h-96">
            <h3 className="font-bold text-lg mb-4">
              Test Panel 3 - Nested
            </h3>
            <div className="space-y-4">
              <p className="text-sm text-text-secondary">
                This panel contains nested scrollable areas to test complex scenarios.
              </p>
              
              {/* Nested scrollable area */}
              <div className="bg-surface-elevated rounded p-3 h-32 overflow-y-auto scrollbar-thin">
                <h4 className="font-medium mb-2">Nested Scrollable Area</h4>
                {Array.from({ length: 20 }, (_, i) => (
                  <div key={i} className="text-xs py-1">
                    Nested content line {i + 1}
                  </div>
                ))}
              </div>

              {/* More content */}
              <div className="space-y-2 overflow-y-auto flex-1">
                {Array.from({ length: 30 }, (_, i) => (
                  <div key={i} className="p-2 bg-surface-primary rounded text-sm">
                    Panel 3 content line {i + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Instructions Panel */}
      {isVisible && (
        <div className="mt-4 panel-base w-full max-w-4xl">
          <h3 className="font-bold text-lg mb-3">Smart Scroll Demo Instructions</h3>
          <div className="space-y-3 text-sm">
            <div className="bg-accent-primary/10 border-l-4 border-accent-primary p-3 rounded">
              <strong>How to Test:</strong>
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>Move your mouse over any of the test panels above</li>
                <li>Use your mouse wheel to scroll</li>
                <li>Notice that the panel content scrolls instead of the canvas panning</li>
                <li>Move your mouse outside the panels to the canvas area</li>
                <li>Use your mouse wheel again - now the canvas should pan normally</li>
              </ol>
            </div>
            
            <div className="bg-green-500/10 border-l-4 border-green-500 p-3 rounded">
              <strong>What's Happening:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>The smart scroll hook detects when your mouse is over scrollable panels</li>
                <li>It intercepts wheel events and redirects them to the panel's scroll behavior</li>
                <li>Canvas panning is temporarily disabled while scrolling panel content</li>
                <li>When panels reach their scroll limits, canvas panning resumes</li>
              </ul>
            </div>

            <div className="bg-blue-500/10 border-l-4 border-blue-500 p-3 rounded">
              <strong>Detected Panel Selectors:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><code className="bg-surface-elevated px-1 rounded">.panel-base</code> - Standard panel class</li>
                <li><code className="bg-surface-elevated px-1 rounded">[data-testid*="panel"]</code> - Test ID containing "panel"</li>
                <li><code className="bg-surface-elevated px-1 rounded">.scrollbar-dark</code> - Dark scrollbar styling</li>
                <li><code className="bg-surface-elevated px-1 rounded">.scrollbar-stable</code> - Stable scrollbar styling</li>
                <li><code className="bg-surface-elevated px-1 rounded">.overflow-y-auto</code> - Auto overflow elements</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartScrollDemo;
