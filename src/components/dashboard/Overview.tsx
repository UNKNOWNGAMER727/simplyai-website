import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Zap, Send, Star, Loader2, RefreshCw } from 'lucide-react';
import { bookings as mockBookings, activityFeed as mockActivity } from '../../data/mockData';
import { useToast } from '../ui/Toast';
import { createIssue, invokeHeartbeat, listAgents, listIssues, AGENT_IDS } from '../../services/paperclip';
import { fetchBookings, fetchEventTypes, toBooking } from '../../services/calcom';
import type { Booking } from '../../types/crm';
import type { PaperclipAgent, PaperclipIssue } from '../../services/paperclip';

// ── Activity types ─────────────────────────────────────────────────────────

interface ActivityItem {
  readonly id: string;
  readonly type: 'task' | 'agent' | 'booking' | 'call' | 'review' | 'payment' | 'lead';
  readonly title: string;
  readonly description: string;
  readonly timestamp: string;
}

const typeColors: Record<ActivityItem['type'], string> = {
  task: '#0071e3',
  agent: '#bf5af2',
  booking: '#0071e3',
  call: '#ff9f0a',
  review: '#34c759',
  payment: '#34c759',
  lead: '#ff375f',
};

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function buildActivity(issues: PaperclipIssue[], agents: PaperclipAgent[]): ActivityItem[] {
  const items: ActivityItem[] = [];

  // Recent tasks as activity
  for (const issue of issues.slice(0, 15)) {
    const agent = agents.find((a) => a.id === issue.assigneeAgentId);
    const statusLabel =
      issue.status === 'done' ? 'Completed' :
      issue.status === 'in_progress' ? 'Working on' :
      issue.status === 'todo' ? 'Queued' : issue.status;

    items.push({
      id: `task-${issue.id}`,
      type: 'task',
      title: `${statusLabel}: ${issue.title}`,
      description: agent ? `Assigned to ${agent.name}` : issue.identifier,
      timestamp: issue.updatedAt,
    });
  }

  // Agent heartbeats
  for (const agent of agents) {
    if (agent.lastHeartbeatAt) {
      items.push({
        id: `hb-${agent.id}`,
        type: 'agent',
        title: `${agent.name} heartbeat`,
        description: `Status: ${agent.status} — ${timeAgo(agent.lastHeartbeatAt)}`,
        timestamp: agent.lastHeartbeatAt,
      });
    }
  }

  // Sort by timestamp descending
  items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  return items.slice(0, 12);
}

const staggerContainer = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
};

