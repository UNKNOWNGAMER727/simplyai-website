import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 animate-[fadeIn_0.4s_ease-out]">
      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-white/5 shadow-[0_0_24px_rgba(255,255,255,0.06)]">
        <Icon size={48} className="text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-white mt-6">{title}</h3>
      <p className="text-sm text-gray-500 mt-2 max-w-sm text-center leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 bg-[#0071e3] text-white rounded-xl px-5 py-2.5 text-sm font-medium hover:bg-[#0071e3]/80 transition-colors cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
