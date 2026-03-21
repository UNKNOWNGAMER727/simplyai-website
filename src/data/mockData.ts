import type { Client, Lead, Booking, Call, AgentInfo, RevenueEntry } from '../types/crm';

export const clients: Client[] = [
  {
    id: 'c1',
    name: 'Margaret Chen',
    phone: '(310) 555-0142',
    email: 'margaret.chen@gmail.com',
    address: '1842 Maple Ave, Pasadena, CA 91101',
    device: 'mac',
    serviceTier: 'premium',
    status: 'completed',
    installedTools: ['ChatGPT', 'Perplexity', 'Copilot', 'Claude'],
    reviewRating: 5,
    reviewText: 'Absolutely wonderful service. My Mac feels brand new with all these AI tools!',
    source: 'Google Search',
    referrals: 2,
    notes: 'Very tech-curious. Interested in follow-up for AI photo editing.',
    createdAt: '2026-02-15T10:00:00Z',
    completedAt: '2026-02-16T14:30:00Z',
  },
  {
    id: 'c2',
    name: 'Robert Williams',
    phone: '(818) 555-0198',
    email: 'rwilliams@outlook.com',
    address: '925 Oak Blvd, Glendale, CA 91205',
    device: 'windows',
    serviceTier: 'pro',
    status: 'completed',
    installedTools: ['ChatGPT', 'Copilot', 'Perplexity'],
    reviewRating: 4,
    reviewText: 'Great setup. Wish the session was a bit longer.',
    source: 'Nextdoor',
    referrals: 1,
    notes: 'Retired accountant. Uses AI for tax research.',
    createdAt: '2026-02-20T09:00:00Z',
    completedAt: '2026-02-21T11:00:00Z',
  },
  {
    id: 'c3',
    name: 'Sandra Lopez',
    phone: '(626) 555-0177',
    email: 'sandra.lopez@yahoo.com',
    address: '3310 Sunset Dr, Arcadia, CA 91006',
    device: 'mac',
    serviceTier: 'basic',
    status: 'booked',
    installedTools: [],
    reviewRating: null,
    reviewText: null,
    source: 'Referral - Margaret Chen',
    referrals: 0,
    notes: 'Referred by Margaret. Wants basic ChatGPT setup.',
    createdAt: '2026-03-10T08:00:00Z',
    completedAt: null,
  },
  {
    id: 'c4',
    name: 'James Park',
    phone: '(213) 555-0234',
    email: 'jpark.design@gmail.com',
    address: '445 Wilshire Blvd, Los Angeles, CA 90010',
    device: 'mac',
    serviceTier: 'premium',
    status: 'contacted',
    installedTools: [],
    reviewRating: null,
    reviewText: null,
    source: 'Instagram Ad',
    referrals: 0,
    notes: 'Graphic designer. Wants AI image generation tools.',
    createdAt: '2026-03-15T12:00:00Z',
    completedAt: null,
  },
  {
    id: 'c5',
    name: 'Dorothy Martinez',
    phone: '(562) 555-0311',
    email: 'dorothy.m@gmail.com',
    address: '780 Pine St, Long Beach, CA 90802',
    device: 'windows',
    serviceTier: 'pro',
    status: 'lead',
    installedTools: [],
    reviewRating: null,
    reviewText: null,
    source: 'Google Search',
    referrals: 0,
    notes: 'Called asking about pricing. Follow up Thursday.',
    createdAt: '2026-03-18T16:00:00Z',
    completedAt: null,
  },
  {
    id: 'c6',
    name: 'Frank Nguyen',
    phone: '(714) 555-0288',
    email: 'frank.nguyen@hotmail.com',
    address: '2100 Harbor Blvd, Costa Mesa, CA 92627',
    device: 'windows',
    serviceTier: 'basic',
    status: 'completed',
    installedTools: ['ChatGPT', 'Perplexity'],
    reviewRating: 5,
    reviewText: 'So easy! I use ChatGPT every day now.',
    source: 'Yelp',
    referrals: 3,
    notes: 'Very enthusiastic. Wants to refer his whole church group.',
    createdAt: '2026-03-01T10:00:00Z',
    completedAt: '2026-03-02T12:00:00Z',
  },
];

