import type { Client, Lead, Booking, Call, AgentInfo, RevenueEntry } from '../types/crm';

export const clients: Client[] = [];

export const leads: Lead[] = [];

export const bookings: Booking[] = [];

export const calls: Call[] = [];

export const agents: AgentInfo[] = [];

export const revenue: RevenueEntry[] = [];

// Alias used by Revenue.tsx
export const revenueEntries = revenue;

export interface MonthlyRevenueEntry {
  month: string;
  basic: number;
  pro: number;
  premium: number;
}

export const monthlyRevenue: MonthlyRevenueEntry[] = [];

export interface ActivityEvent {
  id: string;
  type: 'call' | 'booking' | 'review' | 'agent' | 'payment' | 'lead';
  title: string;
  description: string;
  timestamp: string;
}

export const activityFeed: ActivityEvent[] = [];

export const metrics = {
  totalClients: 0,
  activeLeads: 0,
  revenueThisMonth: 0,
  googleRating: 0,
  agentsActive: 0,
};

export interface TimelineEvent {
  date: string;
  label: string;
}

export const clientTimelines: Record<string, TimelineEvent[]> = {};
