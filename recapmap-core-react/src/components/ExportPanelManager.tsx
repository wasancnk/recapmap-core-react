/**
 * ExportPanelManager.tsx - Manages export panel state and rendering
 * Integrates with UI store panel system for export functionality
 */

import React from 'react'
import { useUIStore } from '../stores'
import { ExportPanel } from './ExportPanel'

export const ExportPanelManager: React.FC = () => {
  const { panels, closePanel } = useUIStore()
  
  // Find the active export panel
  const exportPanel = panels.find(panel => panel.type === 'export' && panel.isOpen)
  
  if (!exportPanel) {
    return null
  }

  return (
    <ExportPanel
      isOpen={exportPanel.isOpen}
      onClose={() => closePanel(exportPanel.id)}
    />
  )
}
