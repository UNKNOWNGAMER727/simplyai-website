import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

export function MagneticButton({ children, className = '', href, target, rel, style }: {
  children: React.ReactNode; className?: string;
  href?: string; target?: string; rel?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18 });
  const sy = useSpring(y, { stiffness: 220, damping: 18 });
  const shouldReduce = useReducedMotion();
  const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

  const onMove = (e: React.MouseEvent) => {
    if (shouldReduce || isTouch) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.28);
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.28);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.a
      ref={ref} href={href} target={target} rel={rel}
      onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ x: sx, y: sy, ...style }} whileTap={{ scale: 0.97 }}
      className={className}
    >
      {children}
    </motion.a>
  );
}
