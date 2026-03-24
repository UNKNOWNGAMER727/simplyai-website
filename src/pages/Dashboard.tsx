import { useState, useEffect, useCallback, useRef } from 'react';
import type { ReactElement } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Bell, LayoutDashboard, Terminal, CalendarDays,
  BookOpen, UserPlus, Phone, Users, Bot, DollarSign,
  ChevronLeft, ChevronRight, Menu,
} from 'lucide-react';
import { Overview } from '../components/dashboard/Overview';
import { Clients } from '../components/dashboard/Clients';
import { Leads } from '../components/dashboard/Leads';
import { Bookings } from '../components/dashboard/Bookings';
import { Calls } from '../components/dashboard/Calls';
import { AITeam } from '../components/dashboard/AITeam';
import { Revenue } from '../components/dashboard/Revenue';
import { Calendar } from '../components/dashboard/Calendar';
import { Command } from '../components/dashboard/Command';

// ── Tab config ─────────────────────────────────────────────────────────────

interface TabConfig {
  readonly id: string;
  readonly label: string;
  readonly badge: boolean;
  readonly icon: typeof LayoutDashboard;
  readonly component: () => ReactElement;
}

const TABS: readonly TabConfig[] = [
  { id: 'overview',  label: 'Overview',  badge: false, icon: LayoutDashboard, component: Overview },
  { id: 'command',   label: 'Command',   badge: false, icon: Terminal,        component: Command },
  { id: 'calendar',  label: 'Calendar',  badge: false, icon: CalendarDays,    component: Calendar },
  { id: 'bookings',  label: 'Bookings',  badge: true,  icon: BookOpen,        component: Bookings },
  { id: 'leads',     label: 'Leads',     badge: true,  icon: UserPlus,        component: Leads },
  { id: 'calls',     label: 'Calls',     badge: true,  icon: Phone,           component: Calls },
  { id: 'clients',   label: 'Clients',   badge: false, icon: Users,           component: Clients },
  { id: 'ai-team',   label: 'AI Team',   badge: false, icon: Bot,             component: AITeam },
  { id: 'revenue',   label: 'Revenue',   badge: false, icon: DollarSign,      component: Revenue },
] as const;

const SIDEBAR_EXPANDED_WIDTH = 220;
const SIDEBAR_COLLAPSED_WIDTH = 60;

// ── Dashboard page ─────────────────────────────────────────────────────────

export function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [search, setSearch] = useState('');
  const [fading, setFading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') return window.innerWidth >= 768;
    return true;
  });
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

  // Collapse sidebar by default on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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

  // ── Keyboard shortcuts (1-9 → tabs) ──────────────────────────────────
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
  const sidebarWidth = sidebarOpen ? SIDEBAR_EXPANDED_WIDTH : SIDEBAR_COLLAPSED_WIDTH;

  return (
    <div className="flex min-h-screen bg-[#111] text-white">

      {/* ── Sidebar ───────────────────────────────────────── */}
      <aside
        className="fixed top-0 left-0 h-full z-50 flex flex-col"
        style={{
          width: sidebarWidth,
          background: '#161616',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          transition: 'width 220ms cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {/* Brand + toggle */}
        <div
          className="flex items-center px-4 shrink-0"
          style={{
            height: 64,
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            justifyContent: sidebarOpen ? 'space-between' : 'center',
          }}
        >
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
                className="text-base font-semibold tracking-tight text-white whitespace-nowrap overflow-hidden"
              >
                Simply AI
              </motion.span>
            )}
          </AnimatePresence>
          <button
            type="button"
            onClick={() => setSidebarOpen((v) => !v)}
            className="p-1.5 rounded-lg text-[#86868b] hover:text-white hover:bg-white/8 transition-colors cursor-pointer shrink-0"
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-3 space-y-0.5 px-2">
          {TABS.map((tab, idx) => {
            const isActive = tab.id === activeTab;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => switchTab(tab.id)}
                title={!sidebarOpen ? tab.label : undefined}
                className={`relative w-full flex items-center rounded-lg transition-all duration-150 cursor-pointer group ${
                  sidebarOpen ? 'gap-3 px-3 py-2.5' : 'justify-center px-0 py-2.5'
                } ${
                  isActive
                    ? 'bg-[#0071e3]/12 text-white'
                    : 'text-[#86868b] hover:text-white hover:bg-white/6'
                }`}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <motion.span
                    layoutId="sidebar-indicator"
                    className="absolute left-0 top-1 bottom-1 w-0.5 rounded-full bg-[#0071e3]"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}

                <span className="relative shrink-0">
                  <Icon size={17} />
                  {tab.badge && (
                    <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-red-500" />
                  )}
                </span>

                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.15 }}
                      className="text-sm font-medium whitespace-nowrap overflow-hidden flex-1 text-left"
                    >
                      {tab.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Keyboard hint */}
                {sidebarOpen && (
                  <span
                    className={`text-[10px] font-mono shrink-0 transition-colors ${
                      isActive ? 'text-[#0071e3]/60' : 'text-white/15 group-hover:text-white/30'
                    }`}
                  >
                    {idx + 1}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom gradient fade */}
        <div
          className="h-8 shrink-0 pointer-events-none"
          style={{ background: 'linear-gradient(to top, #161616, transparent)' }}
        />
      </aside>

      {/* ── Main area ─────────────────────────────────────── */}
      <div
        className="flex flex-col flex-1 min-w-0"
        style={{
          marginLeft: sidebarWidth,
          transition: 'margin-left 220ms cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {/* ── Top header ──────────────────────────────────── */}
        <header
          className="sticky top-0 z-40 flex items-center gap-4 px-6"
          style={{
            height: 64,
            background: 'rgba(17,17,17,0.92)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setSidebarOpen((v) => !v)}
            className="md:hidden shrink-0 p-1.5 rounded-lg text-[#86868b] hover:text-white hover:bg-white/8 transition-colors cursor-pointer"
            aria-label="Toggle sidebar"
          >
            <Menu size={18} />
          </button>

          {/* Current tab label */}
          <span className="text-sm font-semibold text-white/60 shrink-0 hidden sm:block">
            {currentTab.label}
          </span>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Search */}
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868b]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              className="w-full pl-9 pr-4 py-1.5 rounded-full bg-white/6 border border-white/8 text-sm text-white placeholder-[#86868b] focus:outline-none focus:border-[#0071e3]/60 transition-colors"
            />
          </div>

          {/* Notifications */}
          <button
            type="button"
            className="shrink-0 p-2 rounded-full text-[#86868b] hover:text-white hover:bg-white/8 transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
          </button>
        </header>

        {/* ── Tab content ─────────────────────────────────── */}
        <main className="flex-1 px-6 py-8 max-w-[1400px] w-full mx-auto">
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
    </div>
  );
}
