/**
 * App.tsx - Main Application Router for RecapMap
 * 
 * This is the root component that sets up routing for the RecapMap application.
 * It provides two main routes:
 * - "/" (root) - Main canvas interface with CanvasLayout component
 * - "/template" - Component library and template gallery
 * 
 * Uses React Router for client-side navigation and serves as the entry point
 * for all application functionality including the visual canvas, node editing,
 * and template management systems.
 */
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CanvasLayout } from './components/CanvasLayout';
import { ComponentLibrary } from './components/ComponentLibrary';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CanvasLayout />} />
        <Route path="/template" element={<ComponentLibrary />} />
      </Routes>
    </Router>
  );
}

export default App;
