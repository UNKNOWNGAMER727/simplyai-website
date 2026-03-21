import { useState, useEffect } from 'react';
import type { ReactElement } from 'react';
import { Overview } from '../components/dashboard/Overview';
import { Clients } from '../components/dashboard/Clients';
import { Leads } from '../components/dashboard/Leads';
import { Bookings } from '../components/dashboard/Bookings';
import { Calls } from '../components/dashboard/Calls';
import { AITeam } from '../components/dashboard/AITeam';
import { Revenue } from '../components/dashboard/Revenue';

// ── Tab config ─────────────────────────────────────────────────────────────

interface TabConfig {
  readonly id: string;
  readonly label: string;
  readonly badge: boolean;
  readonly component: () => ReactElement;
}

const TABS: readonly TabConfig[] = [
  { id: 'overview', label: 'Overview', badge: false, component: Overview },
  { id: 'clients', label: 'Clients', badge: false, component: Clients },
  { id: 'leads', label: 'Leads', badge: true, component: Leads },
  { id: 'bookings', label: 'Bookings', badge: true, component: Bookings },
  { id: 'calls', label: 'Calls', badge: true, component: Calls },
  { id: 'ai-team', label: 'AI Team', badge: false, component: AITeam },
  { id: 'revenue', label: 'Revenue', badge: false, component: Revenue },
] as const;

// ── Dashboard page ─────────────────────────────────────────────────────────

export function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [search, setSearch] = useState('');

  // Override body background for dashboard
  useEffect(() => {
    const prev = document.body.style.background;
    document.body.style.background = '#111';
    document.body.style.color = '#fff';
    return () => { document.body.style.background = prev; document.body.style.color = ''; };
  }, []);

  const currentTab = TABS.find((t) => t.id === activeTab) ?? TABS[0];
  const ActiveComponent = currentTab.component;

  return (
    <div className="min-h-screen bg-[#111] text-white">
      {/* ── Sticky header ─────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#111]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-6">
          {/* Brand */}
          <span className="text-xl font-semibold tracking-tight shrink-0">
            Simply AI
          </span>

          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868b]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search clients, bookings, calls…"
              className="w-full pl-10 pr-4 py-2 rounded-full bg-[#1a1a1a] border border-white/10 text-sm text-white placeholder-[#86868b] focus:outline-none focus:border-[#0071e3] transition-colors"
            />
          </div>
        </div>
      </header>

      {/* ── Tab bar ───────────────────────────────────────── */}
      <nav className="sticky top-[73px] z-40 bg-[#111]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-3 flex gap-2 overflow-x-auto scrollbar-none">
          {TABS.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#0071e3] text-white'
                    : 'bg-[#1a1a1a] text-[#86868b] hover:text-white hover:bg-[#252525]'
                }`}
              >
                {tab.label}
                {tab.badge && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* ── Tab content ───────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <ActiveComponent key={activeTab} />
      </main>
    </div>
  );
}
