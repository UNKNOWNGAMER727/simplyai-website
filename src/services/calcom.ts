// Cal.com API client for Simply AI CRM Dashboard
// Proxied through Vite: /calcom → api.cal.com/v2

const BASE = '/calcom';
const API_KEY = import.meta.env.VITE_CALCOM_API_KEY ?? '';

// ── Types ──────────────────────────────────────────────────────────────────

export interface CalComBooking {
  readonly id: number;
  readonly uid: string;
  readonly title: string;
  readonly status: 'accepted' | 'pending' | 'cancelled' | 'rejected';
  readonly start: string;
  readonly end: string;
  readonly duration: number;
  readonly meetingUrl: string | null;
  readonly location: string | null;
  readonly attendees: readonly {
    readonly name: string;
    readonly email: string;
    readonly timeZone: string;
  }[];
  readonly eventTypeId: number;
  readonly createdAt: string;
  readonly rescheduledFromUid: string | null;
}

export interface CalComEventType {
  readonly id: number;
  readonly title: string;
  readonly slug: string;
  readonly length: number;
  readonly price: number;
}

// ── Tier mapping ──────────────────────────────────────────────────────────

const TIER_MAP: Record<string, { tier: 'basic' | 'pro' | 'premium'; price: number }> = {
  'basic-ai-setup-300': { tier: 'basic', price: 300 },
  'pro-ai-setup-500': { tier: 'pro', price: 500 },
  'premium-ai-setup-1000': { tier: 'premium', price: 1000 },
};

// ── API Functions ──────────────────────────────────────────────────────────

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'cal-api-version': '2024-08-13',
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error(`Cal.com API error ${res.status}`);
  }
  const json = await res.json();
  return json.data ?? json;
}

/** Fetch all bookings */
export async function fetchBookings(): Promise<CalComBooking[]> {
  return apiFetch<CalComBooking[]>('/bookings?status=upcoming,past,cancelled');
}

/** Fetch event types to map slugs → tiers */
export async function fetchEventTypes(): Promise<CalComEventType[]> {
  return apiFetch<CalComEventType[]>('/event-types');
}

/** Convert a Cal.com booking to our CRM Booking type */
export function toBooking(
  b: CalComBooking,
  eventTypes: CalComEventType[],
): import('../types/crm').Booking {
  const eventType = eventTypes.find((e) => e.id === b.eventTypeId);
  const slug = eventType?.slug ?? '';
  const tierInfo = TIER_MAP[slug] ?? { tier: 'basic' as const, price: 300 };
  const attendee = b.attendees[0];
  const startDate = new Date(b.start);

  const statusMap: Record<string, import('../types/crm').Booking['status']> = {
    accepted: 'confirmed',
    pending: 'pending',
    cancelled: 'cancelled',
    rejected: 'cancelled',
  };

  return {
    id: b.uid,
    clientId: `cal-${b.id}`,
    clientName: attendee?.name ?? 'Unknown',
    tier: tierInfo.tier,
    price: tierInfo.price,
    date: startDate.toISOString().split('T')[0],
    time: startDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    duration: b.duration ?? eventType?.length ?? 60,
    location: b.meetingUrl ? 'remote' : 'in-person',
    address: b.location && !b.meetingUrl ? b.location : null,
    status: statusMap[b.status] ?? 'pending',
    paymentStatus: 'unpaid',
    notes: eventType?.title ?? b.title,
  };
}
