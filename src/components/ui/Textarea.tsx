'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-medium text-foreground mb-1.5">
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          className={cn(
            'w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg transition-colors placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-slate-50 disabled:text-muted min-h-[90px]',
            error ? 'border-destructive focus:ring-destructive' : 'border-border',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
        {!error && helperText && <p className="mt-1 text-xs text-muted">{helperText}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
