import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Video, ChevronDown, ChevronUp, Clock, DollarSign,
  CalendarDays, RotateCcw, XCircle, Send, Star, CheckCircle2, Loader2, RefreshCw, ExternalLink, Trash2,
} from 'lucide-react';
import { bookings as mockBookings } from '../../data/mockData';
import { useToast } from '../ui/Toast';
import ActionButtonShared from '../ui/ActionButton';
import { createIssue, invokeHeartbeat, AGENT_IDS } from '../../services/paperclip';
import { fetchBookings, fetchEventTypes, toBooking } from '../../services/calcom';
import type { Booking } from '../../types/crm';

const CALCOM_API_KEY = import.meta.env.VITE_CALCOM_API_KEY ?? '';

type FilterKey = 'all' | 'upcoming' | 'completed' | 'cancelled';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

const TIER_COLORS: Record<Booking['tier'], { bg: string; text: string }> = {
  basic: { bg: 'bg-[#0071e3]/15', text: 'text-[#0071e3]' },
  pro: { bg: 'bg-[#ff9f0a]/15', text: 'text-[#ff9f0a]' },
  premium: { bg: 'bg-[#bf5af2]/15', text: 'text-[#bf5af2]' },
};

const STATUS_COLORS: Record<Booking['status'], { bg: string; text: string }> = {
  confirmed: { bg: 'bg-[#34c759]/15', text: 'text-[#34c759]' },
  pending: { bg: 'bg-[#ff9f0a]/15', text: 'text-[#ff9f0a]' },
  completed: { bg: 'bg-[#bf5af2]/15', text: 'text-[#bf5af2]' },
  cancelled: { bg: 'bg-red-500/15', text: 'text-red-400' },
  'no-show': { bg: 'bg-red-500/15', text: 'text-red-400' },
};

const PAYMENT_COLORS: Record<Booking['paymentStatus'], { bg: string; text: string }> = {
  paid: { bg: 'bg-[#34c759]/15', text: 'text-[#34c759]' },
  unpaid: { bg: 'bg-red-500/15', text: 'text-red-400' },
  partial: { bg: 'bg-[#ff9f0a]/15', text: 'text-[#ff9f0a]' },
};

function filterBookings(bookings: readonly Booking[], filter: FilterKey): Booking[] {
  switch (filter) {
    case 'upcoming':
      return bookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
    case 'completed':
      return bookings.filter(b => b.status === 'completed');
    case 'cancelled':
      return bookings.filter(b => b.status === 'cancelled' || b.status === 'no-show');
    default:
      return [...bookings];
  }
}

