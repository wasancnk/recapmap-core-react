# 📋 Remaining TODOs - RecapMap Development

**Date**: July 8, 2025  
**Status**: 4 Tasks Remaining from Previous Session  
**Priority**: High - User Experience Improvements  

---

## **1. 🔧 Toolbar Collapsible Sections**

**Goal**: Create clean, organized toolbar with expandable sections

**Tasks**:
- [ ] Make **Grid Options** collapsible 
- [ ] Make **Presentation Mode** controls collapsible
- [ ] Make **Data Management/Export** section collapsible
- [ ] Implement smooth expand/collapse animations
- [ ] Add section icons and clear visual hierarchy

**Files to modify**:
- `src/components/Toolbar.tsx`
- Add state management for section visibility
- Implement accordion-style UI components

---

## **2. 📝 Dual Markdown Editor System (Notion Replacement)**

**Goal**: Create comprehensive knowledge capture & processing system with two editor types

### **Phase 1: Node-Attached Detail Panel**
**Tasks**:
- [ ] **Install Library**: `react-markdown-editor-lite`
- [ ] **Create New Panel Type**: Rich markdown editor for detailed documentation
- [ ] **Update Panel Structure**:
  - Summary Panel (existing)
  - Editor Panel (rename "description" → "Brief Description")
  - **NEW** Detail Panel (full markdown editor)
- [ ] **Scope**: Make available for ALL node types
- [ ] Add panel switching/navigation UI

### **Phase 2: Central Capture Editor**
**Tasks**:
- [ ] **Central Editor UI**: Bottom-center positioned markdown editor
- [ ] **Real-time AI Suggestions**: Live parsing and node suggestions as user types
- [ ] **Content Persistence**: Keep original notes with relationship tracking to created nodes
- [ ] **Batch Processing Mode**: Review and approve AI-suggested nodes
- [ ] **Node Creation Pipeline**: One-click conversion from suggestions to actual nodes

### **Phase 3: Backend Integration (Future)**
**Tasks**:
- [ ] **Java Backend API**: Sophisticated content parsing service
- [ ] **Custom LangChain System**: Advanced AI processing pipeline
- [ ] **Cloud Processing**: Real-time content analysis and node suggestions
- [ ] **Mobile Sync**: Voice-to-text and photo annotation integration

**Files to modify**:
- `src/components/panels/` - Add new DetailPanel component
- `src/components/CentralEditor.tsx` - NEW: Central capture editor
- `src/stores/panelStore.ts` - Add panel type management
- `src/stores/editorStore.ts` - NEW: Central editor state management
- `src/types/index.ts` - Update panel and editor type definitions
- Package installation and configuration

---

## **3. 🐛 Fix Panel Drag vs Text Selection Bug**

**Issue**: Can't select text in input fields because mouse drag moves entire panel

**Tasks**:
- [ ] **Implement proper drag handles** for panel movement
- [ ] **Detect text selection vs panel drag** behavior
- [ ] **Fix input field interaction** - prevent drag when selecting text
- [ ] **Scope**: All node panels with input fields (including new markdown editor)
- [ ] Add visual indicators for drag vs interaction zones

**Files to modify**:
- `src/components/panels/` - All panel components
- `src/hooks/useDraggable.ts` - Update drag detection logic
- Add event handling for text selection vs drag differentiation

---

## **4. 🎨 Fix Connector Label Background Color**

**Issue**: Connector labels still use blue tint background instead of GitHub dark theme

**Tasks**:
- [ ] **Update connector label background** to match canvas color (`#0d1117`)
- [ ] **Remove blue tint** or old theme colors
- [ ] **Ensure text readability** with proper contrast
- [ ] **Scope**: All connection labels and connector styling
- [ ] Test in both dark and bright presentation modes

**Technical Notes**:
- Look for connector/connection label styling
- Should match canvas background (#0d1117 or similar GitHub dark color)
- Ensure WCAG accessibility compliance for text contrast

**Files to modify**:
- `src/components/connections/` - Connection label components
- `src/index.css` - Global connector styling
- Connection-related styling in flow components

---

## 🎯 **Priority Order**

1. **Connector Label Fix** (Quick UI polish)
2. **Toolbar Collapsible Sections** (UX improvement)
3. **Panel Drag Bug Fix** (Critical usability)
4. **Markdown Detail Panel** (Major feature addition)

---

## ✅ **Recently Completed**

- ✅ **Node Color System Redesign**: Professional palette with WCAG compliance
- ✅ **Blueprint & Snippet Nodes**: Added with special patterns and internal-only positioning
- ✅ **Toolbar Arrangement**: Blueprint and Snippet moved to bottom row for visual separation