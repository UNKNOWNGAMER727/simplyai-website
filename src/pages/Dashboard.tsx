import { useState, useEffect, useCallback, useRef } from 'react';
import type { ReactElement } from 'react';
import { motion } from 'framer-motion';
import { Search, Bell } from 'lucide-react';
import { Overview } from '../components/dashboard/Overview';
import { Clients } from '../components/dashboard/Clients';
import { Leads } from '../components/dashboard/Leads';
import { Bookings } from '../components/dashboard/Bookings';
import { Calls } from '../components/dashboard/Calls';
import { AITeam } from '../components/dashboard/AITeam';
import { Revenue } from '../components/dashboard/Revenue';
import { Calendar } from '../components/dashboard/Calendar';

// ── Tab config ─────────────────────────────────────────────────────────────

interface TabConfig {
  readonly id: string;
  readonly label: string;
  readonly badge: boolean;
  readonly component: () => ReactElement;
}

const TABS: readonly TabConfig[] = [
  { id: 'overview', label: 'Overview', badge: false, component: Overview },
  { id: 'calendar', label: 'Calendar', badge: false, component: Calendar },
  { id: 'bookings', label: 'Bookings', badge: true, component: Bookings },
  { id: 'leads', label: 'Leads', badge: true, component: Leads },
  { id: 'calls', label: 'Calls', badge: true, component: Calls },
  { id: 'clients', label: 'Clients', badge: false, component: Clients },
  { id: 'ai-team', label: 'AI Team', badge: false, component: AITeam },
  { id: 'revenue', label: 'Revenue', badge: false, component: Revenue },
] as const;

// ── Dashboard page ─────────────────────────────────────────────────────────

export function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [search, setSearch] = useState('');
  const [fading, setFading] = useState(false);
  const pendingTab = useRef<string | null>(null);

  // Override body background for dashboard
  useEffect(() => {
    const prev = document.body.style.background;
    document.body.style.background = '#111';
    document.body.style.color = '#fff';
    return () => {
      document.body.style.background = prev;
      document.body.style.color = '';
    };
  }, []);

  // ── Tab switch with CSS fade ──────────────────────────────────────────
  const switchTab = useCallback((tabId: string) => {
    if (tabId === activeTab) return;
    pendingTab.current = tabId;
    setFading(true);
  }, [activeTab]);

  useEffect(() => {
    if (!fading || !pendingTab.current) return;
    const timeout = setTimeout(() => {
      setActiveTab(pendingTab.current!);
      pendingTab.current = null;
      setFading(false);
    }, 100);
    return () => clearTimeout(timeout);
  }, [fading]);

  // ── Keyboard shortcuts (1-8 → tabs) ──────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      const idx = parseInt(e.key, 10);
      if (idx >= 1 && idx <= TABS.length) {
        e.preventDefault();
        switchTab(TABS[idx - 1].id);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [switchTab]);

  const currentTab = TABS.find((t) => t.id === activeTab) ?? TABS[0];
  const ActiveComponent = currentTab.component;

  return (
    <div className="min-h-screen bg-[#111] text-white">
      {/* ── Sticky header ─────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#111]/90 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-6">
          {/* Brand */}
          <span className="text-xl font-semibold tracking-tight shrink-0">
            Simply AI
          </span>

          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868b]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search clients, bookings, calls…"
              className="w-full pl-10 pr-4 py-2 rounded-full bg-[#1a1a1a] border border-white/10 text-sm text-white placeholder-[#86868b] focus:outline-none focus:border-[#0071e3] transition-colors"
            />
          </div>

          {/* Notifications (placeholder) */}
          <button
            type="button"
            className="shrink-0 p-2 rounded-full text-[#86868b] hover:text-white hover:bg-[#1a1a1a] transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
          </button>
        </div>

        {/* Gradient accent line */}
        <div
          className="h-px w-full"
          style={{
            background: 'linear-gradient(to right, #0071e3, #bf5af2)',
          }}
        />
      </header>

      {/* ── Tab bar ───────────────────────────────────────── */}
      <nav className="sticky top-[73px] z-40 bg-[#111]/90 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-3 flex gap-2 overflow-x-auto scrollbar-none">
          {TABS.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => switchTab(tab.id)}
                className={`relative shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#0071e3]/15 text-white'
                    : 'bg-[#1a1a1a] text-[#86868b] hover:text-white hover:bg-[#252525]'
                }`}
              >
                {tab.label}
                {tab.badge && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500" />
                )}
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute -bottom-3 left-2 right-2 h-0.5 rounded-full bg-[#0071e3]"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* ── Tab content ───────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div
          style={{
            opacity: fading ? 0 : 1,
            transition: 'opacity 150ms ease',
          }}
        >
          <ActiveComponent key={activeTab} />
        </div>
      </main>
    </div>
  );
}
