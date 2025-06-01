import React from 'react'
import { useNodeStore, useUIStore, useProjectStore } from '../stores'
import type { NodeType } from '../types'

/**
 * ZustandTest Component - Tests our state management system
 * This component will be removed after verification
 */
export const ZustandTest: React.FC = () => {
  // Access stores
  const {
    nodes,
    // connections,
    // selectedNodeIds,
    addNode,
    selectNode,
    clearSelection,
    addConnection,
    // getSelectedNodes,
  } = useNodeStore()

  const {
    canvas,
    panels,
    ui,
    setTool,
    toggleGrid,
    openPanel,
    closePanel,
    addNotification,
    setZoom,
  } = useUIStore()

  const {
    project,
    markAsModified,
    validateProject,
    lastValidation,
    getProjectSummary,
  } = useProjectStore()

  // Test functions
  const handleAddNode = (type: NodeType) => {
    const position = {
      x: Math.random() * 400,
      y: Math.random() * 300,
    }
    const nodeId = addNode(type, position)
    addNotification({
      type: 'success',
      title: 'Node Created',
      message: `New ${type} node created`,
      duration: 2000,
    })
    return nodeId
  }

  const handleConnectLastTwoNodes = () => {
    if (nodes.length >= 2) {
      const lastTwo = nodes.slice(-2)
      addConnection(lastTwo[0].id, lastTwo[1].id, 'data')
      addNotification({
        type: 'info',
        title: 'Connection Created',
        message: 'Connected last two nodes',
        duration: 2000,
      })
    }
  }

  const handleValidation = async () => {
    await validateProject()
    addNotification({
      type: 'info',
      title: 'Validation Complete',
      message: `Found ${lastValidation?.errors.length || 0} errors and ${lastValidation?.warnings.length || 0} warnings`,
      duration: 3000,
    })
  }

  const summary = getProjectSummary()

  return (
    <div className="min-h-screen bg-background-primary p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-text-primary mb-2">
            Zustand Store Architecture Test
          </h1>
          <p className="text-text-secondary">
            Testing State Management: Nodes, UI, Project
          </p>
        </div>

        {/* Project Summary */}
        <div className="panel-base mb-8">
          <h2 className="text-xl font-semibold text-text-primary mb-4">Project Summary</h2>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-text-muted">Project:</span>
              <div className="text-text-primary font-medium">{project.name}</div>
            </div>
            <div>
              <span className="text-text-muted">Nodes:</span>
              <div className="text-text-primary font-medium">{summary.nodeCount}</div>
            </div>
            <div>
              <span className="text-text-muted">Connections:</span>
              <div className="text-text-primary font-medium">{summary.connectionCount}</div>
            </div>
          </div>
          <div className="mt-4 text-xs text-text-muted">
            Modified: {project.isModified ? 'Yes' : 'No'} | 
            Validation: {summary.validationStatus} |
            Tool: {ui.selectedTool}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Node Management Tests */}
          <div className="panel-base">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Node Management</h3>
            
            {/* Node Creation Buttons */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button 
                className="btn-primary text-sm"
                onClick={() => handleAddNode('usecase')}
              >
                Add Use Case
              </button>
              <button 
                className="btn-primary text-sm"
                onClick={() => handleAddNode('screen')}
              >
                Add Screen
              </button>
              <button 
                className="btn-primary text-sm"
                onClick={() => handleAddNode('user')}
              >
                Add User
              </button>
              <button 
                className="btn-primary text-sm"
                onClick={() => handleAddNode('process')}
              >
                Add Process
              </button>
            </div>

            {/* Connection and Selection */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button 
                className="btn-secondary text-sm"
                onClick={handleConnectLastTwoNodes}
                disabled={nodes.length < 2}
              >
                Connect Last 2
              </button>
              <button 
                className="btn-secondary text-sm"
                onClick={clearSelection}
              >
                Clear Selection
              </button>
            </div>

            {/* Node List */}
            <div className="max-h-48 overflow-y-auto scrollbar-thin">
              <h4 className="text-sm font-medium text-text-primary mb-2">
                Nodes ({nodes.length})
              </h4>
              {nodes.length === 0 ? (
                <p className="text-text-muted text-sm">No nodes created yet</p>
              ) : (
                <div className="space-y-2">
                  {nodes.map((node) => (
                    <div
                      key={node.id}
                      className={`p-2 rounded text-xs cursor-pointer transition-colors ${
                        node.isSelected
                          ? 'bg-accent-primary text-white'
                          : 'bg-surface-elevated text-text-secondary hover:bg-surface-border'
                      }`}
                      onClick={() => selectNode(node.id)}
                    >
                      <div className="font-medium">{node.title}</div>
                      <div className="opacity-75">
                        {node.type} | {node.connections.inputs.length}→{node.connections.outputs.length}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* UI and Panel Tests */}
          <div className="panel-base">
            <h3 className="text-lg font-semibold text-text-primary mb-4">UI & Panel Management</h3>
            
            {/* Canvas Controls */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-text-primary mb-2">Canvas Controls</h4>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  className="btn-secondary text-sm"
                  onClick={() => setZoom(canvas.zoom + 0.1)}
                >
                  Zoom In ({canvas.zoom.toFixed(1)}x)
                </button>
                <button 
                  className="btn-secondary text-sm"
                  onClick={() => setZoom(Math.max(0.1, canvas.zoom - 0.1))}
                >
                  Zoom Out
                </button>
                <button 
                  className={`text-sm transition-colors ${
                    ui.isGridVisible ? 'btn-primary' : 'btn-secondary'
                  }`}
                  onClick={toggleGrid}
                >
                  Grid: {ui.isGridVisible ? 'On' : 'Off'}
                </button>
                <button 
                  className="btn-secondary text-sm"
                  onClick={() => setTool(ui.selectedTool === 'select' ? 'pan' : 'select')}
                >
                  Tool: {ui.selectedTool}
                </button>
              </div>
            </div>

            {/* Panel Controls */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-text-primary mb-2">Panel Controls</h4>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  className="btn-primary text-sm"
                  onClick={() => openPanel('node-properties')}
                >
                  Properties Panel
                </button>
                <button 
                  className="btn-primary text-sm"
                  onClick={() => openPanel('toolbox')}
                >
                  Toolbox Panel
                </button>
                <button 
                  className="btn-primary text-sm"
                  onClick={() => openPanel('validation')}
                >
                  Validation Panel
                </button>
                <button 
                  className="btn-secondary text-sm"
                  onClick={() => panels.forEach(p => closePanel(p.id))}
                >
                  Close All
                </button>
              </div>
            </div>

            {/* Open Panels List */}
            <div>
              <h4 className="text-sm font-medium text-text-primary mb-2">
                Open Panels ({panels.length})
              </h4>
              {panels.length === 0 ? (
                <p className="text-text-muted text-sm">No panels open</p>
              ) : (
                <div className="space-y-1">
                  {panels.map((panel) => (
                    <div
                      key={panel.id}
                      className="flex justify-between items-center p-2 bg-surface-elevated rounded text-xs"
                    >
                      <span className="text-text-primary">{panel.title}</span>
                      <button
                        className="text-text-muted hover:text-accent-danger"
                        onClick={() => closePanel(panel.id)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Validation and Actions */}
        <div className="panel-base mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-text-primary">Project Actions</h3>
            <div className="flex gap-2">
              <button 
                className="btn-primary"
                onClick={handleValidation}
              >
                Validate Project
              </button>
              <button 
                className="btn-secondary"
                onClick={markAsModified}
              >
                Mark Modified
              </button>
            </div>
          </div>

          {/* Validation Results */}
          {lastValidation && (
            <div className="mt-4 p-4 bg-surface-primary rounded">
              <h4 className="text-sm font-medium text-text-primary mb-2">
                Validation Results
              </h4>
              <div className="text-sm space-y-1">
                <div className={`${lastValidation.isValid ? 'text-accent-secondary' : 'text-accent-danger'}`}>
                  Status: {lastValidation.isValid ? 'Valid' : 'Invalid'}
                </div>
                {lastValidation.errors.length > 0 && (
                  <div className="text-accent-danger">
                    Errors: {lastValidation.errors.length}
                  </div>
                )}
                {lastValidation.warnings.length > 0 && (
                  <div className="text-accent-warning">
                    Warnings: {lastValidation.warnings.length}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notifications */}
          {ui.notifications.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-text-primary mb-2">
                Recent Notifications
              </h4>
              <div className="space-y-1">
                {ui.notifications.slice(-3).map((notif) => (
                  <div
                    key={notif.id}
                    className="text-xs p-2 bg-surface-elevated rounded"
                  >
                    <div className="font-medium text-text-primary">{notif.title}</div>
                    <div className="text-text-muted">{notif.message}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 p-4 bg-surface-secondary rounded-lg border border-surface-border">
          <h3 className="text-lg font-semibold text-text-primary mb-2">Test Instructions</h3>
          <ul className="text-sm text-text-secondary space-y-1">
            <li>• <strong>Create nodes</strong> using the buttons above</li>
            <li>• <strong>Click nodes</strong> in the list to select them</li>
            <li>• <strong>Connect nodes</strong> using "Connect Last 2" button</li>
            <li>• <strong>Open panels</strong> to test panel management</li>
            <li>• <strong>Validate project</strong> to test validation system</li>
            <li>• <strong>Check console</strong> for Zustand DevTools</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
