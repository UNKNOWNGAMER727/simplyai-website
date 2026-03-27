import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
});

const tiers = [
  {
    name: 'Starter',
    price: 199,
    desc: 'Per computer. Perplexity Free, fully installed.',
    features: [
      'Perplexity AI installed & configured on each computer',
      'Account setup per user',
      'Privacy & security settings applied',
      'Quick-start tips sheet for each employee',
    ],
  },
  {
    name: 'Pro',
    price: 299,
    desc: 'Per computer. Full Perplexity Pro setup.',
    popular: true,
    features: [
      'Everything in Starter',
      'Perplexity Pro (first month included)',
      'Custom shortcuts & workflow setup',
      'Industry-specific team tips sheet',
      'Priority scheduling',
    ],
  },
  {
    name: 'Phone Add-on',
    price: 99,
    desc: 'Per employee phone. Mobile Perplexity setup.',
    features: [
      'Perplexity installed on employee phones',
      'Mobile app configured & synced to desktop',
      'Same account as computer setup',
      'Add to any Starter or Pro plan',
    ],
  },
];

export function Pricing() {
  return (
    <div className="space-y-16">
      <section className="text-center pt-8">
        <motion.h1 {...fade(0)} className="text-[44px] font-semibold tracking-tight">
          Simple, per-computer pricing.
        </motion.h1>
        <motion.p {...fade(0.06)} className="text-[17px] text-[#86868b] mt-3">
          Most offices of 3–5 people pay $600–$1,500 for a complete AI setup.
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
          Example office jobs.
        </motion.h2>
        <div className="grid grid-cols-3 gap-5 max-w-2xl mx-auto">
          {[
            { label: '3 computers (Starter)', revenue: '$597', cost: '$0', profit: '$597' },
            { label: '5 computers (Pro)', revenue: '$1,495', cost: '~$25', profit: '$1,470' },
            { label: '5 computers + phones', revenue: '$1,990', cost: '~$25', profit: '$1,965' },
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
