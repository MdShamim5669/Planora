'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  description?: string;
  trend?: {
    value: string | number;
    isPositive?: boolean;
    label?: string;
  };
  accentColor?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'purple' | 'blue';
}

const colorMap = {
  indigo: {
    bg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    glow: 'group-hover:shadow-indigo-500/10',
    bar: 'bg-indigo-600',
  },
  emerald: {
    bg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    glow: 'group-hover:shadow-emerald-500/10',
    bar: 'bg-emerald-600',
  },
  amber: {
    bg: 'bg-amber-50 text-amber-600 border-amber-100',
    glow: 'group-hover:shadow-amber-500/10',
    bar: 'bg-amber-600',
  },
  rose: {
    bg: 'bg-rose-50 text-rose-600 border-rose-100',
    glow: 'group-hover:shadow-rose-500/10',
    bar: 'bg-rose-600',
  },
  purple: {
    bg: 'bg-purple-50 text-purple-600 border-purple-100',
    glow: 'group-hover:shadow-purple-500/10',
    bar: 'bg-purple-600',
  },
  blue: {
    bg: 'bg-blue-50 text-blue-600 border-blue-100',
    glow: 'group-hover:shadow-blue-500/10',
    bar: 'bg-blue-600',
  },
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  description,
  trend,
  accentColor = 'indigo',
  className,
  ...props
}) => {
  const scheme = colorMap[accentColor];

  return (
    <div
      className={cn(
        'group relative bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden',
        scheme.glow,
        className
      )}
      {...props}
    >
      {/* Top accent line */}
      <div
        className={cn(
          'absolute top-0 left-0 right-0 h-1 opacity-80 transition-all duration-300 group-hover:h-1.5',
          scheme.bar
        )}
      />

      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {title}
          </p>
          <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {value}
          </p>
        </div>
        {icon && (
          <div
            className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center border shadow-xs transition-transform duration-300 group-hover:scale-110',
              scheme.bg
            )}
          >
            {icon}
          </div>
        )}
      </div>

      {(trend || description) && (
        <div className="mt-4 flex items-center gap-2 text-xs">
          {trend && (
            <span
              className={cn(
                'inline-flex items-center gap-0.5 font-semibold px-1.5 py-0.5 rounded-md',
                trend.isPositive
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-rose-50 text-rose-700'
              )}
            >
              {trend.isPositive ? (
                <ArrowUpRight className="w-3.5 h-3.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5" />
              )}
              {trend.value}
            </span>
          )}
          {trend?.label && (
            <span className="text-slate-500">{trend.label}</span>
          )}
          {description && !trend && (
            <span className="text-slate-500">{description}</span>
          )}
        </div>
      )}
    </div>
  );
};

StatCard.displayName = 'StatCard';
export default StatCard;
