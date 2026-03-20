import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
});

const tiers = [
  {
    name: 'Basic',
    price: 300,
    desc: 'Get started with AI.',
    features: [
      'Perplexity AI installed',
      'Microsoft Copilot activated',
      'Account setup & config',
      '30-min walkthrough',
      'Quick-start cheat sheet',
    ],
  },
  {
    name: 'Pro',
    price: 500,
    desc: 'The full experience.',
    popular: true,
    features: [
      'Everything in Basic',
      'Perplexity Pro (first month included)',
      'ChatGPT setup & config',
      'Privacy & safety hardening',
      '1-hour training session',
      'Custom bookmarks & tips',
      '7-day email support',
    ],
  },
  {
    name: 'Premium',
    price: 1000,
    desc: 'Total AI transformation.',
    features: [
      'Everything in Pro',
      'Perplexity Pro + ChatGPT Plus + Copilot Pro',
      'Up to 3 devices',
      'Custom prompt library',
      '2-hour deep training',
      '30-day phone & email support',
      'Follow-up home visit',
    ],
  },
];

export function Pricing() {
  return (
    <div className="space-y-16">
      <section className="text-center pt-8">
        <motion.h1 {...fade(0)} className="text-[44px] font-semibold tracking-tight">
          Simple pricing.
        </motion.h1>
        <motion.p {...fade(0.06)} className="text-[17px] text-[#86868b] mt-3">
          One visit. One fee. No subscriptions from you.
        </motion.p>
      </section>

      <div className="grid grid-cols-3 gap-5">
        {tiers.map((tier, i) => (
          <motion.div
            key={tier.name}
            {...fade(i * 0.08)}
            className={`rounded-3xl p-8 ${
              tier.popular
                ? 'bg-[#1d1d1f] text-white'
                : 'bg-white border border-black/[0.06]'
            }`}
          >
            {tier.popular && (
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#0071e3] mb-4 block">
                Most popular
              </span>
            )}
            <h3 className={`text-[13px] font-semibold uppercase tracking-wider ${
              tier.popular ? 'text-white/50' : 'text-[#86868b]'
            }`}>
              {tier.name}
            </h3>
            <p className="text-[48px] font-semibold tracking-tight mt-2 leading-none">
              ${tier.price}
            </p>
            <p className={`text-[14px] mt-2 mb-8 ${
              tier.popular ? 'text-white/40' : 'text-[#86868b]'
            }`}>
              {tier.desc}
            </p>
            <div className="space-y-3">
              {tier.features.map((f) => (
                <div key={f} className="flex items-start gap-2.5">
                  <Check
                    className={`w-4 h-4 shrink-0 mt-0.5 ${
                      tier.popular ? 'text-[#0071e3]' : 'text-[#34c759]'
                    }`}
                    strokeWidth={2.5}
                  />
                  <span className={`text-[14px] leading-snug ${
                    tier.popular ? 'text-white/70' : 'text-[#424245]'
                  }`}>
                    {f}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* What you keep */}
      <section className="text-center">
        <motion.h2 {...fade(0)} className="text-[28px] font-semibold tracking-tight mb-10">
          What you keep.
        </motion.h2>
        <div className="grid grid-cols-3 gap-5 max-w-2xl mx-auto">
          {[
            { label: 'Basic install', revenue: '$300', cost: '$0', profit: '$300' },
            { label: 'Pro install', revenue: '$500', cost: '~$20', profit: '$480' },
            { label: 'Premium install', revenue: '$1,000', cost: '~$60', profit: '$940' },
          ].map((row, i) => (
            <motion.div
              key={row.label}
              {...fade(i * 0.06)}
              className="bg-white rounded-2xl p-6 border border-black/[0.04] text-center"
            >
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#86868b] mb-2">{row.label}</p>
              <p className="text-[28px] font-semibold tracking-tight text-[#34c759]">{row.profit}</p>
              <p className="text-[12px] text-[#86868b] mt-1">profit per install</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
