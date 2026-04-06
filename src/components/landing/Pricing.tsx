import { motion, useReducedMotion } from 'framer-motion';
import { Check } from 'lucide-react';
import { RevealDiv } from './shared/RevealDiv';
import { tiers } from './data';

function PricingCard({ tier, index }: { tier: (typeof tiers)[number]; index: number }) {
  const isPopular = tier.popular;
  const shouldReduceMotion = useReducedMotion();

  return (
    <RevealDiv delay={index * 0.08} className={isPopular ? 'md:-mt-4' : ''}>
      <div className="relative h-full">
        {/* Glow effect for popular card */}
        {isPopular && (
          <div
            className="absolute -inset-px rounded-2xl pointer-events-none"
            style={{
              background: shouldReduceMotion
                ? 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(139,92,246,0.2))'
                : 'conic-gradient(from var(--shimmer-angle, 0deg), transparent, rgba(59,130,246,0.4), transparent, rgba(139,92,246,0.3), transparent)',
              animation: shouldReduceMotion ? 'none' : 'shimmer-rotate 4s linear infinite',
              opacity: 0.6,
            }}
            aria-hidden="true"
          />
        )}

        <motion.div
          whileHover={{ y: -4 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          className="relative rounded-2xl p-6 sm:p-8 h-full"
          style={
            isPopular
              ? {
                  background: 'linear-gradient(180deg, rgba(59,130,246,0.1), rgba(139,92,246,0.05))',
                  border: '1px solid rgba(59,130,246,0.2)',
                  boxShadow: '0 0 40px rgba(59,130,246,0.08)',
                }
              : {
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                }
          }
        >
          {isPopular && (
            <span className="text-[11px] font-bold uppercase tracking-widest mb-4 block text-blue-400">
              Most popular
            </span>
          )}

          <h3 className="text-[13px] font-semibold uppercase tracking-wider text-zinc-400">
            {tier.name}
          </h3>

          <div className="flex items-baseline gap-1 mt-3">
            <span className="text-[42px] sm:text-[48px] font-bold tracking-tight text-white leading-none">
              ${tier.price}
            </span>
          </div>

          <p className="text-sm mt-2 mb-6 sm:mb-8 text-zinc-400">
            {tier.desc}
          </p>

          <a
            href={`https://cal.com/simplytech.ai/${tier.slug}?notes=Interested+in+${tier.name.replace(/\s+/g, '+')}+plan`}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full text-center rounded-full text-sm font-medium mb-6 transition-all duration-200 min-h-[44px] flex items-center justify-center ${
              isPopular
                ? 'bg-white text-black hover:bg-zinc-200'
                : 'border border-white/10 text-white hover:bg-white/[0.05]'
            }`}
          >
            Book Discovery Call
          </a>

          <div className="space-y-3">
            {tier.features.map((f) => (
              <div key={f} className="flex items-start gap-2.5">
                <Check
                  className="w-4 h-4 shrink-0 mt-0.5 text-blue-400"
                  strokeWidth={2.5}
                />
                <span className="text-xs sm:text-[13px] leading-snug text-zinc-400">
                  {f}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </RevealDiv>
  );
}

export function Pricing() {
  return (
    <section
      id="pricing"
      className="py-20 sm:py-28 md:py-32"
      style={{ scrollMarginTop: 72 }}
    >
      <div className="max-w-5xl mx-auto px-5 sm:px-6">
        <RevealDiv className="text-center mb-12 sm:mb-16">
          <h2 className="text-[28px] sm:text-[40px] font-bold tracking-tight text-white mb-3 sm:mb-4 leading-tight">
            Simple, per-computer pricing.
          </h2>
          <p className="text-[15px] sm:text-lg text-zinc-400">
            Most offices of 3-5 people pay $600-$1,500 for a complete AI setup.
          </p>
        </RevealDiv>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {tiers.map((tier, i) => (
            <PricingCard key={tier.name} tier={tier} index={i} />
          ))}
        </div>

        <RevealDiv delay={0.25} className="mt-10 text-center">
          <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl px-6 py-5 max-w-xl mx-auto">
            <p className="text-[13px] sm:text-sm text-zinc-400 leading-relaxed">
              The AI tool requires its own subscription (free tier available, Pro is $20/mo per user). You purchase this directly -- we handle all the setup.
            </p>
          </div>
        </RevealDiv>

      </div>
    </section>
  );
}
