import { motion } from 'framer-motion';
import { Check, X, AlertTriangle } from 'lucide-react';

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
});

const recommended = [
  {
    name: 'Perplexity',
    what: 'AI search engine with real sources',
    cost: 'Free / $20 Pro',
    safety: 'High',
    whyGood: ['Desktop app (Mac + Windows)', 'Shows sources for every answer', 'Clean, simple interface', 'No risk of autonomous actions'],
  },
  {
    name: 'Microsoft Copilot',
    what: 'AI assistant built into Windows',
    cost: 'Free / $20 Pro',
    safety: 'Very High',
    whyGood: ['Already on every Windows PC', 'Microsoft backing', 'Integrates with Word, Excel, etc.', 'Extremely safe defaults'],
  },
  {
    name: 'ChatGPT',
    what: 'General-purpose AI for everything',
    cost: 'Free / $20 Plus',
    safety: 'High',
    whyGood: ['Best overall AI quality', 'Desktop app (Mac + Windows)', 'Image generation built in', 'Clear ownership of outputs'],
  },
];

const businessTools = [
  { category: 'Website', name: 'Carrd or Next.js + Vercel', cost: '$0–2/mo' },
  { category: 'Booking', name: 'Cal.com', cost: 'Free' },
  { category: 'Payments', name: 'Stripe', cost: '2.9% per sale' },
  { category: 'Phone AI', name: 'ElevenLabs (Simi)', cost: '~$22/mo' },
  { category: 'Social Media', name: 'Buffer', cost: 'Free' },
  { category: 'Local SEO', name: 'Google Business Profile', cost: 'Free' },
  { category: 'Cold Email', name: 'Apollo.io', cost: 'Free' },
  { category: 'Automation', name: 'Make.com (existing sub)', cost: 'Free' },
  { category: 'AI Content', name: 'OpenAI API via Make.com', cost: '~$5/mo' },
  { category: 'Management', name: 'Paperclip', cost: 'Free' },
];

export function Tools() {
  return (
    <div className="space-y-20">
      <section className="text-center pt-8">
        <motion.h1 {...fade(0)} className="text-[44px] font-semibold tracking-tight">
          Your toolkit.
        </motion.h1>
        <motion.p {...fade(0.06)} className="text-[17px] text-[#86868b] mt-3">
          What you install for customers. What runs your business.
        </motion.p>
      </section>

      {/* What you install */}
      <section>
        <motion.h2 {...fade(0)} className="text-[28px] font-semibold tracking-tight mb-8">
          What you install for customers.
        </motion.h2>
        <div className="grid grid-cols-3 gap-5">
          {recommended.map((tool, i) => (
            <motion.div
              key={tool.name}
              {...fade(i * 0.06)}
              className="bg-white rounded-2xl p-6 border border-black/[0.04]"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[17px] font-semibold">{tool.name}</h3>
                <span className="text-[11px] font-semibold text-[#34c759] bg-[#34c759]/8 px-2 py-0.5 rounded-md">
                  {tool.safety}
                </span>
              </div>
              <p className="text-[13px] text-[#86868b] mb-1">{tool.what}</p>
              <p className="text-[13px] font-semibold text-[#1d1d1f] mb-4">{tool.cost}</p>
              <div className="space-y-2">
                {tool.whyGood.map((point) => (
                  <div key={point} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-[#34c759] shrink-0 mt-0.5" strokeWidth={2.5} />
                    <span className="text-[13px] text-[#424245]">{point}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Manus Warning */}
      <motion.section {...fade(0)}>
        <div className="bg-[#ff3b30]/[0.04] rounded-2xl p-6 border border-[#ff3b30]/10">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#ff3b30] shrink-0 mt-0.5" strokeWidth={1.8} />
            <div>
              <h3 className="text-[15px] font-semibold mb-2">Why not Manus AI?</h3>
              <div className="grid grid-cols-2 gap-x-8 gap-y-1.5">
                {[
                  'Data sent to servers in China',
                  'Terms of service prohibit reselling',
                  'Runs terminal commands on user machines',
                  'Non-tech users can\'t evaluate what it does',
                  'Autonomous agent = unpredictable behavior',
                  'Huge liability risk for you as installer',
                ].map((reason) => (
                  <div key={reason} className="flex items-start gap-2">
                    <X className="w-3.5 h-3.5 text-[#ff3b30] shrink-0 mt-0.5" strokeWidth={2.5} />
                    <span className="text-[13px] text-[#6e6e73]">{reason}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Business tools */}
      <section>
        <motion.h2 {...fade(0)} className="text-[28px] font-semibold tracking-tight mb-8">
          What runs your business.
        </motion.h2>
        <motion.div {...fade(0.06)} className="bg-white rounded-2xl border border-black/[0.04] overflow-hidden">
          {businessTools.map((tool, i) => (
            <div
              key={tool.name}
              className={`flex items-center justify-between px-6 py-3.5 ${
                i < businessTools.length - 1 ? 'border-b border-black/[0.03]' : ''
              }`}
            >
              <div className="flex items-center gap-6">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#86868b] w-24">{tool.category}</span>
                <span className="text-[14px] font-medium text-[#1d1d1f]">{tool.name}</span>
              </div>
              <span className="text-[13px] font-semibold text-[#34c759]">{tool.cost}</span>
            </div>
          ))}
          <div className="flex items-center justify-between px-6 py-4 bg-[#f5f5f7]">
            <span className="text-[14px] font-semibold">Total monthly overhead</span>
            <span className="text-[17px] font-semibold">~$173/mo</span>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
