import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home } from './pages/Home';
import { Plan } from './pages/Plan';
import { Pricing } from './pages/Pricing';
import { Tools } from './pages/Tools';
import { Legal } from './pages/Legal';

const tabs = [
  { to: '/', label: 'Home' },
  { to: '/plan', label: 'The Plan' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/tools', label: 'Tools' },
  { to: '/legal', label: 'Legal' },
];

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-black/[0.04]">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-12">
          <span className="text-[15px] font-semibold tracking-tight">Simply AI</span>
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <NavLink
                key={tab.to}
                to={tab.to}
                end={tab.to === '/'}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-[#1d1d1f] text-white'
                      : 'text-[#86868b] hover:text-[#1d1d1f]'
                  }`
                }
              >
                {tab.label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/plan" element={<Plan />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/legal" element={<Legal />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
