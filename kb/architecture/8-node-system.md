# 8-Node System Architecture

**Last Updated**: June 8, 2025  
**Purpose**: Core business logic model for RecapMap visual development platform

## Overview

The 8-node system provides a **complete vocabulary** for describing any business application through visual modeling. This universal language ensures that complex business logic can be captured visually and translated perfectly into AI task descriptions.

## The Complete Node System

### 1. Use Case Node - Feature/Intent Anchor
**Color**: Blue | **Icon**: 🎯  
**Purpose**: Top-level business feature or user story definition

**Properties**: priority, acceptance_criteria, business_value, stakeholders, success_metrics  
**Role**: Triggers complete YAML module generation for entire features

### 2. Screen Node - UI Representation  
**Color**: Green | **Icon**: 📱  
**Purpose**: Visual interface components and user experience design

**Properties**: screenType, layoutType, components, responsive, accessibility, navigation_flow  
**Role**: Maps to React components and UI layouts (no framework selection - platform handles implementation)

### 3. User Node - Actor/Persona
**Color**: Orange | **Icon**: 👤  
**Purpose**: Define who interacts with the system and their capabilities

**Properties**: role, permissions, access_level, authentication_method, workflow_entry_points  
**Role**: Establishes security boundaries and access control

### 4. Process Node - Function/Service/Capability
**Color**: Purple | **Icon**: ⚙️  
**Purpose**: Business logic operations and system capabilities

**Properties**: capability_name, input_parameters, output_parameters, service_type, external_dependencies  
**Role**: Maps to Java backend capabilities and service modules

### 5. Storage Node - Data Layer
**Color**: Yellow | **Icon**: 💾  
**Purpose**: Data persistence, caching, and state management

**Properties**: storage_type, data_schema, indexing_strategy, access_patterns, security_classification  
**Role**: Triggers schema YAML for databases and data stores

### 6. Controller Node - Decision Points
**Color**: Red | **Icon**: 🎮  
**Purpose**: Flow control, business rules, and decision logic

**Properties**: control_type, business_rules, conditions, routing_rules, timeout_settings  
**Role**: Implements conditional logic and workflow routing

### 7. Error Node - Exception Handling
**Color**: Gray | **Icon**: ⚠️  
**Purpose**: Error conditions, validation failures, and exception flows

**Properties**: error_type, severity_level, user_notification, retry_strategy, recovery_actions  
**Role**: Defines comprehensive error handling and user feedback

### 8. Base Node - Abstract Foundation
**Purpose**: Provides common structure and behavior for all other nodes

**Shared Properties**: id, title, description, position, metadata, connections, validation states  
**Common Behaviors**: Click handling, chat integration, drag/drop, connection management

## Integration Patterns

### Node Relationships
- **Use Cases** connect to all other node types to define complete features
- **Users** connect to Screens and Processes they can access
- **Screens** connect to Processes they trigger and Storage they display
- **Processes** connect to Storage for data operations and Controllers for flow logic
- **Controllers** route between Processes and handle Error conditions
- **Storage** nodes can be shared across multiple Processes

### YAML Export Integration
Each node contributes to structured YAML generation:
- **Business Requirements**: Use Case + User nodes define what to build
- **UI Specifications**: Screen nodes define interface requirements
- **Backend Logic**: Process + Storage + Controller nodes define system behavior
- **Error Handling**: Error nodes define exception management

### AI Code Generation Context
The complete node graph provides perfect context for AI agents:
- Visual business logic becomes structured task descriptions
- Node relationships define system architecture
- Properties provide implementation details
- Validation ensures completeness before generation

## Architecture Benefits

- **Complete Coverage**: 8 nodes can model any business application
- **Visual Clarity**: Complex logic becomes intuitive visual flows
- **AI-Optimized**: Perfect translation to structured AI task descriptions
- **Technology Agnostic**: Business logic independent of implementation details
- **Scalable**: From simple workflows to enterprise applications
