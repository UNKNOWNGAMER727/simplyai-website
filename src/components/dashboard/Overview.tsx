import { useState, useEffect, useCallback, useMemo } from 'react';
// framer-motion removed — was causing opacity:0 stuck state with async data
import {
  CalendarDays,
  Zap,
  Send,
  Star,
  RefreshCw,
  Phone,
  DollarSign,
  UserPlus,
  Bot,
  CheckCircle2,
  ListTodo,
} from 'lucide-react';
import { activityFeed as mockActivity } from '../../data/mockData';
import { useToast } from '../ui/Toast';
import { SmartAssistList } from '../ui/SmartAssist';
import ActionButton from '../ui/ActionButton';
import { EmptyState } from '../ui/EmptyState';
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
  task:    '#0071e3',
  agent:   '#bf5af2',
  booking: '#34c759',
  call:    '#ff9f0a',
  review:  '#34c759',
  payment: '#30d158',
  lead:    '#ff375f',
};

const typeBgColors: Record<ActivityItem['type'], string> = {
  task:    'rgba(0,113,227,0.12)',
  agent:   'rgba(191,90,242,0.12)',
  booking: 'rgba(52,199,89,0.12)',
  call:    'rgba(255,159,10,0.12)',
  review:  'rgba(52,199,89,0.12)',
  payment: 'rgba(48,209,88,0.12)',
  lead:    'rgba(255,55,95,0.12)',
};

const typeIcons: Record<ActivityItem['type'], typeof Zap> = {
  task:    ListTodo,
  agent:   Bot,
  booking: CalendarDays,
  call:    Phone,
  review:  Star,
  payment: DollarSign,
  lead:    UserPlus,
};

