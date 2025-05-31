import React, { useState } from 'react';
import { TailwindTest } from './TailwindTest';
import { ZustandTest } from './ZustandTest';

interface ComponentShowcaseProps {
  name: string;
  component: string;
  description: string;
  usage: string;
  children: React.ReactNode;
}

const ComponentShowcase: React.FC<ComponentShowcaseProps> = ({ 
  name, 
  component, 
  description, 
  usage, 
  children 
}) => {
  const [showCode, setShowCode] = useState(false);

  return (
    <div className="bg-surface-primary border border-surface-border rounded-lg p-6 mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-text-primary">{name}</h3>
          <p className="text-text-secondary text-sm mt-1">{description}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-accent-primary text-white px-3 py-1 rounded-full text-xs font-mono">
            &lt;{component} /&gt;
          </span>
          <button
            onClick={() => setShowCode(!showCode)}
            className="bg-surface-elevated hover:bg-gray-600 text-text-primary px-3 py-1 rounded text-xs transition-colors"
          >
            {showCode ? 'Hide Code' : 'Show Usage'}
          </button>
        </div>
      </div>

      {/* Usage Code */}
      {showCode && (
        <div className="bg-gray-900 rounded p-4 mb-4 overflow-x-auto">
          <pre className="text-green-400 text-sm font-mono">
            <code>{usage}</code>
          </pre>
        </div>
      )}

      {/* Component Demo */}
      <div className="border border-surface-border rounded p-4 bg-background-tertiary">
        {children}
      </div>
    </div>
  );
};

