'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface LoaderSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: 'rectangular' | 'circular' | 'rounded';
}

export const LoaderSkeleton: React.FC<LoaderSkeletonProps> = ({
  className,
  variant = 'rounded',
  ...props
}) => {
  const variantStyles = {
    rectangular: 'rounded-none',
    circular: 'rounded-full',
    rounded: 'rounded-xl',
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-slate-200/70',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: 'easeInOut',
        }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none"
      />
    </div>
  );
};

export default LoaderSkeleton;
