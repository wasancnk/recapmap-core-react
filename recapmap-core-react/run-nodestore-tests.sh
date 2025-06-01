#!/bin/bash
echo "Running nodeStore tests..."
cd "d:/workspace_recapmap/recapmap-core-react/recapmap-core-react"
npx vitest run src/__tests__/stores/nodeStore.test.ts --reporter=verbose
