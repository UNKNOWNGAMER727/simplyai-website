import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Zap, RefreshCw, Send, Loader2, Clock, CheckCircle2 } from 'lucide-react';
import { useToast } from '../ui/Toast';
import ActionButton from '../ui/ActionButton';
import {
  listAgents,
  listIssues,
  createIssue,
  invokeHeartbeat,
  pauseAgent,
  resumeAgent,
  type PaperclipAgent,
  type PaperclipIssue,
} from '../../services/paperclip';

// -- Icon / color maps --------------------------------------------------------

const ICON_MAP: Record<string, string> = {
  star: '\u2B50',
  sparkles: '\u2728',
  search: '\uD83D\uDD0D',
  globe: '\uD83C\uDF10',
  eye: '\uD83D\uDC41\uFE0F',
};

const ROLE_COLORS: Record<string, string> = {
  'Operations Manager': '#0071e3',
  'Lead Handler': '#34c759',
  'Booking Coordinator': '#ff9f0a',
  'Review Agent': '#bf5af2',
  'Content Agent': '#ff375f',
};

const STATUS_RING: Record<string, { color: string; pulse: boolean }> = {
  idle: { color: '#34c759', pulse: true },
  active: { color: '#34c759', pulse: true },
  paused: { color: '#ff9f0a', pulse: false },
  error: { color: '#ff3b30', pulse: false },
};

