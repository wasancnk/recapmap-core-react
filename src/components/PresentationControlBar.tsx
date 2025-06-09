/**
 * PresentationControlBar.tsx - Bottom center control bar for presentation mode
 * Provides exit presentation functionality and placeholder navigation buttons
 */

import React from 'react';
import { useUIStore } from '../stores/uiStore';

export const PresentationControlBar: React.FC = () => {
  const { ui, togglePresentationMode } = useUIStore();

  // Only show during presentation mode
  if (!ui.isPresentationMode) {
    return null;
  }

  const handleExitPresentation = () => {
    togglePresentationMode();
  };

  const handlePreviousPage = () => {
    // Placeholder - to be implemented in future
    console.log('Previous page navigation - to be implemented');
  };

  const handleNextPage = () => {
    // Placeholder - to be implemented in future
    console.log('Next page navigation - to be implemented');
  };

  return (
    <div className="presentation-control-bar">
      <div className="presentation-control-bar-content">
        {/* Previous Page Button (Placeholder) */}
        <button
          onClick={handlePreviousPage}
          className="presentation-control-btn presentation-control-btn-nav"
          title="Previous page (coming soon)"
          disabled
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
          <span className="presentation-control-btn-text">Previous</span>
        </button>

        {/* Exit Presentation Button (Functional) */}
        <button
          onClick={handleExitPresentation}
          className="presentation-control-btn presentation-control-btn-exit"
          title="Exit presentation mode"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
          <span className="presentation-control-btn-text">Exit</span>
        </button>

        {/* Next Page Button (Placeholder) */}
        <button
          onClick={handleNextPage}
          className="presentation-control-btn presentation-control-btn-nav"
          title="Next page (coming soon)"
          disabled
        >
          <span className="presentation-control-btn-text">Next</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>
    </div>
  );
};