function BookingRow({ booking, onRemove }: { booking: Booking; onRemove: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const { toast } = useToast();

  const tierStyle = TIER_COLORS[booking.tier];
  const statusStyle = STATUS_COLORS[booking.status];
  const paymentStyle = PAYMENT_COLORS[booking.paymentStatus];
  const isUpcoming = booking.status === 'confirmed' || booking.status === 'pending';
  const isCompleted = booking.status === 'completed';

  const makeAction = (action: string) => async () => {
    switch (action) {
      case 'confirm': {
        await createIssue({
          title: `Send booking confirmation to ${booking.clientName}`,
          description: `Send a confirmation email/SMS to ${booking.clientName} for their ${booking.tier} tier appointment on ${booking.date} at ${booking.time}. Location: ${booking.location === 'in-person' ? booking.address : 'Remote via Zoom'}. Include prep instructions: "Have your computer on and connected to Wi-Fi."`,
          priority: 'high',
          assigneeAgentId: AGENT_IDS.bookingCoordinator,
        });
        await invokeHeartbeat(AGENT_IDS.bookingCoordinator);
        toast(`Confirmation task sent to Booking Coordinator`);
        break;
      }
      case 'remind': {
        await createIssue({
          title: `Send appointment reminder to ${booking.clientName}`,
          description: `Send a reminder to ${booking.clientName} for their upcoming ${booking.tier} tier appointment on ${booking.date} at ${booking.time}. Include reschedule link if needed.`,
          priority: 'medium',
          assigneeAgentId: AGENT_IDS.bookingCoordinator,
        });
        await invokeHeartbeat(AGENT_IDS.bookingCoordinator);
        toast(`Reminder task sent to Booking Coordinator`);
        break;
      }
      case 'followup': {
        await createIssue({
          title: `Send post-appointment follow-up to ${booking.clientName}`,
          description: `${booking.clientName} completed their ${booking.tier} tier session. Send a thank-you email with 2-3 AI tips based on the ${booking.tier} package. Ask how they're enjoying their new tools.`,
          priority: 'high',
          assigneeAgentId: AGENT_IDS.reviewAgent,
        });
        await invokeHeartbeat(AGENT_IDS.reviewAgent);
        toast(`Follow-up task sent to Review Agent`);
        break;
      }
      case 'review': {
        await createIssue({
          title: `Request Google review from ${booking.clientName}`,
          description: `Send a warm, non-pushy Google review request to ${booking.clientName} who completed their ${booking.tier} tier session. Frame it as "helping others like you discover AI." Include direct link to Google review page.`,
          priority: 'medium',
          assigneeAgentId: AGENT_IDS.reviewAgent,
        });
        await invokeHeartbeat(AGENT_IDS.reviewAgent);
        toast(`Review request task sent to Review Agent`);
        break;
      }
      case 'cancel': {
        // Cancel via Cal.com API
        const res = await fetch(`/calcom/bookings/${booking.id}/cancel`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${CALCOM_API_KEY}`,
            'cal-api-version': '2024-08-13',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ cancellationReason: 'Cancelled from CRM dashboard' }),
        });
        if (!res.ok) throw new Error(`Cancel failed: ${res.status}`);
        // Create follow-up task
        await createIssue({
          title: `Follow up on cancellation: ${booking.clientName}`,
          description: `${booking.clientName} cancelled their ${booking.tier} booking for ${booking.date}. Reach out in 2-3 days with a gentle message offering to reschedule. Booking link: cal.com/simplytech.ai`,
          priority: 'medium',
          assigneeAgentId: AGENT_IDS.leadHandler,
        });
        await invokeHeartbeat(AGENT_IDS.leadHandler);
        toast(`Booking cancelled. Follow-up task sent to Lead Handler`);
        break;
      }
      case 'reschedule': {
        // Open Cal.com reschedule page
        window.open(`https://cal.com/reschedule/${booking.id}`, '_blank');
        toast('Reschedule page opened in new tab');
        break;
      }
      case 'rebook': {
        window.open('https://cal.com/simplytech.ai', '_blank');
        toast('Booking page opened in new tab');
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
      className="bg-[#1a1a1a] rounded-xl border border-white/10 overflow-hidden"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-4 hover:bg-white/[0.02] transition-colors cursor-pointer text-left"
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">{booking.clientName}</p>
          <p className="text-xs text-gray-500 mt-0.5">{booking.date} at {booking.time}</p>
        </div>
        <span className={`hidden sm:inline-flex text-xs font-semibold px-2 py-0.5 rounded-full ${tierStyle.bg} ${tierStyle.text} uppercase`}>
          {booking.tier}
        </span>
        <span className="text-gray-400">
          {booking.location === 'in-person' ? <MapPin size={16} /> : <Video size={16} />}
        </span>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
          {booking.status}
        </span>
        <span className={`hidden md:inline-flex text-xs font-medium px-2 py-0.5 rounded-full ${paymentStyle.bg} ${paymentStyle.text}`}>
          {booking.paymentStatus}
        </span>
        {expanded ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
            <div className="px-4 pb-4 pt-0 border-t border-white/5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                <div className="flex items-center gap-1.5 text-xs text-gray-400"><Clock size={12} />{booking.duration} min</div>
                <div className="flex items-center gap-1.5 text-xs text-gray-400"><DollarSign size={12} />${booking.price}</div>
                <div className="flex items-center gap-1.5 text-xs text-gray-400"><CalendarDays size={12} />{booking.date}</div>
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  {booking.location === 'in-person' ? <MapPin size={12} /> : <Video size={12} />}
                  {booking.location === 'in-person' ? booking.address : 'Remote'}
                </div>
              </div>
              {booking.notes && <p className="text-xs text-gray-400 mt-3">{booking.notes}</p>}
              <div className="flex flex-wrap gap-2 mt-3">
                {isUpcoming && (
                  <>
                    <ActionButtonShared onClick={makeAction('confirm')} icon={<Send size={12} />} label="Send Confirmation" variant="accent" color="#0071e3" />
                    <ActionButtonShared onClick={makeAction('remind')} icon={<CalendarDays size={12} />} label="Send Reminder" variant="accent" color="#34c759" />
                    <ActionButtonShared onClick={makeAction('reschedule')} icon={<RotateCcw size={12} />} label="Reschedule" variant="accent" color="#0071e3" />
                    <ActionButtonShared onClick={makeAction('cancel')} icon={<XCircle size={12} />} label="Cancel" variant="danger" />
                  </>
                )}
                {isCompleted && (
                  <>
                    <ActionButtonShared onClick={makeAction('followup')} icon={<CheckCircle2 size={12} />} label="Send Follow-up" variant="accent" color="#34c759" />
                    <ActionButtonShared onClick={makeAction('review')} icon={<Star size={12} />} label="Request Review" variant="accent" color="#bf5af2" />
                  </>
                )}
                {booking.status === 'cancelled' && (
                  <ActionButtonShared onClick={makeAction('rebook')} icon={<ExternalLink size={12} />} label="Rebook Customer" variant="primary" />
                )}
                <ActionButtonShared
                  onClick={async () => {
                    // Cancel on Cal.com if still active
                    if (isUpcoming) {
                      try {
                        await fetch(`/calcom/bookings/${booking.id}/cancel`, {
                          method: 'POST',
                          headers: {
                            Authorization: `Bearer ${CALCOM_API_KEY}`,
                            'cal-api-version': '2024-08-13',
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({ cancellationReason: 'Removed from CRM' }),
                        });
                      } catch { /* might already be cancelled */ }
                    }
                    onRemove(booking.id);
                    toast(`Removed ${booking.clientName}`);
                  }}
                  icon={<Trash2 size={12} />}
                  label="Remove"
                  variant="danger"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function Bookings() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [allBookings, setAllBookings] = useState<Booking[]>(mockBookings);
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem('hidden-bookings') || '[]')); }
    catch { return new Set(); }
  });
  const [dataSource, setDataSource] = useState<'loading' | 'live' | 'mock'>('loading');
  const { toast } = useToast();

  const persistHidden = (ids: Set<string>) => {
    setHiddenIds(ids);
    localStorage.setItem('hidden-bookings', JSON.stringify([...ids]));
  };

  const loadRealBookings = useCallback(async () => {
    try {
      const [rawBookings, eventTypes] = await Promise.all([
        fetchBookings(),
        fetchEventTypes(),
      ]);
      if (rawBookings.length > 0) {
        setAllBookings(rawBookings.map((b) => toBooking(b, eventTypes)));
        setDataSource('live');
      } else {
        setAllBookings(mockBookings);
        setDataSource('mock');
      }
    } catch {
      setAllBookings(mockBookings);
      setDataSource('mock');
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadRealBookings(); }, [loadRealBookings]);

  const visibleBookings = allBookings.filter(b => !hiddenIds.has(b.id));
  const filtered = filterBookings(visibleBookings, activeFilter);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-white">Bookings</h2>
          {dataSource !== 'loading' && (
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
              dataSource === 'live'
                ? 'bg-[#34c759]/15 text-[#34c759]'
                : 'bg-[#ff9f0a]/15 text-[#ff9f0a]'
            }`}>
              {dataSource === 'live' ? 'Cal.com Live' : 'Demo Data'}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => { setDataSource('loading'); loadRealBookings(); toast('Refreshing bookings...'); }}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            title="Refresh from Cal.com"
          >
            <RefreshCw size={14} className="text-gray-400" />
          </button>
          <div className="flex bg-[#1a1a1a] rounded-lg border border-white/10 p-0.5">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'list' ? 'bg-[#0071e3] text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'calendar' ? 'bg-[#0071e3] text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Calendar
            </button>
          </div>
        </div>
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
        {dataSource === 'loading' ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-5 h-5 text-[#0071e3] animate-spin" />
            <span className="ml-3 text-sm text-gray-400">Loading from Cal.com...</span>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filtered.map((booking) => (
              <BookingRow key={booking.id} booking={booking} onRemove={(id) => {
                const next = new Set(hiddenIds);
                next.add(id);
                persistHidden(next);
              }} />
            ))}
          </AnimatePresence>
        )}
        {dataSource !== 'loading' && filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500 text-sm">No bookings match this filter.</div>
        )}
      </div>
    </div>
  );
}
