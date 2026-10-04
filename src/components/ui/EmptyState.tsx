'use client';

import React from 'react';
import { CalendarX2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center bg-white border border-dashed border-border rounded-2xl my-4',
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-primary flex items-center justify-center mb-4">
        {icon || <CalendarX2 className="w-7 h-7" />}
      </div>
      <h3 className="text-base font-bold text-foreground">{title}</h3>
      {description && <p className="mt-1.5 text-sm text-muted max-w-sm">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};
