export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  device: 'mac' | 'windows';
  serviceTier: 'basic' | 'pro' | 'premium';
  status: 'lead' | 'contacted' | 'booked' | 'completed' | 'cancelled';
  installedTools: string[];
  reviewRating: number | null;
  reviewText: string | null;
  source: string;
  referrals: number;
  notes: string;
  createdAt: string;
  completedAt: string | null;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'booked' | 'completed' | 'lost';
  interest: string;
  followUpDate: string | null;
  notes: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  clientId: string;
  clientName: string;
  tier: 'basic' | 'pro' | 'premium';
  price: number;
  date: string;
  time: string;
  duration: number;
  location: 'in-person' | 'remote';
  address: string | null;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled' | 'no-show';
  paymentStatus: 'paid' | 'unpaid' | 'partial';
  notes: string;
}

export interface Call {
  id: string;
  callerName: string | null;
  callerPhone: string;
  date: string;
  duration: string;
  summary: string;
  transcript: string | null;
  didBook: boolean;
  followUpStatus: 'none' | 'sent' | 'responded';
  leadId: string | null;
}

export interface AgentInfo {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'idle' | 'error';
  currentTask: string | null;
  lastAction: string;
  taskQueue: number;
  lastHeartbeat: string;
}

export interface RevenueEntry {
  id: string;
  clientName: string;
  tier: 'basic' | 'pro' | 'premium';
  amount: number;
  date: string;
  status: 'paid' | 'pending';
}