export const ComponentLibrary: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'design' | 'components' | 'stores' | 'nodes'>('design');

  const tabs = [
    { id: 'design', label: 'Design System', icon: '🎨' },
    { id: 'components', label: 'UI Components', icon: '🧩' },
    { id: 'stores', label: 'State Management', icon: '📦' },
    { id: 'nodes', label: '8-Node System', icon: '🎯' },
  ];

  return (
    <div className="min-h-screen bg-background-primary text-text-primary">
      {/* Header */}
      <div className="bg-surface-primary border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text-primary">RecapMap Component Library</h1>
              <p className="text-text-secondary mt-1">Visual documentation and component reference</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-text-secondary text-sm">Version 1.0.0</span>
              <a 
                href="/"
                className="bg-accent-primary hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
              >
                ← Back to Canvas
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-surface-secondary border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'design' | 'components' | 'stores' | 'nodes')}
                className={`
                  flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors
                  ${activeTab === tab.id
                    ? 'border-accent-primary text-accent-primary'
                    : 'border-transparent text-text-secondary hover:text-text-primary'
                  }
                `}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'design' && (
          <div>
            <ComponentShowcase
              name="Design System"
              component="TailwindTest"
              description="Complete TailwindCSS design system with 8-node color palette, typography, and UI components"
              usage={`import { TailwindTest } from './components/TailwindTest';

function App() {
  return <TailwindTest />;
}`}
            >
              <TailwindTest />
            </ComponentShowcase>
          </div>
        )}

        {activeTab === 'components' && (
          <div>
            <ComponentShowcase
              name="Canvas Layout"
              component="CanvasLayout"
              description="Main layout wrapper with full-screen canvas, floating toolbar, and status bar"
              usage={`import { CanvasLayout } from './components/CanvasLayout';

function App() {
  return <CanvasLayout />;
}`}
            >
              <div className="bg-background-tertiary h-64 rounded flex items-center justify-center relative">
                <div className="text-text-secondary text-center">
                  <div className="text-4xl mb-2">🖼️</div>
                  <div>Full Canvas Layout</div>
                  <div className="text-xs mt-1">See main page for live demo</div>
                </div>
                {/* Mini Toolbar Demo */}
                <div className="absolute top-4 left-4 bg-surface-primary border border-surface-border rounded-lg p-2">
                  <div className="text-xs text-text-secondary mb-1">Toolbar</div>
                  <div className="grid grid-cols-2 gap-1">
                    <div className="w-8 h-6 bg-blue-500 rounded text-xs flex items-center justify-center">🎯</div>
                    <div className="w-8 h-6 bg-green-500 rounded text-xs flex items-center justify-center">📱</div>
                    <div className="w-8 h-6 bg-orange-500 rounded text-xs flex items-center justify-center">👤</div>
                    <div className="w-8 h-6 bg-purple-500 rounded text-xs flex items-center justify-center">⚙️</div>
                  </div>
                </div>
              </div>
            </ComponentShowcase>

            <ComponentShowcase
              name="Toolbar"
              component="Toolbar"
              description="Node creation toolbar with 8-node type buttons, statistics, and actions"
              usage={`import { Toolbar } from './components/Toolbar';

function CanvasLayout() {
  return (
    <div className="relative">
      <Toolbar />
    </div>
  );
}`}
            >
              <div className="bg-surface-primary border border-surface-border rounded-lg p-4 max-w-md">
                <h3 className="text-text-primary font-semibold mb-3 text-sm">Add Nodes</h3>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <button className="bg-blue-500 border-blue-600 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-2 justify-center">
                    🎯 Use Case
                  </button>
                  <button className="bg-green-500 border-green-600 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-2 justify-center">
                    📱 Screen
                  </button>
                  <button className="bg-orange-500 border-orange-600 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-2 justify-center">
                    👤 User
                  </button>
                  <button className="bg-purple-500 border-purple-600 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-2 justify-center">
                    ⚙️ Process
                  </button>
                </div>
                <div className="border-t border-surface-border pt-3">
                  <div className="text-text-secondary text-xs mb-2">Nodes: 0 | Connections: 0</div>
                  <button className="w-full px-3 py-2 bg-red-500 text-white rounded text-sm opacity-50 cursor-not-allowed">
                    Clear All
                  </button>
                </div>
              </div>
            </ComponentShowcase>

            <ComponentShowcase
              name="Canvas"
              component="Canvas"
              description="React Flow canvas with custom nodes, connections, pan/zoom, and controls"
              usage={`import { Canvas } from './components/Canvas';

function CanvasLayout() {
  return (
    <div className="w-full h-screen">
      <Canvas />
    </div>
  );
}`}
            >
              <div className="bg-background-tertiary h-64 rounded relative border border-surface-border">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-text-secondary text-center">
                    <div className="text-4xl mb-2">🌐</div>
                    <div>React Flow Canvas</div>
                    <div className="text-xs mt-1">Interactive pan/zoom with custom nodes</div>
                  </div>
                </div>
                {/* Demo Nodes */}
                <div className="absolute top-12 left-12 bg-blue-500 text-white px-3 py-2 rounded-lg text-xs border-2 border-blue-600">
                  🎯 Use Case Demo
                </div>
                <div className="absolute bottom-12 right-12 bg-green-500 text-white px-3 py-2 rounded-lg text-xs border-2 border-green-600">
                  📱 Screen Demo
                </div>
                {/* Controls */}
                <div className="absolute bottom-4 left-4 bg-surface-primary border border-surface-border rounded p-2">
                  <div className="text-xs text-text-secondary">Controls</div>
                </div>
                {/* MiniMap */}
                <div className="absolute top-4 right-4 bg-surface-primary border border-surface-border rounded p-2 w-16 h-12">
                  <div className="text-xs text-text-secondary text-center">Map</div>
                </div>
              </div>
            </ComponentShowcase>
          </div>
        )}

        {activeTab === 'stores' && (
          <div>
            <ComponentShowcase
              name="State Management Demo"
              component="ZustandTest"
              description="Interactive demo of Zustand stores: NodeStore, UIStore, and ProjectStore"
              usage={`import { ZustandTest } from './components/ZustandTest';
import { useNodeStore, useUIStore, useProjectStore } from './stores';

// Individual store usage:
const { nodes, addNode } = useNodeStore();
const { panels, openPanel } = useUIStore();
const { currentProject, saveProject } = useProjectStore();`}
            >
              <ZustandTest />
            </ComponentShowcase>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-surface-primary border border-surface-border rounded-lg p-4">
                <h3 className="text-lg font-bold text-text-primary mb-2">📦 NodeStore</h3>
                <p className="text-text-secondary text-sm mb-4">Manages nodes and connections</p>
                <div className="space-y-2 text-sm">
                  <div className="text-accent-primary">• addNode(type, position)</div>
                  <div className="text-accent-primary">• updateNode(id, updates)</div>
                  <div className="text-accent-primary">• deleteNode(id)</div>
                  <div className="text-accent-primary">• addConnection(source, target)</div>
                  <div className="text-accent-primary">• selectNodes(ids)</div>
                </div>
              </div>

              <div className="bg-surface-primary border border-surface-border rounded-lg p-4">
                <h3 className="text-lg font-bold text-text-primary mb-2">🎨 UIStore</h3>
                <p className="text-text-secondary text-sm mb-4">Manages UI state and panels</p>
                <div className="space-y-2 text-sm">
                  <div className="text-accent-primary">• openPanel(type, data)</div>
                  <div className="text-accent-primary">• closePanel(id)</div>
                  <div className="text-accent-primary">• setZoom(zoom)</div>
                  <div className="text-accent-primary">• addNotification(message)</div>
                  <div className="text-accent-primary">• setTool(tool)</div>
                </div>
              </div>

              <div className="bg-surface-primary border border-surface-border rounded-lg p-4">
                <h3 className="text-lg font-bold text-text-primary mb-2">💾 ProjectStore</h3>
                <p className="text-text-secondary text-sm mb-4">Manages project lifecycle</p>
                <div className="space-y-2 text-sm">
                  <div className="text-accent-primary">• createProject(name)</div>
                  <div className="text-accent-primary">• loadProject(data)</div>
                  <div className="text-accent-primary">• saveProject()</div>
                  <div className="text-accent-primary">• exportYAML()</div>
                  <div className="text-accent-primary">• validateProject()</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'nodes' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-4">8-Node System Architecture</h2>
              <p className="text-text-secondary">
                RecapMap uses an 8-node system for comprehensive business modeling. Each node type has specific colors, icons, and purposes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                { type: 'usecase', name: 'Use Case', color: 'bg-blue-500 border-blue-600', icon: '🎯', desc: 'Business requirements and user stories' },
                { type: 'screen', name: 'Screen', color: 'bg-green-500 border-green-600', icon: '📱', desc: 'UI screens, interfaces, and views' },
                { type: 'user', name: 'User', color: 'bg-orange-500 border-orange-600', icon: '👤', desc: 'User roles, personas, and actors' },
                { type: 'process', name: 'Process', color: 'bg-purple-500 border-purple-600', icon: '⚙️', desc: 'Business processes and tools' },
                { type: 'storage', name: 'Storage', color: 'bg-yellow-500 border-yellow-600 text-black', icon: '💾', desc: 'Databases, files, and data stores' },
                { type: 'controller', name: 'Controller', color: 'bg-red-500 border-red-600', icon: '🎮', desc: 'Decision points and flow control' },
                { type: 'error', name: 'Error', color: 'bg-gray-500 border-gray-600', icon: '⚠️', desc: 'Error handling and rejection flows' },
                { type: 'base', name: 'Base', color: 'bg-cyan-500 border-cyan-600', icon: '🔧', desc: 'Abstract templates and base types' },
              ].map((node) => (
                <div key={node.type} className="bg-surface-primary border border-surface-border rounded-lg p-4">
                  <div className={`${node.color} text-white px-4 py-3 rounded-lg border-2 mb-3 text-center`}>
                    <div className="text-2xl mb-1">{node.icon}</div>
                    <div className="font-medium text-sm">{node.name}</div>
                  </div>
                  <div className="text-text-secondary text-xs">
                    <div className="font-mono text-accent-primary mb-1">'{node.type}'</div>
                    <div>{node.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <ComponentShowcase
              name="Node Component Usage"
              component="CustomNode"
              description="Internal node component used by React Flow canvas with 8-node styling"
              usage={`// Internal to Canvas.tsx - React Flow handles rendering
const CustomNode = ({ data, selected }) => {
  const nodeTypeStyles = {
    'usecase': 'bg-blue-500 border-blue-600 text-white',
    'screen': 'bg-green-500 border-green-600 text-white',
    // ... other node types
  };
  
  return (
    <div className={\`\${nodeTypeStyles[data.nodeType]} px-4 py-2 rounded-lg\`}>
      <div className="font-medium text-sm">{data.label}</div>
      {data.description && (
        <div className="text-xs opacity-80 mt-1">{data.description}</div>
      )}
    </div>
  );
};`}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-500 border-blue-600 border-2 text-white px-4 py-2 rounded-lg text-center">
                  <div className="font-medium text-sm">Use Case Node</div>
                  <div className="text-xs opacity-80 mt-1">Sample description</div>
                </div>
                <div className="bg-green-500 border-green-600 border-2 text-white px-4 py-2 rounded-lg text-center">
                  <div className="font-medium text-sm">Screen Node</div>
                  <div className="text-xs opacity-80 mt-1">UI interface</div>
                </div>
                <div className="bg-orange-500 border-orange-600 border-2 text-white px-4 py-2 rounded-lg text-center">
                  <div className="font-medium text-sm">User Node</div>
                  <div className="text-xs opacity-80 mt-1">Actor persona</div>
                </div>
                <div className="bg-purple-500 border-purple-600 border-2 text-white px-4 py-2 rounded-lg text-center">
                  <div className="font-medium text-sm">Process Node</div>
                  <div className="text-xs opacity-80 mt-1">Business logic</div>
                </div>
              </div>
            </ComponentShowcase>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-surface-primary border-t border-surface-border mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center text-text-secondary">
            <div className="text-sm">RecapMap Visual AGI Orchestration Platform</div>
            <div className="text-xs mt-1">Component Library & Technical Documentation</div>
            <div className="text-xs mt-2 text-accent-primary">
              Built with React + TypeScript + TailwindCSS + Zustand + React Flow
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
