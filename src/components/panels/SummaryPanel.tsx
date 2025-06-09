import React from 'react';
import { useNodeStore } from '../../stores/nodeStore';

interface SummaryPanelProps {
  nodeId: string;
}

export const SummaryPanel: React.FC<SummaryPanelProps> = ({ nodeId }) => {
  const { getNode, getNodeConnections } = useNodeStore();
  
  // Get actual node data from store
  const node = getNode(nodeId);
  const connections = getNodeConnections(nodeId);
  
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

  // Format dates for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get node type configuration for icon
  const nodeTypeConfig = {
    'usecase': { icon: '🎯', label: 'Use Case' },    'screen': { icon: '📱', label: 'Screen' },
    'user': { icon: '👤', label: 'User' },
    'process': { icon: '⚙️', label: 'Process' },
    'storage': { icon: '💾', label: 'Storage' },    'controller': { icon: '🎮', label: 'Controller' },
    'error': { icon: '⚠️', label: 'Error' },
    'concept': { icon: '💡', label: 'Concept' },
    'presentation': { icon: '📽️', label: 'Presentation' },
    'attachment': { icon: '📎', label: 'Attachment' }
  };

  const config = nodeTypeConfig[node.type] || nodeTypeConfig['concept'];
    return (
    <div className="p-4 h-full overflow-y-auto scrollbar-dark">
      {/* Node Header with Type */}
      <div className="mb-4 pb-3 border-b border-gray-700/50">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">{config.icon}</span>
          <span className="text-xs uppercase font-medium text-gray-400 tracking-wide">
            {config.label}
          </span>
        </div>
        <h4 className="text-lg font-semibold text-gray-100 mb-2">
          {node.title}
        </h4>
        {node.description && (
          <p className="text-sm text-gray-300 leading-relaxed">
            {node.description}
          </p>
        )}
      </div>

      {/* Node Metadata */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <span className="text-xs">🆔</span>
          <span className="font-mono text-xs">{node.id}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <span className="text-xs">📅</span>
          <span>Created {formatDate(node.createdAt)}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <span className="text-xs">🕒</span>
          <span>Updated {formatDate(node.updatedAt)}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <span className="text-xs">🔗</span>
          <span>{connections.length} connection{connections.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Status and Validation */}
      <div className="mt-4">
        <span className={`
          inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
          ${node.isValid 
            ? 'bg-green-900/50 text-green-300 border border-green-700/50' 
            : 'bg-red-900/50 text-red-300 border border-red-700/50'
          }
        `}>
          {node.isValid ? 'Valid' : 'Invalid'}
        </span>
        {node.isSelected && (
          <span className="ml-2 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-900/50 text-blue-300 border border-blue-700/50">
            Selected
          </span>
        )}
      </div>

      {/* Connection Details */}
      {connections.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-700/50">
          <h5 className="text-sm font-medium text-gray-200 mb-3">Connections</h5>
          <div className="space-y-2">
            {connections.map((conn) => (
              <div key={conn.id} className="flex items-center gap-2 text-sm text-gray-300">
                <span className="text-xs">
                  {conn.sourceNodeId === nodeId ? '→' : '←'}
                </span>
                <span className="font-mono text-xs text-gray-400">
                  {conn.sourceNodeId === nodeId ? conn.targetNodeId : conn.sourceNodeId}
                </span>
                <span className="text-xs text-gray-500">
                  ({conn.type})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-gray-700/50">
        <h5 className="text-sm font-medium text-gray-200 mb-3">Quick Actions</h5>
        <div className="space-y-2">
          <button 
            className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-800/50 rounded-md transition-colors"
            onClick={() => console.log('View connections for:', nodeId)}
          >
            View Connections
          </button>
          <button 
            className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-800/50 rounded-md transition-colors"
            onClick={() => console.log('Duplicate node:', nodeId)}
          >
            Duplicate Node
          </button>
          <button 
            className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-800/50 rounded-md transition-colors"
            onClick={() => console.log('Export node data:', nodeId)}
          >
            Export Data
          </button>
        </div>
      </div>
    </div>
  );
};
