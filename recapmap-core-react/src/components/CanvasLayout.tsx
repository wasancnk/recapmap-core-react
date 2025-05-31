import React, { useEffect } from 'react';
import { Canvas } from './Canvas';
import { Toolbar } from './Toolbar';

export const CanvasLayout: React.FC = () => {
  // Apply no-scroll class to body when canvas is active
  useEffect(() => {
    document.body.classList.add('canvas-no-scroll');
    
    // Cleanup when component unmounts (user navigates away)
    return () => {
      document.body.classList.remove('canvas-no-scroll');
    };
  }, []);

  return (
    <div className="w-full h-screen bg-background-tertiary relative overflow-hidden">
      {/* Main Canvas */}
      <Canvas />
      
      {/* Floating Toolbar */}
      <Toolbar />
      
      {/* Status Bar */}
      <div className="absolute bottom-4 right-4 z-panel-base">
        <div className="bg-surface-primary border border-surface-border rounded-lg shadow-lg px-3 py-2">
          <div className="text-text-secondary text-xs flex items-center gap-4">
            <span>🎨 RecapMap Canvas</span>
            <span>Press Space + Drag to pan</span>
            <span>Mouse wheel to zoom</span>
          </div>
        </div>
      </div>
    </div>
  );
};
