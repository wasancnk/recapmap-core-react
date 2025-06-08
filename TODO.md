# RecapMap TODO

## Immediate Next Steps

### 🔗 API Contract Setup
- [ ] Extract TypeScript types from `src/types/index.ts` 
- [ ] Create OpenAPI/JSON Schema specification
- [ ] Generate Java POJOs from schema
- [ ] Set up contract versioning (v1, v2, etc.)

### 🏗️ Backend Development  
- [ ] Initialize Java Spring Boot project
- [ ] Implement data models from contracts
- [ ] Create REST API endpoints
- [ ] Add comprehensive validation layer

### 🔄 Integration
- [ ] Frontend API client generation
- [ ] End-to-end integration tests
- [ ] CI/CD pipeline for contract validation

## Current Status
✅ **Frontend Foundation Complete**
- All tests passing (60/60)
- Connection swap functionality working
- Logger system implemented
- Zero compilation errors

## Notes
- Use zero-trust approach: backend validates everything
- Maintain living documentation through tests
- Keep API contracts as single source of truth
