# localStorage Persistence Strategy for RecapMap

**Document Version**: 1.0  
**Created**: June 8, 2025  
**Status**: Ready for Implementation  
**Priority**: High

## 📋 Executive Summary

This document outlines the complete strategy for implementing localStorage persistence in RecapMap's mind map editor to ensure nodes and connections persist after page refresh. The current implementation has a critical gap where `nodeStore` (containing all mind map data) lacks persistence while `projectStore` has partial persistence.

## 🔍 Current State Analysis

### ✅ What's Working
- **projectStore**: Has localStorage persistence via Zustand's `persist` middleware
- **Project metadata**: Name, description, version, settings persist correctly
- **Manual persistence**: `saveToLocalStorage()` and `loadFromLocalStorage()` methods exist
- **Zustand DevTools**: Debugging infrastructure in place

### ❌ Critical Gaps
- **nodeStore**: No persistence middleware - **core issue**
- **Mind map data loss**: Nodes and connections disappear on page refresh
- **Cross-store sync**: No synchronization between project and node data changes
- **Inconsistent state**: Project can show as "not modified" when nodes change

### 📊 Store Architecture
```
┌─────────────────┬─────────────────┬─────────────────┐
│   nodeStore     │  projectStore   │    uiStore      │
│  (NO persist)   │  (HAS persist)  │  (transient)    │
├─────────────────┼─────────────────┼─────────────────┤
│ • nodes[]       │ • project{}     │ • canvas{}      │
│ • connections[] │ • validation    │ • panels{}      │
│ • selectedIds[] │ • autoSave      │ • notifications │
└─────────────────┴─────────────────┴─────────────────┘
```

## 🎯 Recommended Implementation Strategy

### Phase 1: Core Persistence (Immediate - Sprint 1)

#### 1.1 Add Persist Middleware to nodeStore
**File**: `src/stores/nodeStore.ts`

**Current Structure**:
```typescript
export const useNodeStore = create<NodeStore>()(
  devtools(
    (set, get) => ({ ... }),
    { name: 'recapmap-node-store' }
  )
)
```

**Target Structure**:
```typescript
export const useNodeStore = create<NodeStore>()(
  devtools(
    persist(
      (set, get) => ({ ... }),
      {
        name: 'recapmap-node-store',
        partialize: (state) => ({
          nodes: state.nodes,
          connections: state.connections,
          // Exclude transient UI state
        }),
        version: 1,
      }
    ),
    { name: 'recapmap-node-store' }
  )
)
```

#### 1.2 Configure Persistence Settings
```typescript
const PERSISTENCE_CONFIG = {
  storageKey: 'recapmap-node-store',
  version: 1,
  excludeFields: ['selectedNodeIds'], // Transient UI state
  includeFields: ['nodes', 'connections'], // Core data
}
```

#### 1.3 Test Basic Persistence
**Test Scenarios**:
- ✅ Create nodes → refresh → verify persistence
- ✅ Create connections → refresh → verify relationships  
- ✅ Update node properties → refresh → verify changes
- ✅ Delete operations → refresh → verify removal

### Phase 2: Cross-Store Synchronization (Sprint 1-2)

#### 2.1 Node Changes → Project Status Sync
**Implementation**: Store subscription pattern

```typescript
// Location: projectStore.ts or new sync utility
useNodeStore.subscribe((state, prevState) => {
  const dataChanged = 
    state.nodes !== prevState.nodes || 
    state.connections !== prevState.connections

  if (dataChanged) {
    const projectStore = useProjectStore.getState()
    projectStore.markAsModified()
    
    // Auto-save if enabled
    if (projectStore.project.autoSave) {
      setTimeout(() => projectStore.saveToLocalStorage(), 100)
    }
  }
})
```

#### 2.2 Synchronization Events Map
```typescript
// Node Store Events → Project Store Actions
NODE_ADDED           → markAsModified()
NODE_UPDATED         → markAsModified()  
NODE_DELETED         → markAsModified() + clearValidation()
CONNECTION_ADDED     → markAsModified()
CONNECTION_DELETED   → markAsModified() + clearValidation()
BULK_IMPORT         → markAsModified() + clearValidation()

// Project Store Events → Node Store Actions  
PROJECT_LOADED      → clearSelection()
PROJECT_RESET       → clearAll()
VALIDATION_COMPLETE → updateNodeValidationStatus()
```