export const leads: Lead[] = [
  {
    id: 'l1',
    name: 'Patricia Kim',
    phone: '(323) 555-0199',
    email: 'pat.kim@gmail.com',
    source: 'Facebook Ad',
    status: 'new',
    interest: 'Pro tier - wants Copilot for writing',
    followUpDate: '2026-03-21',
    notes: '',
    createdAt: '2026-03-19T14:00:00Z',
  },
  {
    id: 'l2',
    name: 'George Thompson',
    phone: '(818) 555-0456',
    email: 'gthompson@aol.com',
    source: 'Referral - Frank Nguyen',
    status: 'contacted',
    interest: 'Basic setup for email and browsing help',
    followUpDate: '2026-03-22',
    notes: 'Spoke on phone. Very interested but needs to check schedule.',
    createdAt: '2026-03-17T09:00:00Z',
  },
  {
    id: 'l3',
    name: 'Helen Rivera',
    phone: '(626) 555-0333',
    email: 'hrivera@gmail.com',
    source: 'Google Search',
    status: 'qualified',
    interest: 'Premium - wants full AI workspace setup',
    followUpDate: null,
    notes: 'Ready to book. Sending calendar link.',
    createdAt: '2026-03-16T11:00:00Z',
  },
];

export const bookings: Booking[] = [
  {
    id: 'b1',
    clientId: 'c3',
    clientName: 'Sandra Lopez',
    tier: 'basic',
    price: 79,
    date: '2026-03-20',
    time: '10:00 AM',
    duration: 60,
    location: 'in-person',
    address: '3310 Sunset Dr, Arcadia, CA 91006',
    status: 'confirmed',
    paymentStatus: 'paid',
    notes: 'First-time client. Referred by Margaret.',
  },
  {
    id: 'b2',
    clientId: 'c4',
    clientName: 'James Park',
    tier: 'premium',
    price: 199,
    date: '2026-03-20',
    time: '2:00 PM',
    duration: 120,
    location: 'in-person',
    address: '445 Wilshire Blvd, Los Angeles, CA 90010',
    status: 'pending',
    paymentStatus: 'unpaid',
    notes: 'Wants Midjourney + DALL-E + ChatGPT + Copilot',
  },
  {
    id: 'b3',
    clientId: 'c5',
    clientName: 'Dorothy Martinez',
    tier: 'pro',
    price: 129,
    date: '2026-03-22',
    time: '11:00 AM',
    duration: 90,
    location: 'remote',
    address: null,
    status: 'confirmed',
    paymentStatus: 'unpaid',
    notes: 'Remote session via Zoom.',
  },
];

export const calls: Call[] = [
  {
    id: 'call1',
    callerName: 'Dorothy Martinez',
    callerPhone: '(562) 555-0311',
    date: '2026-03-18T16:22:00Z',
    duration: '4:32',
    summary: 'Asking about pricing for Pro tier. Interested in Copilot for work.',
    transcript: null,
    didBook: false,
    followUpStatus: 'sent',
    leadId: null,
  },
  {
    id: 'call2',
    callerName: 'George Thompson',
    callerPhone: '(818) 555-0456',
    date: '2026-03-17T09:15:00Z',
    duration: '6:10',
    summary: 'Referral from Frank. Wants basic setup. Checking schedule.',
    transcript: null,
    didBook: false,
    followUpStatus: 'responded',
    leadId: 'l2',
  },
  {
    id: 'call3',
    callerName: null,
    callerPhone: '(909) 555-0777',
    date: '2026-03-19T11:00:00Z',
    duration: '1:05',
    summary: 'Missed call. No voicemail left.',
    transcript: null,
    didBook: false,
    followUpStatus: 'none',
    leadId: null,
  },
];

