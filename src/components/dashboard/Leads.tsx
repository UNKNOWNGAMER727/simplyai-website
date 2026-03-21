import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, X, Phone, Mail, Calendar, MessageSquare, ChevronRight,
  Send, Link2, UserPlus,
} from 'lucide-react';
import { leads } from '../../data/mockData';
import { useToast } from '../ui/Toast';
import ActionButton from '../ui/ActionButton';
import { EmptyState } from '../ui/EmptyState';
import { createIssue, invokeHeartbeat, AGENT_IDS } from '../../services/paperclip';
import type { Lead } from '../../types/crm';

type KanbanColumn = 'new' | 'contacted' | 'booked' | 'completed';

const COLUMN_PLACEHOLDERS: Record<KanbanColumn, string> = {
  new: 'Incoming leads land here',
  contacted: "Leads you've reached out to",
  booked: 'Leads who booked appointments',
  completed: 'Finished customers',
};

const COLUMNS: { key: KanbanColumn; label: string; color: string; borderColor: string; bgColor: string; statuses: Lead['status'][] }[] = [
  { key: 'new', label: 'New', color: '#ff9f0a', borderColor: 'border-l-[#ff9f0a]', bgColor: 'bg-[#ff9f0a]/10', statuses: ['new'] },
  { key: 'contacted', label: 'Contacted', color: '#0071e3', borderColor: 'border-l-[#0071e3]', bgColor: 'bg-[#0071e3]/10', statuses: ['contacted', 'qualified'] },
  { key: 'booked', label: 'Booked', color: '#34c759', borderColor: 'border-l-[#34c759]', bgColor: 'bg-[#34c759]/10', statuses: ['booked'] },
  { key: 'completed', label: 'Completed', color: '#bf5af2', borderColor: 'border-l-[#bf5af2]', bgColor: 'bg-[#bf5af2]/10', statuses: ['completed', 'lost'] },
];

function LeadCard({ lead, column, onClick }: { lead: Lead; column: typeof COLUMNS[number]; onClick: () => void }) {
  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      onClick={onClick}
      className={`w-full text-left bg-[#222] rounded-lg p-3 border-l-4 ${column.borderColor} hover:bg-[#2a2a2a] transition-colors cursor-pointer group`}
    >
      <p className="text-sm font-medium text-white truncate">{lead.name}</p>
      <p className="text-xs text-gray-400 mt-1 line-clamp-2">{lead.interest}</p>
      <div className="flex items-center justify-between mt-2">
        <span className="text-[10px] text-gray-500">{new Date(lead.createdAt).toLocaleDateString()}</span>
        <ChevronRight size={14} className="text-gray-600 group-hover:text-gray-400 transition-colors" />
      </div>
    </motion.button>
  );
}

