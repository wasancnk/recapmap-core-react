/**
 * Toolbar.tsx - Main Toolbar Component for RecapMap Interface
 * 
 * This component provides the primary toolbar interface with:
 * - Node creation tools for all 12 node types
 * - Canvas control buttons (zoom, fit, center)
 * - Project management actions (save, load, export)
 * - UI state management and tool selection
 * - Grid and snap-to-grid controls
 * - Integration with all major store systems
 * 
 * The toolbar serves as the main control interface for users to interact
 * with the canvas and manage their business modeling projects.
 */
import { useMemo, useState, useEffect } from 'react';
import { useReactFlow } from '@xyflow/react';
import { useNodeStore } from '../stores/nodeStore';
import { useUIStore } from '../stores/uiStore';
import { useProjectStore } from '../stores/projectStore';
import { usePanelStore } from '../stores/panelStore';
import { useDraggable } from '../hooks/useDraggable';
import { getAllNodeTypes } from '../config/nodeTypes';
import type { NodeType } from '../types';

interface NodeButtonProps {
  nodeType: NodeType;
  label: string;
  className: string;
  icon: string;
}

const NodeButton: React.FC<NodeButtonProps> = ({ nodeType, label, className, icon }) => {
  const { addNode } = useNodeStore();
  const reactFlowInstance = useReactFlow();

  const handleAddNode = () => {
    // Get the center of the current viewport
    const viewportCenter = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    };

    // Convert screen coordinates to flow coordinates
    const flowPosition = reactFlowInstance.screenToFlowPosition(viewportCenter);

    // Add node at center of current viewport
    addNode(nodeType, flowPosition);
  };

  // Handle drag start for drag-and-drop node creation
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('application/reactflow', nodeType);
    e.dataTransfer.setData('application/nodeType', nodeType);
    e.dataTransfer.effectAllowed = 'move';      // Create a custom drag image with the node type info
    const dragImage = document.createElement('div');
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px';
      // Map button className to drag image background color (synchronized with button colors)
    dragImage.style.background = className.includes('bg-lime') ? '#4d7c0f' :
                                className.includes('bg-blue') ? '#3B82F6' : 
                                className.includes('bg-green') ? '#10B981' :
                                className.includes('bg-emerald') ? '#10B981' :
                                className.includes('bg-orange') ? '#F97316' :
                                className.includes('bg-purple') ? '#8B5CF6' :
                                className.includes('bg-violet') ? '#7c3aed' :
                                className.includes('bg-yellow-300') ? '#fde047' :  // Pastel yellow for note
                                className.includes('bg-yellow') ? '#EAB308' :
                                className.includes('bg-red') ? '#EF4444' :
                                className.includes('bg-gray') ? '#6B7280' : 
                                className.includes('bg-indigo') ? '#4F46E5' :
                                className.includes('bg-cyan') ? '#06B6D4' :                                className.includes('bg-pink-300') ? '#f9a8d4' :  // Pastel rose gold for task
                                className.includes('bg-pink') ? '#EC4899' : '#6B7280';
    
    // Set text color based on node type - sticky notes need black text on bright backgrounds
    dragImage.style.color = (className.includes('bg-yellow-300') || className.includes('bg-pink-300')) ? 'black' : 'white';
    dragImage.style.padding = '8px 12px';
    dragImage.style.borderRadius = '8px';
    dragImage.style.fontSize = '12px';    dragImage.style.fontWeight = 'bold';
    dragImage.style.border = '2px solid rgba(255, 255, 255, 0.3)';
    dragImage.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
      // Add stripe pattern for presentation and use case nodes
    if (className.includes('bg-indigo')) {      dragImage.style.backgroundImage = 'linear-gradient(45deg, #4F46E5 25%, #6366F1 25%, #6366F1 50%, #4F46E5 50%, #4F46E5 75%, #6366F1 75%)';
      dragImage.style.backgroundSize = '8px 8px';
    } else if (className.includes('bg-lime')) {
      dragImage.style.backgroundImage = 'linear-gradient(45deg, #4d7c0f 25%, #65a30d 25%, #65a30d 50%, #4d7c0f 50%, #4d7c0f 75%, #65a30d 75%)';
      dragImage.style.backgroundSize = '8px 8px';
    }
    
    dragImage.innerHTML = `${icon} ${label}`;
    
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 60, 20);
    
    // Clean up drag image after a short delay
    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);
  };

  return (
    <button
      onClick={handleAddNode}
      draggable={true}
      onDragStart={handleDragStart}
      className={`
        ${className} px-3 py-2 rounded-lg border-2 font-medium text-sm
        transition-all duration-200 hover:shadow-md hover:scale-105
        flex items-center gap-2 min-w-[120px] justify-center
        cursor-grab active:cursor-grabbing
      `}
      title={`Click to add or drag to canvas - ${label} Node`}
    >
      <span className="text-lg">{icon}</span>
      {label}
    </button>
  );
};

