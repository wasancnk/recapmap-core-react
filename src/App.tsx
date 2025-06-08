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
