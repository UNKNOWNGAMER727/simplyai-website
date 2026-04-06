import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

export function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const rX = useMotionValue(0);
  const rY = useMotionValue(0);
  const srX = useSpring(rX, { stiffness: 200, damping: 22 });
  const srY = useSpring(rY, { stiffness: 200, damping: 22 });
  const shouldReduce = useReducedMotion();
  const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduce || isTouch) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    rY.set(((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 6);
    rX.set(-((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * 4);
  };
  const onLeave = () => { rX.set(0); rY.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: srX, rotateY: srY, transformPerspective: 1000, transformStyle: 'preserve-3d' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