function timeAgo(iso: string | null): string {
  if (!iso) return 'never';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// -- Component ----------------------------------------------------------------

export function AITeam() {
  const { toast } = useToast();
  const [agents, setAgents] = useState<PaperclipAgent[]>([]);
  const [tasks, setTasks] = useState<PaperclipIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyAgents, setBusyAgents] = useState<Set<string>>(new Set());
  const [assigningTo, setAssigningTo] = useState<string | null>(null);
  const [newTaskText, setNewTaskText] = useState<Record<string, string>>({});

  const fetchData = useCallback(async () => {
    try {
      const [agentData, taskData] = await Promise.all([
        listAgents(),
        listIssues(),
      ]);
      setAgents(agentData);
      setTasks(taskData);
    } catch (err) {
      toast(`Failed to load agents: ${err}`, 'error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleWakeup = async (agent: PaperclipAgent) => {
    setBusyAgents((prev) => new Set(prev).add(agent.id));
    try {
      await invokeHeartbeat(agent.id);
      toast(`Woke up ${agent.name}`);
      setTimeout(fetchData, 2000);
    } catch (err) {
      toast(`Failed to wake ${agent.name}: ${err}`, 'error');
    } finally {
      setBusyAgents((prev) => {
        const next = new Set(prev);
        next.delete(agent.id);
        return next;
      });
    }
  };

  const handlePauseResume = async (agent: PaperclipAgent) => {
    setBusyAgents((prev) => new Set(prev).add(agent.id));
    try {
      if (agent.status === 'paused') {
        await resumeAgent(agent.id);
        toast(`Resumed ${agent.name}`);
      } else {
        await pauseAgent(agent.id);
        toast(`Paused ${agent.name}`);
      }
      setTimeout(fetchData, 1000);
    } catch (err) {
      toast(`Failed: ${err}`, 'error');
    } finally {
      setBusyAgents((prev) => {
        const next = new Set(prev);
        next.delete(agent.id);
        return next;
      });
    }
  };

  const handleAssignTask = async (agent: PaperclipAgent) => {
    const text = newTaskText[agent.id]?.trim();
    if (!text) return;
    setBusyAgents((prev) => new Set(prev).add(agent.id));
    try {
      await createIssue({
        title: text,
        description: text,
        priority: 'medium',
        assigneeAgentId: agent.id,
      });
      toast(`Task assigned to ${agent.name}`);
      setNewTaskText((prev) => ({ ...prev, [agent.id]: '' }));
      setAssigningTo(null);
      setTimeout(fetchData, 1000);
    } catch (err) {
      toast(`Failed to assign task: ${err}`, 'error');
    } finally {
      setBusyAgents((prev) => {
        const next = new Set(prev);
        next.delete(agent.id);
        return next;
      });
    }
  };

  const agentTasks = (agentId: string) =>
    tasks.filter(
      (t) =>
        t.assigneeAgentId === agentId &&
        (t.status === 'todo' || t.status === 'in_progress')
    );

  // -- Throughput stats derived from tasks ------------------------------------

  const doneCount = tasks.filter((t) => t.status === 'done').length;
  const inProgressCount = tasks.filter((t) => t.status === 'in_progress').length;
  const queuedCount = tasks.filter((t) => t.status === 'todo').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-[#0071e3] animate-spin" />
        <span className="ml-3 text-sm text-gray-400">Loading agents from Paperclip...</span>
      </div>
    );
  }

  const activeCount = agents.filter((a) => a.status === 'active' || a.status === 'idle').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">AI Team</h2>
          <p className="text-sm text-gray-500 mt-1">Live from Paperclip</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-[#86868b]">
            {activeCount} of {agents.length} agents online
          </span>
          <button
            onClick={fetchData}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            title="Refresh"
          >
            <RefreshCw size={14} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* Throughput stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Tasks Done', value: doneCount, color: '#34c759' },
          { label: 'In Progress', value: inProgressCount, color: '#0071e3' },
          { label: 'Queued', value: queuedCount, color: '#ff9f0a' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-[#1a1a1a] rounded-xl border border-white/5 px-4 py-3 flex items-center gap-3"
          >
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: stat.color }}
            />
            <div>
              <p className="text-lg font-semibold" style={{ color: stat.color }}>
                {stat.value}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-[#86868b]">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Agent grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {agents.map((agent) => {
          const isBusy = busyAgents.has(agent.id);
          const isAssigning = assigningTo === agent.id;
          const taskText = newTaskText[agent.id] ?? '';
          const color = ROLE_COLORS[agent.name] ?? '#0071e3';
          const icon = ICON_MAP[agent.icon] ?? '\uD83E\uDD16';
          const pendingTasks = agentTasks(agent.id);
          const ring = STATUS_RING[agent.status] ?? { color: '#86868b', pulse: false };

          return (
            <motion.div
              key={agent.id}
              layout
              className="bg-[#1a1a1a] rounded-2xl border border-white/5 p-5 flex flex-col gap-4 hover:-translate-y-0.5 hover:shadow-lg transition-all"
              style={{ borderLeftWidth: 3, borderLeftColor: color }}
            >
              {/* Top row: avatar + name + status */}
              <div className="flex items-start gap-3">
                {/* Avatar with status ring */}
                <div className="relative shrink-0">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                    style={{ backgroundColor: `${color}20` }}
                  >
                    {icon}
                  </div>
                  <div
                    className={`absolute inset-0 rounded-xl ring-2 pointer-events-none${ring.pulse ? ' animate-pulse' : ''}`}
                    style={{ '--tw-ring-color': ring.color } as React.CSSProperties}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold truncate">{agent.name}</h3>
                  <p className="text-xs text-[#86868b] leading-snug mt-0.5">{agent.capabilities}</p>
                </div>

                {pendingTasks.length > 0 && (
                  <span className="shrink-0 px-2 py-0.5 rounded-full bg-[#0071e3]/20 text-[#0071e3] text-xs font-medium">
                    {pendingTasks.length} task{pendingTasks.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {/* Current tasks */}
              {pendingTasks.length > 0 && (
                <div className="bg-[#111] rounded-lg px-3 py-2 space-y-1.5">
                  <span className="text-[10px] uppercase tracking-wider text-[#86868b]">Active Tasks</span>
                  {pendingTasks.slice(0, 3).map((t) => (
                    <div key={t.id} className="flex items-center gap-2">
                      {t.status === 'in_progress' ? (
                        <Loader2 size={10} className="text-[#0071e3] animate-spin shrink-0" />
                      ) : (
                        <CheckCircle2 size={10} className="text-gray-500 shrink-0" />
                      )}
                      <p className="text-xs text-gray-300 truncate">{t.title}</p>
                    </div>
                  ))}
                  {pendingTasks.length > 3 && (
                    <p className="text-[10px] text-gray-500">+{pendingTasks.length - 3} more</p>
                  )}
                </div>
              )}

              {pendingTasks.length === 0 && (
                <div className="bg-[#111] rounded-lg px-3 py-2">
                  <span className="text-[10px] uppercase tracking-wider text-[#86868b]">Status</span>
                  <p className="text-sm mt-0.5 text-[#86868b] italic">No active tasks</p>
                </div>
              )}

              {/* Last heartbeat */}
              <div className="flex items-center gap-1.5 text-xs text-[#86868b]">
                <Clock size={10} />
                Last heartbeat: {timeAgo(agent.lastHeartbeatAt)}
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 mt-auto">
                <ActionButton
                  onClick={() => handleWakeup(agent)}
                  icon={<Zap size={12} />}
                  label="Wake Up"
                  variant="success"
                  disabled={isBusy}
                  className="flex-1 justify-center"
                />
                <ActionButton
                  onClick={() => handlePauseResume(agent)}
                  icon={agent.status === 'paused' ? <Play size={12} /> : <Pause size={12} />}
                  label={agent.status === 'paused' ? 'Resume' : 'Pause'}
                  variant="ghost"
                  disabled={isBusy}
                />
                <ActionButton
                  onClick={async () => setAssigningTo(isAssigning ? null : agent.id)}
                  icon={<Send size={12} />}
                  label="Assign Task"
                  variant="accent"
                  color="#0071e3"
                  className="flex-1 justify-center"
                />
              </div>

              {/* Assign task input */}
              <AnimatePresence>
                {isAssigning && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={taskText}
                        onChange={(e) =>
                          setNewTaskText((prev) => ({ ...prev, [agent.id]: e.target.value }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAssignTask(agent);
                        }}
                        placeholder="Describe the task..."
                        className="flex-1 px-3 py-2 rounded-lg bg-[#111] border border-white/10 text-sm text-white placeholder-[#86868b] focus:outline-none focus:border-[#0071e3] transition-colors"
                        autoFocus
                      />
                      <button
                        onClick={() => handleAssignTask(agent)}
                        disabled={isBusy || !taskText.trim()}
                        className="px-4 py-2 rounded-lg text-xs font-medium bg-[#0071e3] text-white hover:bg-[#0071e3]/80 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {isBusy ? <Loader2 size={12} className="animate-spin" /> : 'Send'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