#### 2.3 Reactive Project Summary
**Current Issue**: `getProjectSummary()` uses snapshot data
**Solution**: Make it reactive to nodeStore changes

### Phase 3: Enhanced Features (Sprint 2-3)

#### 3.1 Storage Management
```typescript
const STORAGE_LIMITS = {
  MAX_NODES: 1000,
  MAX_CONNECTIONS: 2000, 
  MAX_STORAGE_SIZE: 5 * 1024 * 1024, // 5MB
  WARNING_THRESHOLD: 0.8, // 80% usage warning
}
```

#### 3.2 Error Handling & Recovery
```typescript
const ERROR_SCENARIOS = {
  QUOTA_EXCEEDED: 'localStorage quota exceeded',
  CORRUPTED_DATA: 'Data corruption detected',
  VERSION_MISMATCH: 'Schema version incompatible',
  PARSE_ERROR: 'JSON parsing failed',
}
```

#### 3.3 Migration Strategy
```typescript
const MIGRATION_VERSIONS = {
  v1: { // Initial version
    nodes: 'Add default metadata fields',
    connections: 'Add metadata.priority field'
  },
  v2: { // Future version
    nodes: 'Enhanced type system',
    connections: 'Business rule properties'
  }
}
```

## 🛠️ Technical Implementation Details

### Data Structure Design

#### Persisted Node Data
```typescript
interface PersistedNodeData {
  nodes: RecapMapNode[]           // Full node objects with positions
  connections: NodeConnection[]   // All connections with metadata
  version: number                 // Schema version for migrations
  timestamp: string               // Last save timestamp
  checksum?: string               // Data integrity check
}
```

#### Excluded from Persistence
```typescript
interface TransientState {
  selectedNodeIds: string[]       // UI selection state
  isValidating: boolean          // Runtime validation state
  dragState: DragState           // Canvas interaction state
  temporaryConnections: Edge[]   // React Flow temporary state
}
```

### Cross-Store Coordination

#### Store Dependencies Map
```
nodeStore (data) 
    ↓ (changes)
projectStore (metadata)
    ↓ (validation triggers)
uiStore (notifications)
    ↓ (panel updates)
panelStore (panel visibility)
```

#### Synchronization Implementation
```typescript
// Central sync coordinator
class StoreSyncManager {
  private subscriptions = new Map()
  
  setupSync() {
    // nodeStore → projectStore
    this.subscriptions.set('node-to-project', 
      useNodeStore.subscribe(this.handleNodeChanges)
    )
    
    // projectStore → nodeStore  
    this.subscriptions.set('project-to-node',
      useProjectStore.subscribe(this.handleProjectChanges)
    )
  }
  
  cleanup() {
    this.subscriptions.forEach(unsub => unsub())
  }
}
```

### Performance Optimization

#### Debounced Persistence
```typescript
const debouncedSave = debounce(() => {
  useProjectStore.getState().saveToLocalStorage()
}, 500) // Wait 500ms after last change
```

#### Selective Serialization
```typescript
const optimizeNodeData = (nodes: RecapMapNode[]) => {
  return nodes.map(node => ({
    ...node,
    // Remove computed/derived fields
    isValid: undefined, // Recalculated on load
    // Compress large arrays if needed
    metadata: compressIfLarge(node.metadata)
  }))
}
```

## 🧪 Testing Strategy

### Unit Tests
**File**: `src/__tests__/stores/persistence.test.ts`

```typescript
describe('localStorage Persistence', () => {
  describe('nodeStore persistence', () => {
    it('persists nodes after page refresh', () => {})
    it('persists connections with metadata', () => {})
    it('excludes transient state', () => {})
    it('handles storage quota exceeded', () => {})
  })
  
  describe('cross-store synchronization', () => {
    it('marks project as modified when nodes change', () => {})
    it('clears validation when nodes deleted', () => {})
    it('updates project summary reactively', () => {})
  })
})
```

### Integration Tests
**File**: `src/__tests__/integration/persistence.integration.test.tsx`

```typescript
describe('Persistence Integration', () => {
  it('full workflow: create → save → refresh → load', () => {})
  it('handles large datasets without performance issues', () => {})
  it('recovers gracefully from corrupted data', () => {})
})
```

### Manual Test Scenarios
```
✅ Create complex mind map → refresh → verify all data
✅ Import large project → verify performance  
✅ Exceed storage quota → verify error handling
✅ Corrupt localStorage → verify recovery
✅ Multiple browser tabs → verify consistency
✅ Incognito mode → verify graceful fallback
```

