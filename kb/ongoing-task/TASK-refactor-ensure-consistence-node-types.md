# Node Type Consistency Refactoring Task

**Date**: July 3, 2025  
**Status**: Discovery Phase Complete  
**Priority**: High - Technical Debt  

## Overview

This task documents the comprehensive analysis of node type inconsistencies throughout the RecapMap codebase. The system has evolved from an 8-node to a 12-node architecture, but several inconsistencies and naming conflicts exist across different layers of the application.

## Major Inconsistencies Discovered

### 1. **System Architecture Evolution Mismatch**

**Issue**: Documentation vs Implementation Disconnect
- **Documentation**: References 8-node system (`kb/8-Node-System-Architecture.md`)
- **Implementation**: Actually uses 12-node system (`src/types/index.ts`)
- **Impact**: Developer confusion, outdated documentation

**Current 12-Node System** (from `src/types/index.ts`):
```typescript
export type NodeType = 
  | 'usecase'      // Business requirements, user stories
  | 'presentation' // Presentation page for keynote-style presentations
  | 'persona'      // User roles, personas, actors (renamed from 'user')
  | 'screen'       // UI screens, interfaces, views  
  | 'process'      // Business processes, tools, systems
  | 'expectation'  // What we expect to achieve or receive (new)
  | 'outcome'      // What was actually achieved or delivered (new)
  | 'resource'     // Files, images, links, resources, documents (renamed from 'attachment')
  | 'knowledge'    // Structured information and insights (new)
  | 'storage'      // Databases, files, data stores
  | 'task'         // Instant work coordination (AI agents, team assignments) (new)
  | 'note'         // General documentation and annotations (new)
```

### 2. **Legacy Node Type References**

**Issue**: Old 8-node types still exist in various places
- **Found in**: `NewCustomNode.tsx`, `SummaryPanel.tsx`, property schemas
- **Problem Types**: `'user'`, `'controller'`, `'error'`, `'base'`
- **Modern Equivalents**: `'persona'`, [removed], [removed], [removed]

**Legacy References Found**:
```typescript
// In NewCustomNode.tsx (OUTDATED)
const nodeTypeConfig = {
  'usecase': { icon: '🎯', label: 'Use Case' },
  'screen': { icon: '📱', label: 'Screen' },
  'user': { icon: '👤', label: 'User' },        // ❌ Should be 'persona'
  'process': { icon: '⚙️', label: 'Process' },
  'storage': { icon: '💾', label: 'Storage' },
  'controller': { icon: '🎮', label: 'Controller' }, // ❌ Removed in 12-node
  'error': { icon: '⚠️', label: 'Error' },          // ❌ Removed in 12-node
  'base': { icon: '🔧', label: 'Base' }              // ❌ Removed in 12-node
};
```

### 3. **Configuration System Fragmentation**

**Issue**: Multiple sources of truth for node type definitions

**Central Config** (`src/config/nodeTypes.ts`):
✅ **Correct**: Uses modern 12-node system with proper categorization

**Legacy Configs** (Various files):
❌ **Incorrect**: Still reference old 8-node system

**Files with outdated configs**:
- `src/components/NewCustomNode.tsx` - Has hardcoded old config
- `src/components/panels/SummaryPanel.tsx` - Uses old type mapping
- `src/components/panels/EditorPanel.new.tsx` - References old types

### 4. **Property Schema Inconsistencies**

**Issue**: Property schemas don't cover all 12 node types

**Missing Schemas** (`src/utils/propertySchemas.ts`):
```typescript
// Complete Property Schema Registry - INCOMPLETE
export const nodePropertySchema: NodePropertySchema = {
  usecase: useCaseProperties,
  screen: screenProperties,
  user: userProperties,              // ❌ Should be 'persona'
  process: processProperties,
  storage: storageProperties,
  controller: controllerProperties,  // ❌ Removed in 12-node
  error: errorProperties,            // ❌ Removed in 12-node
  // ❌ MISSING: presentation, expectation, outcome, resource, knowledge, task, note
}
```

### 5. **Node Store Implementation Gaps**

**Issue**: `createTypedNode` function doesn't handle all 12 types

**Implemented in nodeStore.ts**:
✅ `usecase`, `presentation`, `persona`, `screen`, `process`, `expectation`, `outcome`, `resource`, `knowledge`, `storage`, `task`, `note`

**BUT**: Function still has legacy case handlers for removed types:
❌ Still handles `'user'` (should be `'persona'`)
❌ Default case is unsafe

### 6. **Visual Representation Inconsistencies**

**Issue**: Node visual configs don't match actual available types

**Centralized Config** (`src/config/nodeTypes.ts`):
✅ Complete 12-node system with proper categorization and colors

**Component Usage** (`NewCustomNode.tsx`):
❌ Uses hardcoded legacy config instead of importing centralized config

**Toolbar Implementation** (`Toolbar.tsx`):
✅ Correctly uses `getAllNodeTypes()` from central config

### 7. **Naming Convention Inconsistencies**

**Issue**: Inconsistent property naming patterns across node types

**Examples**:
- `capabilityName` (process) vs `storageName` (storage) vs `controllerName` (controller)
- `personaType` vs `userType` (legacy naming)
- `featureName` vs other `*Name` patterns

### 8. **TypeScript Union Type Safety**

**Issue**: Some files still reference old union types

