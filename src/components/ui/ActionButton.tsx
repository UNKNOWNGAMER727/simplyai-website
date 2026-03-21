import { useState, useCallback, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2 } from 'lucide-react';

type ButtonState = 'idle' | 'loading' | 'success' | 'error';
type Variant = 'primary' | 'success' | 'danger' | 'ghost' | 'accent';
type Size = 'sm' | 'md';

interface ActionButtonProps {
  readonly onClick: () => Promise<void>;
  readonly icon: ReactNode;
  readonly label: string;
  readonly variant: Variant;
  readonly color?: string;
  readonly disabled?: boolean;
  readonly className?: string;
  readonly size?: Size;
}

const variantStyles: Record<Exclude<Variant, 'accent'>, string> = {
  primary: 'bg-[#0071e3] text-white',
  success: 'bg-[#34c759]/20 text-[#34c759]',
  danger: 'bg-red-500/15 text-red-400',
  ghost: 'bg-white/5 text-gray-300 hover:bg-white/10',
};

const sizeStyles: Record<Size, string> = {
  sm: 'text-xs px-3 py-1.5',
  md: 'text-sm px-4 py-2.5',
};

const shakeKeyframes = {
  x: [0, -4, 4, -3, 3, -1, 1, 0],
};

export default function ActionButton({
  onClick,
  icon,
  label,
  variant,
  color,
  disabled = false,
  className = '',
  size = 'sm',
}: ActionButtonProps) {
  const [state, setState] = useState<ButtonState>('idle');

  const handleClick = useCallback(async () => {
    if (state === 'loading' || disabled) return;

    setState('loading');
    try {
      await onClick();
      setState('success');
      setTimeout(() => setState('idle'), 1500);
    } catch {
      setState('error');
      setTimeout(() => setState('idle'), 600);
    }
  }, [onClick, state, disabled]);

  const isDisabled = disabled || state === 'loading';

  const accentStyle =
    variant === 'accent' && color
      ? { backgroundColor: `${color}33`, color }
      : undefined;

  const variantClass =
    variant === 'accent' ? '' : variantStyles[variant];

  const renderContent = () => {
    switch (state) {
      case 'loading':
        return (
          <>
            <Loader2 className="size-3.5 animate-spin" />
            <span>{label}</span>
          </>
        );
      case 'success':
        return (
          <>
            <CheckCircle2 className="size-3.5" />
            <span>{label}</span>
          </>
        );
      default:
        return (
          <>
            {icon}
            <span>{label}</span>
          </>
        );
    }
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      className={`inline-flex items-center gap-1.5 rounded-lg font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variantClass} ${sizeStyles[size]} ${className}`}
      style={accentStyle}
      whileTap={isDisabled ? undefined : { scale: 0.97 }}
      animate={
        state === 'error'
          ? { ...shakeKeyframes, backgroundColor: ['', 'rgba(239,68,68,0.2)', ''] }
          : undefined
      }
      transition={
        state === 'error'
          ? { duration: 0.4, ease: 'easeInOut' }
          : undefined
      }
    >
      {renderContent()}
    </motion.button>
  );
}
