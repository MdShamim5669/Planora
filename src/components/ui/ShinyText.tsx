'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface ShinyTextProps {
  /** The text content to display */
  text: string;
  /** Whether the shiny animation is disabled */
  disabled?: boolean;
  /** Speed of shimmer in seconds */
  speed?: number;
  /** Custom CSS classes */
  className?: string;
  /** Shimmer highlight color (default white highlight) */
  shimmerColor?: string;
}

export const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 4,
  className = '',
  shimmerColor = 'rgba(255, 255, 255, 0.85)',
}) => {
  return (
    <span
      className={cn(
        'inline-block bg-clip-text text-transparent transition-all',
        !disabled && 'animate-text-shimmer',
        className
      )}
      style={{
        backgroundImage: `linear-gradient(110deg, currentColor 35%, ${shimmerColor} 50%, currentColor 65%)`,
        backgroundSize: '250% 100%',
        animationDuration: `${speed}s`,
      }}
    >
      {text}
    </span>
  );
};

export default ShinyText;
