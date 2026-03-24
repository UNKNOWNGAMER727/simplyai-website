import { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Zap, CheckCircle2, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import {
  createIssue,
  invokeHeartbeat,
  listAgents,
  listIssues,
  getIssue,
  getIssueComments,
  AGENT_IDS,
} from '../../services/paperclip';
import type { PaperclipAgent, PaperclipIssue } from '../../services/paperclip';

// ── Agent mention aliases ───────────────────────────────────────────────────

const MENTION_MAP: Record<string, keyof typeof AGENT_IDS> = {
  manager:    'operationsManager',
  ops:        'operationsManager',
  operations: 'operationsManager',
  lead:       'leadHandler',
  leads:      'leadHandler',
  sales:      'leadHandler',
  review:     'reviewAgent',
  reviews:    'reviewAgent',
  content:    'contentAgent',
  booking:    'bookingCoordinator',
  bookings:   'bookingCoordinator',
};

const AGENT_DISPLAY: Record<keyof typeof AGENT_IDS, string> = {
  operationsManager:  'Operations Manager',
  leadHandler:        'Lead Handler',
  reviewAgent:        'Review Agent',
  contentAgent:       'Content Agent',
  bookingCoordinator: 'Booking Coordinator',
};

function parseMention(text: string): { agentKey: keyof typeof AGENT_IDS; cleanText: string } {
  const match = text.match(/@(\w+)/);
  if (match) {
    const alias = match[1].toLowerCase();
    const agentKey = MENTION_MAP[alias] ?? 'operationsManager';
    return { agentKey, cleanText: text.replace(/@\w+\s?/, '').trim() };
  }
  return { agentKey: 'operationsManager', cleanText: text.trim() };
}

// ── Message types ───────────────────────────────────────────────────────────

type Msg =
  | { kind: 'user'; text: string; id: string }
  | { kind: 'confirm'; text: string; taskId: string; agent: string; id: string }
  | { kind: 'reply'; text: string; agent: string; taskId: string; id: string }
  | { kind: 'error'; text: string; id: string }
  | { kind: 'update'; issue: PaperclipIssue; agentName: string; id: string };

function uid() {
  return Math.random().toString(36).slice(2);
}

function statusIcon(status: PaperclipIssue['status']) {
  if (status === 'done') return <CheckCircle2 size={12} className="text-[#34c759]" />;
  if (status === 'in_progress') return <Zap size={12} className="text-[#ff9f0a]" />;
  if (status === 'blocked') return <AlertCircle size={12} className="text-[#ff453a]" />;
  return <Clock size={12} className="text-[#86868b]" />;
}

function statusColor(status: PaperclipIssue['status']) {
  if (status === 'done') return '#34c759';
  if (status === 'in_progress') return '#ff9f0a';
  if (status === 'blocked') return '#ff453a';
  return '#86868b';
}

// ── Mention pill renderer ───────────────────────────────────────────────────

function renderWithMentions(text: string) {
  const parts = text.split(/(@\w+)/g);
  return parts.map((p, i) =>
    p.startsWith('@')
      ? <span key={i} className="text-[#0071e3] font-medium">{p}</span>
      : p
  );
}

// ── Main component ──────────────────────────────────────────────────────────

export function Command() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      kind: 'confirm',
      text: 'Hey Kyle — type anything and I\'ll send it to the right agent. Use @manager, @lead, @review, @content, or @booking to route it. No @mention defaults to the Operations Manager.',
      taskId: '',
      agent: 'System',
      id: 'intro',
    },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [agents, setAgents] = useState<PaperclipAgent[]>([]);
  const [recentIssues, setRecentIssues] = useState<PaperclipIssue[]>([]);
  const [showFeed, setShowFeed] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const loadAgentData = useCallback(async () => {
    try {
      const [agentData, issueData] = await Promise.all([listAgents(), listIssues()]);
      setAgents(agentData);
      setRecentIssues(issueData.slice(0, 10));
    } catch { /* offline */ }
  }, []);

  useEffect(() => {
    loadAgentData();
    const interval = setInterval(loadAgentData, 15000);
    return () => clearInterval(interval);
  }, [loadAgentData]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;

    const { agentKey, cleanText } = parseMention(text);
    const agentId = AGENT_IDS[agentKey];
    const agentName = AGENT_DISPLAY[agentKey];

    setMessages((m) => [...m, { kind: 'user', text, id: uid() }]);
    setInput('');
    setSending(true);

    try {
      const issue = await createIssue({
        title: cleanText.length > 80 ? cleanText.slice(0, 80) + '…' : cleanText,
        description: `Task from Kyle via Command Center:\n\n${cleanText}`,
        priority: 'high',
        assigneeAgentId: agentId,
      });
      await invokeHeartbeat(agentId);

      const confirmId = uid();
      setMessages((m) => [
        ...m,
        {
          kind: 'confirm',
          text: `Task sent to ${agentName} — waiting for reply…`,
          taskId: issue.identifier ?? '',
          agent: agentName,
          id: confirmId,
        },
      ]);

      // Poll for completion + agent reply (up to 60s)
      const issueId = issue.id;
      let attempts = 0;
      const poll = setInterval(async () => {
        attempts++;
        try {
          const [latest, comments] = await Promise.all([
            getIssue(issueId),
            getIssueComments(issueId),
          ]);

          // If task is still todo after 15s, re-invoke heartbeat (handles reaped runs)
          if (latest.status === 'todo' && attempts === 8) {
            invokeHeartbeat(agentId).catch(() => {});
          }

          const agentComment = comments.find((c) => c.authorAgentId != null);

          if (agentComment || latest.status === 'done' || attempts >= 30) {
            clearInterval(poll);

            // Update confirm message to show it's done
            setMessages((m) => m.map((msg) =>
              msg.id === confirmId
                ? { ...msg as Extract<Msg, {kind:'confirm'}>, text: `${agentName} completed ${issue.identifier ?? ''}.` }
                : msg
            ));

            if (agentComment) {
              setMessages((m) => [
                ...m,
                {
                  kind: 'reply',
                  text: agentComment.body,
                  agent: agentName,
                  taskId: issue.identifier ?? '',
                  id: uid(),
                },
              ]);
            } else if (latest.status === 'done' && !agentComment) {
              setMessages((m) => [
                ...m,
                {
                  kind: 'reply',
                  text: 'Task completed — no written reply was left. Check Telegram for any alerts.',
                  agent: agentName,
                  taskId: issue.identifier ?? '',
                  id: uid(),
                },
              ]);
            }

            loadAgentData();
          }
        } catch { /* ignore poll errors */ }
      }, 2000);

      setTimeout(() => clearInterval(poll), 62000);
    } catch (err) {
      setMessages((m) => [
        ...m,
        { kind: 'error', text: `Failed to send: ${err}`, id: uid() },
      ]);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  // Suggestion chips
  const suggestions = [
    { label: 'What\'s happening today?', text: '@manager Give me a quick briefing — any calls, leads, bookings, or blockers today?' },
    { label: 'Follow up all leads', text: '@lead Review all open leads and follow up with anyone who hasn\'t responded in 48 hours.' },
    { label: 'Check reviews', text: '@review Check Google for any new reviews and respond to them.' },
    { label: 'Wake all agents', text: '@manager Wake up all agents and report their current status.' },
  ];

  return (
    <div className="flex gap-6 h-[calc(100vh-200px)]">

      {/* ── Chat panel ─────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Command Center</h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Talk to your agents. Use @manager, @lead, @review, @content, @booking.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#34c759]/15 text-[#34c759] font-medium">Live</span>
            <button
              onClick={loadAgentData}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <RefreshCw size={12} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {messages.map((msg) => {
            if (msg.kind === 'user') {
              return (
                <div key={msg.id} className="flex justify-end">
                  <div className="max-w-[75%] bg-[#0071e3] text-white rounded-2xl rounded-br-sm px-4 py-2.5 text-sm">
                    {renderWithMentions(msg.text)}
                  </div>
                </div>
              );
            }

            if (msg.kind === 'confirm') {
              return (
                <div key={msg.id} className="flex justify-start">
                  <div className="max-w-[75%] space-y-1">
                    <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm text-white">
                      {msg.text}
                    </div>
                    {msg.taskId && (
                      <div className="flex items-center gap-1.5 px-1">
                        <CheckCircle2 size={11} className="text-[#34c759]" />
                        <span className="text-[11px] text-neutral-500">
                          {msg.taskId} → {msg.agent}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            }

            if (msg.kind === 'reply') {
              return (
                <div key={msg.id} className="flex justify-start">
                  <div className="max-w-[80%] space-y-1">
                    <div className="flex items-center gap-2 px-1">
                      <div className="w-4 h-4 rounded-full bg-[#bf5af2]/20 flex items-center justify-center">
                        <Zap size={9} className="text-[#bf5af2]" />
                      </div>
                      <span className="text-[11px] text-neutral-500">{msg.agent}</span>
                    </div>
                    <div className="bg-[#1a1a1a] border border-[#bf5af2]/20 rounded-2xl rounded-bl-sm px-4 py-3 text-sm text-white/90 whitespace-pre-wrap leading-relaxed">
                      {msg.text.replace(/^##\s+/gm, '').replace(/\*\*/g, '')}
                    </div>
                    <div className="flex items-center gap-1.5 px-1">
                      <CheckCircle2 size={11} className="text-[#34c759]" />
                      <span className="text-[11px] text-neutral-600">{msg.taskId} done</span>
                    </div>
                  </div>
                </div>
              );
            }

            if (msg.kind === 'error') {
              return (
                <div key={msg.id} className="flex justify-start">
                  <div className="max-w-[75%] bg-[#ff453a]/10 border border-[#ff453a]/20 rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm text-[#ff453a]">
                    {msg.text}
                  </div>
                </div>
              );
            }

            return null;
          })}

          {sending && (
            <div className="flex justify-start">
              <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-neutral-500 animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Suggestion chips */}
        <div className="flex gap-2 mt-3 flex-wrap">
          {suggestions.map((s) => (
            <button
              key={s.label}
              onClick={() => setInput(s.text)}
              className="text-[11px] px-3 py-1 rounded-full bg-[#1a1a1a] border border-white/10 text-neutral-400 hover:text-white hover:border-white/20 transition-colors"
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="mt-3 flex gap-2 items-end">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Type a task... use @manager, @lead, @review, @booking, @content"
              rows={2}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 resize-none focus:outline-none focus:border-[#0071e3]/50 transition-colors"
            />
          </div>
          <button
            onClick={send}
            disabled={!input.trim() || sending}
            className="shrink-0 w-10 h-10 rounded-xl bg-[#0071e3] flex items-center justify-center hover:bg-[#0077ed] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={16} className="text-white" />
          </button>
        </div>
      </div>

      {/* ── Live task feed ─────────────────────────────── */}
      <div className="w-72 shrink-0 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">Live Task Feed</h3>
          <button
            onClick={() => setShowFeed((v) => !v)}
            className="text-[11px] text-neutral-500 hover:text-white transition-colors"
          >
            {showFeed ? 'Hide' : 'Show'}
          </button>
        </div>

        {showFeed && (
          <div className="flex-1 overflow-y-auto space-y-2">
            {recentIssues.length === 0 ? (
              <p className="text-xs text-neutral-600 text-center pt-8">No tasks yet</p>
            ) : (
              recentIssues.map((issue) => {
                const agent = agents.find((a) => a.id === issue.assigneeAgentId);
                return (
                  <div
                    key={issue.id}
                    className="bg-[#1a1a1a] rounded-xl px-3 py-2.5 border border-white/5"
                  >
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 shrink-0">{statusIcon(issue.status)}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-white leading-snug truncate">{issue.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className="text-[10px] font-medium"
                            style={{ color: statusColor(issue.status) }}
                          >
                            {issue.status.replace('_', ' ')}
                          </span>
                          {agent && (
                            <span className="text-[10px] text-neutral-600 truncate">
                              → {agent.name}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-[10px] text-neutral-700 shrink-0">
                        {issue.identifier}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Agent status pills */}
        <div className="mt-4 space-y-1.5">
          <p className="text-[11px] text-neutral-600 uppercase tracking-wider mb-2">Agents</p>
          {agents.map((agent) => (
            <div key={agent.id} className="flex items-center justify-between">
              <span className="text-xs text-neutral-400 truncate">{agent.name}</span>
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                style={{
                  backgroundColor:
                    agent.status === 'active' ? 'rgba(52,199,89,0.15)' :
                    agent.status === 'idle' ? 'rgba(0,113,227,0.15)' :
                    'rgba(134,134,139,0.15)',
                  color:
                    agent.status === 'active' ? '#34c759' :
                    agent.status === 'idle' ? '#0071e3' :
                    '#86868b',
                }}
              >
                {agent.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
