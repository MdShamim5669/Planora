'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

export interface HeroEditorialStaggerProps {
  lines?: string[];
  highlight?: string;
  className?: string;
}

export const HeroEditorialStagger: React.FC<HeroEditorialStaggerProps> = ({
  lines = ['Host and Attend Events', 'with Confidence.'],
  highlight = 'Confidence.',
  className,
}) => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.05,
      },
    },
  };

  const wordVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 24,
      filter: 'blur(6px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.55,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const underlineVariants: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 0.9,
        ease: 'easeInOut',
        delay: 0.5,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn('space-y-1.5 select-none', className)}
    >
      {/* Line 1: Host and Attend Events */}
      <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-3 gap-y-1 leading-tight">
        {['Host', 'and', 'Attend', 'Events'].map((word, wIdx) => (
          <React.Fragment key={wIdx}>
            <motion.span
              variants={wordVariants}
              className="inline-block text-slate-900 tracking-tight"
            >
              {word}
            </motion.span>
            {' '}
          </React.Fragment>
        ))}
      </div>

      {/* Line 2: with Confidence. (with rich animated iridescent shimmer & animated stroke) */}
      <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-3 leading-tight pt-0.5">
        <motion.span
          variants={wordVariants}
          className="inline-block text-slate-800 font-extrabold"
        >
          with
        </motion.span>
        {' '}

        <motion.span
          variants={wordVariants}
          className="relative inline-flex items-center"
        >
          {/* Subtle Ambient Backlight Halo behind Confidence */}
          <span className="absolute -inset-x-2 -inset-y-1 bg-gradient-to-r from-indigo-500/15 via-purple-500/20 to-pink-500/15 blur-xl pointer-events-none -z-10 rounded-full" />

          {/* Shimmering Animated Gradient Word */}
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 via-pink-500 to-indigo-600 bg-clip-text text-transparent animate-text-shimmer font-black tracking-tight drop-shadow-xs">
            Confidence.
          </span>

          {/* Floating Subtle Sparkle Star */}
          <span className="inline-flex ml-2 text-indigo-500 animate-float-subtle">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 fill-indigo-500/20 text-indigo-600" />
          </span>

          {/* Animated Hand-Drawn Fluid Underline */}
          <span className="absolute -bottom-2 left-0 right-7 h-2 pointer-events-none">
            <svg
              viewBox="0 0 200 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full overflow-visible"
            >
              <motion.path
                d="M3 8.5C45 2.5 140 2 197 7.5"
                stroke="url(#gradient-brush)"
                strokeWidth="3.5"
                strokeLinecap="round"
                variants={underlineVariants}
              />
              <defs>
                <linearGradient id="gradient-brush" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4F46E5" />
                  <stop offset="50%" stopColor="#9333EA" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
              </defs>
            </svg>
          </span>
        </motion.span>
      </div>
    </motion.div>
  );
};

export default HeroEditorialStagger;
