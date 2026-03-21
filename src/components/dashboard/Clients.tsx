import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Client } from '../../types/crm';
import { clients as allClients, clientTimelines } from '../../data/mockData';

const tierColors: Record<Client['serviceTier'], string> = {
  basic: '#0071e3',
  pro: '#bf5af2',
  premium: '#ff9f0a',
};

const statusColors: Record<Client['status'], string> = {
  lead: '#ff9f0a',
  contacted: '#0071e3',
  booked: '#bf5af2',
  completed: '#34c759',
  cancelled: '#ff375f',
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' as const } },
};

export function Clients() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editingNotes, setEditingNotes] = useState<string>('');

  const filtered = allClients.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.serviceTier.includes(q) ||
      c.status.includes(q)
    );
  });

  function handleSelectClient(client: Client) {
    if (selectedClient?.id === client.id) {
      setSelectedClient(null);
    } else {
      setSelectedClient(client);
      setEditingNotes(client.notes);
    }
  }

  const timeline = selectedClient ? clientTimelines[selectedClient.id] ?? [] : [];

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={fadeUp} className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search clients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 rounded-xl border border-neutral-800 bg-[#1a1a1a] px-4 py-2.5 text-sm text-white placeholder-neutral-500 outline-none focus:border-[#0071e3] transition-colors"
        />
        <button
          type="button"
          className="shrink-0 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-80"
          style={{ backgroundColor: '#0071e3' }}
        >
          + Add Client
        </button>
      </motion.div>

      {/* Table */}
      <motion.div variants={fadeUp} className="overflow-x-auto rounded-2xl" style={{ backgroundColor: '#1a1a1a' }}>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-800 text-xs uppercase text-neutral-500">
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Contact</th>
              <th className="px-5 py-3 font-medium">Service</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Last Activity</th>
              <th className="px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((client) => (
              <tr
                key={client.id}
                onClick={() => handleSelectClient(client)}
                className={`cursor-pointer border-b border-neutral-800/50 transition-colors hover:bg-neutral-800/40 ${
                  selectedClient?.id === client.id ? 'bg-neutral-800/60' : ''
                }`}
              >
                <td className="px-5 py-3 font-medium text-white">{client.name}</td>
                <td className="px-5 py-3">
                  <p className="text-neutral-300">{client.phone}</p>
                  <p className="text-xs text-neutral-500">{client.email}</p>
                </td>
                <td className="px-5 py-3">
                  <span
                    className="rounded-full px-3 py-1 text-xs font-medium"
                    style={{
                      backgroundColor: `${tierColors[client.serviceTier]}20`,
                      color: tierColors[client.serviceTier],
                    }}
                  >
                    {client.serviceTier}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: statusColors[client.status] }}
                    />
                    <span className="text-neutral-300">{client.status}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-neutral-400">
                  {formatDate(client.completedAt ?? client.createdAt)}
                </td>
                <td className="px-5 py-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="rounded-lg border border-neutral-700 px-3 py-1 text-xs text-neutral-300 transition-colors hover:border-neutral-500 hover:text-white"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-neutral-500">
                  No clients match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </motion.div>

      {/* Detail Panel */}
      <AnimatePresence>
        {selectedClient && (
          <motion.div
            key={selectedClient.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl p-6 space-y-6" style={{ backgroundColor: '#1a1a1a' }}>
              {/* Detail Header */}
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedClient.name}</h3>
                  <p className="text-sm text-neutral-400">
                    {selectedClient.device === 'mac' ? 'Mac' : 'Windows'} &middot;{' '}
                    <span style={{ color: tierColors[selectedClient.serviceTier] }}>
                      {selectedClient.serviceTier.charAt(0).toUpperCase() +
                        selectedClient.serviceTier.slice(1)}
                    </span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <ActionButton label="Call" color="#34c759" />
                  <ActionButton label="Email" color="#0071e3" />
                  <ActionButton label="Edit" color="#ff9f0a" />
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <InfoField label="Phone" value={selectedClient.phone} />
                <InfoField label="Email" value={selectedClient.email} />
                <InfoField label="Address" value={selectedClient.address} />
                <InfoField label="Device" value={selectedClient.device === 'mac' ? 'Mac' : 'Windows'} />
                <InfoField label="Service Tier" value={selectedClient.serviceTier} />
                <InfoField
                  label="Installed Tools"
                  value={
                    selectedClient.installedTools.length > 0
                      ? selectedClient.installedTools.join(', ')
                      : 'None yet'
                  }
                />
                <InfoField
                  label="Review"
                  value={
                    selectedClient.reviewRating
                      ? `${'★'.repeat(selectedClient.reviewRating)}${'☆'.repeat(5 - selectedClient.reviewRating)}`
                      : 'Pending'
                  }
                />
                <InfoField label="Source" value={selectedClient.source} />
                <InfoField label="Referrals" value={String(selectedClient.referrals)} />
              </div>

              {/* Timeline */}
              {timeline.length > 0 && (
                <div>
                  <h4 className="mb-3 text-sm font-semibold text-neutral-300">Timeline</h4>
                  <div className="space-y-2">
                    {timeline.map((event, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#0071e3]" />
                        <div>
                          <p className="text-sm text-white">{event.label}</p>
                          <p className="text-xs text-neutral-500">{event.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <h4 className="mb-2 text-sm font-semibold text-neutral-300">Notes</h4>
                <textarea
                  value={editingNotes}
                  onChange={(e) => setEditingNotes(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-neutral-800 bg-[#111] px-4 py-3 text-sm text-white placeholder-neutral-600 outline-none focus:border-[#0071e3] transition-colors resize-none"
                  placeholder="Add notes about this client..."
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ActionButton({ label, color }: { label: string; color: string }) {
  return (
    <button
      type="button"
      className="rounded-lg px-4 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-80"
      style={{ backgroundColor: color }}
    >
      {label}
    </button>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-neutral-500">{label}</p>
      <p className="text-sm text-neutral-200">{value}</p>
    </div>
  );
}
