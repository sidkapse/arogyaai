import { motion } from 'framer-motion';
import type { Badge } from '../lib/badges';

type Props = {
  badge: Badge;
  earned?: boolean;
  animate?: boolean;
};

export function BadgeChip({ badge, earned = true, animate = false }: Props) {
  return (
    <motion.div
      initial={animate ? { scale: 0, opacity: 0 } : false}
      animate={animate ? { scale: 1, opacity: 1 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 18 }}
      title={badge.description}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium border
        ${earned
          ? 'bg-brand-50 border-brand-200 text-brand-700 dark:bg-brand-900/40 dark:border-brand-700 dark:text-brand-300'
          : 'bg-slate-100 border-slate-200 text-slate-400 dark:bg-slate-800 dark:border-slate-700 grayscale'
        }`}
    >
      <span>{badge.emoji}</span>
      <span>{badge.label}</span>
    </motion.div>
  );
}
