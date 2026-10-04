'use client';

import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onChange,
  className,
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const starSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const current = hoverRating !== null ? hoverRating : rating;

  return (
    <div className={cn('inline-flex items-center gap-1', className)}>
      {Array.from({ length: maxRating }, (_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= current;

        return (
          <button
            type="button"
            key={index}
            disabled={!interactive}
            onClick={() => interactive && onChange && onChange(starValue)}
            onMouseEnter={() => interactive && setHoverRating(starValue)}
            onMouseLeave={() => interactive && setHoverRating(null)}
            className={cn(
              'transition-transform',
              interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'
            )}
            aria-label={`Rate ${starValue} stars`}
          >
            <Star
              className={cn(
                starSizes[size],
                isFilled
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-transparent text-slate-300'
              )}
            />
          </button>
        );
      })}
    </div>
  );
};
