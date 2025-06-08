import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Development helper: expose stores globally for testing
if (import.meta.env.DEV) {
  import('./stores').then((stores) => {
    (window as unknown as { recapMapStores: typeof stores }).recapMapStores = stores;
    console.log('🔧 Stores exposed globally for development testing');
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
