import { useRef } from 'react';
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { RevealDiv } from './shared/RevealDiv';
import { STEP_LABELS } from './data';

function TimelineStep({ step, index }: { step: (typeof STEP_LABELS)[number]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative flex gap-6 md:gap-10"
    >
      {/* Timeline node */}
      <div className="hidden md:flex flex-col items-center shrink-0">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center relative"
          style={{
            border: '2px solid rgba(59,130,246,0.4)',
            background: 'rgba(59,130,246,0.08)',
            animation: isInView ? 'glow-pulse 3s ease-in-out infinite' : 'none',
            animationDelay: `${index * 0.5}s`,
          }}
        >
          <span className="text-blue-400 text-lg font-bold">{index + 1}</span>
        </div>
        {/* Connector line */}
        {index < STEP_LABELS.length - 1 && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 + index * 0.15 }}
            className="w-px flex-1 origin-top mt-2"
            style={{
              background: 'linear-gradient(to bottom, rgba(59,130,246,0.3), rgba(59,130,246,0.05))',
              minHeight: 60,
            }}
          />
        )}
      </div>

      {/* Mobile number */}
      <div className="md:hidden flex items-start shrink-0 pt-1">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            border: '2px solid rgba(59,130,246,0.4)',
            background: 'rgba(59,130,246,0.08)',
          }}
        >
          <span className="text-blue-400 text-base font-bold">{index + 1}</span>
        </div>
      </div>

      {/* Content */}
      <div className="pb-12 md:pb-16 pt-1">
        <h3 className="text-white font-bold text-xl sm:text-2xl leading-snug mb-2 tracking-tight">
          {step.headline}
        </h3>
        <p className="text-zinc-400 text-[15px] sm:text-base leading-relaxed max-w-md">
          {step.sub}
        </p>
      </div>
    </motion.div>
  );
}

export function HowItWorks() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const lineHeight = useTransform(scrollYProgress, [0.1, 0.7], ['0%', '100%']);

  return (
    <section
      ref={sectionRef}
      id="how"
      className="py-20 sm:py-28 md:py-32"
      style={{ scrollMarginTop: 72 }}
    >
      <div className="max-w-4xl mx-auto px-5 sm:px-6">
        <RevealDiv className="text-center mb-16 sm:mb-20">
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-zinc-500 mb-4">
            How It Works
          </p>
          <h2 className="text-[28px] sm:text-[40px] font-bold tracking-tight text-white leading-tight">
            Three steps. Under an hour.
          </h2>
        </RevealDiv>

        <div className="relative md:pl-6">
          {/* Animated timeline line on desktop */}
          <div className="hidden md:block absolute left-[29px] top-0 bottom-0 w-px overflow-hidden">
            <motion.div
              className="w-full origin-top"
              style={{
                height: lineHeight,
                background: 'linear-gradient(to bottom, rgba(59,130,246,0.4), rgba(139,92,246,0.2))',
              }}
            />
          </div>

          {STEP_LABELS.map((step, i) => (
            <TimelineStep key={i} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
