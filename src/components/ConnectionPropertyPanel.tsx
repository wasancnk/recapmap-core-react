import React, { useState, useEffect } from 'react';
import { useNodeStore } from '../stores/nodeStore';
import { useUIStore } from '../stores/uiStore';
import { logger } from '../utils/logger';
import { useDraggable } from '../hooks/useDraggable';

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
  const { connections, updateConnection, swapConnection, deleteConnection, getNode } = useNodeStore();
  const { addNotification } = useUIStore();
  
  const connection = connections.find(c => c.id === connectionId);

  // Initialize draggable functionality
  const { position: draggablePosition, dragRef, dragHandleProps } = useDraggable({
    initialPosition: position,
  });

  // Local state for form
  const [formData, setFormData] = useState({
    label: connection?.label || '',
    type: connection?.type || 'data',
    directionType: connection?.metadata?.directionType || 'oneway',
    style: connection?.metadata?.lineStyle || 'solid',
    color: connection?.metadata?.color || '#6B7280',
    priority: connection?.metadata?.priority || 'medium',
  });

  const [isModified, setIsModified] = useState(false);  useEffect(() => {
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

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isModified) {
          const confirmDiscard = confirm('You have unsaved changes. Discard them?');
          if (!confirmDiscard) return;
        }
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModified, onClose]);

  if (!connection) {
    return null;
  }

  const sourceNode = getNode(connection.sourceNodeId);
  const targetNode = getNode(connection.targetNodeId);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsModified(true);
  };  const handleSwapDirection = () => {    
    logger.connectionStart('swap', connectionId, {
      sourceNode: sourceNode ? { id: sourceNode.id, title: sourceNode.title } : null,
      targetNode: targetNode ? { id: targetNode.id, title: targetNode.title } : null,
      connection: connection ? {
        id: connection.id,
        sourceNodeId: connection.sourceNodeId,
        targetNodeId: connection.targetNodeId,
        sourceHandle: connection.sourceHandle,
        targetHandle: connection.targetHandle,
        type: connection.type
      } : null
    });
    
    if (!sourceNode || !targetNode) {
      logger.connectionError('swap', connectionId, 'Missing node information during swap');
      addNotification({ 
        title: 'Error',
        message: 'Cannot swap connection: Missing node information', 
        type: 'error',
        duration: 5000 
      });
      return;
    }
    
    logger.connectionDebug('swap', 'About to call swapConnection', {
      connectionId,
      currentConnections: connections.length,
      connectionExists: !!connections.find(c => c.id === connectionId)
    });
    
    // Use the atomic swapConnection method from the store
    const swapSuccess = swapConnection(connectionId);
    
    logger.connectionDebug('swap', 'SwapConnection returned', { swapSuccess });
    
    // Check connection state after swap attempt
    setTimeout(() => {
      const postSwapConnection = connections.find(c => c.id === connectionId);
      logger.connectionDebug('swap', 'Post-swap state analysis', {
        connectionStillExists: !!postSwapConnection,
        postSwapConnection: postSwapConnection ? {
          id: postSwapConnection.id,
          sourceNodeId: postSwapConnection.sourceNodeId,
          targetNodeId: postSwapConnection.targetNodeId,
          sourceHandle: postSwapConnection.sourceHandle,
          targetHandle: postSwapConnection.targetHandle
        } : null,
        totalConnections: connections.length
      });
      
      if (swapSuccess && postSwapConnection) {
        logger.connectionSuccess('swap', connectionId);
        addNotification({ 
          title: 'Success',
          message: `Connection direction swapped: ${targetNode.title} → ${sourceNode.title}`, 
          type: 'success',
          duration: 3000 
        });
        onClose();
      } else {
        logger.connectionError('swap', connectionId, 'Connection swap failed or connection disappeared');        addNotification({ 
          title: 'Error',
          message: 'Failed to swap connection direction', 
          type: 'error',
          duration: 5000 
        });
      }
      
      logger.connectionDebug('swap', 'Swap operation completed');
    }, 50);
  };  const handleSave = async () => {
    try {
      await updateConnection(connectionId, {
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
    } catch (error) {
      addNotification({
        title: 'Error', 
        message: `Failed to update connection: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'error',
        duration: 5000
      });
    }
  };const handleDelete = () => {
    deleteConnection(connectionId);
    addNotification({ 
      title: 'Success',
      message: 'Connection deleted successfully', 
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
  };  return (    <div 
      ref={dragRef}
      className="fixed bg-gray-900/95 backdrop-blur-md border border-gray-700/50 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 z-50 w-64 flex flex-col"
      style={{ 
        left: draggablePosition.x, 
        top: draggablePosition.y,
        height: '420px',
        maxHeight: '420px'
      }}
    >{/* Fixed Header - Draggable */}
      <div 
        className="flex flex-col select-none flex-shrink-0"
        {...dragHandleProps}
      >        {/* Drag indicator dots - centered at top */}
        <div className="flex justify-center py-2">
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
          </div>
        </div>
          {/* Title and close button */}        <div className="flex items-center justify-between px-4 pb-3 border-b border-gray-700/30 bg-gray-800/30 rounded-t-lg">
          <div className="flex items-center space-x-2">
            <span className="text-sm">🔗</span>
            <h3 className="text-sm font-semibold text-gray-100">Connection Properties</h3>
          </div>          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-700/50 transition-colors duration-150 text-gray-400 hover:text-gray-200"
            onMouseDown={(e) => e.stopPropagation()} // Prevent drag when clicking close button
          >
            ✕
          </button></div>
      </div>      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto scrollbar-dark p-3 space-y-3">          {/* Connection Details */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-gray-200 uppercase tracking-wide">Connection Details</h4>
          
          <div className="text-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">From:</span>
              <span className="text-gray-100 font-medium">
                {sourceNode?.title || 'Unknown Node'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-300">To:</span>
              <span className="text-gray-100 font-medium">
                {targetNode?.title || 'Unknown Node'}
              </span>
            </div>
          </div>          {/* Swap Direction Button */}
          <button
            onClick={handleSwapDirection}
            className="w-full px-2 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center justify-center space-x-1 text-sm"
          >
            <span>⇄</span>
            <span>Swap Direction</span>
          </button>
        </div>        {/* Label */}
        <div className="space-y-1">
          <label htmlFor="connectionLabel" className="text-xs font-medium text-gray-300">Label</label>
          <input
            id="connectionLabel"
            type="text"
            value={formData.label}
            onChange={(e) => handleInputChange('label', e.target.value)}
            placeholder="Connection label (optional)"
            className="w-full px-2 py-1.5 bg-gray-800 border border-gray-600 rounded-md text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
          />
        </div>        {/* Direction & Style */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-gray-200 uppercase tracking-wide">Direction & Style</h4>            <div className="space-y-1">
            <label htmlFor="directionType" className="text-xs font-medium text-gray-300">Direction Type</label>            <select
              id="directionType"
              value={formData.directionType}
              onChange={(e) => handleInputChange('directionType', e.target.value)}
              className="w-full px-2 py-1.5 bg-gray-800 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
            >
              <option value="oneway" selected={formData.directionType === 'oneway'}>One-way →</option>
              <option value="twoway" selected={formData.directionType === 'twoway'}>Two-way ↔</option>
              <option value="undirected" selected={formData.directionType === 'undirected'}>Undirected —</option>
            </select>
          </div>          <div className="space-y-1">
            <label htmlFor="lineStyle" className="text-xs font-medium text-gray-300">Line Style</label>            <select
              id="lineStyle"
              value={formData.style}
              onChange={(e) => handleInputChange('style', e.target.value)}
              className="w-full px-2 py-1.5 bg-gray-800 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
            >
              <option value="solid" selected={formData.style === 'solid'}>Solid</option>
              <option value="dashed" selected={formData.style === 'dashed'}>Dashed</option>
              <option value="dotted" selected={formData.style === 'dotted'}>Dotted</option>
            </select>
          </div>          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-300">Color</label>
            <div className="flex space-x-2">              <input
                type="color"
                value={formData.color}
                onChange={(e) => handleInputChange('color', e.target.value)}
                className="w-10 h-8 border border-gray-600 rounded-md cursor-pointer"
              />
              <input
                type="text"
                value={formData.color}
                onChange={(e) => handleInputChange('color', e.target.value)}
                className="flex-1 px-2 py-1.5 bg-gray-800 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              />
            </div>
          </div>
        </div>        {/* Relationship Type */}
        <div className="space-y-1">
          <label htmlFor="relationshipType" className="text-xs font-medium text-gray-300">Relationship Type</label>          <select
            id="relationshipType"
            value={formData.type}
            onChange={(e) => handleInputChange('type', e.target.value)}
            className="w-full px-2 py-1.5 bg-gray-800 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
          >
            <option value="data" selected={formData.type === 'data'}>Data Flow</option>
            <option value="control" selected={formData.type === 'control'}>Process Flow</option>
            <option value="dependency" selected={formData.type === 'dependency'}>Dependency</option>
          </select>
        </div>        {/* Priority */}
        <div className="space-y-1">
          <label htmlFor="priority" className="text-xs font-medium text-gray-300">Priority</label>          <select
            id="priority"
            value={formData.priority}
            onChange={(e) => handleInputChange('priority', e.target.value)}
            className="w-full px-2 py-1.5 bg-gray-800 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
          >
            <option value="low" selected={formData.priority === 'low'}>Low</option>
            <option value="medium" selected={formData.priority === 'medium'}>Medium</option>
            <option value="high" selected={formData.priority === 'high'}>High</option>
            <option value="critical" selected={formData.priority === 'critical'}>Critical</option>
          </select>
        </div>        {/* Action Buttons */}
        <div className="flex space-x-2 pt-3 border-t border-gray-700/50">
          <button
            onClick={handleSave}
            disabled={!isModified}
            className="flex-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-md transition-colors text-sm"
          >
            Save
          </button>          <button
            onClick={handleCancel}
            className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 border border-gray-600 rounded-md transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
