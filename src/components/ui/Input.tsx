'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-foreground mb-1.5">
            {label}
          </label>
        )}
        <div className="relative rounded-lg shadow-sm">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              'w-full px-3.5 py-2 text-sm bg-white border rounded-lg transition-colors placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-slate-50 disabled:text-muted',
              leftIcon && 'pl-10',
              error ? 'border-destructive focus:ring-destructive' : 'border-border',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
        {!error && helperText && <p className="mt-1 text-xs text-muted">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