export const agents: AgentInfo[] = [
  {
    id: 'a1',
    name: 'Lead Qualifier',
    role: 'Scores and qualifies inbound leads',
    status: 'active',
    currentTask: 'Scoring lead: Patricia Kim',
    lastAction: 'Qualified Helen Rivera as high-intent',
    taskQueue: 2,
    lastHeartbeat: '2026-03-20T08:55:00Z',
  },
  {
    id: 'a2',
    name: 'Follow-Up Bot',
    role: 'Sends follow-up texts and emails',
    status: 'active',
    currentTask: 'Sending follow-up to George Thompson',
    lastAction: 'Sent booking reminder to Sandra Lopez',
    taskQueue: 3,
    lastHeartbeat: '2026-03-20T08:50:00Z',
  },
  {
    id: 'a3',
    name: 'Review Collector',
    role: 'Requests and monitors Google reviews',
    status: 'idle',
    currentTask: null,
    lastAction: 'Sent review request to Frank Nguyen',
    taskQueue: 0,
    lastHeartbeat: '2026-03-20T08:45:00Z',
  },
  {
    id: 'a4',
    name: 'Booking Scheduler',
    role: 'Manages calendar and sends confirmations',
    status: 'active',
    currentTask: 'Confirming James Park appointment',
    lastAction: 'Scheduled Dorothy Martinez for March 22',
    taskQueue: 1,
    lastHeartbeat: '2026-03-20T08:52:00Z',
  },
];

export const revenue: RevenueEntry[] = [
  { id: 'r1', clientName: 'Margaret Chen', tier: 'premium', amount: 199, date: '2026-02-16', status: 'paid' },
  { id: 'r2', clientName: 'Robert Williams', tier: 'pro', amount: 129, date: '2026-02-21', status: 'paid' },
  { id: 'r3', clientName: 'Frank Nguyen', tier: 'basic', amount: 79, date: '2026-03-02', status: 'paid' },
  { id: 'r4', clientName: 'Sandra Lopez', tier: 'basic', amount: 79, date: '2026-03-20', status: 'paid' },
  { id: 'r5', clientName: 'James Park', tier: 'premium', amount: 199, date: '2026-03-20', status: 'pending' },
  { id: 'r6', clientName: 'Dorothy Martinez', tier: 'pro', amount: 129, date: '2026-03-22', status: 'pending' },
];

// Alias used by Revenue.tsx
export const revenueEntries = revenue;

export interface MonthlyRevenueEntry {
  month: string;
  basic: number;
  pro: number;
  premium: number;
}

export const monthlyRevenue: MonthlyRevenueEntry[] = [
  { month: 'Jan', basic: 0, pro: 0, premium: 0 },
  { month: 'Feb', basic: 0, pro: 129, premium: 199 },
  { month: 'Mar', basic: 158, pro: 129, premium: 199 },
];

export interface ActivityEvent {
  id: string;
  type: 'call' | 'booking' | 'review' | 'agent' | 'payment' | 'lead';
  title: string;
  description: string;
  timestamp: string;
}

