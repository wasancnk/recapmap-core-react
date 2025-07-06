/**
 * Example test file demonstrating test-utils usage
 * 
 * This file shows best practices for testing RecapMap components
 * using the centralized test utilities.
 */

import React from 'react'
import {
  render,
  screen,
  waitFor,
  userEvent,
  createMockNode,
  createMockNodeGraph,
  createAllNodeTypes,
  createMockStoreState,
  vi,
  expect,
  describe,
  test,
  beforeEach
} from '../test-utils'
import type { RecapMapNode } from '../types'

// Mock a simple component for demonstration
const MockNodeCard = ({ node }: { node: RecapMapNode }) => (
  <div data-testid={`node-${node.id}`}>
    <h3>{node.title}</h3>
    <p>{node.type}</p>
    <button onClick={() => console.log('clicked')}>
      Edit {node.type}
    </button>
  </div>
)

describe('Test Utils Examples', () => {
  describe('Basic Mock Usage', () => {
    test('should create and render a mock node', () => {
      const mockNode = createMockNode({
        type: 'case',
        title: 'User Login',
        description: 'Test login functionality'
      })

      render(<MockNodeCard node={mockNode} />)

      expect(screen.getByText('User Login')).toBeInTheDocument()
      expect(screen.getByText('case')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Edit case' })).toBeInTheDocument()
    })

    test('should create nodes of all types', () => {
      const allNodes = createAllNodeTypes()
      
      expect(allNodes).toHaveLength(12)
      expect(allNodes.map(n => n.type)).toEqual([
        'case', 'view', 'persona', 'interface', 'process', 'capability',
        'outcome', 'resource', 'knowledge', 'storage', 'task', 'note'
      ])
    })
  })

  describe('Complex Scenarios', () => {
    test('should create a connected node graph', () => {
      const { nodes, connections } = createMockNodeGraph()
      
      expect(nodes).toHaveLength(3)
      expect(connections).toHaveLength(2)
      
      // Check the flow: case → interface → storage
      expect(nodes[0].type).toBe('case')
      expect(nodes[1].type).toBe('interface')
      expect(nodes[2].type).toBe('storage')
      
      expect(connections[0].sourceNodeId).toBe('case-1')
      expect(connections[0].targetNodeId).toBe('interface-1')
    })

    test('should handle user interactions', async () => {
      const mockNode = createMockNode({ type: 'case', title: 'Test Case' })
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      
      render(<MockNodeCard node={mockNode} />)
      
      const button = screen.getByRole('button', { name: 'Edit case' })
      await userEvent.click(button)
      
      expect(consoleSpy).toHaveBeenCalledWith('clicked')
      
      consoleSpy.mockRestore()
    })
  })

  describe('Store State Testing', () => {
    test('should create complete mock store state', () => {
      const mockState = createMockStoreState()
      
      expect(mockState.nodeStore.nodes).toHaveLength(12) // All node types
      expect(mockState.uiStore.canvas.zoom).toBe(1)
      expect(mockState.projectStore.metadata.name).toBe('Test Project')
    })
  })

  describe('Async Operations', () => {
    test('should wait for async updates', async () => {
      const AsyncComponent = () => {
        const [loading, setLoading] = React.useState(true)
        
        React.useEffect(() => {
          setTimeout(() => setLoading(false), 100)
        }, [])
        
        return loading ? <div>Loading...</div> : <div>Loaded!</div>
      }
      
      render(<AsyncComponent />)
      
      expect(screen.getByText('Loading...')).toBeInTheDocument()
      
      await waitFor(() => {
        expect(screen.getByText('Loaded!')).toBeInTheDocument()
      })
    })
  })
})

// Example of testing with mocked stores (would require actual store setup)
describe('Store Integration Examples', () => {
  beforeEach(() => {
    // Reset any store state between tests
    vi.clearAllMocks()
  })

  test('example store test pattern', () => {
    // This demonstrates the pattern - actual implementation would use real stores
    const mockStore = {
      addNode: vi.fn(),
      nodes: []
    }
    
    const testNode = createMockNode({ type: 'case' })
    mockStore.addNode(testNode)
    
    expect(mockStore.addNode).toHaveBeenCalledWith(testNode)
  })
})
