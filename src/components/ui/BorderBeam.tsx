'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  borderWidth?: number;
  anchor?: number;
  colorFrom?: string;
  colorTo?: string;
  delay?: number;
  reverse?: boolean;
}

export const BorderBeam: React.FC<BorderBeamProps> = ({
  className,
  size = 200,
  duration = 15,
  anchor = 90,
  borderWidth = 1.5,
  colorFrom = '#4F46E5',
  colorTo = '#EC4899',
  delay = 0,
  reverse = false,
}) => {
  return (
    <div
      style={
        {
          '--size': `${size}px`,
          '--duration': `${duration}s`,
          '--anchor': `${anchor}%`,
          '--border-width': `${borderWidth}px`,
          '--color-from': colorFrom,
          '--color-to': colorTo,
          '--delay': `-${delay}s`,
          '--direction': reverse ? 'reverse' : 'normal',
        } as React.CSSProperties
      }
      className={cn(
        'pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent [border-width:var(--border-width)]',
        // Mask styles
        '![mask-clip:padding-box,border-box] ![mask-composite:intersect] [mask:linear-gradient(transparent,transparent),linear-gradient(white,white)]',
        // Pseudo styles
        'after:absolute after:aspect-square after:w-[var(--size)] after:animate-border-beam after:[animation-delay:var(--delay)] after:[animation-direction:var(--direction)] after:[background:linear-gradient(to_left,var(--color-from),var(--color-to),transparent)] after:[offset-anchor:var(--anchor)_50%] after:[offset-path:rect(0_auto_auto_0_round_var(--size))]',
        className
      )}
    />
  );
};

export default BorderBeam;
