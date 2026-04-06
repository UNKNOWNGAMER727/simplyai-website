import { useRef, useEffect, useState } from 'react';
import { useInView, animate } from 'framer-motion';

export function CountUp({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const ctrl = animate(0, to, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      onUpdate: (v) => setVal(Math.round(v)),
    });
    return ctrl.stop;
  }, [isInView, to]);

  return <span ref={ref}>{val}{suffix}</span>;
}
