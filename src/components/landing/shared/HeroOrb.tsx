import { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';

export function HeroOrb() {
  const shouldReduceMotion = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const px = useSpring(rawX, { stiffness: 25, damping: 20 });
  const py = useSpring(rawY, { stiffness: 25, damping: 20 });
  const px2 = useSpring(useTransform(rawX, v => v * 0.55), { stiffness: 20, damping: 20 });
  const py2 = useSpring(useTransform(rawY, v => v * 0.55), { stiffness: 20, damping: 20 });

  useEffect(() => {
    if (shouldReduceMotion || window.matchMedia('(pointer: coarse)').matches) return;
    const move = (e: MouseEvent) => {
      rawX.set((e.clientX / window.innerWidth - 0.5) * 40);
      rawY.set((e.clientY / window.innerHeight - 0.5) * 40);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [rawX, rawY, shouldReduceMotion]);

  if (shouldReduceMotion) {
    return (
      <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-60px] left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[#3b82f6]/30 blur-[100px]" />
      </div>
    );
  }
  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.45, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[-60px] left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[#3b82f6]/35 blur-[100px]"
        style={{ x: px, y: py }}
      />
      <motion.div
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.15, 0.28, 0.15] }}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        className="absolute top-[-20px] right-[20%] w-[380px] h-[380px] rounded-full bg-[#8b5cf6]/25 blur-[90px]"
        style={{ x: px2, y: py2 }}
      />
    </div>
  );
}
