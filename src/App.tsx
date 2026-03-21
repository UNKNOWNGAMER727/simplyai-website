import { Routes, Route } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Plan } from './pages/Plan';
import { Pricing } from './pages/Pricing';
import { Tools } from './pages/Tools';
import { Legal } from './pages/Legal';
import { Dashboard } from './pages/Dashboard';
import { ToastProvider } from './components/ui/Toast';

function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/internal/plan" element={<Plan />} />
        <Route path="/internal/pricing" element={<Pricing />} />
        <Route path="/internal/tools" element={<Tools />} />
        <Route path="/internal/legal" element={<Legal />} />
        <Route path="/internal/dashboard" element={<Dashboard />} />
      </Routes>
    </ToastProvider>
  );
}

export default App;
