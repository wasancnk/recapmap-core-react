import React, { useState, useEffect } from 'react';
import { useNodeStore } from '../../stores/nodeStore';

interface EditorPanelProps {
  nodeId: string;
}

export const EditorPanel: React.FC<EditorPanelProps> = ({ nodeId }) => {
  const { getNode, updateNode, deleteNode } = useNodeStore();
  const node = getNode(nodeId);
  
  // Local state for editing
  const [localData, setLocalData] = useState({
    title: '',
    description: ''
  });
  const [isDirty, setIsDirty] = useState(false);

  // Initialize local state when node changes
  useEffect(() => {
    if (node) {
      setLocalData({
        title: node.title,
        description: node.description || ''
      });
      setIsDirty(false);
    }
  }, [node]);
  // Handle case where node is not found
  if (!node) {
    return (
      <div className="p-4 h-full flex items-center justify-center">
        <div className="text-center text-gray-400">
          <span className="text-2xl mb-2 block">❌</span>
          <p className="text-sm">Node not found</p>
        </div>
      </div>
    );
  }

  const handleTitleChange = (value: string) => {
    setLocalData(prev => ({ ...prev, title: value }));
    setIsDirty(true);
  };

  const handleDescriptionChange = (value: string) => {
    setLocalData(prev => ({ ...prev, description: value }));
    setIsDirty(true);
  };

  const handleSave = () => {
    updateNode(nodeId, {
      title: localData.title,
      description: localData.description
    });
    setIsDirty(false);
  };

  const handleReset = () => {
    setLocalData({
      title: node.title,
      description: node.description || ''
    });
    setIsDirty(false);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${node.title}"?`)) {
      deleteNode(nodeId);
    }  };  // Get node type info
  const nodeTypeConfig = {
    'usecase': { icon: '🎯', label: 'Use Case' },
    'presentation': { icon: '📽️', label: 'Presentation' },
    'persona': { icon: '👤', label: 'Persona' },
    'screen': { icon: '📱', label: 'Screen' },
    'process': { icon: '⚙️', label: 'Process' },
    'expectation': { icon: '🎯', label: 'Expectation' },
    'outcome': { icon: '✅', label: 'Outcome' },
    'resource': { icon: '📎', label: 'Resource' },
    'knowledge': { icon: '🧠', label: 'Knowledge' },
    'storage': { icon: '💾', label: 'Storage' },
    'task': { icon: '✔️', label: 'Task' },
    'note': { icon: '🖊️', label: 'Note' }
  };

  const config = nodeTypeConfig[node.type] || nodeTypeConfig['note'];

  return (
    <div className="p-4 h-full overflow-y-auto scrollbar-dark">{/* Header with Save Button */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">{config.icon}</span>
          <span className="text-sm font-medium text-gray-200">Edit {config.label}</span>
        </div>
        {isDirty && (
          <div className="flex gap-2">
            <button 
              onClick={handleReset}
              className="px-3 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors"
            >
              Reset
            </button>
            <button 
              onClick={handleSave}
              className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Save
            </button>
          </div>
        )}
      </div>

      {/* Basic Properties */}
      <div className="space-y-4">
        {/* Title Field */}
        <div>          <label className="block text-sm font-medium text-gray-300 mb-2">
            Title
          </label>          <input
            type="text"
            value={localData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-gray-100 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            placeholder="Enter node title"
          />
        </div>

        {/* Description Field */}
        <div>          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description
          </label>          <textarea
            value={localData.description}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            rows={4}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-gray-100 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
            placeholder="Enter node description"
          />
        </div>
      </div>      {/* Node Information */}
      <div className="mt-6 pt-4 border-t border-gray-700/50">
        <h5 className="text-sm font-medium text-gray-200 mb-3">Node Information</h5>
        <div className="space-y-2 text-sm text-gray-300">
          <div className="flex justify-between">
            <span>Type:</span>
            <span className="font-medium">{config.label}</span>
          </div>
          <div className="flex justify-between">
            <span>ID:</span>
            <span className="font-mono text-xs">{node.id}</span>
          </div>
          <div className="flex justify-between">
            <span>Created:</span>
            <span>{new Date(node.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Status:</span>            <span className={`font-medium ${node.isValid ? 'text-green-400' : 'text-red-400'}`}>
              {node.isValid ? 'Valid' : 'Invalid'}
            </span>
          </div>
        </div>
      </div>      {/* Actions */}
      <div className="mt-6 pt-4 border-t border-gray-700/50">
        <h5 className="text-sm font-medium text-gray-200 mb-3">Actions</h5>
        <div className="space-y-2">
          <button 
            className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-800/50 rounded-md transition-colors"
            onClick={() => console.log('Duplicate node:', nodeId)}
          >
            Duplicate Node
          </button>
          <button 
            className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-800/50 rounded-md transition-colors"
            onClick={() => console.log('View properties:', nodeId)}
          >
            Advanced Properties
          </button>
          <button 
            onClick={handleDelete}
            className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-900/20 rounded-md transition-colors"
          >
            Delete Node
          </button>
        </div>
      </div>
    </div>
  );
};
