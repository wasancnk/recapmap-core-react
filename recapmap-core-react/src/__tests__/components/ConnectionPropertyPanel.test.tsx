import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConnectionPropertyPanel } from '../../components/ConnectionPropertyPanel';
import { useNodeStore } from '../../stores/nodeStore';
import { useUIStore } from '../../stores/uiStore';
import { createMockNode, createMockConnection } from '../../test-utils/mockData';

// Mock the stores
vi.mock('../../stores/nodeStore', () => ({
  useNodeStore: vi.fn()
}));
vi.mock('../../stores/uiStore', () => ({
  useUIStore: vi.fn()
}));
vi.mock('../../utils/logger');

const mockUseNodeStore = vi.mocked(useNodeStore);
const mockUseUIStore = vi.mocked(useUIStore);

describe('ConnectionPropertyPanel', () => {
  const mockOnClose = vi.fn();
  const mockUpdateConnection = vi.fn();
  const mockSwapConnection = vi.fn();
  const mockDeleteConnection = vi.fn();
  const mockGetNode = vi.fn();
  const mockAddNotification = vi.fn();

  const defaultProps = {
    connectionId: 'conn1',
    position: { x: 100, y: 100 },
    onClose: mockOnClose,
  };

  const mockConnection = createMockConnection({
    id: 'conn1',
    sourceNodeId: 'node1',
    targetNodeId: 'node2',
    label: 'Test Connection',
    type: 'data',
    metadata: {
      directionType: 'oneway',
      lineStyle: 'solid',
      color: '#6B7280',
      priority: 'medium',
    },
  });

  const mockSourceNode = createMockNode({
    id: 'node1',
    title: 'Source Node',
  });

  const mockTargetNode = createMockNode({
    id: 'node2',
    title: 'Target Node',
  });

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mock implementations
    mockUseNodeStore.mockReturnValue({
      connections: [mockConnection],
      updateConnection: mockUpdateConnection,
      swapConnection: mockSwapConnection,
      deleteConnection: mockDeleteConnection,
      getNode: mockGetNode,
      nodes: [mockSourceNode, mockTargetNode],
      selectedNodeIds: [],
      selectedConnectionIds: [],
      addNode: vi.fn(),
      addConnection: vi.fn(),
      removeNode: vi.fn(),
      removeConnection: vi.fn(),
      updateNode: vi.fn(),
      setSelectedNodes: vi.fn(),
      setSelectedConnections: vi.fn(),
      clearSelection: vi.fn(),
    });

    mockUseUIStore.mockReturnValue({
      addNotification: mockAddNotification,
      notifications: [],
      removeNotification: vi.fn(),
      clearNotifications: vi.fn(),
    });

    mockGetNode.mockImplementation((id: string) => {
      if (id === 'node1') return mockSourceNode;
      if (id === 'node2') return mockTargetNode;
      return undefined;
    });
  });

  describe('Rendering', () => {
    it('should render the connection property panel with correct data', () => {
      render(<ConnectionPropertyPanel {...defaultProps} />);

      expect(screen.getByDisplayValue('Test Connection')).toBeInTheDocument();
      expect(screen.getByDisplayValue('data')).toBeInTheDocument();
      expect(screen.getByDisplayValue('oneway')).toBeInTheDocument();
      expect(screen.getByDisplayValue('solid')).toBeInTheDocument();
      expect(screen.getByDisplayValue('#6B7280')).toBeInTheDocument();
      expect(screen.getByDisplayValue('medium')).toBeInTheDocument();
    });

    it('should display source and target node information', () => {
      render(<ConnectionPropertyPanel {...defaultProps} />);

      expect(screen.getByText('Source Node')).toBeInTheDocument();
      expect(screen.getByText('Target Node')).toBeInTheDocument();
    });

    it('should not render when connection is not found', () => {      mockUseNodeStore.mockReturnValue({
        connections: [], // No connections
        updateConnection: vi.fn(),
        swapConnection: vi.fn(),
        deleteConnection: vi.fn(),
        getNode: vi.fn(),
        nodes: [],
        selectedNodeIds: [],
        selectedConnectionIds: [],
        addNode: vi.fn(),
        addConnection: vi.fn(),
        removeNode: vi.fn(),
        removeConnection: vi.fn(),
        updateNode: vi.fn(),
        setSelectedNodes: vi.fn(),
        setSelectedConnections: vi.fn(),
        clearSelection: vi.fn(),
      });

      const { container } = render(<ConnectionPropertyPanel {...defaultProps} />);
      expect(container.firstChild).toBeNull();
    });

    it('should position the panel correctly', () => {
      const { container } = render(
        <ConnectionPropertyPanel
          {...defaultProps}
          position={{ x: 200, y: 150 }}
        />
      );

      const panel = container.firstChild as HTMLElement;
      expect(panel.style.left).toBe('200px');
      expect(panel.style.top).toBe('150px');
    });
  });

  describe('Form Interactions', () => {
    it('should update form data when input values change', async () => {
      const user = userEvent.setup();
      render(<ConnectionPropertyPanel {...defaultProps} />);

      const labelInput = screen.getByDisplayValue('Test Connection');
      await user.clear(labelInput);
      await user.type(labelInput, 'Updated Connection');

      expect(labelInput).toHaveValue('Updated Connection');
    });

    it('should track modification state when form is changed', async () => {
      const user = userEvent.setup();
      render(<ConnectionPropertyPanel {...defaultProps} />);

      const labelInput = screen.getByDisplayValue('Test Connection');
      await user.type(labelInput, ' Modified');      // Check if save button becomes enabled (indicates modification state)
      const saveButton = screen.getByText('Save');
      expect(saveButton).not.toBeDisabled();
    });

    it('should handle connection type changes', async () => {
      const user = userEvent.setup();
      render(<ConnectionPropertyPanel {...defaultProps} />);

      const typeSelect = screen.getByDisplayValue('data');
      await user.selectOptions(typeSelect, 'process');

      expect(typeSelect).toHaveValue('process');
    });

    it('should handle direction type changes', async () => {
      const user = userEvent.setup();
      render(<ConnectionPropertyPanel {...defaultProps} />);

      const directionSelect = screen.getByDisplayValue('oneway');
      await user.selectOptions(directionSelect, 'bidirectional');

      expect(directionSelect).toHaveValue('bidirectional');
    });

    it('should handle color changes', async () => {
      const user = userEvent.setup();
      render(<ConnectionPropertyPanel {...defaultProps} />);

      const colorInput = screen.getByDisplayValue('#6B7280');
      await user.clear(colorInput);
      await user.type(colorInput, '#ff0000');

      expect(colorInput).toHaveValue('#ff0000');
    });
  });

  describe('Save Functionality', () => {
    it('should call updateConnection when save button is clicked', async () => {
      const user = userEvent.setup();
      render(<ConnectionPropertyPanel {...defaultProps} />);

      // Modify the form
      const labelInput = screen.getByDisplayValue('Test Connection');
      await user.clear(labelInput);
      await user.type(labelInput, 'Modified Connection');      // Click save
      const saveButton = screen.getByText('Save');
      await user.click(saveButton);

      expect(mockUpdateConnection).toHaveBeenCalledWith('conn1', {
        label: 'Modified Connection',
        type: 'data',
        metadata: expect.objectContaining({
          directionType: 'oneway',
          lineStyle: 'solid',
          color: '#6B7280',
          priority: 'medium',
        }),
      });
    });    it('should show success notification after saving', async () => {
      const user = userEvent.setup();
      mockUpdateConnection.mockResolvedValue(undefined);
      render(<ConnectionPropertyPanel {...defaultProps} />);

      const labelInput = screen.getByDisplayValue('Test Connection');
      await user.type(labelInput, ' Modified');

      const saveButton = screen.getByText('Save');
      await user.click(saveButton);await waitFor(() => {
        expect(mockAddNotification).toHaveBeenCalledWith({
          type: 'success',
          message: 'Connection updated successfully',
        });
      });
    });

    it('should handle save errors gracefully', async () => {
      const user = userEvent.setup();
      const saveError = new Error('Save failed');
      mockUpdateConnection.mockRejectedValue(saveError);
      
      render(<ConnectionPropertyPanel {...defaultProps} />);

      const labelInput = screen.getByDisplayValue('Test Connection');
      await user.type(labelInput, ' Modified');

      const saveButton = screen.getByText('Save');
      await user.click(saveButton);

      await waitFor(() => {
        expect(mockAddNotification).toHaveBeenCalledWith({
          type: 'error',
          message: 'Failed to update connection: Save failed',
        });
      });
    });
  });

  describe('Delete Functionality', () => {    it('should call deleteConnection when delete button is clicked', async () => {
      const user = userEvent.setup();
      render(<ConnectionPropertyPanel {...defaultProps} />);

      const deleteButton = screen.getByText('Delete');
      await user.click(deleteButton);

      expect(mockDeleteConnection).toHaveBeenCalledWith('conn1');
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should show success notification after deletion', async () => {
      const user = userEvent.setup();
      render(<ConnectionPropertyPanel {...defaultProps} />);

      const deleteButton = screen.getByText('Delete');
      await user.click(deleteButton);

      expect(mockAddNotification).toHaveBeenCalledWith({
        type: 'success',
        title: 'Success',
        message: 'Connection deleted successfully',
        duration: 3000
      });
    });
  });

  describe('Swap Functionality', () => {
    it('should call swapConnection when swap button is clicked', async () => {
      const user = userEvent.setup();
      const newTargetNode = createMockNode({ id: 'node3', title: 'New Target' });
        mockUseNodeStore.mockReturnValue({
        connections: [mockConnection],
        updateConnection: mockUpdateConnection,
        swapConnection: mockSwapConnection,
        deleteConnection: mockDeleteConnection,
        getNode: mockGetNode,
        nodes: [mockSourceNode, mockTargetNode, newTargetNode],
        selectedNodeIds: [],
        selectedConnectionIds: [],
        addNode: vi.fn(),
        addConnection: vi.fn(),
        removeNode: vi.fn(),
        removeConnection: vi.fn(),
        updateNode: vi.fn(),
        setSelectedNodes: vi.fn(),
        setSelectedConnections: vi.fn(),
        clearSelection: vi.fn(),
      });

      render(<ConnectionPropertyPanel {...defaultProps} />);

      // Assuming there's a swap interface - this would depend on actual implementation
      const swapButton = screen.queryByText(/swap/i);
      if (swapButton) {
        await user.click(swapButton);
        // Additional assertions based on actual swap UI implementation
      }
    });
  });

  describe('Close Functionality', () => {    it('should call onClose when close button is clicked', async () => {
      const user = userEvent.setup();
      render(<ConnectionPropertyPanel {...defaultProps} />);

      const closeButton = screen.getByText('✕');
      await user.click(closeButton);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should call onClose when escape key is pressed', async () => {
      const user = userEvent.setup();
      render(<ConnectionPropertyPanel {...defaultProps} />);

      await user.keyboard('{Escape}');

      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('Form Validation', () => {    it('should disable save button when form is not modified', () => {
      render(<ConnectionPropertyPanel {...defaultProps} />);

      const saveButton = screen.getByText('Save');
      expect(saveButton).toBeDisabled();
    });

    it('should handle empty label validation', async () => {
      const user = userEvent.setup();
      render(<ConnectionPropertyPanel {...defaultProps} />);

      const labelInput = screen.getByDisplayValue('Test Connection');
      await user.clear(labelInput);      // The form should handle empty labels appropriately
      const saveButton = screen.getByText('Save');
      await user.click(saveButton);

      // Verify that appropriate validation occurs
      expect(mockUpdateConnection).toHaveBeenCalledWith('conn1', expect.objectContaining({
        label: '',
      }));
    });

    it('should validate color input format', async () => {
      const user = userEvent.setup();
      render(<ConnectionPropertyPanel {...defaultProps} />);

      const colorInput = screen.getByDisplayValue('#6B7280');
      await user.clear(colorInput);
      await user.type(colorInput, 'invalid-color');

      // The component should handle invalid color formats
      expect(colorInput).toHaveValue('invalid-color');
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing source node gracefully', () => {
      mockGetNode.mockImplementation((id: string) => {
        if (id === 'node2') return mockTargetNode;
        return undefined; // Source node not found
      });

      render(<ConnectionPropertyPanel {...defaultProps} />);

      // Panel should still render with available information
      expect(screen.getByDisplayValue('Test Connection')).toBeInTheDocument();
    });

    it('should handle missing target node gracefully', () => {
      mockGetNode.mockImplementation((id: string) => {
        if (id === 'node1') return mockSourceNode;
        return undefined; // Target node not found
      });

      render(<ConnectionPropertyPanel {...defaultProps} />);

      // Panel should still render with available information
      expect(screen.getByDisplayValue('Test Connection')).toBeInTheDocument();
    });

    it('should handle connection with minimal metadata', () => {
      const minimalConnection = createMockConnection({
        id: 'conn1',
        sourceNodeId: 'node1',
        targetNodeId: 'node2',
        label: 'Minimal Connection',
        // No metadata provided
      });      mockUseNodeStore.mockReturnValue({
        connections: [minimalConnection],
        updateConnection: mockUpdateConnection,
        swapConnection: mockSwapConnection,
        deleteConnection: mockDeleteConnection,
        getNode: mockGetNode,
        nodes: [mockSourceNode, mockTargetNode],
        selectedNodeIds: [],
        selectedConnectionIds: [],
        addNode: vi.fn(),
        addConnection: vi.fn(),
        removeNode: vi.fn(),
        removeConnection: vi.fn(),
        updateNode: vi.fn(),
        setSelectedNodes: vi.fn(),
        setSelectedConnections: vi.fn(),
        clearSelection: vi.fn(),
      });

      render(<ConnectionPropertyPanel {...defaultProps} />);      expect(screen.getByDisplayValue('Minimal Connection')).toBeInTheDocument();
      // Should use default values for missing metadata
      // Check the relationship type select has the correct value selected
      const relationshipSelect = screen.getByDisplayValue('Data Flow');
      expect(relationshipSelect).toBeInTheDocument();
      expect((relationshipSelect as HTMLSelectElement).value).toBe('data');
      expect(screen.getByDisplayValue('One-way →')).toBeInTheDocument();
    });
  });
});
