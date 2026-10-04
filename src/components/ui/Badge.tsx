'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | 'free'
    | 'paid'
    | 'public'
    | 'private'
    | 'status'
    | 'default'
    | 'gradient';
  status?: string;
  amount?: number;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  status,
  amount,
  dot = false,
  children,
  ...props
}) => {
  let badgeStyles = 'bg-slate-100/80 text-slate-700 border-slate-200/80';
  let dotColor = 'bg-slate-400';
  let content = children;

  if (variant === 'free') {
    badgeStyles = 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-xs';
    dotColor = 'bg-emerald-500';
    content = 'Free';
  } else if (variant === 'paid') {
    badgeStyles = 'bg-amber-50 text-amber-700 border-amber-200 shadow-xs';
    dotColor = 'bg-amber-500';
    content = amount !== undefined ? `Paid ${formatCurrency(amount)}` : children || 'Paid';
  } else if (variant === 'public') {
    badgeStyles = 'bg-blue-50 text-blue-700 border-blue-200 shadow-xs';
    dotColor = 'bg-blue-500';
    content = 'Public';
  } else if (variant === 'private') {
    badgeStyles = 'bg-purple-50 text-purple-700 border-purple-200 shadow-xs';
    dotColor = 'bg-purple-500';
    content = 'Private';
  } else if (variant === 'gradient') {
    badgeStyles = 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-transparent shadow-xs';
    dotColor = 'bg-white';
  } else if (variant === 'status' && status) {
    const s = status.toUpperCase();
    if (s === 'APPROVED' || s === 'ACCEPTED' || s === 'SUCCESS') {
      badgeStyles = 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-xs';
      dotColor = 'bg-emerald-500';
    } else if (s === 'PENDING') {
      badgeStyles = 'bg-amber-50 text-amber-700 border-amber-200 shadow-xs';
      dotColor = 'bg-amber-500';
    } else if (s === 'REJECTED' || s === 'DECLINED' || s === 'FAILED') {
      badgeStyles = 'bg-rose-50 text-rose-700 border-rose-200 shadow-xs';
      dotColor = 'bg-rose-500';
    } else if (s === 'BANNED' || s === 'CANCELLED') {
      badgeStyles = 'bg-slate-100 text-slate-700 border-slate-200 shadow-xs';
      dotColor = 'bg-slate-400';
    }
    content = status;
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border tracking-wide uppercase select-none transition-all duration-150',
        badgeStyles,
        className
      )}
      {...props}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          <span
            className={cn(
              'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
              dotColor
            )}
          />
          <span
            className={cn('relative inline-flex rounded-full h-1.5 w-1.5', dotColor)}
          />
        </span>
      )}
      {content}
    </span>
  );
};

Badge.displayName = 'Badge';
export default Badge;
