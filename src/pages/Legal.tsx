import { motion } from 'framer-motion';
import { AlertTriangle, Shield } from 'lucide-react';

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
});

const checklist = [
  { task: 'Form California LLC', cost: '$70', priority: 'Do first', note: '$800/yr tax waived year 1' },
  { task: 'Get EIN from IRS', cost: 'Free', priority: 'Do first', note: 'Takes 5 minutes online' },
  { task: 'Open business bank account', cost: 'Free', priority: 'Do first', note: 'Never mix personal + business' },
  { task: 'Draft liability waiver', cost: 'Free → $750 attorney review', priority: 'Do first', note: 'Every customer signs before install' },
  { task: 'Tech E&O insurance', cost: '~$67/mo', priority: 'Before first install', note: 'Covers "AI gave bad advice" claims' },
  { task: 'General liability insurance', cost: '~$40/mo', priority: 'Before first install', note: 'Covers property damage at customer site' },
  { task: 'City of LA business license', cost: '$150–300/yr', priority: 'Within 30 days', note: 'Required to operate in LA' },
  { task: 'Audit Perplexity + ChatGPT ToS', cost: 'Free', priority: 'Before launch', note: 'Confirm 3rd-party install is allowed' },
];

const waiverClauses = [
  'AI software is a third-party product — you didn\'t create it',
  'You provide installation and training only',
  'You are not responsible for what the AI generates',
  'Customer agrees not to use AI for anything harmful or illegal',
  'No warranty on AI accuracy — it can be wrong',
  'Customer assumes all risk for decisions based on AI output',
  'Your liability is capped at the service fee they paid',
  'Customer holds you harmless (indemnification)',
  'California law, LA County jurisdiction',
];

export function Legal() {
  return (
    <div className="space-y-20">
      <section className="text-center pt-8">
        <motion.h1 {...fade(0)} className="text-[44px] font-semibold tracking-tight">
          Protect yourself.
        </motion.h1>
        <motion.p {...fade(0.06)} className="text-[17px] text-[#86868b] mt-3 max-w-md mx-auto">
          LLC, waiver, insurance. Do these before your first install.
        </motion.p>
      </section>

      {/* AB 316 Warning */}
      <motion.section {...fade(0)}>
        <div className="bg-[#1d1d1f] rounded-3xl p-8 text-white">
          <div className="flex items-start gap-4">
            <Shield className="w-6 h-6 text-[#ff9500] shrink-0 mt-1" strokeWidth={1.8} />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#ff9500] mb-2">California Law</p>
              <h3 className="text-[20px] font-semibold mb-2">AB 316 — Effective January 1, 2026</h3>
              <p className="text-[15px] text-white/60 leading-relaxed mb-4">
                Anyone who uses AI systems — including people who install them — can be held liable for harm.
                The "the AI did it, not me" defense is gone.
              </p>
              <p className="text-[14px] text-white/40">
                This is why the waiver and insurance below are non-negotiable.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Checklist */}
      <section>
        <motion.h2 {...fade(0)} className="text-[28px] font-semibold tracking-tight mb-8">
          The checklist.
        </motion.h2>
        <div className="space-y-2">
          {checklist.map((item, i) => (
            <motion.div
              key={item.task}
              {...fade(i * 0.03)}
              className="bg-white rounded-xl px-6 py-4 border border-black/[0.04] flex items-center gap-5"
            >
              <div className="w-5 h-5 rounded-full border-[1.5px] border-black/[0.12] shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-medium text-[#1d1d1f]">{item.task}</p>
                <p className="text-[12px] text-[#86868b]">{item.note}</p>
              </div>
              <span className="text-[12px] font-semibold text-[#86868b] bg-[#f5f5f7] px-2.5 py-1 rounded-md shrink-0">
                {item.priority}
              </span>
              <span className="text-[13px] font-semibold text-[#1d1d1f] w-28 text-right shrink-0">
                {item.cost}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Waiver */}
      <section>
        <motion.h2 {...fade(0)} className="text-[28px] font-semibold tracking-tight mb-3">
          The waiver.
        </motion.h2>
        <motion.p {...fade(0.04)} className="text-[15px] text-[#86868b] mb-8">
          Every customer signs this before you touch their computer.
        </motion.p>
        <motion.div {...fade(0.08)} className="bg-white rounded-2xl p-8 border border-black/[0.04]">
          <div className="space-y-4">
            {waiverClauses.map((clause, i) => (
              <div key={i} className="flex items-start gap-4">
                <span className="text-[12px] font-mono text-[#86868b] w-5 shrink-0 text-right mt-0.5">{i + 1}</span>
                <p className="text-[14px] text-[#424245] leading-relaxed">{clause}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Disclaimer */}
      <motion.section {...fade(0)} className="pb-8">
        <div className="flex items-start gap-3 bg-[#ff9500]/[0.04] rounded-2xl px-6 py-4 border border-[#ff9500]/10">
          <AlertTriangle className="w-4 h-4 text-[#ff9500] shrink-0 mt-0.5" strokeWidth={2} />
          <p className="text-[13px] text-[#6e6e73]">
            This is not legal advice. Get a California business attorney to review everything before launching.
            Budget $500–1,000 for a review. It's worth it.
          </p>
        </div>
      </motion.section>
    </div>
  );
}
