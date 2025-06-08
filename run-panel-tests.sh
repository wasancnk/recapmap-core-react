#!/bin/bash

# Simple test runner for Node Panel System
echo "Running Node Panel System Tests..."

cd "$(dirname "$0")"/..

# Run specific test files
echo "Running Panel Store tests..."
npx vitest run src/__tests__/stores/panelStore.test.ts

echo "Running Panel Integration tests..."
npx vitest run src/__tests__/integration/NodePanelIntegration.test.ts

echo "Tests completed!"