## 📁 File Changes Required

### Modified Files
```
src/stores/nodeStore.ts          → Add persist middleware
src/stores/projectStore.ts       → Add cross-store sync  
src/stores/index.ts             → Export sync utilities
```

### New Files
```
src/utils/storageManager.ts      → Storage utilities
src/utils/syncManager.ts         → Cross-store sync
src/__tests__/stores/persistence.test.ts → Tests
kb/development/persistence-implementation.md → Impl guide
```

### Configuration Changes
```
package.json                     → No changes needed
vite.config.ts                  → No changes needed  
tsconfig.json                   → No changes needed
```

## 🚀 Implementation Checklist

### Phase 1: Core Persistence ⏱️ 2-3 days
- [ ] Add `persist` middleware to nodeStore
- [ ] Configure partialize to exclude transient state  
- [ ] Test basic node persistence
- [ ] Test connection persistence
- [ ] Verify complex node properties persist
- [ ] Test with existing projectStore persistence

### Phase 2: Cross-Store Sync ⏱️ 3-4 days  
- [ ] Implement nodeStore → projectStore subscription
- [ ] Add markAsModified() trigger on node changes
- [ ] Add clearValidation() trigger on structural changes
- [ ] Make getProjectSummary() reactive
- [ ] Test auto-save coordination
- [ ] Verify project modification status accuracy

### Phase 3: Enhanced Features ⏱️ 3-5 days
- [ ] Add storage quota monitoring
- [ ] Implement error recovery mechanisms  
- [ ] Add data migration system
- [ ] Performance optimization for large datasets
- [ ] Comprehensive test suite
- [ ] Documentation updates

### Phase 4: Quality Assurance ⏱️ 2 days
- [ ] Full integration testing
- [ ] Performance testing with large datasets
- [ ] Browser compatibility testing
- [ ] Error scenario testing
- [ ] User acceptance testing

## 🔧 Configuration Values

### Storage Configuration
```typescript
const STORAGE_CONFIG = {
  NODE_STORE_KEY: 'recapmap-node-store',
  PROJECT_STORE_KEY: 'recapmap-project-store', // existing
  VERSION: 1,
  AUTO_SAVE_DELAY: 500, // ms
  MAX_STORAGE_SIZE: 5 * 1024 * 1024, // 5MB
}
```

### Performance Thresholds
```typescript
const PERFORMANCE_LIMITS = {
  MAX_NODES_AUTO_SAVE: 500,      // Disable auto-save above this
  DEBOUNCE_DELAY: 500,           // ms between saves
  BATCH_SIZE: 100,               // Process in batches
  WARNING_THRESHOLD: 0.8,        // 80% storage usage
}
```

## 🎯 Success Criteria

### Functional Requirements
- ✅ **Data Persistence**: All nodes and connections survive page refresh
- ✅ **Project Sync**: Project modification status reflects node changes  
- ✅ **Performance**: No noticeable lag with 100+ nodes
- ✅ **Error Handling**: Graceful degradation when localStorage fails

### Non-Functional Requirements  
- ✅ **Reliability**: 99.9% data preservation rate
- ✅ **Performance**: <100ms save operations for typical datasets
- ✅ **Storage Efficiency**: <1MB for typical projects (50 nodes)
- ✅ **Browser Support**: Works in all modern browsers

### User Experience Goals
- ✅ **Seamless**: User never loses work due to page refresh
- ✅ **Transparent**: Persistence happens automatically  
- ✅ **Recoverable**: Clear error messages and recovery options
- ✅ **Consistent**: Same experience across browser sessions

## 📞 Next Steps

1. **Review & Approve**: Technical lead review of this strategy
2. **Sprint Planning**: Assign to appropriate sprint(s)  
3. **Implementation**: Follow the phase-based approach
4. **Testing**: Comprehensive testing at each phase
5. **Documentation**: Update user and developer docs
6. **Monitoring**: Track persistence success rates in production

## 📚 Related Documents

- [8-Node System Architecture](../architecture/8-node-system.md)
- [Technical Decisions](../architecture/technical-decisions.md)  
- [Testing Strategy](./testing-strategy.md)
- [RecapMap Design System](../design/design-system.md)

---

**Document Owner**: Development Team  
**Next Review**: After Phase 1 implementation  
**Implementation Target**: Sprint 12-13 (June 2025)
