'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gradient' | 'white' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

    const variants = {
      primary:
        'bg-gradient-to-r from-indigo-600 via-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 border border-indigo-500/30',
      secondary:
        'bg-white text-slate-800 border border-slate-200/90 hover:bg-slate-50 shadow-xs hover:border-slate-300 hover:shadow-sm',
      outline:
        'bg-white/60 backdrop-blur-xs text-slate-700 border border-slate-200/90 hover:bg-white hover:text-slate-900 hover:border-slate-300 shadow-xs',
      ghost:
        'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/80',
      danger:
        'bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white shadow-md shadow-rose-500/20 hover:shadow-lg hover:shadow-rose-500/30 hover:-translate-y-0.5 border border-rose-500/30',
      gradient:
        'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 border border-white/20',
      white:
        'bg-white text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800 shadow-xl shadow-slate-950/20 hover:shadow-2xl hover:-translate-y-0.5 border border-white font-bold',
      glass:
        'bg-white/20 hover:bg-white/30 text-white font-bold border-2 border-white/70 hover:border-white shadow-md backdrop-blur-md hover:-translate-y-0.5',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs gap-1.5 tracking-tight',
      md: 'px-4 py-2 text-sm gap-2 tracking-tight',
      lg: 'px-6 py-2.5 text-base gap-2.5 tracking-tight font-semibold',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        ) : (
          leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
        )}
        {children}
        {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
