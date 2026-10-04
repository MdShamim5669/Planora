'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glass' | 'interactive' | 'flat';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variants = {
      default:
        'bg-white border border-slate-200/80 rounded-2xl shadow-xs transition-all duration-200',
      elevated:
        'bg-white border border-slate-200/70 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-indigo-500/8 hover:-translate-y-1 transition-all duration-300',
      glass:
        'bg-white/80 backdrop-blur-md border border-white/60 rounded-2xl shadow-lg shadow-slate-200/40 transition-all duration-300',
      interactive:
        'bg-white border border-slate-200/80 rounded-2xl shadow-xs hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-0.5 cursor-pointer transition-all duration-200',
      flat:
        'bg-slate-50/70 border border-slate-200/60 rounded-2xl transition-all duration-200',
    };

    return (
      <div
        ref={ref}
        className={cn('overflow-hidden', variants[variant], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('p-6 pb-3 flex flex-col space-y-1.5', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-lg font-bold text-slate-900 tracking-tight leading-snug',
      className
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-slate-500 leading-relaxed', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-3', className)} {...props} />
));
CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('p-6 pt-0 flex items-center border-t border-slate-100/80 mt-4', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export default Card;
