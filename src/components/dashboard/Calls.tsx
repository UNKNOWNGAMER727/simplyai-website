import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone, PhoneMissed, ChevronDown, ChevronUp, Clock, UserPlus,
  Link2, CheckCircle2, AlertCircle, Send, RefreshCw, Loader2,
} from 'lucide-react';
import { useToast } from '../ui/Toast';
import ActionButton from '../ui/ActionButton';
import { EmptyState } from '../ui/EmptyState';
import { createIssue, invokeHeartbeat, AGENT_IDS } from '../../services/paperclip';
import type { Call } from '../../types/crm';

type FilterKey = 'all' | 'answered' | 'missed' | 'followed-up';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'answered', label: 'Answered' },
  { key: 'missed', label: 'Missed' },
  { key: 'followed-up', label: 'Followed Up' },
];

function isMissed(call: Call): boolean {
  return call.duration === '0:00';
}

function filterCalls(calls: readonly Call[], filter: FilterKey): Call[] {
  switch (filter) {
    case 'answered':
      return calls.filter(c => !isMissed(c));
    case 'missed':
      return calls.filter(c => isMissed(c));
    case 'followed-up':
      return calls.filter(c => c.followUpStatus === 'sent' || c.followUpStatus === 'responded');
    default:
      return [...calls];
  }
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' at ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function CallRow({ call }: { call: Call }) {
  const [expanded, setExpanded] = useState(false);
  const { toast } = useToast();
  const missed = isMissed(call);

  const rowAccent = missed
    ? 'border-l-red-500'
    : call.didBook
      ? 'border-l-[#34c759]'
      : call.followUpStatus === 'none'
        ? 'border-l-[#ff9f0a]'
        : 'border-l-[#0071e3]';

  const makeAction = (action: string) => async () => {
    const callerLabel = call.callerName ?? call.callerPhone;
    switch (action) {
      case 'create-lead': {
        await createIssue({
          title: `Create lead from call: ${callerLabel}`,
          description: `New lead from phone call. Phone: ${call.callerPhone}. Call summary: "${call.summary}". Qualify this lead, add to tracking, and follow up with booking link within 2 hours.`,
          priority: 'high',
          assigneeAgentId: AGENT_IDS.leadHandler,
        });
        await invokeHeartbeat(AGENT_IDS.leadHandler);
        toast(`Lead creation task sent to Lead Handler`);
        break;
      }
      case 'send-booking': {
        await createIssue({
          title: `Send booking link to ${callerLabel}`,
          description: `${callerLabel} (${call.callerPhone}) called but didn't book. Send them the booking link (cal.com/simplytech.ai) via SMS. Reference their call: "${call.summary}". Suggest the right tier based on their interest.`,
          priority: 'high',
          assigneeAgentId: AGENT_IDS.leadHandler,
        });
        await invokeHeartbeat(AGENT_IDS.leadHandler);
        toast(`Booking link task sent to Lead Handler`);
        break;
      }
      case 'follow-up': {
        await createIssue({
          title: `Follow up with ${callerLabel}`,
          description: `Send a follow-up message to ${callerLabel} (${call.callerPhone}). They called on ${new Date(call.date).toLocaleDateString()}. Summary: "${call.summary}". Be warm and helpful, not pushy. Include booking link.`,
          priority: 'medium',
          assigneeAgentId: AGENT_IDS.leadHandler,
        });
        await invokeHeartbeat(AGENT_IDS.leadHandler);
        toast(`Follow-up task sent to Lead Handler`);
        break;
      }
      case 'callback': {
        await createIssue({
          title: `Return missed call to ${call.callerPhone}`,
          description: `Missed call from ${call.callerPhone} on ${new Date(call.date).toLocaleDateString()}. No voicemail left. Send a friendly text: "Hi! We noticed you called Simply AI. How can we help you get started with AI? Here's our booking link: cal.com/simplytech.ai"`,
          priority: 'high',
          assigneeAgentId: AGENT_IDS.leadHandler,
        });
        await invokeHeartbeat(AGENT_IDS.leadHandler);
        toast(`Callback task sent to Lead Handler`);
        break;
      }
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      className={`bg-[#1a1a1a] rounded-xl border border-white/10 border-l-4 ${rowAccent} overflow-hidden`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-4 hover:bg-white/[0.02] transition-colors cursor-pointer text-left"
      >
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${missed ? 'bg-red-500/15' : 'bg-[#34c759]/15'}`}>
          {missed ? <PhoneMissed size={14} className="text-red-400" /> : <Phone size={14} className="text-[#34c759]" />}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">
            {call.callerName ?? call.callerPhone}
          </p>
          {call.callerName && (
            <p className="text-xs text-gray-500">{call.callerPhone}</p>
          )}
        </div>

        <div className="hidden sm:flex flex-col items-end gap-0.5">
          <span className="text-xs text-gray-400">{formatDate(call.date)}</span>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock size={10} />
            {missed ? 'Missed' : call.duration}
          </div>
        </div>

        {call.didBook ? (
          <span className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-[#34c759]/15 text-[#34c759]">
            <CheckCircle2 size={10} />
            Booked
          </span>
        ) : (
          <span className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-gray-500/15 text-gray-400">
            Not booked
          </span>
        )}

        {call.followUpStatus === 'sent' && (
          <span className="hidden md:inline-flex text-xs font-medium px-2 py-0.5 rounded-full bg-[#0071e3]/15 text-[#0071e3]">
            Follow-up sent
          </span>
        )}
        {call.followUpStatus === 'responded' && (
          <span className="hidden md:inline-flex text-xs font-medium px-2 py-0.5 rounded-full bg-[#34c759]/15 text-[#34c759]">
            Responded
          </span>
        )}
        {call.followUpStatus === 'none' && !call.didBook && !missed && (
          <span className="hidden md:inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-[#ff9f0a]/15 text-[#ff9f0a]">
            <AlertCircle size={10} />
            Needs follow-up
          </span>
        )}

        {expanded ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0 border-t border-white/5 space-y-3">
              <div className="mt-3">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Summary</p>
                <p className="text-sm text-gray-300">{call.summary}</p>
              </div>

              {call.transcript && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Transcript</p>
                  <div className="bg-[#111] rounded-lg p-3 max-h-48 overflow-y-auto">
                    {call.transcript.split('\n').map((line, i) => {
                      const isCaller = line.startsWith('Caller:');
                      return (
                        <p key={i} className={`text-xs leading-relaxed ${isCaller ? 'text-[#0071e3]' : 'text-gray-400'}`}>
                          {line}
                        </p>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2">
                {missed && (
                  <ActionButton
                    onClick={makeAction('callback')}
                    icon={<Phone size={12} />}
                    label="Send Callback Text"
                    variant="danger"
                    color="#ff9f0a"
                  />
                )}
                {!call.leadId && !missed && (
                  <ActionButton
                    onClick={makeAction('create-lead')}
                    icon={<UserPlus size={12} />}
                    label="Create Lead"
                    variant="accent"
                    color="#bf5af2"
                  />
                )}
                {!call.didBook && !missed && (
                  <ActionButton
                    onClick={makeAction('send-booking')}
                    icon={<Link2 size={12} />}
                    label="Send Booking Link"
                    variant="accent"
                    color="#0071e3"
                  />
                )}
                {call.followUpStatus === 'none' && !missed && (
                  <ActionButton
                    onClick={makeAction('follow-up')}
                    icon={<Send size={12} />}
                    label="Send Follow-up"
                    variant="accent"
                    color="#34c759"
                  />
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function Calls() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [allCalls, setAllCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadCalls = useCallback(async () => {
    try {
      const res = await fetch('/webhook-api/calls');
      if (res.ok) {
        const data = await res.json();
        setAllCalls(data);
      }
    } catch {
      // webhook server might not be running
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCalls();
    const interval = setInterval(loadCalls, 15000); // refresh every 15s
    return () => clearInterval(interval);
  }, [loadCalls]);

  const filtered = filterCalls(allCalls, activeFilter);

  const totalCalls = allCalls.length;
  const answeredCount = allCalls.filter(c => !isMissed(c)).length;
  const bookedCount = allCalls.filter(c => c.didBook).length;
  const missedCount = allCalls.filter(c => isMissed(c)).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">SkipCalls Log</h2>
        <div className="flex items-center gap-2">
          {totalCalls > 0 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#34c759]/15 text-[#34c759] font-medium">Live</span>
          )}
          <button onClick={() => { loadCalls(); toast('Refreshing calls...'); }} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
            {loading ? <Loader2 size={14} className="text-gray-400 animate-spin" /> : <RefreshCw size={14} className="text-gray-400" />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total', value: totalCalls, color: '#0071e3' },
          { label: 'Answered', value: answeredCount, color: '#34c759' },
          { label: 'Booked', value: bookedCount, color: '#bf5af2' },
          { label: 'Missed', value: missedCount, color: '#ff453a' },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#1a1a1a] rounded-xl border border-white/10 p-3">
            <p className="text-xs text-gray-500">{stat.label}</p>
            <p className="text-2xl font-bold mt-0.5" style={{ color: stat.color }}>
              {totalCalls === 0 ? '\u2014' : stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeFilter === f.key
                ? 'bg-[#0071e3] text-white'
                : 'bg-[#1a1a1a] text-gray-400 border border-white/10 hover:text-white hover:border-white/20'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {filtered.map((call) => (
            <CallRow key={call.id} call={call} />
          ))}
        </AnimatePresence>
        {filtered.length === 0 && totalCalls > 0 && (
          <div className="text-center py-12 text-gray-500 text-sm">No calls match this filter.</div>
        )}
        {totalCalls === 0 && (
          <EmptyState
            icon={Phone}
            title="No calls yet"
            description="When calls come in through ElevenLabs at (361) 315-8585, they'll appear here with AI-generated summaries and one-click follow-up actions."
          />
        )}
      </div>
    </div>
  );
}
