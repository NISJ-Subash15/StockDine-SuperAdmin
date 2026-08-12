import React from 'react';
import { clsx } from 'clsx';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const getColors = (st: string) => {
    const s = st.toLowerCase();
    if (s === 'active' || s === 'approved' || s === 'completed' || s === 'successful' || s === 'published' || s === 'resolved') {
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
    }
    if (s === 'pending' || s === 'under review' || s === 'in progress' || s === 'open') {
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
    }
    if (s === 'rejected' || s === 'suspended' || s === 'cancelled' || s === 'failed' || s === 'flagged' || s === 'removed') {
      return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
    }
    if (s === 'refunded' || s === 'closed' || s === 'inactive') {
      return 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20';
    }
    return 'bg-muted text-muted-foreground border-border';
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border tracking-wide uppercase',
        getColors(status),
        className
      )}
    >
      {status}
    </span>
  );
};