export function Overview() {
  const [busy, setBusy] = useState<string | null>(null);
  const [agents, setAgents] = useState<PaperclipAgent[]>([]);
  const [issues, setIssues] = useState<PaperclipIssue[]>([]);
  const [todayBookings, setTodayBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const today = new Date().toISOString().split('T')[0];

  const loadData = useCallback(async () => {
    try {
      const [agentData, issueData] = await Promise.all([
        listAgents(),
        listIssues(),
      ]);
      setAgents(agentData);
      setIssues(issueData);

      // Try Cal.com for today's bookings
      try {
        const [rawBookings, eventTypes] = await Promise.all([fetchBookings(), fetchEventTypes()]);
        const converted = rawBookings.map((b) => toBooking(b, eventTypes));
        const todayOnly = converted.filter((b) => b.date === today);
        setTodayBookings(todayOnly.length > 0 ? todayOnly : mockBookings.filter((b) => b.date === '2026-03-20'));
      } catch {
        setTodayBookings(mockBookings.filter((b) => b.date === '2026-03-20'));
      }
    } catch {
      // Paperclip offline — show mock activity
    } finally {
      setLoading(false);
    }
  }, [today]);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [loadData]);

  const activity = agents.length > 0
    ? buildActivity(issues, agents)
    : mockActivity.map((e) => ({ ...e, type: e.type as ActivityItem['type'] }));

  const activeAgents = agents.filter((a) => a.status === 'active' || a.status === 'idle').length;
  const totalTasks = issues.length;
  const doneTasks = issues.filter((t) => t.status === 'done').length;

  const metricCards = [
    { label: 'Agents Online', value: agents.length > 0 ? activeAgents : 5, color: '#0071e3' },
    { label: 'Total Tasks', value: totalTasks || 19, color: '#ff9f0a' },
    { label: 'Completed', value: doneTasks || 12, color: '#34c759' },
    { label: 'Today\'s Bookings', value: todayBookings.length, color: '#bf5af2' },
  ];

  const handleQuickAction = async (action: string) => {
    setBusy(action);
    try {
      switch (action) {
        case 'schedule-day': {
          await createIssue({
            title: 'Plan today\'s schedule and brief Kyle',
            description: `Compile today's schedule: check Cal.com for bookings, check SkipCalls for any overnight calls/leads, check agent statuses, and send Kyle a morning briefing via Telegram. Include: upcoming appointments, pending leads needing follow-up, any blockers.`,
            priority: 'high',
            assigneeAgentId: AGENT_IDS.operationsManager,
          });
          await invokeHeartbeat(AGENT_IDS.operationsManager);
          toast('Daily briefing task sent to Operations Manager');
          break;
        }
        case 'wake-all': {
          const ids = Object.values(AGENT_IDS);
          await Promise.all(ids.map(id => invokeHeartbeat(id)));
          toast(`Woke up all ${ids.length} agents`);
          break;
        }
        case 'content-post': {
          await createIssue({
            title: 'Create and schedule next social media post',
            description: `Check the content calendar and create the next scheduled post for Simply AI. Follow the weekly schedule: Monday=AI tip, Wednesday=customer story/FAQ, Friday=behind-the-scenes, Weekend=community/local. Post to all platforms.`,
            priority: 'medium',
            assigneeAgentId: AGENT_IDS.contentAgent,
          });
          await invokeHeartbeat(AGENT_IDS.contentAgent);
          toast('Content task sent to Content Agent');
          break;
        }
        case 'review-check': {
          await createIssue({
            title: 'Check Google reviews and respond',
            description: `Check Google Business Profile for any new reviews. Respond to ALL reviews within 24 hours. Report status to Operations Manager.`,
            priority: 'medium',
            assigneeAgentId: AGENT_IDS.reviewAgent,
          });
          await invokeHeartbeat(AGENT_IDS.reviewAgent);
          toast('Review check task sent to Review Agent');
          break;
        }
      }
      setTimeout(loadData, 2000);
    } catch (err) {
      toast(`Action failed: ${err}`, 'error');
    } finally {
      setBusy(null);
    }
  };

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-8">
      {/* Quick Actions */}
      <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
        <button
          onClick={() => handleQuickAction('schedule-day')}
          disabled={busy !== null}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0071e3] text-white text-sm font-medium hover:bg-[#0071e3]/80 transition-colors disabled:opacity-50"
        >
          {busy === 'schedule-day' ? <Loader2 size={16} className="animate-spin" /> : <CalendarDays size={16} />}
          Schedule Day
        </button>
        <button
          onClick={() => handleQuickAction('wake-all')}
          disabled={busy !== null}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#34c759]/20 text-[#34c759] text-sm font-medium hover:bg-[#34c759]/30 transition-colors disabled:opacity-50"
        >
          {busy === 'wake-all' ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
          Wake All Agents
        </button>
        <button
          onClick={() => handleQuickAction('content-post')}
          disabled={busy !== null}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#ff375f]/20 text-[#ff375f] text-sm font-medium hover:bg-[#ff375f]/30 transition-colors disabled:opacity-50"
        >
          {busy === 'content-post' ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          Create Post
        </button>
        <button
          onClick={() => handleQuickAction('review-check')}
          disabled={busy !== null}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#bf5af2]/20 text-[#bf5af2] text-sm font-medium hover:bg-[#bf5af2]/30 transition-colors disabled:opacity-50"
        >
          {busy === 'review-check' ? <Loader2 size={16} className="animate-spin" /> : <Star size={16} />}
          Check Reviews
        </button>
      </motion.div>

      {/* Metric Cards */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {metricCards.map((card) => (
          <motion.div
            key={card.label}
            variants={fadeUp}
            className="rounded-2xl px-5 py-6 text-center bg-[#1a1a1a]"
          >
            <p className="text-3xl font-bold" style={{ color: card.color }}>
              {loading ? '—' : card.value}
            </p>
            <p className="mt-1 text-sm text-neutral-400">{card.label}</p>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Today's Agenda */}
        <motion.div variants={fadeUp}>
          <h2 className="mb-4 text-lg font-semibold text-white">Today's Agenda</h2>
          <div className="space-y-3">
            {todayBookings.length === 0 && !loading && (
              <p className="text-sm text-neutral-500">No appointments today.</p>
            )}
            {todayBookings.map((b) => (
              <motion.div
                key={b.id}
                variants={fadeUp}
                className="flex items-center justify-between rounded-xl px-5 py-4 bg-[#1a1a1a]"
              >
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-[#0071e3]">{b.time}</span>
                  <div>
                    <p className="font-medium text-white">{b.clientName}</p>
                    <p className="text-xs text-neutral-400">
                      {b.tier.charAt(0).toUpperCase() + b.tier.slice(1)} &middot;{' '}
                      {b.location === 'in-person' ? b.address : 'Remote'}
                    </p>
                  </div>
                </div>
                <span
                  className="rounded-full px-3 py-1 text-xs font-medium"
                  style={{
                    backgroundColor: b.status === 'confirmed' ? 'rgba(52,199,89,0.15)' : 'rgba(255,159,10,0.15)',
                    color: b.status === 'confirmed' ? '#34c759' : '#ff9f0a',
                  }}
                >
                  {b.status}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Activity Feed */}
        <motion.div variants={fadeUp}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Activity Feed</h2>
            {agents.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#34c759]/15 text-[#34c759] font-medium">Live</span>
                <button onClick={loadData} className="p-1 rounded hover:bg-white/10 transition-colors">
                  <RefreshCw size={12} className="text-gray-500" />
                </button>
              </div>
            )}
          </div>
          <div className="space-y-2">
            {activity.map((event) => (
              <motion.div
                key={event.id}
                variants={fadeUp}
                className="flex items-start gap-3 rounded-xl px-4 py-3 bg-[#1a1a1a]"
              >
                <span
                  className="mt-1 h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: typeColors[event.type] }}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white">{event.title}</p>
                  <p className="text-xs text-neutral-500">{event.description}</p>
                </div>
                <span className="shrink-0 text-xs text-neutral-600">
                  {formatTime(event.timestamp)}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
