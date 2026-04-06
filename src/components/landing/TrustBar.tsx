import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { Check, Clock, Star, MapPin } from 'lucide-react';
import { CountUp } from './shared/CountUp';

const TRUST_ITEMS = [
  { icon: <Check className="w-3.5 h-3.5" strokeWidth={2.5} />, text: 'Professional AI setup' },
  { icon: <Clock className="w-3.5 h-3.5" strokeWidth={2} />, text: 'Done in under an hour' },
  { icon: <Star className="w-3.5 h-3.5" strokeWidth={2} />, text: '5.0 Google rating' },
  { icon: <MapPin className="w-3.5 h-3.5" strokeWidth={2} />, text: 'In-person at your LA office' },
];

interface StatItem {
  readonly value: number;
  readonly prefix?: string;
  readonly suffix: string;
  readonly label: string;
  readonly decimals?: number;
}

const STATS: readonly StatItem[] = [
  { value: 45, suffix: ' min', label: 'Avg. setup time' },
  { value: 5, suffix: '.0', label: 'Google rating', decimals: 0 },
  { value: 100, suffix: '+', label: 'Businesses served' },
  { prefix: '< ', value: 1, suffix: ' hr', label: 'Response time' },
] as const;

export function TrustBar() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      ref={ref}
      className="py-6 border-t border-white/[0.05]"
      style={{ background: 'rgba(9,9,11,0.6)' }}
    >
      <div className="max-w-5xl mx-auto px-5 sm:px-6">
        {/* Trust pills */}
        <div className="flex items-center justify-center gap-x-6 gap-y-3 sm:gap-x-10 flex-wrap">
          <span className="text-[12px] text-zinc-500 font-medium uppercase tracking-[0.08em]">
            Trusted by LA businesses
          </span>
          {TRUST_ITEMS.map((item, i) => (
            <motion.div
              key={item.text}
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex items-center gap-2"
            >
              <span className="text-zinc-500">{item.icon}</span>
              <span className="text-[12px] sm:text-[13px] font-medium text-zinc-400">
                {item.text}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Animated stat counters */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex items-center justify-center gap-8 sm:gap-14 mt-6 flex-wrap"
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-[26px] sm:text-[32px] font-bold tracking-tight text-white leading-none">
                {stat.prefix ?? ''}
                {isInView ? <CountUp to={stat.value} /> : '0'}
                {stat.suffix}
              </p>
              <p className="text-[11px] sm:text-[12px] text-zinc-400 mt-1 font-medium uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
