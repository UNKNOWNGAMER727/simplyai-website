import { useReducedMotion } from 'framer-motion';

export function CtaPulse({ children }: { children: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) return <>{children}</>;
  return (
    <div style={{ filter: 'drop-shadow(0 0 12px rgba(37, 99, 235, 0.2))' }}>
      {children}
    </div>
  );
}
