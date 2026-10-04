'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

export type SplitBy = 'characters' | 'words';
export type AnimationVariant = 'slide-up' | 'blur-in' | 'rotate-up' | 'fade';

export interface SplitTextProps {
  /** The text to reveal */
  text: string;
  /** Custom CSS class names applied to the container */
  className?: string;
  /** Custom CSS class names applied to each word wrapper */
  wordClassName?: string;
  /** Custom CSS class names applied to each character/item */
  itemClassName?: string;
  /** HTML tag or component to render as container */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  /** Split by individual characters or whole words */
  splitBy?: SplitBy;
  /** Animation preset to use */
  variant?: AnimationVariant;
  /** Stagger delay between each item in seconds */
  staggerDuration?: number;
  /** Initial delay before animation starts in seconds */
  delay?: number;
  /** Duration of each individual item animation in seconds */
  duration?: number;
  /** Trigger animation on mount ('mount') or when entering viewport ('inView') */
  trigger?: 'inView' | 'mount';
  /** Fraction of element that must be visible to trigger inView (0 to 1) */
  threshold?: number;
  /** Whether animation should only play once when entering viewport */
  once?: boolean;
  /** Callback fired when all items finish animating */
  onAnimationComplete?: () => void;
}

export const SplitText: React.FC<SplitTextProps> = ({
  text,
  className,
  wordClassName,
  itemClassName,
  as: Component = 'div',
  splitBy = 'characters',
  variant = 'slide-up',
  staggerDuration = splitBy === 'characters' ? 0.025 : 0.08,
  delay = 0,
  duration = 0.5,
  trigger = 'inView',
  threshold = 0.2,
  once = true,
  onAnimationComplete,
}) => {
  // Preset animation variants for child items
  const getItemVariants = (): Variants => {
    switch (variant) {
      case 'slide-up':
        return {
          hidden: {
            y: '110%',
            opacity: 0,
          },
          visible: {
            y: '0%',
            opacity: 1,
            transition: {
              duration,
              ease: [0.22, 1, 0.36, 1], // Cubic bezier for snappy, luxurious deceleration
            },
          },
        };
      case 'blur-in':
        return {
          hidden: {
            y: 18,
            opacity: 0,
            filter: 'blur(8px)',
          },
          visible: {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            transition: {
              duration,
              ease: [0.16, 1, 0.3, 1],
            },
          },
        };
      case 'rotate-up':
        return {
          hidden: {
            y: '100%',
            opacity: 0,
            rotateX: 60,
          },
          visible: {
            y: '0%',
            opacity: 1,
            rotateX: 0,
            transition: {
              duration,
              ease: [0.22, 1, 0.36, 1],
            },
          },
        };
      case 'fade':
      default:
        return {
          hidden: {
            opacity: 0,
          },
          visible: {
            opacity: 1,
            transition: {
              duration,
              ease: 'easeOut',
            },
          },
        };
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDuration,
        delayChildren: delay,
      },
    },
  };

  const itemVariants = getItemVariants();

  // Motion container element based on `as` prop
  const MotionComponent = motion[Component as keyof typeof motion] as typeof motion.div;

  // Split words safely to maintain correct line breaks
  const words = text.split(' ');

  return (
    <MotionComponent
      className={cn('inline-block', className)}
      variants={containerVariants}
      initial="hidden"
      {...(trigger === 'inView'
        ? {
            whileInView: 'visible',
            viewport: { once, amount: threshold },
          }
        : {
            animate: 'visible',
          })}
      onAnimationComplete={onAnimationComplete}
      aria-label={text}
    >
      <span aria-hidden="true" className="inline-block">
        {words.map((word, wordIdx) => {
          const isLastWord = wordIdx === words.length - 1;

          if (splitBy === 'words') {
            return (
              <span
                key={wordIdx}
                className={cn('inline-block overflow-hidden align-top', wordClassName)}
              >
                <motion.span
                  variants={itemVariants}
                  className={cn('inline-block', itemClassName)}
                >
                  {word}
                </motion.span>
                {!isLastWord && <span className="inline-block">&nbsp;</span>}
              </span>
            );
          }

          // Character splitting: keeps words unbroken across lines
          const chars = Array.from(word);

          return (
            <span
              key={wordIdx}
              className={cn('inline-block whitespace-nowrap align-top', wordClassName)}
            >
              {chars.map((char, charIdx) => (
                <span
                  key={charIdx}
                  className="inline-block overflow-hidden align-top"
                >
                  <motion.span
                    variants={itemVariants}
                    className={cn('inline-block', itemClassName)}
                  >
                    {char}
                  </motion.span>
                </span>
              ))}
              {!isLastWord && <span className="inline-block">&nbsp;</span>}
            </span>
          );
        })}
      </span>
    </MotionComponent>
  );
};

export default SplitText;