export const activityFeed: ActivityEvent[] = [
  { id: 'ev1', type: 'agent', title: 'Lead Qualifier scored Patricia Kim', description: 'New lead from Facebook Ad -- high intent', timestamp: '2026-03-20T08:55:00Z' },
  { id: 'ev2', type: 'payment', title: 'Payment received: Sandra Lopez', description: '$79 -- Basic tier, in-person session', timestamp: '2026-03-20T08:30:00Z' },
  { id: 'ev3', type: 'booking', title: 'James Park appointment confirmed', description: 'Premium tier, 2:00 PM today, in-person', timestamp: '2026-03-20T07:45:00Z' },
  { id: 'ev4', type: 'agent', title: 'Follow-Up Bot sent reminder', description: 'Booking reminder to Sandra Lopez for 10:00 AM', timestamp: '2026-03-20T07:00:00Z' },
  { id: 'ev5', type: 'call', title: 'Missed call from (909) 555-0777', description: 'No voicemail left -- unknown caller', timestamp: '2026-03-19T11:00:00Z' },
  { id: 'ev6', type: 'review', title: 'New 5-star review: Frank Nguyen', description: '"So easy! I use ChatGPT every day now."', timestamp: '2026-03-19T09:00:00Z' },
  { id: 'ev7', type: 'lead', title: 'New lead: Patricia Kim', description: 'Facebook Ad -- interested in Pro tier', timestamp: '2026-03-19T14:00:00Z' },
  { id: 'ev8', type: 'call', title: 'Call with Dorothy Martinez', description: '4:32 -- asking about Pro tier pricing', timestamp: '2026-03-18T16:22:00Z' },
  { id: 'ev9', type: 'agent', title: 'Booking Scheduler confirmed Dorothy', description: 'Pro tier, March 22 at 11:00 AM, remote', timestamp: '2026-03-18T17:00:00Z' },
  { id: 'ev10', type: 'call', title: 'Call with George Thompson', description: '6:10 -- referral from Frank, checking schedule', timestamp: '2026-03-17T09:15:00Z' },
];

export const metrics = {
  totalClients: clients.length,
  activeLeads: leads.filter((l) => l.status !== 'completed').length,
  revenueThisMonth: revenue
    .filter((r) => r.date.startsWith('2026-03'))
    .reduce((sum, r) => sum + r.amount, 0),
  googleRating: 4.9,
  agentsActive: agents.filter((a) => a.status === 'active').length,
};

export interface TimelineEvent {
  date: string;
  label: string;
}

export const clientTimelines: Record<string, TimelineEvent[]> = {
  c1: [
    { date: '2026-02-15', label: 'Lead created via Google Search' },
    { date: '2026-02-15', label: 'Follow-Up Bot sent intro text' },
    { date: '2026-02-15', label: 'Client replied -- interested in Premium' },
    { date: '2026-02-15', label: 'Booking confirmed for Feb 16' },
    { date: '2026-02-16', label: 'Session completed -- 4 tools installed' },
    { date: '2026-02-17', label: '5-star Google review received' },
    { date: '2026-03-10', label: 'Referred Sandra Lopez' },
  ],
  c2: [
    { date: '2026-02-20', label: 'Lead created via Nextdoor' },
    { date: '2026-02-20', label: 'Phone call -- booked Pro session' },
    { date: '2026-02-21', label: 'Session completed -- 3 tools installed' },
    { date: '2026-02-22', label: '4-star Google review received' },
  ],
  c3: [
    { date: '2026-03-10', label: 'Referral from Margaret Chen' },
    { date: '2026-03-11', label: 'Follow-Up Bot sent intro text' },
    { date: '2026-03-15', label: 'Client replied -- wants Basic setup' },
    { date: '2026-03-18', label: 'Booking confirmed for March 20' },
    { date: '2026-03-20', label: 'Payment received -- $79' },
  ],
  c4: [
    { date: '2026-03-15', label: 'Lead created via Instagram Ad' },
    { date: '2026-03-16', label: 'Phone call -- interested in Premium' },
    { date: '2026-03-19', label: 'Booking confirmed for March 20' },
  ],
  c5: [
    { date: '2026-03-18', label: 'Inbound call -- asking about pricing' },
    { date: '2026-03-18', label: 'Follow-Up Bot sent pricing info' },
    { date: '2026-03-19', label: 'Client replied -- wants Pro tier' },
    { date: '2026-03-19', label: 'Booking confirmed for March 22' },
  ],
  c6: [
    { date: '2026-03-01', label: 'Lead created via Yelp' },
    { date: '2026-03-01', label: 'Phone call -- booked Basic session' },
    { date: '2026-03-02', label: 'Session completed -- 2 tools installed' },
    { date: '2026-03-03', label: '5-star Google review received' },
    { date: '2026-03-10', label: 'Referred George Thompson' },
    { date: '2026-03-14', label: 'Referred 2 more contacts' },
  ],
};
