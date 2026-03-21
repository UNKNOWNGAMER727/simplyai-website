import { Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Landing } from './pages/Landing';
import { Plan } from './pages/Plan';
import { Pricing } from './pages/Pricing';
import { Tools } from './pages/Tools';
import { Legal } from './pages/Legal';
import { Dashboard } from './pages/Dashboard';
import { ToastProvider } from './components/ui/Toast';

function App() {
  const location = useLocation();

  return (
    <ToastProvider>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Routes location={location}>
            <Route path="/" element={<Landing />} />
            {/* Internal pages — hidden from nav but accessible */}
            <Route path="/internal/plan" element={<Plan />} />
            <Route path="/internal/pricing" element={<Pricing />} />
            <Route path="/internal/tools" element={<Tools />} />
            <Route path="/internal/legal" element={<Legal />} />
            <Route path="/internal/dashboard" element={<Dashboard />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </ToastProvider>
  );
}

export default App;
