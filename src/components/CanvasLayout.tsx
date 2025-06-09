import { useEffect } from 'react';
import { ReactFlowProvider, useReactFlow } from '@xyflow/react';
import { Canvas } from './Canvas';
import { Toolbar } from './Toolbar';
import { PropertyPanelManager } from './PropertyPanelManager';
import { ExportPanelManager } from './ExportPanelManager';
import { PresentationPanelManager } from './PresentationPanelManager';
import { PresentationControlBar } from './PresentationControlBar';
import { useUIStore } from '../stores/uiStore';

// Status Bar Component with Canvas Controls
const StatusBar: React.FC = () => {
  const { ui, toggleMiniMap } = useUIStore();
  const reactFlowInstance = useReactFlow();

  const handleZoomIn = () => {
    reactFlowInstance.zoomIn();
  };
  const handleZoomOut = () => {
    reactFlowInstance.zoomOut();
  };

  const handleFitView = () => {
    reactFlowInstance.fitView({ padding: 0.1, includeHiddenNodes: false });
  };

  return (
    <div id="mini-bottom-bar" className="mini-bar">
      <div className="bg-black/20 backdrop-blur-sm rounded-lg shadow-md overflow-hidden">
        <div className="flex items-center justify-center gap-0 px-2 py-1">
          {/* Mini-map Toggle Button */}
          <button
            onClick={toggleMiniMap}
            className={`
              p-1.5 rounded hover:bg-white/10 transition-colors text-white/70 hover:text-white
              ${ui.isMiniMapVisible ? 'text-white' : 'text-white/50'}
            `}
            title={`${ui.isMiniMapVisible ? 'Hide' : 'Show'} Mini-map`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
              <rect x="7" y="7" width="4" height="4" fill="currentColor"/>
              <rect x="13" y="13" width="4" height="4" fill="currentColor"/>
            </svg>
          </button>
            {/* Zoom In Button */}
          <button
            onClick={handleZoomIn}
            className="p-1.5 rounded hover:bg-white/10 transition-colors text-white/70 hover:text-white"
            title="Zoom In"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 5v14m7-7H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          
          {/* Fit View Button */}
          <button
            onClick={handleFitView}
            className="p-1.5 rounded hover:bg-white/10 transition-colors text-white/70 hover:text-white"
            title="Fit All Nodes"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
            </svg>
          </button>
          
          {/* Zoom Out Button */}
          <button
            onClick={handleZoomOut}
            className="p-1.5 rounded hover:bg-white/10 transition-colors text-white/70 hover:text-white"
            title="Zoom Out"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export const CanvasLayout: React.FC = () => {
  const { ui } = useUIStore();
  
  // Apply no-scroll class to body when canvas is active
  useEffect(() => {
    document.body.classList.add('canvas-no-scroll');
    
    // Cleanup when component unmounts (user navigates away)
    return () => {
      document.body.classList.remove('canvas-no-scroll');
    };
  }, []);

  return (
    <ReactFlowProvider>
      <div className="w-full h-screen bg-background-tertiary relative overflow-hidden">
        {/* Main Canvas */}
        <Canvas />
        
        {/* UI Elements - Hidden during presentation mode */}
        {!ui.isPresentationMode && (
          <>
            {/* Floating Toolbar */}
            <Toolbar />
            
            {/* Property Panel Manager */}
            <PropertyPanelManager />
            
            {/* Export Panel Manager */}
            <ExportPanelManager />
            
            {/* Status Bar */}
            <StatusBar />
          </>
        )}
          {/* Presentation Panel Manager - Only shown during presentation mode */}
        {ui.isPresentationMode && <PresentationPanelManager />}
        
        {/* Presentation Control Bar - Bottom center controls during presentation mode */}
        <PresentationControlBar />
      </div>
    </ReactFlowProvider>
  );
};
