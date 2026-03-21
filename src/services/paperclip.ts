// Paperclip API client for Simply AI CRM Dashboard
// Proxied through Vite: /paperclip → localhost:3100/api

const BASE = '/paperclip';
const COMPANY_ID = 'a9af7a13-74bd-4be3-a900-0a9b269c8cb1';

// ── Types ──────────────────────────────────────────────────────────────────

export interface PaperclipAgent {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  readonly title: string;
  readonly icon: string;
  readonly status: 'idle' | 'active' | 'paused' | 'error';
  readonly capabilities: string;
  readonly lastHeartbeatAt: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface PaperclipIssue {
  readonly id: string;
  readonly identifier: string;
  readonly title: string;
  readonly description: string;
  readonly status: 'todo' | 'in_progress' | 'blocked' | 'done' | 'cancelled';
  readonly priority: 'low' | 'medium' | 'high' | 'critical';
  readonly assigneeAgentId: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly completedAt: string | null;
}

export interface HeartbeatRun {
  readonly id: string;
  readonly agentId: string;
  readonly status: string;
  readonly startedAt: string;
  readonly completedAt: string | null;
}

// ── API Functions ──────────────────────────────────────────────────────────

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Paperclip API error ${res.status}: ${text}`);
  }
  return res.json();
}

/** List all agents in the company */
export async function listAgents(): Promise<PaperclipAgent[]> {
  return apiFetch<PaperclipAgent[]>(`/companies/${COMPANY_ID}/agents`);
}

/** List issues/tasks, optionally filtered */
export async function listIssues(filters?: {
  status?: string;
  assigneeAgentId?: string;
}): Promise<PaperclipIssue[]> {
  const params = new URLSearchParams();
  if (filters?.status) params.set('status', filters.status);
  if (filters?.assigneeAgentId) params.set('assigneeAgentId', filters.assigneeAgentId);
  const qs = params.toString();
  return apiFetch<PaperclipIssue[]>(
    `/companies/${COMPANY_ID}/issues${qs ? `?${qs}` : ''}`
  );
}

/** Create a new task/issue (always set to 'todo' so agents pick it up) */
export async function createIssue(data: {
  title: string;
  description: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  assigneeAgentId?: string;
}): Promise<PaperclipIssue> {
  return apiFetch<PaperclipIssue>(`/companies/${COMPANY_ID}/issues`, {
    method: 'POST',
    body: JSON.stringify({ ...data, status: 'todo' }),
  });
}

/** Invoke an agent's heartbeat (wake it up) */
export async function invokeHeartbeat(agentId: string): Promise<HeartbeatRun> {
  return apiFetch<HeartbeatRun>(`/agents/${agentId}/heartbeat/invoke`, {
    method: 'POST',
    body: JSON.stringify({}),
  });
}

/** Pause an agent */
export async function pauseAgent(agentId: string): Promise<void> {
  await apiFetch(`/agents/${agentId}/pause`, { method: 'POST', body: '{}' });
}

/** Resume an agent */
export async function resumeAgent(agentId: string): Promise<void> {
  await apiFetch(`/agents/${agentId}/resume`, { method: 'POST', body: '{}' });
}

/** Get recent heartbeat runs for the company */
export async function listHeartbeatRuns(): Promise<HeartbeatRun[]> {
  return apiFetch<HeartbeatRun[]>(`/companies/${COMPANY_ID}/heartbeat-runs`);
}

/** Add a comment to an issue */
export async function addComment(
  issueId: string,
  body: string,
): Promise<void> {
  await apiFetch(`/issues/${issueId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ body }),
  });
}

// ── Agent ID constants (Simply AI team) ────────────────────────────────────

export const AGENT_IDS = {
  operationsManager: '850c8159-9e91-4f55-b12b-7b9b38ae56ff',
  leadHandler: '447674da-25a5-4be1-93b5-64894c7b0ac9',
  bookingCoordinator: '42b8a098-62b3-4c3e-aa9e-c24535c10c56',
  reviewAgent: 'faa7fdb6-d143-4eb0-95ff-e77303c19e27',
  contentAgent: '01fe0195-2e82-4c15-aba4-e41b9c85b19f',
} as const;

/** Map agent ID to a friendly role key */
export function agentRole(id: string): keyof typeof AGENT_IDS | null {
  for (const [key, val] of Object.entries(AGENT_IDS)) {
    if (val === id) return key as keyof typeof AGENT_IDS;
  }
  return null;
}
