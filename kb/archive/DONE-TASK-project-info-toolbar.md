# TASK-project-info-toolbar.md

## Task Overview
Implement editable project name and description fields in the left-side toolbar to provide contextual project information and improve user experience.

## Background & Context

### Current Situation
- Toolbar currently shows "Add Nodes" as the main header
- No visible project identification or metadata
- Project store already has `name` and `description` fields ready for UI integration
- Users have no way to view or edit project information from the main interface

### Research Completed
- ✅ **Toolbar Architecture Analysis**: Examined `src/components/Toolbar.tsx` structure
- ✅ **Project Store Research**: Confirmed `ProjectState` interface has `name: string` and `description?: string`
- ✅ **Store Actions Discovery**: Identified `updateProject(updates: Partial<ProjectState>)` method
- ✅ **UI Styling Analysis**: Studied node edit panel patterns for consistent styling
- ✅ **Data Flow Understanding**: Confirmed localStorage persistence via Zustand middleware

## Requirements

### Functional Requirements
1. **Project Name Display/Edit**
   - Show current project name in toolbar (larger, prominent text)
   - Click-to-edit inline editing
   - Auto-save changes to project store
   - Fallback to "Untitled Project" if empty

2. **Project Description Display/Edit**
   - Show current description below project name
   - Click-to-edit with textarea for multi-line content
   - Auto-save changes to project store
   - Placeholder: "Add description..." when empty

3. **Project Status Display**
   - Show modification status (saved/modified indicator)
   - Display last updated time (relative, e.g., "2h ago")
   - Show node count for quick reference

### Design Requirements
1. **No Section Header** - Remove dedicated "Project Details" header for cleaner look
2. **Typography Hierarchy**:
   - Project name: `text-base font-semibold` (larger than current "Add Nodes")
   - Description: `text-sm opacity-80` (secondary, readable)
   - Status: `text-xs text-text-muted` (subtle)
3. **Layout**: Position above existing "Add Nodes" section
4. **Consistent Styling**: Follow exact styling patterns from node edit panels

## Technical Implementation

### File to Modify
- **Primary**: `src/components/Toolbar.tsx`
- **No other files need changes** (uses existing project store infrastructure)

### Key Implementation Points

#### 1. State Management
```tsx
// State for inline editing (already added)
const [isEditingName, setIsEditingName] = useState(false);
const [isEditingDescription, setIsEditingDescription] = useState(false);
const [editName, setEditName] = useState(project.name);
const [editDescription, setEditDescription] = useState(project.description || '');
```

#### 2. Event Handlers
```tsx
// Auto-save with debouncing
const handleNameSave = () => {
  updateProject({ name: editName });
  setIsEditingName(false);
};

const handleDescriptionSave = () => {
  updateProject({ description: editDescription });
  setIsEditingDescription(false);
};

// ESC key handling for cancel
// Enter key handling for name field
```

#### 3. UI Structure
```tsx
{/* Project Information Section - ADD ABOVE "Add Nodes" */}
<div className="mb-4 space-y-2">
  {/* Project Name */}
  {isEditingName ? (
    <input /> // Edit mode with exact node panel styling
  ) : (
    <div onClick={() => setIsEditingName(true)} /> // Display mode with hover
  )}
  
  {/* Project Description */}
  {isEditingDescription ? (
    <textarea /> // Edit mode
  ) : (
    <div onClick={() => setIsEditingDescription(true)} /> // Display mode
  )}
  
  {/* Status Line */}
  <div className="text-xs text-text-muted">
    {/* Status indicator • Last updated • Node count */}
  </div>
</div>
```

### Exact Styling Reference

#### Input Field Styling (from EditorPanel.tsx)
```css
className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-gray-100 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
```

#### Textarea Styling
```css
className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-gray-100 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
```

#### Display Mode Styling
```css
// Project Name (clickable)
className="text-base font-semibold text-text-primary cursor-pointer hover:bg-surface-secondary/50 rounded px-2 py-1 transition-colors"

// Description (clickable)
className="text-sm text-text-secondary opacity-80 cursor-pointer hover:bg-surface-secondary/50 rounded px-2 py-1 transition-colors"
```

## User Experience Flow

### View Mode
1. Project name displayed prominently at top
2. Description shown below (truncated if very long)
3. Status line with save state, time, and node count
4. Hover effects indicate fields are clickable

### Edit Mode
1. Click project name → converts to input field with focus
2. Click description → converts to textarea with focus
3. Auto-save after brief pause in typing (500ms debounce)
4. ESC cancels edit, Enter saves (name field only)
5. Click outside field saves changes
6. Visual feedback during save ("Saving..." → "Saved")

### Auto-Save Behavior
- Debounced saves (500ms after typing stops)
- Visual feedback: "Saving..." indicator
- Uses existing `updateProject()` method
- Leverages existing localStorage persistence

## Integration Points

### Existing Store Usage
```tsx
const { project, updateProject } = useProjectStore();
// project.name: string
// project.description?: string
// updateProject(updates: Partial<ProjectState>): void
```

### No Conflicts With
- ✅ LocalStorage persistence strategy (parallel development)
- ✅ Existing toolbar functionality
- ✅ Node creation workflow
- ✅ Grid controls
- ✅ Canvas actions

## Success Criteria

### Functional
- [ ] Project name visible and editable in toolbar
- [ ] Description visible and editable in toolbar
- [ ] Auto-save works correctly
- [ ] Changes persist across browser sessions
- [ ] Proper fallbacks for empty fields
- [ ] ESC/Enter keyboard shortcuts work

### Visual
- [ ] Consistent with node edit panel styling
- [ ] Proper typography hierarchy
- [ ] Clean hover/focus states
- [ ] Status indicators are clear and useful
- [ ] No visual conflicts with existing toolbar elements

### Technical
- [ ] No breaking changes to existing functionality
- [ ] Uses existing project store infrastructure
- [ ] Proper error handling for edge cases
- [ ] Performance: no unnecessary re-renders

## Testing Checklist

### Manual Testing
- [ ] Edit project name - saves correctly
- [ ] Edit description - saves correctly  
- [ ] ESC cancels edit mode
- [ ] Enter saves name field
- [ ] Click outside saves changes
- [ ] Empty fields show proper placeholders
- [ ] Status indicators update correctly
- [ ] Changes persist after page refresh

### Edge Cases
- [ ] Very long project names
- [ ] Very long descriptions
- [ ] Special characters in project name
- [ ] Empty project data
- [ ] Rapid typing (debounce works)
- [ ] Multiple quick edits

## Implementation Notes

### Styling Consistency
- Follow exact same input styling as `src/components/panels/EditorPanel.tsx`
- Use semantic design tokens where available (`text-text-primary`, `bg-surface-secondary`)
- Fall back to direct Tailwind classes for consistency with existing panels

### Performance Considerations
- Debounce auto-save to avoid excessive store updates
- Use `useState` for local editing state to avoid store thrashing
- Sync local state with project store when project changes

### Accessibility
- Proper focus management in edit modes
- Clear visual indicators for interactive elements
- Keyboard navigation support (Tab, ESC, Enter)

### Future Extensibility
- Layout supports additional project metadata
- Status line can accommodate more project info
- Consistent with potential project settings panel

## Dependencies
- ✅ All required stores already imported
- ✅ All required styling patterns identified
- ✅ No new external dependencies needed
- ✅ Compatible with existing localStorage strategy

## Delivery
- Single feature implementation in `Toolbar.tsx`
- Self-contained change with no breaking modifications
- Can be implemented and tested independently
- Ready for parallel development with localStorage improvements
