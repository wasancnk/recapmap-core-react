/**
 * PresentationPanelManager.tsx - Manages presentation panel state and rendering
 * Integrates with UI store panel system for presentation functionality
 */

import React from 'react'
import { useUIStore } from '../stores'
import { PresentationPanel } from './panels/PresentationPanel'

export const PresentationPanelManager: React.FC = () => {
  const { panels, closePanel } = useUIStore()
  
  // Find the active presentation panel
  const presentationPanel = panels.find(panel => panel.type === 'view' && panel.isOpen)
  
  if (!presentationPanel) {
    return null
  }

  return (
    <div 
      className="fixed bg-surface-primary border border-surface-border rounded-lg shadow-lg z-50 w-80 flex flex-col"
      style={{ 
        left: presentationPanel.position.x, 
        top: presentationPanel.position.y,
        height: '500px',
        maxHeight: '500px'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-surface-border bg-surface-secondary rounded-t-lg">
        <h3 className="text-sm font-semibold text-text-primary">Presentation</h3>
        <button
          onClick={() => closePanel(presentationPanel.id)}
          className="p-1 hover:bg-surface-tertiary rounded transition-colors text-text-secondary hover:text-text-primary"
          aria-label="Close presentation panel"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <PresentationPanel />
      </div>
    </div>
  )
}
