import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

interface SmartAssistProps {
  readonly icon: ReactNode;
  readonly message: string;
  readonly actionLabel: string;
  readonly onAction: () => void;
  readonly onDismiss: () => void;
}

const animationVariants = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: "auto" },
  exit: { opacity: 0, height: 0 },
};

const animationTransition = { duration: 0.25, ease: "easeInOut" as const };

export function SmartAssist({
  icon,
  message,
  actionLabel,
  onAction,
  onDismiss,
}: SmartAssistProps) {
  return (
    <motion.div
      variants={animationVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={animationTransition}
      style={{
        boxShadow:
          "0 0 20px rgba(59, 130, 246, 0.08), 0 0 40px rgba(147, 51, 234, 0.06)",
      }}
      className="overflow-hidden rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-px"
    >
      <div className="flex items-center gap-3 rounded-[11px] bg-[#1a1a1a] px-4 py-3">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-blue-400">
          {icon}
        </div>

        <p className="min-w-0 flex-1 truncate text-sm text-gray-200">
          {message}
        </p>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onAction}
            className="cursor-pointer text-sm font-medium text-[#0071e3] transition-colors hover:text-[#4da3ff]"
          >
            {actionLabel}
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="cursor-pointer p-1 text-gray-500 transition-colors hover:text-white"
            aria-label="Dismiss"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

interface AssistItem {
  readonly id: string;
  readonly icon: ReactNode;
  readonly message: string;
  readonly actionLabel: string;
  readonly onAction: () => void;
}

interface SmartAssistListProps {
  readonly assists: readonly AssistItem[];
}

export function SmartAssistList({ assists }: SmartAssistListProps) {
  const [dismissedIds, setDismissedIds] = useState<ReadonlySet<string>>(
    new Set(),
  );

  const handleDismiss = (id: string) => {
    setDismissedIds((prev) => new Set([...prev, id]));
  };

  const visibleAssists = assists
    .filter((a) => !dismissedIds.has(a.id))
    .slice(0, 2);

  return (
    <div className="flex flex-col gap-2">
      <AnimatePresence>
        {visibleAssists.map((assist) => (
          <SmartAssist
            key={assist.id}
            icon={assist.icon}
            message={assist.message}
            actionLabel={assist.actionLabel}
            onAction={assist.onAction}
            onDismiss={() => handleDismiss(assist.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
