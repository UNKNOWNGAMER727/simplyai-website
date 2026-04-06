import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { RevealDiv } from './shared/RevealDiv';

const withoutItems = [
  'Google search \u2192 10 tabs open \u2192 30 minutes wasted per question',
  'Typing every email from scratch \u2014 15 minutes each',
  'Research takes 2\u20133 hours with questionable results',
  'Your team stuck on tasks a $20/month tool could do',
];

const withItems = [
  'Ask a question \u2192 accurate answer in 3 seconds',
  '\u201CWrite a follow-up email to Mrs. Johnson\u201D \u2192 done in 10 seconds',
  'Research with cited sources \u2014 30 seconds, not 3 hours',
  'Your team focuses on billable work, not busywork',
];

export function BeforeAfter() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const shouldReduceMotion = useReducedMotion();

  return (
    <section ref={ref} className="py-20 sm:py-28 md:py-32">
      <div className="max-w-5xl mx-auto px-5 sm:px-6">
        <RevealDiv className="text-center mb-12 sm:mb-16">
          <h2 className="text-[28px] sm:text-[40px] font-bold tracking-tight text-white mb-3 leading-tight">
            The difference is night and day.
          </h2>
          <p className="text-[15px] sm:text-lg text-zinc-400 max-w-lg mx-auto">
            See how an AI assistant transforms your team's daily workflow.
          </p>
        </RevealDiv>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-0 relative">
          {/* Center divider with gradient glow */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 z-10">
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to bottom, transparent, rgba(59,130,246,0.4) 50%, transparent)',
              }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full"
              style={{
                background: '#3b82f6',
                boxShadow: '0 0 20px rgba(59,130,246,0.5)',
              }}
            />
          </div>

          {/* WITHOUT AI */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="p-8 sm:p-10 md:pr-12"
            style={{
              background: 'rgba(220,38,38,0.03)',
              borderRadius: '16px 0 0 16px',
              border: '1px solid rgba(220,38,38,0.08)',
              borderRight: 'none',
            }}
          >
            <h3 className="text-[20px] sm:text-[24px] font-bold text-zinc-300 mb-6 uppercase tracking-wide">
              Without AI
            </h3>
            <div className="space-y-4">
              {withoutItems.map((item, i) => (
                <motion.div
                  key={item}
                  initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -16 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.45, delay: 0.2 + i * 0.08 }}
                  className="flex items-start gap-3"
                >
                  <span className="text-red-500/60 shrink-0 mt-0.5 text-sm" aria-hidden="true">
                    {'\u2715'}
                  </span>
                  <span className="text-[14px] text-zinc-400 leading-relaxed">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* WITH AI */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            className="p-8 sm:p-10 md:pl-12"
            style={{
              background: 'rgba(22,163,74,0.03)',
              borderRadius: '0 16px 16px 0',
              border: '1px solid rgba(22,163,74,0.08)',
              borderLeft: 'none',
            }}
          >
            <h3 className="text-[20px] sm:text-[24px] font-bold text-zinc-300 mb-6 uppercase tracking-wide">
              With AI Assistant
            </h3>
            <div className="space-y-4">
              {withItems.map((item, i) => (
                <motion.div
                  key={item}
                  initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 16 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.45, delay: 0.35 + i * 0.08 }}
                  className="flex items-start gap-3"
                >
                  <span className="text-green-500/70 shrink-0 mt-0.5 text-sm" aria-hidden="true">
                    {'\u2713'}
                  </span>
                  <span className="text-[14px] text-zinc-400 leading-relaxed">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Mobile divider */}
          <div className="md:hidden h-px w-full bg-white/[0.05]" />
        </div>
      </div>
    </section>
  );
}
