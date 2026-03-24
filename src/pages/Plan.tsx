import { motion } from 'framer-motion';

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
});

const phases = [
  {
    number: '01',
    name: 'Website + Booking',
    status: 'Now',
    statusColor: 'bg-[#0071e3] text-white',
    what: 'Professional landing page with your 3 service tiers, online booking through Cal.com, and Stripe payments.',
    cost: '$0–2/mo',
    tools: ['Next.js or Carrd', 'Cal.com (free)', 'Stripe', 'Vercel (free)'],
    tasks: [
      'Pick business name',
      'Buy domain',
      'Build landing page with tiers',
      'Set up Cal.com booking',
      'Connect Stripe for payments',
      'Deploy to Vercel',
    ],
  },
  {
    number: '02',
    name: 'AI Phone Assistant',
    status: 'Next',
    statusColor: 'bg-[#f5f5f7] text-[#86868b]',
    what: 'An AI that answers inbound calls 24/7, cold calls leads, follows up with customers, and books appointments — all without you touching the phone.',
    cost: '$16.67/mo',
    tools: ['ElevenLabs Conversational AI (~$22/mo)', 'Cal.com booking integration'],
    tasks: [
      'ElevenLabs agent (Simi) configured and live at (361) 315-8585',
      'Cal.com booking integrated — Simi books appointments on the call',
      'Post-call webhook logging all calls to CRM',
      'Telegram notifications for hot leads',
      'Paperclip agents auto-assigned follow-up tasks',
    ],
  },
  {
    number: '03',
    name: 'AI Marketing',
    status: 'Later',
    statusColor: 'bg-[#f5f5f7] text-[#86868b]',
    what: 'Automated social media posts, Google Business Profile for local search, cold email outreach, and eventually paid ads.',
    cost: '$3–50/mo',
    tools: ['Google Business Profile (free)', 'Buffer (free)', 'Make.com (free)', 'Apollo.io (free)'],
    tasks: [
      'Set up Google Business Profile',
      'Create social media accounts',
      'Set up Buffer for scheduling',
      'Build Make.com content workflows',
      'Start Apollo.io cold outreach',
    ],
  },
  {
    number: '04',
    name: 'AI Manager',
    status: 'Later',
    statusColor: 'bg-[#f5f5f7] text-[#86868b]',
    what: 'A central AI that coordinates all your other AI agents and sends you a daily morning briefing. You just read it and go do installs.',
    cost: '$0 (Paperclip)',
    tools: ['Paperclip', 'Telegram/SMS', 'Make.com'],
    tasks: [
      'Connect all agents to Paperclip',
      'Set up daily report workflow',
      'Configure Telegram notifications',
      'Build escalation rules',
    ],
  },
];

export function Plan() {
  return (
    <div className="space-y-20">
      <section className="text-center pt-8">
        <motion.h1 {...fade(0)} className="text-[44px] font-semibold tracking-tight">
          The plan.
        </motion.h1>
        <motion.p {...fade(0.06)} className="text-[17px] text-[#86868b] mt-3 max-w-md mx-auto">
          Four phases. Each one makes the business more automated.
          <br />By Phase 4, you just show up and install.
        </motion.p>
      </section>

      {phases.map((phase) => (
        <motion.section
          key={phase.number}
          {...fade(0)}
          className="grid grid-cols-[100px_1fr] gap-8"
        >
          {/* Number */}
          <div className="text-right pt-1">
            <span className="text-[64px] font-bold text-black/[0.06] leading-none">{phase.number}</span>
          </div>

          {/* Content */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-[24px] font-semibold tracking-tight">{phase.name}</h2>
              <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${phase.statusColor}`}>
                {phase.status}
              </span>
            </div>
            <p className="text-[16px] text-[#86868b] leading-relaxed max-w-xl mb-6">
              {phase.what}
            </p>

            <div className="grid grid-cols-2 gap-6">
              {/* Tasks */}
              <div className="bg-white rounded-2xl p-5 border border-black/[0.04]">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#86868b] mb-3">To do</p>
                <div className="space-y-2">
                  {phase.tasks.map((task) => (
                    <div key={task} className="flex items-center gap-2.5">
                      <div className="w-4 h-4 rounded-full border-[1.5px] border-black/[0.12] shrink-0" />
                      <span className="text-[13px] text-[#424245]">{task}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tools + Cost */}
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-5 border border-black/[0.04]">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#86868b] mb-3">Tools</p>
                  <div className="flex flex-wrap gap-2">
                    {phase.tools.map((tool) => (
                      <span key={tool} className="text-[12px] text-[#6e6e73] bg-[#f5f5f7] px-3 py-1.5 rounded-lg">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-black/[0.04]">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#86868b] mb-1">Monthly cost</p>
                  <p className="text-[22px] font-semibold tracking-tight">{phase.cost}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      ))}
    </div>
  );
}
