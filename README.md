# RecapMap - Visual AGI Orchestration Platform

**RecapMap** is a revolutionary visual business logic design platform that transforms how teams conceptualize, design, and implement software systems. By combining intuitive mindmap-style visual design with AI-assisted code generation, RecapMap bridges the gap between business vision and technical implementation.

## 🎯 Vision Statement

*"Where human creativity meets AI expertise to design the future of business logic"*

RecapMap empowers everyone from VC CEOs to developers to design complex business logic through visual mindmaps, which then generate production-ready YAML specifications for AI-assisted code generation. It's Figma meets n8n meets GitHub Copilot.

## 🚀 Current Status: Foundation Phase

This React frontend is in **Phase 1 development** - building the core visual editing platform with the revolutionary 8-node business modeling system.

### ✅ Completed Foundation
- ✅ **Project Architecture**: Complete technical specification and roadmap
- ✅ **8-Node System Design**: Universal business logic vocabulary defined
- ✅ **Knowledge Base**: Comprehensive documentation (50,000+ words)
- ✅ **React Setup**: Vite + TypeScript + TailwindCSS + Zustand foundation

### 🔨 Currently Building
- 🔨 **Visual Editor**: React Flow-based mindmap canvas
- 🔨 **8-Node Components**: Custom node types with property panels
- 🔨 **State Management**: Zustand stores for nodes, panels, chat
- 🔨 **Basic YAML Export**: Transform visual design to specifications

## 🧠 The 8-Node Universal Business Language

RecapMap introduces a revolutionary approach to business logic modeling through 8 semantic node types that can represent any business process:

### Core Node Types
```yaml
Base Node (Abstract):     # Foundation pattern for all nodes
├── Use Case             # Feature anchors and business capabilities
├── Screen               # User interface representations  
├── User                 # Actors, personas, and stakeholders
├── Process/Tool         # Business capabilities and operations
├── Storage              # Data persistence and management
├── Flow Controller      # Decision logic and conditional flows
└── Error/Rejection      # Failsafe handling and edge cases
```

### Why 8 Nodes Are Revolutionary
- **Universal Coverage**: Any business logic can be modeled with these 8 types
- **Semantic Clarity**: Each node type has specific business meaning
- **AI-Friendly**: Structured format perfect for AI code generation
- **Scalable**: From simple workflows to enterprise architectures
- **Collaborative**: Non-technical stakeholders can participate meaningfully

## 🏗️ Technical Architecture

### Frontend Stack
```yaml
Technology Stack:
  Framework: "React 18 + TypeScript 5"
  Build Tool: "Vite (lightning-fast development)"
  Styling: "TailwindCSS (utility-first design system)"
  State Management: "Zustand (simple, performant)"
  Visual Engine: "React Flow (node-based editor)"
  Component Architecture: "Atomic Design (atoms → organisms)"

Development Principles:
  Code Quality: "TypeScript-first with strict typing"
  Component Size: "Enforced limits for maintainability"
  Testing: "Vitest + React Testing Library"
  Performance: "Optimized for large mindmaps (1000+ nodes)"
```

### Integration Architecture
```yaml
Backend Integration:
  API Layer: "RESTful APIs with Java Spring Boot backend"
  Real-Time: "WebSocket collaboration via Socket.IO"
  Authentication: "JWT tokens with refresh mechanism"
  Data Sync: "Optimistic updates with conflict resolution"

AI Integration:
  Multi-Agent Chat: "Distributed AI collaboration system"
  YAML Generation: "Semantic business logic export"
  Code Generation: "AI-assisted implementation from specs"
  Strategic Analysis: "Timeline trees for decision exploration"
```

## 🎨 User Experience Philosophy

### Floating Widget Dashboard
RecapMap features a revolutionary **floating widget dashboard** inspired by Windows 11 panel management:

- **Draggable Property Panels**: Context-sensitive editing for each node type
- **Multi-Agent Chat Widgets**: AI collaboration windows for strategic thinking
- **Real-Time Collaboration**: Live cursors and presence indicators
- **Desktop-First Design**: No responsive compromise - optimized for productivity

### Visual Design Principles
- **Clarity Over Complexity**: Clean, professional interface
- **Context-Aware**: Smart panels that adapt to user actions
- **Collaboration-Native**: Built for multi-user team environments
- **Performance-Optimized**: Smooth interactions even with large mindmaps

## 📚 Knowledge Base

Comprehensive documentation is available in the `/kb` directory:

