import React, { useState, useEffect } from 'react';
import { useNodeStore } from '../stores/nodeStore';
import { useUIStore } from '../stores/uiStore';

interface ConnectionPropertyPanelProps {
  connectionId: string;
  position: { x: number; y: number };
  onClose: () => void;
}

export const ConnectionPropertyPanel: React.FC<ConnectionPropertyPanelProps> = ({
  connectionId,
  position,
  onClose,
}) => {
  const { connections, updateConnection, deleteConnection, getNode } = useNodeStore();
  const { addNotification } = useUIStore();
  
  const connection = connections.find(c => c.id === connectionId);
    // Local state for form
  const [formData, setFormData] = useState({
    label: connection?.label || '',
    type: connection?.type || 'data',
    directionType: connection?.metadata?.directionType || 'oneway',
    style: connection?.metadata?.lineStyle || 'solid',
    color: connection?.metadata?.color || '#6B7280',
    priority: connection?.metadata?.priority || 'medium',
  });

  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    if (connection) {
      setFormData({
        label: connection.label || '',
        type: connection.type || 'data',
        directionType: connection.metadata?.directionType || 'oneway',
        style: connection.metadata?.lineStyle || 'solid',
        color: connection.metadata?.color || '#6B7280',
        priority: connection.metadata?.priority || 'medium',
      });
    }
  }, [connection]);

  if (!connection) {
    return null;
  }

  const sourceNode = getNode(connection.sourceNodeId);
  const targetNode = getNode(connection.targetNodeId);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsModified(true);
  };  const handleSwapDirection = () => {
    if (!sourceNode || !targetNode) return;
    
    // Simply swap the source and target node IDs while preserving all other properties
    updateConnection(connectionId, {
      sourceNodeId: connection.targetNodeId,
      targetNodeId: connection.sourceNodeId,
      // Keep all other properties including handles, metadata, styling, etc.
    });
    
    addNotification({ 
      title: 'Success',
      message: `Connection direction swapped: ${targetNode.title} → ${sourceNode.title}`, 
      type: 'success',
      duration: 3000 
    });
    onClose();
  };
  const handleSave = () => {
    updateConnection(connectionId, {
      label: formData.label,
      type: formData.type as 'data' | 'control' | 'dependency',
      metadata: {
        ...connection.metadata,
        directionType: formData.directionType as 'oneway' | 'twoway' | 'undirected',
        lineStyle: formData.style as 'solid' | 'dashed' | 'dotted',
        color: formData.color,
        priority: formData.priority as 'low' | 'medium' | 'high' | 'critical'
      }
    });
    setIsModified(false);
    addNotification({ 
      title: 'Success',
      message: 'Connection updated with new styling', 
      type: 'success',
      duration: 3000 
    });
  };
  const handleDelete = () => {
    deleteConnection(connectionId);
    addNotification({ 
      title: 'Success',
      message: 'Connection deleted', 
      type: 'success',
      duration: 3000 
    });
    onClose();
  };

  const handleCancel = () => {
    if (isModified) {
      const confirmDiscard = confirm('You have unsaved changes. Discard them?');
      if (!confirmDiscard) return;
    }
    onClose();
  };

  return (
    <div 
      className="fixed bg-surface-primary border border-surface-border rounded-lg shadow-lg z-50 w-80"
      style={{ 
        left: position.x, 
        top: position.y,
        maxHeight: '600px',
        overflowY: 'auto'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-surface-border">
        <div className="flex items-center space-x-2">
          <span className="text-lg">🔗</span>
          <h3 className="text-lg font-bold text-text-primary">Connection Properties</h3>
        </div>
        <button
          onClick={handleCancel}
          className="text-text-secondary hover:text-text-primary transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        
        {/* Connection Details */}
        <div className="space-y-3">
          <h4 className="font-semibold text-text-primary">Connection Details</h4>
          
          <div className="text-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">From:</span>
              <span className="text-text-primary font-medium">
                {sourceNode?.title || 'Unknown Node'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">To:</span>
              <span className="text-text-primary font-medium">
                {targetNode?.title || 'Unknown Node'}
              </span>
            </div>
          </div>

          {/* Swap Direction Button */}
          <button
            onClick={handleSwapDirection}
            className="w-full px-3 py-2 bg-accent-primary hover:bg-accent-secondary text-white rounded-md transition-colors flex items-center justify-center space-x-2"
          >
            <span>⇄</span>
            <span>Swap Direction</span>
          </button>
        </div>

        {/* Label */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-primary">Label</label>
          <input
            type="text"
            value={formData.label}
            onChange={(e) => handleInputChange('label', e.target.value)}
            placeholder="Connection label (optional)"
            className="w-full px-3 py-2 bg-surface-secondary border border-surface-border rounded-md text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary"
          />
        </div>

        {/* Direction & Style */}
        <div className="space-y-3">
          <h4 className="font-semibold text-text-primary">Direction & Style</h4>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">Direction Type</label>
            <select
              value={formData.directionType}
              onChange={(e) => handleInputChange('directionType', e.target.value)}
              className="w-full px-3 py-2 bg-surface-secondary border border-surface-border rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
            >
              <option value="oneway">One-way →</option>
              <option value="twoway">Two-way ↔</option>
              <option value="undirected">Undirected —</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">Line Style</label>
            <select
              value={formData.style}
              onChange={(e) => handleInputChange('style', e.target.value)}
              className="w-full px-3 py-2 bg-surface-secondary border border-surface-border rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
            >
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="dotted">Dotted</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">Color</label>
            <div className="flex space-x-2">
              <input
                type="color"
                value={formData.color}
                onChange={(e) => handleInputChange('color', e.target.value)}
                className="w-12 h-10 border border-surface-border rounded-md cursor-pointer"
              />
              <input
                type="text"
                value={formData.color}
                onChange={(e) => handleInputChange('color', e.target.value)}
                className="flex-1 px-3 py-2 bg-surface-secondary border border-surface-border rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
              />
            </div>
          </div>
        </div>        {/* Relationship Type */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-primary">Relationship Type</label>
          <select
            value={formData.type}
            onChange={(e) => handleInputChange('type', e.target.value)}
            className="w-full px-3 py-2 bg-surface-secondary border border-surface-border rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
          >
            <option value="data">Data Flow</option>
            <option value="control">Process Flow</option>
            <option value="dependency">Dependency</option>
          </select>
        </div>

        {/* Priority */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-primary">Priority</label>
          <select
            value={formData.priority}
            onChange={(e) => handleInputChange('priority', e.target.value)}
            className="w-full px-3 py-2 bg-surface-secondary border border-surface-border rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-4 border-t border-surface-border">
          <button
            onClick={handleSave}
            disabled={!isModified}
            className="flex-1 px-4 py-2 bg-accent-primary hover:bg-accent-secondary disabled:bg-accent-muted disabled:cursor-not-allowed text-white rounded-md transition-colors"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-surface-secondary hover:bg-surface-tertiary text-text-primary border border-surface-border rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
