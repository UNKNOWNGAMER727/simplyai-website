import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, RefreshCw, Loader2, MapPin, Video } from 'lucide-react';
import { fetchBookings, fetchEventTypes, toBooking } from '../../services/calcom';
import type { Booking } from '../../types/crm';

// ── Helpers ────────────────────────────────────────────────────────────────

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const TIER_COLORS: Record<string, string> = {
  basic: '#0071e3',
  pro: '#ff9f0a',
  premium: '#bf5af2',
};

const STATUS_COLORS: Record<string, string> = {
  confirmed: '#34c759',
  pending: '#ff9f0a',
  completed: '#bf5af2',
  cancelled: '#ff453a',
};

// ── Component ──────────────────────────────────────────────────────────────

export function Calendar() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const loadBookings = useCallback(async () => {
    setLoading(true);
    try {
      const [raw, eventTypes] = await Promise.all([fetchBookings(), fetchEventTypes()]);
      setBookings(raw.map((b) => toBooking(b, eventTypes)));
    } catch {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  // Read hidden bookings from localStorage (shared with Bookings tab)
  const hiddenIds = (() => {
    try { return new Set<string>(JSON.parse(localStorage.getItem('hidden-bookings') || '[]')); }
    catch { return new Set<string>(); }
  })();

  // Re-read on storage changes (e.g. user hides a booking in another tab)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'hidden-bookings') loadBookings();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [loadBookings]);

  const visibleBookings = bookings.filter(b => !hiddenIds.has(String(b.id)));

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(year - 1); }
    else setMonth(month - 1);
  };

  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(year + 1); }
    else setMonth(month + 1);
  };

  const goToToday = () => {
    setYear(today.getFullYear());
    setMonth(today.getMonth());
    setSelectedDate(today.toISOString().split('T')[0]);
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);

  // Build calendar grid
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  // Group visible bookings by date
  const bookingsByDate: Record<string, Booking[]> = {};
  for (const b of visibleBookings) {
    if (!bookingsByDate[b.date]) bookingsByDate[b.date] = [];
    bookingsByDate[b.date].push(b);
  }

  const todayStr = today.toISOString().split('T')[0];
  const selectedBookings = selectedDate ? (bookingsByDate[selectedDate] || []) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">Calendar</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#0071e3] text-white hover:bg-[#0071e3]/80 transition-colors"
          >
            Today
          </button>
          <button onClick={loadBookings} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
            {loading ? <Loader2 size={14} className="text-gray-400 animate-spin" /> : <RefreshCw size={14} className="text-gray-400" />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar grid */}
        <div className="lg:col-span-2 bg-[#1a1a1a] rounded-2xl border border-white/5 p-5">
          {/* Month nav */}
          <div className="flex items-center justify-between mb-5">
            <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              <ChevronLeft size={18} className="text-gray-400" />
            </button>
            <h3 className="text-lg font-semibold">{MONTH_NAMES[month]} {year}</h3>
            <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              <ChevronRight size={18} className="text-gray-400" />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAY_NAMES.map((d) => (
              <div key={d} className="text-center text-xs font-medium text-gray-500 py-1">{d}</div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, i) => {
              if (day === null) return <div key={`empty-${i}`} className="aspect-square" />;

              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const dayBookings = bookingsByDate[dateStr] || [];
              const isToday = dateStr === todayStr;
              const isSelected = dateStr === selectedDate;
              const isPast = new Date(dateStr) < new Date(todayStr);

              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr === selectedDate ? null : dateStr)}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-start p-1.5 transition-all relative ${
                    isSelected
                      ? 'bg-[#0071e3] ring-2 ring-[#0071e3]/50'
                      : isToday
                        ? 'bg-[#0071e3]/20 ring-1 ring-[#0071e3]/30'
                        : 'hover:bg-white/5'
                  } ${isPast && !isToday ? 'opacity-40' : ''}`}
                >
                  <span className={`text-sm font-medium ${isSelected ? 'text-white' : isToday ? 'text-[#0071e3]' : 'text-gray-300'}`}>
                    {day}
                  </span>
                  {/* Booking dots */}
                  {dayBookings.length > 0 && (
                    <div className="flex gap-0.5 mt-auto">
                      {dayBookings.slice(0, 3).map((b, j) => (
                        <span
                          key={j}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: TIER_COLORS[b.tier] || '#0071e3' }}
                        />
                      ))}
                      {dayBookings.length > 3 && (
                        <span className="text-[8px] text-gray-400">+{dayBookings.length - 3}</span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/5">
            {Object.entries(TIER_COLORS).map(([tier, color]) => (
              <div key={tier} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-xs text-gray-500 capitalize">{tier}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar — selected date details */}
        <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 p-5">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
            {selectedDate
              ? new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
              : 'Select a date'
            }
          </h3>

          {!selectedDate && (
            <p className="text-sm text-gray-500">Click a day on the calendar to see bookings.</p>
          )}

          {selectedDate && selectedBookings.length === 0 && (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500">No bookings on this day.</p>
              <a
                href={`https://cal.com/simplytech.ai?date=${selectedDate}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 px-4 py-2 rounded-lg bg-[#0071e3] text-white text-sm font-medium hover:bg-[#0071e3]/80 transition-colors"
              >
                Block this time
              </a>
            </div>
          )}

          {selectedBookings.length > 0 && (
            <div className="space-y-3">
              {selectedBookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-[#222] rounded-xl p-4 border-l-4"
                  style={{ borderColor: TIER_COLORS[b.tier] || '#0071e3' }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-white">{b.clientName}</span>
                    <span
                      className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${STATUS_COLORS[b.status] || '#86868b'}20`,
                        color: STATUS_COLORS[b.status] || '#86868b',
                      }}
                    >
                      {b.status}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#0071e3] font-medium">{b.time}</span>
                      <span>•</span>
                      <span>{b.duration} min</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className="font-medium px-1.5 py-0.5 rounded uppercase text-[10px]"
                        style={{ backgroundColor: `${TIER_COLORS[b.tier]}20`, color: TIER_COLORS[b.tier] }}
                      >
                        {b.tier}
                      </span>
                      <span>${b.price}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {b.location === 'remote' ? <Video size={12} /> : <MapPin size={12} />}
                      <span>{b.location === 'remote' ? 'Remote (Zoom)' : b.address || 'In-person'}</span>
                    </div>
                  </div>

                  {b.notes && (
                    <p className="text-xs text-gray-500 mt-2 pt-2 border-t border-white/5">{b.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Upcoming section */}
          {!selectedDate && visibleBookings.length > 0 && (
            <div className="mt-4">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Upcoming</h4>
              <div className="space-y-2">
                {visibleBookings
                  .filter((b) => b.date >= todayStr && b.status !== 'cancelled')
                  .sort((a, b) => a.date.localeCompare(b.date))
                  .slice(0, 5)
                  .map((b) => (
                    <button
                      key={b.id}
                      onClick={() => { setSelectedDate(b.date); const d = new Date(b.date + 'T12:00:00'); setMonth(d.getMonth()); setYear(d.getFullYear()); }}
                      className="w-full flex items-center gap-3 p-3 rounded-lg bg-[#222] hover:bg-[#2a2a2a] transition-colors text-left"
                    >
                      <div
                        className="w-1 h-8 rounded-full"
                        style={{ backgroundColor: TIER_COLORS[b.tier] }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{b.clientName}</p>
                        <p className="text-xs text-gray-500">{b.date} at {b.time}</p>
                      </div>
                      <span
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full capitalize"
                        style={{ backgroundColor: `${TIER_COLORS[b.tier]}20`, color: TIER_COLORS[b.tier] }}
                      >
                        {b.tier}
                      </span>
                    </button>
                  ))
                }
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