- **[Project Vision Overview](kb/Project-Vision-Overview.md)** - Business strategy and market positioning
- **[8-Node System Architecture](kb/8-Node-System-Architecture.md)** - Complete node specifications
- **[UI/UX Design Specifications](kb/UI-UX-Design-Specifications.md)** - Visual design and interaction patterns
- **[Multi-Agent Chat System](kb/Multi-Agent-Chat-System.md)** - AI collaboration architecture
- **[Technical Architecture Decisions](kb/Technical-Architecture-Decisions.md)** - Technology choices and patterns
- **[Development Phases Roadmap](kb/Development-Phases-Roadmap.md)** - 12-month development plan
- **[YAML and AI Integration](kb/YAML-and-AI-Integration.md)** - Semantic export and code generation

## 🛠️ Development Setup

### Prerequisites
- **Node.js 18+** (Latest LTS recommended)
- **VS Code** with recommended extensions
- **Git** for version control

### Quick Start
```cmd
# Clone and setup
git clone [repository-url]
cd recapmap-core-react

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser
# Navigate to http://localhost:5173
```

### Development Scripts
```cmd
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run test         # Run tests with Vitest
```

### Project Structure
```
src/
├── components/      # React components (atomic design)
│   ├── atoms/       # Basic UI elements
│   ├── molecules/   # Simple combinations
│   ├── organisms/   # Complex business components
│   ├── templates/   # Layout patterns
│   └── pages/       # Application screens
├── stores/          # Zustand state management
├── hooks/           # Custom React hooks
├── types/           # TypeScript type definitions
├── utils/           # Pure utility functions
├── services/        # API and external service integration
└── constants/       # Application constants
```

## 🎯 Development Roadmap

### Phase 1: Foundation & MVP (Months 1-3)
- **Sprint 1**: Visual Foundation - React Flow canvas with 8-node system
- **Sprint 2**: Node Intelligence - Property panels and relationships
- **Sprint 3**: Basic YAML Export - Transform mindmaps to specifications

### Phase 2: Collaboration & Intelligence (Months 4-6)
- **Sprint 4**: Backend Integration - Java API connection and persistence
- **Sprint 5**: Real-Time Collaboration - Multi-user editing and WebSockets
- **Sprint 6**: AI Agent Foundation - Multi-agent chat system

### Phase 3: Advanced Intelligence (Months 7-9)
- **Sprint 7**: Multi-Agent Intelligence - Strategic AI collaboration
- **Sprint 8**: Enterprise Features - Advanced permissions and scaling
- **Sprint 9**: Advanced YAML & Code Generation - Production-ready exports

### Phase 4: Platform Ecosystem (Months 10-12)
- **Sprint 10**: Plugin Architecture - Extensible platform with marketplace
- **Sprint 11**: API Ecosystem - Public APIs and integrations
- **Sprint 12**: Global Scale & Enterprise - Worldwide deployment ready

## 🌟 Why RecapMap Will Change Everything

### For Business Leaders
- **10x Faster**: From business idea to working prototype
- **Universal Language**: Bridge communication gaps between business and technical teams
- **AI-Powered**: Leverage collective AI expertise for better decisions
- **Visual Clarity**: See the entire business logic at a glance

### For Developers
- **Production-Ready Specs**: No more ambiguous requirements
- **AI-Assisted Coding**: YAML exports optimized for GitHub Copilot
- **Pattern Reuse**: Learn from successful implementations
- **Faster Delivery**: Focus on implementation, not requirement interpretation

### For Organizations
- **Knowledge Preservation**: Business logic survives team changes
- **Consistent Quality**: AI validation ensures completeness
- **Scalable Growth**: Reusable patterns accelerate new projects
- **Competitive Advantage**: Faster time-to-market with higher quality

## 🤝 Contributing

RecapMap is currently in private development. For questions or collaboration opportunities:

- **Technical Questions**: Check the knowledge base documentation
- **Architecture Discussions**: Review Technical Architecture Decisions
- **Feature Requests**: Reference the Development Phases Roadmap
- **Business Inquiries**: See Project Vision Overview

## 📊 Success Metrics

### Phase 1 Targets
- **User Engagement**: 80% of users create complete mindmaps (>10 nodes)
- **Feature Adoption**: 70% of mindmaps use 5+ different node types
- **Export Usage**: 60% of completed mindmaps exported to YAML
- **User Retention**: 40% return within 7 days

### Long-term Vision
- **Enterprise Adoption**: 20+ organizations with 10+ active users
- **AI Sophistication**: 20+ multi-agent discussions per project
- **Platform Ecosystem**: 50+ plugins in marketplace
- **Revenue Growth**: $100K+ Monthly Recurring Revenue

## 🔮 The Future is Visual

RecapMap represents the future of software development - where business vision translates directly into technical implementation through visual design and AI assistance. We're not just building a tool; we're creating a new way of thinking about business logic.

Join us in revolutionizing how the world builds software.

---

*"The best way to predict the future is to design it visually"*