function LeadDetailPanel({ lead, column, onClose }: { lead: Lead; column: typeof COLUMNS[number]; onClose: () => void }) {
  const { toast } = useToast();

  const makeAction = (action: string) => async () => {
    switch (action) {
      case 'contact': {
        await createIssue({
          title: `Contact lead: ${lead.name}`,
          description: `New lead ${lead.name} from ${lead.source}. Phone: ${lead.phone}, Email: ${lead.email}. Interest: "${lead.interest}". Reach out within 2 hours with personalized message. Suggest the right tier.${lead.notes ? ` Notes: ${lead.notes}` : ''}`,
          priority: 'high',
          assigneeAgentId: AGENT_IDS.leadHandler,
        });
        await invokeHeartbeat(AGENT_IDS.leadHandler);
        toast(`Contact task sent to Lead Handler`);
        break;
      }
      case 'book': {
        await createIssue({
          title: `Send booking link to ${lead.name}`,
          description: `Lead ${lead.name} is qualified and ready to book. Phone: ${lead.phone}, Email: ${lead.email}. Interest: "${lead.interest}". Send them the booking link: cal.com/simplytech.ai with a personalized message recommending the right tier.`,
          priority: 'high',
          assigneeAgentId: AGENT_IDS.leadHandler,
        });
        await invokeHeartbeat(AGENT_IDS.leadHandler);
        toast(`Booking link task sent to Lead Handler`);
        break;
      }
      case 'nurture': {
        await createIssue({
          title: `Nurture lead: ${lead.name}`,
          description: `Lead ${lead.name} hasn't converted yet. Start nurture sequence: Day 3 gentle follow-up, Day 7 share an AI tip, Day 14 final touchpoint. Phone: ${lead.phone}, Email: ${lead.email}. Interest: "${lead.interest}".`,
          priority: 'medium',
          assigneeAgentId: AGENT_IDS.leadHandler,
        });
        await invokeHeartbeat(AGENT_IDS.leadHandler);
        toast(`Nurture sequence started for ${lead.name}`);
        break;
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#1a1a1a] rounded-2xl w-full max-w-lg mx-4 border border-white/10 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: column.color }}>
              {lead.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{lead.name}</h3>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: `${column.color}20`, color: column.color }}>
                {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Phone size={14} className="text-gray-500" />
              {lead.phone}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Mail size={14} className="text-gray-500" />
              {lead.email}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Calendar size={14} className="text-gray-500" />
              {new Date(lead.createdAt).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <MessageSquare size={14} className="text-gray-500" />
              {lead.source}
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Interest</p>
            <p className="text-sm text-gray-200">{lead.interest}</p>
          </div>

          {lead.followUpDate && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Follow-up Date</p>
              <p className="text-sm text-[#ff9f0a]">{lead.followUpDate}</p>
            </div>
          )}

          {lead.notes && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Notes</p>
              <p className="text-sm text-gray-300">{lead.notes}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 p-5 pt-0">
          <ActionButton
            onClick={makeAction('contact')}
            icon={<Send size={14} />}
            label="Contact"
            variant="accent"
            color="#0071e3"
            size="md"
            className="flex-1 justify-center"
          />
          <ActionButton
            onClick={makeAction('book')}
            icon={<Link2 size={14} />}
            label="Send Booking Link"
            variant="success"
            size="md"
            className="flex-1 justify-center"
          />
          <ActionButton
            onClick={makeAction('nurture')}
            icon={<Calendar size={14} />}
            label="Nurture"
            variant="accent"
            color="#bf5af2"
            size="md"
            className="flex-1 justify-center"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Leads() {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLead, setNewLead] = useState({ name: '', phone: '', email: '', source: '', interest: '' });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const grouped = useMemo(() => {
    const map: Record<KanbanColumn, Lead[]> = { new: [], contacted: [], booked: [], completed: [] };
    for (const lead of leads) {
      const col = COLUMNS.find(c => c.statuses.includes(lead.status));
      if (col) {
        map[col.key].push(lead);
      }
    }
    return map;
  }, []);

  const allEmpty = COLUMNS.every(col => grouped[col.key].length === 0);

  const selectedColumn = selectedLead
    ? COLUMNS.find(c => c.statuses.includes(selectedLead.status)) ?? COLUMNS[0]
    : COLUMNS[0];

  const handleAddLead = async () => {
    if (!newLead.name.trim()) return;
    setSaving(true);
    try {
      await createIssue({
        title: `New lead added: ${newLead.name}`,
        description: `Manually added lead. Name: ${newLead.name}, Phone: ${newLead.phone}, Email: ${newLead.email}, Source: ${newLead.source}, Interest: ${newLead.interest}. Qualify and follow up within 2 hours.`,
        priority: 'high',
        assigneeAgentId: AGENT_IDS.leadHandler,
      });
      await invokeHeartbeat(AGENT_IDS.leadHandler);
      toast(`Lead "${newLead.name}" created and assigned to Lead Handler`);
      setNewLead({ name: '', phone: '', email: '', source: '', interest: '' });
      setShowAddForm(false);
    } catch (err) {
      toast(`Failed to create lead: ${err}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Lead Pipeline</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0071e3] text-white text-sm font-medium hover:bg-[#0071e3]/80 transition-colors"
        >
          <Plus size={16} />
          Add Lead
        </button>
      </div>

      {/* Add Lead Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-[#1a1a1a] rounded-xl border border-white/10 p-4">
              <div className="grid grid-cols-2 gap-3">
                <input
                  placeholder="Name"
                  value={newLead.name}
                  onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                  className="bg-[#222] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#0071e3]"
                />
                <input
                  placeholder="Phone"
                  value={newLead.phone}
                  onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                  className="bg-[#222] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#0071e3]"
                />
                <input
                  placeholder="Email"
                  value={newLead.email}
                  onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                  className="bg-[#222] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#0071e3]"
                />
                <input
                  placeholder="Source"
                  value={newLead.source}
                  onChange={(e) => setNewLead({ ...newLead, source: e.target.value })}
                  className="bg-[#222] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#0071e3]"
                />
                <input
                  placeholder="Interest"
                  value={newLead.interest}
                  onChange={(e) => setNewLead({ ...newLead, interest: e.target.value })}
                  className="col-span-2 bg-[#222] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#0071e3]"
                />
              </div>
              <div className="flex justify-end gap-2 mt-3">
                <button onClick={() => setShowAddForm(false)} className="px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:text-white transition-colors">
                  Cancel
                </button>
                <ActionButton
                  onClick={async () => { await handleAddLead(); }}
                  icon={<Plus size={14} />}
                  label="Save & Assign to Lead Handler"
                  variant="success"
                  disabled={saving || !newLead.name.trim()}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State or Kanban Board */}
      {allEmpty ? (
        <EmptyState
          icon={UserPlus}
          title="No leads yet"
          description="Leads from calls, website visits, and referrals will appear here. Use the Add Lead button to manually add prospects."
          actionLabel="Add Lead"
          onAction={() => setShowAddForm(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {COLUMNS.map((col) => (
            <div key={col.key} className="bg-[#1a1a1a] rounded-xl border border-white/10 p-3">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col.color }} />
                  <span className="text-sm font-semibold text-white">{col.label}</span>
                </div>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: `${col.color}20`, color: col.color }}
                >
                  {grouped[col.key].length}
                </span>
              </div>

              <div className="space-y-2">
                <AnimatePresence>
                  {grouped[col.key].map((lead) => (
                    <LeadCard key={lead.id} lead={lead} column={col} onClick={() => setSelectedLead(lead)} />
                  ))}
                </AnimatePresence>
                {grouped[col.key].length === 0 && (
                  <p className="text-xs text-gray-600 text-center py-4 italic">
                    {COLUMN_PLACEHOLDERS[col.key]}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedLead && (
          <LeadDetailPanel
            lead={selectedLead}
            column={selectedColumn}
            onClose={() => setSelectedLead(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