**Current Correct Union** (`src/types/index.ts`):
```typescript
export type RecapMapNode = 
  | UseCaseNode 
  | PresentationNode
  | PersonaNode 
  | ScreenNode 
  | ProcessNode 
  | ExpectationNode
  | OutcomeNode
  | ResourceNode
  | KnowledgeNode
  | StorageNode 
  | TaskNode
  | NoteNode
```

**Legacy References** (Various files):
❌ Still expect old types like `UserNode`, `ControllerNode`, `ErrorNode`

## Impact Analysis

### High Impact Issues:
1. **Broken Component Rendering**: Components using legacy configs may not render new node types
2. **Missing Property Panels**: New node types lack property editing capabilities
3. **TypeScript Compilation Errors**: Type mismatches in strict mode
4. **Developer Confusion**: Multiple sources of truth create inconsistent behavior

### Medium Impact Issues:
1. **Inconsistent Visual Design**: Node types may have different visual treatments
2. **Property Validation Gaps**: New node types lack validation schemas
3. **Export/Import Errors**: Legacy types may break serialization

### Low Impact Issues:
1. **Documentation Outdated**: 8-node docs vs 12-node reality
2. **Naming Inconsistencies**: Cosmetic but reduce code readability

## Refactoring Strategy

### Phase 1: Core Type System Alignment
1. **Update all component imports** to use centralized `getNodeConfig()` from `src/config/nodeTypes.ts`
2. **Remove hardcoded configs** from components
3. **Update property schemas** to include all 12 node types
4. **Fix TypeScript union type references** throughout codebase

### Phase 2: Legacy Code Removal
1. **Remove support for deprecated types**: `'user'`, `'controller'`, `'error'`, `'base'`
2. **Update migration logic** to handle legacy data gracefully
3. **Clean up documentation** to reflect 12-node system
4. **Update test files** to use modern types

### Phase 3: Consistency Enforcement
1. **Standardize naming conventions** across all node types
2. **Implement consistent property patterns**
3. **Add TypeScript strict mode enforcement**
4. **Create design system documentation** for node types

### Phase 4: Validation & Testing
1. **Comprehensive integration testing** for all 12 node types
2. **Property validation testing** for each type
3. **Visual regression testing** for consistent rendering
4. **Documentation updates** and examples

## Specific Files Requiring Updates

### Critical Updates Required:
- ✅ `src/config/nodeTypes.ts` - Already correct, central source of truth
- ❌ `src/components/NewCustomNode.tsx` - Replace hardcoded config with import
- ❌ `src/components/panels/SummaryPanel.tsx` - Use central config
- ❌ `src/components/panels/EditorPanel.new.tsx` - Fix type references
- ❌ `src/utils/propertySchemas.ts` - Add missing node type schemas

### Documentation Updates Required:
- ❌ `kb/8-Node-System-Architecture.md` - Update to 12-node or archive
- ❌ `kb/architecture/api-contracts.md` - Update API documentation
- ❌ README files and examples - Reflect 12-node system

### Testing Updates Required:
- ❌ Test files referencing old node types
- ❌ Integration tests for property panels
- ❌ Visual testing for all 12 node types

## Implementation Priority

### Immediate (Week 1):
1. Fix `NewCustomNode.tsx` to use centralized config
2. Update property schemas to include missing types
3. Remove legacy type references from components

### Short-term (Week 2-3):
1. Complete property schema implementation
2. Update all panel components to handle 12 types
3. Fix TypeScript compilation warnings

### Medium-term (Month 1):
1. Documentation overhaul to 12-node system
2. Test suite updates and validation
3. Migration utilities for legacy data

### Long-term (Month 2+):
1. Design system consistency enforcement
2. Performance optimization for 12-node system
3. Advanced property validation features

## Success Criteria

### Technical Success:
- [ ] All 12 node types render correctly with proper visual styling
- [ ] All node types have complete property editing capabilities
- [ ] Zero TypeScript compilation errors or warnings
- [ ] Consistent naming conventions across all node properties
- [ ] Single source of truth for node type configurations

### User Experience Success:
- [ ] Consistent visual design across all node types
- [ ] Intuitive property panels for each type
- [ ] Proper tooltips and help text
- [ ] Seamless migration from legacy data

### Developer Experience Success:
- [ ] Clear documentation of 12-node system
- [ ] Type-safe development with IntelliSense
- [ ] Easy addition of new node types in future
- [ ] Comprehensive test coverage

## Questions for Team Discussion

1. **Migration Strategy**: How should we handle existing projects with legacy node types?
2. **Breaking Changes**: Are we comfortable with breaking changes for cleaner architecture?
3. **Documentation**: Should we maintain 8-node docs for historical reference?
4. **Timeline**: What's the acceptable timeline for this refactoring?
5. **Testing**: What level of testing is required before deploying changes?

## Next Steps

1. **Team Review**: Present findings to development team
2. **Priority Agreement**: Confirm implementation priority and timeline
3. **Technical Specification**: Create detailed technical spec for each phase
4. **Implementation Planning**: Break down into specific development tickets
5. **Risk Assessment**: Identify potential risks and mitigation strategies

---

**Note**: This analysis represents a comprehensive audit of the current state. The refactoring will significantly improve code maintainability, type safety, and developer experience while ensuring consistent behavior across all node types.