const typeLabels: Record<ActivityItem['type'], string> = {
  task:    'Task',
  agent:   'Agent',
  booking: 'Booking',
  call:    'Call',
  review:  'Review',
  payment: 'Payment',
  lead:    'Lead',
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


export function Overview() {
  const [busy, setBusy] = useState<string | null>(null);
  const [agents, setAgents] = useState<PaperclipAgent[]>([]);
  const [issues, setIssues] = useState<PaperclipIssue[]>([]);
  const [todayBookings, setTodayBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

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

        // Respect hidden bookings from Bookings tab
        let hiddenIds: Set<string>;
        try { hiddenIds = new Set<string>(JSON.parse(localStorage.getItem('hidden-bookings') || '[]')); }
        catch { hiddenIds = new Set<string>(); }

        const todayOnly = converted.filter((b) => b.date === today && !hiddenIds.has(String(b.id)));
        setTodayBookings(todayOnly);
      } catch {
        // Cal.com unavailable — leave empty
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
    {
      label: 'Agents Online',
      value: agents.length > 0 ? activeAgents : 5,
      color: '#0071e3',
      gradient: 'linear-gradient(135deg, rgba(0,113,227,0.15) 0%, rgba(0,113,227,0.04) 100%)',
      icon: Bot,
    },
    {
      label: 'Total Tasks',
      value: totalTasks || 19,
      color: '#ff9f0a',
      gradient: 'linear-gradient(135deg, rgba(255,159,10,0.15) 0%, rgba(255,159,10,0.04) 100%)',
      icon: ListTodo,
    },
    {
      label: 'Completed',
      value: doneTasks || 12,
      color: '#34c759',
      gradient: 'linear-gradient(135deg, rgba(52,199,89,0.15) 0%, rgba(52,199,89,0.04) 100%)',
      icon: CheckCircle2,
    },
    {
      label: "Today's Bookings",
      value: todayBookings.length,
      color: '#bf5af2',
      gradient: 'linear-gradient(135deg, rgba(191,90,242,0.15) 0%, rgba(191,90,242,0.04) 100%)',
      icon: CalendarDays,
    },
  ];

  // ── Smart Assists ──────────────────────────────────────────────────────

  const pausedAgents = agents.filter((a) => a.status === 'paused' || a.status === 'error');

  const smartAssists = useMemo(() => {
    const items: Array<{
      readonly id: string;
      readonly icon: React.ReactNode;
      readonly message: string;
      readonly actionLabel: string;
      readonly onAction: () => void;
    }> = [];

    if (todayBookings.length > 0) {
      items.push({
        id: 'booking-reminders',
        icon: <CalendarDays size={14} />,
        message: `You have ${todayBookings.length} appointment${todayBookings.length > 1 ? 's' : ''} today — need to send reminders?`,
        actionLabel: 'Send Reminders',
        onAction: async () => {
          try {
            await createIssue({
              title: `Send reminders for ${todayBookings.length} appointment(s) today`,
              description: `Review today's bookings and send confirmation reminders to each client. Bookings: ${todayBookings.map((b) => `${b.clientName} at ${b.time}`).join(', ')}`,
              priority: 'high',
              assigneeAgentId: AGENT_IDS.operationsManager,
            });
            await invokeHeartbeat(AGENT_IDS.operationsManager);
            toast('Reminder task created and agent notified');
          } catch (err) {
            toast(`Failed: ${err}`, 'error');
          }
        },
      });
    }

    for (const agent of pausedAgents.slice(0, 1)) {
      items.push({
        id: `agent-attention-${agent.id}`,
        icon: <Zap size={14} />,
        message: `${agent.name} needs attention — status: ${agent.status}`,
        actionLabel: 'Wake Agent',
        onAction: async () => {
          try {
            await createIssue({
              title: `Investigate and restart ${agent.name}`,
              description: `Agent ${agent.name} is in "${agent.status}" state. Check for errors, clear any stuck tasks, and restart.`,
              priority: 'high',
              assigneeAgentId: AGENT_IDS.operationsManager,
            });
            await invokeHeartbeat(agent.id);
            toast(`Wake-up sent to ${agent.name}`);
          } catch (err) {
            toast(`Failed: ${err}`, 'error');
          }
        },
      });
    }

    return items;
  }, [todayBookings, pausedAgents, toast]);

  // ── Quick Actions ──────────────────────────────────────────────────────

  const handleQuickAction = async (action: string) => {
    setBusy(action);
    try {
      switch (action) {
        case 'schedule-day': {
          await createIssue({
            title: 'Plan today\'s schedule and brief Kyle',
            description: `Compile today's schedule: check Cal.com for bookings, check ElevenLabs (Simi) call log for any overnight calls/leads, check agent statuses, and send Kyle a morning briefing via Telegram. Include: upcoming appointments, pending leads needing follow-up, any blockers.`,
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
    <div className="space-y-6">
      {/* Smart Assists */}
      {!loading && smartAssists.length > 0 && (
        <SmartAssistList assists={smartAssists} />
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <ActionButton
          onClick={() => handleQuickAction('schedule-day')}
          icon={<CalendarDays size={16} />}
          label="Schedule Day"
          variant="primary"
          size="md"
          disabled={busy !== null}
        />
        <ActionButton
          onClick={() => handleQuickAction('wake-all')}
          icon={<Zap size={16} />}
          label="Wake All"
          variant="success"
          size="md"
          disabled={busy !== null}
        />
        <ActionButton
          onClick={() => handleQuickAction('content-post')}
          icon={<Send size={16} />}
          label="Create Post"
          variant="accent"
          color="#ff375f"
          size="md"
          disabled={busy !== null}
        />
        <ActionButton
          onClick={() => handleQuickAction('review-check')}
          icon={<Star size={16} />}
          label="Check Reviews"
          variant="accent"
          color="#bf5af2"
          size="md"
          disabled={busy !== null}
        />
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {metricCards.map((card) => {
          const CardIcon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-xl border border-white/6 px-5 py-5 relative overflow-hidden"
              style={{ background: card.gradient }}
            >
              {/* Background icon watermark */}
              <CardIcon
                size={52}
                className="absolute -bottom-2 -right-2 opacity-[0.07]"
                style={{ color: card.color }}
              />
              <div className="flex items-start justify-between mb-2">
                <span
                  className="flex items-center justify-center w-8 h-8 rounded-lg"
                  style={{ backgroundColor: `${card.color}22` }}
                >
                  <CardIcon size={15} style={{ color: card.color }} />
                </span>
              </div>
              <p className="text-3xl font-bold tracking-tight" style={{ color: card.color }}>
                {loading ? '—' : card.value}
              </p>
              <p className="mt-1 text-xs text-neutral-400 font-medium">{card.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Today's Agenda */}
        <div
          className="rounded-xl border border-white/6 overflow-hidden"
          style={{ background: '#1a1a1a' }}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/6">
            <h2 className="text-sm font-semibold text-white">Today's Agenda</h2>
            <span className="text-xs text-neutral-500">
              {todayBookings.length} appointment{todayBookings.length !== 1 ? 's' : ''}
            </span>
          </div>
          {todayBookings.length === 0 && !loading ? (
            <EmptyState
              icon={CalendarDays}
              title="No appointments today"
              description="When customers book at cal.com/simplytech.ai, their appointments will show up here."
            />
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {todayBookings.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.025] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span
                      className="text-xs font-mono font-semibold shrink-0"
                      style={{ color: '#0071e3' }}
                    >
                      {b.time}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-white">{b.clientName}</p>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        {b.tier.charAt(0).toUpperCase() + b.tier.slice(1)} &middot;{' '}
                        {b.location === 'in-person' ? b.address : 'Remote'}
                      </p>
                    </div>
                  </div>
                  <span
                    className="rounded-full px-2.5 py-0.5 text-xs font-medium shrink-0"
                    style={{
                      backgroundColor: b.status === 'confirmed' ? 'rgba(52,199,89,0.15)' : 'rgba(255,159,10,0.15)',
                      color: b.status === 'confirmed' ? '#34c759' : '#ff9f0a',
                    }}
                  >
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Activity Feed */}
        <div
          className="rounded-xl border border-white/6 overflow-hidden"
          style={{ background: '#1a1a1a' }}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/6">
            <h2 className="text-sm font-semibold text-white">Activity Feed</h2>
            {agents.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-full bg-[#34c759]/12 text-[#34c759] font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34c759] animate-pulse" />
                  Live
                </span>
                <button
                  onClick={loadData}
                  className="p-1.5 rounded-lg hover:bg-white/8 transition-colors"
                  aria-label="Refresh activity"
                >
                  <RefreshCw size={12} className="text-gray-500 hover:text-gray-300 transition-colors" />
                </button>
              </div>
            )}
          </div>
          <div className="divide-y divide-white/[0.04]">
            {activity.map((event) => {
              const IconComponent = typeIcons[event.type] ?? Zap;
              return (
                <div
                  key={event.id}
                  className="flex items-start gap-3 px-5 py-3 hover:bg-white/[0.025] transition-colors"
                >
                  <span
                    className="mt-0.5 flex w-6 h-6 shrink-0 items-center justify-center rounded-md"
                    style={{ backgroundColor: typeBgColors[event.type] }}
                  >
                    <IconComponent size={12} style={{ color: typeColors[event.type] }} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded"
                        style={{
                          backgroundColor: typeBgColors[event.type],
                          color: typeColors[event.type],
                        }}
                      >
                        {typeLabels[event.type]}
                      </span>
                    </div>
                    <p className="text-sm text-white leading-snug">{event.title}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">{event.description}</p>
                  </div>
                  <span className="shrink-0 text-[10px] text-neutral-600 mt-0.5">
                    {formatTime(event.timestamp)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