export const Toolbar: React.FC = () => {
  const { nodes, connections, deleteNode, clearSelection } = useNodeStore();
  const { addNotification, openPanel, ui, toggleSnapToGrid, toggleGrid, togglePresentationMode, setTheme } = useUIStore();
  const { project, updateProject } = useProjectStore();
  const { reset: resetPanels } = usePanelStore();
  
  // State for inline editing
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editName, setEditName] = useState(project.name);
  const [editDescription, setEditDescription] = useState(project.description || '');
  const [isSaving, setIsSaving] = useState(false);
  
  // Sync state when project changes
  useEffect(() => {
    setEditName(project.name);
    setEditDescription(project.description || '');
  }, [project.name, project.description]);
  // Event handlers for project name
  const handleNameChange = (value: string) => {
    setEditName(value);
  };

  const handleNameSave = () => {
    setIsSaving(true);
    updateProject({ name: editName });
    setIsEditingName(false);
    setTimeout(() => setIsSaving(false), 500); // Show "Saved" briefly
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSave();
    } else if (e.key === 'Escape') {
      setEditName(project.name);
      setIsEditingName(false);
    }
  };
  // Event handlers for project description
  const handleDescriptionChange = (value: string) => {
    setEditDescription(value);
  };

  const handleDescriptionSave = () => {
    setIsSaving(true);
    updateProject({ description: editDescription });
    setIsEditingDescription(false);
    setTimeout(() => setIsSaving(false), 500); // Show "Saved" briefly
  };

  const handleDescriptionKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setEditDescription(project.description || '');
      setIsEditingDescription(false);
    }
  };
  // Calculate project status
  const getLastUpdated = () => {
    if (project.updatedAt) {
      const now = new Date();
      const modified = new Date(project.updatedAt);
      const diffMs = now.getTime() - modified.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      
      if (diffHours > 0) return `${diffHours}h ago`;
      if (diffMinutes > 0) return `${diffMinutes}m ago`;
      return 'Just now';
    }
    return 'Never';
  };

  // Stable initial position to prevent re-render loops
  const initialPosition = useMemo(() => ({ x: 16, y: 16 }), []);

  // Initialize draggable functionality
  const { position: draggablePosition, dragRef, dragHandleProps } = useDraggable({
    initialPosition,
  });
  
  // Use centralized node configuration
  const nodeTypes = getAllNodeTypes().map(config => ({
    type: config.type,
    label: config.label,
    className: config.toolbarClassName,
    icon: config.icon
  }));

  const handleClearAll = () => {
    if (nodes.length > 0 || connections.length > 0) {
      if (window.confirm('Are you sure you want to clear all nodes and connections?')) {
        // Clear selection first
        clearSelection();
        
        // Delete all nodes (this will also delete all connections automatically)
        const nodeIds = [...nodes.map(node => node.id)]; // Create a copy to avoid mutation during iteration
        nodeIds.forEach(nodeId => deleteNode(nodeId));
        
        // Reset all panels (this will close all node panels)
        resetPanels();
        
        // Show success notification
        addNotification({ 
          type: 'success', 
          title: 'Success',
          message: `Cleared ${nodeIds.length} nodes and all connections!` 
        });
      }
    }
  };

  const handleExport = () => {
    openPanel('export');
  };
  return (
    <div 
      ref={dragRef}
      className="fixed z-panel-base"
      style={{ 
        left: draggablePosition.x, 
        top: draggablePosition.y 
      }}
    >
      <div className="bg-background-secondary border border-surface-border rounded-lg shadow-lg p-4 w-80">
        {/* Drag Handle */}
        <div 
          className="flex justify-center py-2 cursor-grab active:cursor-grabbing select-none"
          {...dragHandleProps}
        >
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-text-muted rounded-full"></div>
            <div className="w-1 h-1 bg-text-muted rounded-full"></div>
            <div className="w-1 h-1 bg-text-muted rounded-full"></div>
            <div className="w-1 h-1 bg-text-muted rounded-full"></div>
          </div>
        </div>
        
        {/* Project Information Section */}
        <div className="mb-4 space-y-2">          {/* Project Name */}
          {isEditingName ? (
            <input
              type="text"
              value={editName}
              onChange={(e) => handleNameChange(e.target.value)}
              onBlur={handleNameSave}
              onKeyDown={handleNameKeyDown}
              onMouseDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              autoFocus
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-gray-100 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              placeholder="Enter project name"
            />
          ) : (
            <div
              onClick={() => setIsEditingName(true)}
              className="text-base font-semibold text-text-primary cursor-pointer hover:bg-surface-secondary/50 rounded px-2 py-1 transition-colors"
              title="Click to edit project name"
            >
              {project.name || 'Untitled Project'}
            </div>
          )}          {/* Project Description */}
          {isEditingDescription ? (
            <textarea
              value={editDescription}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              onBlur={handleDescriptionSave}
              onKeyDown={handleDescriptionKeyDown}
              onMouseDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              autoFocus
              rows={2}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-gray-100 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
              placeholder="Add description..."
            />
          ) : (
            <div
              onClick={() => setIsEditingDescription(true)}
              className="text-sm text-text-secondary opacity-80 cursor-pointer hover:bg-surface-secondary/50 rounded px-2 py-1 transition-colors min-h-[1.5rem]"
              title="Click to edit project description"
            >
              {project.description || 'Add description...'}
            </div>
          )}

          {/* Status Line */}
          <div className="text-xs text-text-muted flex items-center justify-between">
            <span className="flex items-center gap-1">
              {isSaving ? (
                <>
                  <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                  Saving...
                </>
              ) : (
                <>
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                  Saved
                </>
              )}
            </span>
            <span>{getLastUpdated()}</span>
            <span>
              {nodes.length} node{nodes.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <h3 className="text-text-primary font-semibold mb-3 text-sm">Add Nodes</h3>
        
        {/* Node Type Buttons Grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {nodeTypes.map((nodeType) => (
            <NodeButton
              key={nodeType.type}
              nodeType={nodeType.type}
              label={nodeType.label}
              className={nodeType.className}
              icon={nodeType.icon}
            />
          ))}
        </div>

        {/* Grid Controls */}
        <div className="border-t border-surface-border pt-3 mb-4">
          <h4 className="text-text-primary font-semibold mb-2 text-xs">Grid Options</h4>
          
          <div className="space-y-2">            <button
              onClick={toggleGrid}
              className={`
                w-full px-3 py-2 rounded text-sm font-medium transition-colors
                ${ui.isGridVisible 
                  ? 'bg-accent-primary text-white border border-accent-primary hover:bg-accent-primary/90' 
                  : 'bg-surface-secondary text-text-secondary border border-surface-border hover:bg-surface-tertiary'
                }
              `}
              title="Toggle grid visibility (Ctrl+Shift+G)"
            >
              <span className="mr-2">{ui.isGridVisible ? '✓' : '○'}</span>
              Show Grid
            </button>
            
            <button
              onClick={toggleSnapToGrid}
              className={`
                w-full px-3 py-2 rounded text-sm font-medium transition-colors
                ${ui.snapToGrid 
                  ? 'bg-accent-primary text-white border border-accent-primary hover:bg-accent-primary/90' 
                  : 'bg-surface-secondary text-text-secondary border border-surface-border hover:bg-surface-tertiary'
                }
              `}
              title="Toggle snap to grid (Ctrl+G)"
            >              <span className="mr-2">{ui.snapToGrid ? '⚡' : '○'}</span>
              Snap to Grid
            </button>
          </div>
        </div>

        {/* Presentation Mode Controls */}
        <div className="border-t border-surface-border pt-3 mb-4">
          <h4 className="text-text-primary font-semibold mb-2 text-xs">Presentation Mode</h4>
          
          <div className="space-y-2">
            <button
              onClick={togglePresentationMode}
              className={`
                w-full px-3 py-2 rounded text-sm font-medium transition-colors
                ${ui.isPresentationMode 
                  ? 'bg-purple-600 text-white border border-purple-600 hover:bg-purple-700' 
                  : 'bg-surface-secondary text-text-secondary border border-surface-border hover:bg-surface-tertiary'
                }
              `}
              title="Toggle presentation mode - hides UI elements for keynote-style presentation"
            >
              <span className="mr-2">{ui.isPresentationMode ? '📽️' : '🖼️'}</span>
              {ui.isPresentationMode ? 'Exit Presentation' : 'Start Presentation'}
            </button>
            
            {/* Theme Toggle for Presentation */}
            <button
              onClick={() => setTheme(ui.theme === 'bright' ? 'dark' : 'bright')}
              className={`
                w-full px-3 py-2 rounded text-sm font-medium transition-colors
                ${ui.theme === 'bright'
                  ? 'bg-yellow-500 text-black border border-yellow-600 hover:bg-yellow-600' 
                  : 'bg-surface-secondary text-text-secondary border border-surface-border hover:bg-surface-tertiary'
                }
              `}
              title="Toggle between dark theme and bright theme for presentations"
            >
              <span className="mr-2">{ui.theme === 'bright' ? '☀️' : '🌙'}</span>
              {ui.theme === 'bright' ? 'Bright Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>

        {/* Canvas Actions */}
        <div className="border-t border-surface-border pt-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-text-secondary text-xs">
              Nodes: {nodes.length} | Connections: {connections.length}
            </span>
          </div>
          
          <div className="space-y-2">
            <button
              onClick={handleExport}
              className="
                w-full px-3 py-2 bg-accent-primary border border-accent-primary text-white rounded
                hover:bg-accent-primary/90 transition-colors text-sm font-medium
                disabled:opacity-50 disabled:cursor-not-allowed
              "
              disabled={nodes.length === 0}
            >
              Export YAML
            </button>
            
            <button
              onClick={handleClearAll}
              className="
                w-full px-3 py-2 bg-red-500 border border-red-600 text-white rounded
                hover:bg-red-600 transition-colors text-sm font-medium
                disabled:opacity-50 disabled:cursor-not-allowed
              "
              disabled={nodes.length === 0 && connections.length === 0}
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
