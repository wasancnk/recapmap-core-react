/**
 * PropertyPanelManager.tsx - Manages property panel state and rendering
 * Integrates with UI store panel system for consistent UI behavior
 */

import React from 'react'
import { useUIStore } from '../stores'
import { PropertyPanel } from './PropertyPanel'

export const PropertyPanelManager: React.FC = () => {
  const { panels, closePanel } = useUIStore()
  
  // Find the active property panel
  const propertyPanel = panels.find(panel => panel.type === 'node-properties' && panel.isOpen)
  
  if (!propertyPanel) {
    return null
  }

  const nodeId = propertyPanel.data?.nodeId as string || null
  return (
    <PropertyPanel
      nodeId={nodeId}
      isOpen={propertyPanel.isOpen}
      position={propertyPanel.position}
      onClose={() => closePanel(propertyPanel.id)}
    />
  )
}
